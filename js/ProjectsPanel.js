function createProjectsPanel(renderer, scale){

   var STANDARD_DIMENSIONS = {width: 256, height:256};

   var width = STANDARD_DIMENSIONS.width * scale,
       height = STANDARD_DIMENSIONS.height * scale,
       renderCamera;

   var panel = createPanel(renderer, width, height);

   var encomGlobe,
       encomBoardroom,
       hexasphere,
       githubWargames;

   function createTitleCanvas(){

       return panel.renderToCanvas(512, 160, function(ctx){
           ctx.strokeStyle="#fff";

           ctx.font = "bold 28pt Roboto";
           ctx.fillStyle = '#ff8d07';
           ctx.fillText("RECENT PROJECTS", 25, 35);

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

    function init(){

        renderCamera = new THREE.PerspectiveCamera( 70, width / height, 1, 1000 );
        renderCamera.position.z = 200;
        renderCamera.position.y = 0;

        panel.setCamera(renderCamera);

        var titleCanvas = createTitleCanvas();

        var titleTexture = new THREE.Texture(titleCanvas)
        titleTexture.needsUpdate = true;

        var titleMaterial = new THREE.MeshBasicMaterial({map: titleTexture, transparent: true});
        var titleGeometry = new THREE.PlaneBufferGeometry( 256, 80);

        var plane = new THREE.Mesh( titleGeometry, titleMaterial );
        plane.position.set(0, 90, 0);
        panel.addToScene( plane );

        encomGlobe = createEncomGlobe(panel.renderScene);
        encomBoardroom = createEncomBoardroom(panel.renderScene);
        githubWargames = createGithubWargames(panel.renderScene);

    }

    function render(time){

        encomBoardroom.render();
        encomGlobe.render();
        githubWargames.render();

        panel.render(time);

    }

    function checkBounds(x, y){
        return panel.checkBounds(x,y);
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

