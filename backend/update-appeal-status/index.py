'''
Business: Update appeal status by employee
Args: event with httpMethod POST, body containing appealId and new status
Returns: HTTP response with success confirmation
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
    appeal_id = body_data.get('appealId')
    new_status = body_data.get('status')
    
    if not appeal_id or not new_status:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Appeal ID and status are required'}),
            'isBase64Encoded': False
        }
    
    valid_statuses = ['new', 'in_progress', 'completed', 'rejected']
    if new_status not in valid_statuses:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Invalid status'}),
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute(
        "UPDATE appeals SET status = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s",
        (new_status, int(appeal_id))
    )
    
    status_labels = {
        'new': 'Новое',
        'in_progress': 'В работе',
        'completed': 'Выполнено',
        'rejected': 'Отклонено'
    }
    
    cur.execute(
        "INSERT INTO appeal_history (appeal_id, status, comment) VALUES (%s, %s, %s)",
        (int(appeal_id), new_status, f'Статус изменён на: {status_labels[new_status]}')
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
            'message': 'Status updated successfully'
        }),
        'isBase64Encoded': False
    }
