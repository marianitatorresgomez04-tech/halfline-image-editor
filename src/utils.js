/**
 * Utility functions for image processing
 */

// Get pixel data from image
function getPixelData(canvas) {
    const ctx = canvas.getContext('2d');
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

// Set pixel data to canvas
function setPixelData(canvas, imageData) {
    const ctx = canvas.getContext('2d');
    ctx.putImageData(imageData, 0, 0);
}

// Convert RGB to grayscale
function rgbToGrayscale(r, g, b) {
    return r * 0.299 + g * 0.587 + b * 0.114;
}

// Get grayscale value (0-255) for a pixel at position
function getGrayscaleAt(data, width, x, y) {
    if (x < 0 || x >= width || y < 0 || y >= data.length / (width * 4)) {
        return 255;
    }
    const index = (Math.floor(y) * width + Math.floor(x)) * 4;
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    return rgbToGrayscale(r, g, b);
}

// Apply brightness and contrast
function applyBrightnessContrast(canvas, brightness, contrast) {
    const imageData = getPixelData(canvas);
    const data = imageData.data;
    
    const brightnessFactor = brightness / 100;
    const contrastFactor = contrast / 100;
    
    for (let i = 0; i < data.length; i += 4) {
        // Apply contrast first
        data[i] = (data[i] - 128) * contrastFactor + 128;
        data[i + 1] = (data[i + 1] - 128) * contrastFactor + 128;
        data[i + 2] = (data[i + 2] - 128) * contrastFactor + 128;
        
        // Then apply brightness
        data[i] = Math.max(0, Math.min(255, data[i] * brightnessFactor));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] * brightnessFactor));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] * brightnessFactor));
    }
    
    setPixelData(canvas, imageData);
}

// Get average color in a region
function getAverageColorInRegion(data, width, x, y, size) {
    let r = 0, g = 0, b = 0, count = 0;
    
    for (let dy = 0; dy < size; dy++) {
        for (let dx = 0; dx < size; dx++) {
            const px = Math.floor(x + dx);
            const py = Math.floor(y + dy);
            
            if (px >= 0 && px < width && py >= 0 && py < data.length / (width * 4)) {
                const index = (py * width + px) * 4;
                r += data[index];
                g += data[index + 1];
                b += data[index + 2];
                count++;
            }
        }
    }
    
    return {
        r: Math.round(r / count),
        g: Math.round(g / count),
        b: Math.round(b / count)
    };
}

// Smooth/blur canvas
function blurCanvas(canvas, radius) {
    const ctx = canvas.getContext('2d');
    ctx.filter = `blur(${radius}px)`;
    const imageData = getPixelData(canvas);
    ctx.putImageData(imageData, 0, 0);
}

// Create temporary canvas with same dimensions
function createTempCanvas(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
}

// Clone canvas
function cloneCanvas(canvas) {
    const cloned = createTempCanvas(canvas.width, canvas.height);
    const ctx = cloned.getContext('2d');
    ctx.drawImage(canvas, 0, 0);
    return cloned;
}

// Draw circle with given color
function drawCircle(ctx, x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

// Draw line with given color
function drawLine(ctx, x1, y1, x2, y2, color, width = 1) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

// RGB to hex
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Hex to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Get image dimensions
function getImageDimensions(canvas) {
    return {
        width: canvas.width,
        height: canvas.height,
        pixels: canvas.width * canvas.height
    };
}
