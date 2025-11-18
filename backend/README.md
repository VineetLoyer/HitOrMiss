# Spotify Track Predictor - Backend

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
- Windows: `venv\Scripts\activate`
- Unix/MacOS: `source venv/bin/activate`

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Copy `.env.example` to `.env` and configure as needed

5. Run the application:
```bash
python run.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/predict` - Predict if a track will be a hit or miss
- `POST /api/similar` - Find similar tracks
- `GET /api/eda-data` - Get exploratory data analysis data

## Project Structure

```
backend/
├── app/
│   ├── __init__.py          # Flask app factory
│   ├── routes.py            # API endpoints
│   ├── ml_service.py        # ML model service
│   └── data_service.py      # Data processing service
├── data/                    # Dataset storage
├── models/                  # Trained model storage
├── train_model.py           # Model training script
├── run.py                   # Application entry point
├── requirements.txt         # Python dependencies
└── .env                     # Environment variables
```
