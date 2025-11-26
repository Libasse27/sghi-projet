<template>
  <Teleport to="body">
    <transition name="modal-fade">
      <div v-if="isVisible" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-container" @click.stop>
          <div class="modal-header" :class="`type-${type}`">
            <div class="icon">
              <i :class="getIcon()"></i>
            </div>
            <h3>{{ title }}</h3>
          </div>

          <div class="modal-body">
            <p>{{ message }}</p>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click="handleCancel">
              {{ cancelText }}
            </button>
            <button
              class="btn-confirm"
              :class="`type-${type}`"
              @click="handleConfirm"
              :disabled="isProcessing"
            >
              <span v-if="isProcessing">
                <i class="fas fa-spinner fa-spin"></i>
                Traitement...
              </span>
              <span v-else>{{ confirmText }}</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

type ModalType = 'info' | 'success' | 'warning' | 'danger';

const props = withDefaults(
  defineProps<{
    visible: boolean;
    title?: string;
    message?: string;
    type?: ModalType;
    confirmText?: string;
    cancelText?: string;
    closeOnOverlayClick?: boolean;
  }>(),
  {
    title: 'Confirmation',
    message: 'Êtes-vous sûr de vouloir continuer ?',
    type: 'warning',
    confirmText: 'Confirmer',
    cancelText: 'Annuler',
    closeOnOverlayClick: true,
  }
);

const emit = defineEmits(['confirm', 'cancel', 'update:visible']);

const isProcessing = ref(false);
const isVisible = computed(() => props.visible);

const getIcon = (): string => {
  const icons: Record<ModalType, string> = {
    info: 'fas fa-info-circle',
    success: 'fas fa-check-circle',
    warning: 'fas fa-exclamation-triangle',
    danger: 'fas fa-exclamation-circle',
  };
  return icons[props.type];
};

const handleOverlayClick = () => {
  if (props.closeOnOverlayClick && !isProcessing.value) {
    handleCancel();
  }
};

const handleConfirm = async () => {
  isProcessing.value = true;
  emit('confirm');
  // Keep modal open while processing
  // The parent component should close it when done
};

const handleCancel = () => {
  if (!isProcessing.value) {
    emit('cancel');
    emit('update:visible', false);
  }
};

// Allow parent to reset processing state
defineExpose({
  resetProcessing: () => {
    isProcessing.value = false;
  },
});
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-container {
  background: white;
  border-radius: 12px;
  max-width: 480px;
  width: 90%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.modal-header {
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;

  .icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    flex-shrink: 0;
  }

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #111827;
  }

  &.type-info {
    background: #eff6ff;

    .icon {
      background: #dbeafe;
      color: #2563eb;
    }
  }

  &.type-success {
    background: #f0fdf4;

    .icon {
      background: #d1fae5;
      color: #10b981;
    }
  }

  &.type-warning {
    background: #fffbeb;

    .icon {
      background: #fef3c7;
      color: #f59e0b;
    }
  }

  &.type-danger {
    background: #fef2f2;

    .icon {
      background: #fee2e2;
      color: #ef4444;
    }
  }
}

.modal-body {
  padding: 24px;

  p {
    margin: 0;
    font-size: 15px;
    color: #6b7280;
    line-height: 1.6;
  }
}

.modal-footer {
  padding: 16px 24px;
  background: #f9fafb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  button {
    padding: 10px 24px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .btn-cancel {
    background: white;
    color: #374151;
    border: 1px solid #d1d5db;

    &:hover:not(:disabled) {
      background: #f9fafb;
    }
  }

  .btn-confirm {
    color: white;

    &.type-info {
      background: #2563eb;

      &:hover:not(:disabled) {
        background: #1d4ed8;
      }
    }

    &.type-success {
      background: #10b981;

      &:hover:not(:disabled) {
        background: #059669;
      }
    }

    &.type-warning {
      background: #f59e0b;

      &:hover:not(:disabled) {
        background: #d97706;
      }
    }

    &.type-danger {
      background: #ef4444;

      &:hover:not(:disabled) {
        background: #dc2626;
      }
    }
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;

  .modal-container {
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;

  .modal-container {
    transform: scale(0.95);
    opacity: 0;
  }
}
</style>
