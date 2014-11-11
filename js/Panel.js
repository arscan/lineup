function createPanel(renderer, width, height, opts){

    var BLURINESS = 3.9;

    var renderScene,
        blurLevel = 1,
        renderComposer,
        renderCamera,
        mainComposer,
        glowComposer,
        finalBlurPass;

    var targetParams = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat};
    var renderTarget = new THREE.WebGLRenderTarget(width, height, targetParams);
    var quad = new THREE.Mesh( new THREE.PlaneBufferGeometry(width, height), new THREE.MeshBasicMaterial({map: renderTarget, transparent: true, blending: THREE.AdditiveBlending}));

    function renderToCanvas(width, height, renderFunction) {
        var buffer = document.createElement('canvas');
        buffer.width = width;
        buffer.height = height;
        renderFunction(buffer.getContext('2d'));

        return buffer;
    };

    function createRenderTarget(width, height){
        var params = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat};
        return new THREE.WebGLRenderTarget(width, height, params);
    }

    function init(){

        renderCamera = new THREE.OrthographicCamera(0, width-1, height, 0, -1000, 1000),
        renderScene = new THREE.Scene();

        renderComposer = new THREE.EffectComposer(renderer, createRenderTarget(width, height));
        renderComposer.addPass(new THREE.RenderPass(renderScene, renderCamera));

        var renderScenePass = new THREE.TexturePass(renderComposer.renderTarget2);

        mainComposer = new THREE.EffectComposer(renderer, renderTarget);
        mainComposer.addPass(renderScenePass);

        if(opts && opts['fxaa']){
            mainComposer.addPass(new THREE.ShaderPass(THREE.FXAAShader, {resolution: new THREE.Vector2(1/width, 1/height)}));
            mainComposer.addPass(new THREE.ShaderPass(THREE.FXAAShader, {resolution: new THREE.Vector2(1/width, 1/height)}));
        }

        glowComposer = new THREE.EffectComposer(renderer, createRenderTarget(width, height));
        glowComposer.addPass(renderScenePass);

        blurComposer = new THREE.EffectComposer(renderer, createRenderTarget(width/4, height/4));
        blurComposer.addPass(renderScenePass);
        blurComposer.addPass(new THREE.ShaderPass(THREE.HorizontalBlurShader, {h: BLURINESS / (width/4)}));
        blurComposer.addPass(new THREE.ShaderPass(THREE.VerticalBlurShader, {v: BLURINESS / (height/4)}));
        blurComposer.addPass(new THREE.ShaderPass(THREE.HorizontalBlurShader, {h: (BLURINESS/4) / (width/4)}));
        blurComposer.addPass(new THREE.ShaderPass(THREE.VerticalBlurShader, {v: (BLURINESS/4) / (height/4)}));
        blurComposer.addPass(new THREE.ShaderPass(THREE.HorizontalBlurShader, {h: (BLURINESS/4) / (width/4)}));
        blurComposer.addPass(new THREE.ShaderPass(THREE.VerticalBlurShader, {v: (BLURINESS/4) / (height/4)}));
        blurComposer.addPass(new THREE.ShaderPass(THREE.VerticalBlurShader, {v: (BLURINESS/4) / (height/4)}));


        if(!opts || opts['glow']){
            glowComposer.addPass(new THREE.ShaderPass( THREE.HorizontalBlurShader, {h: 2/width} ));
            glowComposer.addPass(new THREE.ShaderPass(THREE.VerticalBlurShader, {v: 2/height}));
            glowComposer.addPass(new THREE.ShaderPass( THREE.HorizontalBlurShader, {h: 1/width} ));
            glowComposer.addPass(new THREE.ShaderPass(THREE.VerticalBlurShader, {v: 1/height}));
        }

        finalBlurPass = new THREE.ShaderPass(THREE.AdditiveBlendShader);
        finalBlurPass.uniforms['tAdd'].value = glowComposer.writeBuffer;
        mainComposer.addPass(finalBlurPass);

    }

    function render(time){
        
        finalBlurPass.uniforms['fOpacitySource'].value = blurLevel;
        renderComposer.render();
        glowComposer.render();
        mainComposer.render();
    }

    function checkBounds(x, y){
        return (x > quad.position.x - width / 2 && x < quad.position.x + width/2) 
               && (y > quad.position.y - height / 2 && y < quad.position.y + height/2);
    }

    function setBlur(blur){
        blurLevel = Math.max(0,Math.min(1,blur));
    }

    function setPosition(x, y, z){
        if(typeof z == "number"){
            z = Math.max(0, Math.min(1, z));
            setBlur(z);
            quad.scale.set(z/2 + .5, z/2 + .5, z/2 + .5);
        }
        quad.position.set(x + width/2, y-height/2, 0);
    }

    function setCamera(camera){
        renderComposer.passes[0].camera = camera;
    }

    function addToScene(obj){
       renderScene.add(obj);
    }

    init();

    return Object.freeze({
        toString: function(){return "Panel"},
        render: render,
        renderTarget: renderTarget,
        width: width,
        height: height,
        quad: quad,
        checkBounds: checkBounds,
        setBlur: setBlur,
        setPosition: setPosition,
        setCamera: setCamera,
        renderScene: renderScene, /* should get rid of this, but need to fix the projects objects */
        addToScene: addToScene,
        renderToCanvas: renderToCanvas
    });
}

