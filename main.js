


function sleepSetTimeout(ms, callback) {
	setTimeout(callback, ms);
}

//OP用
function OP() {
	var OP = document.getElementById("OP");
	var OP_text = document.getElementById("op_text");
	var OP_front = document.getElementById("op_front");
	var header = document.getElementById("header");
	var contents = document.getElementById("contents");
	OP.className = "Playing";
	OP_text.className = "Playing";
	OP_front.className = "Playing";
	sleepSetTimeout(3000, function () {
		OP.className = "";
		header.style = "display:flex;";
		contents.style = "display:block;";
});
}

function displayTime() {

	// ゼロパディングして２桁にする関数
	function padZero(value) {
		return value.toString().padStart(2, '0');
	}

	const now = new Date();

	const hour = padZero(now.getHours());
	const minute = padZero(now.getMinutes());
	const second = padZero(now.getSeconds());

	const currentTime = `${hour}:${minute}:${second}`;
	document.getElementById("clock").textContent = currentTime;
}

displayTime();
setInterval(displayTime, 1000);