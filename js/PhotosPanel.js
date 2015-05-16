function createPhotosPanel(renderer, scale){

   var STANDARD_DIMENSIONS = {width: 460, height:287};

   var width = STANDARD_DIMENSIONS.width * scale,
       height = STANDARD_DIMENSIONS.height * scale;

   var panel = createPanel(renderer, width, height, {foregroundGlow: false});

   var icons = [];

   var picHeight = 70;
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
        headerPlane.position.set(80 * scale, height - 40 * scale, 5);
        panel.addToScene(headerPlane);

        var picsTexture = THREE.ImageUtils.loadTexture("images/pics.png", undefined, LOADSYNC.register() );
        var picsMaterial = new THREE.MeshBasicMaterial({map: picsTexture, depthTest: false, transparent: true});
        var picsGeometry = new THREE.PlaneBufferGeometry( 700 * scale, 412 * scale);
        var picsPlane = new THREE.Mesh(picsGeometry, picsMaterial );
        picsPlane.scale.set(.5,.5,.5);
        // headerPlane.position.set(108 * scale, height - 90 * scale,5);
        picsPlane.position.set(width/2, height/2, 0);
        panel.addToScene(picsPlane);


        // plane.position.set(width/2 + 7, height-40*scale, 0);
        // panel.addToScene( plane );

        /*
      var randomPics = FLICKR.getRandomLandscapes(4);

        for(var i = 0; i< randomPics.length; i++){
            var item = randomPics[i];
            var imageScale = item.height / picHeight;

            var tmpMesh = new THREE.Mesh(
                new THREE.PlaneBufferGeometry(item.width * scale / imageScale, item.height * scale / imageScale),
                new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture(item.url, undefined, LOADSYNC.register()), blending: THREE.AdditiveBlending, transparent: true})
                );
            tmpMesh.position.set(scale *((i%2)*115 + 60), scale * (Math.floor(i/2)*85 + 85), 1);
            panel.addToScene(tmpMesh);

        }
            */

    }

    function render(time){
        panel.render(time);
    }

    function checkBounds(x, y){
        if(panel.checkBounds(x,y)){
            return "https://www.flickr.com/photos/45001949@N00/";
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

