import React, { useRef, useEffect, useState } from "react";
import { drawCombinedCanvas } from "./functions";
import styles from "./greenscreen.module.css";
// orig tutorial: https://github.com/sreetamdas/sreetamdas.com

export const GreenScreen = ({
  bgImg,
  colourToRemove,
  tolerance,
  cropBox,
  outBox,
  setColourToRemove,
  visibleElements,
  colourMode,
  brightnessAdjust,
}) => {
  const [frameCount, setFrameCount] = useState(0);

  const videoRef = useRef(null);
  const greenscreenCanvasRef = useRef(null);
  const combinedCanvasRef = useRef(null);

  useEffect(() => {
    const constraints = {
      audio: false,
      video: { width: 1280, height: 720 },
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
    const combinedCanvas = combinedCanvasRef.current;

    drawCombinedCanvas({
      greenscreenCanvas,
      combinedCanvas,
      video,
      bgImg,
      colourToRemove,
      tolerance,
      cropBox,
      outBox,
      colourMode,
      frameCount,
      brightnessAdjust,
    });
  });

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
      <canvas
        id="Greenscreen"
        ref={greenscreenCanvasRef}
        width="1280"
        height="720"
        hidden={!visibleElements.greenscreen}
        onClick={onCanvasClick}
      />

      <canvas
        ref={combinedCanvasRef}
        width="1280"
        height="720"
        hidden={!visibleElements.output}
      />

      <video
        ref={videoRef}
        hidden={!visibleElements.webcam}
        // style={{
        //   width: "1280px",
        //   height: "720px",
        // }}
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
