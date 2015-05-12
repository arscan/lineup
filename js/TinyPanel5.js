function createTinyPanel5(renderer, scale){

   var STANDARD_DIMENSIONS = {width: 96, height:96};

   var width = STANDARD_DIMENSIONS.width * scale,
       height = STANDARD_DIMENSIONS.height * scale;

   var panel = createPanel(renderer, width, height, {foregroundGlow: true});

   var maskMeshFull,
       maskMeshLine;

   function createCanvas(){

       return panel.renderToCanvas(96, 96, function(ctx){
           ctx.lineWidth = 5.5;
           ctx.strokeStyle="#eac7df";
           ctx.moveTo(3,16);
           ctx.lineTo(90,16);
           ctx.stroke();

           ctx.lineWidth = 2.5;
           ctx.moveTo(3,23);
           ctx.lineTo(90,23);
           ctx.lineTo(90,90);
           ctx.lineTo(3,90);
           ctx.lineTo(3,23);
           ctx.stroke();

           ctx.lineWidth = 2.5;
           for(var i = 1; i< 11; i++){
               ctx.moveTo(10,24 + i*6);
               ctx.lineTo(Math.random()*20 + 15,24 + i*6);

               ctx.moveTo(40,24 + i*6);
               ctx.lineTo(55,24 + i*6);

               ctx.moveTo(70,24 + i*6);
               ctx.lineTo(Math.random()*10 + 75,24 + i*6);
           }
           ctx.stroke();
       });
   }

    function init(){

        var canvas= createCanvas(); 
        var texture = new THREE.Texture(canvas)
        texture.needsUpdate = true;

        var material = new THREE.MeshBasicMaterial({map: texture, transparent: true});
        var geometry = new THREE.PlaneBufferGeometry( 96 * scale, 96 * scale );

        var plane = new THREE.Mesh( geometry, material );
        plane.position.set(width/2, height/2, 0);
        panel.addToScene( plane );

        maskMeshFull = new THREE.Mesh( new THREE.PlaneBufferGeometry(80 * scale, 55 * scale), new THREE.MeshBasicMaterial({color: 0x00}));
        maskMeshFull.position.set(width/2, height/2 - 10 * scale, 1);
        panel.addToScene(maskMeshFull);

        maskMeshLine = new THREE.Mesh( new THREE.PlaneBufferGeometry(80 * scale, 10 * scale), new THREE.MeshBasicMaterial({color: 0x00}));
        maskMeshLine.position.set(width/2, height - 30 * scale, 1);
        panel.addToScene(maskMeshLine);

    }

    function render(time){
        var linesPerSecond = 1.5;
        var numLines = 9;
        var linePercent = (time * linesPerSecond) % 1;
        var fullPercent = (Math.floor(time * linesPerSecond) / numLines) % 1;

        panel.render(time);


        if(time > 0){
            
            maskMeshLine.scale.set(1 - linePercent, 1, 1);
            maskMeshLine.position.x = width/2 + linePercent * 50 * scale / 2;
            maskMeshLine.position.y = height - 30 * scale - fullPercent * 55 * scale  - 2 * scale;

            maskMeshFull.scale.set(1, 1 - fullPercent, 1);
            maskMeshFull.position.y = height/2 - fullPercent * 55 * scale / 2 - 10 * scale;
            // maskMeshLine.position.x = width/2 + percent * 50 * scale / 2;
            // maskMeshLine.position.set(


        }


       
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

