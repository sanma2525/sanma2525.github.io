import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.167.0/build/three.module.js";

// サイズを指定
const canvas = document.querySelector("#background");
const width = window.innerWidth;
const height = window.innerHeight;

// 定数
const DEFAULT_POSITION_Z = -3000;

//パステルカラー図
const pastelColors = [
    0xffb3ba, 0xffdfba, 0xffffba, 0xbaffc9, 0xbae1ff, // 赤系・黄系・緑系・青系
    0xffcce5, 0xffb3e6, 0xd9b3ff, 0xb3e6ff, 0xb3ffd9, // ピンク・紫・水色
    0xffd9b3, 0xffe6b3, 0xe6ffb3, 0xb3ffcc, 0xb3e6ff, // さらに淡いトーン
    0xffc0cb, 0xffd700, 0xadff2f, 0x87ceeb, 0x9370db, // 定番パステル色
    0xf4a460, 0xfa8072, 0xff69b4, 0xe6e6fa, 0x98fb98, // 柔らかめのトーン
    0xf5deb3, 0xd8bfd8, 0xf0e68c, 0x90ee90, 0xafeeee, // くすみパステル
    0xe0ffff, 0xffdab9, 0xffe4e1, 0xffdead, 0xfffacd  // 淡いナチュラル系
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
    return new THREE.MeshPhysicalMaterial({
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
const cone = new CustomMesh(new THREE.ConeGeometry(100, 200, 128), [300, 300, 0]);
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

    cone.mesh.rotation.x += 0.1;
    cone.mesh.rotation.y += 0.1;
    cone.mesh.position.set((Math.random() * 2000) - 1000, (Math.random() * 500) - 1000, DEFAULT_POSITION_Z);

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
