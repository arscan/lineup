
var container = document.createElement( 'div' ),
    stats = new Stats(), 
    renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } ), 
    renderWidth = 1280,
    renderHeight = 580,
    camera = new THREE.OrthographicCamera(0, 1280, 580, 0, -1000, 1000),
    scene = new THREE.Scene(),

    skeletonPanel = createSkeletonPanel(renderer, 250, 400, 512/2+ 500, 512/2+ 60),
    namePanel = createNamePanel(renderer, 256, 256, 300, 512/2 + 60),
    projectsPanel = createProjectsPanel(renderer, 256, 256, 1000, 200),
    projectorPanel = createProjectorPanel(renderer, 1280, 580, [namePanel, skeletonPanel, projectsPanel]),
    backgroundPanel = createBackgroundPanel(renderer, 1280, 580),
    bottomPanel = createBottomPanel($("#bottom-panel")),

    interactivePanels = [namePanel, projectsPanel],
    grabbedPanel = null,
    grabStart = null,

    clock = new THREE.Clock();

// scene.add(leftQuad);
scene.add(projectorPanel.quad);
scene.add(backgroundPanel.quad);

container.appendChild( stats.domElement );
document.body.appendChild( container );
renderer.setSize( 1280, 580 );
container.appendChild( renderer.domElement );

function render(){
    var time = clock.getElapsedTime();
    stats.update();
    backgroundPanel.render();

    skeletonPanel.quad.position.x = projectorPanel.width / 2 + Math.sin(time/2) * 300;
    skeletonPanel.render();
    projectsPanel.render();
    namePanel.render();
    projectorPanel.render();

    renderer.render(scene, camera);

    requestAnimationFrame(render);

    TWEEN.update();
}

render();

$(document).on("mousedown","canvas", function(event){
    
    // Do Dragging
    //
    // namePanel.quad.position.set(event.clientX, 580-event.clientY - namePanel.height / 2, 0);

    for(var i = 0; i< interactivePanels.length; i++){
        var panel = interactivePanels[i];
        if(panel.checkBounds(event.clientX,renderHeight - event.clientY)){
            grabbedPanel = panel;
            grabStart = {x: event.clientX, y: event.clientY};
            $(event.target).addClass("grabbing");
            return;
        }
    }

});

$(document).on("mouseup","canvas", function(event){
    grabbedPanel = null;
    grabStart = null;
    $(event.target).removeClass("grabbing");
});

$(document).on("mouseout","canvas", function(event){
    grabbedPanel = null;
    grabStart = null;
    $(event.target).removeClass("grabbing");
});



$(document).on("mousemove","canvas", function(event){
    // check to see what object i'm in...
    
    if(grabbedPanel){

        console.log("WE ARE GRABBED FOR " + grabbedPanel);

        grabbedPanel.quad.position.x = grabbedPanel.quad.position.x - (grabStart.x - event.clientX); 
        grabbedPanel.quad.position.y = grabbedPanel.quad.position.y + (grabStart.y - event.clientY); 

        grabStart.x = event.clientX;
        grabStart.y = event.clientY;

        return;
    }
    for(var i = 0; i< interactivePanels.length; i++){
        var panel = interactivePanels[i];
        if(panel.checkBounds(event.clientX,renderHeight - event.clientY)){
            $(event.target).addClass("grab");
            return;
        }
    }
    $(event.target).removeClass("grab");
    // $(event.target).css("cursor", "inherit")

});
