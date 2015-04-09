function createLinksPanel(renderer, scale){

   var STANDARD_DIMENSIONS = {width: 256, height:256};

   var width = STANDARD_DIMENSIONS.width * scale,
       height = STANDARD_DIMENSIONS.height * scale;

   var panel = createPanel(renderer, width, height),
       renderCamera;

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

   function createButton(path, url){

        var iconTexture = THREE.ImageUtils.loadTexture(path, undefined, LOADSYNC.register() );
        var iconMaterial = new THREE.MeshBasicMaterial({map: iconTexture, transparent: true, blending: THREE.AdditiveBlending});
        var iconGeometry = new THREE.PlaneBufferGeometry( 30 * scale, 30*scale );
        var iconPlane = new THREE.Mesh(iconGeometry, iconMaterial );
        // iconPlane.position.set(70*scale, 70*scale/2 + 4, 0);
        iconPlane.position.set(0, 0, 0);
        iconPlane._gotg_url =url;
        icons.push(iconPlane);
        panel.addToScene(iconPlane);

   }

    function init(){

        renderCamera = new THREE.PerspectiveCamera( 70, width / height, 1, 1000 );
        renderCamera.position.z = 200;
        renderCamera.position.y = 0;

        panel.setCamera(renderCamera);

        var titleCanvas= createTitleCanvas(); 
        var titleTexture = new THREE.Texture(titleCanvas)
        titleTexture.needsUpdate = true;

        var titleMaterial = new THREE.MeshBasicMaterial({map: titleTexture, transparent: true});
        var titleGeometry = new THREE.PlaneBufferGeometry( 256 * scale, 80 * scale );

        var plane = new THREE.Mesh( titleGeometry, titleMaterial );
        plane.position.set(width/2 + 7, height-40*scale, 0);
        // panel.addToScene( plane );

        console.log('creating');
        createButton('images/online-twitter.png', 'https://www.twitter.com/arscan/');
        createButton('images/online-github.png', 'https://www.github.com/arscan/');
        createButton('images/online-linkedin.png', 'https://www.linkedin.com/in/robscanlon/');
        createButton('images/online-home.png', 'http://www.robscanlon.com/');
        createButton('images/online-flickr.png', 'https://www.flickr.com/photos/45001949@N00');

    }

    function checkBounds(x,y){
        if(!panel.checkBounds(x,y)){
            return false;
        }

        var pos = panel.positionWithinPanel(x,y);
        pos.y = pos.y;

        for(var i = 0; i< icons.length; i++){
            if(pos.x > icons[i].position.x - 30 && pos.x < icons[i].position.x + 30
                    && pos.y > icons[i].position.y - 30 && pos.y < icons[i].position.y + 30){
                return icons[i]._gotg_url;

            }

        }
        return false;
    }

    function render(time){
        panel.render(time);

        var center = {x: 120, y: 160},
            radius = 50;

        var newRadius = radius * (Math.sin(time) + 2.5) / 2.5;
        var newCenter = {x: center.x + Math.sin(time)*10, y: center.y + Math.cos(time)*10};

        // for(var i = 0; i< icons.length; i++){
        //     icons[i].position.set(scale * (newCenter.x + newRadius * Math.sin((i / icons.length) * Math.PI * 2 + time)), scale * (newCenter.y + newRadius * Math.cos((i / icons.length) * Math.PI * 2 + time)), 1);

        // }
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

