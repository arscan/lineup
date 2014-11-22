function createTinyPanel(renderer, scale){

   var STANDARD_DIMENSIONS = {width: 64, height:96};

   var width = STANDARD_DIMENSIONS.width * scale,
       height = STANDARD_DIMENSIONS.height * scale;

   var panel = createPanel(renderer, width, height);

   function createCanvas(){

       return panel.renderToCanvas(64, 96, function(ctx){
           ctx.lineWidth = 5.5;
           ctx.strokeStyle="#fd2616";
           ctx.moveTo(3,16);
           ctx.lineTo(30,16);
           ctx.stroke();

           ctx.lineWidth = 2.5;
           ctx.moveTo(3,23);
           ctx.lineTo(58,23);
           ctx.lineTo(58,90);
           ctx.lineTo(3,90);
           ctx.lineTo(3,23);
           ctx.stroke();

           ctx.lineWidth = 2.5;
           for(var i = 1; i< 11; i++){
               ctx.moveTo(10,24 + i*6);
               ctx.lineTo(Math.random()*10 + 40,24 + i*6);
           }
           ctx.stroke();
       });
   }

    function init(){

        var canvas= createCanvas(); 
        var texture = new THREE.Texture(canvas)
        texture.needsUpdate = true;

        var material = new THREE.MeshBasicMaterial({map: texture, transparent: true});
        var geometry = new THREE.PlaneBufferGeometry( 64 * scale, 96 * scale );

        var plane = new THREE.Mesh( geometry, material );
        plane.position.set(width/2, height/2, 0);
        panel.addToScene( plane );

    }

    function render(time){
        panel.render(time);
    }

    init();

    return Object.freeze({
        toString: function(){return "TinyPanel"},
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

