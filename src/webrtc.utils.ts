export const getVideoCamera = async () => {
  try {
    const constraints = { video: true, audio: { echoCancellation: true } };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    return stream;
  } catch (error) {
    console.error("Error opening video camera.", error);
  }
  return null;
};
