uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform int scroll;

#define PI 3.1415

//Convert range [-1.0, 1.0] -> [0.0, 1.0]
float normalize_trig(float trig_val) {
    return (trig_val + 1.0) / 2.0;
}

float wave(float val, float freq, float pulse_speed) {
    return cos(freq * val - pulse_speed * time);
}

void main()
{
    float freq = PI / 24.0;
    float pulse_speed = 0.8;

    //Y is flipped in my implementation
    vec2 fixed_mouse = vec2(mouse.x, resolution.y - mouse.y);

	vec2 center = resolution / 2.0;
    float center_dist = distance(gl_FragCoord.xy, center);
    float center_pulse = wave(center_dist, freq, pulse_speed);

    float mouse_dist = distance(gl_FragCoord.xy, fixed_mouse);
    float mouse_pulse = wave(mouse_dist, freq, pulse_speed);

    float interference = (center_pulse + mouse_pulse) / 2.0;

    if (mod(float(scroll), 2.0) > 0.5) {
        vec2 mirror = vec2(resolution.x - fixed_mouse.x, fixed_mouse.y);
        float mirror_dist = distance(gl_FragCoord.xy, mirror);
        float mirror_pulse = wave(mirror_dist, freq, pulse_speed);

        interference = (center_pulse + mouse_pulse + mirror_pulse) / 3.0;
    }

    //Blue
    vec3 color = vec3(0.212, 0.549, 0.714);

    gl_FragColor.rgb = interference * color;
    gl_FragColor.a = 1.0;
}
