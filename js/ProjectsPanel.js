function createProjectsPanel(renderer, scale){

   var STANDARD_DIMENSIONS = {width: 460, height:287};

   var width = STANDARD_DIMENSIONS.width * scale,
       height = STANDARD_DIMENSIONS.height * scale;

   var panel = createPanel(renderer, width, height, {foregroundGlow: true});

   var encomGlobe,
       encomBoardroom,
       hexasphere,
       githubWargames,
       mousePos = null,
       currentSelection = 3,
       pointerPlane = null,
       currentTimeout = null;

   var menu = [
               {title: "ENCOM BOARDROOM", pic: "images/projects-boardroom.png", url: "http://www.robscanlon.com/encom-boardroom", pointerX: 200 * scale},
               {title: "ENCOM GLOBE", pic: "images/projects-globe.png", url: "http://www.robscanlon.com/encom-globe", pointerX: 165 * scale},
               {title: "GITHUB WARGAMES", pic: "images/projects-wargames.png", url: "http://www.robscanlon.com/github-wargames", pointerX: 195 * scale},
               {title: "PLEASEROTATE.JS", pic: "images/projects-rotate.png", url: "http://www.robscanlon.com/pleaserotate", pointerX: 187 * scale}
              ];

    var choices = [];

    function createPointerPlane(){
        var pointerTexture = THREE.ImageUtils.loadTexture("images/projects-pointer.png", undefined, LOADSYNC.register() );
        var pointerMaterial = new THREE.MeshBasicMaterial({map: pointerTexture, depthTest: false, transparent: true});
        var pointerGeometry = new THREE.PlaneBufferGeometry( 26 * scale, 30 * scale);
        pointerPlane = new THREE.Mesh(pointerGeometry, pointerMaterial );
        pointerPlane.position.set(35 * scale, 115 * scale,15);
        pointerPlane.scale.set(.5, .5, .5);
        panel.addToScene(pointerPlane);
    }

    function movePointerPlane(index){
        new TWEEN.Tween(pointerPlane.position)
            .to({y: height - (84 + index * 20)*scale, x: menu[index].pointerX}, 500).start();
    }

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

            var menuTexture = THREE.ImageUtils.loadTexture(menu[i].pic, undefined, LOADSYNC.register() );
            var menuMaterial = new THREE.MeshBasicMaterial({map: menuTexture, depthTest: false, transparent: true, blending: THREE.AdditiveBlending, opacity: 0.0});
            var menuGeometry = new THREE.PlaneBufferGeometry( 281 * scale, 281 * scale);
            var menuPlane = new THREE.Mesh(menuGeometry, menuMaterial );
            menuPlane.scale.set(.5,.5,.5);
            // headerPlane.position.set(108 * scale, height - 90 * scale,5);
            menuPlane.position.set(306 * scale, 140 * scale, 0);
            panel.addToScene(menuPlane);

            menu[i].rightPlane = createTextPlane(menu[i].title);
            menu[i].rightPlane.position.set(350*scale, 30*scale, 0);
            menu[i].picPlane = menuPlane;
            menu[i].leftPlane = leftPlane;
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

        createPointerPlane();

        buildMenu();

        setMenu(0);

    }

    function render(time){

        panel.render(time);
    }

    function setMenu(index){
        clearTimeout(currentTimeout);
        if(index < 0){
            return;
        }

        movePointerPlane(index);

        new TWEEN.Tween({val: 0, cs: currentSelection}, 1000)
            .to({val: 1, cs: currentSelection})
            .onUpdate(function(){
                console.log(this);
                if(this.cs >= 0){
                    menu[this.cs].rightPlane.material.opacity = 1 - this.val;
                    menu[this.cs].picPlane.material.opacity = 1 - this.val;
                }
                menu[index].rightPlane.material.opacity = this.val;
                menu[index].picPlane.material.opacity = this.val;
            }).start();

        currentSelection = index;

        currentTimeout = setTimeout(function(){
            setMenu((index + 1) % menu.length);
        }, 5000);
    }

    function clearMenu(){
        if(currentSelection > -1){
            menu[currentSelection].rightPlane.position.x = 450 * scale *  - 100 * scale;
            menu[currentSelection].picPlane.material.opacity = 0;
        }

        currentSelection = -1;

    }


    function checkBounds(x,y){
        if(!panel.checkBounds(x,y)){
            mousePos = null;
            return false;
        }
        var pos = panel.positionWithinPanel(x,y);

        if(pos.x > 60 * scale && pos.x < 200 * scale){
            var index = Math.floor(((height-pos.y) - 72 * scale) / (20 * scale));
            if(index >= 0 && index < choices.length){
                if(currentSelection != index){
                    setMenu(index);
                }
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

