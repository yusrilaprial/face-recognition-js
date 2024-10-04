<script setup lang="ts">
  import {ref} from "vue";
  import HeaderApp from "../components/HeaderApp.vue";
  import Layout from "../components/Layout.vue";
  import {FaceSdk, ImageSource} from "@regulaforensics/facesdk-webclient";

  const face1 = ref(new Blob());
  const face2 = ref(new Blob());

  const sdk = new FaceSdk();

  const matchFaces = async () => {
    const response = await sdk.matchingApi.match({
      images: [
        {type: ImageSource.LIVE, data: await face1.value.arrayBuffer(), index: 1},
        {type: ImageSource.DOCUMENT_RFID, data: await face2.value.arrayBuffer(), index: 2},
      ],
    });

    for (const result of response.results ?? []) {
      console.log(`pair(${result.firstIndex},${result.secondIndex})   similarity: ${result.similarity}`);
    }
  };
</script>

<template>
  <Layout>
    <div class="max-w-6xl mx-auto text-center p-4">
      <HeaderApp msg="Regula Forensics" />
      <div>
        <input type="file" @change="(e) => { face1 = (e.target as HTMLInputElement).files![0] }" />
        <input type="file" @change="(e) => { face2 = (e.target as HTMLInputElement).files![0] }" />

        <button @click="matchFaces">Match</button>
      </div>
    </div>
  </Layout>
</template>
