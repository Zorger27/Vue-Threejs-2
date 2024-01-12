<script>
import ToggleFullScreen from "@/components/util/ToggleFullScreen.vue";
import CanvasFullScreen from "@/components/util/CanvasFullScreen.vue";

// import { ref, onMounted, onUnmounted } from 'vue';
// import * as THREE from 'three';
// import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
export default {
  name: 'Project1',
  components: {CanvasFullScreen, ToggleFullScreen},
  mounted() {
    // Динамически устанавливаем og:image в соответствии с текущей картинкой
    const currentImage = 'https://vue-threejs-2.vercel.app/assets/ogimage/project1.jpg';
    this.setOpenGraphImage(currentImage);
  },
  methods: {
    setOpenGraphImage(imageUrl) {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:image');
      meta.setAttribute('content', imageUrl);

      // Удаляем старые метатеги og:image, если они есть
      const existingMetaTags = document.querySelectorAll('meta[property="og:image"]');
      existingMetaTags.forEach((tag) => tag.remove());

      // Добавляем новый метатег og:image
      document.head.appendChild(meta);
    },
  },
}
</script>

<template>
  <div class="container">
    <h1>{{ $t('project1.name') }} <CanvasFullScreen :canvasContainer="canvasContainer"></CanvasFullScreen> <ToggleFullScreen></ToggleFullScreen></h1>
    <line></line>
    <div class="scene-container" ref="canvasContainer"></div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  flex: 1 0 auto;
  background: linear-gradient(to bottom, rgb(255, 249, 229), rgb(255, 240, 244)) no-repeat center;
  h1 {font-size: 2.5rem;margin: 0.7rem auto;color: black;}
  .scene-container {
    max-height: 70vh;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

@media(max-width: 1020px) {
  .container {
    h1 {font-size: 2.3rem;margin: 0.6rem auto;}
  }
}

@media (max-width: 768px) {
  .container {
    h1 {font-size: 2rem;margin: 0.5rem auto;}
    .fa.fa-expand {display: none;}  }
}
</style>
