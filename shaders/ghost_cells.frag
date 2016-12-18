uniform float time;
uniform vec2 resolution;

//borrowed from https://thebookofshaders.com/12/. Not quite sure how it works
//yet
vec2 hash2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

//hash a point onto a color from the texture
/*vec2 hash2(vec2 point) {
    return texture2D(iChannel0, point).rg;
}
*/

void main() {
    //Convert to UV space
    vec2 uv = gl_FragCoord.xy / resolution;

    //Center
    uv -= 0.5;

    //Fix aspect ratio
    uv.x *= resolution.x / resolution.y;

    //Tile space
    vec2 scaled = 7.0 * uv;

    //Coordinates (x, y) of the box
    vec2 box = floor(scaled);

    //UV coordinate within current box
    vec2 box_uv = fract(scaled);

    //Minimum distance between box_uv and a nearby feature point
    float min_dist = 1.0;

    //Iterate over current box + surrounding 8 neighbors
    for (int i = -1; i <= 1; i++) {
        for (int j = -1; j <= 1; j++) {
            //Coodrinates (x, y) of neighbor box
            vec2 neighbor = vec2(float(i), float(j));

            //Find the feature point in the neighbor cell.
            //this is a fractional coordinate like box_uv
            vec2 feature = hash2((box + neighbor) / 100.0);

            //Animate the feature points a little bit
            feature = 0.5 * sin(time + 6.0 * feature) + 0.5;

            //Get the distance between current pixel (box_uv)
            //and the feature point (neighbor + feature)
            float dist = distance(box_uv, neighbor + feature);

            //Update the minimum
            min_dist = min(dist, min_dist);
        }
    }

    vec4 spring_green = vec4(0.0, 1.0, 0.5, 1.0);

    //Pulse outwards from the center of each feature point over time
    float pulse_val = 10.0 * min_dist;
    float animation = -time;
    //shift the frequency as we move away from the center of the screen
    float variation = 5.0 * length(uv);
    //This was a happy
    float distortion = length(hash2(uv));
    float pulse = cos(pulse_val + animation + variation + distortion);

    gl_FragColor = pulse * spring_green;
}
