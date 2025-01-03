import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.167.0/build/three.module.js";

// サイズを指定
const canvas = document.querySelector("#background");
let width = window.innerWidth; // let に変更
let height = window.innerHeight; // let に変更

// リサイズ対応
window.addEventListener("resize", () => {
    width = window.innerWidth; // 再代入可能
    height = window.innerHeight; // 再代入可能
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
});
;

// レンダラーを作成
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#background")
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);

canvas.style.width = `${width}px`; // 表示サイズを明示的に指定
canvas.style.height = `${height}px`; // 同上

// シーンを作成
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFFFFFF);

// カメラを作成
const camera = new THREE.PerspectiveCamera(45, width / height);
camera.position.set(0, 0, +1000);


// 箱を作成
class Box {
    constructor({ sizex, sizey, sizez, positionx, positiony, positionz }) {
        this.sizex = sizex;
        this.sizey = sizey;
        this.sizez = sizez;
        this.positionx = positionx;
        this.positiony = positiony;
        this.positionz = positionz;
        this.box = null; // boxオブジェクトを後で初期化する
    }

    createBox() {
        const geometry = new THREE.BoxGeometry(this.sizex, this.sizey, this.sizez);
        const material = new THREE.MeshNormalMaterial();
        this.box = new THREE.Mesh(geometry, material);
        this.box.position.set(this.positionx, this.positiony, this.positionz);
        return this.box;
    }
}


// 使用例
// Boxの設定を配列でまとめる
const boxConfigs = [
    { sizex: 200, sizey: 200, sizez: 200, positionx: -400, positiony: 200, positionz: 0 },
    { sizex: 100, sizey: 100, sizez: 100, positionx: 400, positiony: -200, positionz: 0 },
    { sizex: 300, sizey: 300, sizez: 300, positionx: 0, positiony: 0, positionz: 0 }
];

// Boxをループで作成してシーンに追加
const boxes = boxConfigs.map(config => {
    const box = new Box(config);
    scene.add(box.createBox());
    return box;
});


//三角錐
const cone_geometry = new THREE.ConeGeometry(100, 200, 128);
const coneMaterial = new THREE.MeshNormalMaterial();
const coneMesh = new THREE.Mesh(cone_geometry, coneMaterial);
scene.add(coneMesh);

//ライト
const light = new THREE.AmbientLight(0xFFFFFF, 1.0);
scene.add(light);


let lastUpdateTime = performance.now(); // 最後に更新した時間
let fpsUpdateTime = performance.now(); // FPS計測開始時間
let countFlame = 0; // フレーム数カウント
const maxFPS = 60; // 最大FPS
let num = 0; // アニメーション用変数

function animate() {
    const now = performance.now();
    const deltaTime = now - lastUpdateTime;

    // FPSを制御
    if (deltaTime < 1000 / maxFPS) {
        requestAnimationFrame(animate);
        return; // フレーム間隔が短すぎる場合はスキップ
    }
    countFlame++;
    lastUpdateTime = now;

    // FPSを1秒ごとに表示
    if (now - fpsUpdateTime >= 1000) { // 1秒経過したら
        console.log("FPS: " + countFlame);
        fpsUpdateTime = now; // FPS計測開始時間をリセット
        countFlame = 0; // フレーム数をリセット
    }

    // boxes 配列を使って各ボックスを操作
    boxes.forEach((box, index) => {
        if (box.box) {
            if (index === 0) {
                box.box.rotation.z -= 0.01; // Box1に相当
                box.box.rotation.y += 0.01; // Box1に相当
                box.box.rotation.x += 0.04; // Box1に相当
                box.box.position.y -= 2 * Math.sin(num + 0.2); // Box3に相当
            } else if (index === 1) {
                box.box.rotation.x -= 0.12; // Box2に相当
                box.box.rotation.y -= 0.01; // Box2に相当
                box.box.position.y -= 4 * Math.sin(num + 0.1); // Box3に相当
            } else if (index === 2) {
                box.box.rotation.y += 0.01;
                box.box.position.y += 4 * Math.sin(num); // Box3に相当
            }
        }
    });

    // coneMeshの操作
    coneMesh.position.set(500, 200, -200);
    coneMesh.rotation.x += 0.1;
    coneMesh.rotation.y += 0.1;
    coneMesh.rotation.z += 0.1;

    // アニメーション変数の更新
    num += 0.1;

    // シーンの描画
    renderer.render(scene, camera);

    // 次のフレームをリクエスト
    requestAnimationFrame(animate);
}

animate();
