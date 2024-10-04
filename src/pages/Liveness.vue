<script setup lang="ts">
  import {ref} from "vue";
  import HeaderApp from "../components/HeaderApp.vue";
  import Layout from "../components/Layout.vue";
  // import video from "../utils/video.util";

  // const onMainCam = ref(false);
  const mainVideoRef = ref<HTMLVideoElement | null>(null);
  const mainImageRef = ref<HTMLImageElement | null>(null);
  const mainCanvasRef = ref<HTMLCanvasElement | null>(null);

  // const startMainCam = () => {
  //   onMainCam.value = true;
  // };

  // const isOnWebCam = ref(false);
  const matchVideoRef = ref<HTMLVideoElement | null>(null);
  const matchImageRef = ref<HTMLImageElement | null>(null);
  const matchCanvasRef = ref<HTMLCanvasElement | null>(null);
</script>

<template>
  <Layout>
    <div class="max-w-6xl mx-auto text-center p-4">
      <HeaderApp msg="Liveness Detection" />
      <div class="grid grid-cols-2 gap-4">
        <div>
          <div class="relative border-solid border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-300 mt-2">
            <video ref="mainVideoRef" class="w-full" autoplay muted></video>
            <img ref="mainImageRef" class="absolute top-0 left-0 w-full h-full object-cover" />
            <canvas ref="mainCanvasRef" class="absolute top-0 left-0 w-full h-full"></canvas>
          </div>
          <div class="flex justify-center mt-2">
            <button :class="['bg-blue-500 text-white font-bold py-2 px-4 rounded']">Start</button>
          </div>
        </div>
        <div>
          <div class="relative border-solid border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-300 mt-2">
            <video ref="matchVideoRef" class="w-full" autoplay muted></video>
            <img ref="matchImageRef" class="absolute top-0 left-0 w-full h-full object-cover" />
            <canvas ref="matchCanvasRef" class="absolute top-0 left-0 w-full h-full"></canvas>
          </div>
          <div>x</div>
        </div>
      </div>
    </div>
  </Layout>
</template>
