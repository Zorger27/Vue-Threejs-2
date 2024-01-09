<script>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import ToggleFullScreen from "@/components/util/ToggleFullScreen.vue";
import CanvasFullScreen from "@/components/util/CanvasFullScreen.vue";

export default {
  name: 'ThreeScene01',
  components: {CanvasFullScreen, ToggleFullScreen},
  setup() {
    const canvasContainer = ref(null);
    let scene, camera, renderer, cube;

    const init = () => {
      // Создаем сцену
      scene = new THREE.Scene();

      // Создаем камеру
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 3;

      // Создаем рендерер
      // renderer = new THREE.WebGLRenderer();
      renderer = new THREE.WebGLRenderer({ alpha: true });
      // renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setSize(window.innerWidth, window.innerHeight);


      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;

      scene.add(camera);

      // Создаем геометрию и материал для куба
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const materials = [
        new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 1 }),
        new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 1 }),
        new THREE.MeshBasicMaterial({ color: 0x0000ff, transparent: true, opacity: 1 }),
        new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 1 }),
        new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 1 }),
        new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 1 }),
      ];
      cube = new THREE.Mesh(geometry, materials);

      // Добавляем куб на сцену
      scene.add(cube);

      // Добавляем рендерер в контейнер
      canvasContainer.value.appendChild(renderer.domElement);

      // Обновляем сцену
      const animate = () => {
        requestAnimationFrame(animate);

        // Обновление контроллеров для вращения сцены
        controls.update();

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render(scene, camera);
      };

      animate();
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      // renderer.render(scene, camera);
    };

    // const fullScreenView = () => {
    //   const canvasContainerElement = canvasContainer.value;
    //
    //   if (document.fullscreenElement) {
    //     document.exitFullscreen();
    //   } else {
    //     if (canvasContainerElement.requestFullscreen) {
    //       canvasContainerElement.requestFullscreen();
    //     } else if (canvasContainerElement.mozRequestFullScreen) { // Firefox
    //       canvasContainerElement.mozRequestFullScreen();
    //     } else if (canvasContainerElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
    //       canvasContainerElement.webkitRequestFullscreen();
    //     } else if (canvasContainerElement.msRequestFullscreen) { // IE/Edge
    //       canvasContainerElement.msRequestFullscreen();
    //     }
    //   }
    // };

    window.addEventListener('resize', onWindowResize);

    // window.addEventListener('keydown', (event) => {
    //   if ((event.key === 'Backspace' || event.key === ' ') && document.fullscreenElement) {
    //     document.exitFullscreen().catch((error) => {
    //       // Обработка ошибки, если произошла
    //       console.error('Exit fullscreen error:', error.message);
    //     });
    //   }
    // });

    onMounted(() => {
      init();
      onWindowResize();
    });

    onUnmounted(() => {
      // Выполняем необходимые действия при удалении компонента
      // Например, очищаем ресурсы Three.js
      renderer.dispose();
    });

    return {
      canvasContainer
      // fullScreenView,
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
  background: linear-gradient(to bottom, rgb(229, 255, 229), rgb(250, 247, 234)) no-repeat center;
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
  }
}
</style>
