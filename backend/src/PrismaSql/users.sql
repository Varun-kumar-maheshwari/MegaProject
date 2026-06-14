CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar VARCHAR(255),
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
)