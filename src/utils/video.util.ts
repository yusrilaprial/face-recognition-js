export const startWebcamByEl = async (videoEl: HTMLVideoElement) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({video: true});
    videoEl.srcObject = stream;
  } catch (error) {
    console.error("Error accessing webcam:", error);
  }
};

export const stopWebcamByEl = (videoEl: HTMLVideoElement) => {
  const stream = videoEl.srcObject as MediaStream;
  const tracks = stream.getTracks();
  tracks.forEach((track) => track.stop());
  videoEl.srcObject = null;
};

export const takeSnapshotOnEl = (videoEl: HTMLVideoElement): string => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;
  canvas.width = videoEl.videoWidth;
  canvas.height = videoEl.videoHeight;
  context.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
  const imageDataUrl = canvas.toDataURL("image/png");
  return imageDataUrl;
};
