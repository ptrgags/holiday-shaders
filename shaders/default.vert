#ifdef GL_ES
precision highp float;
#endif

void main() {
    gl_position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
