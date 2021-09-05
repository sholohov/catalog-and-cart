<template>
  <div class="goods-group">
    <h4 class="goods-group__name">
      <button
        class="goods-group__expand"
        @click="handleExpandBtn"
      >
        <MIcon
          class="goods-group__expand-icon"
          :class="[!contentVisible ? 'is-rotate' : '']"
        >
          expand_less
        </MIcon>
        {{ data.name }}
      </button>
    </h4>
    <transition
      name="goods-group__product-list-"
    >
      <ul
        v-if="data.products && contentVisible"
        class="goods-group__product-list"
      >
        <li
          v-for="product in data.products"
          :key="product.id"
          class="goods-group__product"
        >
          <button
            class="goods-group__add"
            :class="[product.inCart ? 'is-active' : '']"
            @click="handleAddBtn(product)"
          >
            <span class="goods-group__product-title">
              {{ product.title }} ({{ product.inStock }})
            </span>
            <b
              class="goods-group__product-price"
              :class="[getPriceClassName(product)]"
              :title="product.pricePrev ? 'старая цена: ' + product.pricePrev : ''"
            >
              {{ product.price }}
            </b>
          </button>
        </li>
      </ul>
    </transition>
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
  contentVisible = true;

  handleAddBtn(product: GroupItemProps) {
    product.inCart = !product.inCart;
  }

  getPriceClassName(product: GroupItemProps): string {
    const cur = product.price;
    const prev = product.pricePrev;
    if (!prev || prev === cur) return ""
    return cur < prev ? "has-dropped" : "has-risen"
  }

  handleExpandBtn() {
    this.contentVisible = !this.contentVisible
  }
}
</script>

<style lang="scss">
.goods-group {
  $this: ".goods-group";

  border: 2px solid $blue-grey-200;
  border-radius: 4px;
  background-color: $bg-color;

  &__name {
    display: flex;
    align-items: center;
    margin: 0;
    font-size: 18px;
  }

  &__expand {
    @extend %resetButton;
    display: inline-flex;
    cursor: pointer;
    flex: auto;
    padding: 3px 6px;
    background-color: $blue-grey-100;

    &:hover {
      opacity: 0.9;
    }
  }

  &__expand-icon {
    margin: 0 4px 0 0;
    transition: transform .3s;

    &.is-rotate {
      transform: scale(1, -1);
    }
  }

  &__product-list {
    list-style: none;
    padding: 0;
    margin: 0;
    border-top: 1px solid $blue-grey-200;

    &--enter-active {
      transition: all .5s;
    }
    &--leave-active {
      transition: all .3s;
    }

    &--enter, &--leave-to {
      opacity: 0;
    }
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
    padding: 8px 12px;
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

    &.has-dropped {
      background-color: rgba($green, 0.1);
    }

    &.has-risen {
      background-color: rgba($red, 0.1);
    }
  }
}
</style>
