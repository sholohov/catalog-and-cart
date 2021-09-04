<template>
  <div class="shopping-cart">
    <ul class="shopping-cart__list">
      <li class="shopping-cart__item shopping-cart__item--header">
        <span class="shopping-cart__param">Наименование товара и описание</span>
        <span class="shopping-cart__param">Количество</span>
        <span class="shopping-cart__param">Цена</span>
        <span class="shopping-cart__param"></span>
      </li>
      <li :key="item.id" class="shopping-cart__item" v-for="item in items">
        <span class="shopping-cart__param shopping-cart__title">
          {{ item.groupName }}. {{ item.title }}
        </span>
        <span class="shopping-cart__param shopping-cart__quantity">
          <input
            min="1"
            class="shopping-cart__quantity-input"
            type="number"
            v-model="item.quantity"
            @input="handleQuantityInput(item)"
          />
        </span>
        <span class="shopping-cart__param shopping-cart__price">
          <b class="shopping-cart__price-currency">{{ item.price }} руб.</b> / шт.
        </span>
        <span class="shopping-cart__param shopping-cart__actions">
          <button class="shopping-cart__delete" @click="handleDelete(item)">Удалить</button>
        </span>
      </li>
    </ul>
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
  }

  &__item {
    display: grid;
    grid-template-columns: 3fr 120px 1fr 100px;

    &:not(:last-child) {
      border-bottom: 1px solid $blue-grey-50;
    }

    &--header {
      color: $text-color--light;
    }
  }

  &__param {
    padding: 14px 10px;
  }

  &__title {
  }

  &__quantity {
  }

  &__quantity-input {
    box-sizing: border-box;
    width: 100%;
    border: 1px solid $blue-grey-100;
    background-color: $bg-color;
    appearance: none;
    padding: 8px;

    &:focus {
      outline: none;
      border: 1px solid $blue-grey;
    }
  }

  &__price {
    color: $text-color--light;
  }

  &__price-currency {
    color: $text-color;
  }

  &__actions {
  }

  &__delete {
    @extend %resetButton;

    color: $primary;
    cursor: pointer;

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
