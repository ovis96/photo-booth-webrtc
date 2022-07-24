import React, { useEffect, useRef, useState } from "react";
import { getVideoCamera } from "../webrtc.utils";

const Camera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    getVideoCamera().then((stream) => {
      try {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setMediaStream(stream);
        }
      } catch {}
    });
  }, []);

  const onTakePhoto = async () => {
    const track = mediaStream?.getVideoTracks()[0];
    // @ts-ignore
    const photo = new window.ImageCapture(track);
    const blob = await photo.takePhoto();
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    const base64Image = await new Promise((resolve) => {
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
    setImages((images) => [...images, base64Image as string]);
  };

  console.log("~~~ images", images);

  return (
    <div>
      <div>
        <video ref={videoRef} autoPlay muted />
        <div>
          <button onClick={onTakePhoto}> Take Photo </button>
        </div>
      </div>

      <div>
        {images.map((image, index) => {
          return <img key={index} src={image} />;
        })}
      </div>
    </div>
  );
};

export default Camera;
