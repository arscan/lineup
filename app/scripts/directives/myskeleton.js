'use strict';

/**
 * @ngdoc directive
 * @name lineupApp.directive:mySkeleton
 * @description
 * # mySkeleton
 */

/* TODO: Implement projector effect */
/* NOTE: having trouble finguring out how to do it properly */
/* So, do something like this in the meantime: */
/* http://threejs.org/examples/webgl_postprocessing_godrays.html */
/* if I change line 40 in the shader to */
/*  vec2 delta = -1.0 * (vSunPositionScreenSpace - vUv); */
/* it will draw the godlines to the sun... */

;(function(angular, THREE){
    var Shaders = {
        skeleton: {
            uniforms : {
                currentTime: {type: 'f', value: 0.0}
            },
            vertexShader: [
                '#define INTRODURATION 5.0',
                'varying vec3 vNormal;',
                'uniform float currentTime;',
                'void main() {',
                '  vNormal = normalize( normalMatrix * normal );',
                '  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
                '}'
            ].join('\n'),
            fragmentShader: [
                'varying vec3 vNormal;',
                'uniform float currentTime;',
                'void main() {',
                '  if(gl_FragCoord.y > currentTime * 150.0){',
                '    gl_FragColor = vec4(0.0,0.0,0.0,0.0);',
                '  } else {',
                '    float intensity = 1.20 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );',
                '    vec3 outline = vec3( 0.0708, 0.714, 0.652 ) * pow( intensity, 3.0 );',
                '    gl_FragColor = vec4(outline, intensity);',
                ' } ',
                '}'
            ].join('\n')
        }
    };

    function createScene(element, width, height){

        var container, scene, renderer, camera, clock;
        var VIEW_ANGLE, ASPECT, NEAR, FAR;

        var composer;
        var hblur, vblur;

        var loader = new THREE.AssimpJSONLoader();

        VIEW_ANGLE = 45;
        ASPECT = width / height;
        NEAR = 1;
        FAR = 10000;

        container = (element[0]);
        clock = new THREE.Clock();

        scene = new THREE.Scene();

        renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});

        renderer.setSize(width, height);


        var canvas = renderer.domElement;

        container.appendChild(canvas);

        camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        camera.position.set(0, 25, 270);
        scene.add(camera);

        var parameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, stencilBuffer: false };
        var renderTarget = new THREE.WebGLRenderTarget( width, height, parameters );

        composer = new THREE.EffectComposer( renderer, renderTarget );
        composer.addPass( new THREE.RenderPass( scene, camera ) );

        var bloomPass = new THREE.BloomPass(3, 25, 5, 256);
        composer.addPass(bloomPass);

        var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
        effectCopy.renderToScreen = true;
        composer.addPass(effectCopy);

        /*
        hblur = new THREE.ShaderPass( THREE.HorizontalBlurShader );
        composer.addPass( hblur );

        vblur = new THREE.ShaderPass( THREE.VerticalBlurShader );
        composer.renderToScreen = true;
        composer.addPass( vblur );
       */

        var skeletonMaterial = new THREE.ShaderMaterial({
            uniforms: Shaders.skeleton.uniforms,
            vertexShader: Shaders.skeleton.vertexShader,
            fragmentShader: Shaders.skeleton.fragmentShader
        });

        loader.load( 'models/skeleton.json', skeletonMaterial, function ( skeletonObject ) {

            skeletonObject.scale.x = skeletonObject.scale.y = skeletonObject.scale.z = 1.2;
            skeletonObject.updateMatrix();
            skeletonObject.rotation.y = Math.PI/2;

            scene.add(skeletonObject);
            requestAnimationFrame(render);
            //render();
        } );

        function render() {
            var time = clock.getElapsedTime();
            // assimpjson.rotation.y += .01;
            scene.children[1].rotation.y -= 0.005;
            if(Math.random() < 0.01){
                console.log(time);
            }

            Shaders.skeleton.uniforms.currentTime.value = time;

            composer.render(scene, camera);
            requestAnimationFrame(render);
        }

        return { canvas: $(canvas)};
    }

    angular.module('lineupApp')
    .directive('mySkeleton', function () {
        return {
            // template: '<div style="position: absolute; width: 500; height: 0; bottom: 320px; left: 400px; overflow: hidden;" class="skeleton"></div>',
            template: '<div style="position: absolute; width: 500; height: 500; bottom: 320px; left: 400px; overflow: hidden;" class="skeleton"></div>',
            restrict: 'E',
            link: function postLink(scope, element, attrs) {
                 var width = attrs.width || 350,
                     height = attrs.height || 350,
                     delay = attrs.delay || 0,
                     skeletonDiv = $('.skeleton', element);
                
            setTimeout(function(){
                var threeD = createScene($('.skeleton', element), width, height);

                threeD.canvas.css({
                     position: 'relative',
                     // top: height * -1,
                     border: '1px solid #fff',
                     width: 500,
                     height: 500
                     // '-webkit-filter': 'blur(1px)'
                     
                 });

                
                // skeletonDiv.velocity({height: height}, {duration:  3000, delay: delay});
                // skeletonCanvas.velocity({top: 0}, {duration: 3000, delay: delay});
            }, 700);

            }
        };
    });

})(angular, THREE);
