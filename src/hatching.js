/**
 * Contour Line / Engraving Effect
 * Creates flowing horizontal lines based on image luminance
 * Similar to topographic maps and engraved artwork
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

    // Setup line drawing
    outputCtx.strokeStyle = '#000000';
    outputCtx.lineWidth = 0.8;
    outputCtx.lineCap = 'round';
    outputCtx.lineJoin = 'round';

    const lineSpacing = Math.max(2, spacing);

    // Create grayscale data
    const grayscale = new Array(width * height);
    for (let i = 0; i < data.length; i += 4) {
        const pixelIndex = i / 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        grayscale[pixelIndex] = rgbToGrayscale(r, g, b) / 255;
    }

    // Draw horizontal lines with vertical distortion based on luminance
    for (let y = 0; y < height; y += lineSpacing) {
        outputCtx.beginPath();
        
        for (let x = 0; x < width; x++) {
            // Get luminance at this position
            const pixelIndex = y * width + x;
            const luminance = grayscale[pixelIndex];
            
            // Distort line vertically based on darkness
            // Dark areas (low luminance) push line down more
            const distortion = (1 - luminance) * (lineSpacing * 2);
            const distortedY = y + distortion;

            if (x === 0) {
                outputCtx.moveTo(x, distortedY);
            } else {
                outputCtx.lineTo(x, distortedY);
            }
        }
        
        outputCtx.stroke();
    }

    // Add some cross-hatching for darker areas to increase contrast
    const crossHatchSpacing = lineSpacing * 2.5;
    const angleRad = (angle * Math.PI) / 180;

    outputCtx.lineWidth = 0.6;
    
    for (let i = -height; i < width + height; i += crossHatchSpacing) {
        outputCtx.beginPath();
        
        let pathStarted = false;
        
        for (let t = 0; t < Math.sqrt(width * width + height * height); t += 1) {
            const x = Math.round(Math.cos(angleRad) * t + Math.sin(angleRad) * i);
            const y = Math.round(Math.sin(angleRad) * t - Math.cos(angleRad) * i);

            if (x >= 0 && x < width && y >= 0 && y < height) {
                const pixelIndex = y * width + x;
                const luminance = grayscale[pixelIndex];
                
                // Only draw in dark areas
                if (luminance < 0.5) {
                    if (!pathStarted) {
                        outputCtx.moveTo(x, y);
                        pathStarted = true;
                    } else {
                        outputCtx.lineTo(x, y);
                    }
                }
            }
        }
        
        if (pathStarted) {
            outputCtx.stroke();
        }
    }

    // Copy output back to canvas
    ctx.drawImage(output, 0, 0);
}

// Export function
window.hatchingEffect = applyHatching;
