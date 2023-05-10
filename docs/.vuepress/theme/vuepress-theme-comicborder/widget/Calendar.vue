<template>
  <div class="calendar-box" :class="{ 'hide-calendar': isHide }" :style="calendarBoxStyle" >
    <NSwitch class="calendar-toggle" size="large" v-model:value="isHide" :rail-style="railStyle">
      <template #checked-icon>
        <span class="calendar-toggle-icon"></span>
      </template>
      <template #unchecked-icon>
        <span class="calendar-toggle-icon"></span>
      </template>
      <template #checked>
        <div class="small-time">
          <NIcon size="1.3rem"><Time /></NIcon>
          <time class="time-txt">{{ currentDate }}</time>
        </div>
      </template>
      <template #unchecked>
        <span class="unchecked-txt">＼(º □ º l|l)/ 太密集，麻烦简单一点</span>
      </template>
    </NSwitch>
    <template v-if="!isHide">
      <NConfigProvider :locale="zhCN" :date-locale="dateZhCN" abstract>
        <NCalendar class="calendar" :style="calendarStyle" />
      </NConfigProvider>
    </template>
  </div>
</template>

<style lang="scss">
.calendar-box {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  box-sizing: border-box;
  padding: var(--theme-container-padding1);
  border: var(--theme-border1);
  border-radius: var(--theme-border-radius1);
  box-shadow: var(--theme-shadow-color1);

  // max-height: 22.5rem;
  overflow: hidden;

  &.hide-calendar {
    width: var(--hide-calendar-width);
    // margin-left: calc(25.625rem - 19rem); // widget width - hide-calendar width
    margin-left: calc(var(--widget-width) - var(--hide-calendar-width));
  }

  .calendar-toggle {
    justify-content: flex-end;


    &.n-switch {
      .n-switch__rail {
        box-sizing: border-box;
        border: var(--theme-border1);
        .n-switch__button {
          border: var(--theme-border1);
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }

    .calendar-toggle-icon {
      width: 40%;
      height: 40%;
      border-radius: 50%;
      box-sizing: border-box;
      border: var(--theme-border1);
    }

    .unchecked-txt {
      color: var(--theme-color2);
    }

    .small-time {
      display: flex;
      align-items: center;

      .n-icon {
        width: 1.3rem;
        height: 1.3rem;
      }

      .time-txt {
        font-size: 0.875rem;
        margin-left: 0.625rem;
      }
    }
  }

  .calendar {
    height: 90%;
    // flex: 1;
    margin-top: 0.875rem;

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
import { computed, ref } from 'vue';
import { NCalendar, NConfigProvider, zhCN, dateZhCN, NButton, NIcon, NSwitch } from 'naive-ui';
import { Time } from '@vicons/carbon';

const isHide = ref(true);

// 日历的自定义样式
const calendarStyle = computed(function () {
  return {
    '--n-font-size': '0.75rem',
    // '--n-border-color': 'var(--theme-color8)',
  };
});

const calendarBoxStyle = computed(function () {
  return {
    '--widget-width': '25.625rem',
    '--hide-calendar-width': '17.5rem',
  };
});

// 今天日期
const currentDate = computed(function () {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekDay = date.getDay();
  const weeks = ['日', '一', '二', '三', '四', '五', '六'];

  return `今天 ${year}-${month}-${day} 星期${weeks[weekDay]}`;
});

// 开关的自定义样式
const railStyle = function ({ focused, checked }) {
  const style = {
    // '--n-rail-height': '1.875rem',
    '--n-offset': 'calc((24px - 22px) / 2)'
  };
  if (checked) {
    style.background = "var(--theme-color6)";
    if (focused) {
      style.boxShadow = "0 0 0 2px ##F2B70540";
    }
  } else {
    style.background = "var(--theme-color1)";
    if (focused) {
      style.boxShadow = "0 0 0 2px #A0C3D940";
    }
  }
  return style;
};

</script>
