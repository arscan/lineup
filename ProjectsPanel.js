function createProjectsPanel(renderer, width, height, x, y){

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

   var BLURINESS = 3.9;

   var encomSphere,
       encomBoardroom;


   var projectsShaders =  {
       uniforms : {
       },
       vertexShader: [
       ].join('\n'),
       fragmentShader: [
       ].join('\n')
   };


   function renderToCanvas(width, height, renderFunction) {
       var buffer = document.createElement('canvas');
       buffer.width = width;
       buffer.height = height;

       // $(".container").append(buffer);

       renderFunction(buffer.getContext('2d'));

       return buffer;
   };

   function createTitleCanvas(name){

       return renderToCanvas(256, 80, function(ctx){
           ctx.strokeStyle="#fff";

           ctx.font = "bold 14pt Roboto";
           ctx.fillStyle = '#ff8d07';
           ctx.fillText("NEW PROJECTS", 25, 15);

           ctx.lineWidth = 1.5;
           ctx.strokeStyle="#fd2616";
           ctx.moveTo(2,2);
           ctx.lineTo(2,25);
           ctx.lineTo(220,25);
           ctx.stroke();

           ctx.beginPath();
           ctx.fillStyle='#ff8d07';
           ctx.arc(2, 2, 2, 0, 2 * Math.PI);
           ctx.fill();

           ctx.beginPath();
           ctx.arc(2, 25, 2, 0, 2 * Math.PI);
           ctx.fill();

           ctx.beginPath();
           ctx.arc(200, 25, 2, 0, 2 * Math.PI);
           ctx.fill();

           ctx.beginPath();
           ctx.arc(220, 25, 2, 0, 2 * Math.PI);
           ctx.fill();



       });

   };

    function createRenderTarget(width, height){
        var params = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat};
        return new THREE.WebGLRenderTarget(width, height, params);
    }

    function init(){
        clock = new THREE.Clock();

        renderCamera = new THREE.PerspectiveCamera( 70, width / height, 1, 1000 );
        renderCamera.position.z = 200;
        renderCamera.position.y = 0;
        renderScene = new THREE.Scene();

        var titleCanvas= createTitleCanvas("subtitle", "RProjects"); 

        var titleTexture = new THREE.Texture(titleCanvas)
        titleTexture.needsUpdate = true;

        var titleMaterial = new THREE.MeshBasicMaterial({map: titleTexture, transparent: true});
        var titleGeometry = new THREE.PlaneBufferGeometry( 256, 80 );

        var plane = new THREE.Mesh( titleGeometry, titleMaterial );
        plane.position.set(0, 90, 0);
        renderScene.add( plane );

        encomSphere = new THREE.Mesh(new THREE.PlaneBufferGeometry(100,100),
                                    new THREE.MeshBasicMaterial({color: 0xFF0000, opacity: .2, transparent: true}));
        encomSphere.position.set(-70, 20, 0);
        renderScene.add(encomSphere);

        encomBoardroom = new THREE.Mesh(new THREE.PlaneBufferGeometry(100,60),
                                    new THREE.MeshBasicMaterial({color: 0x00FF00, opacity: .2, transparent: true}));
        encomBoardroom.position.set(80, 50, 0);
        renderScene.add(encomBoardroom);

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

        // renderer.render(renderScene, renderCamera, renderTarget);
        renderComposer.render();

        blurComposer.render();
        blurComposer.render();
        glowComposer.render();

        mainComposer.render();

    }

    init();

    return Object.freeze({
        render: render,
        renderTarget: renderTarget,
        width: width,
        height: height,
        quad: quad
    });
}

