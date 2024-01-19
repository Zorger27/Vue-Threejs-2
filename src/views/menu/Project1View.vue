<script>
import {onMounted, onUnmounted, ref} from "vue";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import ToggleFullScreen from "@/components/util/ToggleFullScreen.vue";
import CanvasFullScreen from "@/components/util/CanvasFullScreen.vue";
import {openGraphMixin} from "@/assets/ogimage/openGraphMixin";

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
  setup() {
    const canvasContainer = ref(null);
    let scene, camera, renderer, cube, controls;

    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 0, 5);

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
      const smallCubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const smallCube = new THREE.Mesh(smallCubeGeometry, smallCubeMaterial);

      function createTexturedCube(x, y, z, texturePath) {
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(texturePath);

        const material = new THREE.MeshBasicMaterial({ map: texture });
        const cubeClone = new THREE.Mesh(smallCubeGeometry, material);
        cubeClone.position.set(x, y, z);

        return cubeClone;
      }

      // Создаем главный куб, состоящий из 27 маленьких кубиков
      const mainCube = new THREE.Group();

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

            mainCube.add(cube);
          }
        }
      }

      scene.add(mainCube);

      // Устанавливаем углы Эйлера (в радианах) для наклона
      const euler = new THREE.Euler(Math.PI / 2, 0.25, 0);
      // const euler = new THREE.Euler(Math.PI / 4, Math.PI / 4, 0);
      mainCube.setRotationFromEuler(euler);

      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };

      animate();
    };

    // const stopRotationAndEnlarge = (event) => {
    //   // Остановить вращение
    //   controls.autoRotate = false;
    //
    // // Получить позицию клика внутри холста
    // const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    // const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    //
    // // Определить объект, на который кликнули
    // const raycaster = new THREE.Raycaster();
    // raycaster.setFromCamera({x: mouseX, y: mouseY}, camera);
    // const intersects = raycaster.intersectObjects([cube]);
    //
    // // Если есть пересечение с кубом, повернуть его и увеличить на 20%
    // if (intersects.length > 0) {
    //   const intersection = intersects[0];
    //   const face = intersection.face;
    //
    //   // Вычислить нормаль касательной к поверхности куба
    //   const normal = face.normal.clone().applyQuaternion(cube.quaternion);
    //
    //   // Вычислить угол поворота для выравнивания куба с плоскостью касательной
    //   const angle = Math.atan2(normal.y, normal.x);
    //
    //   // Увеличить куб на 20%
    //   cube.scale.multiplyScalar(1.2);
    //
    //   // Повернуть куб в вычисленный угол
    //   cube.rotation.z = angle;
    //   cube.rotation.y = Math.PI / 2 - angle;
    //
    //   // Удалить обработчик событий после первого клика
    //   canvasContainer.value.removeEventListener('dblclick', stopRotationAndEnlarge);
    //   }
    // }

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

      // Обработчик двойного клика при загрузке компонента
      // canvasContainer.value.addEventListener('dblclick', stopRotationAndEnlarge);
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
