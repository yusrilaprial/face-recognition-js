<script setup lang="ts">
  import {ref} from "vue";
  import * as faceapi from "face-api.js";
  import HeaderApp from "../components/HeaderApp.vue";
  import Layout from "../components/Layout.vue";

  // Set Up Model
  const MODEL_URL = "/models";
  faceapi.loadSsdMobilenetv1Model(MODEL_URL).finally(() => console.log("SsdMobilenetv1 Model Loaded"));
  faceapi.loadTinyFaceDetectorModel(MODEL_URL).finally(() => console.log("TinyFaceDetector Model Loaded"));
  faceapi.loadFaceLandmarkModel(MODEL_URL).finally(() => console.log("FaceLandmark Model Loaded"));
  faceapi.loadFaceRecognitionModel(MODEL_URL).finally(() => console.log("FaceRecognition Model Loaded"));
  faceapi.loadFaceExpressionModel(MODEL_URL).finally(() => console.log("FaceExpression Model Loaded"));
  faceapi.loadMtcnnModel(MODEL_URL).finally(() => console.log("Mtcnn Model Loaded"));

  // DataFaces
  const faceName = ref("");
  const faces = ref<{name: string; image: string}[]>([
    {name: "Messi", image: "/faces/messi.jpg"},
    {name: "Ronaldo", image: "/faces/ronaldo.jpg"},
    {name: "Antony", image: "/faces/antony.jpg"},
    {name: "Yusril", image: "/faces/yusril.jpg"},
  ]);

  const addFace = () => {
    if (faceName.value === "" || mainImageRef.value === null) return;
    faces.value.push({name: faceName.value, image: mainImageRef.value!.src});
    faceName.value = "";
  };

  const removeFace = (index: number) => {
    if (index < 0 || index >= faces.value.length) return;
    faces.value.splice(index, 1);
  };

  // Face Recognition
  const getFaceDescriptors = async () => {
    const labeledFaceDescriptors = await Promise.all(
      faces.value.map(async (face) => {
        // fetch image data from urls and convert blob to HTMLImage element
        const faceImg = await faceapi.fetchImage(face.image);

        // detect the face with the highest score in the image and compute it's landmarks and face descriptor
        const fullFaceDescription = await faceapi
          .detectSingleFace(faceImg)
          .withFaceLandmarks()
          .withFaceExpressions()
          .withFaceDescriptor();

        if (!fullFaceDescription) {
          throw new Error(`no faces detected for ${face.name}`);
        }

        const faceDescriptors = [fullFaceDescription.descriptor];
        return new faceapi.LabeledFaceDescriptors(face.name, faceDescriptors);
      }),
    );

    return labeledFaceDescriptors;
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
      .withFaceExpressions()
      .withFaceDescriptors();
    console.log(detections);

    const resizedDetections = faceapi.resizeResults(detections, {width: img.width, height: img.height});
    const canvas = mainImageCanvasRef.value!;
    canvas.width = img.width;
    canvas.height = img.height;

    const labeledFaceDescriptors = await getFaceDescriptors();

    // 0.6 is a good distance threshold value to judge
    // whether the descriptors match or not
    const maxDescriptorDistance = 0.6;
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance);

    const results = resizedDetections.map((fd) => faceMatcher.findBestMatch(fd.descriptor));
    results.forEach((bestMatch, i) => {
      console.log(bestMatch.label);
      const box = resizedDetections[i].detection.box;
      const text = bestMatch.toString();
      const drawBox = new faceapi.draw.DrawBox(box, {label: text});
      drawBox.draw(canvas);
      faceapi.draw.drawFaceLandmarks(canvas!, resizedDetections);
    });

    // const resizedDetections = faceapi.resizeResults(detections, {width: img.width, height: img.height});
    // const canvas = mainImageCanvasRef.value!;
    // canvas.width = img.width;
    // canvas.height = img.height;
    // faceapi.draw.drawDetections(canvas!, resizedDetections);
    // faceapi.draw.drawFaceLandmarks(canvas!, resizedDetections);
    // faceapi.draw.drawFaceExpressions(canvas!, resizedDetections);
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

  // Face Recognition
  async function getMtcnnFaceDescriptors() {
    return Promise.all(
      faces.value.map(async (face) => {
        const faceImg = await faceapi.fetchImage(face.image);
        const fullFaceDescription = await faceapi
          .detectSingleFace(faceImg, new faceapi.MtcnnOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (!fullFaceDescription) {
          throw new Error(`no faces detected for ${face.name}`);
        }

        const faceDescriptors = [fullFaceDescription.descriptor];
        return new faceapi.LabeledFaceDescriptors(face.name, faceDescriptors);
      }),
    );
  }

  const isRealtimeDetection = ref(false);
  var intervalId: number | null = null;
  const startDetectAndDrawWithMtcnn = async () => {
    isRealtimeDetection.value = true;

    const canvas = mainWebCamCanvasRef.value!;
    const displaySize = {width: mainWebCamRef.value!.videoWidth, height: mainWebCamRef.value!.videoHeight};
    faceapi.matchDimensions(canvas, displaySize);

    // Hitung labeledFaceDescriptors di luar setInterval untuk menghindari pemanggilan berulang
    const labeledFaceDescriptors = await getMtcnnFaceDescriptors();

    // 0.6 is a good distance threshold value to judge
    // whether the descriptors match or not
    const maxDescriptorDistance = 0.6;
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance);

    intervalId = setInterval(async () => {
      // Gunakan requestAnimationFrame untuk sinkronisasi dengan refresh rate layar
      requestAnimationFrame(async () => {
        const detection = await faceapi
          .detectSingleFace(
            mainWebCamRef.value!,
            new faceapi.MtcnnOptions({
              // Sesuaikan minFaceSize untuk performa lebih baik
              minFaceSize: 200,
            }),
          )
          .withFaceLandmarks()
          .withFaceDescriptor();

        // Hindari pemanggilan getContext berulang di dalam loop
        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (detection) {
          const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
          if (bestMatch.label !== "unknown") console.log(bestMatch.label);

          const box = detection.detection.box;
          const text = bestMatch.toString();
          const drawBox = new faceapi.draw.DrawBox(box, {label: text});
          drawBox.draw(canvas);
          faceapi.draw.drawFaceLandmarks(canvas!, detection); // Hanya gambar landmark untuk wajah yang terdeteksi
        }
      });
    }, 0); // Gunakan 0 untuk interval tercepat, tetapi tetap sinkron dengan requestAnimationFrame
  };

  const stopDetectAndDrawWithMtcnn = () => {
    if (!intervalId || !isRealtimeDetection.value) return;
    isRealtimeDetection.value = false;
    clearInterval(intervalId);
    const canvas = mainWebCamCanvasRef.value!;
    canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Liveness Detection
  // Helper function to convert Point to number[]
  const pointToArray = (point: faceapi.Point): number[] => [point.x, point.y];

  // Calculate Eye Aspect Ratio (EAR) to detect eye blinking
  const calculateEAR = (eye: faceapi.Point[]): number => {
    const vertical1 = faceapi.euclideanDistance(pointToArray(eye[1]), pointToArray(eye[5]));
    const vertical2 = faceapi.euclideanDistance(pointToArray(eye[2]), pointToArray(eye[4]));
    const horizontal = faceapi.euclideanDistance(pointToArray(eye[0]), pointToArray(eye[3]));
    return (vertical1 + vertical2) / (2.0 * horizontal);
  };

  // Check for mouth openness by calculating the ratio of mouth landmarks
  const calculateMouthOpenness = (mouth: faceapi.Point[]): number => {
    const vertical = faceapi.euclideanDistance(pointToArray(mouth[13]), pointToArray(mouth[19]));
    const horizontal = faceapi.euclideanDistance(pointToArray(mouth[12]), pointToArray(mouth[16]));
    return vertical / horizontal;
  };

  const isLivenessDetection = ref(false);
  var intervalIdLiveness: number | null = null;
  const startDetectLiveness = () => {
    isLivenessDetection.value = true;

    const video = mainWebCamRef.value!;
    const canvas = mainWebCamCanvasRef.value!;

    const displaySize = {width: video.videoWidth, height: video.videoHeight};
    faceapi.matchDimensions(canvas, displaySize);

    intervalIdLiveness = setInterval(async () => {
      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      if (detection) {
        // faceapi.draw.drawDetections(canvas, detection);
        faceapi.draw.drawFaceLandmarks(canvas, detection);

        const landmarks = detection.landmarks;
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();
        const mouth = landmarks.getMouth();

        const leftEAR = calculateEAR(leftEye);
        const rightEAR = calculateEAR(rightEye);
        const averageEAR = (leftEAR + rightEAR) / 2;

        const mouthOpenness = calculateMouthOpenness(mouth);

        // Thresholds for detecting blinking and mouth movements
        const blinkThreshold = 0.2;
        const mouthOpenThreshold = 0.3;

        if (averageEAR < blinkThreshold) {
          console.log("Blink detected: possible live person.");
        } else {
          // console.log("Eyes are open.");
        }

        if (mouthOpenness > mouthOpenThreshold) {
          console.log("Mouth is open: possible live person.");
        } else {
          // console.log("Mouth is closed.");
        }

        // Additional checks can be added here for head movement, etc.
      }
    });
  };

  const stopDetectLiveness = () => {
    if (!intervalIdLiveness || !isLivenessDetection.value) return;
    isLivenessDetection.value = false;
    clearInterval(intervalIdLiveness);
    const canvas = mainWebCamCanvasRef.value!;
    canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
  };
</script>

<template>
  <Layout>
    <!-- Face Detection -->
    <div class="max-w-md mx-auto text-center p-4">
      <HeaderApp msg="Face Detection" />
      <div class="space-y-2">
        <label>Choose Image: </label>

        <input type="file" @change="addImageToRef" accept="image/*" />
        <div class="relative border-solid border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-300">
          <img ref="mainImageRef" class="w-full min-h-44 max-h-64" />
          <canvas ref="mainImageCanvasRef" class="absolute top-0 left-0 w-full h-full"></canvas>
        </div>
        <div>
          <label>Face Name: </label>
        </div>
        <div>
          <input
            type="text"
            class="border border-gray-300 rounded-s px-3 py-2"
            placeholder="Enter Face Name"
            v-model="faceName" />
          <button class="bg-blue-500 text-white font-bold py-2 px-4 rounded-e" @click="addFace">Add Face</button>
        </div>

        <div
          v-show="isOnWebCam"
          class="relative border-solid border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-300">
          <video ref="mainWebCamRef" autoplay muted></video>
          <canvas
            v-show="isRealtimeDetection || isLivenessDetection"
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
          <button
            v-if="isOnWebCam"
            @click="() => (isLivenessDetection ? stopDetectLiveness() : startDetectLiveness())"
            :class="['bg-blue-500 text-white font-bold py-2 px-4 rounded', {'bg-gray-500': isLivenessDetection}]">
            {{ isLivenessDetection ? "Stop Liveness" : "Start Liveness" }}
          </button>
          <button v-if="isOnWebCam" class="bg-green-500 text-white font-bold py-2 px-4 rounded" @click="takeSnapshot">
            Take Snapshot
          </button>
        </div>
      </div>
    </div>

    <!-- Face Recognition -->
    <div class="max-w-md mx-auto text-center p-4">
      <HeaderApp msg="Face Recognition" />
      <div class="space-y-2 mt-2">
        <div class="grid grid-cols-3 gap-2">
          <div
            v-for="(face, index) in faces"
            class="relative border-solid border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-300">
            <img :src="face.image" class="object-cover" />
            <div class="absolute top-0 right-0 p-2">
              <button class="bg-red-500 text-white font-bold py-1 px-2 rounded" @click="removeFace(index)">
                Remove
              </button>
            </div>
            <div class="absolute bottom-0 left-0 p-2 w-full bg-black/80">
              <span class="text-white font-bold">{{ face.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
