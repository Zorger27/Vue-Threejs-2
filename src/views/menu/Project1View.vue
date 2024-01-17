<script>
import ToggleFullScreen from "@/components/util/ToggleFullScreen.vue";
import CanvasFullScreen from "@/components/util/CanvasFullScreen.vue";
import {openGraphMixin} from "@/assets/ogimage/openGraphMixin";

// import { ref, onMounted, onUnmounted } from 'vue';
// import * as THREE from 'three';
// import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
export default {
  name: 'Project1',
  components: {CanvasFullScreen, ToggleFullScreen},
  mixins: [openGraphMixin],
  mounted() {
    const metaDescription = 'Rotating 3D Cube';
    const title = '3D cube Newest';
    const description = 'Rotating 3D cube Newest';
    const imageUrl = 'https://vue-threejs-2.vercel.app/assets/ogimage/bmp/project1.jpg';
    const url = 'https://vue-threejs-2.vercel.app';

    // Dynamically set open graph tags
    this.setOpenGraphTags(metaDescription, title, description, imageUrl, url);
    },
  methods: {},
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
