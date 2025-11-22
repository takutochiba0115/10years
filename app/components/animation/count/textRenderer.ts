import * as THREE from 'three';

// Helper function to draw stylized text with pencil sketch effect
export const drawStylizedText = (
    textContext: CanvasRenderingContext2D,
    textCanvas: HTMLCanvasElement,
    text: string,
    x: number,
    y: number,
    font: string,
    progress: number
) => {
    // Setup for stylish font
    textContext.font = font;
    textContext.textAlign = 'center';
    textContext.textBaseline = 'middle';

    // Draw elegant white outline for shape definition
    textContext.strokeStyle = 'rgba(255, 255, 255, 0.95)';
    textContext.lineWidth = 14;
    textContext.lineCap = 'round';
    textContext.lineJoin = 'round';
    for (let i = 0; i < 5; i++) {
        const offsetX = (Math.random() - 0.5) * 2;
        const offsetY = (Math.random() - 0.5) * 2;
        textContext.strokeText(text, x + offsetX, y + offsetY);
    }

    // Fill the base with light gray
    textContext.fillStyle = 'rgba(240, 240, 240, 0.95)';
    textContext.fillText(text, x, y);

    // Create a temporary canvas to get the text outline for cross-hatching
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = textCanvas.width;
    tempCanvas.height = textCanvas.height;
    const tempContext = tempCanvas.getContext('2d')!;
    tempContext.font = textContext.font;
    tempContext.textAlign = 'center';
    tempContext.textBaseline = 'middle';
    tempContext.fillStyle = 'white';
    tempContext.fillText(text, x, y);

    // Get the text pixels for filling with black pencil strokes
    const imageData = tempContext.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const pixels = imageData.data;

    // Draw dense black cross-hatching inside the number (first layer)
    textContext.strokeStyle = 'rgba(20, 20, 20, 0.7)';
    textContext.lineWidth = 3;
    textContext.lineCap = 'round';

    for (let py = 0; py < tempCanvas.height; py += 4) {
        for (let px = 0; px < tempCanvas.width; px += 4) {
            const index = (py * tempCanvas.width + px) * 4;
            const alpha = pixels[index + 3];

            if (alpha > 128) {
                const angle1 = Math.PI / 4 + (Math.random() - 0.5) * 0.2;
                const angle2 = -Math.PI / 4 + (Math.random() - 0.5) * 0.2;
                const length = 10 + Math.random() * 6;

                // First direction
                textContext.beginPath();
                textContext.moveTo(px, py);
                textContext.lineTo(
                    px + Math.cos(angle1) * length,
                    py + Math.sin(angle1) * length
                );
                textContext.stroke();

                // Second direction for cross-hatch
                if (Math.random() > 0.2) {
                    textContext.beginPath();
                    textContext.moveTo(px, py);
                    textContext.lineTo(
                        px + Math.cos(angle2) * length,
                        py + Math.sin(angle2) * length
                    );
                    textContext.stroke();
                }
            }
        }
    }

    // Add thicker very dark black strokes (second layer)
    textContext.strokeStyle = 'rgba(10, 10, 10, 0.8)';
    textContext.lineWidth = 4;
    for (let py = 0; py < tempCanvas.height; py += 6) {
        for (let px = 0; px < tempCanvas.width; px += 6) {
            const index = (py * tempCanvas.width + px) * 4;
            const alpha = pixels[index + 3];

            if (alpha > 128 && Math.random() > 0.3) {
                const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.4;
                const length = 12 + Math.random() * 12;

                textContext.beginPath();
                textContext.moveTo(px, py);
                textContext.lineTo(
                    px + Math.cos(angle) * length,
                    py + Math.sin(angle) * length
                );
                textContext.stroke();
            }
        }
    }

    // Add horizontal strokes for variation (third layer)
    textContext.strokeStyle = 'rgba(0, 0, 0, 0.6)';
    textContext.lineWidth = 3;
    for (let py = 0; py < tempCanvas.height; py += 8) {
        for (let px = 0; px < tempCanvas.width; px += 8) {
            const index = (py * tempCanvas.width + px) * 4;
            const alpha = pixels[index + 3];

            if (alpha > 128 && Math.random() > 0.5) {
                const angle = (Math.random() - 0.5) * 0.3;
                const length = 8 + Math.random() * 10;

                textContext.beginPath();
                textContext.moveTo(px, py);
                textContext.lineTo(
                    px + Math.cos(angle) * length,
                    py + Math.sin(angle) * length
                );
                textContext.stroke();
            }
        }
    }

    // Minimal white accents for stylish touch (very subtle)
    if (progress > 0.5) {
        textContext.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        textContext.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
            const markX = x + (Math.random() - 0.5) * 180;
            const markY = y + (Math.random() - 0.5) * 180;
            const angle = Math.random() * Math.PI * 2;
            const length = 6 + Math.random() * 12;

            textContext.beginPath();
            textContext.moveTo(markX, markY);
            textContext.lineTo(
                markX + Math.cos(angle) * length,
                markY + Math.sin(angle) * length
            );
            textContext.stroke();
        }
    }
};

// Draw text with stylish dark pencil sketch
export const drawText = (
    textContext: CanvasRenderingContext2D,
    textCanvas: HTMLCanvasElement,
    textTexture: THREE.CanvasTexture,
    numText: string,
    yearsText: string,
    progress: number
) => {
    textContext.clearRect(0, 0, textCanvas.width, textCanvas.height);

    const centerX = textCanvas.width / 2;
    const centerY = textCanvas.height / 2;

    const numX = yearsText ? centerX - 180 : centerX;
    drawStylizedText(textContext, textCanvas, numText, numX, centerY, 'bold 340px "Helvetica Neue", "Arial", sans-serif', progress);

    if (yearsText) {
        const yearsX = centerX + 240;
        drawStylizedText(textContext, textCanvas, yearsText, yearsX, centerY, 'bold 110px "Helvetica Neue", "Arial", sans-serif', progress);
    }

    textTexture.needsUpdate = true;
};

