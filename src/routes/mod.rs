use axum::Router;

use crate::startup::AppState;

pub mod auth;
pub mod session;

pub fn get_router() -> Router<AppState> {
    Router::new()
        .nest("/auth", auth::get_router())
        .nest("/session", session::get_router())
}
