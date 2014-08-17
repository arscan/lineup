'use strict';

/**
 * @ngdoc directive
 * @name lineupApp.directive:mySkeleton
 * @description
 * # mySkeleton
 */
;(function(angular, THREE){
    var Shaders = {
        vertexShader: [
            'varying vec3 vNormal;',
            'void main() {',
            '  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
            '  vNormal = normalize( normalMatrix * normal );',
            '}'
        ].join('\n'),
        fragmentShader: [
            'varying vec3 vNormal;',
            'void main() {',
            '  float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );',
            '  vec3 outline = vec3( 0.0708, 0.714, 0.652 ) * pow( intensity, 3.0 );',
            '  gl_FragColor = vec4(outline, intensity);',
            '}'
        ].join('\n')
    };

    function createScene(element, width, height){

        var container, scene, renderer, camera, light, clock;
        var VIEW_ANGLE, ASPECT, NEAR, FAR;

        container = (element[0]);

        clock = new THREE.Clock();

        VIEW_ANGLE = 45;
        ASPECT = width / height;
        NEAR = 1;
        FAR = 10000;

        scene = new THREE.Scene();

        renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});

        renderer.setSize(width, height);
        // renderer.shadowMapEnabled = true;
        // renderer.shadowMapSoft = true;
        // renderer.shadowMapType = THREE.PCFShadowMap;
        // renderer.shadowMapAutoUpdate = true;

        container.appendChild(renderer.domElement);

        camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

        camera.position.set(0, 25, 270);
        // camera.rotation.x = -Math.PI / 12;

        scene.add(camera);


            var material = new THREE.ShaderMaterial({
                vertexShader: Shaders.vertexShader,
                fragmentShader: Shaders.fragmentShader
            });

        var loader = new THREE.AssimpJSONLoader();

        loader.load( 'models/skeleton.json', material, function ( assimpjson ) {

            assimpjson.scale.x = assimpjson.scale.y = assimpjson.scale.z = 1.2;
            assimpjson.updateMatrix();

            scene.add(assimpjson);
            requestAnimationFrame(render);
            //render();
        } );

        function render() {
            // var time = clock.getElapsedTime();
            // assimpjson.rotation.y += .01;
            scene.children[1].rotation.y -= 0.005;

            renderer.render(scene, camera);
            requestAnimationFrame(render);
        }
    }


    angular.module('lineupApp')
    .directive('mySkeleton', function () {
        return {
            template: '<div style="position: absolute; width: 500; height: 500; bottom: 320px; left: 400px;" class="skeleton"></div>',
            restrict: 'E',
            link: function postLink(scope, element, attrs) {
                 var width = attrs.width || 300,
                     height = attrs.height || 300,
                     skeletonDiv = $('.skeleton', element);

                 // skeletonDiv.velocity({bottom: '+=10', left: '+=10'}, {loop: true});
            // skeletonDiv.velocity({top: '+=500', width: '-=80'}, {delay: 150, duration: 4000, loop: true, easing: 'linear'});


                     console.log('---');
                     console.log(attrs);
                     console.log('---');

                console.log(attrs);
                createScene($('.skeleton', element), width, height);

            }
        };
    });

})(angular, THREE);
