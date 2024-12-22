import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.167.0/build/three.module.js";

// �T�C�Y���w��
const canvas = document.querySelector("#background");
let width = window.innerWidth; // let �ɕύX
let height = window.innerHeight; // let �ɕύX

// ���T�C�Y�Ή�
window.addEventListener("resize", () => {
    width = window.innerWidth; // �đ���\
    height = window.innerHeight; // �đ���\
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
});

// ��]��FPS�̏����ݒ肷��
const maxFPS = 60;
var num = 0;
let countFlame = 0;
let showFPS = 0;

// �����_���[���쐬
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#background")
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);

canvas.style.width = `${width}px`; // �\���T�C�Y�𖾎��I�Ɏw��
canvas.style.height = `${height}px`; // ����

// �V�[�����쐬
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFFFFFF);

// �J�������쐬
const camera = new THREE.PerspectiveCamera(45, width / height);
camera.position.set(0, 0, +1000);


// �����쐬
class Box {
    constructor({ sizex, sizey, sizez, positionx, positiony, positionz }) {
        this.sizex = sizex;
        this.sizey = sizey;
        this.sizez = sizez;
        this.positionx = positionx;
        this.positiony = positiony;
        this.positionz = positionz;
        this.box = null; // box�I�u�W�F�N�g����ŏ���������
    }

    createBox() {
        const geometry = new THREE.BoxGeometry(this.sizex, this.sizey, this.sizez);
        const material = new THREE.MeshNormalMaterial();
        this.box = new THREE.Mesh(geometry, material);
        this.box.position.set(this.positionx, this.positiony, this.positionz);
        return this.box;
    }
}


// �g�p��
// Box�̐ݒ��z��ł܂Ƃ߂�
const boxConfigs = [
    { sizex: 200, sizey: 200, sizez: 200, positionx: -400, positiony: 200, positionz: 0 },
    { sizex: 100, sizey: 100, sizez: 100, positionx: 400, positiony: -200, positionz: 0 },
    { sizex: 300, sizey: 300, sizez: 300, positionx: 0, positiony: 0, positionz: 0 }
];

// Box�����[�v�ō쐬���ăV�[���ɒǉ�
const boxes = boxConfigs.map(config => {
    const box = new Box(config);
    scene.add(box.createBox());
    return box;
});

let lastUpdateTime = performance.now(); // �O��̃t���[���̎���

//�O�p��
const cone_geometry = new THREE.ConeGeometry(100, 200, 128);
const coneMaterial = new THREE.MeshNormalMaterial();
const coneMesh = new THREE.Mesh(cone_geometry, coneMaterial);
scene.add(coneMesh);

const light = new THREE.AmbientLight(0xFFFFFF, 1.0);
scene.add(light);
function animate() {
    requestAnimationFrame(animate);
    const now = performance.now();
    const deltaTime = now - lastUpdateTime;

    // FPS�𐧌�
    if (deltaTime < 1000 / maxFPS) {
        countFlame++;
        return;
    }

    lastUpdateTime = now - (deltaTime % (1000 / maxFPS));

    console.log("FPS"+countFlame);
    // boxes �z����g���Ċe�{�b�N�X�𑀍�
    boxes.forEach((box, index) => {
        if (box.box) {
            if (index === 0) {
                box.box.rotation.z -= 0.01; // Box1�ɑ���
                box.box.rotation.y += 0.01; // Box1�ɑ���
                box.box.rotation.x += 0.04; // Box1�ɑ���
                box.box.position.y -= 2 * Math.sin(num +0.2); // Box3�ɑ���
            } else if (index === 1) {
                box.box.rotation.x -= 0.12; // Box2�ɑ���
                box.box.rotation.y -= 0.01; // Box2�ɑ���
                box.box.position.y -= 4 * Math.sin(num + 0.1); // Box3�ɑ���
            } else if (index === 2) {
                box.box.rotation.y += 0.01;
                box.box.position.y += 4 * Math.sin(num); // Box3�ɑ���
            }
        }
    });
    coneMesh.position.set(200, 200, -200);
    coneMesh.rotation.x += 0.3;
    coneMesh.rotation.y += 0.3;
    num += 0.1;

    renderer.render(scene, camera);
}

animate();
