function createSharePanel(renderer, scale){

   var STANDARD_DIMENSIONS = {width: 355, height:36};

   var width = STANDARD_DIMENSIONS.width * scale,
       height = STANDARD_DIMENSIONS.height * scale,
       twitterPlane,
       twitterHighlightPlane,
       githubPlane,
       githubHighlightPlane,
       aboutPlane,
       aboutHighlightPlane,
       currentTween,
       githubStars = 0,
       tweets = 0,
       fontSize = Math.floor(8 * scale),
       startPosition = {x: 0, y: 0},
       currentSelection = -1;

   var panel = createPanel(renderer, width, height, {foregroundGlow: true});

   function createBackground(){

        var material = new THREE.MeshBasicMaterial({transparent: false, color: 0x000000});
        var geometry = new THREE.PlaneBufferGeometry( width, height);

        var plane = new THREE.Mesh( geometry, material );
        plane.position.set(width/2, height/2, -1);
        panel.addToScene( plane );
   };


   function createTextCanvas(text, color){
       return panel.renderToCanvas(150*scale, height, function(ctx){
           ctx.strokeStyle="#fff";

           ctx.font = "" + fontSize + "pt Roboto";
           ctx.fillStyle = color;//'#ff8d07';
           ctx.fillText(text, 5, 12*scale);

       });

   }
   function createTextPlane(text, color, background){
       
       var canvas = createTextCanvas(text, color);
       var texture = new THREE.Texture(canvas);

        texture.needsUpdate = true;
        
        var plane = new THREE.Mesh(new THREE.PlaneBufferGeometry( 150 * scale, height ),new THREE.MeshBasicMaterial({map: texture, transparent: true, opacity: (background ? 0 : 1)}));

        return plane;
   };


    function init(){

        createBackground();

        var aboutIconTexture = THREE.ImageUtils.loadTexture('images/about.png', undefined, LOADSYNC.register() );
        var aboutIconMaterial = new THREE.MeshBasicMaterial({map: aboutIconTexture, transparent: true});
        var aboutIconGeometry = new THREE.PlaneBufferGeometry( 25 * scale, 25*scale );
        var aboutIconPlane = new THREE.Mesh(aboutIconGeometry, aboutIconMaterial );
        aboutIconPlane.position.set(25*scale, 25*scale/2 + 4, 0);
        panel.addToScene(aboutIconPlane);

        aboutPlane = createTextPlane("ABOUT", "#ff8d07");
        aboutPlane.position.set(115*scale, 5 * scale, 0);
        panel.addToScene( aboutPlane );

        aboutHighlightPlane = createTextPlane("ABOUT", "#ffffff", true);
        aboutHighlightPlane.position.set(115*scale, 5 * scale, 0);
        panel.addToScene( aboutHighlightPlane );

        var twitterIconTexture = THREE.ImageUtils.loadTexture('images/twitter.png', undefined, LOADSYNC.register() );
        var twitterIconMaterial = new THREE.MeshBasicMaterial({map: twitterIconTexture, transparent: true});
        var twitterIconGeometry = new THREE.PlaneBufferGeometry( 25 * scale, 25*scale );
        var twitterIconPlane = new THREE.Mesh(twitterIconGeometry, twitterIconMaterial );
        twitterIconPlane.position.set(120 * scale, 25*scale/2 + 4, 0);
        panel.addToScene(twitterIconPlane);

        twitterPlane = createTextPlane(tweets + " TWEETS", "#ff8d07");
        twitterPlane.position.set(210 * scale, 5 * scale, 0);
        panel.addToScene( twitterPlane );

        twitterHighlightPlane = createTextPlane(tweets + " TWEETS", "#ffffff", true);
        twitterHighlightPlane.position.set(210 * scale, 5 * scale, 0);
        panel.addToScene( twitterHighlightPlane );

        var githubIconTexture = THREE.ImageUtils.loadTexture('images/github.png', undefined, LOADSYNC.register() );
        var githubIconMaterial = new THREE.MeshBasicMaterial({map: githubIconTexture, transparent: true});
        var githubIconGeometry = new THREE.PlaneBufferGeometry( 25 * scale, 25 * scale);
        var githubIconPlane = new THREE.Mesh(githubIconGeometry, githubIconMaterial );
        githubIconPlane.position.set(2*width/3 + 25 * scale / 2 + 5, 25*scale/2 + 2, 0);
        panel.addToScene(githubIconPlane);

        githubPlane = createTextPlane(githubStars + " STARS", "#ff8d07");
        githubPlane.position.set(345 * scale, 5 * scale, 0);
        panel.addToScene( githubPlane );

        githubHighlightPlane = createTextPlane(githubStars + " STARS", "#ffffff", true);
        githubHighlightPlane.position.set(345 * scale, 5 * scale, 0);
        panel.addToScene( githubHighlightPlane );

    }

    function render(time){
        if(time === 0){
            startPosition.x = panel.quad.position.x;
            startPosition.y = panel.quad.position.y;
        } else {
            panel.setPosition(startPosition.x - width / 2 + Math.sin(time) * 10);
        }

        panel.render(time);
    }

    function checkBounds(x, y){
        if(panel.checkBounds(x,y)){
            var panelPos = panel.positionWithinPanel(x, y);

            if(panelPos.x < width / 3){
                if(currentSelection != 0){
                    if(currentTween){
                        currentTween.stop();
                    }
                    currentTween = new TWEEN.Tween({val: 0})
                        .to({val: 1}, 400)
                        .onUpdate(function(){
                            aboutHighlightPlane.material.opacity = this.val;
                            twitterHighlightPlane.material.opacity = Math.min(twitterHighlightPlane.material.opacity, 1 - this.val);
                            githubHighlightPlane.material.opacity = Math.min(githubHighlightPlane.material.opacity, 1 - this.val);
                        }).start();
                }
                currentSelection = 0;
                return function(){
                    $("#about-panel").css("display", "block");
                }
            } else if(panelPos.x > width / 3 && panelPos.x < 2 * width/3) {
                if(currentSelection != 1){
                    if(currentTween){
                        currentTween.stop();
                    }
                    currentTween = new TWEEN.Tween({val: 0})
                        .to({val: 1}, 300)
                        .onUpdate(function(){
                            twitterHighlightPlane.material.opacity = this.val;
                            aboutHighlightPlane.material.opacity = Math.min(aboutHighlightPlane.material.opacity, 1 - this.val);
                            githubHighlightPlane.material.opacity = Math.min(githubHighlightPlane.material.opacity, 1 - this.val);
                        }).start();
                }
                currentSelection = 1;
                return "https://twitter.com/intent/tweet?original_referer=http%3A%2F%2Frobscanlon.com%2flineup&text=%23GotG%20Lineup%20in%20HTML5&tw_p=tweetbutton&url=http%3A%2F%2Fwww.robscanlon.com%2Flineup%2F&via=arscan";

            } else {
                if(currentSelection != 2){
                    if(currentTween){
                        currentTween.stop();
                    }
                    currentTween = new TWEEN.Tween({val: 0})
                        .to({val: 1}, 300)
                        .onUpdate(function(){
                            githubHighlightPlane.material.opacity = this.val;
                            aboutHighlightPlane.material.opacity = Math.min(aboutHighlightPlane.material.opacity, 1 - this.val);
                            twitterHighlightPlane.material.opacity = Math.min(twitterHighlightPlane.material.opacity, 1 - this.val);
                        }).start();
                }
                currentSelection = 2;
                return "http://github.com/arscan/lineup";
            }
        }

        if(currentSelection != -1){
            if(currentTween){
                currentTween.stop();
            }
            currentTween = new TWEEN.Tween({val: 0})
                .to({val: 1}, 300)
                .onUpdate(function(){
                    twitterHighlightPlane.material.opacity = Math.min(twitterHighlightPlane.material.opacity, 1 - this.val);
                    aboutHighlightPlane.material.opacity = Math.min(aboutHighlightPlane.material.opacity, 1 - this.val);
                    githubHighlightPlane.material.opacity = Math.min(githubHighlightPlane.material.opacity, 1 - this.val);
                }).start();
            currentSelection = -1;
        }

        return false;
    }

    function setTweets(_tweets){
        tweets = Math.min(9999,_tweets);

        var twitterTexture = new THREE.Texture(createTextCanvas(tweets + " TWEETS", "#ff8d07"));
        twitterTexture.needsUpdate = true;
        twitterPlane.material.map = twitterTexture;

        var twitterHighlightTexture = new THREE.Texture(createTextCanvas(tweets + " TWEETS", "#ffffff"));
        twitterHighlightTexture.needsUpdate = true;
        twitterHighlightPlane.material.map = twitterHighlightTexture;
    }

    function setStars(_stars){
        githubStars = _stars;

        var githubTexture = new THREE.Texture(createTextCanvas(githubStars + " STARS", "#ff8d07"));
        githubTexture.needsUpdate = true;
        githubPlane.material.map = githubTexture;

        var githubHighlightTexture = new THREE.Texture(createTextCanvas(githubStars + " STARS", "#ffffff"));
        githubHighlightTexture.needsUpdate = true;
        githubHighlightPlane.material.map = githubHighlightTexture;
    }

    init();

    return Object.freeze({
        toString: function(){return "SharePanel"},
        render: render,
        renderTarget: panel.renderTarget,
        width: width,
        height: height,
        quad: panel.quad,
        checkBounds: checkBounds,
        setBlur: panel.setBlur,
        setTweets: setTweets,
        setStars: setStars,
        setPosition: panel.setPosition
    });
}

