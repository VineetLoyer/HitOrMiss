# Spotify Track Predictor (HitOrMiss)

Prediction on Spotify Track Popularity Dataset for MLZoomcamp Midterm Project 2025

A web application that predicts whether a Spotify track will be a hit or miss based on audio features, with exploratory data analysis and similar track recommendations.

## Project Structure

```
.
├── frontend/          # React + TypeScript + Vite frontend
├── backend/           # Python + Flask backend
└── .kiro/specs/       # Project specifications and requirements
```

## Quick Start

### Option 1: Docker (Recommended) 🐳

The easiest way to run the entire application:

1. Make sure you have [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/) installed

2. Clone the repository:
```bash
git clone https://github.com/VineetLoyer/HitOrMiss.git
cd HitOrMiss
```

3. Start the application:
```bash
docker-compose up --build
```

4. Access the application:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:5000

5. To stop the application:
```bash
docker-compose down
```

### Option 2: Manual Setup

#### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Unix/MacOS
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the backend server:
```bash
python run.py
```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Features

- **EDA Tab**: Explore the Spotify dataset with interactive visualizations
- **Prediction Tab**: Input track features and get hit/miss predictions
- **Similar Tracks**: Discover tracks similar to your input
- **Responsive Design**: Clean, modern UI built with Tailwind CSS

## Technologies

### Frontend
- React 18 with TypeScript
- Vite
- Tailwind CSS
- Chart.js
- Axios

### Backend
- Python 3.9+
- Flask
- scikit-learn
- pandas
- numpy

## Deployment

This project is deployed on:
- **Frontend**: Vercel
- **Backend**: Railway

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## Testing

### Backend Tests
```bash
cd backend
pytest tests/ -v
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Docker Commands

### Build and Run
```bash
# Build and start all services
docker-compose up --build

# Run in detached mode (background)
docker-compose up -d

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Stop and Clean Up
```bash
# Stop services
docker-compose stop

# Stop and remove containers
docker-compose down

# Remove containers, networks, and volumes
docker-compose down -v
```

### Individual Service Commands
```bash
# Build only backend
docker build -t hitormiss-backend ./backend

# Build only frontend
docker build -t hitormiss-frontend ./frontend

# Run backend container
docker run -p 5000:5000 hitormiss-backend

# Run frontend container
docker run -p 3000:80 hitormiss-frontend
```

## Development

See individual README files in `frontend/` and `backend/` directories for detailed setup and development instructions.

## Project Structure

```
HitOrMiss/
├── backend/
│   ├── app/                 # Flask application
│   ├── data/                # Dataset files
│   ├── models/              # Trained ML models
│   ├── tests/               # Backend tests
│   ├── Dockerfile           # Backend Docker config
│   ├── requirements.txt     # Python dependencies
│   └── run.py              # Application entry point
├── frontend/
│   ├── src/                 # React source code
│   ├── public/              # Static assets
│   ├── Dockerfile           # Frontend Docker config
│   ├── nginx.conf           # Nginx configuration
│   └── package.json         # Node dependencies
├── docker-compose.yml       # Docker Compose configuration
└── README.md               # This file
```
