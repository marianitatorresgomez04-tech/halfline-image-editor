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

    // Adjust spacing based on darkness
    const baseSpacing = Math.max(1, spacing);
    const angleRad = (angle * Math.PI) / 180;

    // Process each pixel
    for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
            const index = (y * width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const gray = rgbToGrayscale(r, g, b);

            // Calculate darkness (0 = white, 1 = black)
            const darkness = 1 - (gray / 255);

            // Determine if we should draw a line at this pixel
            // based on darkness and angle
            let shouldDraw = false;
            let shouldDrawPerpendicular = false;

            // First direction
            const line1Pos = Math.sin(angleRad) * x + Math.cos(angleRad) * y;
            const spacing1 = baseSpacing * (1 + darkness);
            const mod1 = Math.abs(line1Pos % spacing1);
            if (mod1 < 1 && darkness > 0.15) {
                shouldDraw = true;
            }

            // Perpendicular direction
            const perpAngle = angleRad + Math.PI / 2;
            const line2Pos = Math.sin(perpAngle) * x + Math.cos(perpAngle) * y;
            const spacing2 = baseSpacing * 1.5 * (1 + darkness * 0.5);
            const mod2 = Math.abs(line2Pos % spacing2);
            if (mod2 < 1 && darkness > 0.3) {
                shouldDrawPerpendicular = true;
            }

            // Determine output color
            if (shouldDraw || shouldDrawPerpendicular) {
                outputCtx.fillStyle = '#000000';
            } else {
                outputCtx.fillStyle = '#ffffff';
            }
            outputCtx.fillRect(x, y, 1, 1);
        }
    }

    // Copy output back to canvas
    ctx.drawImage(output, 0, 0);
}

// Export function
window.hatchingEffect = applyHatching;
