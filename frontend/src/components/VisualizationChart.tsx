import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { Bar, Scatter } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export type ChartType = 'histogram' | 'bar' | 'scatter' | 'heatmap';

interface VisualizationChartProps {
  data: {
    labels?: string[];
    datasets: Array<{
      label: string;
      data: number[] | Array<{ x: number; y: number }>;
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
    }>;
  };
  chartType: ChartType;
  title: string;
  xLabel?: string;
  yLabel?: string;
}

const VisualizationChart = ({ data, chartType, title, xLabel, yLabel }: VisualizationChartProps) => {
  const options: ChartOptions<'bar' | 'scatter'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        display: chartType !== 'histogram',
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      x: {
        title: {
          display: !!xLabel,
          text: xLabel || '',
        },
      },
      y: {
        title: {
          display: !!yLabel,
          text: yLabel || '',
        },
      },
    },
  };

  const renderChart = () => {
    switch (chartType) {
      case 'histogram':
      case 'bar':
        return <Bar data={data} options={options as ChartOptions<'bar'>} />;
      case 'scatter':
        return <Scatter data={data} options={options as ChartOptions<'scatter'>} />;
      case 'heatmap':
        // Heatmap will be handled separately with a custom component
        return (
          <div className="text-center text-gray-600 py-8">
            Heatmap visualization (custom implementation)
          </div>
        );
      default:
        return <div className="text-center text-gray-600 py-8">Unsupported chart type</div>;
    }
  };

  return (
    <div className="w-full h-[300px]">
      {renderChart()}
    </div>
  );
};

export default VisualizationChart;
