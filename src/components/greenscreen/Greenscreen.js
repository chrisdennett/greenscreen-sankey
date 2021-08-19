import React, { useRef, useEffect, useState } from "react";
import { drawCombinedCanvas } from "./functions";
import styles from "./greenscreen.module.css";
// orig tutorial: https://github.com/sreetamdas/sreetamdas.com

export const GreenScreen = ({ bgImg }) => {
  const [frameCount, setFrameCount] = useState(0);
  const [cropBox, setCropBox] = useState({
    top: 0.25,
    bottom: 0,
    left: 0.2,
    right: 0.17,
  });
  const [outBox, setOutBox] = useState({ top: 0.6, left: 0.3, height: 0.2 });
  const [colourToRemove, setColourToRemove] = useState({
    r: 27,
    g: 220,
    b: 166,
  });
  const [tolerance, setTolerance] = useState(100);

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
    });
  }, [bgImg, colourToRemove, frameCount, tolerance]);

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

  const onToleranceChange = (e) => setTolerance(parseInt(e.target.value));
  const onOutBoxChange = (prop, value) =>
    setOutBox({ ...outBox, [prop]: value });
  const onCropBoxChange = (prop, value) =>
    setCropBox({ ...cropBox, [prop]: value });

  return (
    <div className={styles.greenscreen}>
      <div>
        <div>
          <h2>Greenscreen settings</h2>
          <div
            style={{
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
          <label>
            tolerance:
            <input
              type="range"
              value={tolerance}
              onChange={onToleranceChange}
              min="0"
              max="255"
            />
            {tolerance}
          </label>
          <label>
            crop left:
            <input
              type="range"
              value={cropBox.left}
              onChange={(e) => onCropBoxChange("left", e.target.value)}
              min="0"
              max="1"
              step="0.01"
            />
            {outBox.left}
          </label>
          <label>
            crop right:
            <input
              type="range"
              value={cropBox.right}
              onChange={(e) => onCropBoxChange("right", e.target.value)}
              min="0"
              max="1"
              step="0.01"
            />
            {outBox.right}
          </label>
          <label>
            crop top:
            <input
              type="range"
              value={cropBox.top}
              onChange={(e) => onCropBoxChange("top", e.target.value)}
              min="0"
              max="1"
              step="0.01"
            />
            {outBox.top}
          </label>
          <label>
            crop bottom:
            <input
              type="range"
              value={cropBox.bottom}
              onChange={(e) => onCropBoxChange("bottom", e.target.value)}
              min="0"
              max="1"
              step="0.01"
            />
            {outBox.bottom}
          </label>
        </div>
      </div>

      <div>
        <h2>Combined Photo settings</h2>
        <label>
          left:
          <input
            type="range"
            value={outBox.left}
            onChange={(e) => onOutBoxChange("left", e.target.value)}
            min="0"
            max="1"
            step="0.01"
          />
          {outBox.left}
        </label>
        <label>
          top:
          <input
            type="range"
            value={outBox.top}
            onChange={(e) => onOutBoxChange("top", e.target.value)}
            min="0"
            max="1"
            step="0.01"
          />
          {outBox.top}
        </label>
        <label>
          height:
          <input
            type="range"
            value={outBox.height}
            onChange={(e) => onOutBoxChange("height", e.target.value)}
            min="0"
            max="1"
            step="0.01"
          />
          {outBox.height}
        </label>
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
