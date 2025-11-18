# Spotify Track Predictor - Frontend

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   ├── services/            # API service layer
│   ├── types/               # TypeScript type definitions
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles with Tailwind
├── public/                  # Static assets
└── index.html               # HTML template
```

## Technologies

- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Chart.js for data visualizations
- Axios for API communication
