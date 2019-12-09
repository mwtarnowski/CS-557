#version 330 compatibility

in vec2 vTexCoord;

uniform float uScenter;
uniform float uTcenter;
uniform float uRadius;
uniform float uMagFactor;
uniform float uRotAngle;
uniform float uSharpFactor;

uniform sampler2D uImageUnit;

void main() {
    vec2 center = vec2(uScenter, uTcenter);
    vec2 d = vTexCoord - center;

    if (length(d) < uRadius) {
        float c = cos(uRotAngle);
        float s = sin(uRotAngle);
        mat2 R = mat2(c, -s, s, c);

        vec2 newST = R * (d / uMagFactor) + center;

        vec2 res = vec2(textureSize(uImageUnit, 0));

        vec2 stp0 = vec2(1., 0.) / res;
        vec2 st0p = vec2(0., 1.) / res;
        vec2 stpp = vec2(1., 1.) / res;
        vec2 stpm = vec2(1.,-1.) / res;

        vec3 i00 = texture(uImageUnit, newST).rgb;
        vec3 im0 = texture(uImageUnit, newST - stp0).rgb;
        vec3 ip0 = texture(uImageUnit, newST + stp0).rgb;
        vec3 i0m = texture(uImageUnit, newST - st0p).rgb;
        vec3 i0p = texture(uImageUnit, newST + st0p).rgb;
        vec3 imm = texture(uImageUnit, newST - stpp).rgb;
        vec3 ipp = texture(uImageUnit, newST + stpp).rgb;
        vec3 imp = texture(uImageUnit, newST - stpm).rgb;
        vec3 ipm = texture(uImageUnit, newST + stpm).rgb;

        vec3 target = vec3(0.);
        target += 4. * (i00);
        target += 2. * (im0 + ip0 + i0m + i0p);
        target += 1. * (imm + ipm + ipp + imp);
        target /= 16.;

        gl_FragColor = vec4(mix(target, i00, uSharpFactor), 1.);
    } else {
        gl_FragColor = vec4(texture(uImageUnit, vTexCoord).rgb, 1.);
    }
}
