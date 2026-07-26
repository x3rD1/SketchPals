# SketchPals

A real-time collaborative drawing application built with React, Node.js, PostgreSQL, Prisma, and Socket.IO.

## Features

- Google OAuth authentication
- Real-time multiplayer canvas collaboration
- Multiple users drawing in the same room
- Persistent canvas storage
- Undo/redo history
- Autosaving
- Image uploads
- Dockerized production deployment

## Tech Stack

### Frontend

- React
- TypeScript
- Vite

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Socket.IO

### Infrastructure

- Docker
- Nginx
- DigitalOcean

## Running locally

Clone the repository:

```bash
git clone https://github.com/x3rD1/SketchPals.git
cd canvas
```

## Development Setup

Create .env.prod file in backend folder:

```bash
cd backend && touch .env
```

Then copy the variables from backend/.env.example:

```bash
cp .env.example .env
```

Go inside backend/.env file and fill in variables with real values

After that run to create a postgres container:

```bash
cd .. && docker compose -f docker-compose.dev.yml up --build
```
