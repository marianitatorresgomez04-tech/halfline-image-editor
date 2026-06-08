/**
 * Halftone effect
 * Creates a classic halftone dot pattern
 */

function applyHalftone(canvas, dotSize = 5, intensity = 100) {
    const ctx = canvas.getContext('2d');
    const imageData = getPixelData(canvas);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    // Create output canvas
    const output = createTempCanvas(width, height);
    const outputCtx = output.getContext('2d');
    outputCtx.fillStyle = '#ffffff';
    outputCtx.fillRect(0, 0, width, height);

    // Process image in blocks
    const cellSize = dotSize;
    const intensityFactor = intensity / 100;

    for (let y = 0; y < height; y += cellSize) {
        for (let x = 0; x < width; x += cellSize) {
            // Get average grayscale in this cell
            let gray = 0;
            let count = 0;

            for (let dy = 0; dy < cellSize && y + dy < height; dy++) {
                for (let dx = 0; dx < cellSize && x + dx < width; dx++) {
                    const index = ((y + dy) * width + (x + dx)) * 4;
                    const r = data[index];
                    const g = data[index + 1];
                    const b = data[index + 2];
                    gray += rgbToGrayscale(r, g, b);
                    count++;
                }
            }

            gray = gray / count;

            // Calculate dot size based on grayscale value
            // Inverse: darker = bigger dots
            const dotRadius = (dotSize / 2) * (1 - (gray / 255)) * intensityFactor;

            // Draw dot
            if (dotRadius > 0.3) {
                const centerX = x + cellSize / 2;
                const centerY = y + cellSize / 2;
                outputCtx.fillStyle = '#000000';
                outputCtx.beginPath();
                outputCtx.arc(centerX, centerY, dotRadius, 0, Math.PI * 2);
                outputCtx.fill();
            }
        }
    }

    // Copy output back to canvas
    ctx.drawImage(output, 0, 0);
}

// Export function
window.halftoneEffect = applyHalftone;
