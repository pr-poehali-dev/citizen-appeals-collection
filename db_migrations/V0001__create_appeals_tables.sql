CREATE TABLE IF NOT EXISTS appeals (
    id SERIAL PRIMARY KEY,
    appeal_number VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed', 'rejected')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    assigned_to VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS appeal_history (
    id SERIAL PRIMARY KEY,
    appeal_id INTEGER REFERENCES appeals(id),
    status VARCHAR(20) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_appeals_status ON appeals(status);
CREATE INDEX IF NOT EXISTS idx_appeals_category ON appeals(category);
CREATE INDEX IF NOT EXISTS idx_appeals_created_at ON appeals(created_at);
CREATE INDEX IF NOT EXISTS idx_appeal_history_appeal_id ON appeal_history(appeal_id);