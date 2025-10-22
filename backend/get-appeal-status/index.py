'''
Business: Get appeal status and history by appeal number
Args: event with httpMethod GET, queryStringParameters containing appeal number
Returns: HTTP response with appeal details and history
'''

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    params = event.get('queryStringParameters', {}) or {}
    appeal_number = params.get('number', '')
    
    if not appeal_number:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Appeal number is required'}),
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute(
        "SELECT appeal_number, status, category, subject, created_at, updated_at, assigned_to "
        "FROM appeals WHERE appeal_number = %s",
        (appeal_number,)
    )
    
    appeal = cur.fetchone()
    
    if not appeal:
        cur.close()
        conn.close()
        return {
            'statusCode': 404,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Appeal not found'}),
            'isBase64Encoded': False
        }
    
    cur.execute(
        "SELECT a.id FROM appeals a WHERE a.appeal_number = %s",
        (appeal_number,)
    )
    appeal_id = cur.fetchone()['id']
    
    cur.execute(
        "SELECT status, comment, created_at FROM appeal_history WHERE appeal_id = %s ORDER BY created_at DESC",
        (appeal_id,)
    )
    
    history_records = cur.fetchall()
    
    cur.close()
    conn.close()
    
    history = []
    for record in history_records:
        history.append({
            'date': record['created_at'].strftime('%d.%m.%Y %H:%M'),
            'status': record['status'],
            'comment': record['comment'] or ''
        })
    
    category_map = {
        'healthcare': 'Здравоохранение',
        'housing': 'ЖКХ',
        'transport': 'Транспорт',
        'government': 'Госуслуги',
        'education': 'Образование',
        'social': 'Социальная защита',
        'other': 'Другое'
    }
    
    result = {
        'number': appeal['appeal_number'],
        'status': appeal['status'],
        'category': category_map.get(appeal['category'], appeal['category']),
        'subject': appeal['subject'],
        'createdAt': appeal['created_at'].strftime('%d.%m.%Y %H:%M'),
        'updatedAt': appeal['updated_at'].strftime('%d.%m.%Y %H:%M'),
        'assignedTo': appeal['assigned_to'],
        'history': history
    }
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(result, ensure_ascii=False),
        'isBase64Encoded': False
    }
