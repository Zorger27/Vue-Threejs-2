<script>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import ToggleFullScreen from "@/components/util/ToggleFullScreen.vue";
import CanvasFullScreen from "@/components/util/CanvasFullScreen.vue";
import {openGraphMixin} from "@/assets/ogimage/openGraphMixin";

export default {
  name: 'Project3',
  components: {CanvasFullScreen, ToggleFullScreen},
  mixins: [openGraphMixin],
  mounted() {
    const title = '3D cube v.2.0';
    const metaDescription = 'Rotating 3D Cube';
    const description = 'Rotating 3D cube v.2.0';
    const imageUrl = 'https://vue-threejs-2.vercel.app/assets/ogimage/bmp/project3.jpg';
    const url = 'https://vue-threejs-2.vercel.app/cube2';

    // Dynamically set open graph tags
    this.setOpenGraphTags(metaDescription, title, description, imageUrl, url);
    },
  methods: {},
  setup() {
    const canvasContainer = ref(null);
    let scene, camera, renderer, cube, controls;

    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 0, 2.5);

      renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.enablePan = false;
      controls.enableZoom = true;

      controls.autoRotate = true;
      controls.autoRotateSpeed = 5.0;

      const textureLoader = new THREE.TextureLoader();
      // Загрузка текстур
      const textureRight = textureLoader.load('/assets/img/cube2/right.webp');
      const textureLeft = textureLoader.load('/assets/img/cube2/left.webp');
      const textureFront = textureLoader.load('/assets/img/cube2/front.webp');
      const textureBack = textureLoader.load('/assets/img/cube2/back.webp');
      const textureBottom = textureLoader.load('/assets/img/cube2/bottom.webp');
      const textureTop = textureLoader.load('/assets/img/cube2/top.webp');

      // Поворот UV-координат для текстуры
      textureBack.center = new THREE.Vector2(0.5, 0.5);
      textureBack.rotation = Math.PI;
      textureBack.needsUpdate = true;

      textureLeft.center = new THREE.Vector2(0.5, 0.5);
      textureLeft.rotation = Math.PI / 2; // Поворот на 90 градусов
      textureLeft.needsUpdate = true;

      textureRight.center = new THREE.Vector2(0.5, 0.5);
      textureRight.rotation = -Math.PI / 2; // Поворот на -90 градусов
      textureRight.needsUpdate = true;

      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const materials = [
        new THREE.MeshBasicMaterial({ map: textureRight }),
        new THREE.MeshBasicMaterial({ map: textureLeft }),
        new THREE.MeshBasicMaterial({ map: textureFront }),
        new THREE.MeshBasicMaterial({ map: textureBack }),
        new THREE.MeshBasicMaterial({ map: textureBottom }),
        new THREE.MeshBasicMaterial({ map: textureTop }),
      ];

      cube = new THREE.Mesh(geometry, materials);

      // Устанавливаем углы Эйлера (в радианах) для наклона
      const euler = new THREE.Euler(Math.PI / 2, 0.25, 0);
      cube.setRotationFromEuler(euler);

      scene.add(cube);

      canvasContainer.value.appendChild(renderer.domElement);

      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };

      animate();
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', onWindowResize);

    onMounted(() => {
      init();
      onWindowResize();
    });

    onUnmounted(() => {
      renderer.dispose();
    });

    return {
      canvasContainer
    };
  },
}
</script>

<template>
  <div class="container">
    <h1>{{ $t('project3.name') }} <CanvasFullScreen :canvasContainer="canvasContainer"></CanvasFullScreen> <ToggleFullScreen></ToggleFullScreen></h1>
    <line></line>
    <div class="scene-container" ref="canvasContainer"></div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  flex: 1 0 auto;
  background: linear-gradient(to bottom, rgb(229, 251, 255), rgb(255, 240, 244)) no-repeat center;
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
    .fa.fa-expand-arrows-alt {display: none;}  }
}
</style>
