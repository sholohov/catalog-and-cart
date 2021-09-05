<template>
  <div class="app">
    <Page>
      <section class="content-area">
        <h1>Тeстовое Задание для SoftCorp</h1>
        <hr>
        <p>Курс рубля: <b>1</b> USD = <b>{{ currencyRate }}</b> BYN</p>
        <button title="Случайное значение" @click="handleChangeCurrencyBtn">Изменить</button>
      </section>

      <section class="app__groups">
        <GoodsGroup
          class="app__groups-item"
          :data="item"
          :key="item.id"
          v-for="item in model"
        />
      </section>
      <ShoppingCart v-if="goodsInCart.length" :items="goodsInCart" />
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

  mounted() {
    this.loadData()
  }

  buildModel() {
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
      groups[groups.length - 1].products.push({
        id: productId,
        title: productNames.N,
        groupName: groupNames.G,
        quantity: 1,
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
      this.buildModel();
    } catch (e) {
      const message= e?.message || 'Что то пошло не так'
      alert("загрузка данных: " + message)
    }
  }

  async fetchNames(): Promise<NamesMapData> {
    return await this.$api.goods.names();
  }

  async fetchGoods(): Promise<GoodsProps[]> {
    return (await this.$api.goods.list()).Goods;
  }

  handleChangeCurrencyBtn() {
    this.currencyRate = getCurrencyRate("USD")
    this.buildModel();
  }
}
</script>

<style lang="scss">
.app {
  min-height: 100vh;
  background-color: $bg-color-darken;

  &__groups {
    margin: 20px 0 0;
    columns: 2;
    column-gap: 10px;

    @include wmax($qm-tablet){
      columns: 1;
    }
  }

  &__groups-item {
    margin: 0 0 10px;
    break-inside: avoid;
  }
}
</style>
