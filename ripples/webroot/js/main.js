var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

// CHANGE LOCALHOST TO YOUR IP HERE
var ws = new WebSocket("ws://128.179.136.71:8080/entry");

var circles = [];

ws.onopen = function(ev) {
	canvas.style.borderColor = "green";
}
ws.onclose = function(ev) {
	canvas.style.borderColor = "red";
}
ws.onmessage = function(ev) {
	ci = JSON.parse(ev.data);
	circles.push([ci.lon, ci.lat, 0]);
}

ctx.lineWidth = "1px";
ctx.strokeStyle = "black";

var x = 0;

function drawGreenie(lat, lon, x) {
	ctx.beginPath();
	ctx.arc(lat, lon, x, 0, 2 * Math.PI, false);
	ctx.closePath();
	ctx.stroke();
	//ctx.fillRect(x % canvas.width, 10, 50, 50);
	/*ctx.beginPath();
	ctx.arc(canvas.width/2, canvas.height/2, 20, 0, 2 * Math.PI, false);
	ctx.closePath();
	ctx.stroke();*/
	//ctx.fill();
}

function sixtyfps() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	circles.forEach(function(c) {
		drawGreenie(c[0], c[1], c[2]);
	});
	circles = circles.map(function(c) {
		if(c[2] > canvas.width) {
			return null;
		} else {
			c[2]++;
			return c;
		}
	}).filter(function(e){return e});
	//drawGreenie();

	var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var pixel = imageData.data;
	for (var i = 0; i < pixel.length; i++) {
		if (pixel[i + 3] < 128) {
			pixel[i + 3] = 0;
		} else {
			pixel[i + 3] = 255;
		}
	}
	ctx.putImageData(imageData, 0, 0);
	window.requestAnimationFrame(sixtyfps);
}

sixtyfps();

function getRealPos(e, c) {
	return {
		lon: parseInt(c.width * (e.clientX - c.offsetLeft) / canvas.offsetWidth, 10),
		lat: parseInt(c.height* (e.clientY - c.offsetTop) / canvas.offsetHeight, 10)
	}
}
canvas.addEventListener("mousedown", function (e) {
	p = getRealPos(e, canvas);
	ws.send(JSON.stringify(p));
}, false);

