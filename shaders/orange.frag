#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform float time;

float bell_curve(float x, float x_scale) {
    return exp(-pow(x_scale * (x - 0.5), 2.0));
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    gl_FragColor = bell_curve(uv.x, 2.0 * sin(time) + 2.0) * vec4(1.0, 0.5, 0.0, 1.0);
}
