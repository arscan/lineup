
function createToolPanel(renderer, scale){

   var STANDARD_DIMENSIONS = {width: 460, height:287};

   var width = STANDARD_DIMENSIONS.width * scale,
       height = STANDARD_DIMENSIONS.height * scale;

   var panel = createPanel(renderer, width, height, {foregroundGlow: true});

   var toolBGPlane,
       coverPlane,
       pointerPlane;
   
   var started = false;

   var menuPlanes = [];

   var menu = [
           ["Languages", ["Javascript", "C#", "Java", "Go"]],
           ["Editors", ["Vim", "IntelliJ", "Visual Studio"]],
           ["Platforms", ["Modern Web", "Android"]],
           ["OS", ["Linux", "Windows"]]
       ];

   function createBackground(){

        var material = new THREE.MeshBasicMaterial({transparent: false, color: 0x000000});
        var geometry = new THREE.PlaneBufferGeometry( width, height);

        var plane = new THREE.Mesh( geometry, material );
        plane.position.set(width/2, height/2, -1);
        panel.addToScene( plane );
   };

   function createCoverPlane(){

        var material = new THREE.MeshBasicMaterial({transparent: false, color: 0x000000});
        var geometry = new THREE.PlaneBufferGeometry( 256 * scale, 100 * scale);

        var plane = new THREE.Mesh( geometry, material );
        plane.position.set(200 * scale, 110 * scale,2);
        panel.addToScene( plane );
        
        return plane;

   }

   function createTextPlane(text, header, orange){

       var titleCanvas =  panel.renderToCanvas(512, 160, function(ctx){
           ctx.strokeStyle="#eac7df";

           ctx.fillStyle = '#eac7df';
           ctx.font = "18pt Roboto";
           if(header){
               ctx.font = "26pt Roboto";

               if(orange){
                   ctx.fillStyle = '#f15a24';
               } else {
                   ctx.fillStyle = '#12b7a7';
               }
           }


           ctx.fillText(text.toUpperCase(), 50, 35);

       });

        var titleTexture = new THREE.Texture(titleCanvas)
        titleTexture.needsUpdate = true;

        var titleMaterial = new THREE.MeshBasicMaterial({map: titleTexture, transparent: true});
        var titleGeometry = new THREE.PlaneBufferGeometry( 256 * scale, 80 * scale);

        var plane = new THREE.Mesh( titleGeometry, titleMaterial );
        return plane;

   };

    function init(){
        createBackground();
        var toolTexture = THREE.ImageUtils.loadTexture('images/tools-foreground.png', undefined, LOADSYNC.register() );
        var toolMaterial = new THREE.MeshBasicMaterial({map: toolTexture, transparent: true});
        var toolGeometry = new THREE.PlaneBufferGeometry( 350 * scale, 350 * scale);
        toolPlane = new THREE.Mesh( toolGeometry, toolMaterial );
        toolPlane.position.set(width/2 + 45 * scale, height/2 - 40 * scale, 3);
        toolPlane.scale.set(.5,.5,.5);

        panel.addToScene( toolPlane );

        var toolBGTexture = THREE.ImageUtils.loadTexture('images/tools-background.png', undefined, LOADSYNC.register() );
        var toolBGMaterial = new THREE.MeshBasicMaterial({map: toolBGTexture, transparent: true, opacity: .9});
        var toolBGGeometry = new THREE.PlaneBufferGeometry( 350 * scale, 350 * scale);
        toolBGPlane = new THREE.Mesh( toolBGGeometry, toolBGMaterial );
        toolBGPlane.position.set(width/2 + 45 * scale, height/2 - 40 * scale, 2);
        toolBGPlane.scale.set(.6,.6,.6);

        panel.addToScene( toolBGPlane );

        var headerTexture = THREE.ImageUtils.loadTexture("images/tools-header.png", undefined, LOADSYNC.register() );
        var headerMaterial = new THREE.MeshBasicMaterial({map: headerTexture, depthTest: false, transparent: true});
        var headerGeometry = new THREE.PlaneBufferGeometry( 134 * scale, 32 * scale);
        var headerPlane = new THREE.Mesh(headerGeometry, headerMaterial );
        headerPlane.position.set(110 * scale, height - 100 * scale,5);
        panel.addToScene(headerPlane);
        
        var selectorTexture = THREE.ImageUtils.loadTexture("images/tools-selector.png", undefined, LOADSYNC.register() );
        var selectorMaterial = new THREE.MeshBasicMaterial({map: selectorTexture, depthTest: false, transparent: true});
        var selectorGeometry = new THREE.PlaneBufferGeometry( 392 * scale, 156 * scale);
        var selectorPlane = new THREE.Mesh(selectorGeometry, selectorMaterial );
        selectorPlane.position.set(181 * scale, height/2 - 22 * scale,5);
        selectorPlane.scale.set(.5, .5, .5);
        panel.addToScene(selectorPlane);

        var pointerTexture = THREE.ImageUtils.loadTexture("images/tools-pointer.png", undefined, LOADSYNC.register() );
        var pointerMaterial = new THREE.MeshBasicMaterial({map: pointerTexture, depthTest: false, transparent: true});
        var pointerGeometry = new THREE.PlaneBufferGeometry( 26 * scale, 30 * scale);
        pointerPlane = new THREE.Mesh(pointerGeometry, pointerMaterial );
        pointerPlane.position.set(75 * scale, 115 * scale,15);
        pointerPlane.scale.set(.5, .5, .5);
        panel.addToScene(pointerPlane);
        
        for(var i =0; i< menu.length; i++){
            var title = createTextPlane(menu[i][0], true, i%2);
            title.position.set(( 65 + 256/2) * scale, 60 * scale,0);
            if(i != 0){
                title.position.x = -1000;
            }
            panel.addToScene(title);


            menuPlanes[i] = [];
            menuPlanes[i].push(title);
            for(var j = 0; j < menu[i][1].length; j++){
                var unhighlightedTitle = createTextPlane(menu[i][1][j], false);
                unhighlightedTitle.position.set(( 65 + 256/2) * scale, 88 * scale + 15*j * scale,0);

                if(i != 0){
                    unhighlightedTitle.position.x = -1000;
                }

                panel.addToScene(unhighlightedTitle);

                menuPlanes[i].push(unhighlightedTitle);
            }
        }

        coverPlane = createCoverPlane();

    }


    function render(time){
        if(!started){

            var rotation = [];
            var sliders = [];
            var pointers = [];
            var previous = "";
            var unpackedMenu = [];
            var subIndex = 0;

            for(var i = 0; i< menu.length; i++){
                for(var j = 0; j < menu[i][1].length; j++){
                    unpackedMenu.push([menu[i][0], menu[i][1][j], i, j]);
                }
            }

            for(var i = 0; i< unpackedMenu.length; i++){
                rotation.push(new TWEEN.Tween(toolPlane.rotation)
                   .delay(1000)
                   .easing(TWEEN.Easing.Cubic.InOut)
                   .to({z: (2 * (i + 1) * Math.PI / unpackedMenu.length ) % (1.9999 * Math.PI)}, 500));

                pointers.push(new TWEEN.Tween(pointerPlane.position)
                        .to({y: 115 * scale + 15 * unpackedMenu[i][3] * scale}, 500)
                        .easing(TWEEN.Easing.Cubic.InOut)
                        .delay(1000));

                if(previous != unpackedMenu[i][0]){
                    sliders.push(new TWEEN.Tween(coverPlane.position)
                            .to({x:500 * scale}, 750));
                    sliders.push(new TWEEN.Tween(coverPlane.position)
                            .delay(menu[(sliders.length-1) / 2][1].length * 1500 - 1500)
                            .onComplete(function(index){ return function(){
                                console.log("DO SOME SWITCHING to " + index);
                                for(var layer = 0; layer<menuPlanes.length; layer++){ 
                                    for(var layerSub = 0; layerSub < menuPlanes[layer].length; layerSub++){
                                        if(layer === index){
                                            menuPlanes[layer][layerSub].position.x = (65 + 256/2) * scale;
                                        } else {
                                            menuPlanes[layer][layerSub].position.x = -1000;
                                        }

                                    }

                                }
                            }}((unpackedMenu[i][2] + 1) % menu.length))
                            .to({x:200 * scale}, 750));
                    if(sliders.length > 2){
                        sliders[sliders.length - 3].chain(sliders[sliders.length - 2]);
                    }

                    sliders[sliders.length - 2].chain(sliders[sliders.length - 1]);

                    previous = unpackedMenu[i][0];
                }


                if(i > 0){
                    rotation[i - 1].chain(rotation[i]);
                    pointers[i-1].chain(pointers[i]);
                }
            };

            // rotation.push(new TWEEN.Tween(toolPlane.rotation).delay(1000).easing(TWEEN.Easing.Cubic.InOut).to({z:0}, 500));
            // rotation[rotation.length - 2].chain(rotation[rotation.length - 1]);
            rotation[rotation.length - 1].chain(rotation[0]);
            pointers[pointers.length - 1].chain(pointers[0]);

            rotation[0].start();
            pointers[1].start();

            sliders[sliders.length - 1].chain(sliders[0]);
            sliders[0].start();

            started = true;

        }

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
