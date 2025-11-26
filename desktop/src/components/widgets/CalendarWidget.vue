<template>
  <div class="calendar-widget">
    <div class="calendar-header">
      <button class="nav-btn" @click="previousMonth">
        <i class="fas fa-chevron-left"></i>
      </button>

      <div class="month-year">
        <h3>{{ monthName }} {{ currentYear }}</h3>
      </div>

      <button class="nav-btn" @click="nextMonth">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>

    <div class="calendar-grid">
      <div v-for="day in weekDays" :key="day" class="weekday">
        {{ day }}
      </div>

      <div
        v-for="(day, index) in calendarDays"
        :key="index"
        class="calendar-day"
        :class="{
          'other-month': day.isOtherMonth,
          today: day.isToday,
          selected: day.isSelected,
          'has-events': day.hasEvents,
        }"
        @click="handleDayClick(day)"
      >
        <div class="day-number">{{ day.date.getDate() }}</div>

        <div v-if="day.events && day.events.length > 0" class="day-events">
          <div
            v-for="(event, idx) in day.events.slice(0, 2)"
            :key="idx"
            class="event-dot"
            :class="`event-${event.type}`"
            :title="event.title"
          ></div>
          <span v-if="day.events.length > 2" class="more-events">
            +{{ day.events.length - 2 }}
          </span>
        </div>
      </div>
    </div>

    <div v-if="showEventsList && selectedDate" class="events-list">
      <div class="events-list-header">
        <h4>Événements du {{ formatDate(selectedDate) }}</h4>
        <button class="close-btn" @click="selectedDate = null">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="events-list-content">
        <div v-if="selectedDayEvents.length === 0" class="no-events">
          <i class="fas fa-calendar-times"></i>
          <p>Aucun événement</p>
        </div>

        <div
          v-for="event in selectedDayEvents"
          :key="event.id"
          class="event-item"
          :class="`event-${event.type}`"
          @click="handleEventClick(event)"
        >
          <div class="event-time">{{ formatTime(event.time) }}</div>
          <div class="event-details">
            <div class="event-title">{{ event.title }}</div>
            <div v-if="event.description" class="event-description">
              {{ event.description }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameDay, isSameMonth, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CalendarEvent {
  id: string;
  date: Date;
  time: string;
  title: string;
  description?: string;
  type: 'appointment' | 'surgery' | 'meeting' | 'other';
}

interface CalendarDay {
  date: Date;
  isOtherMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  hasEvents: boolean;
  events?: CalendarEvent[];
}

const props = withDefaults(
  defineProps<{
    events?: CalendarEvent[];
    showEventsList?: boolean;
  }>(),
  {
    events: () => [],
    showEventsList: true,
  }
);

const emit = defineEmits(['day-click', 'event-click']);

const currentDate = ref(new Date());
const selectedDate = ref<Date | null>(null);

const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

const currentMonth = computed(() => currentDate.value.getMonth());
const currentYear = computed(() => currentDate.value.getFullYear());

const monthName = computed(() => {
  return format(currentDate.value, 'MMMM', { locale: fr });
});

const calendarDays = computed((): CalendarDay[] => {
  const monthStart = startOfMonth(currentDate.value);
  const monthEnd = endOfMonth(currentDate.value);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days: CalendarDay[] = [];
  let day = calendarStart;

  while (day <= calendarEnd) {
    const dayEvents = props.events.filter(event =>
      isSameDay(new Date(event.date), day)
    );

    days.push({
      date: new Date(day),
      isOtherMonth: !isSameMonth(day, currentDate.value),
      isToday: isToday(day),
      isSelected: selectedDate.value ? isSameDay(day, selectedDate.value) : false,
      hasEvents: dayEvents.length > 0,
      events: dayEvents,
    });

    day = addDays(day, 1);
  }

  return days;
});

const selectedDayEvents = computed(() => {
  if (!selectedDate.value) return [];
  return props.events.filter(event =>
    isSameDay(new Date(event.date), selectedDate.value!)
  );
});

const previousMonth = () => {
  currentDate.value = subMonths(currentDate.value, 1);
};

const nextMonth = () => {
  currentDate.value = addMonths(currentDate.value, 1);
};

const handleDayClick = (day: CalendarDay) => {
  selectedDate.value = day.date;
  emit('day-click', day);
};

const handleEventClick = (event: CalendarEvent) => {
  emit('event-click', event);
};

const formatDate = (date: Date): string => {
  return format(date, 'dd MMMM yyyy', { locale: fr });
};

const formatTime = (time: string): string => {
  return time;
};
</script>

<style scoped lang="scss">
.calendar-widget {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.calendar-header {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e5e7eb;

  .nav-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #f3f4f6;
    border: none;
    color: #374151;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;

    &:hover {
      background: #e5e7eb;
    }
  }

  .month-year {
    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #111827;
      text-transform: capitalize;
    }
  }
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #e5e7eb;
  padding: 1px;

  .weekday {
    padding: 12px;
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    color: #6b7280;
    background: #f9fafb;
    text-transform: uppercase;
  }

  .calendar-day {
    background: white;
    padding: 8px;
    min-height: 80px;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;

    &:hover {
      background: #f9fafb;
    }

    &.other-month {
      background: #f9fafb;

      .day-number {
        color: #d1d5db;
      }
    }

    &.today {
      .day-number {
        background: #2563eb;
        color: white;
        border-radius: 50%;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    &.selected {
      background: #eff6ff;
      border: 2px solid #2563eb;
    }

    .day-number {
      font-size: 14px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 4px;
    }

    .day-events {
      display: flex;
      gap: 3px;
      flex-wrap: wrap;

      .event-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;

        &.event-appointment {
          background: #2563eb;
        }

        &.event-surgery {
          background: #ef4444;
        }

        &.event-meeting {
          background: #f59e0b;
        }

        &.event-other {
          background: #6b7280;
        }
      }

      .more-events {
        font-size: 10px;
        color: #6b7280;
        font-weight: 600;
      }
    }
  }
}

.events-list {
  border-top: 1px solid #e5e7eb;

  .events-list-header {
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e5e7eb;

    h4 {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: #111827;
    }

    .close-btn {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: none;
      border: none;
      color: #6b7280;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;

      &:hover {
        background: #f3f4f6;
      }
    }
  }

  .events-list-content {
    max-height: 300px;
    overflow-y: auto;

    .no-events {
      padding: 40px 20px;
      text-align: center;
      color: #9ca3af;

      i {
        font-size: 32px;
        margin-bottom: 12px;
      }

      p {
        margin: 0;
        font-size: 14px;
      }
    }

    .event-item {
      padding: 12px 20px;
      display: flex;
      gap: 12px;
      border-left: 3px solid transparent;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: #f9fafb;
      }

      &.event-appointment {
        border-left-color: #2563eb;
      }

      &.event-surgery {
        border-left-color: #ef4444;
      }

      &.event-meeting {
        border-left-color: #f59e0b;
      }

      &.event-other {
        border-left-color: #6b7280;
      }

      .event-time {
        font-size: 12px;
        font-weight: 600;
        color: #6b7280;
        min-width: 60px;
      }

      .event-details {
        flex: 1;

        .event-title {
          font-size: 14px;
          font-weight: 500;
          color: #111827;
          margin-bottom: 2px;
        }

        .event-description {
          font-size: 12px;
          color: #6b7280;
        }
      }
    }
  }
}
</style>
