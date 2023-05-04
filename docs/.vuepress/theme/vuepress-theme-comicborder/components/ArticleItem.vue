<template>
  <li class="article">
    <figure class="pic">
      <img :src="coverImg" alt="cover" />
    </figure>
    <a class="info" :href="path">
      <div class="left">
        <h3 class="title-txt">{{ title }}</h3>
        <p class="desc">{{ desc }}</p>
        <time class="create-time" :datetime="date">
          <NIcon color="#000000" size="1.25rem">
            <CalendarOutline />
          </NIcon>
          <span>{{ date }}</span>
        </time>
      </div>
      <div class="right">
        <NIcon size="3rem" color="#000000">
          <ArrowForwardCircleSharp />
        </NIcon>
      </div>
    </a>
  </li>
</template>

<style lang="scss">
@import '../styles/common.scss';
.article {
  display: block;

  box-sizing: border-box;
  border-radius: var(--theme-border-radius1);
  border: var(--theme-border1);
  box-shadow: var(--theme-shadow-color1);
  overflow: hidden;

  .pic {
    height: 12.1875rem;
    overflow: hidden;
    background-color: #f2f2f2;
    box-sizing: border-box;
    border-bottom: 1px solid var(--theme-color2);
    @include img();

    & > img {
      position: relative;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .info {
    display: flex;
    align-items: center;

    box-sizing: border-box;
    padding: 0.75rem 1.5rem 0.875rem 1.5rem;

    .left {
      flex: 1;

      display: flex;
      flex-direction: column;

      .title-txt {
        display: block;
        margin-bottom: 0.5625rem;
        font-size: 1.125rem;
        color: var(--theme-color2);

        transition-property: color;
        transition-duration: 0.2s;
        transition-timing-function: ease;
      }

      .desc {
        display: block;
        margin-bottom: 0.75rem;
        font-size: 0.875rem;
        color: var(--theme-color13);
      }

      .create-time {
        display: flex;
        align-items: center;

        font-size: 0.75rem;
        color: var(--theme-color2);

        span {
          margin-left: 0.25rem;
        }
      }

    }

    .right {
      & > i {
        transition: color 0.2s ease;
      }
    }
  }

  &:hover {
    .info {
      .left {
        .title-txt {
          color: var(--theme-color6);
        }
      }

      .right {
        & > i {
          color: var(--theme-color6)!important;
        }
      }
    }
  }
}
</style>

<script setup>
import { CalendarOutline, ArrowForwardCircleSharp } from '@vicons/ionicons5';
import { NIcon } from 'naive-ui';

const props = defineProps({
  coverImg: {
    type: String,
    default: '',
  },
  desc: {
    type: String,
    default: '',
  },
  date: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '文章标题',
  },
  path: {
    type: String,
    default: '/',
  },
});

</script>
