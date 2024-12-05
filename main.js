


function sleepSetTimeout(ms, callback) {
	setTimeout(callback, ms);
}

//OP用
function OP() {

	function EndOP() {
		OP.className = "";
		header.style = "display:flex;";
		contents.style = "display:block;";
	}

	var OP = document.getElementById("OP");
	var OP_text = document.getElementById("op_text");
	var OP_front = document.getElementById("op_front");
	var header = document.getElementById("header");
	var contents = document.getElementById("contents");

	if (!sessionStorage.getItem('firstVisit')) {
		// 初回訪問の場合、セッションストレージにフラグをセット
		sessionStorage.setItem('firstVisit', 'true');
	} else {
		EndOP();
		return 0;
	}

	OP.className = "Playing";
	OP_text.className = "Playing";
	OP_front.className = "Playing";

	sleepSetTimeout(3000, function () {
		EndOP();
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