<template>
  <Teleport to="body">
    <transition name="modal-fade">
      <div v-if="isVisible" class="modal-overlay" @click="handleClose">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <h3>Aperçu avant Impression</h3>
            <button class="close-btn" @click="handleClose">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="modal-toolbar">
            <div class="toolbar-group">
              <select v-model="selectedFormat" class="format-select">
                <option value="A4">Format A4</option>
                <option value="A5">Format A5</option>
                <option value="Letter">Format Lettre</option>
              </select>

              <select v-model="selectedOrientation" class="orientation-select">
                <option value="portrait">Portrait</option>
                <option value="landscape">Paysage</option>
              </select>
            </div>

            <div class="toolbar-group">
              <button class="toolbar-btn" @click="handlePrint">
                <i class="fas fa-print"></i>
                Imprimer
              </button>
              <button class="toolbar-btn" @click="handleDownloadPDF">
                <i class="fas fa-file-pdf"></i>
                Télécharger PDF
              </button>
            </div>
          </div>

          <div class="modal-body">
            <div
              ref="printContent"
              class="print-content"
              :class="[`format-${selectedFormat}`, `orientation-${selectedOrientation}`]"
            >
              <slot name="content">
                <div class="default-content">
                  <p>Contenu de l'aperçu avant impression</p>
                </div>
              </slot>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-secondary" @click="handleClose">
              Annuler
            </button>
            <button class="btn-primary" @click="handlePrint">
              <i class="fas fa-print"></i>
              Imprimer
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = withDefaults(
  defineProps<{
    visible: boolean;
    title?: string;
    defaultFormat?: 'A4' | 'A5' | 'Letter';
    defaultOrientation?: 'portrait' | 'landscape';
  }>(),
  {
    title: 'Aperçu avant Impression',
    defaultFormat: 'A4',
    defaultOrientation: 'portrait',
  }
);

const emit = defineEmits(['close', 'print', 'download-pdf', 'update:visible']);

const printContent = ref<HTMLElement | null>(null);
const selectedFormat = ref(props.defaultFormat);
const selectedOrientation = ref(props.defaultOrientation);

const isVisible = computed(() => props.visible);

const handleClose = () => {
  emit('close');
  emit('update:visible', false);
};

const handlePrint = () => {
  if (!printContent.value) return;

  // Create print window
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  // Get the content HTML
  const content = printContent.value.innerHTML;

  // Build print HTML
  const printHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${props.title}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            font-size: 12pt;
            line-height: 1.6;
            color: #000;
          }

          @page {
            size: ${selectedFormat.value} ${selectedOrientation.value};
            margin: 2cm;
          }

          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }

          .print-header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 2px solid #000;
          }

          .print-header h1 {
            font-size: 24pt;
            margin-bottom: 10px;
          }

          .print-header p {
            font-size: 11pt;
            color: #666;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }

          th, td {
            padding: 10px;
            text-align: left;
            border: 1px solid #ddd;
          }

          th {
            background-color: #f9fafb;
            font-weight: 600;
          }

          .section-title {
            font-size: 16pt;
            font-weight: 600;
            margin-top: 30px;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 1px solid #ddd;
          }

          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
          }

          .label {
            font-weight: 600;
            color: #666;
          }

          .value {
            color: #000;
          }

          .signature-section {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
          }

          .signature-box {
            width: 45%;
            text-align: center;
          }

          .signature-line {
            border-top: 1px solid #000;
            margin-top: 60px;
            padding-top: 10px;
          }

          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 10pt;
            color: #666;
          }
        </style>
      </head>
      <body>
        ${content}
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() {
              window.close();
            }, 100);
          }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(printHTML);
  printWindow.document.close();

  emit('print');
};

const handleDownloadPDF = () => {
  // This would typically use a library like jsPDF or html2pdf
  // For now, emit event to parent to handle
  emit('download-pdf', {
    content: printContent.value?.innerHTML,
    format: selectedFormat.value,
    orientation: selectedOrientation.value,
  });
};
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
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #111827;
  }

  .close-btn {
    padding: 8px;
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    font-size: 18px;
    transition: color 0.2s;

    &:hover {
      color: #374151;
    }
  }
}

.modal-toolbar {
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;

  .toolbar-group {
    display: flex;
    gap: 8px;
  }

  select {
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: #2563eb;
    }
  }

  .toolbar-btn {
    padding: 8px 16px;
    background: #f3f4f6;
    border: none;
    border-radius: 6px;
    color: #374151;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s;

    &:hover {
      background: #e5e7eb;
    }

    i {
      font-size: 14px;
    }
  }
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: #f9fafb;
}

.print-content {
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  padding: 2cm;

  &.format-A4 {
    width: 210mm;
    min-height: 297mm;

    &.orientation-landscape {
      width: 297mm;
      min-height: 210mm;
    }
  }

  &.format-A5 {
    width: 148mm;
    min-height: 210mm;

    &.orientation-landscape {
      width: 210mm;
      min-height: 148mm;
    }
  }

  &.format-Letter {
    width: 8.5in;
    min-height: 11in;

    &.orientation-landscape {
      width: 11in;
      min-height: 8.5in;
    }
  }

  .default-content {
    padding: 40px;
    text-align: center;
    color: #9ca3af;
  }
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
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
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .btn-secondary {
    background: #f3f4f6;
    color: #374151;

    &:hover {
      background: #e5e7eb;
    }
  }

  .btn-primary {
    background: #2563eb;
    color: white;

    &:hover {
      background: #1d4ed8;
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

@media (max-width: 768px) {
  .modal-toolbar {
    flex-direction: column;
    align-items: stretch;

    .toolbar-group {
      flex-direction: column;
    }
  }

  .print-content {
    transform: scale(0.6);
    transform-origin: top center;
  }
}
</style>
