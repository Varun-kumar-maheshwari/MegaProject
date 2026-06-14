CREATE TYPE allowed_status AS ENUM ('to-do', 'in_progress', 'done');

CREATE TABLE tasks(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    project UUID REFERENCES projects(id),
    description text,
    assigned_by UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    assigned_to UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    status allowed_status NOT NULL DEFAULT 'to-do',
    created_at timestamptz DEFAULT current_timestamp
)