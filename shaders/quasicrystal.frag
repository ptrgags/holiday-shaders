#define PI 3.1415

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

// From http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

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
    vec2 mouse_uv = mouse / resolution;

    vec2 center = resolution / 2.0;
    float freq = PI / 24.0; //Variable: wave spacing

    float wave_sum = 0.0;
    for (float i = 1.0; i <= 11.0; i++) { //Variable: Number of layers
        wave_sum += wave(gl_FragCoord.xy, time / i, center, freq);
    }

    // Mouse y controls triangle wave frequency
    float mouse_yrange = clamp(mouse_uv.y, 0.1, 1.0);
    float brightness = triangle_wave(wave_sum, mouse_yrange);

    vec3 color_hsv = vec3(mouse_uv.x, 1.0, 1.0);

    //Variable: Color
    //vec3 out_color = vec3(0.6, 0.2, 0.9); // purple
    vec3 out_color = hsv2rgb(color_hsv);
    gl_FragColor = vec4(brightness * out_color, 1.0);

    //gl_FragColor = vec4(mouse_uv.y, 0.0, 0.0, 1.0);
}
