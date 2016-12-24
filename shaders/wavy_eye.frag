uniform float time;
uniform vec2 resolution;

#define center (resolution.xy / 2.0)
#define PI 4.0 * atan(1.0)

vec2 rect_to_polar(vec2 rect) {
    float r = length(rect);
    float theta = atan(rect.y, rect.x);
    if (theta < 0.0)
        theta += 2.0 * PI;
    return vec2(r, theta);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - center) / resolution.y;
    
    //switch to polar coordinates
    vec2 polar = rect_to_polar(uv);
    
    for (int i = 0; i < 3; i++) {
        float index = float(i) + 1.0;
        
        //Make some waves
        float wave = 0.05 * sin(20.0 * polar.y + index * 2.0 * time);
        float wave_height = 1.0 - abs(polar.x + wave - 0.15 * index);
        gl_FragColor[i] = smoothstep(0.98, 0.99, wave_height);
    }
    gl_FragColor.a = 1.0;
}
