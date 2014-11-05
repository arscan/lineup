
var container = document.createElement( 'div' ),
    stats = new Stats(), 
    renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } ), 
    renderWidth = 1280,
    renderHeight = 580,
    camera = new THREE.OrthographicCamera(0, 1280, 580, 0, -1000, 1000),
    scene = new THREE.Scene(),

    skeletonPanel = createSkeletonPanel(renderer, 250, 400, 512/2+ 200, 512/2+ 60),
    namePanel = createNamePanel(renderer, 256, 256, 200, 512/2 - 80),
    projectsPanel = createProjectsPanel(renderer, 256, 256, 1000, 200),
    aboutPanel = createAboutPanel(renderer, 256, 256, 1000, 400),
    bioPanel = createBioPanel(renderer, 256, 256, 1000, 400),
    linksPanel = createLinksPanel(renderer, 256, 256, 1000, 400),
    backgroundPanel = createBackgroundPanel(renderer, 1280, 580),
    projectorPanel = createProjectorPanel(renderer, 1280, 580, [namePanel, skeletonPanel, projectsPanel, aboutPanel, bioPanel, linksPanel]),
    //subjectPanel = createSubjectPanel(renderer, 326, 580, 500 + 326/2, 580/2 - 120 ),
    bottomPanel = createBottomPanel($("#bottom-panel")),

    carouselPanels = [aboutPanel, linksPanel, bioPanel, projectsPanel],
    carouselLocation = 0,
    carouselGrabbed = false,

    interactivePanels = [namePanel, skeletonPanel],
    grabbedPanel = null,
    grabStart = null,

    clock = new THREE.Clock();

namePanel.quad.scale.set(1.2,1.2,1.2);
scene.add(projectorPanel.quad);
// scene.add(subjectPanel.quad);
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
    namePanel.render();

    for(var i = 0; i < carouselPanels.length; i++){
        if(carouselPanels[i].quad.position.x < 1280 + 200){
            carouselPanels[i].render();
        }
    }

    projectorPanel.render();
    // subjectPanel.render();

    renderer.render(scene, camera);

    requestAnimationFrame(render);

    TWEEN.update();
}

setPanelPositions();

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

$(document).on("scroll", function(){
    carouselLocation = $(document).scrollTop() /  ($(document).height() - window.innerHeight);
    setPanelPositions();


});


function getScale(y){
    return 1 - (y-250)/400;
}

function getBlur(y){
    return 1-(y-250)/200;
}

function setPanelPositions(){

    for(var i = 0; i< carouselPanels.length; i++){
        var panel = carouselPanels[i];
        panel.quad.position.y = Math.max(300 + 200 * Math.sin(Math.PI * 2 * (i / carouselPanels.length) + Math.PI * 2 * (carouselLocation + .58)), 230);
        panel.quad.position.x = 1300 + 300 * Math.cos(Math.PI * 2 * (i / carouselPanels.length) + Math.PI * 2 * (carouselLocation + .58));
        
        panel.quad.position.x = 1300 + 300 * Math.cos(Math.PI * 2 * (i / carouselPanels.length) + Math.PI * 2 * (carouselLocation + .58));

        var scale = getScale(panel.quad.position.y);

        panel.quad.scale.set(scale, scale, scale, scale);

        panel.setBlur(getBlur(panel.quad.position.y));
    }

}



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

        setPanelPositions();

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

new TWEEN.Tween({loc: -.1})
            .delay(1000)

            .to({loc: 0}, 2000)
            .onUpdate(function(){
                carouselLocation = this.loc;
                setPanelPositions();
            })
            .easing(TWEEN.Easing.Elastic.Out)
            .start();
