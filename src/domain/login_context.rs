use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::domain::entities::user::User;

#[derive(Debug, Serialize, Clone, Deserialize)]
pub struct LoginContext {
    pub id: Uuid,
    pub username: String,
}

impl From<User> for LoginContext {
    fn from(user: User) -> Self {
        LoginContext {
            id: user.id,
            username: user.username,
        }
    }
}
