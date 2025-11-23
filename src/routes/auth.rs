use axum::{Json, Router, extract::State, response::IntoResponse, routing::post};
use http::StatusCode;
use secrecy::Secret;
use serde::Deserialize;
use tower_sessions::Session;

use crate::{
    repositories::user::UserRepository, startup::AppState,
    utils::password_hashing_service::PasswordHashingService,
};

pub fn get_router() -> Router<AppState> {
    Router::new().route("/login", post(login_post))
}

#[derive(Debug, Deserialize)]
struct LoginData {
    username: String,
    password: Secret<String>,
}

async fn login_post(
    session: Session,
    State(state): State<AppState>,
    Json(payload): Json<LoginData>,
) -> impl IntoResponse {
    let user_repo = UserRepository::new(state.db_pool.clone());
    let user = user_repo.get_by_username(&payload.username).await;
    let user = match user {
        Ok(Some(user)) => Ok(user),
        Ok(None) => Err((StatusCode::UNAUTHORIZED, "Login failed").into_response()),
        Err(_) => Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            "Server error, try again later",
        )
            .into_response()),
    }?;

    let password_hashing_service = PasswordHashingService::default();
    if password_hashing_service.validate_password(&user, &payload.password) {
        session.insert("user_id", user.id).await.unwrap();
        Ok(StatusCode::OK.into_response())
    } else {
        Err((StatusCode::UNAUTHORIZED, "Nieprawidłowy login lub hasło").into_response())
    }
}
