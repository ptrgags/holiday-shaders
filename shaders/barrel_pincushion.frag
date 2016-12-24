uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

/*
 * Fitzgibbon's approximation of Barrel/Pincushion distortion. 
 * Formula and explanation found at:
 * http://marcodiiga.github.io/radial-lens-undistortion-filtering
 * 
 * r     - distance from the center of distortion
 * alpha - distortion parameter. negative for barrel distortion,
 *         positive for pincushion distortion.
 */
vec2 lens_distortion(vec2 r, float alpha) {
    return r * (1.0 - alpha * pow(length(r), 2.0));
}

void main() {
    //Convert to UV coordinates, accounting for aspect ratio
    vec2 uv = gl_FragCoord.xy / resolution.y;
    vec2 mouse_uv = mouse.xy / resolution.y;
    mouse_uv.y = 1.0 - mouse_uv.y;
    
    //Distort space around the mouse
    vec2 distort = lens_distortion(uv - mouse_uv, 5.0 * sin(0.5 * time));
    vec2 new_coords = uv + distort;

    //Make some boxes
    new_coords *= 10.0;
    new_coords = fract(new_coords);

    //Get the distance to the edges of each box
    vec2 dist = abs(0.5 - new_coords);
    float grid_lines = step(0.45, max(dist.x, dist.y));
    
    //Apply the distortion to the texture.
    vec4 color = vec4(0.0, 1.0, 0.5, 1.0);
    gl_FragColor = grid_lines * vec4(1.0, 1.0, 0.0, 1.0);
}
