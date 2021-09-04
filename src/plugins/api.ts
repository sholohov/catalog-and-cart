import _Vue from 'vue';
import Api from "@/api";

export default {
  install: (Vue: typeof _Vue, options?: any) => {
    Vue.prototype.$api = new Api();
  }
}