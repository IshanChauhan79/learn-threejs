import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";
import * as dat from "dat.gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.01).name("Ambint I");
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.5);
directionalLight.position.set(1, 0.25, 0);

gui
  .add(directionalLight, "intensity")
  .min(0)
  .max(1)
  .step(0.01)
  .name("Direct I");
scene.add(directionalLight);

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
gui
  .add(hemisphereLight, "intensity")
  .min(0)
  .max(1)
  .step(0.01)
  .name("Hemisphere I");
scene.add(hemisphereLight);

const pointLight = new THREE.PointLight(0xff9000, 0.5, 2);
// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 4;
pointLight.position.set(1, -0.5, 1);
gui.add(pointLight, "intensity").min(0).max(1).step(0.01).name("Point I");
gui.add(pointLight, "distance").min(0).max(10).step(0.01).name("Point Dis");
gui.add(pointLight, "decay").min(0).max(10).step(0.01).name("Point Decay");

scene.add(pointLight);

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(new THREE.Vector3());

gui.add(rectAreaLight, "intensity").min(0).max(5).step(0.01).name("Rect I");
gui.add(rectAreaLight, "width").min(0).max(10).step(0.01).name("Rect Width ");
gui.add(rectAreaLight, "height").min(0).max(10).step(0.01).name("Rect Height ");
scene.add(rectAreaLight);

const spotLight = new THREE.SpotLight(
  0xffffff,
  0.5,
  10,
  Math.PI * 0.1,
  0.25,
  1
);

gui.add(spotLight, "intensity").min(0).max(5).step(0.01).name("Spot I");
gui.add(spotLight, "distance").min(0).max(10).step(0.01).name("Spot Distance ");
// gui.add(spotLight, "angle").min(0).max(10).step(0.01).name("Spot angle ");
gui.add(spotLight, "penumbra").min(0).max(10).step(0.01).name("Spot penumbra");
gui.add(spotLight, "decay").min(0).max(10).step(0.01).name("Spot Decay");

spotLight.position.set(0, 2, 3);
scene.add(spotLight);
spotLight.target.position.x = -0.75;
scene.add(spotLight.target);

// performace requirment - lower is better
// minimun  - ambient - hemisphere light
// medium - Directional - Point light
// high - spot  - rect area light

/**
 * Lights - helper
 */

const hemisphereLightHelper = new THREE.HemisphereLightHelper(
  hemisphereLight,
  0.2
);
scene.add(hemisphereLightHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.2
);
scene.add(directionalLightHelper);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);

const spotLightHelper = new THREE.SpotLightHelper(spotLight, 0.2);
scene.add(spotLightHelper);

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
rectAreaLight.add(rectAreaLightHelper);
// scene.add(rectAreaLightHelper);

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
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
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
