<template>
  <div class="shopping-cart">
    <transition-group
      tag="ul"
      name="shopping-cart__item-"
      class="shopping-cart__list"
    >
      <li
        key="shopping-cart__header"
        class="shopping-cart__item shopping-cart__item--header"
      >
        <span class="shopping-cart__param">Наименование товара и описание</span>
        <span class="shopping-cart__param">Количество</span>
        <span class="shopping-cart__param">Цена</span>
        <span class="shopping-cart__param" />
      </li>
      <li
        v-for="item in items"
        :key="item.id"
        class="shopping-cart__item"
      >
        <span class="shopping-cart__param shopping-cart__param--title">
          {{ item.groupName }}. {{ item.title }}
        </span>
        <span class="shopping-cart__param shopping-cart__param--quantity">
          <input
            v-model="item.quantity"
            min="1"
            class="shopping-cart__quantity-input"
            type="number"
            @change="handleQuantityInput(item)"
          > шт.
        </span>
        <span class="shopping-cart__param shopping-cart__param--price">
          <b class="shopping-cart__price-currency">{{ item.price }} руб.</b> / шт.
        </span>
        <span class="shopping-cart__param shopping-cart__param--actions">
          <button
            class="shopping-cart__delete"
            @click="handleDelete(item)"
          >Удалить</button>
        </span>
      </li>
    </transition-group>
    <div class="shopping-cart__total">
      Общая стоимость: <b class="shopping-cart__total-num">{{ total }} руб.</b>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {GroupItemProps} from "@/types/groups";
import MIcon from "@/components/MIcon.vue";

@Component({
  components: {MIcon}
})
export default class ShoppingCart extends Vue {
  name = "ShoppingCart";

  @Prop({required: true}) items!: GroupItemProps[]

  get total(): string {
    const sum = this.items.reduce((sum, cur) => {
      return sum + (cur.price * cur.quantity || 0)
    }, 0)
    return Number(sum.toFixed(2)).toLocaleString()
  }

  handleDelete(item: GroupItemProps) {
    item.inCart = false;
  }

  handleQuantityInput(item: GroupItemProps) {
    if (!item.quantity) item.quantity = 1
  }
}
</script>

<style lang="scss">
.shopping-cart {
  $this: ".shopping-cart";
  background-color: $bg-color;
  padding: 20px;
  border: 2px solid $blue-grey-200;
  border-radius: 4px;

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
    overflow-x: auto;
  }

  &__item {
    min-width: 640px;
    display: grid;
    grid-template-columns: 3fr 1fr 1fr 100px;
    transition: all 0.3s;

    &--enter-active, &--leave-active {
      transition: all 0.3s;
    }

    &--enter, &--leave-to {
      opacity: 0;
      transform: translateX(-30px);
    }

    &:not(:last-child) {
      border-bottom: 1px solid $blue-grey-50;
    }

    &--header {
      color: $text-color--light;
    }

    @include wmax($qm-tablet) {
      grid-template-columns: 3fr 120px 150px 100px;
    }
  }

  &__param {
    padding: 14px 10px;

    &--price {
      color: $text-color--light;
    }

    &--quantity {
      color: $text-color--light;
    }
  }

  &__quantity-input {
    box-sizing: border-box;
    width: 60px;
    border: 1px solid $blue-grey-100;
    background-color: $bg-color;
    appearance: none;
    padding: 8px;

    &:focus {
      outline: none;
      border: 1px solid $blue-grey;
    }

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      appearance: none;
    }
  }

  &__price-currency {
    color: $text-color;
  }

  &__delete {
    @extend %resetButton;

    color: $primary;
    cursor: pointer;
    height: 28px;
    padding: 0 6px;

    &:focus {
      background-color: rgba($primary, 0.1);
    }

    &:hover {
      opacity: 0.7;
    }
  }

  &__total {
    padding: 14px 10px;
    display: flex;
    justify-content: flex-end;
    align-items: baseline;
    color: $text-color--light;
  }

  &__total-num {
    margin: 0 0 0 0.3em;
    color: $orange;
    font-size: 18px;
  }
}
</style>
