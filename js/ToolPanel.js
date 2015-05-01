
function createToolPanel(renderer, scale){

   var STANDARD_DIMENSIONS = {width: 460, height:287};

   var width = STANDARD_DIMENSIONS.width * scale,
       height = STANDARD_DIMENSIONS.height * scale;

   var panel = createPanel(renderer, width, height, {foregroundGlow: true});

   var toolBGPlane;

   function createTitlePlane(text){

       var titleCanvas =  panel.renderToCanvas(512, 160, function(ctx){
           ctx.strokeStyle="#fff";

           ctx.font = "24pt Roboto";
           ctx.fillStyle = '#ff8d07';
           ctx.fillText(text, 50, 35);

       });

        var titleTexture = new THREE.Texture(titleCanvas)
        titleTexture.needsUpdate = true;

        var titleMaterial = new THREE.MeshBasicMaterial({map: titleTexture, transparent: true});
        var titleGeometry = new THREE.PlaneBufferGeometry( 256, 80);

        var plane = new THREE.Mesh( titleGeometry, titleMaterial );
        plane.position.set(0, 90, 0);
        // panel.addToScene( plane );
        return plane;

   };

    function init(){
        var toolTexture = THREE.ImageUtils.loadTexture('images/tools-foreground.png', undefined, LOADSYNC.register() );
        var toolMaterial = new THREE.MeshBasicMaterial({map: toolTexture, transparent: true});
        var toolGeometry = new THREE.PlaneBufferGeometry( 350 * scale, 350 * scale);
        toolPlane = new THREE.Mesh( toolGeometry, toolMaterial );
        toolPlane.position.set(width/2 + 45 * scale, height/2 - 40 * scale, 1);
        toolPlane.scale.set(.6,.6,.6);

        panel.addToScene( toolPlane );

        var toolBGTexture = THREE.ImageUtils.loadTexture('images/tools-background.png', undefined, LOADSYNC.register() );
        var toolBGMaterial = new THREE.MeshBasicMaterial({map: toolBGTexture, transparent: true, opacity: .5});
        var toolBGGeometry = new THREE.PlaneBufferGeometry( 350 * scale, 350 * scale);
        toolBGPlane = new THREE.Mesh( toolBGGeometry, toolBGMaterial );
        toolBGPlane.position.set(width/2 + 45 * scale, height/2 - 40 * scale, 0);
        toolBGPlane.scale.set(.6,.6,.6);

        panel.addToScene( toolBGPlane );

        var headerTexture = THREE.ImageUtils.loadTexture("images/tools-header.png", undefined, LOADSYNC.register() );
        var headerMaterial = new THREE.MeshBasicMaterial({map: headerTexture, depthTest: false, transparent: true});
        var headerGeometry = new THREE.PlaneBufferGeometry( 134 * scale, 32 * scale);
        var headerPlane = new THREE.Mesh(headerGeometry, headerMaterial );
        headerPlane.position.set(110 * scale, height - 100 * scale,5);
        headerPlane.scale.set(.7,.7,.7);
        panel.addToScene(headerPlane);
        
        var selectorTexture = THREE.ImageUtils.loadTexture("images/tools-selector.png", undefined, LOADSYNC.register() );
        var selectorMaterial = new THREE.MeshBasicMaterial({map: selectorTexture, depthTest: false, transparent: true});
        var selectorGeometry = new THREE.PlaneBufferGeometry( 310 * scale, 200 * scale);
        var selectorPlane = new THREE.Mesh(selectorGeometry, selectorMaterial );
        selectorPlane.position.set(160 * scale, height/2 - 32 * scale,5);
        selectorPlane.scale.set(.5, .5, .5);
        panel.addToScene(selectorPlane);

    }

    function render(time){
        toolPlane.rotation.z = time/2;
        panel.render(time);
    }

    init();

    return Object.freeze({
        toString: function(){return "AboutPanel"},
        render: render,
        renderTarget: panel.renderTarget,
        width: width,
        height: height,
        quad: panel.quad,
        checkBounds: panel.checkBounds,
        setBlur: panel.setBlur,
        setPosition: panel.setPosition
    });
}
