import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import * as dat from "dat.gui";

// code start helper ------------------------------------

// --------------------------------- Scene--------------------------------------------------
const scene = new THREE.Scene();

//  -------------------------------- textures-------------------------------

const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("textures/matcaps/2.png");

// --------------------------------- fonts--------------------------------------------

const fontLoader = new FontLoader();
const helvetikerFont = fontLoader.load(
  // resource URL
  "fonts/helvetiker_regular.typeface.json",
  (font) => {
    const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

    const textGeometry = new TextGeometry("Homura", {
      font: font,
      size: 0.5,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    });
    textGeometry.center();
    // textGeometry.computeBoundingBox();
    // console.log(textGeometry.boundingBox);
    // textGeometry.translate(
    //   -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
    //   -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
    //   -(textGeometry.boundingBox.max.z - 0.03) * 0.5
    // );

    const textMaterial = new THREE.MeshBasicMaterial({ wireframe: true });
    const text = new THREE.Mesh(textGeometry, material);

    scene.add(text);

    // Donuts
    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64);

    for (let i = 0; i < 100; i++) {
      const donut = new THREE.Mesh(donutGeometry, material);
      donut.position.x = (Math.random() - 0.5) * 10;
      donut.position.y = (Math.random() - 0.5) * 10;
      donut.position.z = (Math.random() - 0.5) * 10;
      donut.rotation.x = Math.random() * Math.PI;
      donut.rotation.y = Math.random() * Math.PI;
      const scale = Math.random();
      donut.scale.set(scale, scale, scale);

      scene.add(donut);
    }
  }
);

// --------------------------------- Debug ------------------------------------------
const gui = new dat.GUI({ closed: true, width: 400 });

// --------------------------------- canvas ---------------------------------
const canvas = document.querySelector("canvas.webgl");

// --------------------------------- Sizes---------------------------------
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// --------------------------------- cursor--------------------------------------

// --------------------------------- Lights ------------------------------------

// --------------------------------- Object - materila, geometry ---------------------------

// // axesHelper
// const axesHelper = new THREE.AxesHelper(2);
// scene.add(axesHelper);

// --------------------------------- Camera--------------------------

// look at the object , focus on object
// camera.lookAt(mesh.position);
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
// camera.position.x = 1;
// camera.position.y = 1;
camera.position.z = 3;
scene.add(camera);

// --------------------------------- controls------------------------------
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// --------------------------------- Renderer----------------------------
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// --------------------------------- render--------------------------------------
renderer.render(scene, camera);

// --------------------------------- resizing of window--------------------------------------
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

// --------------------------------- full screen mode - using double click--------------------------------
window.addEventListener("dblclick", () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    canvas.requestFullscreen();
  }
});

//---------------------------------- animation ---------------------------------------------
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
// ------------------------------------------------------------------------------------
// import "./style.css";
// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import * as dat from "dat.gui";
// import gsap from "gsap";
// // import image from "/door.jpg";

// // --------------------------------textures------------------
// //------------ old mathod--------
// // const image = new Image();
// // const texture = new THREE.Texture(image);
// // image.onload = () => {
// //   texture.needsUpdate = true;
// // };
// // image.src = "/textures/door/color.jpg";

// // --------------------------- new method ----------------------------
// const loadingManager = new THREE.LoadingManager();

// loadingManager.onStart = () => {
//   console.log("onStart");
// };

// loadingManager.onLoad = () => {
//   console.log("onLoad");
// };
// loadingManager.onProgress = () => {
//   console.log("onProgress");
// };
// loadingManager.onError = () => {
//   console.log("onError");
// };

// const textureLoader = new THREE.TextureLoader(loadingManager);
// const colorTexture = textureLoader.load(
//   "/textures/door/color.jpg"
//   // () => {
//   //   console.log("load");
//   // },
//   // () => {
//   //   console.log("progress");
//   // },
//   // () => {
//   //   console.log("error");
//   // }
// );
// // colorTexture.repeat.x = 2;
// // colorTexture.repeat.y = 3;
// // colorTexture.wrapS = THREE.RepeatWrapping;
// // colorTexture.wrapT = THREE.RepeatWrapping;

// // colorTexture.wrapS = THREE.MirroredRepeatWrapping;
// // colorTexture.wrapT = THREE.MirroredRepeatWrapping;

// // colorTexture.offset.x = 0.5;
// // colorTexture.offset.y = 0.5;

// // colorTexture.rotation = Math.PI / 4;
// // colorTexture.center.x = 0.5;
// // colorTexture.center.y = 0.5;

// colorTexture.minFilter = THREE.NearestFilter;
// colorTexture.magFilter = THREE.NearestFilter;

// const aplhaTexture = textureLoader.load("/textures/door/alpha.jpg");
// // const checkboard = textureLoader.load("/textures/checkerboard-1024x1024.png");
// const minecraft = textureLoader.load("/textures/minecraft.png");
// minecraft.magFilter = THREE.NearestFilter;
// minecraft.generateMipmaps = false;

// //--------------------------------------- Debug --------------------
// const gui = new dat.GUI({ closed: true, width: 400 });

