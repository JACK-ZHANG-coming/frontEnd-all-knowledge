<!-- 工作台 -->
<template>
  <BaseContainer>
    <div class="container-box">
      <div class="header"> Soon to be a Three.js website </div>
      <div ref="webglBodyRef" class="webgl-body">
        <canvas id="webgl"></canvas>
      </div>
    </div>
  </BaseContainer>
</template>
<script lang="ts" setup>
  import { computed, ref, onMounted, reactive, onBeforeUnmount } from 'vue';
  import BaseContainer from '@/components/BaseContainer.vue';
  import * as THREE from 'three';

  const webglBodyRef = ref(null);
  const size = reactive<{ width: number; height: number }>({ width: 0, height: 0 });
  let canvas: any = null;
  let scene: any = null;
  let camera: any = null;
  let renderer: any = null;
  let cube: any = null;

  const init = () => {
    getBoxSize();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 1000);
    canvas = document.getElementById('webgl');
    renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setSize(size.width, size.height);
    renderer.render(scene, camera); // 渲染场景
  };

  // 写一个函数创建立方体
  const createBoxGeometry = () => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;
  };

  // 写一个函数动画渲染
  const animate = () => {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  };

  const getBoxSize = () => {
    const webglBodyElement: any = webglBodyRef.value;
    const { width, height } = webglBodyElement?.getBoundingClientRect() || {
      width: 800,
      height: 600,
    };
    size.width = width;
    size.height = height;
    console.log('size', size);
  };

  const updateCameras = () => {
    getBoxSize();
    renderer.setSize(size.width, size.height);
  };

  onMounted(() => {
    init();
    createBoxGeometry();
    animate();
    window.addEventListener('resize', updateCameras);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateCameras);
  });
</script>
<style lang="less" scoped>
  .container-box {
    width: 100vw;
    height: 100vh;

    .header {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 60px;
    }

    .webgl-body {
      width: 100%;
      height: calc(100% - 60px);
      border: 1px solid #ccc;
    }
  }
</style>
