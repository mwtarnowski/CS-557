#version 330 compatibility

in vec2 vTexCoord;

uniform sampler2D uTexUnit;

void main() {
    gl_FragColor = vec4(texture2D(uTexUnit, vTexCoord).rgb, 1.);
}
