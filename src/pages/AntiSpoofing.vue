<script setup lang="ts">
  import {ref} from "vue";
  import HeaderApp from "../components/HeaderApp.vue";
  import Layout from "../components/Layout.vue";
  import {addImageToEl} from "../utils/image.util";
  import {startWebcamByEl, stopWebcamByEl, takeSnapshotOnEl} from "../utils/video.util";
  import Human from "@vladmandic/human";

  const mainImageRef = ref<HTMLImageElement | null>(null);
  const mainWebCamRef = ref<HTMLVideoElement | null>(null);
  const isOnWebCam = ref(false);

  const human = new Human({
    modelBasePath: "https://vladmandic.github.io/human/models",
    face: {
      enabled: true,
      detector: {maxDetected: 1},
      antispoof: {enabled: true},
    },
  });

  const detectFaceAuthenticity = async (imageElement: HTMLImageElement) => {
    try {
      // Check and set the backend
      const backend = await human.tf.getBackend();
      console.log(`Current backend: ${backend}`);

      if (backend !== "webgl") {
        console.log("Setting backend to WebGL.");
        await human.tf.setBackend("webgl");
      }

      // Ensure TensorFlow.js is ready
      await human.tf.ready();

      console.log("TensorFlow.js is ready.");

      // Load the Human models
      await human.load();
      await human.warmup();

      // Detect face and other features in the image
      const result = await human.detect(imageElement);

      if (result.face.length > 0) {
        const face = result.face[0];

        console.log("Face detected:", face);

        // Check anti-spoofing score if available
        if (face.real !== undefined) {
          console.log(`Anti-spoofing score: ${face.real}`);

          if (face.real > 0.5) {
            console.log("The face appears to be real.");
          } else {
            console.log("The face might be fake or spoofed.");
          }
        } else {
          console.log("Anti-spoofing data not available.");
        }
      } else {
        console.log("No face detected.");
      }
    } catch (error) {
      console.error("Error detecting face authenticity:", error);
    }
  };
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
          <button
            v-if="mainImageRef"
            class="bg-purple-500 text-white font-bold py-2 px-4 rounded"
            @click="() => detectFaceAuthenticity(mainImageRef!)">
            Detect Authenticity
          </button>
        </div>
      </div>
    </div>
  </Layout>
</template>
