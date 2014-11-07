function createNamePanel(renderer, width, height, x, y){

   var renderScene,
       renderComposer,
       renderCamera,
       clock,
       mainComposer,
       blurComposer,
       glowComposer;

   var targetParams = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat};
   var renderTarget = new THREE.WebGLRenderTarget(width, height, targetParams);
   var quad = new THREE.Mesh( new THREE.PlaneBufferGeometry(width, height), new THREE.MeshBasicMaterial({map: renderTarget, transparent: true}));

   quad.material.blending = THREE.AdditiveBlending;
   quad.position.set(x, y, 0);

   var nameBoxShader =  {
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
           '  float mid = 0.61;',
           '  float textStart = 0.76;',

           '  float lineHeight = 0.036;',
           '  gl_FragColor = texture2D(name1, vUv);',
           // '  float bulletPercent = bulletEndTime;',
           '  float bulletPercent = clamp((currentTime - bulletStartTime) / bulletDuration, 0.0, 1.0);',
           '  float textInPercent = clamp((currentTime - textInStartTime) / textInDuration, 0.0, 1.0);',
           '  float textOutPercent = clamp((currentTime - textOutStartTime) / textOutDuration, 0.0, 1.0);',
           '  float headerInPercent = clamp((currentTime - headerInStartTime) / headerInDuration, 0.0, 1.0);',
           '  float floorNum = floor(textInPercent * 10.0);',
           '  float myFloorNum = floor((textStart - vUv.y)/lineHeight);',
           '  if(vUv.x < .15 && abs(vUv.y - mid)*4.0 > bulletPercent ){',
           '    gl_FragColor.a = 0.0;',
           '  }',
           '  if(textInStartTime > 0.0 && vUv.x > .15 && vUv.y < textStart && vUv.x > (textInPercent - myFloorNum * .12 + .10 )){',
           '    gl_FragColor.a = 0.0;',
           '  }',
           '  if(textOutStartTime > 0.0 && vUv.x > .15 && vUv.y < textStart && vUv.x > 1.0-textOutPercent){',
           '    gl_FragColor.a = 0.0;',
           '  }',
           '  if(headerInStartTime > 0.0 && vUv.x > .15 && vUv.y > textStart && vUv.y < textStart + .1 && vUv.x > headerInPercent){',
           '    gl_FragColor.a = 0.0;',
           '  }',
           '}',
       ].join('\n')
   };


    var BLURINESS = 3.9;


    function renderToCanvas(width, height, renderFunction) {
        var buffer = document.createElement('canvas');
        buffer.width = width;
        buffer.height = height;

        // $(".container").append(buffer);

        renderFunction(buffer.getContext('2d'));

        return buffer;
    };

    function drawBullet(ctx, yStart, dir, smallBox, drawLine){ 
        yStart = yStart + 75;
        var xEnd = 65;
        if(smallBox){
           xEnd = 58;
        }
        ctx.beginPath();
        if(drawLine){
            ctx.moveTo(22, yStart);
            ctx.lineTo(34, yStart + dir * 12);
            ctx.lineTo(42, yStart + dir * 12);
        } else {
            ctx.moveTo(42, yStart + dir * 12);
        }
        ctx.lineTo(42, yStart + dir * 12 + 2);
        ctx.lineTo(xEnd, yStart + dir * 12 + 2);
        ctx.lineTo(xEnd, yStart + dir * 12 - 2);
        ctx.lineTo(42, yStart + dir * 12 - 2);
        ctx.lineTo(42, yStart + dir * 12);
        ctx.stroke();
        ctx.beginPath();
        if(drawLine){
            ctx.fillStyle='#eac7df';
            ctx.arc(22, yStart, 1.5, 0, 2 * Math.PI);
        }
        ctx.fill();
    }

    function createNameCanvas(name, subject, details){

        return renderToCanvas(512, 512, function(ctx){
            ctx.strokeStyle="#fff";

            ctx.font = "bold 12pt Roboto";
            ctx.fillStyle = '#12b7a7';
            ctx.lineWidth = 0;
            ctx.fillText("NAME", 80, 20);

            ctx.font = "30pt Roboto";
            ctx.fillStyle = '#eac7df';
            ctx.fillText(name.toUpperCase(), 78, 60);

            ctx.font = "14pt Roboto";
            ctx.fillStyle = '#eac7df';
            ctx.fillText("SUBJECT: " + subject.toUpperCase(), 80, 100);

            for(var i = 0; i< details.length; i++){
                ctx.font = "11pt Roboto";
                ctx.fillStyle = '#eac7df';
                ctx.fillText(details[i].toUpperCase(), 76, 138 + i*18);

            }

            ctx.strokeStyle='#12b7a7';
            ctx.lineWidth=2;
            ctx.beginPath();
            ctx.moveTo(68, 75);
            ctx.lineTo(68, 280);
            ctx.stroke();

            ctx.strokeStyle='#eac7df';
            ctx.lineWidth=1.2;
            ctx.fillStyle = 'rgba(234,199,223,0.3)';

            for(var k = 1; k<13; k++){
                var dir = -1;
                if(k > 6){
                    dir = 1;
                }
                drawBullet(ctx, 18 + k * 12, dir, (k === 11), (k!==12));
            }

            ctx.beginPath();
            ctx.fillStyle='#eac7df';
            ctx.arc(2, 172, 1.5, 0, 2 * Math.PI);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(2, 172);
            ctx.lineTo(28, 172);
            ctx.lineTo(34, 178);
            ctx.lineTo(42, 178);
            ctx.lineTo(42, 180);
            ctx.lineTo(58, 180);
            ctx.lineTo(58, 176);
            ctx.lineTo(42, 176);
            ctx.lineTo(42, 178);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(28, 172);
            ctx.lineTo(34, 166);
            ctx.lineTo(42, 166);
            ctx.lineTo(42, 168);
            ctx.lineTo(65, 168);
            ctx.lineTo(65, 164);
            ctx.lineTo(42, 164);
            ctx.lineTo(42, 166);
            ctx.stroke();

        });

    };

    function createRenderTarget(width, height){
        var params = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat};
        return new THREE.WebGLRenderTarget(width, height, params);
    }

    function init(){
        clock = new THREE.Clock();

        renderCamera = new THREE.PerspectiveCamera( 70, width / height, 1, 1000 );
        renderCamera.position.set(0, 50, 120);
        renderScene = new THREE.Scene();

        var nameCanvas1= createNameCanvas("Scanlon", "Rob Scanlon hasdfasdfasdfasdf", ["Alias: \"ARSCAN\"", 
                                          "species: terran", 
                                          "origin: Boston, MA",
                                          "legs: 2",
                                          "arms: 2"
        ]);

        var nameTexture1 = new THREE.Texture(nameCanvas1)
        nameTexture1.needsUpdate = true;

        var nameCanvas2 = createNameCanvas("Scanlon", "Rob Scanlon", ["education", 
                                           "something", 
                                           "something else something", 
                                           "", 
                                           "Occupation",
                                           "software engineer",
                                           "something something something"]);

        var nameTexture2 = new THREE.Texture(nameCanvas2)
        nameTexture2.needsUpdate = true;

        var nameBoxMaterial = new THREE.ShaderMaterial({
            uniforms: nameBoxShader.uniforms,
            vertexShader: nameBoxShader.vertexShader,
            fragmentShader: nameBoxShader.fragmentShader,
        });


        nameBoxMaterial.uniforms.name1.value = nameTexture1;
        nameBoxMaterial.transparent = true;
        var planegeometry = new THREE.PlaneBufferGeometry( width, height );
        // var planematerial = new THREE.MeshBasicMaterial( {map: nameTexture, transparent: true} );


        var plane = new THREE.Mesh( planegeometry, nameBoxMaterial );
        plane.position.set(50, 0, 0);
        renderScene.add( plane );

        setTimeout(function(){
           nameBoxMaterial.uniforms.name1.value = nameTexture2;
           nameBoxMaterial.uniforms.textInStartTime.value = 7.0,
           nameBoxMaterial.uniforms.textOutStartTime.value = 0.0
        }, 7500);


        renderComposer = new THREE.EffectComposer(renderer, createRenderTarget(width, height));
        renderComposer.addPass(new THREE.RenderPass(renderScene, renderCamera));

        var renderScenePass = new THREE.TexturePass(renderComposer.renderTarget2);

        blurComposer = new THREE.EffectComposer(renderer, createRenderTarget(width/4, height/4));
        blurComposer.addPass(renderScenePass);
        blurComposer.addPass(new THREE.ShaderPass(THREE.HorizontalBlurShader, {h: BLURINESS / (width/4)}));
        blurComposer.addPass(new THREE.ShaderPass(THREE.VerticalBlurShader, {v: BLURINESS / (height/4)}));
        blurComposer.addPass(new THREE.ShaderPass(THREE.HorizontalBlurShader, {h: (BLURINESS/4) / (width/4)}));
        blurComposer.addPass(new THREE.ShaderPass(THREE.VerticalBlurShader, {v: (BLURINESS/4) / (height/4)}));

        mainComposer = new THREE.EffectComposer(renderer, renderTarget);
        mainComposer.addPass(renderScenePass);

        glowComposer = new THREE.EffectComposer(renderer, createRenderTarget(width, height));
        glowComposer.addPass(renderScenePass);

        glowComposer.addPass(new THREE.ShaderPass( THREE.HorizontalBlurShader, {h: 2/width} ));
        glowComposer.addPass(new THREE.ShaderPass(THREE.VerticalBlurShader, {v: 2/height}));
        glowComposer.addPass(new THREE.ShaderPass( THREE.HorizontalBlurShader, {h: 1/width} ));
        glowComposer.addPass(new THREE.ShaderPass(THREE.VerticalBlurShader, {v: 1/height}));

        var addPass2 = new THREE.ShaderPass(THREE.AdditiveBlendShader);
        addPass2.uniforms['tAdd'].value = glowComposer.writeBuffer;
        mainComposer.addPass(addPass2);

    }

    function render(){
        // renderer.render(mainScene, camera);
        var time = clock.getElapsedTime();

        if(renderScene.children.length > 1){
            renderScene.children[1].rotation.y -= .005;
        }


        nameBoxShader.uniforms.currentTime.value = time -1;
        renderComposer.render();

        blurComposer.render();
        blurComposer.render();
        glowComposer.render();

        mainComposer.render();

    }

    function checkBounds(x, y){
        return (x > quad.position.x - width / 2 && x < quad.position.x + width/2) 
               && (y > quad.position.y - height / 2 && y < quad.position.y + height/2);
    }

    init();

    return Object.freeze({
        toString: function(){return "NamePanel"},
        render: render,
        renderTarget: renderTarget,
        width: width,
        height: height,
        quad: quad,
        checkBounds: checkBounds,
        setBlur: function(){ }
    });
}

