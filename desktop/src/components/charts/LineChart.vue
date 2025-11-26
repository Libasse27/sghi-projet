<template>
  <div class="line-chart-container">
    <div v-if="title" class="chart-header">
      <h3>{{ title }}</h3>
      <div v-if="showLegend" class="chart-legend">
        <div
          v-for="(dataset, index) in chartData.datasets"
          :key="index"
          class="legend-item"
        >
          <span
            class="legend-color"
            :style="{ backgroundColor: dataset.borderColor }"
          ></span>
          <span class="legend-label">{{ dataset.label }}</span>
        </div>
      </div>
    </div>

    <div class="chart-wrapper" :style="{ height: height }">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register Chart.js components
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Dataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
  fill?: boolean;
  tension?: number;
}

interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

const props = withDefaults(
  defineProps<{
    chartData: ChartData;
    title?: string;
    height?: string;
    showLegend?: boolean;
    smooth?: boolean;
    fill?: boolean;
    stacked?: boolean;
  }>(),
  {
    height: '300px',
    showLegend: true,
    smooth: true,
    fill: false,
    stacked: false,
  }
);

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const defaultColors = [
  '#2563eb', // Blue
  '#10b981', // Green
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#14b8a6', // Teal
  '#f97316', // Orange
];

const createChart = () => {
  if (!chartCanvas.value) return;

  // Destroy existing chart
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Prepare datasets with default colors
  const datasets = props.chartData.datasets.map((dataset, index) => ({
    ...dataset,
    borderColor: dataset.borderColor || defaultColors[index % defaultColors.length],
    backgroundColor: dataset.backgroundColor ||
      (props.fill
        ? `${defaultColors[index % defaultColors.length]}33` // 20% opacity
        : 'transparent'),
    fill: dataset.fill !== undefined ? dataset.fill : props.fill,
    tension: dataset.tension !== undefined ? dataset.tension : (props.smooth ? 0.4 : 0),
    borderWidth: 2,
    pointRadius: 3,
    pointHoverRadius: 5,
    pointBackgroundColor: dataset.borderColor || defaultColors[index % defaultColors.length],
  }));

  chartInstance = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: props.chartData.labels,
      datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          display: false, // We use custom legend
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#374151',
          borderWidth: 1,
          padding: 12,
          displayColors: true,
          callbacks: {
            label: (context) => {
              const label = context.dataset.label || '';
              const value = context.parsed.y;
              return `${label}: ${value.toLocaleString('fr-FR')}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: '#6b7280',
            font: {
              size: 12,
            },
          },
        },
        y: {
          stacked: props.stacked,
          grid: {
            color: '#f3f4f6',
          },
          ticks: {
            color: '#6b7280',
            font: {
              size: 12,
            },
            callback: (value) => {
              return value.toLocaleString('fr-FR');
            },
          },
        },
      },
    },
  });
};

onMounted(() => {
  createChart();
});

watch(() => props.chartData, () => {
  createChart();
}, { deep: true });

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>

<style scoped lang="scss">
.line-chart-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #111827;
  }
}

.chart-legend {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;

  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #6b7280;

    .legend-color {
      width: 12px;
      height: 12px;
      border-radius: 2px;
    }
  }
}

.chart-wrapper {
  position: relative;
  width: 100%;
}
</style>
