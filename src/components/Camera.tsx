import React, { useEffect, useRef, useState } from "react";
import { getVideoCamera } from "../webrtc.utils";

const Camera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    getVideoCamera().then((stream) => {
      try {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch {}
    });
  }, []);
  return <video ref={videoRef} autoPlay muted />;
};

export default Camera;
