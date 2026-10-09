# Tindahan

Tindahan is a point-of-sale and store-management application for sari-sari store owners. It is intended to help owners manage day-to-day sales, inventory, customer orders, and customer loans in one place.

> **Project status:** This repository is currently at the planning stage. The features and architecture below describe the intended direction; they are not yet implemented.

## Planned features

- **Sales tracking** — record and review store sales.
- **Inventory management** — monitor stock levels and product items.
- **Customer orders** — keep track of customer orders.
- **Customer loan tracking** — record customer balances and payments.
- **OR/CR receipt entry** — record receipt details.
- **Barcode scanning** — find or add products using a barcode scanner.
- **Pricing and profit tracking** — manage product prices and understand margins.

## Planned technology

- **Web application:** Next.js (React)
- **Database:** MySQL
- **Development environment:** Docker Compose, to make setup consistent across machines
- **API:** Next.js Route Handlers to start; FastAPI (Python) if the backend needs a separate service

Next.js can handle app-specific endpoints and server-side operations while the application is small. FastAPI can be introduced for a more substantial backend, Python-based processing or integrations, or an API that needs to serve clients beyond the web app. If both are used, Next.js can act as the web-facing backend-for-frontend and call FastAPI for core business operations.

Docker Compose is intended to run the web application and MySQL together, with persistent database storage. The optional FastAPI service can be added to the Compose setup if and when the project needs it.

## Suggested project layout

```text
tindahan/
├── compose.yaml
├── apps/
│   ├── web/                 # Next.js application
│   │   ├── app/             # Pages, layouts, and route handlers
│   │   ├── components/      # Shared UI components
│   │   └── lib/             # API client and frontend utilities
│   └── api/                 # Optional FastAPI service
│       ├── app/
│       │   ├── api/         # HTTP routes
│       │   ├── core/        # Configuration and shared setup
│       │   ├── db/          # Database connection and setup
│       │   ├── models/      # Database models
│       │   ├── schemas/     # Request and response schemas
│       │   └── services/    # Business logic
│       └── tests/
└── README.md
```

The FastAPI service is optional; it does not need to be created until the project has a clear need for it.

## Development

The repository is still at the planning stage, so the Docker Compose configuration and startup commands will be added alongside the application scaffold and dependency configuration. The goal is to make starting the development environment a single command.
