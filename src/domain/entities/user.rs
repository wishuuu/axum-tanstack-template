use secrecy::Secret;
use uuid::Uuid;

#[derive(serde::Deserialize)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub hashed_password: Secret<String>,
}
