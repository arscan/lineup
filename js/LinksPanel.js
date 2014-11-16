function createLinksPanel(renderer, scale){

   var STANDARD_DIMENSIONS = {width: 256, height:256};

   var width = STANDARD_DIMENSIONS.width * scale,
       height = STANDARD_DIMENSIONS.height * scale;

   var panel = createPanel(renderer, width, height);

   var icons = [];

   function createTitleCanvas(){

       return panel.renderToCanvas(512, 160, function(ctx){
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

    function init(){

        var titleCanvas= createTitleCanvas(); 
        var titleTexture = new THREE.Texture(titleCanvas)
        titleTexture.needsUpdate = true;

        var titleMaterial = new THREE.MeshBasicMaterial({map: titleTexture, transparent: true});
        var titleGeometry = new THREE.PlaneBufferGeometry( 256 * scale, 80 * scale );

        var plane = new THREE.Mesh( titleGeometry, titleMaterial );
        plane.position.set(width/2 + 7, height-40*scale, 0);
        // panel.addToScene( plane );

        var twitterIconTexture = THREE.ImageUtils.loadTexture('images/twitter.png', undefined, LOADSYNC.register() );
        var twitterIconMaterial = new THREE.MeshBasicMaterial({map: twitterIconTexture, transparent: true, blending: THREE.AdditiveBlending});
        var twitterIconGeometry = new THREE.PlaneBufferGeometry( 30 * scale, 30*scale );
        var twitterIconPlane = new THREE.Mesh(twitterIconGeometry, twitterIconMaterial );
        twitterIconPlane.position.set(30*scale, 30*scale/2 + 4, 0);
        twitterIconPlane._gotg_url = "https://www.twitter.com/arscan/";
        icons.push(twitterIconPlane);
        panel.addToScene(twitterIconPlane);

        var githubIconTexture = THREE.ImageUtils.loadTexture('images/github.png', undefined, LOADSYNC.register() );
        var githubIconMaterial = new THREE.MeshBasicMaterial({map: githubIconTexture, transparent: true, blending: THREE.AdditiveBlending});
        var githubIconGeometry = new THREE.PlaneBufferGeometry( 30 * scale, 30 * scale);
        var githubIconPlane = new THREE.Mesh(githubIconGeometry, githubIconMaterial );
        githubIconPlane.position.set(width/2 + 30 * scale / 2 + 5, 30*scale/2 + 2, 0);
        githubIconPlane._gotg_url = "https://www.github.com/arscan/";
        icons.push(githubIconPlane);
        panel.addToScene(githubIconPlane);

        var linkedInIconTexture = THREE.ImageUtils.loadTexture('images/linkedin.png', undefined, LOADSYNC.register() );
        var linkedInIconMaterial = new THREE.MeshBasicMaterial({map: linkedInIconTexture, transparent: true, blending: THREE.AdditiveBlending});
        var linkedInIconGeometry = new THREE.PlaneBufferGeometry( 30 * scale, 30 * scale);
        var linkedInIconPlane = new THREE.Mesh(linkedInIconGeometry, linkedInIconMaterial );
        linkedInIconPlane.position.set(width/2 + 30 * scale / 2 + 5, 100 + 30*scale/2 + 2, 0);
        linkedInIconPlane._gotg_url = "https://www.linkedin.com/robscanlon/";
        icons.push(linkedInIconPlane);
        panel.addToScene(linkedInIconPlane);

        var flickrIconTexture = THREE.ImageUtils.loadTexture('images/flickr.png', undefined, LOADSYNC.register() );
        var flickrIconMaterial = new THREE.MeshBasicMaterial({map: flickrIconTexture, transparent: true, blending: THREE.AdditiveBlending});
        var flickrIconGeometry = new THREE.PlaneBufferGeometry( 30 * scale, 30 * scale);
        var flickrIconPlane = new THREE.Mesh(flickrIconGeometry, flickrIconMaterial );
        flickrIconPlane.position.set(width/4 + 20 * scale / 2 + 5, 100 + 30*scale/2 + 2, 0);
        flickrIconPlane._gotg_url = "https://www.flickr.com/photos/45001949@N00/";
        icons.push(flickrIconPlane);
        panel.addToScene(flickrIconPlane);

        var homeIconTexture = THREE.ImageUtils.loadTexture('images/home.png', undefined, LOADSYNC.register() );
        var homeIconMaterial = new THREE.MeshBasicMaterial({map: homeIconTexture, transparent: true, blending: THREE.AdditiveBlending});
        var homeIconGeometry = new THREE.PlaneBufferGeometry( 30 * scale, 30 * scale);
        var homeIconPlane = new THREE.Mesh(homeIconGeometry, homeIconMaterial );
        homeIconPlane.position.set(width/2 + 20 * scale / 2 + 5, 200 + 30*scale/2 + 2, 0);
        homeIconPlane._gotg_url = "https://www.robscanlon.com/";
        icons.push(homeIconPlane);
        panel.addToScene(homeIconPlane);



    }

    function render(time){
        panel.render(time);

        var center = {x: width / 2, y: height / 2},
            radius = 90;

        var newRadius = radius * (Math.sin(time) + 2.5) / 2.5;
        var newCenter = {x: center.x + Math.sin(time)*30, y: center.y + Math.cos(time)*30};

        for(var i = 0; i< icons.length; i++){
            icons[i].position.set(newCenter.x + newRadius * Math.sin((i / icons.length) * Math.PI * 2 + time), newCenter.y + newRadius * Math.cos((i / icons.length) * Math.PI * 2 + time), 1);

        }
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

