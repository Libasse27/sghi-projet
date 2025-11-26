<template>
  <div class="pie-chart-container">
    <div v-if="title" class="chart-header">
      <h3>{{ title }}</h3>
    </div>

    <div class="chart-content">
      <div class="chart-wrapper" :style="{ height: height }">
        <canvas ref="chartCanvas"></canvas>
      </div>

      <div v-if="showLegend" class="chart-legend">
        <div
          v-for="(label, index) in chartData.labels"
          :key="index"
          class="legend-item"
        >
          <span
            class="legend-color"
            :style="{
              backgroundColor: backgroundColors[index % backgroundColors.length],
            }"
          ></span>
          <div class="legend-content">
            <span class="legend-label">{{ label }}</span>
            <span class="legend-value">
              {{ chartData.datasets[0].data[index].toLocaleString('fr-FR') }}
              <span v-if="showPercentage" class="percentage">
                ({{ getPercentage(chartData.datasets[0].data[index]) }}%)
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';
import {
  Chart,
  PieController,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
Chart.register(PieController, ArcElement, Tooltip, Legend);

interface Dataset {
  data: number[];
  backgroundColor?: string[];
  borderColor?: string[];
  borderWidth?: number;
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
    showPercentage?: boolean;
  }>(),
  {
    height: '300px',
    showLegend: true,
    showPercentage: true,
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
  '#6366f1', // Indigo
  '#06b6d4', // Cyan
];

const backgroundColors = computed(() => {
  return (
    props.chartData.datasets[0]?.backgroundColor ||
    defaultColors.slice(0, props.chartData.labels.length)
  );
});

const total = computed(() => {
  return props.chartData.datasets[0].data.reduce((sum, value) => sum + value, 0);
});

const getPercentage = (value: number): string => {
  if (total.value === 0) return '0';
  return ((value / total.value) * 100).toFixed(1);
};

const createChart = () => {
  if (!chartCanvas.value) return;

  // Destroy existing chart
  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(chartCanvas.value, {
    type: 'pie',
    data: {
      labels: props.chartData.labels,
      datasets: [
        {
          data: props.chartData.datasets[0].data,
          backgroundColor: backgroundColors.value,
          borderColor: '#ffffff',
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
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
              const label = context.label || '';
              const value = context.parsed;
              const percentage = getPercentage(value);
              return `${label}: ${value.toLocaleString('fr-FR')} (${percentage}%)`;
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
.pie-chart-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-header {
  margin-bottom: 20px;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #111827;
  }
}

.chart-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.chart-wrapper {
  position: relative;
  width: 100%;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .legend-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px;
    border-radius: 6px;
    transition: background 0.2s;

    &:hover {
      background: #f9fafb;
    }

    .legend-color {
      width: 16px;
      height: 16px;
      border-radius: 3px;
      flex-shrink: 0;
    }

    .legend-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;

      .legend-label {
        font-size: 13px;
        font-weight: 500;
        color: #374151;
      }

      .legend-value {
        font-size: 12px;
        color: #6b7280;

        .percentage {
          font-weight: 600;
          color: #9ca3af;
        }
      }
    }
  }
}
</style>