// const properties = {
//   color: 0xff0000,
//   spin: () =>
//     gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 }),
// };

// //----------------------------------------- Sizes-------------------
// const sizes = {
//   width: window.innerWidth,
//   height: window.innerHeight,
// };

// const cursor = {
//   x: 0,
//   y: 0,
// };

// ----------------------------------------- convas -------------------------
// const canvas = document.querySelector("canvas.webgl");

// // -------------------------------------cursor--------------------------------------
// window.addEventListener("mousemove", (event) => {
//   cursor.x = event.clientX / sizes.width - 0.5;
//   cursor.y = -(event.clientY / sizes.height - 0.5);
// });

// // -------------------------------------Scene--------------------------------------------------
// const scene = new THREE.Scene();

// //-------------------------------------- Object - materila, geometry ---------------------------

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// // console.log(geometry.attributes.uv);
// const material = new THREE.MeshBasicMaterial({
//   // color: properties.color,
//   map: minecraft,
// });
// const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

// gui.add(mesh.position, "x").min(-3).max(3).step(0.1).name("x axis");
// gui.add(mesh.position, "y").min(-3).max(3).step(0.1).name("y axis");
// gui.add(mesh.position, "z").min(-3).max(3).step(0.1).name("z axis");
// gui.add(mesh, "visible");
// gui.add(material, "wireframe");
// gui
//   .addColor(properties, "color")
//   .onChange(() => material.color.set(properties.color));

// gui.add(properties, "spin");

// const aspectRatio = sizes.width / sizes.height;

// //----------------------------------------- Camera--------------------------
// const camera = new THREE.PerspectiveCamera(
//   75,
//   sizes.width / sizes.height,
//   0.1,
//   100
// );

// camera.position.z = 3;
// console.log(camera.position.length());

// // look at the object , focus on object
// camera.lookAt(mesh.position);
// scene.add(camera);

// // ------------------------------------ controls------------------------------
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

// // ------------------------------------- Renderer----------------------------
// const renderer = new THREE.WebGLRenderer({
//   canvas: canvas,
// });

// renderer.setSize(sizes.width, sizes.height);

// // ------------------------------------ render--------------------------------------
// renderer.render(scene, camera);

// // ----------------------------resizing of window--------------------------------------
// window.addEventListener("resize", (event) => {
//   sizes.width = window.innerWidth;
//   sizes.height = window.innerHeight;
//   // ------------------------update camera-------------------
//   camera.aspect = sizes.width / sizes.height;
//   camera.updateProjectionMatrix();
//   renderer.setSize(sizes.width, sizes.height);
//   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// });

// //-------------------- full screen mode - using double click--------------------------------
// window.addEventListener("dblclick", () => {
//   console.log("double click");
//   if (!document.fullscreenElement) {
//     console.log("Go full screen mode");
//     canvas.requestFullscreen();
//   } else {
//     console.log("leave full screen mode");
//     document.exitFullscreen();
//   }
// });

// // ------------------ animation ---------------------------------------------
// const clock = new THREE.Clock();
// const tick = () => {
//   const elapsedTime = clock.getElapsedTime();
//   //   update controls for damping
//   controls.update();

//   renderer.render(scene, camera);

//   window.requestAnimationFrame(tick);
// };
// tick();

// ------------------------- datgui--------
// add(object , property of object that is updated , minValue, MaxValue, precision)
// gui.add(mesh.position, "x", -3, 3, 0.01);
// gui.add(mesh.position, "y", -3, 3, 0.01);
// gui.add(mesh.position, "z", -3, 3, 0.01);

// or
// gui.add(mesh.position, "x").min(-3).max(3).step(0.1).name("x axis");
// gui.add(mesh.position, "y").min(-3).max(3).step(0.1).name("y axis");
// gui.add(mesh.position, "z").min(-3).max(3).step(0.1).name("z axis");
// gui.add(mesh, "visible");
// gui.add(material, "wireframe");
// gui
//   .addColor(properties, "color")
//   .onChange(() => material.color.set(properties.color));

// gui.add(properties, "spin");

//  -------------------------------------- camera , animation , controls ,  -------------

// import "./style.css";
// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// // import gsap from 'gsap';

// const cursor = {
//   x: 0,
//   y: 0,
// };
// const canvas = document.querySelector("canvas.webgl");

// // cursor
// window.addEventListener("mousemove", (event) => {
//   cursor.x = event.clientX / sizes.width - 0.5;
//   cursor.y = -(event.clientY / sizes.height - 0.5);
// });

// // Scene
// const scene = new THREE.Scene();

// // Object

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

// // axesHelper
// // const axesHelper = new THREE.AxesHelper(2)
// // scene.add(axesHelper);

// // Sizes
// const sizes = {
//   width: 800,
//   height: 600,
// };

// const aspectRatio = sizes.width / sizes.height;

