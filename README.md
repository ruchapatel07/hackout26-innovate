# 🌱 CarbonConnect

CarbonConnect is an AI-powered carbon credit & ESG offset marketplace platform. It seamlessly connects carbon offset producers with corporate consumers through intelligent AI matching, price forecasting, real-time analytics, and interactive 3D visualizers.

---

## ✨ Features

- **🤖 AI Matchmaking Engine**: Intelligent matchmaking between carbon credit producers and enterprise buyers based on volume, pricing, and project type.
- **📊 Price Predictor**: AI-driven carbon price forecasting and ESG impact analysis.
- **📈 Interactive Analytics & Maps**: Real-time tracking of carbon credits, market ticker, and geographical project mapping.
- **🌐 Dynamic 3D Visualizations**: Powered by Three.js and Framer Motion for interactive data representation.
- **🔐 Secure Authentication & Role Management**: Multi-role support for Producers, Consumers, Logistics Providers, and Admins.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 18 + Vite
- **Styling**: TailwindCSS + PostCSS
- **3D Graphics & Animations**: Three.js, Framer Motion
- **Maps & Charts**: Leaflet, React-Leaflet, Recharts
- **Icons**: Lucide React

### **Backend**
- **Runtime**: Node.js + Express
- **Database**: AWS DynamoDB (`@aws-sdk/client-dynamodb`)
- **Authentication**: JSON Web Tokens (JWT) + Bcrypt
- **Security**: Helmet, CORS, Express Rate Limiting

---

## 📁 Project Structure

```text
carbon-connect/
├── backend/                  # Node.js + Express REST API
│   ├── config/               # DB & environment configuration
│   ├── controllers/          # Business logic handlers
│   ├── middleware/           # Auth & validation middleware
│   ├── models/               # DynamoDB table definitions
│   ├── routes/               # API endpoint definitions
│   ├── utils/                # AI algorithms, seed script & helpers
│   ├── server.js             # Express server entry point
│   └── .env.example          # Sample environment variables
│
├── frontend/                 # React + Vite Frontend UI
│   ├── public/               # Static assets & icons
│   ├── src/
│   │   ├── components/       # Reusable UI components & 3D canvases
│   │   ├── context/          # React Context (Auth, Toast, Notifications)
│   │   ├── pages/            # Page layouts & Dashboard sections
│   │   ├── App.jsx           # Root Application component
│   │   └── main.jsx          # Entry point
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   └── vite.config.js        # Vite configuration
│
└── README.md                 # Project documentation
```

---

## 🚀 Getting Started

### **Prerequisites**
Ensure you have the following installed on your machine:
- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher)

---

### **1. Clone the Repository**
```bash
git clone https://github.com/ritamangaliya/carbon-connect.git
cd carbon-connect
```

---

### **2. Setup & Run Backend**

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file:
   ```bash
   cp .env.example .env
   ```

4. *(Optional)* Seed initial sample data into the database:
   ```bash
   npm run seed
   ```

5. Start the backend server:
   ```bash
   npm start
   ```
   The backend API server will run on `http://localhost:5005`.

---

### **3. Setup & Run Frontend**

1. Open a new terminal tab and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

---

## ⚙️ Environment Variables

The backend relies on the following environment variables defined in `backend/.env`:

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `5005` | Backend server port |
| `NODE_ENV` | `development` | Application environment |
| `JWT_SECRET` | *(custom string)* | Secret key for signing JWT tokens |
| `JWT_EXPIRES_IN` | `7d` | Expiration time for JWT tokens |
| `AWS_REGION` | `us-east-1` | AWS Region for DynamoDB |
| `AWS_ACCESS_KEY_ID` | *(your_key)* | AWS Access Key ID |
| `AWS_SECRET_ACCESS_KEY` | *(your_secret)* | AWS Secret Access Key |
| `DYNAMODB_PREFIX` | `CarbonLink_` | Prefix for DynamoDB tables |

---

## 📜 Available Scripts

### **Backend (`/backend`)**
- `npm start` - Starts the Express server (`node server.js`).
- `npm run seed` - Populates the database with initial sample data.

### **Frontend (`/frontend`)**
- `npm run dev` - Launches the Vite development server with HMR.
- `npm run build` - Builds the application for production deployment.
- `npm run preview` - Locally previews the production build.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
