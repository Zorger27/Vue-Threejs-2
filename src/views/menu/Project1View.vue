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
    let scene, camera, renderer, controls;
    let rotationPaused = false;

    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 0, 8);

      renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      canvasContainer.value.appendChild(renderer.domElement);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.enablePan = false;
      controls.enableZoom = true;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 2.0;

      // Создаем маленький кубик
      const smallCubeGeometry1 = new THREE.BoxGeometry(0.8, 0.8, 0.8);

      function createTexturedCube(x, y, z, texturePath) {
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(texturePath);

        const material = new THREE.MeshBasicMaterial({ map: texture });
        const cubeClone = new THREE.Mesh(smallCubeGeometry1, material);
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
            } else if (x === -1 && y === 1 && z === -1) {
              cube = createTexturedCube(x, y, z, '/assets/background/background02.webp');
            } else {
              const randomColor = new THREE.Color(Math.random(), Math.random(), Math.random());
              const smallCubeMaterial = new THREE.MeshBasicMaterial({ color: randomColor });
              cube = new THREE.Mesh(smallCubeGeometry1, smallCubeMaterial);
              cube.position.set(x, y, z);
            }

            mainCube1.add(cube);
          }
        }
      }

      scene.add(mainCube1);

      // Устанавливаем углы Эйлера (в радианах) для наклона
      const euler = new THREE.Euler(Math.PI / 2, 0.25, 0);
      mainCube1.setRotationFromEuler(euler);

      // Второй куб
      const mainCube2 = new THREE.Group();
      const smallCubeSize = 0.2;
      // Создаем маленький кубик для mainCube2
      const smallCubeGeometry2 = new THREE.BoxGeometry(smallCubeSize, smallCubeSize, smallCubeSize);

      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          for (let z = -1; z <= 1; z++) {
            const randomColor = new THREE.Color(Math.random(), Math.random(), Math.random());
            const smallCubeMaterial = new THREE.MeshBasicMaterial({ color: randomColor });
            const cubeClone = new THREE.Mesh(smallCubeGeometry2, smallCubeMaterial);
            cubeClone.position.set(x * smallCubeSize, y * smallCubeSize, z * smallCubeSize);
            mainCube2.add(cubeClone);
          }
        }
      }

      // Параметры орбиты для mainCube2
      const semiMajorAxis2 = 4; // Большая полуось
      const semiMinorAxis2 = 2.7; // Малая полуось
      const orbitSpeed2 = 0.3; // Скорость обращения вокруг mainCube1
      const orbitAngle2 = 0; // Устанавливаем угол начальной орбиты
      const orbitDirection2 = 1; // Направление вращения (1 или -1)

      mainCube2.position.set(semiMajorAxis2 * Math.cos(orbitAngle2), 0, semiMinorAxis2 * Math.sin(orbitAngle2));

      // Создаем материал для линии
      // const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x00aaff });
      const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x00aaff, linewidth: 2 });

      // Создаем геометрию для линии орбиты mainCube2
      const orbitGeometry2 = new THREE.BufferGeometry();
      const orbitPoints2 = [];

      // Добавляем точки орбиты для mainCube2
      for (let i = 0; i <= 360; i++) {
        const angle = (i * Math.PI) / 180;
        const x = semiMajorAxis2 * Math.cos(angle);
        const y = 0;
        const z = semiMinorAxis2 * Math.sin(angle);
        orbitPoints2.push(x, y, z);
      }

      orbitGeometry2.setAttribute('position', new THREE.Float32BufferAttribute(orbitPoints2, 3));

      // Создаем объект Line для орбиты mainCube2
      const orbitLine2 = new THREE.Line(orbitGeometry2, orbitMaterial);
      orbitLine2.rotation.y = Math.PI / 4; // 45 градусов поворот

      // Добавляем линию в сцену
      scene.add(orbitLine2);

      // Функция для обновления позиции mainCube2 и орбиты
      const updateOrbitPosition2 = () => {
        const time = Date.now() * 0.001;
        const angle = orbitDirection2 * time * orbitSpeed2 + orbitAngle2; // Учитываем направление

        const x = semiMajorAxis2 * Math.cos(angle);
        const y = 0;
        const z = semiMinorAxis2 * Math.sin(angle);

        mainCube2.position.set(x, y, z);
      };

      // Анимация движения по орбите mainCube2
      const animateOrbit2 = () => {
        updateOrbitPosition2();
        orbitLine2.rotation.y = mainCube2.rotation.y; // Синхронизация поворота линии орбиты
        requestAnimationFrame(animateOrbit2);
      };

      // Добавляем mainCube2 в сцену
      scene.add(mainCube2);

      // Запускаем анимацию орбиты mainCube2
      animateOrbit2();

      // Третий куб
      let mainCube3 = new THREE.Group();

      const textureLoader = new THREE.TextureLoader();
      // Загрузка текстур
      const textureRight = textureLoader.load('/assets/img/cube2/right.webp');
      const textureLeft = textureLoader.load('/assets/img/cube2/left.webp');
      const textureFront = textureLoader.load('/assets/img/cube2/front.webp');
      const textureBack = textureLoader.load('/assets/img/cube2/back.webp');
      const textureBottom = textureLoader.load('/assets/img/cube2/bottom.webp');
      const textureTop = textureLoader.load('/assets/img/cube2/top.webp');

      // // Поворот UV-координат для текстуры
      // textureBack.center = new THREE.Vector2(0.5, 0.5);
      // textureBack.rotation = Math.PI;
      // textureBack.needsUpdate = true;
      //
      // textureLeft.center = new THREE.Vector2(0.5, 0.5);
      // textureLeft.rotation = Math.PI / 2; // Поворот на 90 градусов
      // textureLeft.needsUpdate = true;
      //
      // textureRight.center = new THREE.Vector2(0.5, 0.5);
      // textureRight.rotation = -Math.PI / 2; // Поворот на -90 градусов
      // textureRight.needsUpdate = true;

      const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
      const materials = [
        new THREE.MeshBasicMaterial({ map: textureRight }),
        new THREE.MeshBasicMaterial({ map: textureLeft }),
        new THREE.MeshBasicMaterial({ map: textureFront }),
        new THREE.MeshBasicMaterial({ map: textureBack }),
        new THREE.MeshBasicMaterial({ map: textureBottom }),
        new THREE.MeshBasicMaterial({ map: textureTop }),
      ];

      mainCube3 = new THREE.Mesh(geometry, materials);

      // Параметры орбиты для mainCube3
      const semiMajorAxis3 = 5.3; // Большая полуось
      const semiMinorAxis3 = 4; // Малая полуось
      const orbitSpeed3 = 0.3;
      const orbitAngle3 = 0; // Устанавливаем угол начальной орбиты
      const orbitDirection3 = -1; // Направление вращения (1 или -1)

      mainCube3.position.set(semiMajorAxis3 * Math.cos(orbitAngle3), 0, semiMinorAxis3 * Math.sin(orbitAngle3));

      // Создаем геометрию для линии орбиты mainCube3
      const orbitGeometry3 = new THREE.BufferGeometry();
      const orbitPoints3 = [];

      // Добавляем точки орбиты для mainCube3
      for (let i = 0; i <= 360; i++) {
        const angle = (i * Math.PI) / 180;
        const x = semiMajorAxis3 * Math.cos(angle);
        const y = 0;
        const z = semiMinorAxis3 * Math.sin(angle);
        orbitPoints3.push(x, y, z);
      }

      orbitGeometry3.setAttribute('position', new THREE.Float32BufferAttribute(orbitPoints3, 3));

      // Создаем объект Line для орбиты mainCube3
      const orbitLine3 = new THREE.Line(orbitGeometry3, orbitMaterial);
      orbitLine3.rotation.y = -Math.PI / 4; // -45 градусов поворот

      // Добавляем линию орбиты в сцену
      scene.add(orbitLine3);

      // Функция для обновления позиции mainCube3 и орбиты
      const updateOrbitPosition3 = () => {
        const time = Date.now() * 0.001;
        const angle = orbitDirection3 * time * orbitSpeed3 + orbitAngle3; // Учитываем направление
        const x = semiMajorAxis3 * Math.cos(angle);
        const y = 0;
        const z = semiMinorAxis3 * Math.sin(angle);

        mainCube3.position.set(x, y, z);
      };

      // Анимация движения по орбите mainCube3
      const animateOrbit3 = () => {
        updateOrbitPosition3();
        orbitLine3.rotation.y = mainCube3.rotation.y; // Синхронизация поворота линии орбиты
        requestAnimationFrame(animateOrbit3);
      };

      // Добавляем mainCube3 в сцену
      scene.add(mainCube3);

      // Запускаем анимацию орбиты mainCube3
      animateOrbit3();

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
    <h1>{{ $t('project1.name') }} <CanvasFullScreen :canvasContainer="canvasContainer"></CanvasFullScreen> <ToggleFullScreen></ToggleFullScreen></h1>
    <line></line>
    <div class="scene-container" ref="canvasContainer"></div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  flex: 1 0 auto;
  background: linear-gradient(to bottom, rgb(255, 240, 244), rgb(255, 249, 229) ) no-repeat center;
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
