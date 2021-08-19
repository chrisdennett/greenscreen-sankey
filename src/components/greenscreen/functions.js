// Where the Magic happens! 😁
export const drawCombinedCanvas = ({
  greenscreenCanvas,
  combinedCanvas,
  video,
  bgImg,
  colourToRemove,
  tolerance,
  cropBox,
  outBox,
  colourMode,
  brightnessAdjust,
  contrastAdjust,
  mirror = true,
}) => {
  combinedCanvas.width = bgImg.width;
  combinedCanvas.height = bgImg.height;

  const greenscreenCtx = greenscreenCanvas.getContext("2d");
  const combinedCtx = combinedCanvas.getContext("2d");

  // draw video to greenscreen canvas
  greenscreenCtx.save();
  if (mirror) {
    greenscreenCtx.scale(-1, 1);
    greenscreenCtx.drawImage(video, -greenscreenCanvas.width, 0);
  } else {
    greenscreenCtx.drawImage(video, 0, 0);
  }
  greenscreenCtx.restore();

  // remove the green
  removeGreenscreen(
    greenscreenCtx,
    greenscreenCanvas,
    colourToRemove,
    tolerance,
    colourMode,
    brightnessAdjust,
    contrastAdjust
  );
  // draw the photo to combined canvas
  combinedCtx.drawImage(bgImg, 0, 0);
  // draw image from greenscreen
  const srcX = cropBox.left * greenscreenCanvas.width;
  const srcY = cropBox.top * greenscreenCanvas.height;
  const rightMargin = cropBox.right * greenscreenCanvas.width;
  const bottomMargin = cropBox.bottom * greenscreenCanvas.height;
  const srcW = greenscreenCanvas.width - (srcX + rightMargin);
  const srcH = greenscreenCanvas.height - (srcY + bottomMargin);
  const hToWRatio = srcW / srcH;

  const outX = outBox.left * combinedCanvas.width;
  const outY = outBox.top * combinedCanvas.height;
  const outH = outBox.height * combinedCanvas.height;
  const outW = outH * hToWRatio;

  combinedCtx.drawImage(
    greenscreenCanvas,
    srcX,
    srcY,
    srcW,
    srcH,
    outX,
    outY,
    outW,
    outH
  );

  // draw box to greenscreen
  greenscreenCtx.strokeStyle = "red";
  greenscreenCtx.strokeRect(
    cropBox.left * greenscreenCanvas.width,
    cropBox.top * greenscreenCanvas.height,
    srcW,
    srcH
  );
};

// Get image with greenscreen removed
export const removeGreenscreen = (
  greenscreenCtx,
  canvas,
  colourToRemove,
  tolerance = 50,
  colourMode,
  brightnessAdjust,
  contrastAdjust
) => {
  const snapshot = greenscreenCtx.getImageData(
    0,
    0,
    canvas.width,
    canvas.height
  );
  const numberOfPixels = snapshot.data.length / 4;

  // Now the processing
  for (let i = 0; i < numberOfPixels; i++) {
    const red = snapshot.data[i * 4];
    const green = snapshot.data[i * 4 + 1];
    const blue = snapshot.data[i * 4 + 2];
    // const alpha = snapshot.data[i * 4 + 3];

    const redInRange = isWidthinRange(red, colourToRemove.r, tolerance);
    const greenInRange = isWidthinRange(green, colourToRemove.g, tolerance);
    const blueInRange = isWidthinRange(blue, colourToRemove.b, tolerance);

    if (redInRange && greenInRange && blueInRange) {
      snapshot.data[i * 4 + 3] = 0;
    } else if (colourMode === "b&w") {
      const gray = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
      snapshot.data[i * 4] = gray;
      snapshot.data[i * 4 + 1] = gray;
      snapshot.data[i * 4 + 2] = gray;
    } else if (colourMode === "b&w2") {
      const avg = (red + green + blue) / 3;
      snapshot.data[i * 4] = avg;
      snapshot.data[i * 4 + 1] = avg;
      snapshot.data[i * 4 + 2] = avg;
    } else if (colourMode === "sepia") {
      snapshot.data[i * 4] = Math.min(
        Math.round(0.393 * red + 0.769 * green + 0.189 * blue),
        255
      );
      snapshot.data[i * 4 + 1] = Math.min(
        Math.round(0.349 * red + 0.686 * green + 0.168 * blue),
        255
      );
      snapshot.data[i * 4 + 2] = Math.min(
        Math.round(0.272 * red + 0.534 * green + 0.131 * blue),
        255
      );
    } else {
      snapshot.data[i * 4] = red;
      snapshot.data[i * 4 + 1] = green;
      snapshot.data[i * 4 + 2] = blue;
    }
  }

  applyBrightness(snapshot.data, brightnessAdjust);
  applyContrast(snapshot.data, contrastAdjust);

  greenscreenCtx.putImageData(snapshot, 0, 0);
};

function applyBrightness(data, brightness) {
  for (var i = 0; i < data.length; i += 4) {
    data[i] += 255 * (brightness / 100);
    data[i + 1] += 255 * (brightness / 100);
    data[i + 2] += 255 * (brightness / 100);
  }
}

function applyContrast(data, contrast) {
  var factor = (259.0 * (contrast + 255.0)) / (255.0 * (259.0 - contrast));

  for (var i = 0; i < data.length; i += 4) {
    data[i] = truncateColor(factor * (data[i] - 128.0) + 128.0);
    data[i + 1] = truncateColor(factor * (data[i + 1] - 128.0) + 128.0);
    data[i + 2] = truncateColor(factor * (data[i + 2] - 128.0) + 128.0);
  }
}

function truncateColor(value) {
  if (value < 0) {
    value = 0;
  } else if (value > 255) {
    value = 255;
  }

  return value;
}

function isWidthinRange(num, target, margin) {
  const max = target + margin;
  const min = target - margin;

  return num > min && num < max;
}
