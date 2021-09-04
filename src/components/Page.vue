<template>
  <div class="page">
    <header class="page__header">
      <slot name="header" />
    </header>
    <main class="page__content">
      <slot />
    </main>
    <main class="page__footer">
      <slot name="footer"/>
    </main>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';

@Component
export default class Page extends Vue {
}
</script>

<style lang="scss">
.page {
  padding: 40px;
  min-height: 100%;

  @media screen and (max-width: 1024px){
    padding: 20px;
  }

  &__content {
    min-height: 100%;
    margin: auto;
    max-width: 1400px;
  }
}
</style>
