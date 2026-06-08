/**
 * Main application logic
 */

// State
let originalImage = null;
let currentTool = 'halftone';
let isProcessing = false;

// DOM Elements
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const uploadArea = document.getElementById('uploadArea');
const imageInput = document.getElementById('imageInput');
const placeholder = document.getElementById('placeholder');
const imageSize = document.getElementById('imageSize');
const resetBtn = document.getElementById('resetBtn');
const downloadBtn = document.getElementById('downloadBtn');
const toolBtns = document.querySelectorAll('.tool-btn');

// Event Listeners
uploadArea.addEventListener('click', () => imageInput.click());
uploadArea.addEventListener('dragover', handleDragOver);
uploadArea.addEventListener('dragleave', handleDragLeave);
uploadArea.addEventListener('drop', handleDrop);
imageInput.addEventListener('change', handleImageSelect);

// Tool buttons
toolBtns.forEach(btn => {
    btn.addEventListener('click', () => selectTool(btn.dataset.tool));
});

// Control sliders
document.getElementById('halftone-size')?.addEventListener('input', (e) => {
    document.getElementById('halftone-size-value').textContent = e.target.value;
    if (originalImage) applyEffect();
});

document.getElementById('halftone-intensity')?.addEventListener('input', (e) => {
    document.getElementById('halftone-intensity-value').textContent = e.target.value;
    if (originalImage) applyEffect();
});

document.getElementById('stipple-density')?.addEventListener('input', (e) => {
    document.getElementById('stipple-density-value').textContent = e.target.value;
    if (originalImage) applyEffect();
});

document.getElementById('stipple-size')?.addEventListener('input', (e) => {
    document.getElementById('stipple-size-value').textContent = e.target.value;
    if (originalImage) applyEffect();
});

document.getElementById('hatching-spacing')?.addEventListener('input', (e) => {
    document.getElementById('hatching-spacing-value').textContent = e.target.value;
    if (originalImage) applyEffect();
});

document.getElementById('hatching-angle')?.addEventListener('input', (e) => {
    document.getElementById('hatching-angle-value').textContent = e.target.value;
    if (originalImage) applyEffect();
});

document.getElementById('mosaic-size')?.addEventListener('input', (e) => {
    document.getElementById('mosaic-size-value').textContent = e.target.value;
    if (originalImage) applyEffect();
});

document.getElementById('mosaic-blur')?.addEventListener('input', (e) => {
    document.getElementById('mosaic-blur-value').textContent = e.target.value;
    if (originalImage) applyEffect();
});

document.getElementById('brightness')?.addEventListener('input', (e) => {
    document.getElementById('brightness-value').textContent = e.target.value;
    if (originalImage) applyEffect();
});

document.getElementById('contrast')?.addEventListener('input', (e) => {
    document.getElementById('contrast-value').textContent = e.target.value;
    if (originalImage) applyEffect();
});

// Action buttons
resetBtn.addEventListener('click', resetEditor);
downloadBtn.addEventListener('click', downloadImage);

// Functions
function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('dragover');
}

function handleDragLeave() {
    uploadArea.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        loadImage(files[0]);
    }
}

function handleImageSelect(e) {
    if (e.target.files.length > 0) {
        loadImage(e.target.files[0]);
    }
}

function loadImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            // Set canvas size with max dimensions
            let width = img.width;
            let height = img.height;
            const maxWidth = 1000;
            const maxHeight = 600;

            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width = Math.round(width * ratio);
                height = Math.round(height * ratio);
            }

            canvas.width = width;
            canvas.height = height;

            // Draw image
            ctx.drawImage(img, 0, 0, width, height);

            // Save original
            originalImage = cloneCanvas(canvas);

            // Update UI
            placeholder.style.display = 'none';
            canvas.classList.add('visible');
            uploadArea.style.display = 'none';

            const dimensions = getImageDimensions(canvas);
            imageSize.textContent = `${dimensions.width}x${dimensions.height}px`;

            resetBtn.disabled = false;
            downloadBtn.disabled = false;

            // Apply default effect
            applyEffect();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function selectTool(tool) {
    currentTool = tool;

    // Update button states
    toolBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tool="${tool}"]`).classList.add('active');

    // Update controls visibility
    document.querySelectorAll('.tool-controls').forEach(control => {
        control.style.display = 'none';
    });
    const controlId = `${tool}-controls`;
    const controlElement = document.getElementById(controlId);
    if (controlElement) {
        controlElement.style.display = 'block';
    }

    // Apply effect
    if (originalImage) {
        applyEffect();
    }
}

function applyEffect() {
    if (!originalImage || isProcessing) return;

    isProcessing = true;

    // Restore from original
    ctx.drawImage(originalImage, 0, 0);

    try {
        // Apply selected effect
        switch (currentTool) {
            case 'halftone':
                const dotSize = parseInt(document.getElementById('halftone-size').value);
                const intensity = parseInt(document.getElementById('halftone-intensity').value);
                halftoneEffect(canvas, dotSize, intensity);
                break;

            case 'stipple':
                const density = parseInt(document.getElementById('stipple-density').value);
                const stippleDotSize = parseInt(document.getElementById('stipple-size').value);
                stippleEffect(canvas, density, stippleDotSize);
                break;

            case 'hatching':
                const spacing = parseInt(document.getElementById('hatching-spacing').value);
                const angle = parseInt(document.getElementById('hatching-angle').value);
                hatchingEffect(canvas, spacing, angle);
                break;

            case 'mosaic':
                const tileSize = parseInt(document.getElementById('mosaic-size').value);
                const blur = parseInt(document.getElementById('mosaic-blur').value);
                mosaicEffect(canvas, tileSize, blur);
                break;
        }

        // Apply brightness and contrast
        const brightness = parseInt(document.getElementById('brightness').value);
        const contrast = parseInt(document.getElementById('contrast').value);
        applyBrightnessContrast(canvas, brightness, contrast);
    } catch (error) {
        console.error('Error applying effect:', error);
        ctx.drawImage(originalImage, 0, 0);
    }

    isProcessing = false;
}

function resetEditor() {
    // Reset values
    document.getElementById('halftone-size').value = 5;
    document.getElementById('halftone-size-value').textContent = '5';
    document.getElementById('halftone-intensity').value = 100;
    document.getElementById('halftone-intensity-value').textContent = '100';

    document.getElementById('stipple-density').value = 50;
    document.getElementById('stipple-density-value').textContent = '50';
    document.getElementById('stipple-size').value = 2;
    document.getElementById('stipple-size-value').textContent = '2';

    document.getElementById('hatching-spacing').value = 3;
    document.getElementById('hatching-spacing-value').textContent = '3';
    document.getElementById('hatching-angle').value = 45;
    document.getElementById('hatching-angle-value').textContent = '45';

    document.getElementById('mosaic-size').value = 10;
    document.getElementById('mosaic-size-value').textContent = '10';
    document.getElementById('mosaic-blur').value = 1;
    document.getElementById('mosaic-blur-value').textContent = '1';

    document.getElementById('brightness').value = 100;
    document.getElementById('brightness-value').textContent = '100';
    document.getElementById('contrast').value = 100;
    document.getElementById('contrast-value').textContent = '100';

    // Reset tool
    currentTool = 'halftone';
    toolBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-tool="halftone"]').classList.add('active');
    document.querySelectorAll('.tool-controls').forEach(control => control.style.display = 'none');
    document.getElementById('halftone-controls').style.display = 'block';

    // Restore original image
    if (originalImage) {
        ctx.drawImage(originalImage, 0, 0);
    }
}

function downloadImage() {
    const link = document.createElement('a');
    link.download = `halfline-${currentTool}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Initial state
resetBtn.disabled = true;
downloadBtn.disabled = true;
