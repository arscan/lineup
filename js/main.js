
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
    var skeletonPanel = createSkeletonPanel(renderer, 250, 400, 512/2+ 200, 512/2+ 60),
        namePanel = createNamePanel(renderer, 256, 256, 200, 512/2 - 80),
        sharePanel = createSharePanel(renderer, screenScale),
        projectsPanel = createProjectsPanel(renderer, 256, 256, 1000, 200),
        aboutPanel = createAboutPanel(renderer, 256, 256, 1000, 400),
        bioPanel = createBioPanel(renderer, 256, 256, 1000, 400),
        linksPanel = createLinksPanel(renderer, 256, 256, 1000, 400),
        backgroundPanel = createBackgroundPanel(renderer, renderWidth, renderHeight),
        projectorPanel = createProjectorPanel(renderer, 1280, 580, [namePanel, skeletonPanel, sharePanel, projectsPanel, aboutPanel, bioPanel, linksPanel]),
        //subjectPanel = createSubjectPanel(renderer, 326, 580, 500 + 326/2, 580/2 - 120 ),
        bottomPanel = createBottomPanel($("#bottom-panel")),

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

    sharePanel.setPosition(20, renderHeight - 20);

    /* add the elements */
    container.appendChild( stats.domElement );
    document.body.appendChild( container );
    // renderer.setSize( 1280, 580 );
    renderer.setSize( renderWidth, renderHeight );
    container.appendChild( renderer.domElement );

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
        backgroundPanel.render();

        // skeletonPanel.quad.position.x = projectorPanel.width / 2 + Math.sin(time/2) * 300;
        skeletonPanel.render();
        namePanel.render();
        sharePanel.render();

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

    $("#bottom-panel").css({"top": renderHeight - 50});

    setTwitter();
    setGithub();
    LOADSYNC.start();

}

$(function(){

    WebFont.load({
        google: {
            families: ['Roboto:500']
        },
        active: main.bind(this,1280) // TODO: FIGURE OUT THE WIDTH?
    }); 

});
