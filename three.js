import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.167.0/build/three.module.js";

// サイズを指定
const canvas = document.querySelector("#background");
let width = window.innerWidth;
let height = window.innerHeight;

// リサイズ対応
window.addEventListener("resize", () => {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
});

// レンダラーを作成
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
renderer.physicallyCorrectLights = true;

canvas.style.width = `${width}px`;
canvas.style.height = `${height}px`;

// シーンを作成
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFFF5F5);

// カメラを作成
const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
camera.position.set(0, 0, +1000);

// **MeshNormalMaterial を全オブジェクトに適用**
const normalMaterial = new THREE.MeshNormalMaterial();

// 箱を作成
class Box {
    constructor({ sizex, sizey, sizez, positionx, positiony, positionz }) {
        this.sizex = sizex;
        this.sizey = sizey;
        this.sizez = sizez;
        this.positionx = positionx;
        this.positiony = positiony;
        this.positionz = positionz;
        this.box = null;
    }

    createBox() {
        const geometry = new THREE.BoxGeometry(this.sizex, this.sizey, this.sizez);
        this.box = new THREE.Mesh(geometry, normalMaterial);
        this.box.position.set(this.positionx, this.positiony, this.positionz);
        return this.box;
    }
}

// Boxの設定
const boxConfigs = [
    { sizex: 200, sizey: 200, sizez: 200, positionx: -400, positiony: 200, positionz: 0 },
    { sizex: 100, sizey: 100, sizez: 100, positionx: 400, positiony: -200, positionz: 0 },
    { sizex: 300, sizey: 300, sizez: 300, positionx: 0, positiony: 0, positionz: 0 }
];

const boxes = boxConfigs.map(config => {
    const box = new Box(config);
    scene.add(box.createBox());
    return box;
});

// 三角錐
const cone_geometry = new THREE.ConeGeometry(100, 200, 128);
const coneMesh = new THREE.Mesh(cone_geometry, normalMaterial);
scene.add(coneMesh);
coneMesh.position.set(300, 300, 0);

// ドーナツ型
const torus_geometry = new THREE.TorusGeometry(200, 20, 16, 100);
const torus = new THREE.Mesh(torus_geometry, normalMaterial);
scene.add(torus);

// ライト
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1.2);
directionalLight.position.set(1, 1, 1);
scene.add(ambientLight, directionalLight);

let lastUpdateTime = performance.now();
let fpsUpdateTime = performance.now();
let countFlame = 0;
const maxFPS = 60;
let num = 0;

function animate() {
    const now = performance.now();
    const deltaTime = now - lastUpdateTime;

    //fps制御
    if (deltaTime < 1000 / maxFPS) {
        requestAnimationFrame(animate);
        return;
    }
    countFlame++;
    lastUpdateTime = now;

    //torusのループ
    if (camera.position.z + 10 < torus.position.z) {
        torus.position.z = -700;
    }

    // FPS表示
    if (now - fpsUpdateTime >= 1000) {
        console.log("FPS: " + countFlame);
        fpsUpdateTime = now;
        countFlame = 0;
    }

    // boxes のアニメーション
    boxes.forEach((box, index) => {
        if (box.box) {
            if (index === 0) {
                box.box.rotation.z -= 0.01;
                box.box.rotation.y += 0.01;
                box.box.rotation.x += 0.04;
                box.box.position.y -= 2 * Math.sin(num + 0.2);
            } else if (index === 1) {
                box.box.rotation.x -= 0.12;
                box.box.rotation.y -= 0.01;
                box.box.position.y -= 4 * Math.sin(num + 0.1);
            } else if (index === 2) {
                box.box.rotation.z -= 0.01;
                box.box.rotation.y += 0.02;
                box.box.rotation.x += 0.03;
                box.box.position.y += 4 * Math.sin(num);
            }
        }
    });

    // 三角錐のアニメーション
    coneMesh.rotation.x += 0.1;
    coneMesh.rotation.y += 0.1;
    coneMesh.rotation.z += 0.1;

    // ドーナツ型のアニメーション
    torus.position.z += 10;

    num += 0.1;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();
s