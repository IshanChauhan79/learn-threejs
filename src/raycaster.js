import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { MMDLoader } from "three/examples/jsm/loaders/MMDLoader.js";

import * as dat from "dat.gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 400, closed: true });

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Test cube
 */
// const cube = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial()
// );
// scene.add(cube);

/**
 * galaxy
 */

var loader = new MMDLoader();
loader.load("/models/Crow/Crow_Apose.pmx", function (mesh) {
  mesh.scale.set(0.25, 0.25, 0.25);
  mesh.traverse(function (child) {
    if (child instanceof THREE.Mesh) {
      if (child.material) {
        // Check material properties, such as color, map, etc.
        console.log(child.material);
        child.material.map.minFilter = THREE.NearestFilter;
        child.material.map.magFilter = THREE.NearestFilter;
        child.material.emissive = new THREE.Color(0x000000);
        child.material.specular = new THREE.Color(0x111111);
      }
    }
  });
  scene.add(mesh);
  console.log(mesh);
});

var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 0);
scene.add(directionalLight);

const parameters = {};
parameters.count = 100000;
parameters.size = 0.01;
parameters.radius = 5;
parameters.branches = 3;
parameters.spin = 0.5;
parameters.randomness = 1;
parameters.randomnessPower = 3;
parameters.insideColor = "#ff6030";
parameters.outsideColor = "#1b3984";

let particleGeometry = null;
let particleMaterial = null;
let points = null;

const generateGalaxy = () => {
  if (points != null) {
    particleGeometry.dispose();
    particleMaterial.dispose();
    scene.remove(points);
  }
  particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);

  const colorInside = new THREE.Color(parameters.insideColor);
  const colorOutside = new THREE.Color(parameters.outsideColor);

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;

    const radius = Math.random() * parameters.radius;
    const branchAngle =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

    const spinAngle = radius * parameters.spin;

    // const randomX = (Math.random() - 0.5) * parameters.randomness;
    // const randomY = (Math.random() - 0.5) * parameters.randomness;
    // const randomZ = (Math.random() - 0.5) * parameters.randomness;

    const randomX =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? -1 : 1) *
      parameters.randomness;
    const randomY =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? -1 : 1) *
      parameters.randomness;
    const randomZ =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? -1 : 1) *
      parameters.randomness;

    positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / parameters.radius);
    colors[i3 + 0] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  // material
  particleMaterial = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  points = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(points);
};
generateGalaxy();

gui
  .add(parameters, "count")
  .min(100)
  .max(1000000)
  .step(100)
  .onFinishChange(() => {
    generateGalaxy();
  });

gui
  .add(parameters, "size")
  .min(0.01)
  .max(0.03)
  .step(0.001)
  .onFinishChange(() => {
    generateGalaxy();
  });

gui
  .add(parameters, "radius")
  .min(0.01)
  .max(20)
  .step(0.1)
  .onFinishChange(() => {
    generateGalaxy();
  });

gui
  .add(parameters, "branches")
  .min(2)
  .max(10)
  .step(1)
  .onFinishChange(() => {
    generateGalaxy();
  });

gui
  .add(parameters, "spin")
  .min(-5)
  .max(5)
  .step(0.1)
  .onFinishChange(() => {
    generateGalaxy();
  });

gui
  .add(parameters, "randomness")
  .min(0)
  .max(2)
  .step(0.01)
  .onFinishChange(() => {
    generateGalaxy();
  });

gui
  .add(parameters, "randomnessPower")
  .min(1)
  .max(20)
  .step(1)
  .onFinishChange(() => {
    generateGalaxy();
  });

gui.addColor(parameters, "insideColor").onFinishChange(() => {
  generateGalaxy();
});

gui.addColor(parameters, "outsideColor").onFinishChange(() => {
  generateGalaxy();
});

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
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.gammaOutput = true;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
