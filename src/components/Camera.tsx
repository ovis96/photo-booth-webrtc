import React, { useEffect, useRef, useState } from "react";
import { getVideoCamera } from "../webrtc.utils";

const Camera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    // Note Ovishek: set timeout b/c need to wait till the images loads.
    setTimeout(() => {
      imageContainerRef.current?.scrollTo(
        0,
        imageContainerRef.current.scrollHeight
      );
    }, 100);
  }, [images]);

  return (
    <div className="flex flex-row">
      <div>
        <video ref={videoRef} autoPlay muted />
        <div>
          <button onClick={onTakePhoto}> Take Photo </button>
        </div>
      </div>

      <div
        ref={imageContainerRef}
        className="h-[480px] border border-slate-500 w-[300px] overflow-scroll"
      >
        {images.map((image, index) => {
          return <img key={index} src={image} />;
        })}
        {images.length === 0 && <div>Your photos will appear here</div>}
      </div>
    </div>
  );
};

export default Camera;
