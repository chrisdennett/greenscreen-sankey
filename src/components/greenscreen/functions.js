// Get image with greenscreen removed
export const removeGreenscreen = (
  ctx,
  canvas,
  colourToRemove,
  tolerance = 50
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
    }
  }

  ctx.putImageData(snapshot, 0, 0);
};

export const drawCombinedCanvas = ({
  greenscreenCanvas,
  combinedCanvas,
  video,
  bgImg,
  colourToRemove,
  tolerance,
  cropBox,
  outBox,
}) => {
  const ctx = greenscreenCanvas.getContext("2d");
  const combinedCtx = combinedCanvas.getContext("2d");

  // draw vdioe to greenscreen canvas
  ctx.drawImage(video, 0, 0);
  // remove the green
  removeGreenscreen(ctx, greenscreenCanvas, colourToRemove, tolerance);
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
