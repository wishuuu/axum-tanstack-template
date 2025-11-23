use axum::serve;
use axum_tanstack_generate::{
    configuration::get_configuration,
    startup::run,
    telemetry::{get_subscriber, init_subscriber},
};
use secrecy::ExposeSecret;
use sqlx::PgPool;
use tokio::net::TcpListener;

#[tokio::main]
pub async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let subscriber = get_subscriber("sms_service".into(), "info".into(), std::io::stdout);
    init_subscriber(subscriber);

    let configuration = get_configuration().expect("Failed to read configuration.");

    let pool = PgPool::connect(&configuration.database.connection_string().expose_secret())
        .await
        .expect("Failed to connect to database");

    // Migrate the database
    sqlx::migrate!("./migrations").run(&pool).await.unwrap();

    let address = configuration.application.address();
    let listener = TcpListener::bind(address).await?;
    let router = run(pool).expect("Failed to build axum router");
    serve(listener, router)
        .await
        .expect("Failed to serve application");
    Ok(())
}
