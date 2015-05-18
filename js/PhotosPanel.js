function createPhotosPanel(renderer, scale){

   var STANDARD_DIMENSIONS = {width: 460, height:287};

   var width = STANDARD_DIMENSIONS.width * scale,
       height = STANDARD_DIMENSIONS.height * scale;

   var panel = createPanel(renderer, width, height, {foregroundGlow: false});

   var icons = [];

   var picHeight = 70;

   var selected = false;

   var clickMaterial;

   function createBackground(){

        var material = new THREE.MeshBasicMaterial({transparent: false, color: 0x000000});
        var geometry = new THREE.PlaneBufferGeometry( width, height);

        var plane = new THREE.Mesh( geometry, material );
        plane.position.set(width/2, height/2, -1);
        panel.addToScene( plane );
   };

    function init(){

        createBackground();

        var headerTexture = THREE.ImageUtils.loadTexture("images/photos-header.png", undefined, LOADSYNC.register() );
        var headerMaterial = new THREE.MeshBasicMaterial({map: headerTexture, depthTest: false, transparent: true});
        var headerGeometry = new THREE.PlaneBufferGeometry( 134 * scale, 32 * scale);
        var headerPlane = new THREE.Mesh(headerGeometry, headerMaterial );
        // headerPlane.position.set(108 * scale, height - 90 * scale,5);
        headerPlane.position.set(140 * scale, height - 45 * scale, 5);
        panel.addToScene(headerPlane);

        var picsTexture = THREE.ImageUtils.loadTexture("images/pics.png", undefined, LOADSYNC.register() );
        var picsMaterial = new THREE.MeshBasicMaterial({map: picsTexture, depthTest: false, transparent: true});
        var picsGeometry = new THREE.PlaneBufferGeometry( 700 * scale, 412 * scale);
        var picsPlane = new THREE.Mesh(picsGeometry, picsMaterial );
        picsPlane.scale.set(.5,.5,.5);
        // headerPlane.position.set(108 * scale, height - 90 * scale,5);
        picsPlane.position.set(width/2, height/2, 0);
        panel.addToScene(picsPlane);

        var clickTexture = THREE.ImageUtils.loadTexture("images/photos-click.png", undefined, LOADSYNC.register() );
        clickMaterial = new THREE.MeshBasicMaterial({map: clickTexture, depthTest: false, transparent: true, opacity: 0});
        var clickGeometry = new THREE.PlaneBufferGeometry( 286 * scale, 41 * scale);
        var clickPlane = new THREE.Mesh(clickGeometry, clickMaterial );
        clickPlane.scale.set(.8,.8,.8);
        clickPlane.position.set(width/2, height/2 + 10*scale, 10);
        panel.addToScene(clickPlane);

    }

    function render(time){
        panel.render(time);
    }

    function checkBounds(x, y){
        if(panel.checkBounds(x,y)){
            if(!selected){
                // run intro animation
                 new TWEEN.Tween(clickMaterial)
                   .to({opacity: 1}, 500)
                   .start();

                 selected = true;
            }
            return "https://www.flickr.com/photos/45001949@N00/";
        } else {
            if(selected){
                // run outro animation
                 new TWEEN.Tween(clickMaterial)
                   .to({opacity: 0}, 500)
                   .start();

                 selected = false;

            }
        }
        return false;
    }

    init();

    return Object.freeze({
        toString: function(){return "AboutPanel"},
        render: render,
        renderTarget: panel.renderTarget,
        width: width,
        height: height,
        quad: panel.quad,
        checkBounds: checkBounds,
        setBlur: panel.setBlur,
        setPosition: panel.setPosition
    });
}

