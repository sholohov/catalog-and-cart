import Api from "@/api";

declare module 'vue/types/vue' {
  interface Vue {
    $api: Api
  }
}