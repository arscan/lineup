
function createToolPanel(renderer, scale){

   var STANDARD_DIMENSIONS = {width: 460, height:287};

   var width = STANDARD_DIMENSIONS.width * scale,
       height = STANDARD_DIMENSIONS.height * scale;

   var panel = createPanel(renderer, width, height, {foregroundGlow: true});

   var toolPlane;

    function init(){

        var toolTexture = THREE.ImageUtils.loadTexture('images/tool-comp.png', undefined, LOADSYNC.register() );
        var toolMaterial = new THREE.MeshBasicMaterial({map: toolTexture, transparent: true});
        var toolGeometry = new THREE.PlaneBufferGeometry( 400 * .5, 374 * .5);
        toolPlane = new THREE.Mesh( toolGeometry, toolMaterial );
        toolPlane.position.set(width/2 - 30, height/2, 0);

        panel.addToScene( toolPlane );

        // var titleCanvas= createTitleCanvas(); 
        // var titleTexture = new THREE.Texture(titleCanvas)
        // titleTexture.needsUpdate = true;

        // var titleMaterial = new THREE.MeshBasicMaterial({map: titleTexture, transparent: true});
        // var titleGeometry = new THREE.PlaneBufferGeometry( 350 * scale, 109 * scale );

        // var plane = new THREE.Mesh( titleGeometry, titleMaterial );
        // plane.position.set(width/2 + 7, height-60*scale, 0);
        // panel.addToScene( plane );

        // var bodyCanvas= createBodyCanvas(); 
        // var bodyTexture = new THREE.Texture(bodyCanvas)
        // bodyTexture.needsUpdate = true;

        // var bodyMaterial = new THREE.MeshBasicMaterial({map: bodyTexture, transparent: true});
        // var bodyGeometry = new THREE.PlaneBufferGeometry( 350 * scale, 276 * scale );

        // bodyPlane = new THREE.Mesh( bodyGeometry, bodyMaterial );
        // bodyPlane.position.set(width/2 + 7, height - 33*scale - (276*scale)/2, 0);
        // panel.addToScene( bodyPlane );

        // var bottomCanvas= createBottomCanvas(); 
        // var bottomTexture = new THREE.Texture(bottomCanvas)
        // bottomTexture.needsUpdate = true;

        // var bottomMaterial = new THREE.MeshBasicMaterial({map: bottomTexture, transparent: true});
        // var bottomGeometry = new THREE.PlaneBufferGeometry( 350 * scale, 130 * scale );

        // bottomPlane = new THREE.Mesh( bottomGeometry, bottomMaterial );
        // bottomPlane.position.set(185 * scale, 70 * scale, 0);
        // panel.addToScene( bottomPlane );

        // var scrollCanvas= createScrollCanvas(); 
        // var scrollTexture = new THREE.Texture(scrollCanvas)
        // scrollTexture.needsUpdate = true;

        // var scrollMaterial = new THREE.MeshBasicMaterial({map: scrollTexture, transparent: true});
        // var scrollGeometry = new THREE.PlaneBufferGeometry( 256, 25 );

        // scrollPlane = new THREE.Mesh( scrollGeometry, scrollMaterial );
        // scrollPlane.position.set(0, -100, 0);
        // panel.addToScene( scrollPlane );

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
