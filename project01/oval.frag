#version 330 compatibility

in vec3 vColor;
in vec2 vTexCoord;
in float vLightIntensity;

uniform float uAd;
uniform float uBd;
uniform float uTol;

const vec3 WHITE = vec3(1., 1., 1.);
const float EPS = 0.001;

void main() {
    vec2 ABd = vec2(uAd, uBd);
    vec2 ABr = ABd / 2.;
    vec2 c = floor(vTexCoord / ABd) * ABd + ABr;
    vec2 r = vTexCoord - c;

    float f = length(r / ABr);
    float m = (uTol < EPS) ? step(1., f) : smoothstep(1.-uTol, 1.+uTol, f);

    vec3 rgb = vLightIntensity * mix(vColor, WHITE, m);
    gl_FragColor = vec4(rgb, 1.);
}
