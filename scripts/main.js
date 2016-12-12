'use strict';
var init = () => {
    var scene = new THREE.Scene();

    //FOV, aspect ratio, near and far clipping plane
    /*
    var camera = new THREE.PerspectiveCamera(
        75, window.innerWidth / window.innerHeight, 0.1, 1000);
    */

    //left, right, top, bottom, near, far
    var width = window.innerWidth;
    var height = window.innerHeight;
    var camera = new THREE.OrthographicCamera(-width/2, width/2, height/2, height/-2, 1, 1000);
    camera.position.z = 5;

    //Initialize the renderer
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //var geometry = new THREE.BoxGeometry(1, 1, 1);
    var geometry = new THREE.PlaneGeometry(width, height);
    //var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    var vertex_shader = document.getElementById("vertex-shader").innerHTML;
    var frag_shader = document.getElementById("frag-shader").innerHTML;
    var uniforms = {
        time: {value: 1.0},
        mouse: {value: new THREE.Vector2(0.0, 0.0)},
        resolution: {value: new THREE.Vector2(width, height)},
        scroll: {value: 0}
    }
    var material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertex_shader,
        fragmentShader: frag_shader
    });
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    function update_mouse(event) {
        event.preventDefault();
        uniforms.mouse.value.x = event.clientX;
        uniforms.mouse.value.y = -event.clientY;
    }
    window.onmousemove = update_mouse;

    function resize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        uniforms.resolution.value.x = window.innerWidth;
        uniforms.resolution.value.y = window.innerHeight;
    }
    window.onresize = resize;

    function scroll(event) {
        if (event.deltaY < 0)
            uniforms.scroll.value--;
        else
            uniforms.scroll.value++;
    }
    window.onmousewheel = scroll;

    function render() {
        requestAnimationFrame(render);
        uniforms.time.value += 0.05;
        renderer.render(scene, camera);
    }
    render();
};

window.onload = init;
