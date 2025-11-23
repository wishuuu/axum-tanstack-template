use axum::{Json, Router, response::IntoResponse, routing::get};
use http::StatusCode;
use serde_json::json;

use crate::{extractors::optional_auth_extractor::OptionalAuth, startup::AppState};

pub fn get_router() -> Router<AppState> {
    Router::new().route("/whoami", get(get_session))
}

async fn get_session(OptionalAuth(login_context): OptionalAuth) -> impl IntoResponse {
    if let Some(login_context) = login_context {
        (
            StatusCode::OK,
            Json(json!({ "username": login_context.username })),
        )
            .into_response()
    } else {
        (StatusCode::UNAUTHORIZED, "Not logged").into_response()
    }
}
