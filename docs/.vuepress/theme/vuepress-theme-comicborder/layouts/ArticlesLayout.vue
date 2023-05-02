<template>
  <Header />
  <main class="page articles-page">
    <!-- <Content /> -->
    <SideBar />
    <div class="content">
      <ul class="articles">
        <li v-for="art of articles" class="article">
          <figure class="pic">
            <img :src="art.coverImg" alt="cover" />
          </figure>
          <a class="info" :href="art.path">
            <div class="left">
              <h3 class="title-txt">{{ art.title }}</h3>
              <p class="desc">{{ art.desc }}</p>
              <time class="create-time" :datetime="art.date">
                <NIcon color="#000000" size="1.25rem"><CalendarOutline /></NIcon>
                <span>{{ art.date }}</span>
              </time>
            </div>
            <div class="right">
              <NIcon size="3rem" color="#000000" ><ArrowForwardCircleSharp /></NIcon>
            </div>
          </a>
        </li>
      </ul>
    </div>
    <Widget />
  </main>
  <Footer />
</template>

<style lang="scss">
@import '../styles/common.scss';
.articles-page {
  display: flex;

  @include normalPage();

  .content {
    flex: 4;

    .articles {
      display: flex;
      flex-direction: column;
      list-style: none;

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

          }
        }
      }
    }
  }
}
</style>

<script setup>
import { usePageData, usePageFrontmatter, useSiteData } from '@vuepress/client';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import SideBar from '../components/SideBar.vue';
import Widget from '../components/Widget.vue';
import { CalendarOutline, ArrowForwardCircleSharp } from '@vicons/ionicons5';
import { NIcon } from 'naive-ui';

const site = useSiteData();
const pageData = usePageData();
const frontmatter = usePageFrontmatter();

console.log('This is ArticlesLayout:-------------------');
console.log('pageData:', pageData.value);
console.log('frontmatter:', frontmatter.value);
console.log('site:', site.value);

const articles = site.value.articlesData.articles;
</script>
