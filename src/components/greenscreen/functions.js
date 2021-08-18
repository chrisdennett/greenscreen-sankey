export const processImage = (ctx, canvas, colourToRemove, tolerance = 50) => {
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

function isWidthinRange(num, target, margin) {
  const max = target + margin;
  const min = target - margin;

  return num > min && num < max;
}
