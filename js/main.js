var VIDEO_ENABLED = false;

function main(renderWidth){

    var //loadingCirlce = createLoadingCircle($("#loading-graphic")),
        container = document.createElement( 'div' ),
        stats = new Stats(),
        renderer = new THREE.WebGLRenderer( { antialias: false, alpha: true } ), 
        hammertime = new Hammer(renderer.domElement),
        /* screen size */
        screenRatio = 23/9;
        standardWidth = 1280,
        screenScale = renderWidth / standardWidth,
        renderHeight = renderWidth/screenRatio,
        standardHeight = standardWidth/screenRatio,
        standardPanelSize = screenScale * 256,
        camera = new THREE.OrthographicCamera(0, renderWidth, renderHeight, 0, -1000, 1000),
        snapTween = new TWEEN.Tween(),
        scene = new THREE.Scene();

    /* panels and such */
    var skeletonPanel = createSkeletonPanel(renderer, screenScale),
        namePanel = createNamePanel(renderer, screenScale),
        sharePanel = createSharePanel(renderer, screenScale),
        tinyPanel1 = createTinyPanel1(renderer, screenScale),
        tinyPanel2 = createTinyPanel2(renderer, screenScale),
        tinyPanel3 = createTinyPanel3(renderer, screenScale),
        tinyPanel4 = createTinyPanel4(renderer, screenScale),
        tinyPanel5 = createTinyPanel5(renderer, screenScale),
        aboutPanel = createAboutPanel(renderer, screenScale),
        projectsPanel = createProjectsPanel(renderer, screenScale),
        photosPanel = createPhotosPanel(renderer, screenScale),
        bioPanel = createBioPanel(renderer, screenScale),
        linksPanel = createLinksPanel(renderer, screenScale),
        backgroundPanel = createBackgroundPanel(renderer, renderWidth, renderHeight),
        projectorPanel = createProjectorPanel(renderer, renderWidth, renderHeight, [namePanel, skeletonPanel, tinyPanel1, tinyPanel2, tinyPanel3, tinyPanel4, tinyPanel5, sharePanel, photosPanel, projectsPanel, aboutPanel, bioPanel, linksPanel]),
        subjectPanel = createSubjectPanel(renderer, screenScale);//326, 580, 500 + 326/2, 580/2 - 120 ),
        bottomPanel = createBottomPanel($("#bottom-panel").css({"top":renderHeight - (60 * screenScale) + Math.max(0,(window.innerHeight - renderHeight)/2), "width": renderWidth})),

        carouselPanels = [aboutPanel, linksPanel, bioPanel, photosPanel, projectsPanel],
        carouselLocation = 0,
        carouselGrabbed = false,
        carouselCenter = { x: renderWidth - 50 * screenScale, y: 420 * screenScale},
        carouselVelocity = 0,
        carouselSnapping = false,

        interactivePanels = [namePanel, skeletonPanel, sharePanel],
        grabbedPanel = null,
        grabStart = null,

        canvasTop = Math.max(0, (window.innerHeight - renderHeight)/2),

        clock = new THREE.Clock(false);

    // hide the rotation graphic 
    $("#please-rotate").css({display: "none"});

    // unhide the laoding graphic
    $("#cassette-bg").css({"visibility": "visible", "top": window.innerHeight/2 - 100 * screenScale, "left": window.innerWidth/2 - 100 * screenScale });


    /* add add position the main panels */
    scene.add(projectorPanel.quad);
    scene.add(subjectPanel.quad);
    scene.add(backgroundPanel.quad);
    backgroundPanel.quad.material.opacity = .1;

    skeletonPanel.setPosition(350 * screenScale, renderHeight - 20 * screenScale, 1);
    // namePanel.setPosition(50 * screenScale, 358*screenScale, 1);
    // sharePanel.setPosition(20 * screenScale, renderHeight - 20 * screenScale, 1);
    subjectPanel.setPosition(500 * screenScale, 450 * screenScale, 1);
    tinyPanel1.setPosition(2024 * screenScale, 100 * screenScale, .5);
    tinyPanel2.setPosition(-2024 * screenScale, 105 * screenScale, .5);
    tinyPanel3.setPosition(2024 * screenScale, 110 * screenScale, .5);
    tinyPanel4.setPosition(2024 * screenScale, 115 * screenScale, .5);
    tinyPanel5.setPosition(2024 * screenScale, 120 * screenScale, .5);

    sharePanel.setPosition(renderWidth + 1000, 0, 0);
    // put the carouselPanels off the right side of the screen
    for(var i = 0; i< carouselPanels.length; i++){
        carouselPanels[i].setPosition(renderWidth + 1000, 0, 0);

    }
    /* place and position the rendering canvas */
    container.appendChild( stats.domElement );
    document.body.appendChild( container );
    renderer.setSize( renderWidth, renderHeight );
    container.appendChild( renderer.domElement );
    $(renderer.domElement).css({top: canvasTop});

    function createChainedTween(element, commands, repeat){
       if(commands.length < 2){
           return;
       }
       var tweens = [];
        
       tweens[0] = new TWEEN.Tween(commands[0].position)
           .delay(commands[1].delay)
           .to(commands[1].position, commands[1].duration)
            .onUpdate(function(){
                element.setPosition(this.x, this.y, this.z);
            })
           .easing(commands[1].easing);

       for(var i = 2; i< commands.length; i++){
           tweens[i-1] = new TWEEN.Tween(commands[i-1].position)
               .delay(commands[i].delay)
               .to(commands[i].position, commands[i].duration)
                .onUpdate(function(){
                    element.setPosition(this.x, this.y, this.z);
                })
               .easing(commands[i].easing);
           tweens[i-2].chain(tweens[i-1]);
       }

       /* this is broken but I don't really care. it works for long enough */
       if(repeat){
           tweens[tweens.length-1].chain(tweens[0]);
       }
       return tweens[0];
    }

    function setPanelPositions(intro){
        for(var i = 0; i< carouselPanels.length; i++){
            if(intro && i > 0 && i < carouselPanels.length-1){
                continue;
            }
            var panel = carouselPanels[i];
            var newY = Math.max(carouselCenter.y + screenScale*180 * Math.sin(Math.PI * 2 * (i / carouselPanels.length) + Math.PI * 2 * (carouselLocation + .58)), 310 * screenScale);
            // var newX = 1300 + 300 * Math.cos(Math.PI * 2 * (i / carouselPanels.length) + Math.PI * 2 * (carouselLocation + .58));
            
            var newX = carouselCenter.x + (renderWidth/3) * Math.cos(Math.PI * 2 * (i / carouselPanels.length) + Math.PI * 2 * (carouselLocation + .58));
            var newZ = Math.max(0, Math.min(1, 1.1 * Math.sin(Math.PI * 2 * (i / carouselPanels.length) + Math.PI * 2 * (carouselLocation) + 1.2)));
            carouselPanels[i].setPosition(newX, newY, newZ);
        }
    }

    function tinyPanelTween(panel, startx, startz){
        var newX = Math.random() * 1200 * screenScale;
        var newZ = Math.random() * .5;

        new TWEEN.Tween({x: startx, z: startz})
            .to({x: newX, z: newZ}, 2000)
            .delay(Math.random() * 10000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(function(){
                panel.setPosition(this.x, undefined, this.z);
            })
            .onComplete(function(){
                tinyPanelTween(panel, newX, newZ);
            }).start();
    }

    function runIntroAnimation(){
        /* Background */
        new TWEEN.Tween({level: .1})
           .to({level: 1}, 3000)
           .easing(TWEEN.Easing.Quadratic.Out)
           .onUpdate(function(){
               backgroundPanel.setLightBarLevel(this.level);
               backgroundPanel.setLightLevel(this.level);
               subjectPanel.setBrightness(this.level);
               bottomPanel.element.css({opacity: this.level});

           }).start();


        /* Name Panel */
        createChainedTween(namePanel, [
            {position: {x: renderWidth, z:0}},
            {   delay: 0, 
                duration: 2000, 
                easing: TWEEN.Easing.Quintic.InOut,
                position: {x: 500 * screenScale, z:.2}
            },
            {   delay: 0, 
                duration: 1000, 
                easing: TWEEN.Easing.Back.Out,
                position: {x: 500 * screenScale, z:1}
            },
            {   delay: 2000, 
                duration: 2000, 
                easing: TWEEN.Easing.Back.Out,
                position: {x: 200 * screenScale}
            },
            {   delay: 4000, 
                duration: 2000, 
                easing: TWEEN.Easing.Quintic.InOut,
                position: {x: 50 * screenScale}
            },
        ]
        ).start();

        createChainedTween(namePanel, [
            {position: {y: renderHeight}},
            {   delay: 200, 
                duration: 2200, 
                easing: TWEEN.Easing.Back.InOut,
                position: {y: 340 * screenScale}
            },
            {   delay: 0, 
                duration: 1200, 
                easing: TWEEN.Easing.Back.Out,
                position: {y: 350 * screenScale}
            },
            {   delay: 2000, 
                duration: 2000, 
                easing: TWEEN.Easing.Back.Out,
                position: {y: 360 * screenScale}
            },
            {   delay: 4000, 
                duration: 2000, 
                easing: TWEEN.Easing.Quintic.InOut,
                position: {y: 358 * screenScale}
            },
        ]
        ).start();

        /* Share Panel */

        createChainedTween(sharePanel, [
            {position: {x: renderWidth + 100, z:0}},
            {   delay: 500, 
                duration: 1000, 
                easing: TWEEN.Easing.Quintic.Out,
                position: {x: renderWidth - 200 * screenScale, z:0}
            },
            {   delay: 1000, 
                duration: 3000, 
                easing: TWEEN.Easing.Quadratic.InOut,
                position: {x: 20 * screenScale, z: 1}
            },
        ]
        ).start();

        createChainedTween(sharePanel, [
            {position: {y: renderHeight - 120 * screenScale}},
            {   delay: 500, 
                duration: 1000, 
                easing: TWEEN.Easing.Back.Out,
                position: {y: renderHeight - 150 * screenScale}
            },
            {   delay: 0, 
                duration: 2000, 
                easing: TWEEN.Easing.Quintic.InOut,
                position: {y: renderHeight - 20 * screenScale}
            },
        ]
        ).start();

        /* carousel */

        new TWEEN.Tween({pos: -.5})
            .delay(3000)
            .to({pos: 0}, 2000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(function(){
                carouselLocation = this.pos;
                setPanelPositions(true);
            }).start();

        /* tiny panel 1 */
        tinyPanelTween(tinyPanel1, 2024 * screenScale, .5);
        tinyPanelTween(tinyPanel2, -2024 * screenScale, .5);
        tinyPanelTween(tinyPanel3, 2024 * screenScale, .5);
        tinyPanelTween(tinyPanel4, 2024 * screenScale, .5);
        tinyPanelTween(tinyPanel5, 2024 * screenScale, .5);

    }

    /* register what to do while loading */

    LOADSYNC.onUpdate(function(completedCount, totalCount){
        $(".cassette-tape").velocity("stop");
        $(".cassette-tape").velocity({"margin-left": 45 * completedCount / totalCount}, 1000);
    });

    /* register what we want to do when loading is complete */
    LOADSYNC.onComplete(function(){
        $("#loading-graphic").velocity({color: "#000", opacity: 0},{"display":"none"});
        runIntroAnimation();
        setTimeout(function(){clock.start()}, 6000);
        // clock.start();
    });


    function setInteraction(){

        /* window resize events */
        $(window).resize(function() {
            snapTween.stop();
            if($(window).width() > renderWidth * 1.3 || $(window).width() < renderWidth * .7){
                location.href = '?';
                return;
            }
            $('canvas').width($(window).width());
            $('canvas').height($(window).width() / screenRatio);
        });

        hammertime.get('pan').set({ direction: Hammer.DIRECTION_ALL });
        /* right carousel */
        hammertime.on('pan', function(ev){
            console.log("panning");
            if(ev.center.x > renderWidth / 2){
                snapTween.stop(); 

                if(ev.velocity < 0){
                    carouselVelocity = Math.max(-.5 * screenScale, ev.velocity / screenScale);
                } else {
                    carouselVelocity = Math.max(.001, Math.min(.5 * screenScale, ev.velocity / screenScale));
                }

                if((ev.direction === Hammer.DIRECTION_LEFT || ev.direction === Hammer.DIRECTION_RIGHT) && ev.center.y < renderHeight /3){
                    carouselVelocity *= -1;
                }

                return;
            } 

        });

        $("canvas").on('mousewheel', function(event){
            snapTween.stop();
            carouselVelocity = event.deltaY / 5 + carouselVelocity;
        });

        $(window).keydown(function(event){
            if(event.which === 40 || event.which === 39){
                snapTween.stop();
                carouselVelocity -= .2;
            } else if (event.which === 38 || event.which === 37) {
                snapTween.stop();
                carouselVelocity += .2;
            }
        });


    }

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

    function nearestCarouselSnap(){
        return Math.round(carouselLocation * carouselPanels.length) / carouselPanels.length;
    }

    function render(){
        // setTimeout(render, 1000/30);
        requestAnimationFrame(render);
        var delta = clock.getDelta();
        var time = clock.getElapsedTime();
        var carouselMoving = Math.abs(carouselVelocity) > 0;

        stats.update();
        carouselVelocity *= (1 - delta);

        if(Math.abs(carouselVelocity) > .02){
            carouselLocation = (carouselLocation + (-1 * delta * carouselVelocity * screenScale)) % 1;
            setPanelPositions();
        } else if(carouselMoving && Math.abs(carouselVelocity) <= .02){
            carouselVelocity = 0;
            carouselSnapping = true;

            snapTween = new TWEEN.Tween({pos: carouselLocation})
               .to({pos: nearestCarouselSnap()}, 1000)
               .onUpdate(function(){
                   carouselLocation = this.pos;
                   setPanelPositions();
               })
               .easing(TWEEN.Easing.Back.Out)
               .onComplete(function(){
                   carouselSnapping = false;

               }).start();
               


        }

        backgroundPanel.render(time);

        // skeletonPanel.quad.position.x = projectorPanel.width / 2 + Math.sin(time/2) * 300;
        skeletonPanel.render(time);
        namePanel.render(time);
        sharePanel.render(time);
        tinyPanel1.render(time);
        tinyPanel2.render(time);
        tinyPanel3.render(time);
        tinyPanel4.render(time);
        tinyPanel5.render(time);

        for(var i = 0; i < carouselPanels.length; i++){
            if(carouselPanels[i].quad.position.x < renderWidth + 200){
                carouselPanels[i].render(time);
            }
        }

        projectorPanel.render(time);
        subjectPanel.render();

        renderer.render(scene, camera);

        TWEEN.update();


    }

    setInteraction();
    setTwitter();
    setGithub();
    render();
    LOADSYNC.start();

}

$(function(){
    var bgHeight = 1600, 
        skipRotate = false,
        rotateCheckTimeout = null,
        isMobile = /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent);

    function isPortrait(){
        return ( isMobile && $(window).width() < $(window).height());
    }

    function load(){
        if(!isPortrait() || skipRotate){
            // $("body").height(4000);
            $("#please-rotate").css({"display": "none"});
            WebFont.load({
                google: {
                    families: ['Roboto:500']
                },
                active: function(){
                    if(isMobile){
                        $("#play-button").click(function(){
                            var video = $("#video")[0];
                            if(typeof video.load == "function"){
                                VIDEO_ENABLED = true;
                                video.src = "videos/test_vid.webm";
                                video.setAttribute('crossorigin', 'anonymous');
                                video.load(); // must call after setting/changing source
                                video.play();
                            } else {


                            }
                            main($(window).width());

                            $("#play-button").velocity({opacity: 0}, {complete: function(){
                                $("#play-button").css({display: "none"});
                            }});
                        });
                    } else {
                        var video = $("#video")[0];
                        if(typeof video.load == "function"){
                            VIDEO_ENABLED = true;
                            video.src = "videos/test_vid.webm";
                            video.setAttribute('crossorigin', 'anonymous');
                            video.load(); // must call after setting/changing source
                            video.play();
                        }
                        main($(window).width());
                    }
                }
            }); 
        } else {
            $("#please-rotate").css({"display": "block"});
            rotateCheckTimeout = setTimeout(load, 500);
        }
    }


    $("#please-rotate").click(function(){
        clearTimeout(rotateCheckTimeout);
        skipRotate = true;
        load();
    });

    if(!isMobile){
        $("#play-button").css({display: "none"});
    }

    load();
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

/*
$(window).resize(function() {
    $('body').height( bgHeight + $(window).height() );
});
*/
