function createAboutPanel(renderer, scale){

   var STANDARD_DIMENSIONS = {width: 256, height:256};

   var width = STANDARD_DIMENSIONS.width * scale,
       height = STANDARD_DIMENSIONS.height * scale;

   var panel = createPanel(renderer, width, height);

   var bodyPlane,
       scrollPlane;

   function createTitleCanvas(){

       return panel.renderToCanvas(512, 160, function(ctx){
           ctx.font = "26pt Roboto";
           ctx.fillStyle = '#fd5f00';
           ctx.fillText("WELCOME MESSAGE", 115, 26);

           ctx.lineWidth = 2.5;
           ctx.strokeStyle="#fd5f00";
           ctx.moveTo(4,5);
           ctx.lineTo(78,5);
           ctx.moveTo(35,8);
           ctx.lineTo(100,8);
           ctx.stroke();
           ctx.moveTo(37,11);
           ctx.lineTo(100,11);
           ctx.stroke();

       });

   };

   function createBodyCanvas(){
       var text = ["This is a reproduction of the lineup scene in ",
                   "Marvel's Guardians of the Galaxy, built with",
                   "HTML5 and a bunch of open source libraries.",
                   "",
                   "Made by @arscan as a learning exercise.",
                   "Source available at github.com/arscan/lineup.",
                   "",
                   "Scroll/swipe/drag down to continue.",
       ];

       return panel.renderToCanvas(512, 400, function(ctx){
           ctx.strokeStyle="#fff";

           ctx.font = "18pt Roboto";
           ctx.fillStyle = '#ffffff';

           for(var i = 0; i < text.length; i++){
               ctx.fillText(text[i], 0, 20 + i*30);
           }
       });

   };

   function createBottomCanvas(){
       return panel.renderToCanvas(512, 100, function(ctx){
                   ctx.fillStyle = '#a94000';

           for(var i = 0; i< 3; i++){

               if(i == 1){
                   ctx.fillStyle = '#fd5f00';
               } else if(i == 2){
                   ctx.fillStyle = '#6d2900';
               }

               for(var j = 0; j < 5; j++){
                   var boxWidth = 80;
                   if(i === 2){
                       boxWidth = Math.random() * 80;
                   }
                   ctx.fillRect(j * 100, i * 10, boxWidth, 5);
               }

           }
       });
   };

    function init(){

        var titleCanvas= createTitleCanvas(); 
        var titleTexture = new THREE.Texture(titleCanvas)
        titleTexture.needsUpdate = true;

        var titleMaterial = new THREE.MeshBasicMaterial({map: titleTexture, transparent: true});
        var titleGeometry = new THREE.PlaneBufferGeometry( 256 * scale, 80 * scale );

        var plane = new THREE.Mesh( titleGeometry, titleMaterial );
        plane.position.set(width/2 + 7, height-45*scale, 0);
        panel.addToScene( plane );

        var bodyCanvas= createBodyCanvas(); 
        var bodyTexture = new THREE.Texture(bodyCanvas)
        bodyTexture.needsUpdate = true;

        var bodyMaterial = new THREE.MeshBasicMaterial({map: bodyTexture, transparent: true});
        var bodyGeometry = new THREE.PlaneBufferGeometry( 256 * scale, 200 * scale );

        bodyPlane = new THREE.Mesh( bodyGeometry, bodyMaterial );
        bodyPlane.position.set(width/2 + 7, height - 35*scale - (200*scale)/2, 0);
        panel.addToScene( bodyPlane );

        var bottomCanvas= createBottomCanvas(); 
        var bottomTexture = new THREE.Texture(bottomCanvas)
        bottomTexture.needsUpdate = true;

        var bottomMaterial = new THREE.MeshBasicMaterial({map: bottomTexture, transparent: true});
        var bottomGeometry = new THREE.PlaneBufferGeometry( 256 * scale, 100 * scale );

        bottomPlane = new THREE.Mesh( bottomGeometry, bottomMaterial );
        bottomPlane.position.set(128 * scale + 5*scale, 50, 0);
        panel.addToScene( bottomPlane );

        // var scrollCanvas= createScrollCanvas(); 
        // var scrollTexture = new THREE.Texture(scrollCanvas)
        // scrollTexture.needsUpdate = true;

        // var scrollMaterial = new THREE.MeshBasicMaterial({map: scrollTexture, transparent: true});
        // var scrollGeometry = new THREE.PlaneBufferGeometry( 256, 25 );

        // scrollPlane = new THREE.Mesh( scrollGeometry, scrollMaterial );
        // scrollPlane.position.set(0, -100, 0);
        // panel.addToScene( scrollPlane );

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

