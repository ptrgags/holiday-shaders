'use strict';

var uniforms = {};

var vert_shaders = [];
var frag_shaders = [];

var vert_shader_list = [
    "default.vert"
];

var frag_shader_list = [
    "orange.frag",
    "quasicrystal.frag",
    "mandelbrot.frag"
];

var current_vert = 0;
var current_frag = 2;

var camera = null;
var renderer = null;

var preload_shader = (fname) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `shaders/${fname}`,
            dataType: 'text',
            success: resolve,
            error: reject
        });
    });
};

var load_vert_shaders = () => {
    return Promise.all(vert_shader_list.map(preload_shader));
};

var load_frag_shaders = () => {
    return Promise.all(frag_shader_list.map(preload_shader));
};

var store_vert_shaders = (shader_text) => {
    for (var i = 0; i < vert_shader_list.length; i++)
        vert_shaders.push(shader_text[i]);
};

var store_frag_shaders = (shader_text) => {
    for (var i = 0; i < frag_shader_list.length; i++)
        frag_shaders.push(shader_text[i]);
};

var setup_shaders = () => {
    // Set the scene
    var scene = new THREE.Scene();

    // lights, Camera, action! except there's no
    // lights or action yet...
    var width = window.innerWidth;
    var height = window.innerHeight;
    camera = new THREE.OrthographicCamera(
        -width / 2, width / 2, height/2, -height/2, 1, 1000);
    camera.position.z = 5;

    //Initialize the renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //Create the plane that we will shade
    var geometry = new THREE.PlaneGeometry(width, height);
    uniforms = {
        time: {value: 1.0},
        mouse: {value: new THREE.Vector2(0.0, 0.0)},
        resolution: {value: new THREE.Vector2(width, height)},
        scroll: {value: 0}
    }
    var material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vert_shaders[current_vert],
        fragmentShader: frag_shaders[current_frag]
    });
    var plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    function render() {
        requestAnimationFrame(render);
        uniforms.time.value += 0.05;
        renderer.render(scene, camera);
    }
    render();
};

$(document).ready(() => {
    load_vert_shaders()
        .then(store_vert_shaders)
        .then(load_frag_shaders)
        .then(store_frag_shaders)
        .then(setup_shaders)
        .catch(console.error);

    $(document).mousemove((event) => {
        event.preventDefault();
        uniforms.mouse.value.x = event.clientX;
        uniforms.mouse.value.y = -event.clientY;
    });

    $(window).resize(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        uniforms.resolution.value.x = window.innerWidth;
        uniforms.resolution.value.y = window.innerHeight;
    });

    $(window).on('wheel', (event) => {
        if (event.deltaY < 0)
            uniforms.scroll.value--;
        else
            uniforms.scroll.value++;
    });
});
