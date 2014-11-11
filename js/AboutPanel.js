function createAboutPanel(renderer, scale){

   var STANDARD_DIMENSIONS = {width: 256, height:256};

   var width = STANDARD_DIMENSIONS.width * scale,
       height = STANDARD_DIMENSIONS.height * scale;

   var panel = createPanel(renderer, width, height);

   var bodyPlane,
       scrollPlane;

   function createTitleCanvas(){

       return panel.renderToCanvas(512, 160, function(ctx){
           ctx.strokeStyle="#fff";

           ctx.font = "bold 28pt Roboto";
           ctx.fillStyle = '#ff8d07';
           ctx.fillText("WELCOME", 25, 35);

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

   function createBodyCanvas(){
       var text = ["Thanks for stopping by!",
                   "This is a project by Rob Scanlon using THREE.js, and a ",
                   "long list of other open source projects.",
                   "Try scrolling down to continue.",
       ];

       return panel.renderToCanvas(512, 400, function(ctx){
           ctx.strokeStyle="#fff";

           ctx.font = "20pt Roboto";
           ctx.fillStyle = '#ffffff';

           for(var i = 0; i < text.length; i++){
               ctx.fillText(text[i], 0, 20 + i*38);
           }
       });

   };

   function createScrollCanvas(){
       return panel.renderToCanvas(512, 50, function(ctx){

           ctx.font = "12pt Roboto";
           ctx.fillStyle = '#6Fc0BA';

           ctx.fillText("SCROLL DOWN", 50, 18);
           ctx.fillStyle = '#996699';

           function drawTriangles(x){
               ctx.moveTo(x, 10);
               ctx.lineTo(x+5, 5);
               ctx.lineTo(x-5, 5);
               ctx.lineTo(x, 10);
               ctx.moveTo(x, 15);
               ctx.lineTo(x+5, 10);
               ctx.lineTo(x-5, 10);
               ctx.lineTo(x, 15);
               ctx.moveTo(x, 20);
               ctx.lineTo(x+5, 15);
               ctx.lineTo(x-5, 15);
               ctx.lineTo(x, 20);
               ctx.fill();
           }

           drawTriangles(40);
           drawTriangles(180);
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
        panel.addToScene( plane );

        var bodyCanvas= createBodyCanvas(); 
        var bodyTexture = new THREE.Texture(bodyCanvas)
        bodyTexture.needsUpdate = true;

        var bodyMaterial = new THREE.MeshBasicMaterial({map: bodyTexture, transparent: true});
        var bodyGeometry = new THREE.PlaneBufferGeometry( 256 * scale, 200 * scale );

        bodyPlane = new THREE.Mesh( bodyGeometry, bodyMaterial );
        bodyPlane.position.set(width/2 + 7, height - 40*scale - (200*scale)/2, 0);
        panel.addToScene( bodyPlane );

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

