function createSkeletonPanel(renderer, scale){

   var STANDARD_DIMENSIONS = {width: 170, height:300};

   var width = STANDARD_DIMENSIONS.width * scale,
       height = STANDARD_DIMENSIONS.height * scale;
    
   var panel = createPanel(renderer, width, height, {fxaa: true, foregroundGlow: true});

   var skeleton = null;

    var Shaders = {
        skeleton: {
            uniforms : {
                currentTime: {type: 'f', value: 100.0},
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
                '    float intensity = 1.1 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );',
                '    vec3 outline = vec3( 0.0708, 0.714, 0.652 ) * pow( intensity, 1.0 );',
                '    gl_FragColor = vec4(outline, intensity);',
                ' } ',
                '}'
            ].join('\n')
        },
        organs: {
            uniforms : {
                currentTime: {type: 'f', value: 100.0},
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
                '    float intensity = 1.3 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );',
                '    vec3 outline = vec3( 0.5708, 0.314, 0.252 ) * pow( intensity, 1.0 );',
                '    gl_FragColor = vec4(outline, intensity);',
                ' } ',
                '}'
            ].join('\n')
        }
    };


    function init(){

        var loader = new THREE.OBJLoader();

        var skeletonMaterial = new THREE.ShaderMaterial({
            uniforms: Shaders.skeleton.uniforms,
            vertexShader: Shaders.skeleton.vertexShader,
            fragmentShader: Shaders.skeleton.fragmentShader,
            shading: THREE.SmoothShading,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthTest: false
        });

        var organMaterial = new THREE.ShaderMaterial({
            uniforms: Shaders.organs.uniforms,
            vertexShader: Shaders.organs.vertexShader,
            fragmentShader: Shaders.organs.fragmentShader,
            shading: THREE.SmoothShading,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthTest: false
        });


        loader.load( 'models/skeleton.obj', LOADSYNC.register(function ( skeletonObject ) {

            skeletonObject.children[0].geometry.mergeVertices();
            skeletonObject.children[0].geometry.computeVertexNormals();
            skeletonObject.children[0].scale.set(scale * 1.25, scale * 1.25, scale * 1.25);
            skeletonObject.children[1].geometry.computeVertexNormals();
            skeletonObject.children[1].scale.set(scale * 1.25, scale * 1.25, scale * 1.25);

            skeletonObject.children[0].material = skeletonMaterial;
            skeletonObject.children[1].material = organMaterial;

            skeletonObject.position.set(width/2, 10 * scale, 0);

            skeleton = skeletonObject;
            panel.addToScene(skeletonObject);

        }));

        var backdropGeometry = new THREE.PlaneGeometry( 1000, 1000);
        var backdropMaterial = new THREE.MeshBasicMaterial( {color: 0x000000} );
        var plane = new THREE.Mesh( backdropGeometry, backdropMaterial );
        plane.position.set(0, 0, -100);
        panel.addToScene( plane );

    }

    function render(time, mouseX){

        if(skeleton){
            skeleton.rotation.y = -time/2; // + mouseX;
        }
        Shaders.skeleton.uniforms.currentTime.value = time -6;
        Shaders.organs.uniforms.currentTime.value = time -7;
        panel.render(time);

    }

    init();

    return Object.freeze({
        toString: function(){return "SkeletonPanel";},
        render: render,
        renderTarget: panel.renderTarget,
        width: width,
        height: height,
        quad: panel.quad,
        setBlur: panel.setBlur,
        checkBounds: panel.checkBounds,
        setBlur: panel.setBlur,
        setPosition: panel.setPosition
    });
}

