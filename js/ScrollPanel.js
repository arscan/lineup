function createScrollPanel(renderer, scale){

   var STANDARD_DIMENSIONS = {width: 275, height:175};

   var width = STANDARD_DIMENSIONS.width * scale,
       height = STANDARD_DIMENSIONS.height * scale;

   var panel = createPanel(renderer, width, height, {foregroundGlow: true});

   var icons = [];

   var picHeight = 70;

   var picsMaterial;

   var active = false,
       finishing = false,
       finished = false;



   function createBackground(){

        var material = new THREE.MeshBasicMaterial({transparent: false, color: 0x000000});
        var geometry = new THREE.PlaneBufferGeometry( width, height);

        var plane = new THREE.Mesh( geometry, material );
        plane.position.set(width/2, height/2, -1);
        panel.addToScene( plane );
   };

    function init(){

        createBackground();

        var picsTexture = THREE.ImageUtils.loadTexture("images/scroll-down.png", undefined, LOADSYNC.register() );
        picsMaterial = new THREE.MeshBasicMaterial({map: picsTexture, depthTest: false, transparent: true, opacity: 1});
        var picsGeometry = new THREE.PlaneBufferGeometry( 275 * scale, 175 * scale);
        var picsPlane = new THREE.Mesh(picsGeometry, picsMaterial );
        picsPlane.scale.set(.5,.5,.5);
        picsPlane.position.set(width/2, height/2, 0);
        panel.addToScene(picsPlane);

    }

    function render(time){
        if(!finished && active){
            panel.setBlur((Math.sin(time*2) + 1)/3 + .33333);
            panel.render(time);
        }
    }

    function activate(){
        active = true;
        new TWEEN.Tween({y: 1300 * scale})
            .to({y: 500 * scale}, 2000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(function(){
                panel.setPosition(750 * scale, this.y, 1);
            }).start();
    }

    function finish(){

        if(!finishing && active){
            new TWEEN.Tween({val: 0})
                .to({val: 1}, 1000)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onUpdate(function(){
                    panel.setPosition(750 * scale, 500 * scale - 50 * this.val * scale , 1);
                    picsMaterial.opacity = 1 - this.val;
                }).onComplete(function(){
                    finished = true;
                }).start();
        }
        finishing = true;
    }

    function checkBounds(x, y){
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
        setPosition: panel.setPosition,
        activate: activate,
        finish: finish
    });
}

