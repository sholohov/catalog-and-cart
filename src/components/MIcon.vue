<template>
  <i
    class="material-icons"
    :style="{
      fontSize: formatSize,
      color: color,
      width: formatSize,
      height: formatSize,
      lineHeight: formatSize
    }"
  >
    <slot />
  </i>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

@Component
export default class MIcon extends Vue {
  name = 'MIcon';

  @Prop({default: 24}) size!: number;
  @Prop() color!: string;

  get formatSize(): string {
    return +this.size ? this.size + 'px' : ''
  }
}
</script>
