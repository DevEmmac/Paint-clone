let id = (id) => document.getElementById(id);
    activeToolEl = id('active-tool'),
    brushBtnColor = id('brush-color'),
    brushIcon = id('brush'),
    brushSize = id('brush-size'),
    brushSlider = id('brush-slider'),
    btnColorBucket = id('bucket-color'),
    eraser = id('eraser'),
    clearCanvasBtn = id('clear-canvas'),
    saveStorageBtn = id('save-storage'),
    loadStorageBtn = id('load-storage'),
    clearStorageBtn = id('clear-storage'),
    downloadBtn = id('download');

const { body } = document;

// Gloabal Variable
const canvas = document.createElement('canvas');
canvas.id = 'canvas';
const context = canvas.getContext('2d');
let currentSize = 10;
let bucketColor = "#ffffff";
let currentColor = '#A51DAB';
let isEraser = false;
let isMouseDown = false;
let drawnArray = [];

// formmating Brush Size
 function displayBrushSize() {
   if (brushSlider.value < 10) {
        brushSize.textContent = `0${brushSlider.value}`;
   } else {
    brushSize.textContent = brushSlider.value;
   }
}

// Setting Brush size
brushSlider.addEventListener('change', () => {
   currentSize = brushSlider.value;
   displayBrushSize();
})

// Setting Brush Color
brushBtnColor.addEventListener('change', () => {
  isEraser = false;
  currentColor = `#${brushBtnColor.value}`;
});

//  Setting Background Color
 btnColorBucket.addEventListener('change', () => {
  bucketColor = `#${btnColorBucket.value}`;
  createCanvas();
});

// Eraser
eraser.addEventListener('click', () => {
    isEraser = true;
    brushIcon.style.color = 'white';
    eraser.style.color = 'black';
    activeToolEl.textContent = 'Eraser';
    currentColor = bucketColor;
    currentSize = 50;
});

// Switch back to Brush
function switchToBrush() {
    isEraser = false;
    activeToolEl.textContent = 'Brush';
    brushIcon.style.color = 'black';
    eraser.style.color = 'white';
    currentColor = `#${brushBtnColor.value}`;
    currentSize = 10;
    brushSlider.value = 10;
    displayBrushSize();
};

// Create Canvas
  function createCanvas() {
     canvas.width = window.innerWidth;
     canvas.height = window.innerHeight - 50;
     context.fillStyle = bucketColor;
     context.fillRect(0, 0, canvas.width, canvas.height);
     body.appendChild(canvas);
     switchToBrush();
  };

//   Clear Canvas
clearCanvasBtn.addEventListener('click', () => {
    createCanvas();
    drawArray = [];
    // Active Tool
    activeToolEl.textContent = 'Canvas Cleared';
    setTimeout(switchToBrush, 1500);
})

// Draw what is stored in DrawArray
function restoreCanvas() {
    for (let i = 1; i < drawnArray.length; i++) {
        context.beginPath();
        context.moveTo(drawnArray[i - 1].x, drawnArray[i - 1].y);
        context.lineWidth = drawnArray[i].size;
        context.lineCap = 'round'; 
        if (drawnArray[i].eraser) {
            context.strokeStyle = bucketColor;
        } else {
            context.strokeStyle = drawnArray[i].color;
        }
        context.lineTo(drawnArray[i].x, drawnArray[i].y);
        context.stroke();
        }
    }
// }

// Store Drawn lines in DrawnArray
function storeDrawn(x, y, size, color, erase) {
    const line = {
        x,
        y,
        size,
        color,
        erase,
    };
    console.log(line);
    drawnArray.push(line);
}

// Get Mouse position
function getMousePosition(event) {
    const boundaries = canvas.getBoundingClientRect();
    return {
        x: event.clientX - boundaries.left,
        y:event.clientY - boundaries.top,
    };
}

// Mouse Down
canvas.addEventListener('mousedown', (event) => {
    isMouseDown = true;
    const currentPosition = getMousePosition(event);
    context.moveTo(currentPosition.x, currentPosition.y);
    context.beginPath();
    context.lineWidth = currentSize;
    context.lineCap = 'round';
    context.strokeStyle = currentColor;
});


//   Mouse Move
canvas.addEventListener('mousemove', (event) => {
    if (isMouseDown) {
        const currentPosition = getMousePosition(event);
        context.lineTo(currentPosition.x, currentPosition.y);
        context.stroke();
        storeDrawn(
            currentPosition.x,
            currentPosition.y,
            currentSize,
            currentColor,
            isEraser);
    } else {
        storeDrawn(undefined);
    }
});

// Mouse Up
canvas.addEventListener('mouseup', () => {
    isMouseDown = false;
});

// Save to Local Storage
 saveStorageBtn.addEventListener('click', () => {
    localStorage.setItem('savedCanvas', JSON.stringify(drawnArray));
    // Active Tool
    activeToolEl.textContent ='Canvas Saved';
    setTimeout(switchToBrush, 1500);
});
//  // Load from Loacal Storage
loadStorageBtn.addEventListener('click', () => {
    if (localStorage.getItem('savedCanvas')) {
        drawnArray = JSON.parse(localStorage.savedCanvas);
        restoreCanvas();
        // ACTIVE TOOL
        activeToolEl.textContent = 'Canvas Loaded';
        setTimeout(switchToBrush, 1500);
    } else {
        activeToolEl.textContent = 'No Canvas Found';
        setTimeout(switchToBrush, 1500);
    }
});

// // Clear Loacal Storage
clearStorageBtn.addEventListener('click', () => {
    localStorage.removeItem('savedCanvas');
    // Active tool
    activeToolEl.textContent = 'local storage Cleared'
    setTimeout(switchToBrush, 1500);
});


//   // Download Image
 downloadBtn.addEventListener('click', () => {
    downloadBtn.href = canvas.toDataURL('image/jpeg', 1);
    downloadBtn.download = 'paint-example.jpeg';
    // Active tool
    activeToolEl.textContent = 'Image File Saved';
    setTimeout(switchToBrush, 1500);
});

 // Event Listener
brushIcon.addEventListener('click', switchToBrush);

//  on load
  createCanvas();