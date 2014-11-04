function createGithubWargames(scene){

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

           ctx.font = "10pt Roboto";
           ctx.fillStyle = '#ffcc00';
           ctx.fillText("Github Wargames", 25, 15);

       });

   };

    var offset = {x: 60, y: -50, z: 0};
    var drift = {x: 0, y: 0, z: 0};

    var titleCanvas= createTitleCanvas(); 

    var titleTexture = new THREE.Texture(titleCanvas)
    titleTexture.needsUpdate = true;

    var titleMaterial = new THREE.MeshBasicMaterial({map: titleTexture, transparent: true});
    var titleGeometry = new THREE.PlaneBufferGeometry( 200, 40 );
    var titlePlane = new THREE.Mesh( titleGeometry, titleMaterial );

    scene.add( titlePlane );

    var wargamesTexture = THREE.ImageUtils.loadTexture('github-wargames.png');
    var wargamesMaterial = new THREE.MeshBasicMaterial({map: wargamesTexture, transparent: true});
    var wargamesGeometry = new THREE.PlaneBufferGeometry( 120, 83 );
    var wargamesPlane = new THREE.Mesh( wargamesGeometry, wargamesMaterial );

    scene.add( wargamesPlane );


    var lastRenderDate = new Date();
    var firstRun = Date.now();
    var introAnimationDone = false;

    return {
        drift: drift,
        render: function (){
            var renderTime = new Date() - lastRenderDate;
            var timeSinceStart = Date.now() - firstRun;
            lastRenderDate = new Date();

            drift.x = Math.sin(1+timeSinceStart / 1000) * 2;
            drift.y = Math.cos(2+timeSinceStart / 1000) * 2;
            drift.z = Math.cos(3+timeSinceStart / 1000) * 2;

            wargamesPlane.position.set(offset.x + drift.x,offset.y + drift.y,offset.z + drift.z);
            titlePlane.position.set(offset.x + drift.x + 15, offset.y + drift.y - 55, offset.z + drift.z + 10);

        }, 
    };

}
