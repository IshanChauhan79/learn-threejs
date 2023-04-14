import './style.css'
import * as THREE from 'three';
// import gsap from 'gsap';

const cursor = {
    x:0,
    y:0,
}
window.addEventListener('mousemove', (event)=> {
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = -(event.clientY / sizes.height - 0.5);
})

// Scene
const scene = new THREE.Scene()

// Object

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh)



// axesHelper
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper);


// Sizes
const sizes = {
    width: 800,
    height: 600,
}

const aspectRatio = sizes.width/sizes.height;

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100 )
// const camera = new THREE.OrthographicCamera(
//     -1 * aspectRatio,
//     1 * aspectRatio,
//     1,
//     -1,
//     0.1,100)
// camera.position.x = 2
// camera.position.y = 2
camera.position.z = 3
console.log(camera.position.length());

// look at the object , focus on object
camera.lookAt(mesh.position)

// distance from camera
// console.log(mesh.position.distanceTo(camera.position));
scene.add(camera)


const canvas = document.querySelector('canvas.webgl');
// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// render
renderer.render(scene, camera)


const clock = new THREE.Clock();

const tick = ()=> {
    
    const elapsedTime = clock.getElapsedTime();
    // mesh.rotation.y = elapsedTime * Math.PI  ;
    // console.log(cursor)

    // render
    console.log(cursor.x)
    camera.position.x = Math.sin(cursor.x * 2) ;
    camera.position.Z = Math.cos(cursor.x * 2);
    // camera.position.y = cursor.y * 5;
    camera.lookAt(mesh.position)

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick);

}
tick()


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