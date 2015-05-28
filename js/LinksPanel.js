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
       highlight = null,
       showSelectionText;


   function createPointCloud(){
       var geometry = new THREE.Geometry();

       var sprite = THREE.ImageUtils.loadTexture( "images/links-particles.png", undefined, LOADSYNC.register() );

       for (var  i = -150; i < 200; i+=30  ) {
           for(var j = -100; j< 100; j+=30){
               for(var k = -100; k< 100; k+= 30){
                   if(Math.sqrt(j * j + k * k) <= 90){
                       geometry.vertices.push( new THREE.Vector3(i, j, k) );
                   }
               }
           }
       }

       var material = new THREE.PointCloudMaterial( { opacity: .2, size: 3, map: sprite, transparent: true } );

       var particles = new THREE.PointCloud( geometry, material );
       graph.add( particles );
   }

   function createButton(path, url, x, y, z, setTextFn){
        var iconTexture = THREE.ImageUtils.loadTexture(path, undefined, LOADSYNC.register() );
        var iconMaterial = new THREE.MeshBasicMaterial({map: iconTexture, transparent: true, depthTest: false});
        var iconGeometry = new THREE.PlaneBufferGeometry( 40, 40);
        var iconPlane = new THREE.Mesh(iconGeometry, iconMaterial );
        iconPlane.position.set(x, y, z);
        iconPlane._gotg_url =url;
        iconPlane._gotg_settext = setTextFn;
        icons.push(iconPlane);
        sprites.push(iconPlane)
        graph.add(iconPlane);
   }

   function createHighlight(){
        var iconTexture = THREE.ImageUtils.loadTexture('images/online-highlighted.png', undefined, LOADSYNC.register() );
        var iconMaterial = new THREE.MeshBasicMaterial({map: iconTexture, transparent: true, depthTest: false, blending: THREE.AdditiveBlending});
        var iconGeometry = new THREE.PlaneBufferGeometry( 40, 40);
        var iconPlane = new THREE.Mesh(iconGeometry, iconMaterial );
        var currentObject = null;
        iconPlane.position.set(-500, 0, 0);
        panel.addToScene(iconPlane);

        return {
            setHighlight: function(object){
                showSelectionText(false);
                if(currentObject && currentObject.uuid != object.uuid){
                    currentObject._gotg_settext(false);
                }
                currentObject = object;
                currentObject._gotg_settext(true);
            },
            coverHighlight: function(rotation){
                if(currentObject){
                    iconPlane.position.set(currentObject.position.x, currentObject.position.y, currentObject.position.z);
                    iconPlane.position.setFromMatrixPosition(currentObject.matrixWorld);
                    iconPlane.position.z += 1;
                }
            },
            clearHighlight: function(){
                iconPlane.position.set(-500, 0, 0);
                if(currentObject){
                    currentObject._gotg_settext(false);
                }
                currentObject = null;

            }
        }
   }

   function createHollowNode(x,y,z, iconSize){
        var iconTexture = THREE.ImageUtils.loadTexture("images/online-open-circle.png", undefined, LOADSYNC.register() );
        var iconMaterial = new THREE.MeshBasicMaterial({map: iconTexture, depthTest: false, transparent: true});
        var iconGeometry = new THREE.PlaneBufferGeometry( iconSize, iconSize);
        var iconPlane = new THREE.Mesh(iconGeometry, iconMaterial );
        iconPlane.position.set(x, y, z);
        sprites.push(iconPlane)
        // panel.addToScene(iconPlane);
        graph.add(iconPlane);
   }

   function createSolidNode(x,y,z, iconSize){
        var iconTexture = THREE.ImageUtils.loadTexture("images/online-closed-circle.png", undefined, LOADSYNC.register() );
        var iconMaterial = new THREE.MeshBasicMaterial({map: iconTexture, depthTest: false, transparent: true});
        var iconGeometry = new THREE.PlaneBufferGeometry( iconSize, iconSize);
        var iconPlane = new THREE.Mesh(iconGeometry, iconMaterial );
        iconPlane.position.set(x, y, z);
        sprites.push(iconPlane);
        graph.add(iconPlane);

        // panel.addToScene(iconPlane);
   }

   function createLegend(){
        var iconTexture = THREE.ImageUtils.loadTexture("images/links-legend.png", undefined, LOADSYNC.register() );
        var iconMaterial = new THREE.MeshBasicMaterial({map: iconTexture, depthTest: false, transparent: true});
        var iconGeometry = new THREE.PlaneBufferGeometry( 118 * 1.2, 58 * 1.2);
        var iconPlane = new THREE.Mesh(iconGeometry, iconMaterial );
        iconPlane.position.set(150, -75, 50);
        iconPlane.scale.set(.5, .5, .5);
        panel.addToScene(iconPlane);
   }

   function createHeader(){
        var iconTexture = THREE.ImageUtils.loadTexture("images/links-header.png", undefined, LOADSYNC.register() );
        var iconMaterial = new THREE.MeshBasicMaterial({map: iconTexture, depthTest: false, transparent: true});
        var iconGeometry = new THREE.PlaneBufferGeometry( 134 * 1.2, 32 * 1.2);
        var iconPlane = new THREE.Mesh(iconGeometry, iconMaterial );
        iconPlane.position.set(-130, 70, 50);
        iconPlane.scale.set(.8, .8, .8);
        panel.addToScene(iconPlane);
   }

   function createSelectBackground(){
        var iconTexture = THREE.ImageUtils.loadTexture("images/links-select-background.png", undefined, LOADSYNC.register() );
        var iconMaterial = new THREE.MeshBasicMaterial({map: iconTexture, depthTest: false, transparent: true});
        var iconGeometry = new THREE.PlaneBufferGeometry( 163 * 1.25, 39 * 1.25);
        var iconPlane = new THREE.Mesh(iconGeometry, iconMaterial );
        iconPlane.position.set(-150, -82, 50);
        iconPlane.scale.set(.5, .5, .5);
        panel.addToScene(iconPlane);
   }

   function createSelectForeground(icon){
        var iconTexture = THREE.ImageUtils.loadTexture(icon, undefined, LOADSYNC.register() );
        var iconMaterial = new THREE.MeshBasicMaterial({map: iconTexture, depthTest: false, transparent: true});
        var iconGeometry = new THREE.PlaneBufferGeometry( 131 * 1.2, 17 * 1.2);
        var iconPlane = new THREE.Mesh(iconGeometry, iconMaterial );
        iconPlane.position.set(-161, -77, 49);
        iconPlane.scale.set(.5, .5, .5);
        panel.addToScene(iconPlane);

        return function(on){
            if(on){
                iconPlane.position.z = 51;
            } else {
                iconPlane.position.z = 49;
            }
        }
   }

   function createClearForeground(){
        var iconTexture = THREE.ImageUtils.loadTexture("images/links-text-cover.png", undefined, LOADSYNC.register() );
        var iconMaterial = new THREE.MeshBasicMaterial({map: iconTexture, depthTest: false, transparent: true});
        var iconGeometry = new THREE.PlaneBufferGeometry( 131 * 1.2, 17 * 1.2);
        var iconPlane = new THREE.Mesh(iconGeometry, iconMaterial );
        iconPlane.position.set(-161, -78, 50);
        iconPlane.scale.set(.5, .5, .5);
        panel.addToScene(iconPlane);

   }

    function init(){

        renderCamera = new THREE.PerspectiveCamera( 70, width / height, 1, 1000 );
        renderCamera.position.z = 250;
        renderCamera.position.y = 0;

        panel.setCamera(renderCamera);

        var geometry = new THREE.PlaneGeometry( 1000, 1000);
        var material = new THREE.MeshBasicMaterial( {color: 0x000000} );
        var plane = new THREE.Mesh( geometry, material );
        plane.position.set(0, 0, -100);
        panel.addToScene( plane );

        // createPointCloud();
        createLegend();
        createHeader();

        createSelectBackground();

        showSelectionText = createSelectForeground("images/links-text-select.png");
        showSelectionText(true);

        createClearForeground();

        createButton('images/online-linkedin.png', 'https://www.linkedin.com/in/robscanlon/', -100, -30, 0, createSelectForeground("images/links-text-linkedin.png"));
        createButton('images/online-twitter.png', 'https://www.twitter.com/arscan/', -50, 20, 0, createSelectForeground("images/links-text-twitter.png"));
        createButton('images/online-github.png', 'https://www.github.com/arscan/', 60, 30, 0, createSelectForeground("images/links-text-github.png"));
        createButton('images/online-flickr.png', 'https://www.flickr.com/photos/45001949@N00', 110, -30, 0, createSelectForeground("images/links-text-flickr.png"));
        createButton('images/online-home.png', 'http://www.robscanlon.com/', 130, 50, 0, createSelectForeground("images/links-text-home.png"));

        highlight = createHighlight();

        // createSolidNode(-172, -3, -80, 12);
        createSolidNode(-142, 30, -20, 16);
        createSolidNode(-150, -25, -10, 16);
        createHollowNode(-120, 25, 10, 16);
        createHollowNode(-170, -5, 0, 16);
        createHollowNode(-140, -25, -50, 16);
        createHollowNode(-40, -40, 50, 14);

        createHollowNode(0, -20, -10, 15);
        createHollowNode(0, -60, -20, 15);
        createSolidNode(-30, -65, -40, 13);
        createSolidNode(-10, -85, -40, 8);

        createSolidNode(10, 30, 0, 15);
        createHollowNode(-5, 8, -20, 10);
        createHollowNode(-8, 58, -20, 11);
        createHollowNode(-18, 38, -20, 9);
        createHollowNode(18, 55, 0, 9);
        createHollowNode(7, 75, 10, 9);

        createSolidNode(50, -50, -20, 13);
        createHollowNode(60, -60, 10, 9);

        createSolidNode(120, 10, -10, 9);
        createSolidNode(160, 10, -10, 15);
        createHollowNode(170, -30, -20, 15);
        createHollowNode(180, -30, 10, 15);
        createHollowNode(200, 40, -20, 15);


        var splineGeometry = new THREE.Geometry();
        var splineMaterial = new THREE.LineBasicMaterial({color: 0x6FC0BA, linewidth: 1});

        splineGeometry.vertices.push(new THREE.Vector3(-120, 25, 10));
        splineGeometry.vertices.push(new THREE.Vector3(-142, 30, -20));
        splineGeometry.vertices.push(new THREE.Vector3(-150, -25, -10));
        splineGeometry.vertices.push(new THREE.Vector3(-170, -5, 0));
        splineGeometry.vertices.push(new THREE.Vector3(-150, -25, -10));
        splineGeometry.vertices.push(new THREE.Vector3(-140, -25, -50));
        splineGeometry.vertices.push(new THREE.Vector3(-150, -25, -10));
        splineGeometry.vertices.push(new THREE.Vector3(-100, -30, 0));
        splineGeometry.vertices.push(new THREE.Vector3(-40, -40, 50));
        splineGeometry.vertices.push(new THREE.Vector3(-100, -30, 0));
        splineGeometry.vertices.push(new THREE.Vector3(-50, 20, 0));
        splineGeometry.vertices.push(new THREE.Vector3(-142, 30, -20));
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


        var rotation = [];

        rotation.push(new TWEEN.Tween(graph.rotation)
                .delay(1000)
                .easing(TWEEN.Easing.Cubic.InOut)
                .onUpdate(function(){
                    for(var i = 0; i< sprites.length; i++){
                        sprites[i].rotation.x = -this.x;
                    }
                })
                .to({x: Math.PI / 4 }));
        rotation.push(new TWEEN.Tween(graph.rotation)
                .easing(TWEEN.Easing.Cubic.InOut)
                .onUpdate(function(){
                    for(var i = 0; i< sprites.length; i++){
                        sprites[i].rotation.x = -this.x;
                    }
                })
                .delay(1000)
                .to({x: -Math.PI/40}));

        for(var i = 0; i< rotation.length; i++){
            if(i > 0){
                rotation[i-1].chain(rotation[i]);
            }
        }
        rotation[rotation.length - 1].chain(rotation[0]);
        rotation[0].start();
    }

    function checkBounds(x,y){
        if(!panel.checkBounds(x,y)){
            mousePos = null;
            return false;
        }
        var raycaster = new THREE.Raycaster(),
            pos = panel.positionWithinPanel(x,y);

        mousePos = new THREE.Vector2(2 * pos.x / width - 1, 2 * pos.y/height - 1);
        raycaster.setFromCamera( mousePos, renderCamera );

        var intersects = raycaster.intersectObjects( icons);

        if(intersects.length > 0){
            for(var i = 0; i< intersects.length; i++){
                if(intersects[i].object._gotg_url){
                    highlight.setHighlight(intersects[0].object);
                    return intersects[0].object._gotg_url;
                }
            }
        }

        highlight.clearHighlight();
        showSelectionText(true);

        return false;
    }

    function render(time){
        panel.render(time);

        var center = {x: 120, y: 160}
            radius = 50;

        // graph.rotation.x = time/2;
        // for(var i = 0; i< sprites.length; i++){
        //     sprites[i].rotation.x = -time/2;
        // }
        if(highlight){
            highlight.coverHighlight(time/2);

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
        checkBounds: checkBounds,
        setBlur: panel.setBlur,
        setPosition: panel.setPosition
    });
}

