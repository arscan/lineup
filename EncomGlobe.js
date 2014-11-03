var createEncomGlobe = function(scene){
    
    var introLinesDuration = 5000,
        introLinesAltitude = 1.2,
        cameraDistance = 100,
        hexGrid,
        pointUniforms,
        lastRenderDate = Date.now(),
        firstRenderDate = Date.now(), 
        index_values;

    var offset = {x: -60, y: -60, z: 0};
    var drift = {x: 0, y: 0, z: 0};

    var pointVertexShader = [
        "#define PI 3.141592653589793238462643",
        "#define DISTANCE 500.0",
        "#define INTRODURATION " + (parseFloat(introLinesDuration) + .00001),
        "#define INTROALTITUDE " + (parseFloat(introLinesAltitude) + .00001),
        "attribute float lng;",
        "uniform float currentTime;",
        "varying vec4 vColor;",
        "",
        "void main()",
        "{",
        "   vec3 newPos = position;",
        "   float opacityVal = 0.0;",
        "   float introStart = INTRODURATION * ((180.0 + lng)/360.0);",
        "   if(currentTime > introStart){",
        "      opacityVal = 1.0;",
        "   }",
        "   if(currentTime > introStart && currentTime < introStart + INTRODURATION / 8.0){",
        "      newPos = position * INTROALTITUDE;",
        "      opacityVal = .3;",
        "   }",
        "   if(currentTime > introStart + INTRODURATION / 8.0 && currentTime < introStart + INTRODURATION / 8.0 + 200.0){",
        "      newPos = position * (1.0 + ((INTROALTITUDE-1.0) * (1.0-(currentTime - introStart-(INTRODURATION/8.0))/200.0)));",
        "   }",
        // "   vColor = vec4( color, opacityVal );", //     set color associated to vertex; use later in fragment shader.
        "   vColor = vec4( color, opacityVal );", //     set color associated to vertex; use later in fragment shader.
        "   gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);",
        "}"
    ].join("\n");

    var pointFragmentShader = [
        "varying vec4 vColor;",     
        "void main()", 
        "{",
        "   gl_FragColor = vColor;",
        // "   float depth = gl_FragCoord.z / gl_FragCoord.w;",
        // "   float fogFactor = smoothstep(" + parseInt(cameraDistance) +".0," + (parseInt(cameraDistance+300)) +".0, depth );",
        // "   vec3 fogColor = vec3(0.0);",
        // "   gl_FragColor = mix( vColor, vec4( fogColor, gl_FragColor.w ), fogFactor );",
        "}"
    ].join("\n");

    var pointAttributes = {
        lng: {type: 'f', value: null}
    };

    pointUniforms = {
        currentTime: { type: 'f', value: 0.0}
    }

    var pointMaterial = new THREE.ShaderMaterial( {
        uniforms:       pointUniforms,
        attributes:     pointAttributes,
        vertexShader:   pointVertexShader,
        fragmentShader: pointFragmentShader,
        transparent:    true,
        vertexColors: THREE.VertexColors,
        side: THREE.DoubleSide
    });

    var triangles = ENCOMGLOBEGRID.tiles.length * 4;

    var geometry = new THREE.BufferGeometry();
    var position_values = new Float32Array(triangles * 9);
    var color_values = new Float32Array(triangles * 9);
    var lng_values = new Float32Array(triangles * 9);

    var myColors = [new THREE.Color(0xff3300)];

    function renderToCanvas(width, height, renderFunction) {
        var buffer = document.createElement('canvas');
        buffer.width = width;
        buffer.height = height;

        renderFunction(buffer.getContext('2d'));

        return buffer;
    };

    function createTitleCanvas(){

        return renderToCanvas(200, 40, function(ctx){
            ctx.strokeStyle="#fff";

            ctx.font = "12pt Roboto";
            ctx.fillStyle = '#ffcc00';
            ctx.fillText("Encom Globe", 25, 15);

        });

    };

    function setGrid(){

        var addTriangle = function(k, ax, ay, az, bx, by, bz, cx, cy, cz, lat, lng, color){
            var p = k * 3;
            var il = p * 3;
            var colorIndex = Math.floor(Math.random()*myColors.length);

            var colorRGB = myColors[colorIndex];
            lng_values[p] = lng;
            lng_values[p+1] = lng;
            lng_values[p+2] = lng;

            position_values[ il ]     = ax;
            position_values[ il + 1 ] = ay;
            position_values[ il + 2 ] = az;

            position_values[ il + 3 ] = bx;
            position_values[ il + 4 ] = by;
            position_values[ il + 5 ] = bz;

            position_values[ il + 6 ] = cx;
            position_values[ il + 7 ] = cy;
            position_values[ il + 8 ] = cz;

            color_values[ il ]     = color.r;
            color_values[ il + 1 ] = color.g;
            color_values[ il + 2 ] = color.b;

            color_values[ il + 3 ] = color.r;
            color_values[ il + 4 ] = color.g;
            color_values[ il + 5 ] = color.b;

            color_values[ il + 6 ] = color.r;
            color_values[ il + 7 ] = color.g;
            color_values[ il + 8 ] = color.b;

        };

        for(var j = 0; j < ENCOMGLOBEGRID.tiles.length; j++){
            var t = ENCOMGLOBEGRID.tiles[j];
            var ki = j * 4;

            var colorIndex = Math.floor(Math.random()*myColors.length);
            var color = new THREE.Color(myColors[colorIndex]);

            addTriangle(ki, t.b[0].x, t.b[0].y, t.b[0].z, t.b[1].x, t.b[1].y, t.b[1].z, t.b[2].x, t.b[2].y, t.b[2].z, t.lat, t.lon, color);
            addTriangle(ki+1, t.b[0].x, t.b[0].y, t.b[0].z, t.b[2].x, t.b[2].y, t.b[2].z, t.b[3].x, t.b[3].y, t.b[3].z, t.lat, t.lon, color);
            addTriangle(ki+2, t.b[0].x, t.b[0].y, t.b[0].z, t.b[3].x, t.b[3].y, t.b[3].z, t.b[4].x, t.b[4].y, t.b[4].z, t.lat, t.lon, color);

            if(t.b.length > 5){ // for the occasional pentagon that i have to deal with
                addTriangle(ki+3, t.b[0].x, t.b[0].y, t.b[0].z, t.b[5].x, t.b[5].y, t.b[5].z, t.b[4].x, t.b[4].y, t.b[4].z, t.lat, t.lon, color);
            }

        }
    }

    setGrid();

    // geometry.addAttribute('index', new THREE.BufferAttribute(index_values, 1));
    geometry.addAttribute('position', new THREE.BufferAttribute(position_values, 3));
    geometry.addAttribute('color', new THREE.BufferAttribute(color_values, 3));
    geometry.addAttribute('lng', new THREE.BufferAttribute(lng_values, 1));


    // geometry.computeOffsets();
    geometry.computeBoundingSphere();



    hexGrid = new THREE.Mesh( geometry, pointMaterial );
    hexGrid.position.set(offset.x + drift.x,offset.y + drift.y,offset.z + drift.z);

    // hexGrid.rotateX(Math.PI/2);
    scene.add( hexGrid );

    var titleCanvas= createTitleCanvas(); 

    var titleTexture = new THREE.Texture(titleCanvas)
    titleTexture.needsUpdate = true;

    var titleMaterial = new THREE.MeshBasicMaterial({map: titleTexture, transparent: true});
    var titleGeometry = new THREE.PlaneBufferGeometry( 200, 40 );
    var titlePlane = new THREE.Mesh( titleGeometry, titleMaterial );

    scene.add( titlePlane );


    function render(){

        var totalRunTime = Date.now() - firstRenderDate;
        var renderTime = Date.now() - lastRenderDate;

        lastRenderDate = Date.now();
        var rotateBy = (2 * Math.PI)/(10000/renderTime);

        hexGrid.rotateY(rotateBy);

        drift.x = Math.sin(totalRunTime / 1000) * 5;
        drift.y = Math.cos(totalRunTime / 1000) * 5;
        drift.z = Math.cos(totalRunTime / 1000) * 5;

        hexGrid.position.set(offset.x + drift.x,offset.y + drift.y,offset.z + drift.z);
        titlePlane.position.set(offset.x + drift.x + 20, offset.y + drift.y - 55, offset.z + drift.z + 10);

        pointUniforms.currentTime.value = totalRunTime;
    }

    return {
        render: render

    }

};




