#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform int scroll;

#define PI 3.1415

#define NUM_ITERATIONS 200.0

float mandelbrot(vec2 c) {
    float a = 0.0;
    float b = 0.0;
    for (float i = 0.0; i < NUM_ITERATIONS; i++) {
        float re = a * a - b * b + c.x;
        float im = 2.0 * a * b + c.y;

        //If we escaped the circle, return the number
        //of completed iterations
        if ((re * re + im * im) > 4.0)
            return i + 1.0;

        //Update for the next iteration
        a = re;
        b = im;
    }

    //If we reached here, return 0 to indicate no divergence
    return 0.0;
}

float peak_gradient(float x, float k) {
    return pow(4.0 * x * (1.0 - x), k);
}

void main() {
    vec2 center = resolution / 2.0;

    const int NUM_POINTS = 4;
    vec2 POINTS_OF_INTEREST[NUM_POINTS];
    POINTS_OF_INTEREST[0] = vec2(-0.75, 0.1); //Seahorse Valley
    POINTS_OF_INTEREST[1] = vec2(-1.75, 0.0); // mini mandelbrot
    POINTS_OF_INTEREST[2] = vec2(0.274, 0.482); // Quad-Spiral Valley
    POINTS_OF_INTEREST[3] = vec2(0.275, 0.0); //Elephant Valley

    vec2 point_of_interest;
    for (int i = 0; i < NUM_POINTS; i++) {
        if (i == int(mod(float(scroll), float(NUM_POINTS))))
            point_of_interest = POINTS_OF_INTEREST[i];
    }

    float min_zoom = 50.0;
    float max_zoom = 500000.0;
    vec2 mouse_uv = mouse / resolution;
    float zoom_factor = mouse_uv.x;
    float zoom = zoom_factor * min_zoom + (1.0 - zoom_factor) * max_zoom;
    vec2 centered = (gl_FragCoord.xy - center) / zoom + point_of_interest;

    float iters = mandelbrot(centered);
    float val = iters / NUM_ITERATIONS;

    vec3 color = vec3(1.0, 0.5, 0.0);
    gl_FragColor = vec4(color * peak_gradient(val, 1.0), 1.0);

}
