## Database Migrations

This directory contains database migrations for the CraftCV application.

### Creating a New Migration

To create a new migration:

```bash
alembic revision --autogenerate -m "Description of changes"
```

### Applying Migrations

To apply all pending migrations:

```bash
alembic upgrade head
```

### Rolling Back Migrations

To roll back the last migration:

```bash
alembic downgrade -1
```

To roll back to a specific migration:

```bash
alembic downgrade <revision_id>
```

### Viewing Migration History

To see the current migration version:

```bash
alembic current
```

To see migration history:

```bash
alembic history
```

### Initial Setup

The initial database setup is handled by `init_db.py` in the root directory. This script:

1. Creates all tables using SQLAlchemy models
2. Stamps the database with the current migration version

To initialize the database:

```bash
python init_db.py
```