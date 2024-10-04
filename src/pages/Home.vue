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
    {name: "Akshay Kumar", image: "https://storage.googleapis.com/kagglesdsdata/datasets/959963/1624149/Original%20Images/Original%20Images/Akshay%20Kumar/Akshay%20Kumar_1.jpg?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=databundle-worker-v2%40kaggle-161607.iam.gserviceaccount.com%2F20241004%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241004T034817Z&X-Goog-Expires=345600&X-Goog-SignedHeaders=host&X-Goog-Signature=26f4499487757de832b1142d82100dbb8977a6ade1f5669b61aadc2e3b65e68f7ca3241bb137baa3838d3989f3108cb3b1c34b8b31a5e57c31e4345f312c59ec13e7239d895c7398d3365ca5a0676b1113b56f917c80e1ecd688c264dfcba6c95362cc672e6ac353e4792793091e29ec199a781ec08072f56c9f68d1d444e828c144b1cd148cc4e34325559612885c720df0a0f4c30b11b875989b00e9ab0dde329d5126c8af597802d31c740f13fb04a5133258b06d84a1c196a64ede59ef4e0b373cf3ef65cb0034fc1c1d6c8fb13ffa0b3e18a181b206e87eaf55f0bf549218d91472e0c091d35d6ee2f698ecc163354077b7456d6f133f5dbfea99de0880"},
    {name: "Alexandra Daddario", image: "https://storage.googleapis.com/kagglesdsdata/datasets/959963/1624149/Original%20Images/Original%20Images/Alexandra%20Daddario/Alexandra%20Daddario_0.jpg?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=databundle-worker-v2%40kaggle-161607.iam.gserviceaccount.com%2F20241003%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241003T080357Z&X-Goog-Expires=345600&X-Goog-SignedHeaders=host&X-Goog-Signature=1782ad5eaef1da1469a20bb3bbde21e82feee8b690664f861f39d37ade0184c040a9277538f43a6c04c161d0073b08cf3f73998d94be9ccf352272459f3bf48b49d42559b4b09999111e27423c42a47c36e7e73d4855ea419f476e46c9a8a955d859b2cf1f690b289c26e6c74809022623b04c72dc2fae3229b7f0ca4d0ce703e1d62b4773560d23e63e6670378f5b6baf7165be92ac9dc47d4e7a8e9f105b14ea3d4c7cc86f423ceee07219f54454847e30060220f9bc28d869a6cec967f1ce1a8368cf03ac03eda13d3aa3ba625442a8bcfa1e8911cc7ee9259f6a917c840550c9d966707275386fd9672a670cd982d7d67cc3948ecd99bbf09b199212e939"},
    {name: "Henry Cavill", image: "https://storage.googleapis.com/kagglesdsdata/datasets/959963/1624149/Original%20Images/Original%20Images/Henry%20Cavill/Henry%20Cavill_1.jpg?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=databundle-worker-v2%40kaggle-161607.iam.gserviceaccount.com%2F20241004%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241004T035604Z&X-Goog-Expires=345600&X-Goog-SignedHeaders=host&X-Goog-Signature=30cc92244f37eb48780aa57649254ea3c1153933d0d4490cffbcf6d1025aa5df97e18e43387c77959b892c87729def44f1e1b8a2f765df2ebe7a1c9dc758a51fed0397006529a8f1cd5c707cfdb7ebd95ab5b75650f41b3f9e52e0cad10b55787261fd95257775c4559f7eb6f4eef3721ca7d6abf69398a859682b3b553492bbcf43d0e047fe849d4472ff26091482c447fbacfa368ced2d24d174190fdbe72af89480e8ce317df04ea795e4f7d51f313b0a3781fa913f07de9a71908ce4e67b9434ab60858b2188da1149c483c64d0b383aa1a301a749a9ede05b891332832657e515aae1b021d99932e294a092da6666aca30500cf6044e58dfab0575b29fd"},
    {name: "Hugh Jackman", image: "https://storage.googleapis.com/kagglesdsdata/datasets/959963/1624149/Original%20Images/Original%20Images/Hugh%20Jackman/Hugh%20Jackman_108.jpg?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=databundle-worker-v2%40kaggle-161607.iam.gserviceaccount.com%2F20241004%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241004T064239Z&X-Goog-Expires=345600&X-Goog-SignedHeaders=host&X-Goog-Signature=160257538743a44cbe5509a8ec55d525e9ffef331f4f81d502a50446435807413ee0c9a739cb2b6b0b9aa6a8971d2001fb6859f0de8292c2fd5cfac8f9ada11b971dae325eb73b9c61fa94c471b6cf226b1901b1d5a528ecd8818fcfb8dab0b702c96759f59772bcd9c094da7ad52616cd8cd5371e29695be3b6613cef6b1d5a773caa447344e987c2fff8f9c07228c0cbb1202061fca97e0f7aad6b5b84f9970b78aa7cea12e36cf29bb4ea7269c4e4949768b7cb2141d41107891df828fed98e0a5a1d478a262e2c27fa419ced991d113bf7b15c0f8cb90088b8ed3ad7e4adf3e0fcae0b8aa4ebec70ca8891e6414cae5210f239703e0fed2318b80fffa3bc"},
    {name: "Robert Downey Jr", image: "https://storage.googleapis.com/kagglesdsdata/datasets/959963/1624149/Original%20Images/Original%20Images/Robert%20Downey%20Jr/Robert%20Downey%20Jr_1.jpg?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=databundle-worker-v2%40kaggle-161607.iam.gserviceaccount.com%2F20241004%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241004T050429Z&X-Goog-Expires=345600&X-Goog-SignedHeaders=host&X-Goog-Signature=94412a77bfc227d3c54a57c3c05c9fe8cb9132f68c1358daf3a505a4ff59438b9a6ee9ed0f9fab5f73de6384668e2ed841885a9a604729e380bfba8b8ee6c5dbec5363d2344c60c902e095ab13c8fb4146c64e4bfb1aadb8a1afdc26581a5cbaa45e32153bfd6b947408445e83d0490b18aaab105c7fa3bcabbaee262566c18f96431b81d43a0edfc51be3d5e3b4403a402f47e4ea9e1866f344236494e0ec5995d98836b24ac9d01da71abf38c632559825fc056bdbe3502959e710ba28dd7c1d6c26b5b9ecd58221d1eadcff69852ee870bdab6c40fc39a6e79afb7c8ecba89f82f893d02f2ea875358db2e8f1abace6ede4eee70312e1cff0de8a71637c77"},
    {name: "Billie Eilish", image: "https://storage.googleapis.com/kagglesdsdata/datasets/959963/1624149/Original%20Images/Original%20Images/Billie%20Eilish/Billie%20Eilish_10.jpg?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=databundle-worker-v2%40kaggle-161607.iam.gserviceaccount.com%2F20241004%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241004T064429Z&X-Goog-Expires=345600&X-Goog-SignedHeaders=host&X-Goog-Signature=77aff81e0156668a0783e2d7f3fc80c2cd8f35071e6ee276a1fb330008e83eecd9bf70e175459454d7ac9accc52adc68c719968890984600b6b1141f6e78a089a3eb854719889429ceaa4ddf62e9d27b69e6bb00f12d140b5ae52ef84e25d2900fba56cae209fda629265a8e020fa94d5100a07bd23bb01243a3834457c11b82ab82123c5d84ae4efff51f491d6242382b8b52d79faee1f604fb2b9da9bd9e9fe620876ced07749868250b9e543b36a2cde4e77eb3d3da5656d2eba001cb6572d8277f3759349fb45793f490caaefa02a3e9d15d19b9507be7efe3cbea868cb9695f265df830797b8470765f9d5fafe3ea6404922c6eacc3f5c90111b729277b"},
    {name: "Claire Holt", image: "https://storage.googleapis.com/kagglesdsdata/datasets/959963/1624149/Original%20Images/Original%20Images/Claire%20Holt/Claire%20Holt_25.jpg?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=databundle-worker-v2%40kaggle-161607.iam.gserviceaccount.com%2F20241004%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241004T065021Z&X-Goog-Expires=345600&X-Goog-SignedHeaders=host&X-Goog-Signature=139d710517565aebc0fd54ca65f90c2af464bf9acda3f403d0db3bc5a67712d46c47f83413728a1f19fa29839b0d96f8c5699bbd6b8476718480ca9c7ed5e54ddccbd63e0fe3e2e549085e3588a1fd51a663acaf90c53a9cfc3335c72b97bfb94d12b1743b75f42540ea11f23339a536113ed0ff30f5fc6562fd1146acb3d79f5038313cc6a297edffcc85471f51a25578cb5e70b2cee935b7d2f90d8971514e1b40fe781ed4b16d24b66733ac558fe4725b73cd2669ea113be3a2f0ab0769196ad034cafc976bd91074c6585642783fd82456d80fe20b959ae47afbe872768688167a6ac61dd82aa26189cafdea448337b6229bf6938afe755309bb77de0805"},
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
      console.log(bestMatch);
      console.log(bestMatch.label);

      const similarityPercentage = (1 - bestMatch.distance) * 100;
      console.log(`Similarity: ${similarityPercentage.toFixed(2)}%`);

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
  var intervalId: NodeJS.Timeout | null = null;
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
  var intervalIdLiveness: NodeJS.Timeout | null = null;
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
            <img :src="face.image" class="object-cover w-full h-full" />
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
