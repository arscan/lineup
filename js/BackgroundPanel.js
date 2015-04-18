
function createBackgroundPanel(renderer, width, height){

    var targetParams = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat};
    var renderTarget = new THREE.WebGLRenderTarget(width, height, targetParams);
    var quad = new THREE.Mesh( new THREE.PlaneBufferGeometry(width, height), new THREE.MeshBasicMaterial({map: renderTarget}));
    quad.position.set(width/2,height/2, 0);


    var pointLight1, pointLight2, pointLight4;
    var scene = new THREE.Scene();
    var camera;
    var startTime = Date.now();


    var ambientLight,
        ambientLightColor = new THREE.Color(0x12b7a7),
        overheadLight,
        overheadLightColor = new THREE.Color(0x12b7a7),
        middleLight,
        middleLightColor = new THREE.Color(0xff9600);

    function setBrightness(color, brightness){
        return new THREE.Color(color.r * brightness, color.g * brightness, color.b * brightness);
    }


    function init(){

        camera = new THREE.PerspectiveCamera( 27, renderTarget.width / renderTarget.height, 1, 10000 );
        camera.position.x = 70;
        camera.position.y = 90;
        camera.position.z = 1500;


        overheadLight = new THREE.PointLight( 0x000000, 3.95, 2000 );
        
        overheadLight.position.y = 850;
        overheadLight.position.z = -420;
        scene.add(overheadLight);

        middleLight = new THREE.PointLight( 0x000000, 0.85, 1000 );
        
        middleLight.position.y = height/2;
        middleLight.position.z = 300;
        scene.add(middleLight);

        // LIGHTS

        var ambientLight = new THREE.AmbientLight( setBrightness(ambientLightColor,.08) );
        // scene.add( ambientLight );

        pointLight1 = new THREE.PointLight( 0xeac7df, 0.75, 1500 );
        pointLight1.position.z = -480;

        pointLight2 = new THREE.PointLight( 0x479578, 0.75, 1500 );
        pointLight2.position.z = -480;

        var ambient = 0x111111, diffuse = 0xbbbbbb, specular = 0x060606, shininess = 15;

        var material = new THREE.MeshPhongMaterial( {
           color: diffuse,
           specular: specular,
           shininess: shininess,
           map: THREE.ImageUtils.loadTexture( "images/background_diffuse.png", undefined, LOADSYNC.register() ),
           normalMap: THREE.ImageUtils.loadTexture( "images/background_normal.png", undefined, LOADSYNC.register() ),
           normalScale: new THREE.Vector2( 0.8, 0.8 ),
        } );

        var geometry= new THREE.PlaneBufferGeometry(800, 600);

        var spacerGeometry= new THREE.PlaneBufferGeometry(48, 1600);
        var spacerMaterial = new THREE.MeshPhongMaterial( { ambient: 0x000000, color: 0x9fa4b7, specular: 0x000000, shininess: 0, shading: THREE.FlatShading } );

        var spacerMesh = new THREE.Mesh( spacerGeometry, spacerMaterial );

        spacerMesh.position.z = -499;
        spacerMesh.position.x = -524;
        spacerMesh.position.y = -200;

        scene.add(spacerMesh);

        createPanel(geometry, {x:-100,y:300}, material);
        createPanel(geometry, {x:700,y:300}, material);
        createPanel(geometry, {x:1500,y:300}, material);
        createPanel(geometry, {x:-940,y:300}, material);
        createPanel(geometry, {x:-100,y:-300}, material);
        createPanel(geometry, {x:700,y:-300}, material);
        createPanel(geometry, {x:1500,y:-300}, material);
        createPanel(geometry, {x:-940,y:-300}, material);

        var number1 = new THREE.Mesh(new THREE.PlaneBufferGeometry(35, 35), 
                                     new THREE.MeshBasicMaterial({transparent: true, opacity: .7, map: THREE.ImageUtils.loadTexture("images/number1.png", undefined, LOADSYNC.register())}));
        number1.position.set(-510, 340, -460);
        scene.add(number1);

        var number2 = new THREE.Mesh(new THREE.PlaneBufferGeometry(35, 35), 
                                     new THREE.MeshBasicMaterial({transparent: true, opacity: .7, map: THREE.ImageUtils.loadTexture("images/number2.png", undefined, LOADSYNC.register())}));
        number2.position.set(-510, 145, -460);
        scene.add(number2);

        var number3 = new THREE.Mesh(new THREE.PlaneBufferGeometry(35, 35), 
                                     new THREE.MeshBasicMaterial({transparent: true, opacity: .7, map: THREE.ImageUtils.loadTexture("images/number3.png", undefined, LOADSYNC.register())}));
        number3.position.set(-510, -45, -460);
        scene.add(number3);

        var number4 = new THREE.Mesh(new THREE.PlaneBufferGeometry(35, 35), 
                                     new THREE.MeshBasicMaterial({transparent: true, opacity: .7, map: THREE.ImageUtils.loadTexture("images/number4.png", undefined, LOADSYNC.register())}));
        number4.position.set(-510, -243, -460);
        scene.add(number4);
        
        var horizTexture = new THREE.MeshBasicMaterial({transparent: true, opacity: .8, map: THREE.ImageUtils.loadTexture("images/horizontal_lights.png", undefined, LOADSYNC.register())});

        var horizLight1 = new THREE.Mesh(new THREE.PlaneBufferGeometry(1024, 18), horizTexture); 
        horizLight1.position.set(0, 350, -500);
        scene.add(horizLight1);

        var horizLight2 = new THREE.Mesh(new THREE.PlaneBufferGeometry(1024, 18), horizTexture); 
        horizLight2.position.set(1024, 350, -500);
        scene.add(horizLight2);

        var horizLight3 = new THREE.Mesh(new THREE.PlaneBufferGeometry(1024, 18), horizTexture); 
        horizLight3.position.set(-1024, 350, -500);
        scene.add(horizLight3);

        var horizLight4 = new THREE.Mesh(new THREE.PlaneBufferGeometry(1024, 18), horizTexture); 
        horizLight4.position.set(0, 148, -500);
        scene.add(horizLight4);

        var horizLight5 = new THREE.Mesh(new THREE.PlaneBufferGeometry(1024, 18), horizTexture); 
        horizLight5.position.set(1024, 148, -500);
        scene.add(horizLight5);

        var horizLight6 = new THREE.Mesh(new THREE.PlaneBufferGeometry(1024, 18), horizTexture); 
        horizLight6.position.set(-1024, 148, -500);
        scene.add(horizLight6);

        var horizLight7 = new THREE.Mesh(new THREE.PlaneBufferGeometry(1024, 18), horizTexture); 
        horizLight7.position.set(0, -47, -500);
        scene.add(horizLight7);

        var horizLight8 = new THREE.Mesh(new THREE.PlaneBufferGeometry(1024, 18), horizTexture); 
        horizLight8.position.set(1024, -47, -500);
        scene.add(horizLight8);

        var horizLight9 = new THREE.Mesh(new THREE.PlaneBufferGeometry(1024, 18), horizTexture); 
        horizLight9.position.set(-1024, -47, -500);
        scene.add(horizLight9);

        var horizLight10 = new THREE.Mesh(new THREE.PlaneBufferGeometry(1024, 18), horizTexture); 
        horizLight10.position.set(1024, -250, -500);
        scene.add(horizLight10);

        var horizLight11 = new THREE.Mesh(new THREE.PlaneBufferGeometry(1024, 18), horizTexture); 
        horizLight11.position.set(-1024, -250, -500);
        scene.add(horizLight11);

        var horizLight12 = new THREE.Mesh(new THREE.PlaneBufferGeometry(1024, 18), horizTexture); 
        horizLight12.position.set(0, -250, -500);
        scene.add(horizLight12);

    }
    function createPanel( geometry, posish, material ) {

        geometry.computeTangents();

        var mesh1 = new THREE.Mesh( geometry, material );

        // mesh1.position.y = 500;
        mesh1.position.z = -500;
        mesh1.position.x = posish.x;
        mesh1.position.y = posish.y;

        scene.add( mesh1 );

        // loader.statusDomElement.style.display = "none";

    }

    function setLightBarLevel(level){
        quad.material.color = setBrightness(new THREE.Color(0xffffff), level);
    }
    function setLightLevel(level){
        overheadLight.color = setBrightness(overheadLightColor, level);
        middleLight.color = setBrightness(middleLightColor, level);
    }

    function render() {

        var diff = Date.now() - startTime; 

        // pointLight1.position.x = Math.sin(diff/1000.0) * 200;
        // pointLight1.position.y = 500 + Math.sin(diff/745) * 100;
        // pointLight1.position.z = 100 + Math.sin(diff/100.0) * 100;
        //
        // pointLight2.position.x = -100 + Math.sin(diff/2000.0) * 200;
        // pointLight2.position.y = 100 + Math.sin(diff/945) * 100;

        overheadLight.position.x = 50 + Math.cos(diff/2000.0) * 120;
        overheadLight.position.y = 850 + Math.sin(diff/745) * 120;

        middleLight.position.x = 100 + Math.sin(diff/2000.0) * 320;
        middleLight.position.y =  Math.cos(diff/945) * 120;
        
        // pointLight4.position.x = 100 + Math.cos(diff/1500.0) * 800;
        // pointLight4.position.y = -50 + Math.sin(diff/845) * 200;

        renderer.render( scene, camera, renderTarget );

    }


    init();

    return Object.freeze({
        render: render,
        renderTarget: renderTarget,
        width: width,
        height: height,
        quad: quad,
        setLightBarLevel: setLightBarLevel,
        setLightLevel: setLightLevel
    });
}

