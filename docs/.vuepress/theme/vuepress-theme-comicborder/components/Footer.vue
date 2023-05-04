<template>
  <footer class="footer">
    <component class="c-footer-html" is="div" v-if="matter.footerHtml" v-html="matter.footer" />
    <template v-else>
      <div class="copyright">Copyright &copy;2023 {{ site.title }}, All Rights Reversed</div>
      <div class="power-by">Powered by <a href="https://v2.vuepress.vuejs.org/zh/" target="_blank">Vuepress</a></div>
    </template>
  </footer>
</template>

<style lang="scss">
.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 9rem;

  // background-color: rgba(242, 183, 5, 0.2);

  .copyright {
    font-size: 0.875rem;
    margin-bottom: 0.625rem;
    font-weight: var(--theme-font-bold);
  }

  .power-by {
    font-size: 0.875rem;
    font-weight: var(--theme-font-bold);

    a {
      color: #3eaf7c;

      &:hover {
        color: #4abf8a;
      }
    }
  }
}
</style>

<script setup>
import { usePageFrontmatter, useSiteData } from '@vuepress/client';

const matter = usePageFrontmatter();
const site = useSiteData();
</script>
