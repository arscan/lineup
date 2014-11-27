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

           ctx.font = "24pt Roboto";
           ctx.fillStyle = '#ff8d07';
           ctx.fillText("OTHER PROJECTS", 50, 35);

           ctx.lineWidth = 2.5;
           ctx.strokeStyle="#fd5f00";
           ctx.moveTo(4,28);
           ctx.lineTo(4,60);
           ctx.lineTo(440,60);
           ctx.stroke();

           ctx.beginPath();
           ctx.fillStyle='#eac7df';
           ctx.arc(4, 28, 4, 0, 2 * Math.PI);
           ctx.fill();

           ctx.beginPath();
           ctx.arc(4, 60, 4, 0, 2 * Math.PI);
           ctx.fill();

           ctx.fillStyle='#fd5f00';
           ctx.beginPath();
           ctx.arc(380, 60, 4, 0, 2 * Math.PI);
           ctx.fill();

           ctx.fillStyle='#eac7df';
           ctx.beginPath();
           ctx.arc(440, 60, 4, 0, 2 * Math.PI);
           ctx.fill();

           ctx.beginPath();
           ctx.fillStyle='#336699';
           ctx.beginPath();
           ctx.moveTo(30, 18);
           ctx.lineTo(20, 28);
           ctx.lineTo(40, 28);
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

