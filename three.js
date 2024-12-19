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
    constructor(sizex, sizey, sizez, positionx, positiony, positionz) {
        this.sizex = sizex;
        this.sizey = sizey;
        this.sizez = sizez;
        this.positionx = positionx;
        this.positiony = positiony;
        this.positionz = positionz;
    }

    CreateBox() {
        const geometry = new THREE.BoxGeometry(this.sizex, this.sizey, this.sizez);
        const material = new THREE.MeshNormalMaterial();
        this.box = new THREE.Mesh(geometry, material);
        scene.add(this.box);
        this.box.position.x = this.positionx;
        this.box.position.y = this.positiony;
        this.box.position.z = this.positionz;
        console.log(box.position.x);
        console.log(box.position.y);
    }

}


var Box1 = new Box(200, 200, 200, -100, 200, 0);
var Box2 = new Box(100, 100, 100, 100, -200, 0);
var Box3 = new Box(300, 300, 300, 0, 0, 0);

Box1.CreateBox();
Box2.CreateBox();
Box3.CreateBox();

let lastUpdateTime = performance.now(); // 前回のフレームの時間

const light = new THREE.AmbientLight(0xFFFFFF, 1.0);
scene.add(light);
function animate() {

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
    // アニメーション処理をここに書く
    Box1.box.rotation.y += 0.01;
    Box2.box.rotation.x += 0.01;
    Box3.box.position.y += 4 * Math.sin(num);
    num += 0.1;
    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}

animate();
