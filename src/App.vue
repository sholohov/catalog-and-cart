<template>
  <div class="app">
    <Page>
      <section class="app__section content-area">
        <h1>Каталог / корзина</h1>
        <hr>
        <ul>
          <li>По клику на элемент списка, происходит добавление в корзину, повторно - происходит удаление.</li>
          <li>Диапазон генерации курса валюты в диапазоне 2.4 - 2.6</li>
          <li>Диапазон генерации цен валюты в диапазоне +/- 20% от предыдущей цены</li>
          <li>Цвет ячейки цены отражает отношение новой цены к старой</li>
          <li>При наведении на цену подсказка с предыдущей ценой</li>
        </ul>
        <br>
        <p>
          Курс: <b>1</b> USD = <b>{{ currencyRate }}</b> BYN
        </p>
        <p>
          Сгенерировать:
          <span class="app__btn-group">
            <button
              class="app__generate-btn"
              @click="handleGenerateCurrencyBtn"
            >
              Курс
            </button>
            <button
              class="app__generate-btn"
              @click="handleGeneratePriceBtn"
            >
              Цены товаров
            </button>
          </span>
        </p>
      </section>

      <section class="app__section app__groups">
        <GoodsGroup
          v-for="item in model"
          :key="item.id"
          class="app__groups-item"
          :data="item"
        />
      </section>

      <section class="app__section">
        <ShoppingCart
          v-if="goodsInCart.length"
          :items="goodsInCart"
        />
      </section>
    </Page>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
// components
import ProductCard from "@/components/GoodsGroup.vue";
import GoodsGroup from "@/components/GoodsGroup.vue";
import Page from "@/components/Page.vue";
// other
import * as getRandomInRange from "@/plugins/getRandomInRange";
import {GoodsProps, NamesMapData} from "@/api/GoodsApi";
import {GroupItemProps, GroupProps} from "@/types/groups";
import ShoppingCart from "@/components/ShoppingCart.vue";

const getCurrencyRate = (currency: "USD", val = 1) => {
  if (Number.isNaN(+val)) {
    throw new Error("value is not a number")
  }
  switch (currency) {
    case "USD":
      return +(val * getRandomInRange.float(2.4, 2.6)).toFixed(2)
    default:
      throw new Error('Can`t convert')
  }
}

@Component({
  components: {
    ShoppingCart,
    GoodsGroup,
    Page,
    ProductCard,
  },
})
export default class App extends Vue {
  name = "App"

  names: NamesMapData = {};
  goods: GoodsProps[] = [];
  model: GroupProps[] = []
  currencyRate = getCurrencyRate("USD");

  get goodsInCart(): GroupItemProps[] {
    return this.model.reduce((items, group) => {
      const itemsInCart = group.products.filter(i => i.inCart);
      return [...items, ...itemsInCart]
    }, [] as GroupItemProps[])
  }

  async mounted() {
    await this.loadData()
    this.buildModel();
  }

  buildModel(resetOldPrice = false) {
    const groups: GroupProps[] = []
    this.goods.forEach(g => {
      const groupId = String(g.G);
      const foundIndex = groups.findIndex(i => i.id === groupId);
      const groupNames = this.names[groupId] || {}
      if (foundIndex === -1) {
        groups.push({
          id: groupId,
          name: groupNames.G,
          products: []
        })
      }
      const productId = String(g.T);
      const productNames = groupNames.B[productId] || {};
      if (!groups.length) return
      const prevProduct = this.model.find(i => i.id === groupId)?.products.find(i => i.id === productId)
      groups[groups.length - 1].products.push({
        id: productId,
        title: productNames.N,
        groupName: groupNames.G,
        quantity: 1,
        pricePrev: !resetOldPrice ? prevProduct?.price : undefined,
        inStock: g.P,
        price: +(this.currencyRate * g.C).toFixed(2),
        inCart: false
      })
    })
    this.model = groups;
  }

  async loadData() {
    try {
      const resolved = await Promise.all([this.fetchNames(), this.fetchGoods()]);
      this.names = resolved[0];
      this.goods = resolved[1];
    } catch (e) {
      const message = e?.message || 'Что то пошло не так'
      alert("загрузка данных: " + message)
    }
  }

  async fetchNames(): Promise<NamesMapData> {
    return await this.$api.goods.names();
  }

  async fetchGoods(): Promise<GoodsProps[]> {
    return (await this.$api.goods.list()).Goods;
  }

  handleGenerateCurrencyBtn() {
    this.currencyRate = getCurrencyRate("USD")
    this.buildModel(true);
  }

  changePrice() {
    const newPrice = (v: number) => getRandomInRange.float(v / 0.9, v * 0.9)
    this.goods = this.goods.map(i => ({...i, C: newPrice(i.C)}))
  }

  handleGeneratePriceBtn() {
    this.changePrice()
    this.buildModel()
  }
}
</script>

<style lang="scss">
.app {
  $this: ".app";

  min-height: 100vh;
  background-color: $bg-color-darken;

  &__section {
    margin: 20px 0 0;
  }

  &__groups {
    columns: 2;
    column-gap: 10px;

    @include wmax($qm-tablet) {
      columns: 1;
    }
  }

  &__groups-item {
    margin: 0 0 10px;
    break-inside: avoid;
  }

  &__btn-group {
    margin: -4px;
  }

  &__generate-btn {
    @extend %resetButton;
    background-color: $primary;
    color: $bg-color;
    padding: 0.25em 0.5em;
    text-align: center;
    text-decoration: none;
    display: inline-flex;
    font-size: 16px;
    margin: 4px;
    cursor: pointer;
    border: 2px solid $primary;
    border-radius: 3px;
    font-weight: 500;

    &:hover {
      opacity: 0.9;
    }

    &:focus {
      border-color: rgba($text-color, 0.5);
    }
  }
}
</style>
