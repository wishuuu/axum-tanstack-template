use axum::{
    async_trait,
    extract::FromRequestParts,
    response::{IntoResponse, Response},
};
use http::{StatusCode, request::Parts};

use tower_sessions::{Session, session::Error};

use crate::domain::{login_context::LoginContext, utils::SESSION_DATA_KEY};

pub struct RequiredAuth(pub LoginContext);

#[async_trait]
impl<B> FromRequestParts<B> for RequiredAuth
where
    B: Send + Sync,
{
    type Rejection = Response;

    async fn from_request_parts(parts: &mut Parts, state: &B) -> Result<Self, Self::Rejection> {
        let session = Session::from_request_parts(parts, state)
            .await
            .map_err(|_| ());

        let Ok(session) = session else {
            return Err(StatusCode::INTERNAL_SERVER_ERROR.into_response());
        };

        let session_login_context: Result<Option<LoginContext>, Error> =
            session.get(SESSION_DATA_KEY).await;

        let Ok(login_context) = session_login_context else {
            return Err(StatusCode::INTERNAL_SERVER_ERROR.into_response());
        };

        let Some(login_context) = login_context else {
            return Err(StatusCode::UNAUTHORIZED.into_response());
        };

        return Ok(RequiredAuth(login_context));
    }
}
