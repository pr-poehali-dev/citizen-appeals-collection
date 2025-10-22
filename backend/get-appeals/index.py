'''
Business: Get list of all appeals for employee dashboard
Args: event with httpMethod GET
Returns: HTTP response with list of appeals
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
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute(
        "SELECT id, appeal_number, status, category, subject, full_name, created_at, priority "
        "FROM appeals ORDER BY created_at DESC LIMIT 100"
    )
    
    appeals_records = cur.fetchall()
    
    cur.close()
    conn.close()
    
    appeals = []
    for record in appeals_records:
        appeals.append({
            'id': str(record['id']),
            'number': record['appeal_number'],
            'status': record['status'],
            'category': record['category'],
            'subject': record['subject'],
            'fullName': record['full_name'],
            'createdAt': record['created_at'].strftime('%d.%m.%Y %H:%M'),
            'priority': record['priority']
        })
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'appeals': appeals}, ensure_ascii=False),
        'isBase64Encoded': False
    }
