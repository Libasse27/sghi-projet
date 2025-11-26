<template>
  <div class="data-table-container">
    <div v-if="title || $slots.actions" class="table-header">
      <h3 v-if="title">{{ title }}</h3>
      <div class="table-actions">
        <slot name="actions"></slot>
      </div>
    </div>

    <div v-if="showSearch || showFilters" class="table-toolbar">
      <div v-if="showSearch" class="search-box">
        <i class="fas fa-search"></i>
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="searchPlaceholder"
          @input="handleSearch"
        />
      </div>

      <div v-if="showFilters" class="filters">
        <slot name="filters"></slot>
      </div>
    </div>

    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th v-if="selectable" class="checkbox-column">
              <input
                type="checkbox"
                :checked="isAllSelected"
                @change="toggleSelectAll"
              />
            </th>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="[
                column.align ? `text-${column.align}` : '',
                column.sortable ? 'sortable' : '',
                sortBy === column.key ? 'sorted' : '',
              ]"
              @click="column.sortable && handleSort(column.key)"
            >
              <div class="th-content">
                <span>{{ column.label }}</span>
                <i
                  v-if="column.sortable"
                  :class="getSortIcon(column.key)"
                  class="sort-icon"
                ></i>
              </div>
            </th>
            <th v-if="$slots.actions || actions" class="actions-column">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="loading" class="loading-row">
            <td :colspan="totalColumns">
              <div class="loading-state">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Chargement...</span>
              </div>
            </td>
          </tr>

          <tr v-else-if="filteredData.length === 0" class="empty-row">
            <td :colspan="totalColumns">
              <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>{{ emptyMessage }}</p>
              </div>
            </td>
          </tr>

          <tr
            v-else
            v-for="row in paginatedData"
            :key="row[rowKey]"
            :class="{ selected: selectedRows.includes(row[rowKey]) }"
            @click="handleRowClick(row)"
          >
            <td v-if="selectable" class="checkbox-column">
              <input
                type="checkbox"
                :checked="selectedRows.includes(row[rowKey])"
                @change="toggleRow(row[rowKey])"
                @click.stop
              />
            </td>
            <td
              v-for="column in columns"
              :key="column.key"
              :class="column.align ? `text-${column.align}` : ''"
            >
              <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
                {{ column.formatter ? column.formatter(row[column.key], row) : row[column.key] }}
              </slot>
            </td>
            <td v-if="$slots.actions || actions" class="actions-column">
              <div class="row-actions">
                <slot name="actions" :row="row">
                  <button
                    v-for="action in actions"
                    :key="action.label"
                    class="action-btn"
                    :class="action.class"
                    @click.stop="action.handler(row)"
                    :title="action.label"
                  >
                    <i :class="action.icon"></i>
                  </button>
                </slot>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="pagination && !loading" class="table-footer">
      <div class="showing-info">
        Affichage {{ startIndex + 1 }} à {{ endIndex }} sur {{ totalItems }} résultats
      </div>

      <div class="pagination">
        <button
          class="pagination-btn"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          <i class="fas fa-chevron-left"></i>
        </button>

        <button
          v-for="page in visiblePages"
          :key="page"
          class="pagination-btn"
          :class="{ active: page === currentPage }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>

        <button
          class="pagination-btn"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>

      <div class="page-size-selector">
        <select v-model.number="currentPageSize" @change="handlePageSizeChange">
          <option :value="10">10 / page</option>
          <option :value="25">25 / page</option>
          <option :value="50">50 / page</option>
          <option :value="100">100 / page</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  formatter?: (value: any, row: any) => string;
}

interface Action {
  label: string;
  icon: string;
  class?: string;
  handler: (row: any) => void;
}

const props = withDefaults(
  defineProps<{
    data: any[];
    columns: Column[];
    title?: string;
    rowKey?: string;
    selectable?: boolean;
    pagination?: boolean;
    pageSize?: number;
    showSearch?: boolean;
    searchPlaceholder?: string;
    showFilters?: boolean;
    loading?: boolean;
    emptyMessage?: string;
    actions?: Action[];
  }>(),
  {
    rowKey: 'id',
    selectable: false,
    pagination: true,
    pageSize: 25,
    showSearch: true,
    searchPlaceholder: 'Rechercher...',
    showFilters: false,
    loading: false,
    emptyMessage: 'Aucune donnée disponible',
  }
);

const emit = defineEmits(['row-click', 'selection-change', 'search']);

const searchQuery = ref('');
const sortBy = ref('');
const sortOrder = ref<'asc' | 'desc'>('asc');
const currentPage = ref(1);
const currentPageSize = ref(props.pageSize);
const selectedRows = ref<any[]>([]);

