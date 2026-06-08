/**
 * Hatching/Engraving effect
 * Creates crosshatch patterns like old engravings
 */

function applyHatching(canvas, spacing = 3, angle = 45) {
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

    // Save context state
    outputCtx.save();
    outputCtx.strokeStyle = '#000000';
    outputCtx.lineCap = 'round';
    outputCtx.lineJoin = 'round';

    // Convert angle to radians
    const angleRad = (angle * Math.PI) / 180;

    // Draw hatching lines based on brightness
    const lineSpacing = Math.max(1, spacing);

    // First direction hatching
    for (let i = 0; i < width + height; i += lineSpacing) {
        outputCtx.beginPath();
        const x1 = i - height * Math.cos(angleRad);
        const y1 = i * Math.sin(angleRad);
        const x2 = i + height * Math.cos(angleRad);
        const y2 = y1 + height * Math.cos(angleRad);

        outputCtx.moveTo(x1, y1);
        outputCtx.lineTo(x2, y2);
        outputCtx.stroke();
    }

    // Second direction hatching (perpendicular)
    const perpendicularAngle = angleRad + Math.PI / 2;
    for (let i = 0; i < width + height; i += lineSpacing * 2) {
        outputCtx.beginPath();
        const x1 = i - height * Math.cos(perpendicularAngle);
        const y1 = i * Math.sin(perpendicularAngle);
        const x2 = i + height * Math.cos(perpendicularAngle);
        const y2 = y1 + height * Math.cos(perpendicularAngle);

        outputCtx.moveTo(x1, y1);
        outputCtx.lineTo(x2, y2);
        outputCtx.stroke();
    }

    // Now apply darkness mask
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const gray = rgbToGrayscale(r, g, b);

            // Lighter areas = remove more lines
            const transparency = gray / 255;
            const outputIndex = (y * width + x) * 4;
            
            if (transparency > 0.3) {
                // Erase some of the hatching for lighter areas
                const outImageData = outputCtx.getImageData(x, y, 1, 1);
                const outData = outImageData.data;
                outData[3] = Math.round(outData[3] * (1 - transparency * 0.7));
                outputCtx.putImageData(outImageData, x, y);
            }
        }
    }

    outputCtx.restore();

    // Copy output back to canvas
    ctx.drawImage(output, 0, 0);
}

// Export function
window.hatchingEffect = applyHatching;
