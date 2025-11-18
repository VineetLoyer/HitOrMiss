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

### Backend Setup

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

## Development

See individual README files in `frontend/` and `backend/` directories for detailed setup and development instructions.
