CREATE TYPE roles AS ENUM ('admin', 'project_admin', 'member');

CREATE TABLE project_members(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    project UUID REFERENCES projects(id) NOT NULL,
    role roles NOT NULL DEFAULT 'member',
    create_at TIMESTAMPTZ DEFAULT current_timestamp
)