function createLoadingPanel(renderer, scale){

   var STANDARD_DIMENSIONS = {width: 400, height:400},
       ROTATE_TIME = 10.0,
       clock = new THREE.Clock(false);


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
       lastTextStartTime = 0,
       percent = 0,
       started = false,
       particleGroup,
       particles = [],
       percentComplete = 0,
       currentTween = null;

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
           '#define PI 3.141592653589793238462643',
           'varying vec2 vUv;',
           'uniform float currentTime;',
           'uniform sampler2D tDiffuse;',

           'void main() {',
           '  float radians = 2.0 * currentTime * PI;', 
           '  gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);',


           '  if(vUv.x - .5 > 0.0){',
           '    if(currentTime > .5 || ((vUv.y - .5) / (vUv.x - .5) > cos(radians) / sin(radians))){',
           '      gl_FragColor = texture2D(tDiffuse, vUv);',
           '    }',
           '  }',
           '  if(vUv.x - .5 < 0.0 && currentTime > .5){',
           '    if(currentTime >= 1.0 || ((vUv.y - .5) / (vUv.x - .5) > cos(radians) / sin(radians))){',
           '      gl_FragColor = texture2D(tDiffuse, vUv);',
           '    }',
           '  }',
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

    }

    function createCircles(){
        var backgroundTexture = THREE.ImageUtils.loadTexture("images/loading-circles.png", undefined, LOADSYNC.register() );
        var backgroundMaterial = new THREE.MeshBasicMaterial( {map: backgroundTexture, transparent: true, color: 0xff8d07 } );
        var backgroundGeometry = new THREE.PlaneGeometry( 400 * scale, 400 * scale);
        var backgroundPlane = new THREE.Mesh( backgroundGeometry, backgroundMaterial );
        backgroundPlane.position.set(width/2, height/2, 0);
        panel.addToScene( backgroundPlane );

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
        plane.position.set(height/2, width/2, 10);
        panel.addToScene( plane );

    }

   function createPointCloud(){

       if(!particleGroup){
           particleGroup = new THREE.Group();
           particleGroup.applyMatrix( new THREE.Matrix4().makeTranslation( 200*scale, 200*scale, 0 ) );
           panel.addToScene(particleGroup);
       }

       var geometry = new THREE.Geometry();
       var sprite = THREE.ImageUtils.loadTexture( "images/links-particles.png", undefined, LOADSYNC.register() );

       for(var i = 0; i< 250; i+=1){
           var d = Math.random() * Math.PI * 2;
           var l = Math.random() * 100 * scale + 100 * scale;
           geometry.vertices.push( new THREE.Vector3(l*Math.cos(d), l*Math.sin(d), 5) );
       }
       // for (var  i = 0; i < 400; i+=30  ) {
       //     for(var j = 0; j< 400; j+=30){

       //         geometry.vertices.push( new THREE.Vector3(i, 100, 5) );
       //     }
       // }

       var material = new THREE.PointCloudMaterial( { opacity: 1, size: 5 * scale, map: sprite, transparent: true, blending:THREE.AdditiveBlending, color: 0xff8d07/*0x10b0a0*/, sizeAttenuation: false } );


       particles.push(new THREE.PointCloud( geometry, material ));
       particleGroup.add(particles[particles.length-1]);

   }

    function init(){


        // load images

        createBackground();
        createCircles();
        for(var i =0; i< 5; i++){
            createPointCloud();
        }


        donutImages.forEach(function(url){
            createDonut(url);
        });


    }

    function setPercent(percent){
        if(currentTween){
            currentTween.stop();
        }
        currentTween = new TWEEN.Tween({percent: percentComplete})
            .to({percent: percent}, 2000)
            .onUpdate(function(){
                percentComplete = this.percent;
            }).start();

    }

    function render(time){

        if(!started){
            clock.start();

            started = true;
        }
        time = clock.getElapsedTime();
        donutMaterials.forEach(function(donut, index){
            donut.uniforms.currentTime.value = percentComplete;
        });

        if(particleGroup){
            particles.forEach(function(particles, index){
                particles.rotation.z = -time * (.5 + index/10);
            });
        }

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
        setDeltaPosition: panel.setDeltaPosition,
        setPercent: setPercent

    });
}

