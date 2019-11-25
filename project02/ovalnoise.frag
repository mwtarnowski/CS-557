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

    float r = 1.;
    float g = 0.;
    float b = 1. - 6. * (t - (5./6.));

    if (t <= (5./6.)) {
        r = 6. * (t - (4./6.));
        g = 0.;
        b = 1.;
    }
    if (t <= (4./6.)) {
        r = 0.;
        g = 1. - 6. * (t - (3./6.));
        b = 1.;
    }
    if (t <= (3./6.)) {
        r = 0.;
        g = 1.;
        b = 6. * (t - (2./6.));
    }
    if (t <= (2./6.)) {
        r = 1. - 6. * (t - (1./6.));
        g = 1.;
        b = 0.;
    }
    if (t <= (1./6.)) {
        r = 1.;
        g = 6. * t;
    }

    return vec3(r, g, b);
}

void main() {
    vec3 color = vColor;
    if (uUseChromaDepth) {
        float t = (2./3.) * (vDepth - uChromaRed) / (uChromaBlue - uChromaRed);
        t = clamp(t, 0., 2./3.);
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
