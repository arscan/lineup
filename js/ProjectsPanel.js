function createProjectsPanel(renderer, scale){

   var STANDARD_DIMENSIONS = {width: 460, height:287};

   var width = STANDARD_DIMENSIONS.width * scale,
       height = STANDARD_DIMENSIONS.height * scale,
       renderCamera;

   var panel = createPanel(renderer, width, height, {foregroundGlow: true});

   var encomGlobe,
       encomBoardroom,
       hexasphere,
       githubWargames;

   var menu = [
               {title: "ENCOM BOARDROOM", pic: "images/projects-encom-boardroom.png", url: "http://www.github.com/arscan/encom-boardroom"},
               {title: "ENCOM GLOBE", pic: "images/projects-encom-boardroom.png", url: "http://www.github.com/arscan/encom-boardroom"},
               {title: "GITHUB WARGAMES", pic: "images/projects-encom-boardroom.png", url: "http://www.github.com/arscan/encom-boardroom"},
               {title: "PLEASEROTATE.JS", pic: "images/projects-encom-boardroom.png", url: "http://www.github.com/arscan/encom-boardroom"}
              ];


    function createTextPlane(text, header){
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


    }
    function buildMenu(){
        for(var i = 0; i< menu.length; i++){
            var leftPlane = createTextPlane(menu[i].title);
            leftPlane.position.set(170 * scale, height - 110*scale - 20*scale*i, 0);
            panel.addToScene(leftPlane);

            var rightPlane = createTextPlane(menu[i].title);
            rightPlane.position.set(350 * scale, 30*scale, 0);
            panel.addToScene(rightPlane);

        }
    }

    function init(){

        var backgroundTexture = THREE.ImageUtils.loadTexture("images/projects-background.png", undefined, LOADSYNC.register() );
        var backgroundMaterial = new THREE.MeshBasicMaterial({map: backgroundTexture, depthTest: false, transparent: true});
        var backgroundGeometry = new THREE.PlaneBufferGeometry( 776 * scale, 494 * scale);
        var backgroundPlane = new THREE.Mesh(backgroundGeometry, backgroundMaterial );
        backgroundPlane.scale.set(.5,.5,.5);
        // headerPlane.position.set(108 * scale, height - 90 * scale,5);
        backgroundPlane.position.set(width/2, height/2, 0);
        panel.addToScene(backgroundPlane);

        buildMenu();

    }

    function render(time){

        // encomBoardroom.render();
        // encomGlobe.render();
        // githubWargames.render();

        panel.render(time);

    }

    function checkBounds(x, y){
        if(panel.checkBounds(x,y)){
            var panelPos = panel.positionWithinPanel(x, y);

            if(panelPos.y > 160*scale && panelPos.y < 270*scale){
                return "http://www.robscanlon.com/encom-boardroom";
            }
            if(panelPos.y <= 160*scale){
                if(panelPos.x < width/2){
                    return "http://www.robscanlon.com/encom-globe";
                } else {
                    return "http://www.github.com/arscan/streamed";
                }

            }

            return true;
        }

        return false;
    }

    init();

    return Object.freeze({
        toString: function(){return "ProjectsPanel"},
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

