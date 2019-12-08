#version 330 compatibility

in vec3 vMCposition;
in vec3 vECposition;
in vec3 vECnormal;

uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform float uEta;
uniform float uMix;
uniform samplerCube uReflectUnit;
uniform samplerCube uRefractUnit;

uniform sampler3D Noise3;

const vec3 WHITE = vec3(1., 1., 1.);

vec3 rotateXY(float angx, float angy, vec3 v) {
    float cx = cos(angx), sx = sin(angx),
          cy = cos(angy), sy = sin(angy);
    mat2 Rx = mat2(cx, -sx, sx, cx),
         Ry = mat2(cy, -sy, sy, cy);
    v.yz = Rx * v.yz;
    v.zx = Ry * v.zx;
    return v;
}

void main() {
    vec4 nvx = texture(Noise3, uNoiseFreq * vMCposition);
    float angx = uNoiseAmp * (nvx.r + nvx.g + nvx.b + nvx.a - 2.);
    vec4 nvy = texture(Noise3, uNoiseFreq * vec3(vMCposition.xy, vMCposition.z + 0.5));
    float angy = uNoiseAmp * (nvy.r + nvy.g + nvy.b + nvy.a - 2.);

    vec3 I = normalize(vECposition);
    vec3 N = normalize(rotateXY(angx, angy, vECnormal));

    vec3 reflectVector = reflect(I, N);
	vec3 refractVector = refract(I, N, uEta);

    // Sampling cubemaps via `texture` function needs the lookup vector to be
    // an element of world space. However, glman does not provide neither the
    // camera position nor the inverse of the view matrix.
    // reflectVector = (uViewMatrixInverse * vec4(reflectVector, 0.)).xyz;
    // refractVector = (uViewMatrixInverse * vec4(refractVector, 0.)).xyz;
    // This walkaround works only if no transformations are applied to the model
    // ie. the model matrix is a unit matrix.
    reflectVector = (uModelViewMatrixInverse * vec4(reflectVector, 0.)).xyz;
    refractVector = (uModelViewMatrixInverse * vec4(refractVector, 0.)).xyz;

	vec3 reflectColor = texture(uReflectUnit, reflectVector).rgb;
	vec3 refractColor = texture(uRefractUnit, refractVector).rgb;
	refractColor = mix(refractColor, WHITE, 0.1);

	gl_FragColor = vec4(mix(reflectColor, refractColor, uMix),  1.);
}
