-- Add migration script here
CREATE TABLE users(
  id uuid NOT NULL,
  PRIMARY KEY (id),
  username TEXT NOT NULL UNIQUE,
  hashed_password TEXT NOT NULL
);
