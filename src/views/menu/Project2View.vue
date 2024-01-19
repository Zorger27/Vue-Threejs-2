<script>
import {onMounted, onUnmounted, ref} from "vue";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import ToggleFullScreen from "@/components/util/ToggleFullScreen.vue";
import CanvasFullScreen from "@/components/util/CanvasFullScreen.vue";
import {openGraphMixin} from "@/assets/ogimage/openGraphMixin";

export default {
  name: 'Project2',
  components: {CanvasFullScreen, ToggleFullScreen},
  mixins: [openGraphMixin],
  mounted() {
    const metaDescription = 'Rotating 3D Cube v.3.0';
    const title = '3D cube v.3.0';
    const description = 'Rotating 3D cube v.3.0';
    const imageUrl = 'https://vue-threejs-2.vercel.app/assets/ogimage/bmp/project2.jpg';
    const url = 'https://vue-threejs-2.vercel.app';

    // Dynamically set open graph tags
    this.setOpenGraphTags(metaDescription, title, description, imageUrl, url);
    },
  methods: {},
  setup() {
    const canvasContainer = ref(null);
    let scene, camera, renderer, controls;
    let rotationPaused = false;

    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 0, 7);

      renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      canvasContainer.value.appendChild(renderer.domElement);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.enablePan = false;
      controls.enableZoom = true;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 5.0;

      // Создаем маленький кубик
      const smallCubeGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);

      function createTexturedCube(x, y, z, texturePath) {
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(texturePath);

        const material = new THREE.MeshBasicMaterial({ map: texture });
        const cubeClone = new THREE.Mesh(smallCubeGeometry, material);
        cubeClone.position.set(x, y, z);

        return cubeClone;
      }

      // Создаем главный куб, состоящий из 27 маленьких кубиков

      // Первый куб
      const mainCube1 = new THREE.Group();

      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          for (let z = -1; z <= 1; z++) {
            let cube;

            if (x === 1 && y === 1 && z === 0) {
              cube = createTexturedCube(x, y, z, '/assets/img/cube2/top.webp');
            } else if (x === -1 && y === -1 && z === 0) {
              cube = createTexturedCube(x, y, z, '/assets/img/cube2/bottom.webp');
            } else if (x === 1 && y === -1 && z === 1) {
              cube = createTexturedCube(x, y, z, '/assets/background/background01.webp');
            } else {
              const randomColor = new THREE.Color(Math.random(), Math.random(), Math.random());
              const smallCubeMaterial = new THREE.MeshBasicMaterial({ color: randomColor });
              cube = new THREE.Mesh(smallCubeGeometry, smallCubeMaterial);
              cube.position.set(x, y, z);
            }

            mainCube1.add(cube);
          }
        }
      }

      // Устанавливаем позицию для первого куба
      mainCube1.position.x = -2;

      // Второй куб
      const mainCube2 = new THREE.Group();
      const smallCubeSize = 0.8; // Размер маленького кубика

      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          for (let z = -1; z <= 1; z++) {
            const randomColor = new THREE.Color(Math.random(), Math.random(), Math.random());
            const smallCubeMaterial = new THREE.MeshBasicMaterial({ color: randomColor });
            const cubeClone = new THREE.Mesh(smallCubeGeometry, smallCubeMaterial);
            cubeClone.position.set(x * smallCubeSize, y * smallCubeSize, z * smallCubeSize);

            mainCube2.add(cubeClone);
          }
        }
      }

      // Устанавливаем позицию для второго куба
      mainCube2.position.x = 2;

      // Добавляем оба куба в сцену
      scene.add(mainCube1);
      scene.add(mainCube2);

      // Устанавливаем углы Эйлера (в радианах) для наклона
      const euler = new THREE.Euler(Math.PI / 2, 0.25, 0);
      const euler2 = new THREE.Euler(Math.PI / 4, Math.PI / 4, 0);
      mainCube1.setRotationFromEuler(euler);
      mainCube2.setRotationFromEuler(euler2);

      const animate = () => {
        if (rotationPaused) {
          // Если вращение на паузе, не вызываем анимацию
          return;
        }
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };

      // Добавляем обработчик событий для двойного щелчка мыши
      canvasContainer.value.addEventListener('dblclick', () => {
        rotationPaused = !rotationPaused; // Инвертируем состояние флага

        if (!rotationPaused) {
          // Если вращение возобновляется, снова вызываем анимацию
          animate();
        }
      });

      animate(); // Начинаем анимацию сразу после определения функции
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
    <h1>{{ $t('project2.name') }} <CanvasFullScreen :canvasContainer="canvasContainer"></CanvasFullScreen> <ToggleFullScreen></ToggleFullScreen></h1>
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
