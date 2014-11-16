function createPhotosPanel(renderer, scale){

   var STANDARD_DIMENSIONS = {width: 256, height:256};

   var width = STANDARD_DIMENSIONS.width * scale,
       height = STANDARD_DIMENSIONS.height * scale;

   var panel = createPanel(renderer, width, height);

   var icons = [];

   var picHeight = 80;

   function createTitleCanvas(){

       return panel.renderToCanvas(512, 160, function(ctx){
           ctx.strokeStyle="#fff";

           ctx.font = "bold 28pt Roboto";
           ctx.fillStyle = '#ff8d07';
           ctx.fillText("PHOTOS", 25, 35);

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

    function init(){

        var titleCanvas= createTitleCanvas(); 
        var titleTexture = new THREE.Texture(titleCanvas)
        titleTexture.needsUpdate = true;

        var titleMaterial = new THREE.MeshBasicMaterial({map: titleTexture, transparent: true});
        var titleGeometry = new THREE.PlaneBufferGeometry( 256 * scale, 80 * scale );

        var plane = new THREE.Mesh( titleGeometry, titleMaterial );
        plane.position.set(width/2 + 7, height-40*scale, 0);
        panel.addToScene( plane );

        /*
        var twitterIconTexture = THREE.ImageUtils.loadTexture('images/twitter.png', undefined, LOADSYNC.register() );
        var twitterIconMaterial = new THREE.MeshBasicMaterial({map: twitterIconTexture, transparent: true, blending: THREE.AdditiveBlending});
        var twitterIconGeometry = new THREE.PlaneBufferGeometry( 30 * scale, 30*scale );
        var twitterIconPlane = new THREE.Mesh(twitterIconGeometry, twitterIconMaterial );
        twitterIconPlane.position.set(30*scale, 30*scale/2 + 4, 0);
        twitterIconPlane._gotg_url = "https://www.twitter.com/arscan/";
        icons.push(twitterIconPlane);
        panel.addToScene(twitterIconPlane);
       */
      var randomPics = FLICKR.getRandom(4);

        for(var i = 0; i< randomPics.length; i++){
            var item = randomPics[i];
            var imageScale = item.height / picHeight;
            console.log('----');
            console.log(item.height);
            console.log(item.width);
            console.log(imageScale);

            var tmpMesh = new THREE.Mesh(
                new THREE.PlaneBufferGeometry(item.width * scale / imageScale, item.height * scale / imageScale),
                new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture(item.url, undefined, LOADSYNC.register()), blending: THREE.AdditiveBlending, transparent: true})
                );
            tmpMesh.position.set((i%2)*200 + 100, Math.floor(i/2)*130 + 120, 1);
            panel.addToScene(tmpMesh);

        }

    }

    function render(time){
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

