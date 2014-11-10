
function main(renderWidth){

    var container = document.createElement( 'div' ),
        stats = new Stats(), 
        renderer = new THREE.WebGLRenderer( { antialias: false, alpha: true } ), 
        /* screen size */
        screenRatio = 23/9;
        standardWidth = 1280,
        screenScale = renderWidth / standardWidth,
        renderHeight = renderWidth/screenRatio,
        standardHeight = standardWidth/screenRatio,
        standardPanelSize = screenScale * 256,

        camera = new THREE.OrthographicCamera(0, renderWidth, renderHeight, 0, -1000, 1000),
        scene = new THREE.Scene();

    /* panels and such */
    var skeletonPanel = createSkeletonPanel(renderer, screenScale),
        namePanel = createNamePanel(renderer, screenScale),
        sharePanel = createSharePanel(renderer, screenScale),
        aboutPanel = createAboutPanel(renderer, screenScale),
        projectsPanel = createProjectsPanel(renderer, screenScale),
        bioPanel = createBioPanel(renderer, screenScale),
        linksPanel = createLinksPanel(renderer, screenScale),
        backgroundPanel = createBackgroundPanel(renderer, renderWidth, renderHeight),
        projectorPanel = createProjectorPanel(renderer, renderWidth, renderHeight, [namePanel, skeletonPanel, sharePanel, projectsPanel, aboutPanel, bioPanel, linksPanel]),
        //subjectPanel = createSubjectPanel(renderer, 326, 580, 500 + 326/2, 580/2 - 120 ),
        bottomPanel = createBottomPanel($("#bottom-panel").css({"top":renderHeight - (60 * screenScale) + (window.innerHeight - renderHeight)/2, "width": renderWidth})),

        carouselPanels = [aboutPanel, linksPanel, bioPanel, projectsPanel],
        carouselLocation = 0,
        carouselGrabbed = false,

        interactivePanels = [namePanel, skeletonPanel, sharePanel],
        grabbedPanel = null,
        grabStart = null,

        clock = new THREE.Clock();

    /* add the main panels */
    // namePanel.quad.scale.set(1.2,1.2,1.2);
    scene.add(projectorPanel.quad);
    // scene.add(subjectPanel.quad);
    scene.add(backgroundPanel.quad);

    skeletonPanel.setPosition(350 * screenScale, renderHeight - 20 * screenScale, 1);
    namePanel.setPosition(50 * screenScale, 358*screenScale, 1);
    sharePanel.setPosition(20 * screenScale, renderHeight - 20 * screenScale, 1);

    aboutPanel.setPosition(500 * screenScale, 400*screenScale, 1);
    projectsPanel.setPosition(800 * screenScale, 400*screenScale, 1);
    bioPanel.setPosition(800 * screenScale, 500*screenScale, 1);
    linksPanel.setPosition(800 * screenScale, 200*screenScale, 1);

    /* add the elements */
    container.appendChild( stats.domElement );
    document.body.appendChild( container );
    // renderer.setSize( 1280, 580 );
    renderer.setSize( renderWidth, renderHeight );
    container.appendChild( renderer.domElement );

    $("canvas").css({top: (window.innerHeight - renderHeight)/2});

    LOADSYNC.onComplete(function(){
        /* probably should be earlier... assuming that things aren't loaded instantaniously */
        $("#loading-graphic").velocity({color: "#000", opacity: 0},{"display":"none"});
    });

    function rotateComplete(){
        /* to do when the rotation is done */
        $("#please-rotate").css({display: "none"});
    }
    rotateComplete();

    function render(){
        var time = clock.getElapsedTime();
        stats.update();
        backgroundPanel.render(time);

        // skeletonPanel.quad.position.x = projectorPanel.width / 2 + Math.sin(time/2) * 300;
        skeletonPanel.render(time);
        namePanel.render(time);
        sharePanel.render(time);

        for(var i = 0; i < carouselPanels.length; i++){
            if(carouselPanels[i].quad.position.x < renderWidth + 200){
                carouselPanels[i].render(time);
            }
        }

        projectorPanel.render(time);
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
            var boundRes = panel.checkBounds(event.clientX,renderHeight - event.clientY);
            if(typeof boundRes == "string"){
                location.href=boundRes;
                return;

            } else if(boundRes){
                grabbedPanel = panel;
                grabStart = {x: event.clientX, y: event.clientY};
                $(event.target).removeClass("pointing");
                $(event.target).addClass("grabbing");
                return;
            }
        }

    });

    $(document).on("mouseup","canvas", function(event){
        carouselGrabbed = false;
        grabbedPanel = null;
        grabStart = null;
        $(event.target).removeClass("pointing");
        $(event.target).removeClass("grabbing");
    });

    $(document).on("mouseout","canvas", function(event){
        carouselGrabbed = false;
        grabbedPanel = null;
        grabStart = null;
        $(event.target).removeClass("pointing");
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
            var newY = Math.max(360*screenScale + screenScale*180 * Math.sin(Math.PI * 2 * (i / carouselPanels.length) + Math.PI * 2 * (carouselLocation + .58)), 310 * screenScale);
            // var newX = 1300 + 300 * Math.cos(Math.PI * 2 * (i / carouselPanels.length) + Math.PI * 2 * (carouselLocation + .58));
            
            var newX = renderWidth + (renderWidth/3) * Math.cos(Math.PI * 2 * (i / carouselPanels.length) + Math.PI * 2 * (carouselLocation + .58));
            var newZ = Math.max(0, Math.min(1, 1.1 * Math.sin(Math.PI * 2 * (i / carouselPanels.length) + Math.PI * 2 * (carouselLocation) + 1.2)));
            carouselPanels[i].setPosition(newX, newY, newZ);


            // var scale = getScale(panel.quad.position.y);

            // panel.quad.scale.set(scale, scale, scale, scale);

            // panel.setBlur(getBlur(panel.quad.position.y));
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
            var boundRes = panel.checkBounds(event.clientX,renderHeight - event.clientY);
            if(typeof boundRes == "string"){
                $(event.target).removeClass("grab");
                $(event.target).addClass("pointing");
                clickStart = boundRes;
                return;

            } else if(boundRes){
                $(event.target).addClass("grab");
                $(event.target).removeClass("pointing");
                return;
            }
        }
        $(event.target).removeClass("pointing");
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

    function setTwitter(){

        $.getJSON('http://cdn.api.twitter.com/1/urls/count.json?url=' + encodeURIComponent(document.URL) + '&callback=?', null, function (results) {
            if(typeof results.count == "number"){
                sharePanel.setTweets(results.count);
            }
        });
    }

    function setGithub(){

        $.getJSON('https://api.github.com/repos/arscan/lineup', null, function (results) {
            if(typeof results.stargazers_count == "number"){
                sharePanel.setStars(results.stargazers_count);
            }
        });
    }


    setTwitter();
    setGithub();
    LOADSYNC.start();

}

$(function(){
    var bgHeight = 1600;


    WebFont.load({
        google: {
            families: ['Roboto:500']
        },
        active: main.bind(this,$(window).width()) // TODO: FIGURE OUT THE WIDTH?
    }); 

/*
    $('body').height( bgHeight + $(window).height() );
    $(window).scroll(function() {
        if ( $(window).scrollTop() >= ($('body').height() - $(window).height()) ) {
            $(window).scrollTop(1);
        }
        else if ( $(window).scrollTop() == 0 ) {
            $(window).scrollTop($('body').height() - $(window).height() -1);
        }    
    });
*/

});

/*
$(window).resize(function() {
    $('body').height( bgHeight + $(window).height() );
});
*/
