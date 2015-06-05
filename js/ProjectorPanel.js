function createProjectorPanel(renderer, width, height, scale, elements){

   var renderScene,
       renderComposer,
       renderCamera,
       clock,
       mainComposer,
       projectorComposer,
       blurComposer,
       glowComposer,
       glareMaterial;

    var targetParams = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat};
    var renderTarget = new THREE.WebGLRenderTarget(width, height, targetParams);
    var quad = new THREE.Mesh( new THREE.PlaneBufferGeometry(width, height), new THREE.MeshBasicMaterial({map: renderTarget, transparent: true}));
    quad.material.blending = THREE.AdditiveBlending;
    quad.position.set(width/2,height/2,1);


    function createRenderTarget(width, height){
        var params = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat};
        return new THREE.WebGLRenderTarget(width, height, params);
    }

    function init(){
        clock = new THREE.Clock();

        renderCamera = new THREE.OrthographicCamera(0, width, height, 0, 0, 100);
        renderScene = new THREE.Scene();

        for(var i = 0; i< elements.length; i++){
            renderScene.add(elements[i].quad);
        }

        var glareTexture = THREE.ImageUtils.loadTexture('images/projector_glare.png', undefined, LOADSYNC.register());
        glareMaterial = new THREE.MeshBasicMaterial({map: glareTexture, transparent: true, blend: THREE.AdditiveBlending});
        var glareGeometry = new THREE.PlaneBufferGeometry( 50 * scale, 50 * scale );
        var glareLeft = new THREE.Mesh(glareGeometry, glareMaterial );
        var glareRight = new THREE.Mesh(glareGeometry, glareMaterial );
        glareLeft.position.set(0, 30 * scale, 0);
        glareRight.position.set(width, 30 * scale, 0);
        renderScene.add(glareLeft);
        renderScene.add(glareRight);

        var reflectionTexture = THREE.ImageUtils.loadTexture("images/reflection.png", undefined, LOADSYNC.register() );
        var reflectionMaterial = new THREE.MeshBasicMaterial({map: reflectionTexture, transparent: true, opacity: .9});
        var reflectionGeometry = new THREE.PlaneBufferGeometry( width, height);
        var reflectionPlane = new THREE.Mesh(reflectionGeometry, reflectionMaterial );
        reflectionPlane.position.set(width/2, height/2, 0);
        renderScene.add(reflectionPlane);


        renderComposer = new THREE.EffectComposer(renderer, renderTarget);
        renderComposer.addPass(new THREE.RenderPass(renderScene, renderCamera));

        var projectionMaskTexture = THREE.ImageUtils.loadTexture('images/projection_mask.png', undefined, LOADSYNC.register());
        
        var renderScenePass = new THREE.TexturePass(renderComposer.renderTarget2);
        projectorComposer = new THREE.EffectComposer(renderer, createRenderTarget(width/2.8, height/2.8));
        projectorComposer.addPass(renderScenePass);
        projectorComposer.addPass(new THREE.ProjectorPass(renderer, new THREE.Vector2(-.01, 0.05), projectionMaskTexture));

        renderComposer.addPass(new THREE.ShaderPass(THREE.AdditiveBlendShader, {tAdd: projectorComposer.renderTarget1, fOpacity: .5}));
    }

    function render(){
        // renderer.render(mainScene, camera);
        var time = clock.getElapsedTime();


        glareMaterial.opacity = Math.sin(time/2)/4 + .5;

        renderComposer.render();
        projectorComposer.render();

    }

    init();

    return Object.freeze({
        render: render,
        renderTarget: renderTarget,
        quad: quad,
        width: width,
        height: height
    });
}

