use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;

#[derive(TS)]
#[ts(export)]
#[ts(export_to = "sessionData.ts")]
#[derive(Serialize, Deserialize, Debug)]
pub struct LoggedSessionDto {
    pub id: Uuid,
    pub username: String,
}
