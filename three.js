import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.167.0/build/three.module.js";

// サイズを指定
const canvas = document.querySelector("#background");
const width = window.innerWidth;
const height = window.innerHeight;

// 定数
const DEFAULT_POSITION_Z = -3000;

//パステルカラー図
const pastelColors = [
    0xeaa5aa, 0xebc7aa, 0xeae3aa, 0x9fd9b3, 0x9fcfee, // 赤・黄・緑・青を明度↓
    0xf0bcd2, 0xeaa5d4, 0xbf9fde, 0x9fcfee, 0x9feecf, // ピンク・紫・水色系
    0xeabf9f, 0xecd8a5, 0xd5eaa5, 0x9feac4, 0x9fcfee, // さらに淡く渋めに
    0xe69dae, 0xe5be00, 0x91d122, 0x6db7d6, 0x7c65b5, // 定番パステル系 減光版
    0xd1945d, 0xd87466, 0xe755a0, 0xdad6ef, 0x81d981, // やわらかトーン
    0xe1c49c, 0xc6a4c6, 0xd7ce90, 0x7fcf7f, 0x9edcdc, // くすみパステル調整版
    0xcffafa, 0xeabf9f, 0xf5ccd3, 0xf4cfa4, 0xf5e8a8  // 淡ナチュラル系の調整
];



// レンダラーを作成
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
renderer.physicallyCorrectLights = true;

// シーンを作成
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFFF5F5);

// カメラを作成
const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
camera.position.set(0, 0, 1000);

// マテリアルを作成する関数（関数に変更）
function createPhysicalMaterial() {
    return new THREE.MeshBasicMaterial({
        color: pastelColors[Math.floor(Math.random() * pastelColors.length)],
        transparent: true,
        opacity: 1,
        metalness: 1,
        roughness: 0.5,
        clearcoat: 0.5,
        clearcoatRoughness: 0.5,
        transmission: 0.6
    });
}

// ジオメトリを作成するクラス
class CustomMesh {
    constructor(geometry, position) {
        this.mesh = new THREE.Mesh(geometry, createPhysicalMaterial()); // 個別マテリアル適用
        this.mesh.position.set(...position);
        scene.add(this.mesh);
    }
    updatePosition(delta) { }
    updateRotation(delta) { }
}

// Box クラス
class Box extends CustomMesh {
    constructor(config) {
        super(new THREE.BoxGeometry(config.sizex, config.sizey, config.sizez),
            [config.positionx, config.positiony, config.positionz]);
    }

    updatePosition(delta) {
        if (this.mesh.position.z > camera.position.z + 10) {
            this.mesh.material.color.set(pastelColors[Math.floor(Math.random() * pastelColors.length)]);
            this.mesh.position.set((Math.random() * 2000) - 1000, (Math.random() * 500) - 1000, DEFAULT_POSITION_Z);
            this.mesh.material.opacity = 0.0;
        }

        this.mesh.material.opacity = Math.min(this.mesh.material.opacity + 0.05, 1.0);
        this.mesh.position.z += delta;
        this.mesh.position.y = Math.sin(performance.now() * 0.001) * 4; // num の代わりに時間で動かす
    }

    updateRotation(x, y, z) {
        this.mesh.rotation.x += x;
        this.mesh.rotation.y += y;
        this.mesh.rotation.z += z;
    }
}

// Box の設定
const boxes = [
    new Box({ sizex: 200, sizey: 200, sizez: 200, positionx: -400, positiony: 200, positionz: 0 }),
    new Box({ sizex: 100, sizey: 100, sizez: 100, positionx: 400, positiony: -200, positionz: 0 }),
    new Box({ sizex: 300, sizey: 300, sizez: 300, positionx: 0, positiony: 0, positionz: 0 })
];

// 三角錐とトーラス
const torus = new CustomMesh(new THREE.TorusGeometry(200, 20, 16, 100), [0, 0, DEFAULT_POSITION_Z]);

// ライト
scene.add(new THREE.AmbientLight(0xffffff, 0.8));
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1.2);
const directionalLight2 = new THREE.DirectionalLight(0xFFFFFF, 1.2);
directionalLight.position.set(400, 100, 1000);
directionalLight2.position.set(-400, 100, 1000);
scene.add(directionalLight);
scene.add(directionalLight2);
// アニメーション
let lastUpdateTime = performance.now();
let lastUpdateTimeSecond = performance.now();
const maxFPS = 60;
var flameCounter = 0;

function animate() {
    requestAnimationFrame(animate);
    const now = performance.now();
    if (now - lastUpdateTime < 1000 / maxFPS) { flameCounter++; return; }
    if (now - lastUpdateTimeSecond > 1000) {
        lastUpdateTimeSecond = now;
        document.getElementById("FPS").innerText = "FPS:" + flameCounter;
        flameCounter = 0;
    }
    lastUpdateTime = now;

    boxes.forEach((box, index) => {
        box.updatePosition(20 + (index * 10));
        box.updateRotation((index - 2) / 100 +0.02, index / 100 + 0.03, index / 100 +0.01);
    });

    if (torus.mesh.position.z > camera.position.z + 10) {
        torus.mesh.position.set(0,0, DEFAULT_POSITION_Z);
        torus.mesh.material.opacity = 0.0;
        torus.mesh.material.color.set(pastelColors[Math.floor(Math.random() * pastelColors.length)]);
    }

    torus.mesh.material.opacity = Math.min(torus.mesh.material.opacity + 0.05, 1.0);
    torus.mesh.position.z += 30;
    renderer.render(scene, camera);
}
animate();
