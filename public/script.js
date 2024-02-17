const toolBtns = document.querySelectorAll(".tool"),
	fillColor = document.querySelector("#fill-color"),
	sizeSlider = document.querySelector("#size-slider"),
	colorBtns = document.querySelectorAll(".colors .option"),
	clearCanvas = document.querySelector(".clear-canvas"),
	saveImg = document.querySelector(".save-img"),
	canvas = document.querySelector("canvas"),
	ctx = canvas.getContext("2d");

let prevMouseX,
	prevMouseY,
	snapshot,
	isDrawing = false,
	selectedTool = "brush",
	brushWidth = 5,
	selectedColor = "#000";

const setCanvasBackground = () => {
	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = selectedColor;
};

window.addEventListener("load", () => {
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
	setCanvasBackground();
});

const drawRect = (e) => {
	if (!fillColor.checked) {
		return ctx.strokeRect(
			e.offsetX,
			e.offsetY,
			prevMouseX - e.offsetX,
			prevMouseY - e.offsetY
		);
	}
	ctx.fillRect(
		e.offsetX,
		e.offsetY,
		prevMouseX - e.offsetX,
		prevMouseY - e.offsetY
	);
};

const drawCircle = (e) => {
	ctx.beginPath();
	let radius = Math.sqrt(
		Math.pow(prevMouseX - e.offsetX, 2) +
			Math.pow(prevMouseY - e.offsetY, 2)
	);
	ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
	fillColor.checked ? ctx.fill() : ctx.stroke();
};
const drawLine = (e) => {
	ctx.beginPath();
	ctx.moveTo(prevMouseX, prevMouseY);
	ctx.lineTo(e.offsetX, e.offsetY);
	ctx.stroke();
};

const drawEllipse = (e) => {
	ctx.beginPath();
	let radiusX = Math.abs(prevMouseX - e.offsetX);
	let radiusY = Math.abs(prevMouseY - e.offsetY);
	let centerX = (prevMouseX + e.offsetX) / 2;
	let centerY = (prevMouseY + e.offsetY) / 2;
	ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
	fillColor.checked ? ctx.fill() : ctx.stroke();
};

const drawTriangle = (e) => {
	ctx.beginPath(); 
	ctx.moveTo(prevMouseX, prevMouseY); 
	ctx.lineTo(e.offsetX, e.offsetY); 
	ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); 
	ctx.closePath(); 
	fillColor.checked ? ctx.fill() : ctx.stroke(); 
};
const drawStar = (e) => {
	ctx.beginPath();
	const spikes = 5;
	const outerRadius = Math.abs(prevMouseX - e.offsetX);
	const innerRadius = outerRadius / 2;
	const centerX = (prevMouseX + e.offsetX) / 2;
	const centerY = (prevMouseY + e.offsetY) / 2;
	let rot = (Math.PI / 2) * 3;
	let x = centerX;
	let y = centerY;
	let step = Math.PI / spikes;

	ctx.moveTo(centerX, centerY - outerRadius);
	for (let i = 0; i < spikes; i++) {
		x = centerX + Math.cos(rot) * outerRadius;
		y = centerY + Math.sin(rot) * outerRadius;
		ctx.lineTo(x, y);
		rot += step;

		x = centerX + Math.cos(rot) * innerRadius;
		y = centerY + Math.sin(rot) * innerRadius;
		ctx.lineTo(x, y);
		rot += step;
	}
	ctx.lineTo(centerX, centerY - outerRadius);
	ctx.closePath();
	fillColor.checked ? ctx.fill() : ctx.stroke();
};



const startDraw = (e) => {
	isDrawing = true;
	prevMouseX = e.offsetX;
	prevMouseY = e.offsetY;
	ctx.beginPath();
	ctx.lineWidth = brushWidth;
	ctx.strokeStyle = selectedColor;
	ctx.fillStyle = selectedColor;
	console.log(e, ctx, canvas);
	snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};
const drawing = (e) => {
	if (!isDrawing) return;
	ctx.putImageData(snapshot, 0, 0);

	if (selectedTool === "brush" || selectedTool === "eraser") {
		ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
		ctx.lineTo(e.offsetX, e.offsetY);
		ctx.stroke();
	} else if (selectedTool === "rectangle") {
		drawRect(e);
	} else if (selectedTool === "circle") {
		drawCircle(e);
	} else if (selectedTool === "line") {
		drawLine(e);
	} else if (selectedTool === "eclipse") {
		drawEllipse(e);
	} else if (selectedTool === "star") {
		drawStar(e);
	} else {
		drawTriangle(e);
	}
};

toolBtns.forEach((btn) => {
	btn.addEventListener("click", () => {
		document.querySelector(".options .active").classList.remove("active");
		btn.classList.add("active");
		selectedTool = btn.id;
	});
});

sizeSlider.addEventListener("change", () => (brushWidth = sizeSlider.value)); 

colorBtns.forEach((btn) => {
	btn.addEventListener("click", () => {
		document
			.querySelector(".options .selected")
			.classList.remove("selected");
		btn.classList.add("selected");
		
		selectedColor = window
			.getComputedStyle(btn)
			.getPropertyValue("background-color");
	});
});

clearCanvas.addEventListener("click", () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height); 
	setCanvasBackground();
});

saveImg.addEventListener("click", () => {
	const link = document.createElement("a"); 
	link.download = `${Date.now()}.jpg`; 
	link.href = canvas.toDataURL(); 
	link.click(); 
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => (isDrawing = false));
// add for pointer down and up
canvas.addEventListener("pointerdown", startDraw);
canvas.addEventListener("pointermove", drawing);
canvas.addEventListener("pointerup", () => (isDrawing = false));
