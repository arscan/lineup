function createProjectsPanel(renderer, scale){

   var STANDARD_DIMENSIONS = {width: 460, height:287};

   var width = STANDARD_DIMENSIONS.width * scale,
       height = STANDARD_DIMENSIONS.height * scale;

   var panel = createPanel(renderer, width, height, {foregroundGlow: true});

   var encomGlobe,
       encomBoardroom,
       hexasphere,
       githubWargames,
       mousePos = null;

   var menu = [
               {title: "ENCOM BOARDROOM", pic: "images/projects-encom-boardroom.png", url: "http://www.github.com/arscan/encom-boardroom"},
               {title: "ENCOM GLOBE", pic: "images/projects-encom-boardroom.png", url: "http://www.github.com/arscan/encom-boardroom"},
               {title: "GITHUB WARGAMES", pic: "images/projects-encom-boardroom.png", url: "http://www.github.com/arscan/encom-boardroom"},
               {title: "PLEASEROTATE.JS", pic: "images/projects-encom-boardroom.png", url: "http://www.github.com/arscan/encom-boardroom"}
              ];

    var choices = [];


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
            leftPlane._index = i;
            choices.push(leftPlane);

            menu[i].rightPlane = createTextPlane(menu[i].title);
            menu[i].rightPlane.position.set(-100, 30*scale, 0);
            panel.addToScene(menu[i].rightPlane);

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

        panel.render(time);
    }

    function setMenu(index){
        if(index >= 0 && index < menu.length){
            for(var i = 0; i< menu.length; i++){
                menu[i].rightPlane.position.x = 450 * scale * (i == index) - 100 * scale;
            }

        }
    }



    function checkBounds(x,y){
        if(!panel.checkBounds(x,y)){
            mousePos = null;
            return false;
        }
        var pos = panel.positionWithinPanel(x,y);

        if(pos.x > 90 && pos.x < 300){
            var index = Math.floor(((height-pos.y) - 110) / 28);
            if(index >= 0 && index < choices.length){
                setMenu(index);
                return menu[index].url;
            }
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

