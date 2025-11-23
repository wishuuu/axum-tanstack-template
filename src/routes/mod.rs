use axum::{ Router, routing::get };

use crate::startup::AppState;

pub mod auth;
pub mod session;

pub fn get_router() -> Router<AppState> {
    Router::new()
        .route("/ping", get(|| async { "pong" }))
        .nest("/auth", auth::get_router())
        .nest("/session", session::get_router())
}
