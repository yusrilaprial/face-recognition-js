<script setup lang="ts">
  import {ref} from "vue";
  import * as faceapi from "face-api.js";
  import HeaderApp from "./components/HeaderApp.vue";

  // Set Up Model
  const MODEL_URL = "/models";
  faceapi.loadSsdMobilenetv1Model(MODEL_URL).finally(() => console.log("SsdMobilenetv1 Model Loaded"));
  faceapi.loadFaceLandmarkModel(MODEL_URL).finally(() => console.log("FaceLandmark Model Loaded"));
  faceapi.loadFaceRecognitionModel(MODEL_URL).finally(() => console.log("FaceRecognition Model Loaded"));
  faceapi.loadFaceExpressionModel(MODEL_URL).finally(() => console.log("FaceExpression Model Loaded"));
  faceapi.loadMtcnnModel(MODEL_URL).finally(() => console.log("Mtcnn Model Loaded"));

  // Navigation
  const bars = ["detection", "recognition"];
  const curBar = ref("detection");
  const capitalize = (str: string) => {
    if (typeof str !== "string" || str.length === 0) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Base Image
  const mainImageRef = ref<HTMLImageElement | null>(null);
  const mainImageCanvasRef = ref<HTMLCanvasElement | null>(null);

  const addImageToRef = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files![0];
    const reader = new FileReader();
    reader.onload = (e) => {
      mainImageRef.value!.src = e.target!.result as string;
      detectAndDraw();
    };
    reader.readAsDataURL(file);
  };

  const detectAndDraw = async () => {
    const img = mainImageRef.value!;
    const options = new faceapi.SsdMobilenetv1Options({minConfidence: 0.5});
    const detections = await faceapi
      .detectAllFaces(img, options)
      .withFaceLandmarks()
      .withFaceDescriptors()
      .withFaceExpressions();
    console.log(detections);
    const resizedDetections = faceapi.resizeResults(detections, {width: img.width, height: img.height});
    const canvas = mainImageCanvasRef.value!;
    canvas.width = img.width;
    canvas.height = img.height;
    faceapi.draw.drawDetections(canvas!, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas!, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas!, resizedDetections);
  };

  // Base Webcam
  const mainWebCamRef = ref<HTMLVideoElement | null>(null);
  const mainWebCamCanvasRef = ref<HTMLCanvasElement | null>(null);
  const isOnWebCam = ref(false);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({video: true});
      mainWebCamRef.value!.srcObject = stream;
      mainWebCamRef.value!.addEventListener("loadeddata", async () => {
        isOnWebCam.value = true;
      });
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  const stopWebcam = () => {
    if (!mainWebCamRef.value) return;
    const stream = mainWebCamRef.value.srcObject as MediaStream;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    mainWebCamRef.value.srcObject = null;
    isOnWebCam.value = false;
  };

  const takeSnapshot = () => {
    if (!mainWebCamRef.value) return;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;
    canvas.width = mainWebCamRef.value.videoWidth;
    canvas.height = mainWebCamRef.value.videoHeight;
    context.drawImage(mainWebCamRef.value, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL("image/png");
    // Do something with the imageDataUrl, like saving it to a file or displaying it
    mainImageRef.value!.src = imageDataUrl;
    detectAndDraw();
  };

  const isRealtimeDetection = ref(false);
  var intervalId: number | null = null;
  const startDetectAndDrawWithMtcnn = async () => {
    const canvas = mainWebCamCanvasRef.value!;
    const displaySize = {width: mainWebCamRef.value!.videoWidth, height: mainWebCamRef.value!.videoHeight};
    faceapi.matchDimensions(canvas, displaySize);
    intervalId = setInterval(async () => {
      const detections = await faceapi.mtcnn(mainWebCamRef.value!, new faceapi.MtcnnOptions());
      canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, detections);
    }, 100);
    isRealtimeDetection.value = true;
  };

  const stopDetectAndDrawWithMtcnn = () => {
    if (!intervalId || !isRealtimeDetection.value) return;
    isRealtimeDetection.value = false;
    clearInterval(intervalId);
    const canvas = mainWebCamCanvasRef.value!;
    canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
  };
</script>

<template>
  <div class="bg-gray-100 p-4 min-h-screen">
    <!-- NavBar -->
    <nav class="bg-white shadow-md">
      <div class="container mx-auto px-4 py-2 flex justify-between items-center">
        <h1 class="text-xl font-bold">Face Recognition</h1>
        <div class="flex gap-x-2">
          <button
            v-for="bar in bars"
            :class="['text-white font-bold py-2 px-4 rounded', curBar === bar ? 'bg-blue-500' : 'bg-gray-500']"
            :disabled="curBar === bar"
            @click="curBar = bar">
            {{ capitalize(bar) }}
          </button>
        </div>
      </div>
    </nav>

    <!-- Face Detection -->
    <div v-if="curBar === 'detection'" class="max-w-md mx-auto text-center">
      <HeaderApp msg="Face Detection" />
      <div class="space-y-2">
        <label>Choose Image: </label>

        <input type="file" @change="addImageToRef" accept="image/*" />
        <div class="relative border-solid border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-300">
          <img ref="mainImageRef" class="w-full min-h-44 max-h-64" />
          <canvas ref="mainImageCanvasRef" class="absolute top-0 left-0 w-full h-full"></canvas>
        </div>

        <div
          v-show="isOnWebCam"
          class="relative border-solid border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-300">
          <video ref="mainWebCamRef" autoplay muted></video>
          <canvas
            v-show="isRealtimeDetection"
            ref="mainWebCamCanvasRef"
            class="absolute top-0 left-0 w-full h-full"></canvas>
        </div>

        <div class="flex justify-center gap-x-2">
          <button
            @click="() => (isOnWebCam ? stopWebcam() : startWebcam())"
            :class="['bg-blue-500 text-white font-bold py-2 px-4 rounded', {'bg-gray-500': isOnWebCam}]">
            {{ isOnWebCam ? "Stop Webcam" : "Start Webcam" }}
          </button>
          <button
            v-if="isOnWebCam"
            @click="() => (isRealtimeDetection ? stopDetectAndDrawWithMtcnn() : startDetectAndDrawWithMtcnn())"
            :class="['bg-blue-500 text-white font-bold py-2 px-4 rounded', {'bg-gray-500': isRealtimeDetection}]">
            {{ isRealtimeDetection ? "Stop Detection" : "Start Detection" }}
          </button>
          <button v-if="isOnWebCam" class="bg-green-500 text-white font-bold py-2 px-4 rounded" @click="takeSnapshot">
            Take Snapshot
          </button>
        </div>
      </div>
    </div>

    <!-- Face Recognition -->
    <div v-if="curBar === 'recognition'" class="max-w-md mx-auto text-center">
      <HeaderApp msg="Face Recognition" />

      <div class="space-y-2"></div>
    </div>
  </div>
</template>

<style scoped></style>
