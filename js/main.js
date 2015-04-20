var VIDEO_ENABLED = window.location.href.indexOf('?DISABLE_VIDEO') === -1;

function main(renderWidth){

    var container = document.createElement( 'div' ),
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
        projectsPanel = createProjectsPanel(renderer, screenScale),
        photosPanel = createPhotosPanel(renderer, screenScale),
        linksPanel = createLinksPanel(renderer, screenScale),
        backgroundPanel = createBackgroundPanel(renderer, renderWidth, renderHeight),
        projectorPanel = createProjectorPanel(renderer, renderWidth, renderHeight, [namePanel, skeletonPanel, tinyPanel1, tinyPanel2, tinyPanel3, tinyPanel4, tinyPanel5, sharePanel, photosPanel, projectsPanel, linksPanel]),
        subjectPanel = createSubjectPanel(renderer, screenScale);//326, 580, 500 + 326/2, 580/2 - 120 ),
        bottomPanel = createBottomPanel($("#bottom-panel").css({"top":renderHeight - (60 * screenScale) + Math.max(0,(window.innerHeight - renderHeight)/2), "width": renderWidth})),

        carouselPanels = [linksPanel, photosPanel, projectsPanel],
        carouselLocation = 0,
        carouselGrabbed = false,
        carouselCenter = { x: renderWidth - 100 * screenScale, y: 420 * screenScale},
        carouselVelocity = 0,
        carouselSnapping = false,

        mouseX = 0,

        interactivePanels = [namePanel, skeletonPanel, sharePanel],
        grabbedPanel = null,
        grabStart = null,

        canvasTop = Math.max(0, (window.innerHeight - renderHeight)/2),

        clock = new THREE.Clock(false);

    /* add add position the main panels */
    scene.add(projectorPanel.quad);
    scene.add(subjectPanel.quad);
    scene.add(backgroundPanel.quad);
    backgroundPanel.quad.material.opacity = .1;

    skeletonPanel.setPosition(380 * screenScale, renderHeight - 20 * screenScale, 1);
    subjectPanel.setPosition(450 * screenScale, 450 * screenScale, 1);
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
               // subjectPanel.setBrightness(this.level);
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
            {   delay: 1000, 
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
            {   delay: 1000, 
                duration: 2000, 
                easing: TWEEN.Easing.Quintic.InOut,
                position: {y: 358 * screenScale}
            },
        ]
        ).start();

        /* Share Panel */

        createChainedTween(sharePanel, [
            {position: {x: renderWidth + 100, z:0}},
            {   delay: 0, 
                duration: 500, 
                easing: TWEEN.Easing.Quintic.Out,
                position: {x: renderWidth - 200 * screenScale, z:0}
            },
            {   delay: 500, 
                duration: 2000, 
                easing: TWEEN.Easing.Quintic.InOut,
                position: {x: 20 * screenScale, z: 1}
            },
        ]
        ).start();

        createChainedTween(sharePanel, [
            {position: {y: renderHeight - 120 * screenScale}},
            {   delay: 0, 
                duration: 500, 
                easing: TWEEN.Easing.Back.Out,
                position: {y: renderHeight - 150 * screenScale}
            },
            {   delay: 0, 
                duration: 1300, 
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
        setTimeout(function(){clock.start()}, 3000);
        // clock.start();
    });

    function setInteraction(){
        var prevDeltaX = 0, 
            prevDeltaY = 0, 
            panning = false,
            panTimeout = null,
            panStartPositionX = namePanel.quad.position.x,
            panStartPositionY = namePanel.quad.position.y;

        /* window resize events */
        $(window).resize(function() {
            snapTween.stop();
            if($(window).width() > renderWidth * 1.3 || $(window).width() < renderWidth * .7){
                // location.href = '?';
                // return;
            }
            $('canvas').width($(window).width());
            $('canvas').height($(window).width() / screenRatio);
        });

        hammertime.get('pan').set({ direction: Hammer.DIRECTION_ALL });
        /* right carousel */
        hammertime.on('pan', function(ev){
            if(ev.center.x > renderWidth / 2 && !panning){
                snapTween.stop(); 

                if(ev.velocity < 0){
                    carouselVelocity = Math.max(-.8 * screenScale, ev.velocity / screenScale);
                } else {
                    carouselVelocity = Math.max(.001, Math.min(.8 * screenScale, ev.velocity / screenScale));
                }

                if((ev.direction === Hammer.DIRECTION_LEFT || ev.direction === Hammer.DIRECTION_RIGHT) && ev.center.y < renderHeight /3){
                    carouselVelocity *= -1;
                }
                 carouselVelocity *= 1.3;

                return;
            } 

            // check to see if we are on the name panel

            if(namePanel.checkBounds(ev.center.x, renderHeight - ev.center.y)){
                if(!panning){
                    panStartPositionX = namePanel.quad.position.x;
                    panStartPositionY= namePanel.quad.position.y;
                }
                panning = true;
                namePanel.setDeltaPosition(ev.deltaX - prevDeltaX, -1 * (ev.deltaY - prevDeltaY));
                prevDeltaX = ev.deltaX;
                prevDeltaY = ev.deltaY;
                clearTimeout(panTimeout);
                panTimeout = setTimeout(function(){
                    prevDeltaX = 0; 
                    prevDeltaY = 0; 
                    panning = false;
                    new TWEEN.Tween({x: namePanel.quad.position.x})
                         .to({x: panStartPositionX})
                         .easing(TWEEN.Easing.Back.Out)
                         .onUpdate(function(){
                             namePanel.quad.position.x = this.x;
                         })
                         .start();
                    new TWEEN.Tween({y: namePanel.quad.position.y})
                         .delay(100)
                         .to({y: panStartPositionY})
                         .easing(TWEEN.Easing.Back.Out)
                         .onUpdate(function(){
                             namePanel.quad.position.y = this.y;
                         })
                         .start();
                }, 1000);

            }

        });

        $("canvas").on('mousewheel', function(event){
            snapTween.stop();
            carouselVelocity = Math.max(-.5, Math.min(.5, event.deltaY / 6 + carouselVelocity));
        });
        $("canvas").on('click', function(event){
            if(carouselVelocity === 0){
                for(var i = 0; i< carouselPanels.length; i++){
                    var res= carouselPanels[i].checkBounds(event.offsetX, renderHeight - event.offsetY);
                    if(typeof res === "string"){
                        location.href=res;
                        return;
                    }

                }
            }

            var res= sharePanel.checkBounds(event.offsetX, renderHeight - event.offsetY)
            if(typeof res === "string"){
                location.href=res;
                return;
            }

        });
        $("canvas").on('mousemove', function(event){
            mouseX = event.offsetX;
            if(carouselVelocity === 0){
                for(var i = 0; i< carouselPanels.length; i++){
                    var res= carouselPanels[i].checkBounds(event.offsetX, renderHeight - event.offsetY);
                    if(typeof res === "string"){
                        $("canvas").addClass("pointing");
                        return;
                    }

                }
            }

            var res= sharePanel.checkBounds(event.offsetX, renderHeight - event.offsetY);
            if(typeof res === "string"){
                $("canvas").addClass("pointing");
                return;
            }

            $("canvas").removeClass("pointing");

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

        requestAnimationFrame(render);
        // setTimeout(render, 1000/5);

        var url = null;
        var tmpUrl = null;
        var delta = clock.getDelta();
        var time = clock.getElapsedTime();
        var carouselMoving = Math.abs(carouselVelocity) > 0;

        var numTicks = (delta / .01666)

        stats.update();
        carouselVelocity *= Math.pow(.95, numTicks);

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


        skeletonPanel.render(time, 2 * Math.PI * mouseX / renderWidth);
        namePanel.render(time);

        backgroundPanel.render(time);

        tinyPanel1.render(time);
        tinyPanel2.render(time);
        tinyPanel3.render(time);
        tinyPanel4.render(time);
        tinyPanel5.render(time);
        sharePanel.render(time);


        for(var i = 0; i < carouselPanels.length; i++){
            if(carouselPanels[i].quad.position.x < renderWidth + 200){
                carouselPanels[i].render(time);
            }
        }

        projectorPanel.render(time);

        try {
            subjectPanel.render();
        } catch (ex){
            location.href='?DISABLE_VIDEO';
        }

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
        isMobile = /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent),
        loaded = false;

    function getWidth(){
        /* I don't know why my ipad doesn't want to display the right width, soooo lets hardcode! */
        if(/iPad/i.test(navigator.userAgent)){
            return 1024;
        } else {
            return $(window).width();
        }
    }

    function load(){
        loaded = true;
        $("#cassette-bg").css({"visibility":"hidden"});
        $("#play-image").css({"display": "block", "top": window.innerHeight/2 - 50, "left": window.innerWidth/2});
        $("#cassette-svg").css({"top": window.innerHeight/2 - 150, "left": window.innerWidth/2 - 300});
        new Vivus('cassette-svg', {type: 'oneByOne', duration: 100, start: "autostart"}, function(){
            WebFont.load({
                google: {
                    families: ['Roboto:500']
                },
                active: function(){
                    // unhide the laoding graphic
                    $("#cassette-bg").css({"visibility": "visible", "top": window.innerHeight/2, "left": window.innerWidth/2});
                    if(isMobile && VIDEO_ENABLED){
                        $("#play-button").click(function(){
                            $("#play-button").velocity({opacity: 0}, {complete: function(){
                                $("#play-button").css({display: "none"});
                            }});
                            setTimeout(function(){
                                var video = $("#video")[0];
                                if(typeof video.load == "function"){
                                    video.src = "videos/video.mp4";
                                    video.setAttribute('crossorigin', 'anonymous');
                                    video.load();
                                    video.play();
                                } else {
                                    VIDEO_ENABLED = false;

                                }
                                main(getWidth());
                            }, 500);

                        });
                    } else {
                        var video = $("#video")[0];
                        if(typeof video.load == "function" && VIDEO_ENABLED){
                            video.src = "videos/video.mp4";
                            video.setAttribute('crossorigin', 'anonymous');
                            video.load();
                            video.play();
                        } else {
                            VIDEO_ENABLED = false;

                        }
                        main(getWidth());
                    }
                }
            }); 
        });
    }


    if(!isMobile || !VIDEO_ENABLED){
        $("#play-button").css({display: "none"});
    }

    PleaseRotate.onHide(function(){
        console.log("hide");
        if(!loaded){
            load();
        }
    });
});
