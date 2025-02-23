import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.167.0/build/three.module.js";

// �T�C�Y���w��
const canvas = document.querySelector("#background");
let width = window.innerWidth;
let height = window.innerHeight;

let camera_x = 0;
let camera_y = 0;

// ���T�C�Y�Ή�
window.addEventListener("resize", () => {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
});

// �����_���[���쐬
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
renderer.physicallyCorrectLights = true; // ���̌v�Z�����A���ɂ���

canvas.style.width = `${width}px`;
canvas.style.height = `${height}px`;

// �V�[�����쐬
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFFFFFF);

// �J�������쐬
const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
camera.position.set(0, 0, +1000);

// ���C�g���쐬
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5); // �����i��߁j
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1.5); // ���s�����i���߁j
directionalLight.position.set(1, 1, 1);
scene.add(ambientLight, directionalLight);

// �����쐬
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
        const material = new THREE.MeshStandardMaterial({ color: 0x00ff00, metalness: 0.7, roughness: 0.2 });
        this.box = new THREE.Mesh(geometry, material);
        this.box.position.set(this.positionx, this.positiony, this.positionz);
        return this.box;
    }
}

// Box�̐ݒ�
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

// �O�p��
const cone_geometry = new THREE.ConeGeometry(100, 200, 128);
const coneMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, metalness: 0.5, roughness: 0.3 });
const coneMesh = new THREE.Mesh(cone_geometry, coneMaterial);
scene.add(coneMesh);

// �h�[�i�c�^
const torus_geometry = new THREE.TorusGeometry(100, 40, 16, 100);
const torusMaterial = new THREE.MeshStandardMaterial({ color: 0xff6347, metalness: 0.8, roughness: 0.2 });
const torus = new THREE.Mesh(torus_geometry, torusMaterial);
scene.add(torus);

let lastUpdateTime = performance.now();
let fpsUpdateTime = performance.now();
let countFlame = 0;
const maxFPS = 60;
let num = 0;

function animate() {
    const now = performance.now();
    const deltaTime = now - lastUpdateTime;

    if (deltaTime < 1000 / maxFPS) {
        requestAnimationFrame(animate);
        return;
    }
    countFlame++;
    lastUpdateTime = now;

    if (now - fpsUpdateTime >= 1000) {
        console.log("FPS: " + countFlame);
        fpsUpdateTime = now;
        countFlame = 0;
    }

    // boxes �̃A�j���[�V����
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

    // �O�p���̃A�j���[�V����
    coneMesh.position.set(500, 200, -200);
    coneMesh.rotation.x += 0.1;
    coneMesh.rotation.y += 0.1;
    coneMesh.rotation.z += 0.1;

    // �h�[�i�c�^�̃A�j���[�V����
    torus.rotation.x += 0.03;
    torus.rotation.y += 0.02;

    num += 0.1;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();
