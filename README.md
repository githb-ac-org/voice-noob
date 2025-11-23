# Voice Agent Platform

AI-powered voice agent platform for configuring and deploying custom voice agents with tool calling, multi-provider support, and transparent pricing tiers.

## ✨ Features

- 🎙️ **Voice Agent Management** - Create, configure, and deploy AI voice agents
- 💰 **Transparent Pricing** - Three pricing tiers (Budget, Balanced, Premium)
- 🔐 **Secure Authentication** - JWT-based auth with refresh tokens
- 🛠️ **Integration Hub** - Connect 18+ external services (Salesforce, HubSpot, etc.)
- 📊 **Dashboard** - Comprehensive UI for managing agents and settings
- 🔌 **REST API** - Full-featured backend API with OpenAPI docs

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose (for PostgreSQL + Redis)
- Python 3.12+ with [uv](https://github.com/astral-sh/uv)
- Node.js 20+

### Setup

1. **Start the database services:**
   ```bash
   docker-compose up -d postgres redis
   ```

2. **Setup backend:**
   ```bash
   cd backend
   uv sync                          # Install dependencies
   uv run alembic upgrade head      # Run migrations
   uv run uvicorn app.main:app --reload
   ```
   Backend API: http://localhost:8000
   API Docs: http://localhost:8000/docs

3. **Setup frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend: http://localhost:3000

## 📚 API Documentation

### Authentication Endpoints

#### `POST /auth/register`
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "full_name": "John Doe"
}
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "is_active": true,
  "created_at": "2025-11-23T12:00:00Z",
  "updated_at": "2025-11-23T12:00:00Z"
}
```

#### `POST /auth/login`
Login and receive JWT tokens.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

#### `POST /auth/refresh`
Refresh access token.

**Request:**
```json
{
  "refresh_token": "eyJhbGc..."
}
```

### User Endpoints

#### `GET /users/me`
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "is_active": true,
  "created_at": "2025-11-23T12:00:00Z",
  "updated_at": "2025-11-23T12:00:00Z"
}
```

#### `PATCH /users/me`
Update user profile.

**Request:**
```json
{
  "full_name": "Jane Doe",
  "email": "jane@example.com"
}
```

### Voice Agent Endpoints

#### `POST /agents`
Create a new voice agent.

**Request:**
```json
{
  "name": "Customer Support Agent",
  "description": "Handles customer inquiries",
  "pricing_tier": "balanced",
  "system_prompt": "You are a helpful customer support agent...",
  "llm_config": {
    "provider": "google",
    "model": "gemini-2.5-flash"
  },
  "stt_config": {
    "provider": "google",
    "model": "built-in"
  },
  "tts_config": {
    "provider": "google",
    "model": "built-in"
  },
  "temperature": 0.7,
  "is_active": true
}
```

**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "name": "Customer Support Agent",
  "pricing_tier": "balanced",
  "...": "..."
}
```

#### `GET /agents`
List all voice agents for the current user.

#### `GET /agents/{id}`
Get a specific voice agent.

#### `PATCH /agents/{id}`
Update a voice agent.

#### `DELETE /agents/{id}`
Delete a voice agent.

### Integration Endpoints

#### `POST /integrations`
Save API credentials for external services.

**Request:**
```json
{
  "integration_type": "openai",
  "name": "OpenAI",
  "api_key": "sk-..."
}
```

#### `GET /integrations`
List all saved integrations.

#### `PATCH /integrations/{id}`
Update integration credentials.

#### `DELETE /integrations/{id}`
Delete an integration.

## 🏗️ Tech Stack

### Backend
- **FastAPI** - Modern async Python web framework
- **PostgreSQL 17** - Primary database with full-text search
- **Redis 7** - Caching & rate limiting
- **SQLAlchemy 2.0** - Async ORM with type hints
- **Alembic** - Database migrations
- **JWT** - Secure authentication
- **Pydantic** - Data validation

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with server components
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful component library
- **Zod** - Schema validation

### Voice & AI (Configured)
- **Pipecat** - Voice orchestration framework
- **Deepgram** - Speech-to-text
- **ElevenLabs** - Text-to-speech
- **OpenAI** - GPT-4 & Realtime API
- **Google Gemini** - Multimodal AI
- **Cerebras** - Ultra-fast inference

### Telephony (Configured)
- **Telnyx** - Primary provider
- **Twilio** - Secondary provider

## 📁 Project Structure

```
voice-noob/
├── backend/
│   ├── app/
│   │   ├── api/              # API endpoints
│   │   │   ├── auth.py       # Authentication
│   │   │   ├── users.py      # User management
│   │   │   ├── agents.py     # Agent CRUD
│   │   │   └── integrations.py
│   │   ├── core/             # Core config
│   │   │   ├── config.py     # Settings
│   │   │   ├── security.py   # JWT & password hashing
│   │   │   └── deps.py       # Dependencies
│   │   ├── db/               # Database
│   │   │   ├── session.py    # PostgreSQL connection
│   │   │   └── redis.py      # Redis connection
│   │   ├── models/           # SQLAlchemy models
│   │   │   ├── user.py
│   │   │   ├── voice_agent.py
│   │   │   ├── integration.py
│   │   │   ├── phone_number.py
│   │   │   └── call.py
│   │   ├── schemas/          # Pydantic schemas
│   │   └── main.py           # FastAPI app
│   ├── migrations/           # Alembic migrations
│   └── tests/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/       # Auth pages
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   └── dashboard/    # Dashboard pages
│   │   │       ├── agents/   # Agent management
│   │   │       ├── integrations/
│   │   │       └── settings/
│   │   ├── components/       # React components
│   │   └── lib/
│   │       ├── api-client.ts # API client
│   │       └── pricing-tiers.ts
│   └── public/
└── docker-compose.yml
```

## 🛠️ Development

### Backend Commands

```bash
cd backend

# Install dependencies
uv sync

# Run linting
uv run ruff check app

# Auto-fix linting issues
uv run ruff check app --fix

# Format code
uv run ruff format app

# Type checking
uv run mypy app

# Run migrations
uv run alembic upgrade head

# Create migration
uv run alembic revision --autogenerate -m "description"

# Start dev server
uv run uvicorn app.main:app --reload
```

### Frontend Commands

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

### Quality Checks

Run all quality checks:
```bash
# Backend
cd backend && uv run ruff check app && uv run ruff format --check app

# Frontend
cd frontend && npm run lint && npx tsc --noEmit
```

## 💰 Pricing Tiers

| Tier | Cost/Hour | LLM Provider | Best For |
|------|-----------|--------------|----------|
| **Budget** | $0.86 | Cerebras Llama 3.1 | High-volume operations |
| **Balanced** | $1.35 | Google Gemini 2.5 Flash | Best performance/cost (recommended) |
| **Premium** | $1.92 | OpenAI Realtime API | Lowest latency, best quality |

## 🔐 Environment Variables

### Backend (.env)

```bash
# Database
POSTGRES_SERVER=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=voice_agent_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# API Keys (optional - can be added via UI)
OPENAI_API_KEY=sk-...
DEEPGRAM_API_KEY=...
ELEVENLABS_API_KEY=...
TELNYX_API_KEY=...
```

### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📝 License

MIT

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/)
- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Pipecat](https://github.com/pipecat-ai/pipecat)
