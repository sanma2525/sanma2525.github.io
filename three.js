import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.167.0/build/three.module.js";

// サイズを指定
const width = screen.width;
const height = screen.height;
// 希望のFPSの上限を設定する
const maxFPS = 60;
var num = 0;

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

let lastUpdateTime = performance.now(); // 前回のフレームの時間

const light = new THREE.AmbientLight(0xFFFFFF, 1.0);
scene.add(light);
function animate() {
    requestAnimationFrame(animate);
    const now = performance.now();
    const deltaTime = now - lastUpdateTime;

    // FPSを制御
    if (deltaTime < 1000 / maxFPS) {
        return;
    }

    lastUpdateTime = now - (deltaTime % (1000 / maxFPS));

    // boxes 配列を使って各ボックスを操作
    boxes.forEach((box, index) => {
        if (box.box) {
            if (index === 0) {
                box.box.rotation.y += 0.01; // Box1に相当
                box.box.rotation.x += 0.01; // Box1に相当
            } else if (index === 1) {
                box.box.rotation.x += 0.01; // Box2に相当
                box.box.rotation.y += 0.01; // Box2に相当
            } else if (index === 2) {
                box.box.rotation.x += 0.01;
                box.box.rotation.y += 0.01;
                box.box.position.y += 4 * Math.sin(num); // Box3に相当
            }
        }
    });

    num += 0.1;

    renderer.render(scene, camera);
}

animate();
