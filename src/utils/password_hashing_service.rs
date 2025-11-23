use argon2::{
    Argon2,
    password_hash::{PasswordHash, PasswordHasher, PasswordVerifier, Result, SaltString},
};
use rand::rngs::OsRng;
use secrecy::{ExposeSecret, Secret};

use crate::domain::user::User;

#[derive(Default)]
pub struct PasswordHashingService {}

impl PasswordHashingService {
    pub fn hash_password(&self, password: &Secret<String>) -> Result<Secret<String>> {
        let password = password.expose_secret();
        let salt = SaltString::generate(&mut OsRng);

        let argon2 = Argon2::default();

        let password_hash = argon2
            .hash_password(password.as_bytes(), &salt)?
            .to_string();

        Ok(Secret::new(password_hash))
    }

    pub fn validate_password(&self, user: &User, password: &Secret<String>) -> bool {
        Argon2::default()
            .verify_password(
                password.expose_secret().as_bytes(),
                &PasswordHash::new(user.hashed_password.expose_secret()).unwrap(),
            )
            .is_ok()
    }
}

#[cfg(test)]
mod tests {
    use fake::{Fake, Faker};
    use passwords::PasswordGenerator;
    use secrecy::Secret;

    use crate::domain::user::User;

    #[tokio::test]
    async fn hash_and_verify_random_password() {
        let pass = PasswordGenerator::new()
            .generate_one()
            .expect("Failed to generate password");
        let password = Secret::new(pass);

        let password_hashing_service = super::PasswordHashingService::default();

        let hashed = password_hashing_service
            .hash_password(&password)
            .expect("Failed to hash password");

        let user = User {
            id: uuid::Uuid::new_v4(),
            username: Faker.fake(),
            hashed_password: hashed,
        };

        assert!(password_hashing_service.validate_password(&user, &password));
    }
}
