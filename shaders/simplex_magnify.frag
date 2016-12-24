uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.1415

/*
 * skew spacee from squares into rhombi.
 * Essentially we are rotating the y-axis
 * 60 degrees counterclockwise while keeping
 * the x-axis still.
 *
 * Transform derivation: screen(x, y) -> skewed(x', y')
 * x' = x - ycos(60°)
 * y' =     ysin(60°)
 *
 * Inverse (the transform we want): skewed(x', y')
 * y = y'csc(60°)
 * x = x' + ycos(60°)
 *   = x' + y'cos(60°)csc(60°)
 *   = x' + y'cot(60°)
 */
vec2 rhombi(vec2 point) {
    mat2 transform = mat2(
        1.0, 0.0,
        //cot(60°), csc(60°)
        1.0 / tan(PI / 3.0), 1.0 / sin(PI / 3.0)
    );
    return transform * point;
}

float simplex_grid(vec2 uv, float grid_scale) {
    //Skew space into rhombi made up of 2 equilateral triangles
    uv = rhombi(uv);

    //tile space
    uv *= grid_scale;
    vec2 box = floor(uv);
    vec2 box_uv = fract(uv);

    //Color one triangle black, and one triangle white
    float brightness = step(box_uv.x, box_uv.y);
    return brightness;
}

/*
 * Fitzgibbon's approximation of Barrel/Pincushion distortion.
 * Formula and explanation found at:
 * http://marcodiiga.github.io/radial-lens-undistortion-filtering
 *
 * r     - distance from the center of distortion
 * alpha - distortion parameter. negative for barrel distortion,
 * 		   positive for pincushion distortion.
 */
vec2 lens_distortion(vec2 r, float alpha) {
    return r * (1.0 - alpha * pow(length(r), 2.0));
}

vec2 zoom_point(vec2 uv, vec2 point, float zoom) {
    //translate so the point is at the origin, scale, and translate back to the point
    return (uv - point) / zoom + point;
}

void main() {
    //screen space -> uv space
	vec2 uv = gl_FragCoord.xy / resolution.y;

    //mouse coordinates -> uv and flip y
    vec2 mouse_uv = mouse.xy / resolution.y;
    mouse_uv.y = 1.0 - mouse_uv.y;

    //Scale of un-zoomed grid
    float grid_size = 30.0;

    //Draw the main grid at regular size
    float brightness = simplex_grid(uv, grid_size);
    gl_FragColor = brightness * vec4(uv, 0.0, 1.0);

    //size of the magnifying glass
    float lens_radius = 0.2;

    //Outline of the magnifying glass
    float mouse_dist = distance(mouse_uv, uv);
    if (mouse_dist < lens_radius + 0.01)
        gl_FragColor = vec4(0.0);

    //Distort space to make a 'glass'
    if (mouse_dist < lens_radius) {
        float zoom = 3.0;
        //Distort space inside the lens with pincushion distortion
        vec2 distortion = lens_distortion(uv - mouse_uv, 20.0);

        //Zoom in, keeping the distortion effect
        vec2 zoomed = zoom_point(uv + distortion, mouse_uv, zoom);

        //Draw the grid with zoom and distortion
        float brightness = simplex_grid(zoomed, grid_size);
        gl_FragColor = brightness* vec4(uv, 0.0, 1.0);
    }
}