// // Camera
// const camera = new THREE.PerspectiveCamera(
//   75,
//   sizes.width / sizes.height,
//   0.1,
//   100
// );
// // const camera = new THREE.OrthographicCamera(
// // -1 * aspectRatio,  // left
// //     1 * aspectRatio, // right
// //     1, // top
// //     -1, //bottom
// //     0.1,100)
// // camera.position.x = 2
// // camera.position.y = 2
// camera.position.z = 3;
// console.log(camera.position.length());

// // look at the object , focus on object
// camera.lookAt(mesh.position);

// // distance from camera
// // console.log(mesh.position.distanceTo(camera.position));
// scene.add(camera);

// // controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;
// // controls.target.y = 1;
// // controls.update();

// // Renderer
// const renderer = new THREE.WebGLRenderer({
//   canvas: canvas,
// });

// renderer.setSize(sizes.width, sizes.height);

// // render
// renderer.render(scene, camera);

// const clock = new THREE.Clock();

// const tick = () => {
//   const elapsedTime = clock.getElapsedTime();
//   // mesh.rotation.y = elapsedTime * Math.PI  ;
//   // console.log(cursor)

//   // render
//   // console.log(cursor)
//   //   camera.position.x = cursor.x * 10;
//   //   camera.position.y = cursor.y * 10;

//   //   camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
//   //   camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
//   //   camera.position.y = cursor.y * 5;
//   //   camera.lookAt(mesh.position);

//   //   update controls for damping
//   controls.update();

//   renderer.render(scene, camera);

//   window.requestAnimationFrame(tick);
// };
// tick();

// ----------------------------- first time leanning  ------------------------------

// Object

// const group = new THREE.Group();
// group.rotation.x = 1
// group.position.y = 1

// scene.add(group);

// const cube1 = new THREE.Mesh(
//     new THREE.BoxGeometry(1,1,1),
//     new THREE.MeshBasicMaterial({ color: 0xff0000 })
// )
// group.add(cube1)
// cube1.position.x = -2

// const cube2 = new THREE.Mesh(
//     new THREE.BoxGeometry(1,1,1),
//     new THREE.MeshBasicMaterial({ color: 0x00ff00 })
// )
// group.add(cube2)

// const cube3 = new THREE.Mesh(
//     new THREE.BoxGeometry(1,1,1),
//     new THREE.MeshBasicMaterial({ color: 0x0000ff })
// )
// cube3.position.x = 2
// group.add(cube3)

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// const mesh = new THREE.Mesh(geometry, material);
// mesh.position.y = 1;
// mesh.position.x = 1;
// mesh.position.z = -2;
// OR
// mesh.position.set(1,-1,-1)

// distance from center
// console.log(mesh.position.length());

//  scale
// mesh.scale.x = 3;
// mesh.scale.y = 0.5;
// mesh.scale.z = 0.5;
// OR
// mesh.scale.set(1,0.5,0.5)

// Rotation
// mesh.rotation.reorder('YXZ')
// mesh.rotation.x = Math.PI * 0.25
// mesh.rotation.y = Math.PI * 0.25

// Quaternion

// normalize the mesh, make distance to center 1, move to center
// mesh.position.normalize();
// scene.add(mesh)

// const tick = ()=> {
//     const currentTime = Date.now();
//     const deltaTime = currentTime - time;
//     time = currentTime;
//     console.log(deltaTime);

//     mesh.rotation.x += 0.001 * deltaTime

//     // render
//     renderer.render(scene, camera)

//     window.requestAnimationFrame(tick);

// }
// tick()

// const clock = new THREE.Clock();

// gsap.to(mesh.position, {
//     x:2,
//     duration: 1,
//     delay: 1
// })
// gsap.to(mesh.position, {
//     x:-2,
//     duration: 1,
//     delay: 2
// })

// const tick = ()=> {

// //     const elapsedTime = clock.getElapsedTime();
// //     // console.log(elapsedTime);

// //     mesh.position.y = Math.sin(elapsgitedTime) ;
// //     mesh.position.x = Math.cos(elapsedTime) ;

// //     // camera.position.y = Math.sin(elapsedTime) ;
// //     // camera.position.x = Math.cos(elapsedTime) ;
// //     // camera.lookAt(mesh.position)

// //     // one rotation per second
// //     // mesh.rotation.y = elapsedTime * Math.PI * 2 ;

// //     // render
//     renderer.render(scene, camera)

//     window.requestAnimationFrame(tick);

// }
// tick()

// code start helper ------------------------------------

//  -------------------------------- textures-------------------------------

// --------------------------------- fonts--------------------------------------------

// --------------------------------- Debug ------------------------------------------

// --------------------------------- canvas -----------------------------------

// --------------------------------- Sizes----------------------------------

// --------------------------------- cursor--------------------------------------

// --------------------------------- Scene--------------------------------------------------

// --------------------------------- Lights ------------------------------------

// --------------------------------- Object - materila, geometry ---------------------------

// --------------------------------- Camera--------------------------------

// --------------------------------- controls------------------------------

// --------------------------------- Renderer------------------------------

// --------------------------------- render--------------------------------------

// --------------------------------- resizing of window--------------------------------------

// --------------------------------- full screen mode - using double click--------------------------------

//--------------- ------------------ animation ---------------------------------------------
