uniform vec3 uBigWavesDepthColor;
uniform vec3 uBigWavesSurfaceColor;
uniform float uColorOffSet;
uniform float uColorMultipliyer;

varying float vElevation;



void main()
{
    float mixStrength = (vElevation + uColorOffSet) * uColorMultipliyer;
    vec3 mixColor = mix(uBigWavesDepthColor, uBigWavesSurfaceColor, mixStrength);
    gl_FragColor = vec4(mixColor, 1.0);
}
