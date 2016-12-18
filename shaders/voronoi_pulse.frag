uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

#define NUM_POINTS 5

void main() {
	vec2 POINTS[NUM_POINTS];
	POINTS[0] = vec2(200.0 + 100.0 * cos(0.8 * time), 200.0);
	POINTS[1] = vec2(530.0, 45.0);
	POINTS[2] = vec2(437.0, 326.0 - 200.0 * cos(0.8 * time));
	POINTS[3] = vec2(mouse.x, resolution.y - mouse.y);
	POINTS[4] = vec2(123.0, 321.0);

    vec4 COLORS[NUM_POINTS];
    COLORS[0] = vec4(1.0, 0.0, 0.0, 1.0);
    COLORS[1] = vec4(1.0, 0.5, 0.0, 1.0);
    COLORS[2] = vec4(1.0, 1.0, 0.0, 1.0);
    COLORS[3] = vec4(0.25, 0.5, 1.0, 1.0);
    COLORS[4] = vec4(0.0, 1.0, 1.0, 1.0);

    float FREQS[NUM_POINTS];
    FREQS[0] = 1.0;
    FREQS[1] = 3.0;
    FREQS[2] = 5.0;
    FREQS[3] = 7.0;
    FREQS[4] = 9.0;

    float min_dist = 100000.0; //Infinity
    float min_freq = 1.0;
    for (int i = 0; i < NUM_POINTS; i++) {
        float dist = distance(gl_FragCoord.xy, POINTS[i]);
        if (dist < min_dist) {
            gl_FragColor = COLORS[i];
            min_dist = dist;
            min_freq = FREQS[i];
        }
    }

    gl_FragColor *= cos(min_dist / min_freq - 0.8 * time);

}
