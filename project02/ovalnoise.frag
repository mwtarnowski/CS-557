#version 330 compatibility

in vec3 vMCposition;
in vec3 vColor;
in vec2 vTexCoord;
in float vDepth;
in float vLightIntensity;

uniform float uAd;
uniform float uBd;
uniform float uTol;
uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform float uAlpha;
uniform bool uUseChromaDepth;
uniform float uChromaBlue;
uniform float uChromaRed;

uniform sampler3D Noise3D;

const vec3 WHITE = vec3(1., 1., 1.);
const float EPS = 0.001;

vec3 ChromaDepth(float t) {
    t = clamp(t, 0., 1.);
    vec3 color;
    color.r = clamp(1. - 4.*(t - .25), 0., 1.);
    color.g = clamp(min(4.*t, 1. - 4.*(t - .75)), 0., 1.);
    color.b = clamp(4.*(t - .50), 0., 1.);
    return color;
}

void main() {
    vec3 color = vColor;
    if (uUseChromaDepth) {
        float t = (vDepth - uChromaRed) / (uChromaBlue - uChromaRed);
        color = ChromaDepth(t);
    }

    vec4 nv = texture(Noise3D, uNoiseFreq * vMCposition);
    float n = (nv.r + nv.g + nv.b + nv.a) - 2.;
    float noiseMag = n * uNoiseAmp;

    vec2 ABd = vec2(uAd, uBd);
    vec2 ABr = ABd / 2.;
    vec2 c = floor(vTexCoord / ABd) * ABd + ABr;
    vec2 d = vTexCoord - c;

    float oldDist = length(d);
    float newDist = oldDist + noiseMag;
    float scale = newDist / oldDist;
    d *= scale;

    float f = length(d / ABr);
    float m = (uTol < EPS) ? step(1., f) : smoothstep(1.-uTol, 1.+uTol, f);

    vec3 rgb = vLightIntensity * mix(color, WHITE, m);
    float alpha = mix(1., uAlpha, m);
    if (alpha < EPS) discard;
    gl_FragColor = vec4(rgb, alpha);
}
