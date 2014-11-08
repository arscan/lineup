function createSharePanel(renderer, scale){

   var STANDARD_DIMENSIONS = {width: 255, height:30},
       BLURINESS = 3.9;

   var width = STANDARD_DIMENSIONS.width * scale,
       height = STANDARD_DIMENSIONS.height * scale,
       renderScene,
       renderComposer,
       renderCamera,
       mainComposer,
       glowComposer,
       twitterPlane,
       githubPlane,
       blurLevel = 1,
       githubStars = 0,
       tweets = 0,
       fontSize = Math.floor(12 * scale),
       finalBlurPass;


   var targetParams = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat};
   var renderTarget = new THREE.WebGLRenderTarget(width, height, targetParams);
   var quad = new THREE.Mesh( new THREE.PlaneBufferGeometry(width, height), new THREE.MeshBasicMaterial({map: renderTarget, transparent: true, blending: THREE.AdditiveBlending}));

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

       renderFunction(buffer.getContext('2d'));

       return buffer;
   };

   function createTwitterCanvas(){

       return renderToCanvas(width/2, height, function(ctx){
           ctx.strokeStyle="#fff";

           ctx.font = "" + fontSize + "pt Roboto";
           ctx.fillStyle = '#ff8d07';
           ctx.fillText(tweets + ' tweets', 5, 12*scale);

       });

   };

   function createGithubCanvas(){
       return renderToCanvas(width/2, height, function(ctx){
           ctx.strokeStyle="#fff";

           ctx.font = fontSize + "pt Roboto";
           ctx.fillStyle = '#ff8d07';
           ctx.fillText(githubStars + ' stars', 5, 12*scale);
       });
   };

    function createRenderTarget(width, height){
        var params = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat};
        return new THREE.WebGLRenderTarget(width, height, params);
    }

    function init(){

        renderCamera = new THREE.OrthographicCamera(0, width, height, 0, -1000, 1000),
        renderScene = new THREE.Scene();

        var twitterIconTexture = THREE.ImageUtils.loadTexture('../images/twitter.png', undefined, LOADSYNC.register() );
        var twitterIconMaterial = new THREE.MeshBasicMaterial({map: twitterIconTexture, transparent: true});
        var twitterIconGeometry = new THREE.PlaneBufferGeometry( 24 * scale, 19*scale );
        var twitterIconPlane = new THREE.Mesh(twitterIconGeometry, twitterIconMaterial );
        twitterIconPlane.position.set(24*scale, 19*scale/2 + 4, 0);
        renderScene.add(twitterIconPlane);

        var twitterTexture = new THREE.Texture(createTwitterCanvas())
        twitterTexture.needsUpdate = true;
        twitterPlane = new THREE.Mesh(new THREE.PlaneBufferGeometry( width/2, height ),new THREE.MeshBasicMaterial({map: twitterTexture, transparent: true}));
        twitterPlane.position.set(24*scale*1.6 + width/4 , 5, 0);
        renderScene.add( twitterPlane );

        var githubIconTexture = THREE.ImageUtils.loadTexture('../images/github.png', undefined, LOADSYNC.register() );
        var githubIconMaterial = new THREE.MeshBasicMaterial({map: githubIconTexture, transparent: true});
        var githubIconGeometry = new THREE.PlaneBufferGeometry( 25 * scale, 25 * scale);
        var githubIconPlane = new THREE.Mesh(githubIconGeometry, githubIconMaterial );
        githubIconPlane.position.set(width/2 + 25 * scale / 2 + 5, 25*scale/2 + 2, 0);
        renderScene.add(githubIconPlane);

        var githubTexture = new THREE.Texture(createGithubCanvas())
        githubTexture.needsUpdate = true;
        githubPlane = new THREE.Mesh(new THREE.PlaneBufferGeometry( width/2, height ), new THREE.MeshBasicMaterial({map: githubTexture, transparent: true}));
        githubPlane.position.set(width/2 + 25*scale *1.3 + width/4, 5, 0);
        renderScene.add( githubPlane );

        renderComposer = new THREE.EffectComposer(renderer, createRenderTarget(width, height));
        renderComposer.addPass(new THREE.RenderPass(renderScene, renderCamera));

        var renderScenePass = new THREE.TexturePass(renderComposer.renderTarget2);

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

    function render(time){

        renderComposer.render();
        glowComposer.render();
        finalBlurPass.uniforms['fOpacitySource'].value = blurLevel;
        mainComposer.render();

    }

    function checkBounds(x, y){
        if(x > quad.position.x - width / 2 && x < quad.position.x && y > quad.position.y - height/2 && y < quad.position.y + height/2){
            return "https://twitter.com/intent/tweet?original_referer=http%3A%2F%2Frobscanlon.com%2flineup&text=GoG%20Lineup%20in%20Web&tw_p=tweetbutton&url=http%3A%2F%2Fwww.robscanlon.com%2Flineup&via=arscan";
        } else if(x > quad.position.x && x < quad.position.x + width / 2 && y > quad.position.y -height/2 && y < quad.position.y + height/2){
            return "http://github.com/arscan/lineup";
        }

        return false;
    }

    function setBlur(blur){
        blurLevel = Math.max(0,Math.min(1,blur));
    }

    function setTweets(_tweets){
        tweets = _tweets;

        var twitterTexture = new THREE.Texture(createTwitterCanvas())
        twitterTexture.needsUpdate = true;
        twitterPlane.material.map = twitterTexture;
    }

    function setStars(_stars){
        githubStars = _stars;

        var githubTexture = new THREE.Texture(createGithubCanvas())
        githubTexture.needsUpdate = true;
        githubPlane.material.map = githubTexture;
    }

    function setPosition(x, y, z){
        if(typeof z == "number"){
            z = Math.max(0, Math.min(1, z));
            setBlur(z);
            quad.scale.set(z/2 + .5, z/2 + .5, z/2 + .5);
        }


        quad.position.set(x + width/2, y-height/2, 0);
    }

    init();

    return Object.freeze({
        toString: function(){return "SharePanel"},
        render: render,
        renderTarget: renderTarget,
        width: width,
        height: height,
        quad: quad,
        checkBounds: checkBounds,
        setBlur: setBlur,
        setTweets: setTweets,
        setStars: setStars,
        setPosition: setPosition
    });
}

