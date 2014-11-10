function createLinksPanel(renderer, scale){

   var STANDARD_DIMENSIONS = {width: 256, height:256},
       BLURINESS = 3.9;

   var width = STANDARD_DIMENSIONS.width * scale,
       height = STANDARD_DIMENSIONS.height * scale,
       renderScene,
       renderComposer,
       renderCamera,
       mainComposer,
       blurComposer,
       glowComposer,
       blurLevel = 1,
       finalBlurPass;

   var targetParams = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat};
   var renderTarget = new THREE.WebGLRenderTarget(width, height, targetParams);
   var quad = new THREE.Mesh( new THREE.PlaneBufferGeometry(width, height), new THREE.MeshBasicMaterial({map: renderTarget, transparent: true, blending: THREE.AdditiveBlending}));

   var bodyPlane,
       scrollPlane;


   function renderToCanvas(width, height, renderFunction) {
       var buffer = document.createElement('canvas');
       buffer.width = width;
       buffer.height = height;

       renderFunction(buffer.getContext('2d'));

       return buffer;
   };

   function createTitleCanvas(){

       return renderToCanvas(512, 160, function(ctx){
           ctx.strokeStyle="#fff";

           ctx.font = "bold 28pt Roboto";
           ctx.fillStyle = '#ff8d07';
           ctx.fillText("LINKS", 25, 35);

           ctx.lineWidth = 2.5;
           ctx.strokeStyle="#fd2616";
           ctx.moveTo(4,2);
           ctx.lineTo(4,50);
           ctx.lineTo(440,50);
           ctx.stroke();

           ctx.beginPath();
           ctx.fillStyle='#ff8d07';
           ctx.arc(4, 4, 4, 0, 2 * Math.PI);
           ctx.fill();

           ctx.beginPath();
           ctx.arc(4, 50, 4, 0, 2 * Math.PI);
           ctx.fill();

           ctx.beginPath();
           ctx.arc(380, 50, 4, 0, 2 * Math.PI);
           ctx.fill();

           ctx.beginPath();
           ctx.arc(440, 50, 4, 0, 2 * Math.PI);
           ctx.fill();

       });

   };

   function createBodyCanvas(){
       var text = ["Thanks for stopping by.",
                   "This is a project by Rob Scanlon using THREE.js, and a ",
                   "long list of other open source projects.",
                   "Try scrolling down to continue.",
       ];

       return renderToCanvas(512, 400, function(ctx){
           ctx.strokeStyle="#fff";

           ctx.font = "20pt Roboto";
           ctx.fillStyle = '#ffffff';

           for(var i = 0; i < text.length; i++){
               ctx.fillText(text[i], 0, 20 + i*38);
           }
       });

   };

   function createScrollCanvas(){
       return renderToCanvas(512, 50, function(ctx){

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

        renderCamera = new THREE.OrthographicCamera(0, width, height, 0, -1000, 1000),
        renderScene = new THREE.Scene();

        var titleCanvas= createTitleCanvas(); 
        var titleTexture = new THREE.Texture(titleCanvas)
        titleTexture.needsUpdate = true;

        var titleMaterial = new THREE.MeshBasicMaterial({map: titleTexture, transparent: true});
        var titleGeometry = new THREE.PlaneBufferGeometry( 256 * scale, 80 * scale );

        var plane = new THREE.Mesh( titleGeometry, titleMaterial );
        plane.position.set(width/2 + 7, height-40*scale, 0);
        renderScene.add( plane );

        var bodyCanvas= createBodyCanvas(); 
        var bodyTexture = new THREE.Texture(bodyCanvas)
        bodyTexture.needsUpdate = true;

        var bodyMaterial = new THREE.MeshBasicMaterial({map: bodyTexture, transparent: true});
        var bodyGeometry = new THREE.PlaneBufferGeometry( 256 * scale, 200 * scale );

        bodyPlane = new THREE.Mesh( bodyGeometry, bodyMaterial );
        bodyPlane.position.set(width/2 + 7, height - 40*scale - (200*scale)/2, 0);
        renderScene.add( bodyPlane );

        // var scrollCanvas= createScrollCanvas(); 
        // var scrollTexture = new THREE.Texture(scrollCanvas)
        // scrollTexture.needsUpdate = true;

        // var scrollMaterial = new THREE.MeshBasicMaterial({map: scrollTexture, transparent: true});
        // var scrollGeometry = new THREE.PlaneBufferGeometry( 256, 25 );

        // scrollPlane = new THREE.Mesh( scrollGeometry, scrollMaterial );
        // scrollPlane.position.set(0, -100, 0);
        // renderScene.add( scrollPlane );

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

        renderComposer.render();

        glowComposer.render();

        finalBlurPass.uniforms['fOpacitySource'].value = blurLevel;

        mainComposer.render();

    }

    function setPosition(x, y, z){
        if(typeof z == "number"){
            z = Math.max(0, Math.min(1, z));
            setBlur(z);
            quad.scale.set(z/2 + .5, z/2 + .5, z/2 + .5);
        }


        quad.position.set(x + width/2, y-height/2, 0);
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
        setBlur: setBlur,
        setPosition: setPosition
    });
}

