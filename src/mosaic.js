/**
 * Mosaic effect
 * Creates a pixelated/mosaic pattern
 */

function applyMosaic(canvas, tileSize = 10, blurAmount = 1) {
    const ctx = canvas.getContext('2d');
    const imageData = getPixelData(canvas);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    // Apply blur first if specified
    if (blurAmount > 0) {
        ctx.filter = `blur(${blurAmount}px)`;
        ctx.drawImage(canvas, 0, 0);
        ctx.filter = 'none';
    }

    // Get updated image data after blur
    const blurredData = getPixelData(canvas);
    const pixelData = blurredData.data;

    // Create output canvas
    const output = createTempCanvas(width, height);
    const outputCtx = output.getContext('2d');

    // Process image in tiles
    for (let y = 0; y < height; y += tileSize) {
        for (let x = 0; x < width; x += tileSize) {
            // Get average color in this tile
            const color = getAverageColorInRegion(pixelData, width, x, y, tileSize);

            // Draw tile
            outputCtx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
            outputCtx.fillRect(x, y, tileSize, tileSize);
        }
    }

    // Copy output back to canvas
    ctx.drawImage(output, 0, 0);
}

// Export function
window.mosaicEffect = applyMosaic;
