function createLoadingPanel(renderer, scale){

   var STANDARD_DIMENSIONS = {width: 400, height:400},
       ROTATE_TIME = 10.0;


   var width = STANDARD_DIMENSIONS.width * scale,
       height = STANDARD_DIMENSIONS.height * scale,
       donutImages = [
           'images/loading-donut4.png',
           'images/loading-donut3.png',
           'images/loading-donut2.png',
           'images/loading-donut1.png'
               ];

var    donutMaterials = [],
       textureIndex = 0,
       lastTextStartTime = 0;

   var panel = createPanel(renderer, width, height, {foregroundGlow: true});

   var donutShader =  {
       uniforms : {
           tDiffuse: {type: 't'},
           currentTime: {type: 'f', value: 0.0},
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
           'uniform sampler2D tDiffuse;',

           'void main() {',
           '  gl_FragColor = texture2D(tDiffuse, vUv);',

           /*'  float bulletPercent = clamp((currentTime - bulletStartTime) / bulletDuration, 0.0, 1.0);',
           '  float textInPercent = clamp((currentTime - textInStartTime) / textInDuration, 0.0, 1.0);',
           '  float textOutPercent = clamp((currentTime - textOutStartTime) / textOutDuration, 0.0, 1.0);',
           '  float headerInPercent = clamp((currentTime - headerInStartTime) / headerInDuration, 0.0, 1.0);',
           '  float floorNum = floor(textInPercent * 10.0);',
           '  float myFloorNum = floor((textStart - vUv.y)/lineHeight);',
           '  if(vUv.x < .18 && abs(vUv.y - mid)*4.0 > bulletPercent ){',
           '    gl_FragColor.a = 0.0;',
           '  }',
           '  if(textInStartTime > 0.0 && vUv.x > .18 && vUv.y < textStart && vUv.x > (textInPercent - myFloorNum * .04 + .10 )){',
           '    gl_FragColor.a = 0.0;',
           '  }',
           '  if(textOutStartTime > 0.0 && vUv.x > .18 && vUv.y < textStart && vUv.x > (1.0-textOutPercent)){',
           '    gl_FragColor.a = 0.0;',
           '  }',
           '  if(headerInStartTime > 0.0 && vUv.x > .15 && vUv.y > textStart && vUv.y < textStart + .1 && vUv.x > headerInPercent){',
           '    gl_FragColor.a = 0.0;',
           '  }',*/
           // '  gl_FragColor.a = 1.0;',
           '}',
       ].join('\n')
    };

    function createBackground(){
        var backgroundTexture = THREE.ImageUtils.loadTexture("images/loading-background.png", undefined, LOADSYNC.register() );
        var backgroundMaterial = new THREE.MeshBasicMaterial( {map: backgroundTexture, transparent: true } );
        var backgroundGeometry = new THREE.PlaneGeometry( 400 * scale, 400 * scale);
        var backgroundPlane = new THREE.Mesh( backgroundGeometry, backgroundMaterial );
        backgroundPlane.position.set(width/2, height/2, 0);
        panel.addToScene( backgroundPlane );
        console.log(panel);

    }

    function createDonut(filename){

        var geometry = new THREE.PlaneBufferGeometry( 400 * scale, 400 * scale );
        var material = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.clone(donutShader.uniforms),
            vertexShader: donutShader.vertexShader,
            fragmentShader: donutShader.fragmentShader,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthTest: true,
            opacity: .3
        });
        material.uniforms.tDiffuse.value = THREE.ImageUtils.loadTexture(filename, undefined, LOADSYNC.register() );
        material.transparent = true;
        donutMaterials.push(material);
        var plane = new THREE.Mesh( geometry, material );
        plane.position.set(height/2, width/2, 1);
        panel.addToScene( plane );

    }

    function init(){

        // load images

        createBackground();

        donutImages.forEach(function(url){
            console.log(url);
            createDonut(url);
        });

        console.log("GOT IT");




    }

    function render(time){

        /*
        if(lastTextStartTime + ROTATE_TIME < time){
           lastTextStartTime = time;
           textureIndex = (textureIndex + 1) % textures.length;

           nameBoxMaterial.uniforms.tDiffuse.value = textures[textureIndex];
           nameBoxMaterial.uniforms.textInStartTime.value = time;
           nameBoxMaterial.uniforms.textOutStartTime.value = time + ROTATE_TIME-2;
        }

        nameBoxShader.uniforms.currentTime.value = time -1;
        */
        panel.render(time);
    }

    init();

    return Object.freeze({
        toString: function(){return "NamePanel"},
        render: render,
        width: width,
        height: height,
        renderTarget: panel.renderTarget,
        quad: panel.quad,
        checkBounds: panel.checkBounds,
        setBlur: panel.setBlur,
        setPosition: panel.setPosition,
        setDeltaPosition: panel.setDeltaPosition
    });
}

