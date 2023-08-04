uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;

attribute vec3 position;
attribute float aRandom;

varying float vRandom;

void main(){
    vRandom = aRandom;

    vec4 modalPosition = modelMatrix * vec4(position, 1.0);
    // modalPosition.z += sin(modalPosition.x * 10.0) * 0.2;
    modalPosition.z += aRandom * 0.1;
    vec4 viewPosition = viewMatrix * modalPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition; 
}