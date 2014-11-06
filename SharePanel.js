function createSharePanel(renderer, width, height, x, y){

   var renderScene,
       renderComposer,
       renderCamera,
       clock,
       mainComposer,
       blurComposer,
       glowComposer,
       twitterPlane,
       githubPlane,
       blurLevel = 1,
       githubStars = 0,
       tweets = 0,
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

   function createTwitterCanvas(){

       return renderToCanvas(100, 80, function(ctx){
           ctx.strokeStyle="#fff";

           ctx.font = "12pt Roboto";
           ctx.fillStyle = '#ff8d07';
           ctx.fillText(tweets + ' tweets', 5, 12);

       });

   };

   function createGithubCanvas(){
       return renderToCanvas(100, 80, function(ctx){
           ctx.strokeStyle="#fff";

           ctx.font = "12pt Roboto";
           ctx.fillStyle = '#ff8d07';
           ctx.fillText(githubStars + ' stars', 5, 12);
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

        var twitterIconTexture = THREE.ImageUtils.loadTexture('twitter.png');
        var twitterIconMaterial = new THREE.MeshBasicMaterial({map: twitterIconTexture, transparent: true});
        var twitterIconGeometry = new THREE.PlaneBufferGeometry( 30, 24 );
        var twitterIconPlane = new THREE.Mesh(twitterIconGeometry, twitterIconMaterial );
        twitterIconPlane.position.set(-118, 45, 0);
        renderScene.add(twitterIconPlane);

        var twitterTexture = new THREE.Texture(createTwitterCanvas())
        twitterTexture.needsUpdate = true;
        twitterPlane = new THREE.Mesh(new THREE.PlaneBufferGeometry( 100, 80 ),new THREE.MeshBasicMaterial({map: twitterTexture, transparent: true}));
        twitterPlane.position.set(-50, 10, 0);
        renderScene.add( twitterPlane );

        var githubIconTexture = THREE.ImageUtils.loadTexture('github.png');
        var githubIconMaterial = new THREE.MeshBasicMaterial({map: githubIconTexture, transparent: true});
        var githubIconGeometry = new THREE.PlaneBufferGeometry( 25, 25 );
        var githubIconPlane = new THREE.Mesh(githubIconGeometry, githubIconMaterial );
        githubIconPlane.position.set(10, 45, 0);
        renderScene.add(githubIconPlane);

        var githubTexture = new THREE.Texture(createGithubCanvas())
        githubTexture.needsUpdate = true;
        githubPlane = new THREE.Mesh(new THREE.PlaneBufferGeometry( 100, 80 ), new THREE.MeshBasicMaterial({map: githubTexture, transparent: true}));
        githubPlane.position.set(80, 10, 0);
        renderScene.add( githubPlane );

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
        if(x > quad.position.x - width / 2 && x < quad.position.x && y > quad.position.y + 20 && y < quad.position.y + 50){
            return "https://twitter.com/intent/tweet?original_referer=http%3A%2F%2Frobscanlon.com%2flineup&text=GoG%20Lineup%20in%20Web&tw_p=tweetbutton&url=http%3A%2F%2Fwww.robscanlon.com%2Flineup&via=arscan";
        } else if(x > quad.position.x && x < quad.position.x + width / 2 && y > quad.position.y + 20 && y < quad.position.y + 50){
            return "http://github.com/arscan/lineup";
        }

        return (x > quad.position.x - width / 2 && x < quad.position.x + width/2) 
               && (y > quad.position.y - height / 2 && y < quad.position.y + height/2);
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
        setStars: setStars
    });
}

