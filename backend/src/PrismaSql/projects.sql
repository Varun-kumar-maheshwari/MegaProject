CREATE TABLE projects(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description text,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    created_at timestamptz default current_timestamp
)
