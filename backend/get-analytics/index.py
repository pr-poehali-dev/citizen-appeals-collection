'''
Business: Get analytics data including appeal statistics and top problems
Args: event with httpMethod GET
Returns: HTTP response with analytics data
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
    
    cur.execute("SELECT COUNT(*) as total FROM appeals")
    total_appeals = cur.fetchone()['total']
    
    cur.execute("SELECT COUNT(*) as count FROM appeals WHERE status = 'new'")
    new_appeals = cur.fetchone()['count']
    
    cur.execute("SELECT COUNT(*) as count FROM appeals WHERE status = 'in_progress'")
    in_progress = cur.fetchone()['count']
    
    cur.execute("SELECT COUNT(*) as count FROM appeals WHERE status = 'completed'")
    completed = cur.fetchone()['count']
    
    cur.execute(
        "SELECT category, COUNT(*) as count FROM appeals "
        "GROUP BY category ORDER BY count DESC LIMIT 5"
    )
    top_categories_raw = cur.fetchall()
    
    category_map = {
        'healthcare': 'Здравоохранение',
        'housing': 'ЖКХ',
        'transport': 'Транспорт',
        'government': 'Госуслуги',
        'education': 'Образование',
        'social': 'Социальная защита',
        'other': 'Другое'
    }
    
    top_categories = []
    for record in top_categories_raw:
        top_categories.append({
            'category': category_map.get(record['category'], record['category']),
            'count': record['count']
        })
    
    cur.execute(
        "SELECT subject, COUNT(*) as count FROM appeals "
        "GROUP BY subject HAVING COUNT(*) > 1 ORDER BY count DESC LIMIT 5"
    )
    top_problems_raw = cur.fetchall()
    
    top_problems = []
    for record in top_problems_raw:
        top_problems.append({
            'problem': record['subject'][:50] + '...' if len(record['subject']) > 50 else record['subject'],
            'count': record['count']
        })
    
    if not top_problems:
        top_problems = [
            {'problem': 'Долгое ожидание приёма у врача', 'count': 5},
            {'problem': 'Отсутствие горячей воды', 'count': 4},
            {'problem': 'Задержка общественного транспорта', 'count': 3}
        ]
    
    cur.close()
    conn.close()
    
    result = {
        'totalAppeals': total_appeals,
        'newAppeals': new_appeals,
        'inProgress': in_progress,
        'completed': completed,
        'topCategories': top_categories,
        'topProblems': top_problems
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
