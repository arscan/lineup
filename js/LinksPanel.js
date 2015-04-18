function createLinksPanel(renderer, scale){

   var STANDARD_DIMENSIONS = {width: 460, height:300};

   var width = STANDARD_DIMENSIONS.width * scale,
       height = STANDARD_DIMENSIONS.height * scale;

   var panel = createPanel(renderer, width, height, {foregroundGlow: true}),
       renderCamera; 

   var icons = [],
       sprites = [],
       graph = new THREE.Group,
       selection,
       // raycaster = new THREE.Raycaster(),
       mousePos;

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

   function createButton(path, url, x, y, z){

        var iconTexture = THREE.ImageUtils.loadTexture(path, undefined, LOADSYNC.register() );
        var iconMaterial = new THREE.MeshBasicMaterial({map: iconTexture, transparent: true, depthTest: false});
        var iconGeometry = new THREE.PlaneBufferGeometry( 30 * scale, 30*scale );
        var iconPlane = new THREE.Mesh(iconGeometry, iconMaterial );
        // iconPlane.position.set(70*scale, 70*scale/2 + 4, 0);
        iconPlane.position.set(x, y, z);
        iconPlane._gotg_url =url;
        icons.push(iconPlane);
        sprites.push(iconPlane)
        graph.add(iconPlane);
        // panel.addToScene(iconPlane);

   }

   function createHollowNode(x,y,z, iconSize){
        var iconTexture = THREE.ImageUtils.loadTexture("images/online-open-circle.png", undefined, LOADSYNC.register() );
        var iconMaterial = new THREE.MeshBasicMaterial({map: iconTexture, depthTest: false, transparent: true});
        var iconGeometry = new THREE.PlaneBufferGeometry( iconSize * scale, iconSize * scale );
        var iconPlane = new THREE.Mesh(iconGeometry, iconMaterial );
        iconPlane.position.set(x, y, z);
        sprites.push(iconPlane)
        // panel.addToScene(iconPlane);
        graph.add(iconPlane);
   }

   function createSolidNode(x,y,z, iconSize){
        var iconTexture = THREE.ImageUtils.loadTexture("images/online-closed-circle.png", undefined, LOADSYNC.register() );
        var iconMaterial = new THREE.MeshBasicMaterial({map: iconTexture, depthTest: false, transparent: true});
        var iconGeometry = new THREE.PlaneBufferGeometry( iconSize * scale, iconSize*scale );
        var iconPlane = new THREE.Mesh(iconGeometry, iconMaterial );
        iconPlane.position.set(x, y, z);
        sprites.push(iconPlane);
        graph.add(iconPlane);

        // panel.addToScene(iconPlane);
   }

   function createLegend(){
        var iconTexture = THREE.ImageUtils.loadTexture("images/links-legend.png", undefined, LOADSYNC.register() );
        var iconMaterial = new THREE.MeshBasicMaterial({map: iconTexture, depthTest: false, transparent: true});
        var iconGeometry = new THREE.PlaneBufferGeometry( 118 * scale, 58 * scale );
        var iconPlane = new THREE.Mesh(iconGeometry, iconMaterial );
        iconPlane.position.set(150, -75, 50);
        iconPlane.scale.set(.5, .5, .5);
        panel.addToScene(iconPlane);
   }

   function createHeader(){
        var iconTexture = THREE.ImageUtils.loadTexture("images/links-header.png", undefined, LOADSYNC.register() );
        var iconMaterial = new THREE.MeshBasicMaterial({map: iconTexture, depthTest: false, transparent: true});
        var iconGeometry = new THREE.PlaneBufferGeometry( 134 * scale, 32 * scale );
        var iconPlane = new THREE.Mesh(iconGeometry, iconMaterial );
        iconPlane.position.set(-160, 70, 50);
        iconPlane.scale.set(.5, .5, .5);
        panel.addToScene(iconPlane);
   }

   function createSelectBackground(){
        var iconTexture = THREE.ImageUtils.loadTexture("images/links-select-background.png", undefined, LOADSYNC.register() );
        var iconMaterial = new THREE.MeshBasicMaterial({map: iconTexture, depthTest: false, transparent: true});
        var iconGeometry = new THREE.PlaneBufferGeometry( 163 * scale, 39 * scale );
        var iconPlane = new THREE.Mesh(iconGeometry, iconMaterial );
        iconPlane.position.set(-150, -82, 50);
        iconPlane.scale.set(.5, .5, .5);
        panel.addToScene(iconPlane);
   }

   function createSelectForeground(icon){
        var iconTexture = THREE.ImageUtils.loadTexture(icon, undefined, LOADSYNC.register() );
        var iconMaterial = new THREE.MeshBasicMaterial({map: iconTexture, depthTest: false, transparent: true});
        var iconGeometry = new THREE.PlaneBufferGeometry( 131 * scale, 17 * scale );
        var iconPlane = new THREE.Mesh(iconGeometry, iconMaterial );
        iconPlane.position.set(-161, -78, 50);
        iconPlane.scale.set(.5, .5, .5);
        panel.addToScene(iconPlane);

        return function(on){
            if(on){
                iconPlane.position.z = 51;
            } else {
                console.log('set z to 49');
                iconPlane.position.z = 49;
            }
        }
   }

    function init(){

        renderCamera = new THREE.PerspectiveCamera( 70, width / height, 1, 1000 );
        renderCamera.position.z = 250;
        renderCamera.position.y = 0;

        panel.setCamera(renderCamera);

        // var titleCanvas= createTitleCanvas(); 
        // var titleTexture = new THREE.Texture(titleCanvas)
        // titleTexture.needsUpdate = true;

        // var titleMaterial = new THREE.MeshBasicMaterial({map: titleTexture, transparent: true});
        // var titleGeometry = new THREE.PlaneBufferGeometry( 256 * scale, 80 * scale );

        // var plane = new THREE.Mesh( titleGeometry, titleMaterial );
        // plane.position.set(width/2 + 7, height-40*scale, 0);
        // panel.addToScene(plane);

        var geometry = new THREE.PlaneGeometry( 1000, 1000);
        var material = new THREE.MeshBasicMaterial( {color: 0x000000} );
        var plane = new THREE.Mesh( geometry, material );
        plane.position.set(0, 0, -100);
        panel.addToScene( plane );

        createLegend();
        createHeader();

        createSelectBackground();

        selection = {
           setTwitter : createSelectForeground("images/links-text-twitter.png"),
           setHome : createSelectForeground("images/links-text-home.png"),
           setGithub : createSelectForeground("images/links-text-github.png"),
           setFlickr : createSelectForeground("images/links-text-flickr.png"),
           setLinkedIn : createSelectForeground("images/links-text-linkedin.png"),
           setSelect : createSelectForeground("images/links-text-select.png"),
           setCover: createSelectForeground("images/links-text-cover.png")
        };

        selection.setHome(false);
        selection.setGithub(false);
        selection.setFlickr(false);
        selection.setLinkedIn(false);
        selection.setTwitter(true);
        selection.setSelect(false);


        createButton('images/online-linkedin.png', 'https://www.linkedin.com/in/robscanlon/', -100, -30, 0);
        createButton('images/online-twitter.png', 'https://www.twitter.com/arscan/', -50, 20, 0);
        createButton('images/online-github.png', 'https://www.github.com/arscan/', 60, 30, 0);
        createButton('images/online-flickr.png', 'https://www.flickr.com/photos/45001949@N00', 110, -30, 0);
        createButton('images/online-home.png', 'http://www.robscanlon.com/', 130, 50, 0);

        createSolidNode(-172, -3, -80, 12);
        createSolidNode(-150, -25, -10, 12);
        createHollowNode(-120, 25, 10, 12);
        createHollowNode(-170, -5, 0, 12);
        createHollowNode(-180, -45, -50, 12);
        createHollowNode(-40, -40, 50, 10);
        // createSolidNode(-5, -10, -15, 10);

        createHollowNode(0, -20, -10, 15);
        createHollowNode(0, -60, -20, 15);
        createSolidNode(-30, -65, -40, 13);
        createSolidNode(-10, -85, -40, 8);

        createSolidNode(10, 30, 0, 13);
        createHollowNode(-5, 8, -20, 10);
        createHollowNode(-8, 58, -20, 11);
        createHollowNode(-18, 38, -20, 9);
        createHollowNode(18, 55, 0, 9);
        createHollowNode(7, 75, 10, 9);

        createSolidNode(50, -50, -20, 13);
        createHollowNode(60, -60, 10, 9);

        createSolidNode(120, 10, -10, 9);
        createSolidNode(160, 10, -10, 11);
        createHollowNode(170, -30, -20, 11);
        createHollowNode(180, -30, 10, 11);
        createHollowNode(200, 40, -20, 11);


        var splineGeometry = new THREE.Geometry();
        var splineMaterial = new THREE.LineBasicMaterial({color: 0x6FC0BA, linewidth: 3});

        splineGeometry.vertices.push(new THREE.Vector3(-120, 25, 10));
        splineGeometry.vertices.push(new THREE.Vector3(-172, -3, -80));
        splineGeometry.vertices.push(new THREE.Vector3(-150, -25, -10));
        splineGeometry.vertices.push(new THREE.Vector3(-170, -5, 0));
        splineGeometry.vertices.push(new THREE.Vector3(-150, -25, -10));
        splineGeometry.vertices.push(new THREE.Vector3(-180, -45, -50));
        splineGeometry.vertices.push(new THREE.Vector3(-150, -25, -10));
        splineGeometry.vertices.push(new THREE.Vector3(-100, -30, 0));
        splineGeometry.vertices.push(new THREE.Vector3(-40, -40, 50));
        splineGeometry.vertices.push(new THREE.Vector3(-100, -30, 0));
        splineGeometry.vertices.push(new THREE.Vector3(-50, 20, 0));
        splineGeometry.vertices.push(new THREE.Vector3(-172, -3, -80));
        splineGeometry.vertices.push(new THREE.Vector3(-50, 20, 0));
        splineGeometry.vertices.push(new THREE.Vector3(0, -20, -10));
        splineGeometry.vertices.push(new THREE.Vector3(0, -60, -20));
        splineGeometry.vertices.push(new THREE.Vector3(-30, -65, -40));
        splineGeometry.vertices.push(new THREE.Vector3(0, -60, -20));
        splineGeometry.vertices.push(new THREE.Vector3(-10, -85, -40));
        splineGeometry.vertices.push(new THREE.Vector3(0, -60, -20));
        splineGeometry.vertices.push(new THREE.Vector3(-50, 20, 0));
        splineGeometry.vertices.push(new THREE.Vector3(0, -20, -10));
        splineGeometry.vertices.push(new THREE.Vector3(10, 30, 0));
        splineGeometry.vertices.push(new THREE.Vector3(-5, 8, -20));
        splineGeometry.vertices.push(new THREE.Vector3(10, 30, 0));
        splineGeometry.vertices.push(new THREE.Vector3(7, 75, 10));
        splineGeometry.vertices.push(new THREE.Vector3(10, 30, 0));
        splineGeometry.vertices.push(new THREE.Vector3(-8, 58, -20));
        splineGeometry.vertices.push(new THREE.Vector3(-18, 38, -20));
        splineGeometry.vertices.push(new THREE.Vector3(-8, 58, -20));
        splineGeometry.vertices.push(new THREE.Vector3(18, 55, 0));
        splineGeometry.vertices.push(new THREE.Vector3(50, -50, -20));
        splineGeometry.vertices.push(new THREE.Vector3(60, -60, 10));
        splineGeometry.vertices.push(new THREE.Vector3(50, -50, -20));
        splineGeometry.vertices.push(new THREE.Vector3(0, -60, -20));
        splineGeometry.vertices.push(new THREE.Vector3(50, -50, -20));
        splineGeometry.vertices.push(new THREE.Vector3(60, 30, 0));
        splineGeometry.vertices.push(new THREE.Vector3(120, 10, -10));
        splineGeometry.vertices.push(new THREE.Vector3(130, 50, 0));
        splineGeometry.vertices.push(new THREE.Vector3(160, 10, -10));
        splineGeometry.vertices.push(new THREE.Vector3(120, 10, -10));
        splineGeometry.vertices.push(new THREE.Vector3(130, 50, 0));
        splineGeometry.vertices.push(new THREE.Vector3(170, -30, -20));
        splineGeometry.vertices.push(new THREE.Vector3(180, -30, 10));
        splineGeometry.vertices.push(new THREE.Vector3(170, -30, -20));
        splineGeometry.vertices.push(new THREE.Vector3(110, -30, 0));
        splineGeometry.vertices.push(new THREE.Vector3(200, 40, -20));


        splineGeometry.verticesNeedUpdate = true;
        var splineLine = new THREE.Line(splineGeometry, splineMaterial);
        graph.add(splineLine);
        panel.addToScene(graph);
        // panel.addToScene(splineLine);
        console.log("done");

    }

    function checkBounds(x,y){
        if(!panel.checkBounds(x,y)){
            return false;
        }

        mousePos = panel.positionWithinPanel(x,y);

        // if(pos.y > 250){
        //     selection.setHome(true);
        //     selection.setTwitter(false);

        // } else {
        //     selection.setHome(false);
        //     selection.setTwitter(true);

        // }

        /*
        for(var i = 0; i< icons.length; i++){
            if(pos.x > icons[i].position.x - 30 && pos.x < icons[i].position.x + 30
                    && pos.y > icons[i].position.y - 30 && pos.y < icons[i].position.y + 30){
                return icons[i]._gotg_url;

            }

        }
        */
        return false;
    }

    function render(time){
        panel.render(time);

        var center = {x: 120, y: 160}
            radius = 50;

        graph.rotation.x = time;
        for(var i = 0; i< sprites.length; i++){
            sprites[i].rotation.x = -time;
            // sprites[i].lookAt(new THREE.Vector3(sprites[i].position.x, graph.position.y, graph.position.z));
        }

        // raycaster.setFromCamera( mousePos, renderCamera );

        // var intersects = raycaster.intersectObjects( graph);
        // console.log(intersects);

        // graph.position.y = Math.sin(Math.sin(time/3)/2) * 210;
        // graph.position.z = Math.cos(Math.sin(time/3)/2) * 210;
        // renderCamera.lookAt(new THREE.Vector3(0, 0, 0));

        // for(var i = 0; i< sprites.length; i++){
        //     sprites[i].lookAt(new THREE.Vector3(sprites[i].position.x, graph.position.y, graph.position.z));
        // }

        // var newRadius = radius * (Math.sin(time) + 2.5) / 2.5;
        // var newCenter = {x: center.x + Math.sin(time)*10, y: center.y + Math.cos(time)*10};

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

