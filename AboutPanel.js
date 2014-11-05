function createAboutPanel(renderer, width, height, x, y){

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

   var bodyPlane,
       scrollPlane;

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
           ctx.fillText("WELCOME", 25, 15);

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

   function createBodyCanvas(){
       var text = ["Thanks for stopping by.",
                   "This is a project by Rob Scanlon using THREE.js, and a ",
                   "long list of other open source projects.",
                   "Try scrolling down to continue.",
       ];

       return renderToCanvas(256, 200, function(ctx){
           ctx.strokeStyle="#fff";

           ctx.font = "10pt Roboto";
           ctx.fillStyle = '#ffffff';

           for(var i = 0; i < text.length; i++){
               ctx.fillText(text[i], 0, 20 + i*20);
           }
       });

   };

   function createScrollCanvas(){
       return renderToCanvas(256, 25, function(ctx){

           ctx.font = "12pt Roboto";
           ctx.fillStyle = '#6Fc0BA';

           ctx.fillText("SCROLL DOWN", 50, 18);
           ctx.fillStyle = '#996699';

           function drawTriangles(x){
               ctx.moveTo(x, 10);
               ctx.lineTo(x+5, 5);
               ctx.lineTo(x-5, 5);
               ctx.lineTo(x, 10);
               ctx.moveTo(x, 15);
               ctx.lineTo(x+5, 10);
               ctx.lineTo(x-5, 10);
               ctx.lineTo(x, 15);
               ctx.moveTo(x, 20);
               ctx.lineTo(x+5, 15);
               ctx.lineTo(x-5, 15);
               ctx.lineTo(x, 20);
               ctx.fill();
           }

           drawTriangles(40);
           drawTriangles(180);
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

        var bodyCanvas= createBodyCanvas(); 
        var bodyTexture = new THREE.Texture(bodyCanvas)
        bodyTexture.needsUpdate = true;

        var bodyMaterial = new THREE.MeshBasicMaterial({map: bodyTexture, transparent: true});
        var bodyGeometry = new THREE.PlaneBufferGeometry( 256, 200 );

        bodyPlane = new THREE.Mesh( bodyGeometry, bodyMaterial );
        bodyPlane.position.set(0, 0, 0);
        renderScene.add( bodyPlane );

        var scrollCanvas= createScrollCanvas(); 
        var scrollTexture = new THREE.Texture(scrollCanvas)
        scrollTexture.needsUpdate = true;

        var scrollMaterial = new THREE.MeshBasicMaterial({map: scrollTexture, transparent: true});
        var scrollGeometry = new THREE.PlaneBufferGeometry( 256, 25 );

        scrollPlane = new THREE.Mesh( scrollGeometry, scrollMaterial );
        scrollPlane.position.set(0, -100, 0);
        renderScene.add( scrollPlane );

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
        toString: function(){return "AboutPanel"},
        render: render,
        renderTarget: renderTarget,
        width: width,
        height: height,
        quad: quad,
        checkBounds: checkBounds,
        setBlur: setBlur
    });
}

