function createPhotosPanel(renderer, scale){

   var STANDARD_DIMENSIONS = {width: 256, height:256};

   var width = STANDARD_DIMENSIONS.width * scale,
       height = STANDARD_DIMENSIONS.height * scale;

   var panel = createPanel(renderer, width, height);

   var icons = [];

   var picHeight = 70;

   function createTitleCanvas(){

       return panel.renderToCanvas(512, 160, function(ctx){
           ctx.strokeStyle="#fff";

           ctx.font = "24pt Roboto";
           ctx.fillStyle = '#ff8d07';
           ctx.fillText("RECENT PHOTOS", 50, 35);

           ctx.lineWidth = 2.5;
           ctx.strokeStyle="#fd5f00";
           ctx.moveTo(4,28);
           ctx.lineTo(4,60);
           ctx.lineTo(440,60);
           ctx.stroke();

           ctx.beginPath();
           ctx.fillStyle='#eac7df';
           ctx.arc(4, 28, 4, 0, 2 * Math.PI);
           ctx.fill();

           ctx.beginPath();
           ctx.arc(4, 60, 4, 0, 2 * Math.PI);
           ctx.fill();

           ctx.fillStyle='#fd5f00';
           ctx.beginPath();
           ctx.arc(380, 60, 4, 0, 2 * Math.PI);
           ctx.fill();

           ctx.fillStyle='#eac7df';
           ctx.beginPath();
           ctx.arc(440, 60, 4, 0, 2 * Math.PI);
           ctx.fill();

           ctx.beginPath();
           ctx.fillStyle='#336699';
           ctx.beginPath();
           ctx.moveTo(30, 18);
           ctx.lineTo(20, 28);
           ctx.lineTo(40, 28);
           ctx.fill();

       });

   };

    function init(){

        var titleCanvas= createTitleCanvas(); 
        var titleTexture = new THREE.Texture(titleCanvas)
        titleTexture.needsUpdate = true;

        var titleMaterial = new THREE.MeshBasicMaterial({map: titleTexture, transparent: true});
        var titleGeometry = new THREE.PlaneBufferGeometry( 256 * scale, 80 * scale );

        var plane = new THREE.Mesh( titleGeometry, titleMaterial );
        plane.position.set(width/2 + 7, height-40*scale, 0);
        panel.addToScene( plane );

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

