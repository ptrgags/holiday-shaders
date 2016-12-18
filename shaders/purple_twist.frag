uniform vec2 resolution;
uniform float time;

float triangle_wave(float x) {
    return abs(mod(x, 2.0) - 1.0);
}

void main() {
    //Centered UV coordinates
	vec2 uv = gl_FragCoord.xy / resolution;
    uv -= 0.5;
    //Fix aspect ratio
    uv.x *= resolution.x / resolution.y;

    //Polar coordinates of this point relative to the center
    float r = length(uv);
    float theta = atan(uv.y, uv.x);

    //Okay, "Violet"...
    vec4 purple = vec4(0.5, 0.0, 1.0, 1.0);

    //This factor will be used in a cosine w/r/t
    //theta. it will create a number of spokes around
    //the center of the screen
    float spokes = 5.0;
    
    //Rotate the spokes back and forth over time
    float rotation = 30.0 * cos(0.3 * time);

    //Distort the spokes with a wave down the radius
    //Take your pick, triangle ewave or cosine wave. I
    //personally like the cosine wave for this shader
    //float radius_shift = triangle_wave(10.0 * r);
    float distortion_wave = cos(20.0 * r);


    //combine the effects of rotation + radius wave
    float spoke_distortion = rotation * distortion_wave;

    //calculate the overall twist shape
    float twist = cos(spokes * theta + spoke_distortion);

    //Color the twist purple
    gl_FragColor = twist * purple;
}
