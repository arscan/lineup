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
                currentTime: {type: 'f', value: 0.0},
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
                '  if(gl_FragCoord.y < currentTime * 150.0){',
                '    float intensity = 1.30 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );',
                '    vec3 outline = vec3( 0.0708, 0.714, 0.652 ) * pow( intensity, 1.0 );',
                '    gl_FragColor = vec4(outline, intensity);',
                ' } ',
                '}'
            ].join('\n')
        },
        organs: {
            uniforms : {
                currentTime: {type: 'f', value: 0.0},
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
                'uniform vec3 vMyColor;',
                'void main() {',
                '  if(gl_FragCoord.y < currentTime * 150.0){',
                '    float intensity = 1.30 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );',
                '    vec3 outline = vec3( 0.5708, 0.314, 0.252 ) * pow( intensity, 1.0 );',
                '    gl_FragColor = vec4(outline, intensity);',
                ' } ',
                '}'
            ].join('\n')
        },
        nameBox: {
            uniforms : {
                name1: {type: 't'},
                currentTime: {type: 'f', value: 10.0},
                bulletStartTime: {type: 'f', value: 2.0},
                bulletDuration: {type: 'f', value:0.6},
                headerInStartTime: {type: 'f', value: 0.5},
                headerInDuration: {type: 'f', value:2.0},
                textInStartTime: {type: 'f', value: 1.0},
                textInDuration: {type: 'f', value:3.0},
                textOutStartTime: {type: 'f', value: 6.0},
                textOutDuration: {type: 'f', value:1.0},
            },
            vertexShader: [
                'varying vec2 vUv;',
                'varying vec3 p;',
                'void main() {',
                '  vUv = uv;',
                '  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
                '}'
            ].join('\n'),
            fragmentShader: [
                'varying vec2 vUv;',
                'uniform float currentTime;',
                'uniform float bulletStartTime;',
                'uniform float bulletDuration;',
                'uniform float textInStartTime;',
                'uniform float textInDuration;',
                'uniform float textOutStartTime;',
                'uniform float textOutDuration;',
                'uniform float headerInStartTime;',
                'uniform float headerInDuration;',
                'uniform sampler2D name1;',

                'void main() {',
                '  float mid = 0.71;',
                '  float textStart = 0.79;',

                '  float lineHeight = 0.037;',
                '  gl_FragColor = texture2D(name1, vUv);',
                // '  float bulletPercent = bulletEndTime;',
                '  float bulletPercent = clamp((currentTime - bulletStartTime) / bulletDuration, 0.0, 1.0);',
                '  float textInPercent = clamp((currentTime - textInStartTime) / textInDuration, 0.0, 1.0);',
                '  float textOutPercent = clamp((currentTime - textOutStartTime) / textOutDuration, 0.0, 1.0);',
                '  float headerInPercent = clamp((currentTime - headerInStartTime) / headerInDuration, 0.0, 1.0);',
                '  float floorNum = floor(textInPercent * 10.0);',
                '  float myFloorNum = floor((textStart - vUv.y)/lineHeight);',
                '  if(vUv.x < .12 && abs(vUv.y - mid)*6.0 > bulletPercent ){',
                '    gl_FragColor.a = 0.0;',
                '  }',
                '  if(textInStartTime > 0.0 && vUv.x > .12 && vUv.y < textStart && vUv.x > (textInPercent - myFloorNum * .12 + .10 )){',
                '    gl_FragColor.a = 0.0;',
                '  }',
                '  if(textOutStartTime > 0.0 && vUv.x > .12 && vUv.y < textStart && vUv.x > 1.0-textOutPercent){',
                '    gl_FragColor.a = 0.0;',
                '  }',
                '  if(headerInStartTime > 0.0 && vUv.x > .12 && vUv.y > textStart && vUv.y < textStart + .1 && vUv.x > headerInPercent){',
                '    gl_FragColor.a = 0.0;',
                '  }',
                '}',
            ].join('\n')
        }
    };

    function renderToCanvas(width, height, renderFunction) {
        var buffer = document.createElement('canvas');
        buffer.width = width;
        buffer.height = height;

        // $(".container").append(buffer);
    
        renderFunction(buffer.getContext('2d'));

        return buffer;
    };

    function drawBullet(ctx, yStart, dir){ 
        yStart = yStart + 75;
        ctx.beginPath();
        ctx.moveTo(26, yStart);
        ctx.lineTo(42, yStart + dir * 16);
        ctx.lineTo(70, yStart + dir * 16);
        ctx.stroke();

    }

    function createNameCanvas(name, subject, details){

        return renderToCanvas(600, 600, function(ctx){
            ctx.strokeStyle="#fff";

            ctx.font = "bold 12pt Roboto";
            ctx.fillStyle = '#12b7a7';
            ctx.lineWidth = 0;
            ctx.fillText("NAME", 80, 20);

            ctx.font = "bold 30pt Roboto";
            ctx.fillStyle = '#eac7df';
            ctx.fillText(name.toUpperCase(), 78, 60);

            ctx.font = "bold 20pt Roboto";
            ctx.fillStyle = '#eac7df';
            ctx.fillText("SUBJECT: " + subject.toUpperCase(), 80, 100);

            for(var i = 0; i< details.length; i++){
                ctx.font = "bold 12pt Roboto";
                ctx.fillStyle = '#eac7df';
                ctx.fillText(details[i].toUpperCase(), 80, 140 + i*22);

            }

            ctx.strokeStyle='#12b7a7';
            ctx.lineWidth=2;
            ctx.beginPath();
            ctx.moveTo(68, 75);
            ctx.lineTo(68, 280);
            ctx.stroke();

            ctx.strokeStyle='#eac7df';
            ctx.lineWidth=2;

            for(var k = 1; k<13; k++){
                var dir = -1;
                if(k > 6){
                    dir = 1;
                }
                drawBullet(ctx, 10 + k * 14, dir);
            }

            ctx.beginPath();
            ctx.moveTo(0, 175);
            ctx.lineTo(34, 175);
            ctx.lineTo(42, 183);
            ctx.lineTo(70, 183);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(34, 175);
            ctx.lineTo(42, 167);
            ctx.lineTo(70, 167);
            ctx.stroke();

        });

    };

    function createScene(element, width, height){

        var container, scene, renderer, camera, clock;
        var VIEW_ANGLE, ASPECT, NEAR, FAR;

        var composer;
        var hblur, vblur;

        var postprocessing = { enabled : true };
        var projector = new THREE.Projector();
        var sunPosition = new THREE.Vector3( 0, 1000, -1000 );
        var screenSpacePosition = new THREE.Vector3();


        // var loader = new THREE.AssimpJSONLoader();
        var loader = new THREE.OBJLoader();



        VIEW_ANGLE = 45;
        ASPECT = width / height;
        NEAR = 1;
        FAR = 10000;

        container = (element[0]);
        clock = new THREE.Clock();

        scene = new THREE.Scene();


        renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});

        renderer.setSize(width, height);
        renderer.setClearColor( 0x000000, 0 ); 

        var canvas = renderer.domElement;

        container.appendChild(canvas);

        camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        camera.position.set(0, 0, 600);
        scene.add(camera);

        var nameCanvas1= createNameCanvas("Scanlon", "Robert Scanlon", ["Alias: \"ARSCAN\"", 
                                          "species: terran", 
                                          "origin: Boston, MA",
                                          "legs: 2",
                                          "arms: 2"
                                          ]);

        var nameTexture1 = new THREE.Texture(nameCanvas1)
        nameTexture1.needsUpdate = true;

        var nameCanvas2 = createNameCanvas("Scanlon", "Robert Scanlon", ["education", 
                                          "cornell: bs computer science", 
                                          "mit: Ms engineering & management", 
                                          "", 
                                          "Occupation",
                                          "software engineer",
                                          "web, data viz"]);

        var nameTexture2 = new THREE.Texture(nameCanvas2)
        nameTexture2.needsUpdate = true;

        /*
        var parameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, stencilBuffer: false };
        var renderTarget = new THREE.WebGLRenderTarget( width, height, parameters );

        composer = new THREE.EffectComposer( renderer, renderTarget );
        composer.addPass( new THREE.RenderPass( scene, camera ) );

        var bloomPass = new THREE.BloomPass(3, 25, 5, 256);
        composer.addPass(bloomPass);

        var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
        effectCopy.renderToScreen = true;
        composer.addPass(effectCopy);
       */

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

        var organMaterial = new THREE.ShaderMaterial({
            uniforms: Shaders.organs.uniforms,
            vertexShader: Shaders.organs.vertexShader,
            fragmentShader: Shaders.organs.fragmentShader,
            depthTest: false
        });


        skeletonMaterial.transparent = true;
        organMaterial.transparent = true;

        var nameBoxMaterial = new THREE.ShaderMaterial({
            uniforms: Shaders.nameBox.uniforms,
            vertexShader: Shaders.nameBox.vertexShader,
            fragmentShader: Shaders.nameBox.fragmentShader,
        });

        nameBoxMaterial.uniforms.name1.value = nameTexture1;
        nameBoxMaterial.transparent = true;

        loader.load( 'models/skeleton_and_organs.obj', function ( skeletonObject ) {

            skeletonObject.scale.x = skeletonObject.scale.y = skeletonObject.scale.z = 1.3;
            skeletonObject.updateMatrix();
            skeletonObject.rotation.y = Math.PI/2;
            skeletonObject.position.x = 160;
            skeletonObject.position.y = 50;
            skeletonObject.position.z = 50;

            skeletonObject.children[0].material = skeletonMaterial;
            skeletonObject.children[1].material = organMaterial;

            scene.add(skeletonObject);

            var planegeometry = new THREE.PlaneGeometry( 400, 400 );
            // var planematerial = new THREE.MeshBasicMaterial( {map: nameTexture, transparent: true} );

  
            var plane = new THREE.Mesh( planegeometry, nameBoxMaterial );
            plane.position.x = 100;
            plane.position.y = -100;
            plane.position.z = -530;
            scene.add( plane );

            var nameTween1 = new TWEEN.Tween(plane.position)
               .to({x: -50}, 3000);
            var nameTween2 = new TWEEN.Tween(plane.position)
                      .to({x: -10}, 5000)
                      .chain(nameTween1);

            nameTween1.chain(nameTween2);

            new TWEEN.Tween(plane.position)
                .easing( TWEEN.Easing.Cubic.Out )
                .to({x: 150, y: -150, z: -30}, 300)
                .chain(new TWEEN.Tween(plane.position)
                .easing( TWEEN.Easing.Cubic.In )
                .to({x: -20}, 500)
                .delay(6200)
                .onComplete(function(){
                    nameBoxMaterial.uniforms.name1.value = nameTexture2;
                    nameBoxMaterial.uniforms.textInStartTime.value = 7.0,
                    nameBoxMaterial.uniforms.textOutStartTime.value = 0.0
                    nameTween1.start();
                })).start();



            initPostprocessing();
            // requestAnimationFrame(render);
             render();
        } );

        function initPostprocessing() {
            // console.log(postprocessing);

            postprocessing.scene = new THREE.Scene();

            postprocessing.camera = new THREE.OrthographicCamera( width/ - 2, width/ 2,  height / 2, height / - 2, -10000, 10000 );
            postprocessing.camera.position.z = 100;

            postprocessing.scene.add( postprocessing.camera );

            postprocessing.maskTexture = THREE.ImageUtils.loadTexture('models/projectionmap.png');

            var pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat };
            postprocessing.rtTextureColors = new THREE.WebGLRenderTarget( width, height, pars );
            postprocessing.rtTextureBlur = new THREE.WebGLRenderTarget( width, height, pars );
            postprocessing.rtTextureBlur2 = new THREE.WebGLRenderTarget( width, height, pars );

            // Switching the depth formats to luminance from rgb doesn't seem to work. I didn't
            // investigate further for now.
            // pars.format = THREE.LuminanceFormat;

            // I would have this quarter size and use it as one of the ping-pong render
            // targets but the aliasing causes some temporal flickering

            // postprocessing.rtTextureDepth = new THREE.WebGLRenderTarget( width, height, pars );

            // Aggressive downsize god-ray ping-pong render targets to minimize cost

            var w = width / 2.0;
            var h = height / 2.0;
            postprocessing.rtTextureGodRays1 = new THREE.WebGLRenderTarget( w, h, pars );
            postprocessing.rtTextureGodRays2 = new THREE.WebGLRenderTarget( w, h, pars );

            // god-ray shaders

            var godraysGenShader = THREE.ShaderGodRays[ "godrays_generate" ];
            postprocessing.godrayGenUniforms = THREE.UniformsUtils.clone( godraysGenShader.uniforms );
            postprocessing.materialGodraysGenerate = new THREE.ShaderMaterial( {

                uniforms: postprocessing.godrayGenUniforms,
                vertexShader: godraysGenShader.vertexShader,
                fragmentShader: godraysGenShader.fragmentShader

            } );


            var godraysBlurV = THREE.ShaderGodRays[ "godrays_blur_v" ];
            postprocessing.godrayBlurVUniforms = THREE.UniformsUtils.clone( godraysBlurV.uniforms );

            postprocessing.materialGodraysBlurV = new THREE.ShaderMaterial( {

                uniforms: postprocessing.godrayBlurVUniforms,
                vertexShader: godraysBlurV.vertexShader,
                fragmentShader: godraysBlurV.fragmentShader

            } );

            var godraysBlurH = THREE.ShaderGodRays[ "godrays_blur_h" ];
            postprocessing.godrayBlurHUniforms = THREE.UniformsUtils.clone( godraysBlurH.uniforms );

            postprocessing.materialGodraysBlurH = new THREE.ShaderMaterial( {

                uniforms: postprocessing.godrayBlurHUniforms,
                vertexShader: godraysBlurH.vertexShader,
                fragmentShader: godraysBlurH.fragmentShader

            } );

            var godraysBlurV2 = THREE.VerticalBlurShader;
            postprocessing.godrayBlurV2Uniforms = THREE.UniformsUtils.clone( godraysBlurV2.uniforms );

            postprocessing.materialGodraysBlurV2 = new THREE.ShaderMaterial( {

                uniforms: postprocessing.godrayBlurV2Uniforms,
                vertexShader: godraysBlurV2.vertexShader,
                fragmentShader: godraysBlurV2.fragmentShader

            } );

            var godraysBlurH2 = THREE.HorizontalBlurShader;
            postprocessing.godrayBlurH2Uniforms = THREE.UniformsUtils.clone( godraysBlurH2.uniforms );

            postprocessing.materialGodraysBlurH2 = new THREE.ShaderMaterial( {

                uniforms: postprocessing.godrayBlurH2Uniforms,
                vertexShader: godraysBlurH2.vertexShader,
                fragmentShader: godraysBlurH2.fragmentShader

            } );

            var godraysCombineShader = THREE.ShaderGodRays[ "godrays_combine" ];
            postprocessing.godrayCombineUniforms = THREE.UniformsUtils.clone( godraysCombineShader.uniforms );
            postprocessing.materialGodraysCombine = new THREE.ShaderMaterial( {

                uniforms: postprocessing.godrayCombineUniforms,
                vertexShader: godraysCombineShader.vertexShader,
                fragmentShader: godraysCombineShader.fragmentShader

            } );

            var godraysCombineBlurShader = THREE.ShaderGodRays[ "godrays_combineblur" ];
            postprocessing.godrayCombineBlurUniforms = THREE.UniformsUtils.clone( godraysCombineBlurShader.uniforms );
            postprocessing.materialGodraysCombineBlur = new THREE.ShaderMaterial( {

                uniforms: postprocessing.godrayCombineBlurUniforms,
                vertexShader: godraysCombineBlurShader.vertexShader,
                fragmentShader: godraysCombineBlurShader.fragmentShader

            } );

            /*
               var godraysFakeSunShader = THREE.ShaderGodRays[ "godrays_fake_sun" ];
               postprocessing.godraysFakeSunUniforms = THREE.UniformsUtils.clone( godraysFakeSunShader.uniforms );
               postprocessing.materialGodraysFakeSun = new THREE.ShaderMaterial( {

uniforms: postprocessing.godraysFakeSunUniforms,
vertexShader: godraysFakeSunShader.vertexShader,
fragmentShader: godraysFakeSunShader.fragmentShader

} );

postprocessing.godraysFakeSunUniforms.bgColor.value.setHex( bgColor );
postprocessing.godraysFakeSunUniforms.sunColor.value.setHex( sunColor );
*/

            postprocessing.godrayCombineUniforms.fGodRayIntensity.value = 1.0;

            postprocessing.quad = new THREE.Mesh( new THREE.PlaneGeometry( width, height ), postprocessing.materialGodraysGenerate );
            postprocessing.quad.position.z = -9900;
            postprocessing.scene.add( postprocessing.quad );

        }

        function render() {
            // console.log(postprocessing);
            var time = clock.getElapsedTime();
            // console.log(time);
            scene.children[1].rotation.y -= 0.005;

            TWEEN.update();

            Shaders.skeleton.uniforms.currentTime.value = time - 5;
            Shaders.organs.uniforms.currentTime.value = time - 7;
            Shaders.nameBox.uniforms.currentTime.value = time;

            if ( postprocessing.enabled ) {

                // Find the screenspace position of the sun

                // screenSpacePosition.copy( sunPosition );
                // projector.projectVector( screenSpacePosition, camera );

                // screenSpacePosition.x = ( screenSpacePosition.x + 1 ) / 2;
                // screenSpacePosition.y = ( screenSpacePosition.y + 1 ) / 2;

                screenSpacePosition.x = -0.1;
                screenSpacePosition.y = -0.05;

                // Give it to the god-ray and sun shaders

                postprocessing.godrayGenUniforms[ "vSunPositionScreenSpace" ].value.x = screenSpacePosition.x;
                postprocessing.godrayGenUniforms[ "vSunPositionScreenSpace" ].value.y = screenSpacePosition.y;

                // postprocessing.godraysFakeSunUniforms[ "vSunPositionScreenSpace" ].value.x = screenSpacePosition.x;
                // postprocessing.godraysFakeSunUniforms[ "vSunPositionScreenSpace" ].value.y = screenSpacePosition.y;

                // -- Draw sky and sun --

                // Clear colors and depths, will clear to sky color

                // renderer.clearTarget( postprocessing.rtTextureColors, true, true, false );

                // Sun render. Runs a shader that gives a brightness based on the screen
                // space distance to the sun. Not very efficient, so i make a scissor
                // rectangle around the suns position to avoid rendering surrounding pixels.

                // var sunsqH = 0.74 * height; // 0.74 depends on extent of sun from shader
                // var sunsqW = 0.74 * height; // both depend on height because sun is aspect-corrected

                screenSpacePosition.x = 0;;
                screenSpacePosition.y = 0;

                // renderer.setScissor( screenSpacePosition.x - sunsqW / 2, screenSpacePosition.y - sunsqH / 2, sunsqW, sunsqH );
                // renderer.enableScissorTest( true );

                // postprocessing.godraysFakeSunUniforms[ "fAspect" ].value = window.innerWidth / height;

                // postprocessing.scene.overrideMaterial = postprocessing.materialGodraysFakeSun;
                // renderer.render( postprocessing.scene, postprocessing.camera, postprocessing.rtTextureColors );


                // renderer.enableScissorTest( false );

                // -- Draw scene objects --

                // Colors

                scene.overrideMaterial = null;
                renderer.render( scene, camera, postprocessing.rtTextureColors );

                // Depth


                // scene.overrideMaterial = materialDepth;//skeletonMaterial; //materialDepth;
                // renderer.render( scene, camera, postprocessing.rtTextureDepth, true );

                // -- Render god-rays --

                // Maximum length of god-rays (in texture space [0,1]X[0,1])

                var filterLen = 1.0;

                // Samples taken by filter

                var TAPS_PER_PASS = 6.0;

                // Pass order could equivalently be 3,2,1 (instead of 1,2,3), which
                // would start with a small filter support and grow to large. however
                // the large-to-small order produces less objectionable aliasing artifacts that
                // appear as a glimmer along the length of the beams

                // pass 1 - render into first ping-pong target

                var pass = 1.0;
                var stepLen = filterLen * Math.pow( TAPS_PER_PASS, -pass );

                postprocessing.godrayGenUniforms[ "fStepSize" ].value = stepLen;
                postprocessing.godrayGenUniforms[ "tInput" ].value = postprocessing.rtTextureColors;

                postprocessing.scene.overrideMaterial = postprocessing.materialGodraysGenerate;

                renderer.render( postprocessing.scene, postprocessing.camera, postprocessing.rtTextureGodRays2 );



                // postprocessing.godrayBlurV2Uniforms[ "tDiffuse" ].value = postprocessing.rtTextureBlur2; // rob changed from depth
                // postprocessing.godrayBlurV2Uniforms[ "v" ].value = 800.0; // rob changed from depth
                // postprocessing.scene.overrideMaterial = postprocessing.materialGodraysBlurV2;
                // renderer.render( postprocessing.scene, postprocessing.camera, postprocessing.rtTextureBlur);

                // postprocessing.godrayBlurH2Uniforms[ "tDiffuse" ].value = postprocessing.rtTextureBlur; // rob changed from depth
                // postprocessing.godrayBlurH2Uniforms[ "h" ].value = 800.0; // rob changed from depth
                //  postprocessing.scene.overrideMaterial = postprocessing.materialGodraysBlurH2;
                // renderer.render( postprocessing.scene, postprocessing.camera, postprocessing.rtTextureBlur2);


                // postprocessing.godrayGenUniforms[ "fStepSize" ].value = stepLen;
                // postprocessing.godrayGenUniforms[ "tInput" ].value = postprocessing.rtTextureGodRay; // rob changed from depth
                // postprocessing.scene.overrideMaterial = postprocessing.materialGodraysGenerate;
                // renderer.render( postprocessing.scene, postprocessing.camera, postprocessing.rtTextureGodRays2 );


                // pass 2 - render into second ping-pong target
                //
                postprocessing.scene.overrideMaterial = postprocessing.materialGodraysGenerate;

                pass = 2.0;
                stepLen = filterLen * Math.pow( TAPS_PER_PASS, -pass );

                postprocessing.godrayGenUniforms[ "fStepSize" ].value = stepLen;
                postprocessing.godrayGenUniforms[ "tInput" ].value = postprocessing.rtTextureGodRays2;

                renderer.render( postprocessing.scene, postprocessing.camera, postprocessing.rtTextureGodRays1  );

                // pass 3 - 1st RT

                pass = 3.0;
                stepLen = filterLen * Math.pow( TAPS_PER_PASS, -pass );

                postprocessing.godrayGenUniforms[ "fStepSize" ].value = stepLen;
                postprocessing.godrayGenUniforms[ "tInput" ].value = postprocessing.rtTextureGodRays1;

                renderer.render( postprocessing.scene, postprocessing.camera , postprocessing.rtTextureGodRays2  );

                // final pass - composite god-rays onto colors

                postprocessing.godrayCombineUniforms["tColors"].value = postprocessing.rtTextureColors;
                postprocessing.godrayCombineUniforms["tGodRays"].value = postprocessing.rtTextureGodRays2;
                postprocessing.godrayCombineUniforms["tMask"].value = postprocessing.maskTexture;
                postprocessing.godrayCombineUniforms["fTick"].value = time;
                postprocessing.scene.overrideMaterial = postprocessing.materialGodraysCombine;
                renderer.render( postprocessing.scene, postprocessing.camera, postprocessing.rtTextureGodRays1 );

                // postprocessing.godrayGenUniforms[ "fStepSize" ].value = stepLen;
                // postprocessing.godrayGenUniforms[ "tInput" ].value = postprocessing.rtTextureGodRays; // rob changed from depth
                // postprocessing.scene.overrideMaterial = postprocessing.materialGodraysGenerate;
                // renderer.render( postprocessing.scene, postprocessing.camera, postprocessing.rtTextureGodRays2 );

                postprocessing.godrayBlurVUniforms[ "RTScene" ].value = postprocessing.rtTextureGodRays1; // rob changed from depth
                postprocessing.scene.overrideMaterial = postprocessing.materialGodraysBlurV;
                renderer.render( postprocessing.scene, postprocessing.camera, postprocessing.rtTextureBlur);

                postprocessing.godrayBlurHUniforms[ "RTScene" ].value = postprocessing.rtTextureBlur; // rob changed from depth
                 postprocessing.scene.overrideMaterial = postprocessing.materialGodraysBlurH;
                renderer.render( postprocessing.scene, postprocessing.camera, postprocessing.rtTextureBlur2);

                postprocessing.godrayBlurVUniforms[ "RTScene" ].value = postprocessing.rtTextureBlur2; // rob changed from depth
                postprocessing.scene.overrideMaterial = postprocessing.materialGodraysBlurV;
                renderer.render( postprocessing.scene, postprocessing.camera, postprocessing.rtTextureBlur);

                postprocessing.godrayBlurHUniforms[ "RTScene" ].value = postprocessing.rtTextureBlur; // rob changed from depth
                 postprocessing.scene.overrideMaterial = postprocessing.materialGodraysBlurH;
                renderer.render( postprocessing.scene, postprocessing.camera, postprocessing.rtTextureBlur2);

                postprocessing.godrayBlurVUniforms[ "RTScene" ].value = postprocessing.rtTextureBlur2; // rob changed from depth
                postprocessing.scene.overrideMaterial = postprocessing.materialGodraysBlurV;
                renderer.render( postprocessing.scene, postprocessing.camera, postprocessing.rtTextureBlur);

                postprocessing.godrayBlurHUniforms[ "RTScene" ].value = postprocessing.rtTextureBlur; // rob changed from depth
                 postprocessing.scene.overrideMaterial = postprocessing.materialGodraysBlurH;
                renderer.render( postprocessing.scene, postprocessing.camera, postprocessing.rtTextureBlur2);

                postprocessing.godrayBlurVUniforms[ "RTScene" ].value = postprocessing.rtTextureBlur2; // rob changed from depth
                postprocessing.scene.overrideMaterial = postprocessing.materialGodraysBlurV;
                renderer.render( postprocessing.scene, postprocessing.camera, postprocessing.rtTextureBlur);

                postprocessing.godrayBlurHUniforms[ "RTScene" ].value = postprocessing.rtTextureBlur; // rob changed from depth
                 postprocessing.scene.overrideMaterial = postprocessing.materialGodraysBlurH;
                renderer.render( postprocessing.scene, postprocessing.camera, postprocessing.rtTextureBlur2);

                postprocessing.godrayBlurVUniforms[ "RTScene" ].value = postprocessing.rtTextureBlur2; // rob changed from depth
                postprocessing.scene.overrideMaterial = postprocessing.materialGodraysBlurV;
                renderer.render( postprocessing.scene, postprocessing.camera, postprocessing.rtTextureBlur);

                postprocessing.godrayBlurHUniforms[ "RTScene" ].value = postprocessing.rtTextureBlur; // rob changed from depth
                 postprocessing.scene.overrideMaterial = postprocessing.materialGodraysBlurH;
                renderer.render( postprocessing.scene, postprocessing.camera, postprocessing.rtTextureBlur2);

                postprocessing.godrayCombineBlurUniforms["tColors"].value = postprocessing.rtTextureColors;
                postprocessing.godrayCombineBlurUniforms["tGodRays"].value = postprocessing.rtTextureGodRays1;
                postprocessing.godrayCombineBlurUniforms["tBlur"].value = postprocessing.rtTextureBlur2;
                postprocessing.scene.overrideMaterial = postprocessing.materialGodraysCombineBlur;
                renderer.render( postprocessing.scene, postprocessing.camera);


                // renderer.render( postprocessing.scene, postprocessing.camera );
                // postprocessing.scene.overrideMaterial = null;

            } else {

                renderer.clear();
                renderer.render( scene, camera );

            }


            // composer.render(scene, camera);
            requestAnimationFrame(render);
        }



        return { canvas: $(canvas)};
    }

    angular.module('lineupApp')
    .directive('mySkeleton', function () {
        return {
            // template: '<div style="position: absolute; width: 500; height: 0; bottom: 320px; left: 400px; overflow: hidden;" class="skeleton"></div>',
            template: '<div style="position: absolute;  overflow: hidden; width: 100%; height: 100%;" class="skeleton"></div>',
            restrict: 'E',
            link: function postLink(scope, element, attrs) {
                var width = attrs.width || 350,
                height = attrs.height || 350,
                delay = attrs.delay || 0,
                skeletonDiv = $('.skeleton', element);

                setTimeout(function(){
                    var threeD = createScene($('.skeleton', element), width, height);

                    threeD.canvas.css({
                        position: 'absolute',
                        // top: height * -1,
                        // border: '1px solid #fff',
                        width: width,
                        bottom:-10,
                        left: -20,
                        height: height
                        // '-webkit-filter': 'blur(1px)'

                    });


                    // skeletonDiv.velocity({height: height}, {duration:  3000, delay: delay});
                    // skeletonCanvas.velocity({top: 0}, {duration: 3000, delay: delay});
                }, 50);

            }
        };
    });

})(angular, THREE);
