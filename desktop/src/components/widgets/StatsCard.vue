<template>
  <div class="stats-card" :class="variant">
    <div class="card-icon">
      <i :class="icon"></i>
    </div>

    <div class="card-content">
      <div class="card-label">{{ label }}</div>
      <div class="card-value">
        {{ formattedValue }}
        <span v-if="unit" class="unit">{{ unit }}</span>
      </div>

      <div v-if="trend !== undefined" class="card-trend" :class="getTrendClass()">
        <i :class="getTrendIcon()"></i>
        <span>{{ Math.abs(trend) }}%</span>
        <span class="trend-label">{{ trendLabel }}</span>
      </div>

      <div v-if="description" class="card-description">
        {{ description }}
      </div>
    </div>

    <div v-if="showAction" class="card-action" @click="handleAction">
      <i class="fas fa-arrow-right"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type Variant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'secondary';

const props = withDefaults(
  defineProps<{
    label: string;
    value: number | string;
    icon: string;
    variant?: Variant;
    unit?: string;
    trend?: number;
    trendLabel?: string;
    description?: string;
    showAction?: boolean;
    formatValue?: (value: number | string) => string;
  }>(),
  {
    variant: 'primary',
    trendLabel: 'vs mois dernier',
    showAction: false,
  }
);

const emit = defineEmits(['action']);

const formattedValue = computed(() => {
  if (props.formatValue) {
    return props.formatValue(props.value);
  }

  if (typeof props.value === 'number') {
    return props.value.toLocaleString('fr-FR');
  }

  return props.value;
});

const getTrendClass = (): string => {
  if (props.trend === undefined) return '';
  return props.trend >= 0 ? 'trend-up' : 'trend-down';
};

const getTrendIcon = (): string => {
  if (props.trend === undefined) return '';
  return props.trend >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
};

const handleAction = () => {
  emit('action');
};
</script>

<style scoped lang="scss">
.stats-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: flex-start;
  gap: 16px;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: currentColor;
  }

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  &.primary {
    color: #2563eb;
  }

  &.success {
    color: #10b981;
  }

  &.warning {
    color: #f59e0b;
  }

  &.danger {
    color: #ef4444;
  }

  &.info {
    color: #06b6d4;
  }

  &.secondary {
    color: #6b7280;
  }
}

.card-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;

  .primary & {
    background: #eff6ff;
    color: #2563eb;
  }

  .success & {
    background: #d1fae5;
    color: #10b981;
  }

  .warning & {
    background: #fef3c7;
    color: #f59e0b;
  }

  .danger & {
    background: #fee2e2;
    color: #ef4444;
  }

  .info & {
    background: #cffafe;
    color: #06b6d4;
  }

  .secondary & {
    background: #f3f4f6;
    color: #6b7280;
  }
}

.card-content {
  flex: 1;

  .card-label {
    font-size: 13px;
    color: #6b7280;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
  }

  .card-value {
    font-size: 32px;
    font-weight: 700;
    color: #111827;
    line-height: 1;
    margin-bottom: 8px;

    .unit {
      font-size: 16px;
      font-weight: 500;
      color: #6b7280;
      margin-left: 4px;
    }
  }

  .card-trend {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 4px;

    &.trend-up {
      color: #10b981;
    }

    &.trend-down {
      color: #ef4444;
    }

    i {
      font-size: 12px;
    }

    .trend-label {
      font-weight: 400;
      color: #9ca3af;
      margin-left: 4px;
    }
  }

  .card-description {
    font-size: 12px;
    color: #9ca3af;
    margin-top: 4px;
  }
}

.card-action {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background: #e5e7eb;
    color: #374151;
  }
}

@media (max-width: 640px) {
  .card-content {
    .card-value {
      font-size: 24px;
    }
  }
}
</style>
