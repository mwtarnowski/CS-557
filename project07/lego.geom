#version 330 compatibility
#extension GL_EXT_gpu_shader4: enable
#extension GL_EXT_geometry_shader4: enable

layout(triangles) in;
layout(triangle_strip, max_vertices = 200) out;

in vec3 vNormal[3];

uniform int uLevel;
uniform float uQuantize;
uniform bool uModelCoords;

out float gLightIntensity;

const vec3 LIGHTPOS = vec3(0., 20., 0.);

vec3 V0, V01, V02;
vec3 N0, N01, N02;

vec3 Quantize(vec3 v) {
    return round(v * uQuantize) / uQuantize;
}

void ProduceVertex(float s, float t) {
    vec3 v = V0 + s * V01 + t * V02;
    vec3 n = N0 + s * N01 + t * N02;
    vec3 tnorm = normalize(uNormalMatrix * n);

    vec4 MCposition, ECposition;
    if (uModelCoords) {
        MCposition = vec4(v, 1.);
        MCposition = vec4(Quantize(MCposition.xyz), 1.);
        ECposition = uModelViewMatrix * MCposition;
    } else {
        MCposition = vec4(v, 1.);
        ECposition = uModelViewMatrix * MCposition;
        ECposition = vec4(Quantize(ECposition.xyz), 1.);
    }

    gl_Position = uProjectionMatrix * ECposition;
    gLightIntensity = abs(dot(normalize(LIGHTPOS - ECposition.xyz), tnorm));
    EmitVertex();
}

void main() {
    V0  =  gl_PositionIn[0].xyz;
    V01 = (gl_PositionIn[1] - gl_PositionIn[0]).xyz;
    V02 = (gl_PositionIn[2] - gl_PositionIn[0]).xyz;

    N0  = vNormal[0];
    N01 = vNormal[1] - vNormal[0];
    N02 = vNormal[2] - vNormal[0];

    int numLayers = 1 << uLevel;
    float dt = 1. / float(numLayers);

    float t = 1. - dt;
    for (int lvl = 0; lvl < numLayers; ++lvl) {
        float s = 0.;
        ProduceVertex(s, t);
        for (int k = 0; k <= lvl; ++k) {
            ProduceVertex(s, t + dt);
            ProduceVertex(s + dt, t);
            s += dt;
        }
        EndPrimitive();
        t -= dt;
    }
}
