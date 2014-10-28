function createBioPanel(renderer, width, height, x, y){

   var renderScene,
       renderComposer,
       renderCamera,
       clock,
       mainComposer,
       blurComposer,
       glowComposer,
       blurLevel = 1,
       finalBlurPass;

   var targetParams = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat};
   var renderTarget = new THREE.WebGLRenderTarget(width, height, targetParams);
   var quad = new THREE.Mesh( new THREE.PlaneBufferGeometry(width, height), new THREE.MeshBasicMaterial({map: renderTarget, transparent: true}));

   quad.material.blending = THREE.AdditiveBlending;
   quad.position.set(x, y, 0);

   var BLURINESS = 3.9;

   var encomSphere,
       encomBoardroom,
       hexasphere,
       streamed;


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

   function createTitleCanvas(){

       return renderToCanvas(256, 80, function(ctx){
           ctx.strokeStyle="#fff";

           ctx.font = "bold 14pt Roboto";
           ctx.fillStyle = '#ff8d07';
           ctx.fillText("BIOMETRICS", 25, 15);

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
        var params = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat};
        return new THREE.WebGLRenderTarget(width, height, params);
    }

    function init(){
        clock = new THREE.Clock();

        renderCamera = new THREE.PerspectiveCamera( 70, width / height, 1, 1000 );
        renderCamera.position.z = 200;
        renderCamera.position.y = 0;
        renderScene = new THREE.Scene();

        var titleCanvas= createTitleCanvas(); 

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

        streamed = new THREE.Mesh(new THREE.PlaneBufferGeometry(300,80),
        // streamed = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000,1000),
                                    new THREE.MeshBasicMaterial({color: 0x00FFFF, opacity: .2, transparent: true}));
        streamed.position.set(150, -80, 0);
        renderScene.add(streamed);

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

        finalBlurPass  = new THREE.ShaderPass(THREE.AdditiveBlendShader);
        finalBlurPass.uniforms['tAdd'].value = glowComposer.writeBuffer;
        mainComposer.addPass(finalBlurPass);

    }

    function render(){

        // renderer.render(renderScene, renderCamera, renderTarget);
        renderComposer.render();


        // blurComposer.render();
        // blurComposer.render();
        glowComposer.render();

        finalBlurPass.uniforms['fOpacitySource'].value = blurLevel;

        mainComposer.render();

    }

    function checkBounds(x, y){
        return (x > quad.position.x - width / 2 && x < quad.position.x + width/2) 
               && (y > quad.position.y - height / 2 && y < quad.position.y + height/2);
    }

    function setBlur(blur){
        blurLevel = Math.max(0,Math.min(1,blur));

    }

    init();

    return Object.freeze({
        toString: function(){return "BioPanel"},
        render: render,
        renderTarget: renderTarget,
        width: width,
        height: height,
        quad: quad,
        checkBounds: checkBounds,
        setBlur: setBlur
    });
}

