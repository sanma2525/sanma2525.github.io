import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.167.0/build/three.module.js";

// �T�C�Y���w��
const canvas = document.querySelector("#background");
const width = window.innerWidth;
const height = window.innerHeight;

// �萔
const DEFAULT_POSITION_Z = -3000;

//�p�X�e���J���[�}
const pastelColors = [
    0xffb3ba, 0xffdfba, 0xffffba, 0xbaffc9, 0xbae1ff, // �Ԍn�E���n�E�Όn�E�n
    0xffcce5, 0xffb3e6, 0xd9b3ff, 0xb3e6ff, 0xb3ffd9, // �s���N�E���E���F
    0xffd9b3, 0xffe6b3, 0xe6ffb3, 0xb3ffcc, 0xb3e6ff, // ����ɒW���g�[��
    0xffc0cb, 0xffd700, 0xadff2f, 0x87ceeb, 0x9370db, // ��ԃp�X�e���F
    0xf4a460, 0xfa8072, 0xff69b4, 0xe6e6fa, 0x98fb98, // �_�炩�߂̃g�[��
    0xf5deb3, 0xd8bfd8, 0xf0e68c, 0x90ee90, 0xafeeee, // �����݃p�X�e��
    0xe0ffff, 0xffdab9, 0xffe4e1, 0xffdead, 0xfffacd  // �W���i�`�������n
];



// �����_���[���쐬
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
renderer.physicallyCorrectLights = true;

// �V�[�����쐬
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFFF5F5);

// �J�������쐬
const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
camera.position.set(0, 0, 1000);

// �}�e���A�����쐬����֐��i�֐��ɕύX�j
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

// �W�I���g�����쐬����N���X
class CustomMesh {
    constructor(geometry, position) {
        this.mesh = new THREE.Mesh(geometry, createPhysicalMaterial()); // �ʃ}�e���A���K�p
        this.mesh.position.set(...position);
        scene.add(this.mesh);
    }
    updatePosition(delta) { }
    updateRotation(delta) { }
}

// Box �N���X
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
        this.mesh.position.y = Math.sin(performance.now() * 0.001) * 4; // num �̑���Ɏ��Ԃœ�����
    }

    updateRotation(x, y, z) {
        this.mesh.rotation.x += x;
        this.mesh.rotation.y += y;
        this.mesh.rotation.z += z;
    }
}

// Box �̐ݒ�
const boxes = [
    new Box({ sizex: 200, sizey: 200, sizez: 200, positionx: -400, positiony: 200, positionz: 0 }),
    new Box({ sizex: 100, sizey: 100, sizez: 100, positionx: 400, positiony: -200, positionz: 0 }),
    new Box({ sizex: 300, sizey: 300, sizez: 300, positionx: 0, positiony: 0, positionz: 0 })
];

// �O�p���ƃg�[���X
const cone = new CustomMesh(new THREE.ConeGeometry(100, 200, 128), [300, 300, 0]);
const torus = new CustomMesh(new THREE.TorusGeometry(200, 20, 16, 100), [0, 0, DEFAULT_POSITION_Z]);

// ���C�g
scene.add(new THREE.AmbientLight(0xffffff, 0.8));
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1.2);
const directionalLight2 = new THREE.DirectionalLight(0xFFFFFF, 1.2);
directionalLight.position.set(400, 100, 1000);
directionalLight2.position.set(-400, 100, 1000);
scene.add(directionalLight);
scene.add(directionalLight2);
// �A�j���[�V����
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
