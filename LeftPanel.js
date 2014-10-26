function createLeftPanel(renderer, renderTarget){

   var renderScene,
       renderComposer,
       renderCamera,
       clock,
       mainComposer,
       projectorComposer,
       blurComposer,
       glowComposer;

       var canvasWidth = renderTarget.width;
       var canvasHeight = renderTarget.height;



    var BLURINESS = 3.9;


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
        ctx.fillRect(48, yStart+dir *16, 22, 6);
        ctx.stroke();

    }

    function createNameCanvas(name, subject, details){

        return renderToCanvas(512, 512, function(ctx){
            ctx.strokeStyle="#fff";

            ctx.font = "bold 12pt Roboto";
            ctx.fillStyle = '#12b7a7';
            ctx.lineWidth = 0;
            ctx.fillText("NAME", 80, 20);

            ctx.font = "bold 30pt Roboto";
            ctx.fillStyle = '#eac7df';
            ctx.fillText(name.toUpperCase(), 78, 60);

            ctx.font = "bold 14pt Roboto";
            ctx.fillStyle = '#eac7df';
            ctx.fillText("SUBJECT: " + subject.toUpperCase(), 80, 100);

            for(var i = 0; i< details.length; i++){
                ctx.font = "bold 11pt Roboto";
                ctx.fillStyle = '#eac7df';
                ctx.fillText(details[i].toUpperCase(), 80, 138 + i*20);

            }

            ctx.strokeStyle='#12b7a7';
            ctx.lineWidth=2;
            ctx.beginPath();
            ctx.moveTo(68, 75);
            ctx.lineTo(68, 280);
            ctx.stroke();

            ctx.strokeStyle='#eac7df';
            ctx.lineWidth=1;
            ctx.fillStyle = 'rgba(234,199,223,0.3)';

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
            ctx.fillRect(48, 167, 22, 6);
            ctx.fillRect(48, 183, 22, 6);

        });

    };

    function createRenderTarget(width, height){
        var params = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat};
        return new THREE.WebGLRenderTarget(width, height, params);
    }

    function init(){
        clock = new THREE.Clock();

        renderCamera = new THREE.PerspectiveCamera( 70, canvasWidth / canvasHeight, 1, 1000 );
        renderCamera.position.z = 260;
        renderCamera.position.y = 0;
        renderScene = new THREE.Scene();

        var loader = new THREE.OBJLoader();

        var skeletonMaterial = new THREE.ShaderMaterial({
            uniforms: LeftPanelShaders.skeleton.uniforms,
            vertexShader: LeftPanelShaders.skeleton.vertexShader,
            fragmentShader: LeftPanelShaders.skeleton.fragmentShader,
            shading: THREE.SmoothShading
        });

        var organMaterial = new THREE.ShaderMaterial({
            uniforms: LeftPanelShaders.organs.uniforms,
            vertexShader: LeftPanelShaders.organs.vertexShader,
            fragmentShader: LeftPanelShaders.organs.fragmentShader,
        });

        skeletonMaterial.transparent = true;
        
        organMaterial.transparent = true;

        skeletonMaterial.blending = THREE.AdditiveBlending;
        organMaterial.blending = THREE.AdditiveBlending;

        loader.load( 'skeleton2.obj', function ( skeletonObject ) {

            skeletonObject.children[0].geometry.mergeVertices();
            skeletonObject.children[0].geometry.computeVertexNormals();

            skeletonObject.children[0].material = skeletonMaterial;
            skeletonObject.children[1].material = organMaterial;

            skeletonObject.position.set(95, -100, 0);

            renderScene.add(skeletonObject);

        });

        var nameCanvas1= createNameCanvas("Scanlon", "Rob Scanlon", ["Alias: \"ARSCAN\"", 
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
            uniforms: LeftPanelShaders.nameBox.uniforms,
            vertexShader: LeftPanelShaders.nameBox.vertexShader,
            fragmentShader: LeftPanelShaders.nameBox.fragmentShader,
        });

        nameBoxMaterial.uniforms.name1.value = nameTexture1;
        nameBoxMaterial.transparent = true;
        var planegeometry = new THREE.PlaneBufferGeometry( 400, 400 );
        // var planematerial = new THREE.MeshBasicMaterial( {map: nameTexture, transparent: true} );


        var plane = new THREE.Mesh( planegeometry, nameBoxMaterial );
        plane.position.x = 100;
        plane.position.y = -100;
        plane.position.z = -750;
        renderScene.add( plane );

        var nameTween1 = new TWEEN.Tween(plane.position)
        .to({x: -10}, 3000);
        var nameTween2 = new TWEEN.Tween(plane.position)
        .to({x: 20}, 5000)
        .chain(nameTween1);

        nameTween1.chain(nameTween2);

        new TWEEN.Tween(plane.position)
        .easing( TWEEN.Easing.Cubic.Out )
        .to({x: 140, y: -200, z: -60}, 300)
        .chain(new TWEEN.Tween(plane.position)
               .easing( TWEEN.Easing.Cubic.In )
               .to({x: 0}, 500)
               .delay(6200)
               .onComplete(function(){
                   nameBoxMaterial.uniforms.name1.value = nameTexture2;
                   nameBoxMaterial.uniforms.textInStartTime.value = 7.0,
                   nameBoxMaterial.uniforms.textOutStartTime.value = 0.0
                   nameTween1.start();
               })).start();


        renderComposer = new THREE.EffectComposer(renderer, createRenderTarget(canvasWidth, canvasHeight));
        renderComposer.addPass(new THREE.RenderPass(renderScene, renderCamera));

        var renderScenePass = new THREE.TexturePass(renderComposer.renderTarget2);

        projectorComposer = new THREE.EffectComposer(renderer, createRenderTarget(canvasWidth/1.5, canvasHeight/1.5));
        projectorComposer.addPass(renderScenePass);
        projectorComposer.addPass(new THREE.ProjectorPass(renderer, new THREE.Vector2(-.18, 0)));

        blurComposer = new THREE.EffectComposer(renderer, createRenderTarget(canvasWidth/4, canvasHeight/4));
        blurComposer.addPass(renderScenePass);
        blurComposer.addPass(new THREE.ShaderPass(THREE.HorizontalBlurShader, {h: BLURINESS / (canvasWidth/4)}));
        blurComposer.addPass(new THREE.ShaderPass(THREE.VerticalBlurShader, {v: BLURINESS / (canvasHeight/4)}));
        blurComposer.addPass(new THREE.ShaderPass(THREE.HorizontalBlurShader, {h: (BLURINESS/4) / (canvasWidth/4)}));
        blurComposer.addPass(new THREE.ShaderPass(THREE.VerticalBlurShader, {v: (BLURINESS/4) / (canvasHeight/4)}));


        // mainComposer = new THREE.EffectComposer(renderer, createRenderTarget(canvasWidth, canvasHeight));
        mainComposer = new THREE.EffectComposer(renderer, renderTarget);
        mainComposer.addPass(renderScenePass);
        mainComposer.addPass(new THREE.ShaderPass(THREE.FXAAShader, {resolution: new THREE.Vector2(1/canvasWidth, 1/canvasHeight)}));

        glowComposer = new THREE.EffectComposer(renderer, createRenderTarget(canvasWidth, canvasHeight));
        glowComposer.addPass(renderScenePass);

        glowComposer.addPass(new THREE.ShaderPass( THREE.HorizontalBlurShader, {h: 2/canvasWidth} ));
        glowComposer.addPass(new THREE.ShaderPass(THREE.VerticalBlurShader, {v: 2/canvasHeight}));
        glowComposer.addPass(new THREE.ShaderPass( THREE.HorizontalBlurShader, {h: 1/canvasWidth} ));
        glowComposer.addPass(new THREE.ShaderPass(THREE.VerticalBlurShader, {v: 1/canvasHeight}));

        var addPass = new THREE.ShaderPass(THREE.AdditiveBlendShader);
        addPass.uniforms['tAdd'].value = blurComposer.writeBuffer;
        mainComposer.addPass(addPass);

        var addPass2 = new THREE.ShaderPass(THREE.AdditiveBlendShader);
        addPass2.uniforms['tAdd'].value = glowComposer.writeBuffer;
        mainComposer.addPass(addPass2);

        var addPass3 = new THREE.ShaderPass(THREE.AdditiveBlendShader);
        addPass3.uniforms['tAdd'].value = projectorComposer.readBuffer;
        addPass3.uniforms['fOpacity'].value = 0.3;
        mainComposer.addPass(addPass3);
        mainComposer.addPass(new THREE.ShaderPass(THREE.CopyShader)); /* to get the buffers lined up properly */


        // setInterval(function(){
        //     addPass3.enabled = !addPass3.enabled;
        // }, 1000);

        // renderScenePass.uniforms[ "tDiffuse" ].value = fullResolutionComposer.renderTarget2;
    }

    function render(){
        // renderer.render(mainScene, camera);
        var time = clock.getElapsedTime();

        if(renderScene.children.length > 1){
            renderScene.children[1].rotation.y -= .005;
        }

        TWEEN.update();

        LeftPanelShaders.skeleton.uniforms.currentTime.value = time -6;
        LeftPanelShaders.organs.uniforms.currentTime.value = time -7;
        LeftPanelShaders.nameBox.uniforms.currentTime.value = time -1;
        renderComposer.render();

        projectorComposer.render();
        blurComposer.render();
        blurComposer.render();
        glowComposer.render();

        mainComposer.render();

    }

    init();

    return Object.freeze({
        render: render



    });
}

