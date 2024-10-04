// import axios from "axios";
// import fs from "fs";
// import path from "path";

// export const fetchImageMetadataFromFolderUrl = async (folderUrl: string): Promise<ImageData[]> => {
//   try {
//     // Asumsikan menambahkan '/' di akhir URL akan memberikan daftar file
//     const response = await axios.get(folderUrl);
//     console.log(response);

//     // Parsing response (sesuaikan dengan format respon server)
//     const imageUrls = response.data
//       .split("\n") // Contoh parsing sederhana untuk format plain text
//       .filter((url: any) => url.endsWith(".jpg") || url.endsWith(".png")) // Filter hanya gambar
//       .map((url: any) => new URL(url, folderUrl).href); // Buat URL lengkap

//     const imageData: ImageData[] = await Promise.all(
//       imageUrls.map(async (imageUrl: any) => {
//         const {headers} = await axios.get(imageUrl, {responseType: "arraybuffer"});
//         const imageName =
//           headers["content-disposition"]?.split("filename=")[1]?.replace(/"/g, "") ||
//           imageUrl.split("/").pop() ||
//           "unknown.jpg";
//         return {name: imageName, image: imageUrl};
//       }),
//     );

//     return imageData;
//   } catch (error) {
//     console.error("Error fetching images:", error);
//     return [];
//   }
// };

// export const fetchImageMetadataFromFolderDisk = async (folderPath: string): Promise<ImageData[]> => {
//   try {
//     const files = fs.readdirSync(folderPath);

//     const imageData: ImageData[] = await Promise.all(
//       files.map(async file => {
//         const filePath = path.join(folderPath, file);
//         if (!/\.(jpg|jpeg|png|gif)$/i.test(file)) return null; // Filter hanya gambar

//         const buffer = fs.readFileSync(filePath);
//         return { name: file, image: buffer };
//       })
//     ).then(data => data.filter(item => item !== null) as unknown as ImageData[]);

//     return imageData;
//   } catch (error) {
//     console.error('Error fetching images:', error);
//     return [];
//   }
// }

export const addImageToEl = async (event: Event, mainImageRef: HTMLImageElement) => {
  const file = (event.target as HTMLInputElement).files![0];
  const reader = new FileReader();
  reader.onload = (e) => {
    mainImageRef!.src = e.target!.result as string;
  };
  reader.readAsDataURL(file);
};
