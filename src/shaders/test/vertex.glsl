uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;

attribute vec3 position;
attribute float aRandom;
attribute vec2 uv;


uniform vec2 uFrequency;
uniform float uTime;

varying float vElevation;
varying vec2 vUv;

void main(){
    vec4 modalPosition = modelMatrix * vec4(position, 1.0);
    float elevation = sin(modalPosition.x * uFrequency.x - uTime) * 0.1 + sin(modalPosition.y * uFrequency.y - uTime) * 0.1;
    modalPosition.z += elevation;

    vec4 viewPosition = viewMatrix * modalPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;

    vUv = uv; 
    vElevation= elevation;
}