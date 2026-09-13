# 🌱 CarbonTrace (CarbonLink AI) — Industrial CO₂ Marketplace & Network

Enterprise AI-powered industrial carbon capture, utilization, storage (CCUS), and circular CO₂ trading ecosystem. Seamlessly connects carbon capture facilities with sustainable industrial buyers, specialized logistics providers, and regulatory certification.

---

## 🌐 Live Public Demo & Official Links

- **Official Live Application**: **[https://cd9dc5427426a1.lhr.life](https://cd9dc5427426a1.lhr.life)**
- **Public Health API**: [https://cd9dc5427426a1.lhr.life/api/health](https://cd9dc5427426a1.lhr.life/api/health)
- **Marketplace Listings API**: [https://cd9dc5427426a1.lhr.life/api/marketplace/listings](https://cd9dc5427426a1.lhr.life/api/marketplace/listings)
- **GitHub Repository**: [https://github.com/ruchapatel07/hackout26-innovate.git](https://github.com/ruchapatel07/hackout26-innovate.git)

---

## ✨ Key Features

- **🤖 AI Matchmaking Engine**: Intelligent pairing between industrial carbon capture producers and off-takers based on volume, chemical purity, logistics distance, and pricing.
- **🗺️ Live Interactive Geospatial Carbon Grid**: CartoDB Dark Matter powered Leaflet mapping of live verified emitters, consumer sinks, and animated supply corridors with real-time popup telemetry.
- **🚛 Dijkstra Transport Route Optimizer**: Inter-state route planning across 13 industrial transit hubs calculating shortest road distance, transit duration, and fuel cost estimates.
- **🧪 CO₂ Purity Grade Calculator**: Interactive industrial grade evaluation tool for Food Grade (99.9%+), Beverage, Chemical Synthesis, and Concrete Mineralization.
- **🎙️ AI Voice Assistant**: Natural voice interaction assistant for queries, live stats, and marketplace navigation.
- **📊 Real-time Analytics & Dashboard**: Multi-role dashboards for Buyers, Sellers, Transporters, and Administrators.
- **🔐 Secure Authentication**: JWT authentication with Bcrypt password hashing and role-based permissions.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS, Three.js, Framer Motion, Leaflet, Lucide React
- **Backend**: Node.js, Express, AWS DynamoDB (`@aws-sdk/client-dynamodb`), Helmet, CORS
- **Database**: AWS DynamoDB Cloud (ap-south-1) with automatic local fallback mode

---

## 🚀 Quick Start (Local Development)

### Option 1: One-Click Windows Launcher
Double-click `start.bat` in the project root:
```cmd
.\start.bat
```
This automatically boots:
- Backend on **[http://localhost:5005](http://localhost:5005)**
- Frontend on **[http://localhost:5173](http://localhost:5173)**

### Option 2: Unified Node.js Server
```bash
npm run build
npm start
```
Your full web application and REST API endpoints will be accessible together at **[http://localhost:5005](http://localhost:5005)**.

---

## 🔑 Demo Login Accounts

| Role | Email | Password | Admin Key |
| :--- | :--- | :--- | :--- |
| **Seller / Producer** | `producer@carbonlink.com` | `password123` | — |
| **Seller / Steel Smelter** | `titan@carbonlink.com` | `password123` | — |
| **Buyer / BioFuel** | `buyer@carbonlink.com` | `password123` | — |
| **Transporter** | `transporter@carbonlink.com` | `password123` | — |
| **Administrator** | `devjaypatel9@gmail.com` | `Devjay@9=` | `rrrd-dev-hackout26` |
| **Admin (Default)** | `admin@carbonlink.com` | `password123` | `rrrd-dev-hackout26` |

---

## 🌐 Production Deployment

### 1. Render (Recommended for 1-Click Single Service)
A `render.yaml` blueprint is included in the root directory.
- **Build Command**: `npm run deploy:build`
- **Start Command**: `npm start`
- **Health Check Endpoint**: `/api/health`

### 2. Vercel (Frontend UI)
A `vercel.json` is included in `hackout26-innovate/frontend/vercel.json` with SPA routing rules.

### 3. Docker Container
Build and run the entire unified stack in one container:
```bash
docker build -t carbontrace .
docker run -p 5005:5005 carbontrace
```

---

## 📡 Core API Endpoints

- `GET /api/health` - Service health status
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Authenticated session validation
- `GET /api/marketplace/listings` - Verified CO₂ supply listings with filters
- `POST /api/match/evaluate` - AI algorithm match score calculation
- `GET /api/admin/dashboard` - Platform statistics and analytics
- `POST /api/admin/seed` - Reseed demo enterprise records
