#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;

#define PI 3.1415

vec2 rotate(vec2 point, float theta) {
    mat2 rot = mat2(
        cos(theta), -sin(theta),
        sin(theta), cos(theta)
    );
    return rot * point;
}

vec2 rotate_center(vec2 point, float theta, vec2 center) {
    return rotate(point - center, theta) + center;
}

float wave(vec2 point, float theta, vec2 center, float freq) {
    vec2 rotated = rotate_center(point, theta, center);
    return sin(freq * rotated.x);
}

float triangle_wave(float x, float freq) {
    return abs(mod(freq * x, 2.0) - 1.0);
}

void main() {
    vec2 center = resolution / 2.0;
    float freq = PI / 24.0; //Variable: wave spacing

    float wave_sum = 0.0;
    for (float i = 1.0; i <= 11.0; i++) { //Variable: Number of layers
        wave_sum += wave(gl_FragCoord.xy, time / i, center, freq);
    }

    float brightness = triangle_wave(wave_sum, 2.0); //Variable: triangle frequency

    //Variable: Color
    vec3 color = vec3(0.6, 0.2, 0.9); // purple
    gl_FragColor.rgb = brightness * color;
    gl_FragColor.a = 1.0;
}
