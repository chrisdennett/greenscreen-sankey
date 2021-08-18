import React, { useRef, useEffect, useState } from "react";
import CanvasColourPicker from "../canvasColourPicker/CanvasColourPicker";
import { processImage } from "./functions";
import styles from "./greenscreen.module.css";
// orig tutorial: https://github.com/sreetamdas/sreetamdas.com

export const GreenScreen = ({ bgImg }) => {
  const [frameCount, setFrameCount] = useState(0);
  const [colourToRemove, setColourToRemove] = useState({ r: 0, g: 255, b: 0 });

  const videoRef = useRef(null);
  const greenscreenCanvasRef = useRef(null);
  const combinedCanvasRef = useRef(null);

  const hideWebcam = true;
  const hideGreenscreenCanvas = false;

  useEffect(() => {
    const constraints = {
      audio: false,
      video: true,
    };

    const video = videoRef.current;
    navigator.mediaDevices.getUserMedia(constraints).then((mediaStream) => {
      video.srcObject = mediaStream;
      video.onloadeddata = () => {
        video.play();
      };
    });

    const intervalId = setInterval(() => setFrameCount((prev) => prev + 1), 20);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!bgImg) return;

    const video = videoRef.current;
    const greenscreenCanvas = greenscreenCanvasRef.current;
    const ctx = greenscreenCanvas.getContext("2d");
    const combinedCanvas = combinedCanvasRef.current;
    const combinedCtx = combinedCanvas.getContext("2d");

    ctx.drawImage(video, 0, 0);
    processImage(ctx, greenscreenCanvas, colourToRemove);

    combinedCtx.drawImage(bgImg, 0, 0);
    combinedCtx.drawImage(
      greenscreenCanvas,
      0,
      0,
      greenscreenCanvas.width,
      greenscreenCanvas.height,
      30,
      150,
      greenscreenCanvas.width / 2,
      greenscreenCanvas.height / 2
    );
  }, [bgImg, colourToRemove, frameCount]);

  const onCanvasClick = (e) => {
    e.preventDefault();

    const canvas = greenscreenCanvasRef.current;
    const coord = getEventLocation(canvas, e);

    const ctx = canvas.getContext("2d");
    var imgData = ctx.getImageData(coord.x, coord.y, 1, 1);
    const red = imgData.data[0];
    const green = imgData.data[1];
    const blue = imgData.data[2];
    // const alpha = imgData.data[3];

    setColourToRemove({ r: red, g: green, b: blue });
  };

  return (
    <div className={styles.greenscreen}>
      <div
        style={{
          position: "fixed",
          fontSize: 10,
          zIndex: 1,
          width: 50,
          height: 50,
          backgroundColor: `rgb(${colourToRemove.r}, ${colourToRemove.g}, ${colourToRemove.b})`,
        }}
      >
        r:{colourToRemove.r} <br />
        g:{colourToRemove.g} <br />
        b:{colourToRemove.b}
      </div>

      <canvas
        ref={greenscreenCanvasRef}
        width="640"
        height="480"
        hidden={hideGreenscreenCanvas}
        onClick={onCanvasClick}
      />

      <canvas ref={combinedCanvasRef} width="640" height="480" />

      <video
        ref={videoRef}
        hidden={hideWebcam}
        style={{
          width: "640px",
          height: "480px",
        }}
      />
    </div>
  );
};

function getElementPosition(obj) {
  var curleft = 0,
    curtop = 0;
  if (obj.offsetParent) {
    do {
      curleft += obj.offsetLeft;
      curtop += obj.offsetTop;
    } while ((obj = obj.offsetParent));
    return { x: curleft, y: curtop };
  }
  return undefined;
}

function getEventLocation(element, event) {
  // Relies on the getElementPosition function.
  var pos = getElementPosition(element);

  return {
    x: event.pageX - pos.x,
    y: event.pageY - pos.y,
  };
}
