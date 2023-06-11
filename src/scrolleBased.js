import "./style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { gsap } from "gsap";

/**
 * Debug
 */
const gui = new dat.GUI();

const parameters = {
  materialColor: "#13a5d2",
};

gui.addColor(parameters, "materialColor").onChange(() => {
  material.color.set(parameters.materialColor);
  particleMaterial.color.set(parameters.materialColor);
});

/**
 * texture loader
 */

const textureLoader = new THREE.TextureLoader();
const gradientTerxture = textureLoader.load("textures/gradients/3.jpg");
// gradientTerxture.minFilter = THREE.NearestFilter;
gradientTerxture.magFilter = THREE.NearestFilter;

// console.log(gradientTerxture);

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Test cube
 */

const objectsDistance = 4;
const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradientTerxture,
});
const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);

const torus = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 62), material);

const cone = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);

const torunKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.32, 100, 16),
  material
);

torus.position.y = objectsDistance * 0;
torus.position.x = -2;

cone.position.y = objectsDistance * -1;
cone.position.x = 2;

torunKnot.position.y = objectsDistance * -2;
torunKnot.position.x = -2;

scene.add(torus, cone, torunKnot);

const sectionMeshes = [torus, cone, torunKnot];

/**
 * particles
 */

const particlesCount = 200;
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
  positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
  positions[i * 3 + 1] =
    objectsDistance * 0.5 -
    Math.random() * objectsDistance * sectionMeshes.length;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
}

const particleGeomentry = new THREE.BufferGeometry();
particleGeomentry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

const particleMaterial = new THREE.PointsMaterial({
  color: parameters.materialColor,
  sizeAttenuation: true,
  size: 0.03,
});
// Points

const particles = new THREE.Points(particleGeomentry, particleMaterial);
scene.add(particles);
/**
 * light
 */

const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera

const cameraGroup = new THREE.Group();
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
// scene.add(camera);
cameraGroup.add(camera);
scene.add(cameraGroup);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.setClearAlpha(0.5);

/**
 * scroll
 *
 */

let scrollY = window.screenY;
let currentSection = 0;
window.addEventListener("scroll", () => {
  scrollY = window.scrollY;

  const newSection = Math.round(scrollY / sizes.height);
  if (newSection != currentSection) {
    currentSection = newSection;
    console.log("section Changed", newSection);
    gsap.to(sectionMeshes[currentSection].rotation, {
      duration: 1.5,
      ease: "power2.inOut",
      x: "+=6",
      y: "+=3",
    });
  }
});

/**
 * cursor
 */

const cursor = {};
cursor.x = 0;
cursor.y = 0;

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = -(event.clientY / sizes.height - 0.5);
});

/**
 * Animate
 */
const clock = new THREE.Clock();

let prevTime = 0;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  //   animate camera
  const deltaTime = elapsedTime - prevTime;
  //   console.log("🚀 ~ file: script.js:163 ~ tick ~ delta:", delta);
  prevTime = elapsedTime;
  camera.position.y = -(scrollY / sizes.height) * objectsDistance;
  const parallaxX = cursor.x;
  const parallaxY = cursor.y;
  cameraGroup.position.x +=
    (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
  cameraGroup.position.y +=
    (parallaxY - cameraGroup.position.y) * 5 * deltaTime;
  for (const mesh of sectionMeshes) {
    mesh.rotation.x += deltaTime * 0.2;
    mesh.rotation.y += deltaTime * 0.12;
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
