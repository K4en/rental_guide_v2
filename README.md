# Rental Guide

https://rental-guide-v2.web.app

A full-stack web application for creating and sharing digital rental property guides.

Built as a personal learning and portfolio project, focusing on full-stack development, API design, authentication, and deployment.

## Features

- User registration and JWT authentication
- Create and manage rental properties
- Create, edit, and delete property guide sections
- Public property guides accessible without login
- Shareable public links
- QR codes for quick access to guides
- REST API built with FastAPI
- SQLite database
- React frontend

## Tech Stack

**Frontend**
- React
- Vite
- React Router
- JavaScript
- CSS

**Backend**
- Python
- FastAPI
- SQLite
- JWT authentication

**Deployment**
- Google Cloud Run
- Firebase Hosting

## Architecture

The application is split into a React frontend and FastAPI backend.

React Frontend
      │
      │ REST API
      ▼
FastAPI Backend
      │
      ▼
   SQLite

Authenticated users can manage their properties and guides, while public guide pages use a separate API endpoint that does not require authentication.

## Running Locally
**Backend**
- cd backend
- pip install -r requirements.txt
- uvicorn main:app --reload --port 8001

**Frontend**
- cd frontend
- npm install
- npm run dev

The frontend runs on Vite's development server and communicates with the local FastAPI API.

## Project Status

The core application is functional and deployed.

Current focus is on improving the guide builder, presentation, usability, and overall production readiness.

**Future Plans**

- Improved guide editor and formatting
- Better public guide design
- Additional property management features
- More flexible sharing and access controls
- Further validation and production hardening