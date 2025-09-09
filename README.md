# Suhuf - AI Note-Taking App

⚠️ **This is a rough development version with known bugs and missing features.**

## System Requirements (Minimum)
- Node.js 16+
- Docker 20+
- 2GB RAM
- 1GB free disk space

## Completed Features
- ✅ User authentication (signup/login/logout)
- ✅ AI chat with Google Gemini
- ✅ Conversation persistence
- ✅ Basic UI components

## Architecture Overview
```
Next.js 15 + TypeScript
├── Frontend: Next + Shadcn UI + RHF + TailwindCSS
├── Backend: API routes + MikroORM + Light version of DDD
├── Database: PostgreSQL
├── AI: LangChain + Google Gemini
└── Auth: auth.js
```

## Quick Start with Docker

1. **Clone and setup:**
```bash
git clone <repo>
cd suhuf
```

2. **Create `.env.local`:**
```bash
# Database
DB_NAME=ai_notes
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=db
DB_PORT=5432

# NextAuth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Google Gemini
GOOGLE_API_KEY=API_KEY
```

3. **Run:**
```bash
docker-compose up -d
```

4. **Access:** http://localhost:3000

**Test**
- signup with name, email, password
- login with email, password
- create conversation (might need to refresh page)
- open conversation
- chat with AI
- get conversations history
- logout

## Known Issues
- Message display bugs in conversations
- User ID mapping issues
- Incomplete error handling
- Missing features: notes management & some bug fixes and enhancements