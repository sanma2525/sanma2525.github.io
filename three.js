import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.167.0/build/three.module.js";

// �T�C�Y���w��
const width = screen.width;
const height = screen.height;
// ��]��FPS�̏����ݒ肷��
const maxFPS = 60;
var num = 0;

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

let lastUpdateTime = performance.now(); // �O��̃t���[���̎���

const light = new THREE.AmbientLight(0xFFFFFF, 1.0);
scene.add(light);
function animate() {

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
    // �A�j���[�V���������������ɏ���
    Box1.box.rotation.y += 0.01;
    Box2.box.rotation.x += 0.01;
    Box3.box.position.y += 4 * Math.sin(num);
    num += 0.1;
    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}

animate();
