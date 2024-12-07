import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.167.0/build/three.module.js";

// サイズを指定
const width = 1920;
const height = 1080;
// 希望のFPSの上限を設定する
const maxFPS = 60;

// レンダラーを作成
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#background")
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);

// シーンを作成
const scene = new THREE.Scene();

scene.background = new THREE.Color(0xFFFFFF);

// カメラを作成
const camera = new THREE.PerspectiveCamera(45, width / height);
camera.position.set(0, 0, +1000);

// 箱を作成
const geometry = new THREE.BoxGeometry(400, 400, 400);
const material = new THREE.MeshNormalMaterial();
const box = new THREE.Mesh(geometry, material);
scene.add(box);

const light = new THREE.AmbientLight(0xFFFFFF, 1.0);
scene.add(light);


let lastUpdateTime = performance.now(); // 前回のフレームの時間

function animate() {
    requestAnimationFrame(animate);

    const now = performance.now();
    const deltaTime = now - lastUpdateTime;

    // 前回のフレームとの時間差分を基準にFPSを制御する
    if (deltaTime < 1000 / maxFPS) {
        return;
    }

    lastUpdateTime = now - (deltaTime % (1000 / maxFPS));

    // フレーム更新の処理を実行する
    // この中に描画処理やアニメーションなどを記述します
    // 例えば、controlsの更新を呼び出してカメラの位置を更新する場合は以下のようにします

    requestAnimationFrame(animate);

    // アニメーション処理をここに書く
    box.rotation.y += 0.01;

    renderer.render(scene, camera);
}

animate();
