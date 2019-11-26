#version 330 compatibility

in vec3 vMCposition;
in vec3 vECnormal;
in vec3 vLightDir;
in vec3 vViewDir;

uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform float uKa;
uniform float uKd;
uniform float uKs;
uniform float uShininess;
uniform vec4 uColor;
uniform vec4 uSpecularColor;

uniform sampler3D Noise3D;

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
    vec4 nvx = texture(Noise3D, uNoiseFreq * vMCposition);
    float angx = uNoiseAmp * (nvx.r + nvx.g + nvx.b + nvx.a - 2.);
    vec4 nvy = texture(Noise3D, uNoiseFreq * vec3(vMCposition.xy, vMCposition.z + 0.5));
    float angy = uNoiseAmp * (nvy.r + nvy.g + nvy.b + nvy.a - 2.);

    vec4 ambient = uKa * uColor;

    vec3 N = normalize(rotateXY(angx, angy, vECnormal));
    vec3 L = normalize(vLightDir);
    float diffuseCoeff = max(dot(N, L), 0.);
    vec4 diffuse = uKd * diffuseCoeff * uColor;

    vec3 R = reflect(-L, N);
    vec3 V = normalize(vViewDir);
    float specularCoeff = pow(max(dot(V, R), 0.), uShininess);
    vec4 specular = uKs * specularCoeff * uSpecularColor;

    gl_FragColor = vec4(ambient.rgb + diffuse.rgb + specular.rgb, 1.);
}
