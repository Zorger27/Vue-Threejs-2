<template>
  <div id="app">
    <Header v-if="!is404Page"/>
    <router-view @route-update="updateIs404Page"></router-view>
    <Footer v-if="!is404Page"/>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Header from "@/components/layout/Header.vue";
import Footer from "@/components/layout/Footer.vue";
import "@/assets/style/global.scss";
import "@/assets/style/fontawesome-free-6.5.1/css/all.min.css";

export default {
  name: 'App',
  components: { Header, Footer },
  setup() {
    const route = useRoute();
    const is404Page = ref(route.name === 'PageNotFound');

    // Функция обновления состояния 404
    const updateIs404Page = (newValue) => {
      is404Page.value = newValue;
    };

    // Обновляем is404Page при изменении маршрута
    watch(
      () => route.name,
      (newRouteName) => {
        is404Page.value = newRouteName === 'PageNotFound';
      }
    );

    return { is404Page, updateIs404Page };
  }
}
</script>

<style lang="scss">

</style>
