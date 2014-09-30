'use strict';

/**
 * @ngdoc directive
 * @name lineupApp.directive:myBackdrop
 * @description
 * # myBackdrop
 */

;(function(angular, THREE){

    var pointLight1, pointLight2, pointLight3, pointLight4;
    var scene = new THREE.Scene();
    var renderer;
    var camera;
    var startTime = Date.now();


    function createScene(element, width, height){

        camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 1000;


        // LIGHTS

        // var ambientLight = new THREE.AmbientLight( 0x222222 );
        // scene.add( ambientLight );

        pointLight1 = new THREE.PointLight( 0xeac7df, 0.75, 1500 );
        pointLight1.position.z = -450;

        pointLight2 = new THREE.PointLight( 0x479578, 0.75, 1500 );
        pointLight2.position.z = -450;

        pointLight3 = new THREE.PointLight( 0x12b7a7, 0.75, 1500 );
        pointLight3.position.z = -450;

        pointLight4 = new THREE.PointLight( 0xfd5f00, 0.75, 1500 );
        pointLight4.position.z = -450;

        scene.add( pointLight1 );
        scene.add( pointLight2 );
        scene.add( pointLight3 );
        scene.add( pointLight4 );



        var ambient = 0x111111, diffuse = 0xbbbbbb, specular = 0x060606, shininess = 15;

        var shader = THREE.ShaderLib[ "normalmap" ];
        var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

        uniforms[ "tNormal" ].value = THREE.ImageUtils.loadTexture( "models/normal_map3.png" );
        uniforms[ "uNormalScale" ].value.set( 0.8, 0.8 );

        uniforms[ "tDiffuse" ].value = THREE.ImageUtils.loadTexture( "models/diffuse_map.png" );
        // uniforms[ "tSpecular" ].value = THREE.ImageUtils.loadTexture( "obj/leeperrysmith/Map-SPEC.jpg" );

        uniforms[ "enableAO" ].value = false;
        uniforms[ "enableDiffuse" ].value = true;
        uniforms[ "enableSpecular" ].value = false;

        uniforms[ "diffuse" ].value.setHex( diffuse );
        uniforms[ "specular" ].value.setHex( specular );
        // uniforms[ "ambient" ].value.setHex( ambient );

        uniforms[ "shininess" ].value = shininess;

        // uniforms["uRepeat"].value =  new THREE.Vector2( 3, 1 );
        // uniforms["uOffset"].value =  new THREE.Vector2( -.5, 0 );
        // uniforms["offsetRepeat"].value =  new THREE.Vector4( 1,1,1, 1 );

        // uniforms[ "wrapRGB" ].value.set( 0.575, 0.5, 0.5 );

        var parameters = { fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShader, uniforms: uniforms, lights: true };
        var material = new THREE.ShaderMaterial( parameters );

        var geometry= new THREE.PlaneGeometry(800, 600);
        // var material = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture( "normal_map.png")});
        // uniforms[ "tNormal" ].value = THREE.ImageUtils.loadTexture( "normal_map.png" );

        var spacerGeometry= new THREE.PlaneGeometry(48, 1600);
        var spacerMaterial = new THREE.MeshPhongMaterial( { ambient: 0x000000, color: 0x9fa4b7, specular: 0x000000, shininess: 0, shading: THREE.FlatShading } );

        var spacerMesh = new THREE.Mesh( spacerGeometry, spacerMaterial );

        spacerMesh.position.z = -500;
        spacerMesh.position.x = -524;
        spacerMesh.position.y = -300;

        scene.add(spacerMesh);

        createPanel(geometry, {x:-100,y:300}, material);
        createPanel(geometry, {x:700,y:300}, material);
        createPanel(geometry, {x:-940,y:300}, material);
        createPanel(geometry, {x:-100,y:-300}, material);
        createPanel(geometry, {x:700,y:-300}, material);
        createPanel(geometry, {x:-940,y:-300}, material);


        renderer = new THREE.WebGLRenderer( { antialias: false } );
        // renderer.setClearColor( 0x111111, 1 );
        renderer.setSize( window.innerWidth/1.5, window.innerHeight/1.5 );

        var canvas = renderer.domElement;
        element[0].appendChild(canvas);

        animate();

        return { canvas: $(canvas)};
    }
    function createPanel( geometry, posish, material ) {

        geometry.computeTangents();

        var mesh1 = new THREE.Mesh( geometry, material );

        // mesh1.position.y = 500;
        mesh1.position.z = -500;
        mesh1.position.x = posish.x;
        mesh1.position.y = posish.y;

        scene.add( mesh1 );

        // loader.statusDomElement.style.display = "none";

    }
    function animate() {

        requestAnimationFrame( animate );

        render();

    }

    function render() {

        var diff = Date.now() - startTime; 

        pointLight1.position.x = Math.sin(diff/1000.0) * 200;
        pointLight1.position.y = 500 + Math.sin(diff/745) * 100;
        // pointLight1.position.z = 100 + Math.sin(diff/100.0) * 100;
        //
        pointLight2.position.x = -100 + Math.sin(diff/2000.0) * 200;
        pointLight2.position.y = 100 + Math.sin(diff/945) * 100;

        pointLight3.position.x = 50 + Math.cos(diff/2000.0) * 500;
        pointLight3.position.y = -50 + Math.sin(diff/745) * 100;
        
        pointLight4.position.x = 100 + Math.cos(diff/1500.0) * 800;
        pointLight4.position.y = -50 + Math.sin(diff/845) * 200;

        renderer.render( scene, camera );

    }


    angular.module('lineupApp')
    .directive('myBackdrop', function () {
        return {
            template: '<div style="position: absolute;  overflow: hidden; width: 100%; height: 100%;" class="backdrop"></div>',
            restrict: 'E',
            link: function postLink(scope, element, attrs) {
                console.log("hiiii");
                var width = attrs.width || 350,
                height = attrs.height || 350;

                setTimeout(function(){
                    var threeD = createScene($('.backdrop', element), width, height);

                    threeD.canvas.css({
                        position: 'absolute',
                        // top: height * -1,
                        // border: '1px solid #fff',
                        width: '100%',
                        height: '100%',
                        top: 0,
                        left: 0,
                        //'-webkit-filter': 'blur(2px)'

                    });

                }, 50);

            }
        };
    });

})(angular, THREE);