const filteredData = computed(() => {
  let data = [...props.data];

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    data = data.filter(row =>
      props.columns.some(column => {
        const value = row[column.key];
        return value && String(value).toLowerCase().includes(query);
      })
    );
  }

  // Apply sorting
  if (sortBy.value) {
    data.sort((a, b) => {
      const aVal = a[sortBy.value];
      const bVal = b[sortBy.value];

      if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return data;
});

const totalItems = computed(() => filteredData.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / currentPageSize.value));

const startIndex = computed(() => (currentPage.value - 1) * currentPageSize.value);
const endIndex = computed(() => Math.min(startIndex.value + currentPageSize.value, totalItems.value));

const paginatedData = computed(() => {
  if (!props.pagination) return filteredData.value;
  return filteredData.value.slice(startIndex.value, endIndex.value);
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

const totalColumns = computed(() => {
  let count = props.columns.length;
  if (props.selectable) count++;
  if (props.actions || '$slots' in props) count++;
  return count;
});

const isAllSelected = computed(() => {
  return paginatedData.value.length > 0 &&
    paginatedData.value.every(row => selectedRows.value.includes(row[props.rowKey]));
});

const getSortIcon = (key: string): string => {
  if (sortBy.value !== key) return 'fas fa-sort';
  return sortOrder.value === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
};

const handleSort = (key: string) => {
  if (sortBy.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = key;
    sortOrder.value = 'asc';
  }
};

const handleSearch = () => {
  currentPage.value = 1;
  emit('search', searchQuery.value);
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const handlePageSizeChange = () => {
  currentPage.value = 1;
};

const toggleRow = (id: any) => {
  const index = selectedRows.value.indexOf(id);
  if (index > -1) {
    selectedRows.value.splice(index, 1);
  } else {
    selectedRows.value.push(id);
  }
  emit('selection-change', selectedRows.value);
};

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedRows.value = [];
  } else {
    selectedRows.value = paginatedData.value.map(row => row[props.rowKey]);
  }
  emit('selection-change', selectedRows.value);
};

const handleRowClick = (row: any) => {
  emit('row-click', row);
};

watch(() => props.data, () => {
  currentPage.value = 1;
});
</script>

<style scoped lang="scss">
.data-table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #111827;
  }
}

.table-toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;

  .search-box {
    position: relative;
    flex: 1;
    max-width: 400px;

    i {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #9ca3af;
    }

    input {
      width: 100%;
      padding: 8px 12px 8px 36px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;

      &:focus {
        outline: none;
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
      }
    }
  }

  .filters {
    display: flex;
    gap: 8px;
  }
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;

  thead {
    background: #f9fafb;
    border-bottom: 2px solid #e5e7eb;

    th {
      padding: 12px 16px;
      text-align: left;
      font-size: 13px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;

      &.sortable {
        cursor: pointer;
        user-select: none;

        &:hover {
          background: #f3f4f6;
        }
      }

      &.sorted {
        color: #2563eb;
      }

      .th-content {
        display: flex;
        align-items: center;
        gap: 8px;

        .sort-icon {
          font-size: 12px;
        }
      }
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid #e5e7eb;
      transition: background 0.2s;

      &:hover {
        background: #f9fafb;
      }

      &.selected {
        background: #eff6ff;
      }

      td {
        padding: 12px 16px;
        font-size: 14px;
        color: #374151;
      }
    }
  }

  .checkbox-column {
    width: 40px;
    text-align: center;

    input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }
  }

  .actions-column {
    width: 120px;
    text-align: right;

    .row-actions {
      display: flex;
      gap: 4px;
      justify-content: flex-end;

      .action-btn {
        padding: 6px 10px;
        background: none;
        border: none;
        color: #6b7280;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.2s;

        &:hover {
          background: #f3f4f6;
          color: #374151;
        }
      }
    }
  }

  .text-center {
    text-align: center;
  }

  .text-right {
    text-align: right;
  }
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #9ca3af;

  i {
    font-size: 48px;
    margin-bottom: 16px;
  }

  p {
    margin: 0;
    font-size: 14px;
  }
}

.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;

  .showing-info {
    font-size: 13px;
    color: #6b7280;
  }

  .pagination {
    display: flex;
    gap: 4px;

    .pagination-btn {
      padding: 6px 12px;
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      color: #374151;
      cursor: pointer;
      font-size: 13px;
      transition: all 0.2s;

      &:hover:not(:disabled) {
        background: #f9fafb;
        border-color: #2563eb;
      }

      &.active {
        background: #2563eb;
        border-color: #2563eb;
        color: white;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }

  .page-size-selector {
    select {
      padding: 6px 10px;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      font-size: 13px;
      cursor: pointer;

      &:focus {
        outline: none;
        border-color: #2563eb;
      }
    }
  }
}

@media (max-width: 768px) {
  .table-toolbar {
    flex-direction: column;

    .search-box {
      max-width: 100%;
    }
  }

  .table-footer {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
