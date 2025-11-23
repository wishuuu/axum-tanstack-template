use std::{convert::Infallible, future::ready};

use axum::{
    BoxError, Json, Router,
    body::Body,
    error_handling::HandleErrorLayer,
    handler::HandlerWithoutStateExt,
    response::{IntoResponse, Response},
    routing::{get, get_service},
};
use axum_prometheus::PrometheusMetricLayer;
use http::{Request, StatusCode};
use lazy_static::lazy_static;
use serde_json::json;
use sqlx::PgPool;
use tower::{ServiceBuilder, ServiceExt};
use tower_cookies::CookieManagerLayer;
use tower_http::{
    services::{ServeDir, ServeFile},
    trace::TraceLayer,
};
use tower_sessions::{Expiry, MemoryStore, SessionManagerLayer};
use tracing::Level;

use crate::routes;

lazy_static! {
    static ref HTTP_TIMEOUT: u64 = 30;
    static ref EXPONENTIAL_SECONDS: &'static [f64] = &[
        0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0,
    ];
}

#[derive(Clone)]
pub struct AppState {
    pub db_pool: PgPool,
}

pub fn run(db_pool: PgPool) -> Result<Router, Box<dyn std::error::Error>> {
    let session_store = MemoryStore::default();
    let session_layer = SessionManagerLayer::new(session_store)
        .with_secure(false)
        .with_expiry(Expiry::OnSessionEnd);

    let (prometheus_layer, metric_handle) = PrometheusMetricLayer::pair();

    let state = AppState { db_pool };

    let app = Router::new()
        .route("/metrics", get(move || ready(metric_handle.render())))
        .nest("/", routes::get_router())
        .layer(
            ServiceBuilder::new()
                .layer(HandleErrorLayer::new(handle_timeout_error))
                .timeout(std::time::Duration::from_secs(*HTTP_TIMEOUT)),
        )
        .layer(
            TraceLayer::new_for_http().make_span_with(|request: &Request<Body>| {
                let request_id = uuid::Uuid::new_v4();
                tracing::span!(
                    Level::INFO,
                    "request",
                    method = tracing::field::display(request.method()),
                    uri = tracing::field::display(request.uri()),
                    request_id = tracing::field::display(request_id)
                )
            }),
        )
        .layer(session_layer)
        .layer(CookieManagerLayer::new())
        .layer(prometheus_layer)
        .fallback(static_files)
        .with_state(state);

    async fn static_files(req: axum::extract::Request) -> Result<Response, Infallible> {
        let path = req.uri().path();
        let resp = if path.starts_with("/api") {
            StatusCode::NOT_FOUND.into_service().oneshot(req).await
        } else if path.starts_with("/assets") {
            get_service(ServeDir::new("assets")).oneshot(req).await
        } else {
            get_service(ServeFile::new("assets/index.html"))
                .oneshot(req)
                .await
        };

        Ok::<_, Infallible>(resp.into_response())
    }

    async fn handle_timeout_error(err: BoxError) -> (StatusCode, Json<serde_json::Value>) {
        if err.is::<tower::timeout::error::Elapsed>() {
            (
                StatusCode::REQUEST_TIMEOUT,
                Json(json!({
                    "error":
                        format!(
                            "request took longer than the configured {} second timeout",
                            *HTTP_TIMEOUT
                        )
                })),
            )
        } else {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({ "error": format!("unhandled internal error: {}", err) })),
            )
        }
    }
    Ok(app)
}
