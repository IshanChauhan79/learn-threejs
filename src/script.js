import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader";

import { GroundProjectedEnv } from "three/examples/jsm/objects/GroundProjectedEnv";

THREE.ColorManagement.enabled = false;
/**
 * Loaders
 */

const gltfLoader = new GLTFLoader();
const cubeTextLoader = new THREE.CubeTextureLoader();
const rgbeLoader = new RGBELoader();
const exrLoader = new EXRLoader();
const textureLoader = new THREE.TextureLoader();

/**
 * Base
 */
// Debug
const gui = new dat.GUI();
const debugObject = { envMapIntensity: 3 };

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
scene.backgroundBlurriness = 0;
scene.backgroundIntensity = 1;

gui.add(scene, "backgroundBlurriness").min(0).max(1).step(0.01);
//   .onChange(updateAllMaterials);

gui.add(scene, "backgroundIntensity").min(0).max(10).step(0.01);
//   .onChange(updateAllMaterials);

/**
 * update all materials
 */

const updateAllMaterials = () => {
  scene.traverse((child) => {
    // child.update();
    if (
      child.isMesh &&
      child.material.isMeshStandardMaterial
      //   child instanceof THREE.Mesh &&
      //   child.material instanceof THREE.MeshStandardMaterial
    ) {
      // child.material.envMap = environmentMap;
      child.material.envMapIntensity = debugObject.envMapIntensity;
    }
  });
};

/**
 * Textures
 */

// const environmentMap = cubeTextLoader.load([
//   "/textures/environmentMaps/0/px.png",
//   "/textures/environmentMaps/0/nx.png",
//   "/textures/environmentMaps/0/py.png",
//   "/textures/environmentMaps/0/ny.png",
//   "/textures/environmentMaps/0/pz.png",
//   "/textures/environmentMaps/0/nz.png",
// ]);

// scene.background = environmentMap;
// scene.environment = environmentMap;

// hdr (RGBE equirectangular)
// rgbeLoader.load(
//   "/textures/environmentMaps/blender-2k.hdr",
//   (environmentMap) => {
//     console.log(environmentMap);
//     environmentMap.mapping = THREE.EquirectangularReflectionMapping;
//     // scene.background = environmentMap;
//     scene.environment = environmentMap;
//   }
// );

// hdr - exr loader - equirectangular
// exrLoader.load(
//   "/textures/environmentMaps/nvidiaCanvas-4k.exr",
//   (environmentMap) => {
//     console.log(environmentMap);
//     environmentMap.minFilter = THREE.LinearFilter;
//     environmentMap.magFilter = THREE.LinearFilter;
//     environmentMap.mapping = THREE.EquirectangularReflectionMapping;
//     scene.background = environmentMap;
//     scene.environment = environmentMap;
//   }
// );

//  ai generated maps

// const environmentMap = textureLoader.load(
//   "/textures/environmentMaps/blockadesLabsSkybox/anime_1_demon_fighting_1_swordsmen_at_night_near_s.jpg"
// );
// environmentMap.mapping = THREE.EquirectangularReflectionMapping;
// environmentMap.colorSpace = THREE.SRGBColorSpace;

// console.log(environmentMap);
// scene.background = environmentMap;
// scene.environment = environmentMap;

rgbeLoader.load("/textures/environmentMaps/2/2k.hdr", (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;
  // scene.background = environmentMap;
  scene.environment = environmentMap;

  const skyBox = new GroundProjectedEnv(environmentMap);
  skyBox.scale.setScalar(50);
  scene.add(skyBox);

  gui.add(skyBox, "radius").min(1).max(200).step(0.01).name("skybox radius");
  gui.add(skyBox, "height").min(1).max(200).step(0.01).name("skybox height");
  // .onChange(updateAllMaterials);
});

gui
  .add(debugObject, "envMapIntensity")
  .min(0)
  .max(10)
  .step(0.01)
  .onChange(updateAllMaterials);

/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
  new THREE.MeshStandardMaterial()
);

torusKnot.position.x = -4;
torusKnot.position.y = 4;
scene.add(torusKnot);

/**
 * models
 */

gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
  //   console.log("success", gltf);
  gltf.scene.scale.set(10, 10, 10);
  //   gltf.scene.position.set(0, -4, 0);
  //   gltf.scene.rotation.y = Math.PI * 0.5;
  scene.add(gltf.scene);

  gui
    .add(gltf.scene.rotation, "y")
    .min(-Math.PI)
    .max(Math.PI)
    .step(0.01)
    .name("gltf roation y");

  updateAllMaterials();
});

/**
 * Lightes
 */

// const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
// directionalLight.position.set(0.25, 3, -2.25);
// scene.add(directionalLight);

// gui
//   .add(directionalLight, "intensity")
//   .min(0)
//   .max(10)
//   .step(0.1)
//   .name("lightIntensity");

// gui.add(directionalLight.position, "x").min(-5).max(5).step(0.1).name("lightX");

// gui.add(directionalLight.position, "y").min(-5).max(5).step(0.1).name("lightY");

// gui.add(directionalLight.position, "z").min(-5).max(5).step(0.1).name("lightZ");

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
camera.position.set(4, 5, 7);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.y = 3.5;
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
const tick = () => {
  // Time
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
