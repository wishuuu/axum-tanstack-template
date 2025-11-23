use sqlx::PgPool;
use uuid::Uuid;

use crate::domain::user::User;

#[derive(Clone)]
pub struct UserRepository {
    db_pool: PgPool,
}

impl UserRepository {
    pub fn new(db_pool: PgPool) -> Self {
        Self { db_pool }
    }

    pub async fn get_by_id(&self, id: Uuid) -> sqlx::Result<Option<User>> {
        sqlx::query_as!(
            User,
            r#"
            SELECT 
                id, 
                username, 
                hashed_password
            FROM users
            WHERE id = $1
            "#,
            id
        )
        .fetch_optional(&self.db_pool)
        .await
    }

    pub async fn get_by_username(&self, username: &str) -> sqlx::Result<Option<User>> {
        sqlx::query_as!(
            User,
            r#"
            SELECT 
                id, 
                username, 
                hashed_password
            FROM users
            WHERE username = $1
            "#,
            username
        )
        .fetch_optional(&self.db_pool)
        .await
    }
}
