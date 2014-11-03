function createEncomBoardroom(scene){

   function renderToCanvas(width, height, renderFunction) {
       var buffer = document.createElement('canvas');
       buffer.width = width;
       buffer.height = height;

       renderFunction(buffer.getContext('2d'));

       return buffer;
   };

   function createTitleCanvas(){

       return renderToCanvas(200, 40, function(ctx){
           ctx.strokeStyle="#fff";

           ctx.font = "12pt Roboto";
           ctx.fillStyle = '#ffcc00';
           ctx.fillText("Tron Boardroom", 25, 15);

       });

   };

    var splineGeometry = new THREE.Geometry();
    var splineMaterial = new THREE.LineBasicMaterial({
        color: 0x6FC0BA,
        opacity: 0,
        transparent: true
    });

    var backdropGeometry = new THREE.Geometry();
    var backdropMaterial = new THREE.LineBasicMaterial({
        color: 0x1b2f2d,
        opacity: 1,
        transparent: true
    });

    var offset = {x: -20, y: 50, z: 0};
    var drift = {x: 0, y: 0, z: 0};

    lastRenderDate = new Date();

    var calc = function(x){
        return (x+200)*(x+100)*(x+280)*(x+10)*(x-300)*(x-250)*(x-150) / Math.pow(10,14)/1.5;
    }

    for(var i = 0; i< 300; i++){
        var y = calc(i-150) * Math.sin(2 * Math.PI * (i % 6) / 6 + i/300) + Math.cos(i) * 5;
        var z = calc(i-150) * Math.cos(2 * Math.PI * (i % 6) / 6 + i/300);
        splineGeometry.vertices.push(new THREE.Vector3((i - 150)/2, y, z));
    }
    splineGeometry.verticesNeedUpdate = true;

    var splineLine = new THREE.Line(splineGeometry, splineMaterial);
    scene.add(splineLine);

    for(var i = 0; i< 12; i++){
        backdropGeometry.vertices.push(new THREE.Vector3(-75,40-i*8,0));
        backdropGeometry.vertices.push(new THREE.Vector3(65,40-i*8,0));
    }
    backdropGeometry.vertices.push(new THREE.Vector3(-75,40,0));
    backdropGeometry.vertices.push(new THREE.Vector3(-75,40 - 11*8,0));
    backdropGeometry.vertices.push(new THREE.Vector3(65,40,0));
    backdropGeometry.vertices.push(new THREE.Vector3(65,40 - 11*8,0));

    var backdropLine = new THREE.Line(backdropGeometry, backdropMaterial, THREE.LinePieces);
    scene.add(backdropLine);

    var titleCanvas= createTitleCanvas(); 

    var titleTexture = new THREE.Texture(titleCanvas)
    titleTexture.needsUpdate = true;

    var titleMaterial = new THREE.MeshBasicMaterial({map: titleTexture, transparent: true});
    var titleGeometry = new THREE.PlaneBufferGeometry( 200, 40 );
    var titlePlane = new THREE.Mesh( titleGeometry, titleMaterial );

    scene.add( titlePlane );

    var firstRun = null;
    var introAnimationDone = false;

    return {
        drift: drift,
        render: function (){
            if(firstRun === null){
                firstRun = Date.now() + 2500;
            }
            var renderTime = new Date() - lastRenderDate;
            var timeSinceStart = Date.now() - firstRun;
            lastRenderDate = new Date();

            var rotateCameraBy = (2 * Math.PI)/(10000/renderTime);

            if(timeSinceStart < 3000){
                backdropMaterial.opacity = Math.max(0,(timeSinceStart-2000)/3000);
                splineMaterial.opacity = timeSinceStart/3000;
            } else if(!introAnimationDone){
                introAnimationDone = true;
                backdropMaterial.opacity = 1;
                splineMaterial.opacity = 1;
            }

            backdropMaterial.opacity = 0;

            splineLine.rotation.x += .05;
            splineLine.position.set(offset.x + drift.x, offset.y + drift.y, offset.z + drift.z);
            backdropLine.position.set(offset.x + drift.x, offset.y + drift.y, offset.z + drift.z);
            titlePlane.position.set(offset.x + drift.x + 10, offset.y + drift.y - 50, offset.z + drift.z + 10);

            drift.x = Math.sin(timeSinceStart / 1000) * 5;
            drift.y = Math.cos(timeSinceStart / 1000) * 5;
            drift.z = Math.cos(timeSinceStart / 1000) * 5;

        }, 
    };

}
