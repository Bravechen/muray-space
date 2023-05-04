<template>
    <div class="calendar-box">
      <NConfigProvider :locale="zhCN" :date-locale="dateZhCN" abstract>
        <NCalendar class="calendar" :style="calendarStyle" />
      </NConfigProvider>
    </div>
</template>

<style lang="scss">
  .calendar-box {
    box-sizing: border-box;
    padding: var(--theme-container-padding1);
    border: var(--theme-border1);
    border-radius: var(--theme-border-radius1);
    box-shadow: var(--theme-shadow-color1);

    min-height: 22.5rem;
    overflow: hidden;

    .calendar {
      height: 100%;

      &.n-calendar {
        .n-calendar-cell {
          padding: 0.375rem;

          .n-calendar-cell__bar {
            display: none;
          }

          .n-calendar-date {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            flex-grow: revert;
            height: 100%;
            padding: unset;

            .n-calendar-date__date {
              font-weight: var(--theme-font-bold);
              font-size: 0.875rem;
              margin-left: 0;
            }

            // .n-calendar-date__day {

            // }
          }

          &.n-calendar-cell--current {
            background-color: var(--theme-color8);
            border-color: var(--theme-color8);

            .n-calendar-date {
              .n-calendar-date__date {
                background-color: unset;
              }

              .n-calendar-date__day {
                color: var(--theme-color1);
              }
            }
          }

          &.n-calendar-cell--selected {
            background-color: var(--theme-color6);
            border-color: var(--theme-color6);

            .n-calendar-date {
              .n-calendar-date__date {
                background-color: unset;
                color: var(--theme-color11);

              }

              .n-calendar-date__day {
                color: var(--theme-color11);
              }
            }
          }
        }
      }

    }
  }
</style>

<script setup>
import { computed } from 'vue';
// import { NCalendar, NConfigProvider, zhCN, dateZhCN } from 'naive-ui';
import ui from 'naive-ui';
const { NCalendar, NConfigProvider, zhCN, dateZhCN } = ui;

const calendarStyle = computed(function () {
  return {
    '--n-font-size': '0.75rem',
    // '--n-border-color': 'var(--theme-color8)',
  };
});
</script>
