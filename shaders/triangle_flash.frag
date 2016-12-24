uniform float time;
uniform vec2 resolution;

#define PI 3.1415
#define center (resolution.xy / 2.0)

//Skew space 60° to make diamonds
const mat2 DIAMOND = mat2(
    1.0, 0.0,
    //-cot(60°), csc(60°)
    -1.0 / tan(PI / 3.0), 1.0 / sin(PI / 3.0)
);

void main() {
    //Centered UV coordinates accounting for aspect ratio
    vec2 uv = (gl_FragCoord.xy - center) / resolution.y;
    
    //Scale of the triangles in the grid
    float num_cells = 10.0;
    
    //Transform into a diamond tiling
    uv = num_cells * DIAMOND * uv;
    
    //Convert to hex coordinates
    vec3 hex = vec3(uv, 1.0 - uv.x - uv.y);
    
    //Divide into cells
    vec3 hex_cell = floor(hex);
    
    //Make steps of color in each of the three hex axes. Shift radially in time.
    vec3 shifted_cells = hex_cell / num_cells + 0.4 * time;
    //Make the animation loop around
    vec3 cell_color = 1.0 - mod(shifted_cells, 0.4 * num_cells);
    
    //Display
    gl_FragColor = vec4(cell_color, 1.0);
}
