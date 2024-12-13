import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.167.0/build/three.module.js";

// �T�C�Y���w��
const width = 1920;
const height = 1080;
// ��]��FPS�̏����ݒ肷��
const maxFPS = 60;

// �����_���[���쐬
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#background")
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);

// �V�[�����쐬
const scene = new THREE.Scene();

scene.background = new THREE.Color(0xFFFFFF);

// �J�������쐬
const camera = new THREE.PerspectiveCamera(45, width / height);
camera.position.set(0, 0, +1000);

// �����쐬
const geometry = new THREE.BoxGeometry(300,300,300);
const material = new THREE.MeshNormalMaterial();
const box = new THREE.Mesh(geometry, material);
scene.add(box);

const light = new THREE.AmbientLight(0xFFFFFF, 1.0);
scene.add(light);

console.log(box.position.x);
console.log(box.position.y);

let lastUpdateTime = performance.now(); // �O��̃t���[���̎���

function animate() {
    requestAnimationFrame(animate);

    const now = performance.now();
    const deltaTime = now - lastUpdateTime;

    // �O��̃t���[���Ƃ̎��ԍ��������FPS�𐧌䂷��
    if (deltaTime < 1000 / maxFPS) {
        return;
    }

    lastUpdateTime = now - (deltaTime % (1000 / maxFPS));

    // �t���[���X�V�̏��������s����
    // ���̒��ɕ`�揈����A�j���[�V�����Ȃǂ��L�q���܂�
    // �Ⴆ�΁Acontrols�̍X�V���Ăяo���ăJ�����̈ʒu���X�V����ꍇ�͈ȉ��̂悤�ɂ��܂�

    requestAnimationFrame(animate);

    // �A�j���[�V���������������ɏ���
    box.rotation.y += 0.01;
    box.rotation.x += 0.01;
    renderer.render(scene, camera);
}

animate();