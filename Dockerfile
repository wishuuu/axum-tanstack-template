# Builder stage
FROM lukemathwalker/cargo-chef:latest-rust-1.90.0 AS chef

WORKDIR /app
RUN apt update && apt install lld clang -y

FROM chef as planner
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

FROM chef as builder
COPY --from=planner /app/recipe.json recipe.json
RUN cargo chef cook --release --recipe-path recipe.json
COPY . .
ENV SQLX_OFFLINE=true

RUN cargo build --release --bin {{project_name}} 

FROM node:25-alpine3.19 as client-builder
WORKDIR /app
COPY . .
WORKDIR /app/client
RUN --mount=type=cache,target=/app/node_modules \
  npm install --legacy-peer-deps
RUN npm run build

# Runtime stage
FROM debian:bookworm-slim as runtime
WORKDIR /app

RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && apt-get autoremove -y \
  && apt-get clean -y \
  && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/release/{{project_name}} {{project_name}} 
COPY --from=client-builder /app/client/dist assets 
COPY configuration configuration
ENV APP_ENVIRONMENT=production
ENTRYPOINT ["./{{project_name}}]
