CREATE TABLE notes(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(225) NOT NULL,
    content TEXT NOT NULL,
    created_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT current_timestamp
)