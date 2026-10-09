# Project Setup TODO

## 1. Scaffold the web application

- [ ] Create a Next.js application in `apps/web`.
- [ ] Use TypeScript and the project's chosen package manager.
- [ ] Add a basic home page and verify the app runs locally.

## 2. Add Docker Compose

- [ ] Add a `compose.yaml` with web and MySQL services.
- [ ] Configure MySQL credentials through environment variables.
- [ ] Add a persistent volume for MySQL data.
- [ ] Add a MySQL health check and make the web service wait for the database.
- [ ] Add a Dockerfile and development-friendly configuration for the web app.
- [ ] Verify the app and database start with one Docker Compose command.

## 3. Configure local environment

- [ ] Add an `.env.example` documenting required environment variables.
- [ ] Ensure local environment files containing secrets are ignored by Git.
- [ ] Document setup, startup, shutdown, and common troubleshooting commands in the README.

## 4. Connect the application to MySQL

- [ ] Select a database access library or ORM.
- [ ] Configure the application to connect to MySQL using environment variables.
- [ ] Add an initial migration and a minimal example table.
- [ ] Verify migrations run and the app can read from the database.

## 5. Validate the setup

- [ ] Test a fresh setup from the documented instructions.
- [ ] Confirm MySQL data persists after stopping and restarting the containers.
- [ ] Run the project's lint, type-check, and test commands.
- [ ] Record any remaining setup requirements or limitations in the README.

## Later, if needed

- [ ] Reassess whether a separate FastAPI service is needed.
- [ ] Add the API service to Docker Compose only when there is a concrete use case.
