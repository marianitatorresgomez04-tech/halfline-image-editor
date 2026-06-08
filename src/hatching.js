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

    // Convert angle to radians
    const angleRad = (angle * Math.PI) / 180;
    const lineSpacing = Math.max(1, spacing);

    // Create a temporary canvas for the hatching pattern
    const hatchCanvas = createTempCanvas(width, height);
    const hatchCtx = hatchCanvas.getContext('2d');

    // Draw first direction hatching
    hatchCtx.strokeStyle = '#000000';
    hatchCtx.lineWidth = 0.8;
    hatchCtx.lineCap = 'butt';
    hatchCtx.lineJoin = 'bevel';

    for (let i = -height; i < width + height; i += lineSpacing) {
        hatchCtx.beginPath();
        const x1 = i - Math.sin(angleRad) * height;
        const y1 = Math.cos(angleRad) * height;
        const x2 = i + Math.sin(angleRad) * height;
        const y2 = -Math.cos(angleRad) * height;
        
        hatchCtx.moveTo(x1, y1);
        hatchCtx.lineTo(x2, y2);
        hatchCtx.stroke();
    }

    // Draw second direction hatching (perpendicular)
    const perpendicularAngle = angleRad + Math.PI / 2;
    for (let i = -height; i < width + height; i += lineSpacing * 1.5) {
        hatchCtx.beginPath();
        const x1 = i - Math.sin(perpendicularAngle) * height;
        const y1 = Math.cos(perpendicularAngle) * height;
        const x2 = i + Math.sin(perpendicularAngle) * height;
        const y2 = -Math.cos(perpendicularAngle) * height;
        
        hatchCtx.moveTo(x1, y1);
        hatchCtx.lineTo(x2, y2);
        hatchCtx.stroke();
    }

    // Now apply the hatching pattern based on darkness
    const hatchImageData = hatchCtx.getImageData(0, 0, width, height);
    const hatchData = hatchImageData.data;
    const outputImageData = outputCtx.getImageData(0, 0, width, height);
    const outputData = outputImageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const pixelIndex = i / 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const gray = rgbToGrayscale(r, g, b);

        // Calculate darkness (0 = white, 1 = black)
        const darkness = 1 - (gray / 255);

        // Get the hatching pattern value
        const hatchR = hatchData[i];
        const hatchG = hatchData[i + 1];
        const hatchB = hatchData[i + 2];
        const hatchGray = rgbToGrayscale(hatchR, hatchG, hatchB);

        // Apply hatching based on darkness
        // Dark areas = show hatching, light areas = white
        if (darkness > 0.1) {
            // Show hatching if there's darkness
            if (hatchGray < 128) {
                // Use hatching
                outputData[i] = 0;     // R
                outputData[i + 1] = 0; // G
                outputData[i + 2] = 0; // B
            } else {
                // Keep white
                outputData[i] = 255;
                outputData[i + 1] = 255;
                outputData[i + 2] = 255;
            }
            outputData[i + 3] = 255; // Alpha
        } else {
            // Keep white for light areas
            outputData[i] = 255;
            outputData[i + 1] = 255;
            outputData[i + 2] = 255;
            outputData[i + 3] = 255;
        }
    }

    outputCtx.putImageData(outputImageData, 0, 0);

    // Copy output back to canvas
    ctx.drawImage(output, 0, 0);
}

// Export function
window.hatchingEffect = applyHatching;
