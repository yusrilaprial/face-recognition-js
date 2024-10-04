<script setup lang="ts">
  import {ref} from "vue";
  import HeaderApp from "../components/HeaderApp.vue";
  import Layout from "../components/Layout.vue";
  import {addImageToEl} from "../utils/image.util";
  import {startWebcamByEl, stopWebcamByEl, takeSnapshotOnEl} from "../utils/video.util";

  const mainImageRef = ref<HTMLImageElement | null>(null);
  const mainWebCamRef = ref<HTMLVideoElement | null>(null);
  const isOnWebCam = ref(false);
</script>

<template>
  <Layout>
    <div class="max-w-6xl mx-auto text-center p-4">
      <HeaderApp msg="Anti Spoofing" />
      <div class="flex flex-col items-center justify-center space-y-4 pt-4">
        <img ref="mainImageRef" class="object-cover w-96 h-56 border border-black" />
        <input type="file" @change="(e: Event) => addImageToEl(e, mainImageRef!)" />
        <video ref="mainWebCamRef" class="object-cover w-96 h-56 border border-black" autoplay muted></video>
        <div class="space-x-4">
          <button
            @click="() => {
              if (isOnWebCam) {
                stopWebcamByEl(mainWebCamRef!);
                isOnWebCam = false;
              } else {
                startWebcamByEl(mainWebCamRef!);
                isOnWebCam = true;
              }
            }"
            :class="['bg-blue-500 text-white font-bold py-2 px-4 rounded', {'bg-gray-500': isOnWebCam}]">
            {{ isOnWebCam ? "Stop Webcam" : "Start Webcam" }}
          </button>
          <button
            v-if="isOnWebCam"
            class="bg-green-500 text-white font-bold py-2 px-4 rounded"
            @click="() => mainImageRef!.src = takeSnapshotOnEl(mainWebCamRef!)">
            Take Snapshot
          </button>
        </div>
      </div>
    </div>
  </Layout>
</template>
