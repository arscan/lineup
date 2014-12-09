function createSharePanel(renderer, scale){

   var STANDARD_DIMENSIONS = {width: 255, height:30};

   var width = STANDARD_DIMENSIONS.width * scale,
       height = STANDARD_DIMENSIONS.height * scale,
       twitterPlane,
       githubPlane,
       githubStars = 0,
       tweets = 0,
       fontSize = Math.floor(12 * scale),
       startPosition = {x: 0, y: 0};

   var panel = createPanel(renderer, width, height);


   function createTwitterCanvas(){

       return panel.renderToCanvas(width/2, height, function(ctx){
           ctx.strokeStyle="#fff";

           ctx.font = "" + fontSize + "pt Roboto";
           ctx.fillStyle = '#ff8d07';
           ctx.fillText(tweets + ' tweets', 5, 12*scale);

       });

   };

   function createGithubCanvas(){
       return panel.renderToCanvas(width/2, height, function(ctx){
           ctx.strokeStyle="#fff";

           ctx.font = fontSize + "pt Roboto";
           ctx.fillStyle = '#ff8d07';
           ctx.fillText(githubStars + ' stars', 5, 12*scale);
       });
   };

    function init(){

        var twitterIconTexture = THREE.ImageUtils.loadTexture('images/twitter.png', undefined, LOADSYNC.register() );
        var twitterIconMaterial = new THREE.MeshBasicMaterial({map: twitterIconTexture, transparent: true});
        var twitterIconGeometry = new THREE.PlaneBufferGeometry( 25 * scale, 25*scale );
        var twitterIconPlane = new THREE.Mesh(twitterIconGeometry, twitterIconMaterial );
        twitterIconPlane.position.set(25*scale, 25*scale/2 + 4, 0);
        panel.addToScene(twitterIconPlane);

        var twitterTexture = new THREE.Texture(createTwitterCanvas())
        twitterTexture.needsUpdate = true;
        twitterPlane = new THREE.Mesh(new THREE.PlaneBufferGeometry( width/2, height ),new THREE.MeshBasicMaterial({map: twitterTexture, transparent: true}));
        twitterPlane.position.set(24*scale*1.6 + width/4 , 5, 0);
        panel.addToScene( twitterPlane );

        var githubIconTexture = THREE.ImageUtils.loadTexture('images/github.png', undefined, LOADSYNC.register() );
        var githubIconMaterial = new THREE.MeshBasicMaterial({map: githubIconTexture, transparent: true});
        var githubIconGeometry = new THREE.PlaneBufferGeometry( 25 * scale, 25 * scale);
        var githubIconPlane = new THREE.Mesh(githubIconGeometry, githubIconMaterial );
        githubIconPlane.position.set(width/2 + 25 * scale / 2 + 5, 25*scale/2 + 2, 0);
        panel.addToScene(githubIconPlane);

        var githubTexture = new THREE.Texture(createGithubCanvas())
        githubTexture.needsUpdate = true;
        githubPlane = new THREE.Mesh(new THREE.PlaneBufferGeometry( width/2, height ), new THREE.MeshBasicMaterial({map: githubTexture, transparent: true}));
        githubPlane.position.set(width/2 + 25*scale *1.3 + width/4, 5, 0);
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

            if(panelPos.x < width / 2){
                return "https://twitter.com/intent/tweet?original_referer=http%3A%2F%2Frobscanlon.com%2flineup&text=%23GotG%20Lineup%20in%20HTML5&tw_p=tweetbutton&url=http%3A%2F%2Fwww.robscanlon.com%2Flineup%2F&via=arscan";
            } else {
                return "http://github.com/arscan/lineup";
            }

            return true;
        }

        return false;
    }

    function setTweets(_tweets){
        tweets = _tweets;

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

