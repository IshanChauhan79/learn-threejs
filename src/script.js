import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import testVertexShader from "./shaders/ragingSea/vertex.glsl";
import testFragmentShader from "./shaders/ragingSea/fragment.glsl";

THREE.ColorManagement.enabled = false;

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 });
const debugObject = {
  depthColor: "#186691",
  surfaceColor: "#9bd8ff",
};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512);

// Material
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: testVertexShader,
  fragmentShader: testFragmentShader,
  side: THREE.DoubleSide,
  uniforms: {
    uTime: { value: 0 },

    uBigWavesElevation: { value: 0.2 },
    uBigWavesSpeed: { value: 0.75 },
    uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },

    uSmallWaveElevation: { value: 0.15 },
    uSmallWaveFrequency: { value: 3 },
    uSmallWaveSpeed: { value: 0.2 },
    uSmallWaveIteration: { value: 4 },

    uBigWavesDepthColor: { value: new THREE.Color(debugObject.depthColor) },
    uBigWavesSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
    uColorOffSet: { value: 0.08 },
    uColorMultipliyer: { value: 5 },
  },
});

gui
  .add(waterMaterial.uniforms.uBigWavesElevation, "value")
  .min(0)
  .max(1)
  .step(0.01)
  .name("uBigWavesElevation");
gui
  .add(waterMaterial.uniforms.uBigWavesSpeed, "value")
  .min(0)
  .max(5)
  .step(0.01)
  .name("uBigWavesSpeed");
gui
  .add(waterMaterial.uniforms.uBigWavesFrequency.value, "x")
  .min(0)
  .max(10)
  .step(0.01)
  .name("uBigWavesFrequency X");
gui
  .add(waterMaterial.uniforms.uBigWavesFrequency.value, "y")
  .min(0)
  .max(10)
  .step(0.01)
  .name("uBigWavesFrequency Y");

gui.addColor(debugObject, "depthColor").onChange(() => {
  waterMaterial.uniforms.uBigWavesDepthColor.value.set(debugObject.depthColor);
});
gui.addColor(debugObject, "surfaceColor").onChange(() => {
  waterMaterial.uniforms.uBigWavesSurfaceColor.value.set(
    debugObject.surfaceColor
  );
});

gui
  .add(waterMaterial.uniforms.uColorOffSet, "value")
  .min(0)
  .max(1)
  .step(0.01)
  .name("uColorOffSet");
gui
  .add(waterMaterial.uniforms.uColorMultipliyer, "value")
  .min(0)
  .max(10)
  .step(0.01)
  .name("uColorMultipliyer");

gui
  .add(waterMaterial.uniforms.uSmallWaveElevation, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uSmallWaveElevation");

gui
  .add(waterMaterial.uniforms.uSmallWaveFrequency, "value")
  .min(0)
  .max(10)
  .step(0.01)
  .name("uSmallWaveFrequency");

gui
  .add(waterMaterial.uniforms.uSmallWaveSpeed, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uSmallWaveSpeed");

gui
  .add(waterMaterial.uniforms.uSmallWaveIteration, "value")
  .min(0)
  .max(10)
  .step(1)
  .name("uSmallWaveIteration");

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI * 0.5;
scene.add(water);

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
camera.position.set(1, 1, 1);
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
  // update water Material
  waterMaterial.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
