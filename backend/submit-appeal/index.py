'''
Business: Accept new citizen appeals and store them in database
Args: event with httpMethod, body containing appeal data
Returns: HTTP response with appeal number
'''

import json
import os
from datetime import datetime
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def generate_appeal_number() -> str:
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    return f'AP-{timestamp}'

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    
    full_name = body_data.get('fullName', '')
    email = body_data.get('email', '')
    phone = body_data.get('phone', '')
    category = body_data.get('category', '')
    subject = body_data.get('subject', '')
    description = body_data.get('description', '')
    
    if not all([full_name, email, phone, category, subject, description]):
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'All fields are required'}),
            'isBase64Encoded': False
        }
    
    appeal_number = generate_appeal_number()
    database_url = os.environ.get('DATABASE_URL')
    
    conn = psycopg2.connect(database_url)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute(
        "INSERT INTO appeals (appeal_number, full_name, email, phone, category, subject, description, status, priority) "
        "VALUES (%s, %s, %s, %s, %s, %s, %s, 'new', 'medium') RETURNING id",
        (appeal_number, full_name, email, phone, category, subject, description)
    )
    
    appeal_id = cur.fetchone()['id']
    
    cur.execute(
        "INSERT INTO appeal_history (appeal_id, status, comment) VALUES (%s, 'new', 'Обращение зарегистрировано')",
        (appeal_id,)
    )
    
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'success': True,
            'appealNumber': appeal_number,
            'message': 'Обращение успешно зарегистрировано'
        }),
        'isBase64Encoded': False
    }
