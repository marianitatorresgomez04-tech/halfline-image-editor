/**
 * Stipple effect
 * Creates a dotted/pointillism pattern
 */

function applyStipple(canvas, density = 50, dotSize = 2) {
    const ctx = canvas.getContext('2d');
    const imageData = getPixelData(canvas);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    // Create output canvas (white background)
    const output = createTempCanvas(width, height);
    const outputCtx = output.getContext('2d');
    outputCtx.fillStyle = '#ffffff';
    outputCtx.fillRect(0, 0, width, height);

    // Calculate sampling grid
    const cellSize = Math.max(1, Math.ceil(100 / density));
    const dotRadius = dotSize / 2;

    // Sample points
    for (let y = 0; y < height; y += cellSize) {
        for (let x = 0; x < width; x += cellSize) {
            // Add some randomness to position
            const offsetX = (Math.random() - 0.5) * cellSize;
            const offsetY = (Math.random() - 0.5) * cellSize;
            const sampleX = Math.max(0, Math.min(width - 1, x + offsetX));
            const sampleY = Math.max(0, Math.min(height - 1, y + offsetY));

            // Get grayscale at this point
            const index = (Math.floor(sampleY) * width + Math.floor(sampleX)) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const gray = rgbToGrayscale(r, g, b);

            // Draw dot with size based on brightness
            // Darker areas = larger dots
            const darknessFactor = 1 - (gray / 255);
            const radius = dotRadius * (0.3 + darknessFactor * 1.7);

            if (radius > 0.2) {
                outputCtx.fillStyle = '#000000';
                outputCtx.beginPath();
                outputCtx.arc(sampleX, sampleY, radius, 0, Math.PI * 2);
                outputCtx.fill();
            }
        }
    }

    // Copy output back to canvas
    ctx.drawImage(output, 0, 0);
}

// Export function
window.stippleEffect = applyStipple;
