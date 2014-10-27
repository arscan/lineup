
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
    aboutPanel = createAboutPanel(renderer, 256, 256, 1000, 400),
    projectorPanel = createProjectorPanel(renderer, 1280, 580, [namePanel, skeletonPanel, projectsPanel, aboutPanel]),
    backgroundPanel = createBackgroundPanel(renderer, 1280, 580),
    bottomPanel = createBottomPanel($("#bottom-panel")),

    carouselPanels = [projectsPanel, aboutPanel],
    carouselLocation = 0,
    carouselGrabbed = false,

    interactivePanels = [namePanel, skeletonPanel],
    grabbedPanel = null,
    grabStart = null,

    clock = new THREE.Clock();

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

    // skeletonPanel.quad.position.x = projectorPanel.width / 2 + Math.sin(time/2) * 300;
    skeletonPanel.render();
    projectsPanel.render();
    namePanel.render();
    aboutPanel.render();
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

    if(event.clientY > 250 && event.clientY < 450 && event.clientX > 850){

        carouselGrabbed = true;
        $(event.target).addClass("grabbing");
        grabStart = {x: event.clientX, y: event.clientY};
        return;
    }

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
    carouselGrabbed = false;
    grabbedPanel = null;
    grabStart = null;
    $(event.target).removeClass("grabbing");
});

$(document).on("mouseout","canvas", function(event){
    carouselGrabbed = false;
    grabbedPanel = null;
    grabStart = null;
    $(event.target).removeClass("grabbing");
});



$(document).on("mousemove","canvas", function(event){
    // check to see what object i'm in...

    
    if(grabbedPanel){

        grabbedPanel.quad.position.x = grabbedPanel.quad.position.x - (grabStart.x - event.clientX); 
        grabbedPanel.quad.position.y = grabbedPanel.quad.position.y + (grabStart.y - event.clientY); 

        grabStart.x = event.clientX;
        grabStart.y = event.clientY;

        return;

    } else if (carouselGrabbed){

        carouselLocation = (carouselLocation + 1.0 + (event.clientX - grabStart.x) / 1000) % 1.0;

        grabStart.x = event.clientX;
        grabStart.y = event.clientY;

        // console.log(carouselLocation);

        for(var i = 0; i< carouselPanels.length; i++){
            var panel = carouselPanels[i];
            panel.quad.position.y = 300 + 150 * Math.sin(Math.PI * 2 * (i / carouselPanels.length) + Math.PI * 2 * carouselLocation);
            panel.quad.position.x = 1200 + 300 * Math.cos(Math.PI * 2 * (i / carouselPanels.length) + Math.PI * 2 * carouselLocation);

        }

        return;

    }

    if(event.clientY > 250 && event.clientY < 450 && event.clientX > 850){
        $(event.target).addClass("grab");
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
