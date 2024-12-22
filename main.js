function isSmartPhone() {
	if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
		return true;
	} else {
		return false;
	}
}


function sleepSetTimeout(ms, callback) {
	setTimeout(callback, ms);
}

//OP用
function OP() {
	const OP = document.getElementById("OP");
	const OP_text = document.getElementById("op_text");
	const OP_front = document.getElementById("op_front");
	const header = document.getElementById("header");
	const contents = document.getElementById("contents");
	const style = document.getElementById("style");

	if (isSmartPhone()) {
		style.innerHTML = '<link rel="stylesheet" href="./style_phone.css">';
	}

	function EndOP() {
		OP.className = "";
		header.style = "display:flex;";
		contents.style = "display:block;";
	}

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