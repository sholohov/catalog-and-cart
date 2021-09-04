<template>
  <div class="goods-group">
    <h4 class="goods-group__name">
      <MIcon class="goods-group__expand">expand_less</MIcon>
      {{ data.name }}
    </h4>
    <ul v-if="data.products" class="goods-group__product-list">
      <li class="goods-group__product" :key="product.id" v-for="product in data.products">
        <button
          class="goods-group__add"
          :class="[product.inCart ? 'is-active' : '']"
          @click="handleAddBtn(product)
        ">
          <span class="goods-group__product-title">
            {{ product.title }} ({{ product.inStock }})
          </span>
          <b class="goods-group__product-price">{{ product.price }}</b>
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {GroupItemProps, GroupProps} from "@/types/groups";
import MIcon from "@/components/MIcon.vue";

@Component({
  components: {MIcon}
})
export default class GoodsGroup extends Vue {
  name = "GoodsGroup";

  @Prop({required: true}) data!: GroupProps

  handleAddBtn(product: GroupItemProps) {
    product.inCart = !product.inCart;
  }
}
</script>

<style lang="scss">
.goods-group {
  $this: ".goods-group";

  border: 2px solid $blue-grey-200;
  border-radius: 4px;
  background-color: $bg-color;

  &__expand {
    margin: 0 4px 0 0;
  }

  &__name {
    display: flex;
    align-items: center;
    padding: 3px 6px;
    margin: 0;
    font-size: 18px;
    background-color: $blue-grey-100;
    border-bottom: 1px solid $blue-grey-200;
  }

  &__product-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  &__add {
    @extend %resetButton;
    display: flex;
    align-items: stretch;
    width: 100%;
    cursor: pointer;

    &.is-active {
      background-color: rgba($amber, 0.3);
    }

    &:not(.is-active):hover {
      background-color: rgba($primary, 0.05);
    }
  }

  &__product {
    &:not(:last-child) {
      border-bottom: 1px solid $blue-grey-200;
    }
  }

  &__product-title,
  &__product-price {
    padding: 8px 16px;
  }

  &__product-title {
    flex: auto;
  }

  &__product-price {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    background-color: rgba($primary, 0.1);
  }
}
</style>
