function createSharePanel(renderer, scale){

   var STANDARD_DIMENSIONS = {width: 355, height:36};

   var width = STANDARD_DIMENSIONS.width * scale,
       height = STANDARD_DIMENSIONS.height * scale,
       twitterPlane,
       githubPlane,
       aboutPlane,
       twitterIconPlane,
       githubIconPlane,
       aboutIconPlane,
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

   function createAboutCanvas(){

       return panel.renderToCanvas(100*scale, height, function(ctx){
           ctx.strokeStyle="#fff";

           ctx.font = "" + fontSize + "pt Roboto";
           ctx.fillStyle = '#ff8d07';
           ctx.fillText('ABOUT', 5, 12*scale);

       });

   };


   function createTwitterCanvas(){

       return panel.renderToCanvas(150 * scale, height, function(ctx){
           ctx.strokeStyle="#fff";

           ctx.font = "" + fontSize + "pt Roboto";
           ctx.fillStyle = '#ff8d07';
           ctx.fillText(tweets + ' TWEETS', 5, 12*scale);

       });

   };

   function createGithubCanvas(){
       return panel.renderToCanvas(100 * scale, height, function(ctx){
           ctx.strokeStyle="#fff";

           ctx.font = fontSize + "pt Roboto";
           ctx.fillStyle = '#ff8d07';
           ctx.fillText(githubStars + ' STARS', 5, 12*scale);
       });
   };

    function init(){

        createBackground();

        var aboutIconTexture = THREE.ImageUtils.loadTexture('images/about.png', undefined, LOADSYNC.register() );
        var aboutIconMaterial = new THREE.MeshBasicMaterial({map: aboutIconTexture, transparent: true});
        var aboutIconGeometry = new THREE.PlaneBufferGeometry( 25 * scale, 25*scale );
        aboutIconPlane = new THREE.Mesh(aboutIconGeometry, aboutIconMaterial );
        aboutIconPlane.position.set(25*scale, 25*scale/2 + 4, 0);
        panel.addToScene(aboutIconPlane);

        var aboutTexture = new THREE.Texture(createAboutCanvas())
        aboutTexture.needsUpdate = true;
        aboutPlane = new THREE.Mesh(new THREE.PlaneBufferGeometry( 100 * scale, height ),new THREE.MeshBasicMaterial({map: aboutTexture, transparent: true}));
        aboutPlane.position.set(90*scale, 5 * scale, 0);
        panel.addToScene( aboutPlane );

        var twitterIconTexture = THREE.ImageUtils.loadTexture('images/twitter.png', undefined, LOADSYNC.register() );
        var twitterIconMaterial = new THREE.MeshBasicMaterial({map: twitterIconTexture, transparent: true});
        var twitterIconGeometry = new THREE.PlaneBufferGeometry( 25 * scale, 25*scale );
        twitterIconPlane = new THREE.Mesh(twitterIconGeometry, twitterIconMaterial );
        twitterIconPlane.position.set(width/3 + 25*scale - 20, 25*scale/2 + 4, 0);
        panel.addToScene(twitterIconPlane);

        var twitterTexture = new THREE.Texture(createTwitterCanvas())
        twitterTexture.needsUpdate = true;
        twitterPlane = new THREE.Mesh(new THREE.PlaneBufferGeometry( 150 * scale, height ),new THREE.MeshBasicMaterial({map: twitterTexture, transparent: true}));
        twitterPlane.position.set(220 * scale, 5 * scale, 0);
        panel.addToScene( twitterPlane );

        var githubIconTexture = THREE.ImageUtils.loadTexture('images/github.png', undefined, LOADSYNC.register() );
        var githubIconMaterial = new THREE.MeshBasicMaterial({map: githubIconTexture, transparent: true});
        var githubIconGeometry = new THREE.PlaneBufferGeometry( 25 * scale, 25 * scale);
        githubIconPlane = new THREE.Mesh(githubIconGeometry, githubIconMaterial );
        githubIconPlane.position.set(2*width/3 + 25 * scale / 2 + 5, 25*scale/2 + 2, 0);
        panel.addToScene(githubIconPlane);

        var githubTexture = new THREE.Texture(createGithubCanvas())
        githubTexture.needsUpdate = true;
        githubPlane = new THREE.Mesh(new THREE.PlaneBufferGeometry( 100 * scale, height ), new THREE.MeshBasicMaterial({map: githubTexture, transparent: true}));
        githubPlane.position.set(320 * scale, 5 * scale, 0);
        panel.addToScene( githubPlane );
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
                    new TWEEN.Tween({val: .95})
                        .to({val: 1}, 300)
                        .onUpdate(function(){
                            aboutIconPlane.scale.set(this.val, this.val, this.val);
                            aboutPlane.scale.set(this.val, this.val, this.val);
                        }).start();
                }
                currentSelection = 0;
                return function(){
                    alert('about called');

                }
            } else if(panelPos.x > width / 3 && panelPos.x < 2 * width/3) {
                if(currentSelection != 1){
                    new TWEEN.Tween({val: .95})
                        .to({val: 1}, 300)
                        .onUpdate(function(){
                            twitterIconPlane.scale.set(this.val, this.val, this.val);
                            twitterPlane.scale.set(this.val, this.val, this.val);
                        }).start();
                }
                currentSelection = 1;
                return "https://twitter.com/intent/tweet?original_referer=http%3A%2F%2Frobscanlon.com%2flineup&text=%23GotG%20Lineup%20in%20HTML5&tw_p=tweetbutton&url=http%3A%2F%2Fwww.robscanlon.com%2Flineup%2F&via=arscan";

            } else {
                if(currentSelection != 2){
                    new TWEEN.Tween({val: .95})
                        .to({val: 1}, 300)
                        .onUpdate(function(){
                            githubIconPlane.scale.set(this.val, this.val, this.val);
                            githubPlane.scale.set(this.val, this.val, this.val);
                        }).start();
                }
                currentSelection = 2;
                return "http://github.com/arscan/lineup";
            }
        }
        currentSelection = -1;

        return false;
    }

    function setTweets(_tweets){
        tweets = Math.min(9999,_tweets);

        var twitterTexture = new THREE.Texture(createTwitterCanvas())
        twitterTexture.needsUpdate = true;
        twitterPlane.material.map = twitterTexture;
    }

    function setStars(_stars){
        githubStars = _stars;

        var githubTexture = new THREE.Texture(createGithubCanvas())
        githubTexture.needsUpdate = true;
        githubPlane.material.map = githubTexture;
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

