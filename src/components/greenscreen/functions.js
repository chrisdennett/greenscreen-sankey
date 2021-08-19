// Get image with greenscreen removed
export const removeGreenscreen = (
  ctx,
  canvas,
  colourToRemove,
  tolerance = 50,
  colourMode,
  brightnessAdjust,
  contrastAdjust
) => {
  const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
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
      let gray = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
      gray += brightnessAdjust;
      snapshot.data[i * 4] = gray;
      snapshot.data[i * 4 + 1] = gray;
      snapshot.data[i * 4 + 2] = gray;
    } else if (colourMode === "b&w2") {
      let avg = (red + green + blue) / 3;
      avg += brightnessAdjust;
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
      snapshot.data[i * 4] = red + brightnessAdjust;
      snapshot.data[i * 4 + 1] = green + brightnessAdjust;
      snapshot.data[i * 4 + 2] = blue + brightnessAdjust;
    }
  }

  applyContrast(snapshot.data, contrastAdjust);

  ctx.putImageData(snapshot, 0, 0);
};

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
}) => {
  combinedCanvas.width = bgImg.width;
  combinedCanvas.height = bgImg.height;

  const ctx = greenscreenCanvas.getContext("2d");
  const combinedCtx = combinedCanvas.getContext("2d");

  // draw vdioe to greenscreen canvas
  ctx.drawImage(video, 0, 0);
  // remove the green
  removeGreenscreen(
    ctx,
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
  const srcX = cropBox.left * combinedCanvas.width;
  const srcY = cropBox.top * combinedCanvas.height;
  const rightMargin = cropBox.right * combinedCanvas.width;
  const bottomMargin = cropBox.bottom * combinedCanvas.height;
  const srcW = combinedCanvas.width - (srcX + rightMargin);
  const srcH = combinedCanvas.height - (srcY + bottomMargin);
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
};

function isWidthinRange(num, target, margin) {
  const max = target + margin;
  const min = target - margin;

  return num > min && num < max;
}
