function createNamePanel(renderer, scale){

   var STANDARD_DIMENSIONS = {width: 400, height:400},
       ROTATE_TIME = 10.0;

   var width = STANDARD_DIMENSIONS.width * scale,
       height = STANDARD_DIMENSIONS.height * scale,
       nameBoxMaterial,
       textures = [],
       textureIndex = 0,
       lastTextStartTime = 0;

   var panel = createPanel(renderer, width, height);

   var textHeader = "SCANLON";
   var textSubject = "ROB SCANLON";
   var textValues = [
                     ["Alias: \"ARSCAN\"", 
                       "species: terran", 
                       "origin: Boston, MA",
                       "legs: 2",
                       "arms: 2",
                       "left eye color: brown",
                       "right eye color: green"],
                     [ "Occupation",
                       "software engineering",
                       "systems architecture",
                       "",
                       "education", 
                       "BS - Cornell University", 
                       "MS - MIT", 
                       ],
                     ["hobbies", 
                       "creative coding", 
                       "photography", 
                       "travel", 
                       "golf", 
                       "tennis" ]
                     ];

   var nameBoxShader =  {
       uniforms : {
           tDiffuse: {type: 't'},
           currentTime: {type: 'f', value: 0.0},
           bulletStartTime: {type: 'f', value: 2.0},
           bulletDuration: {type: 'f', value:0.6},
           headerInStartTime: {type: 'f', value: 0.5},
           headerInDuration: {type: 'f', value:2.0},
           textInStartTime: {type: 'f', value: 1.0},
           textInDuration: {type: 'f', value:3.0},
           textOutStartTime: {type: 'f', value: ROTATE_TIME-2},
           textOutDuration: {type: 'f', value:1.0},
       },
       vertexShader: [
           'varying vec2 vUv;',
           'varying vec3 p;',
           'void main() {',
           '  vUv = uv;',
           '  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
           '}'
       ].join('\n'),
       fragmentShader: [
           'varying vec2 vUv;',
           'uniform float currentTime;',
           'uniform float bulletStartTime;',
           'uniform float bulletDuration;',
           'uniform float textInStartTime;',
           'uniform float textInDuration;',
           'uniform float textOutStartTime;',
           'uniform float textOutDuration;',
           'uniform float headerInStartTime;',
           'uniform float headerInDuration;',
           'uniform sampler2D tDiffuse;',

           'void main() {',
           '  float mid = 0.61;',
           '  float textStart = 0.70;',

           '  float lineHeight = 0.045;',
           '  gl_FragColor = texture2D(tDiffuse, vUv);',
           '  float bulletPercent = clamp((currentTime - bulletStartTime) / bulletDuration, 0.0, 1.0);',
           '  float textInPercent = clamp((currentTime - textInStartTime) / textInDuration, 0.0, 1.0);',
           '  float textOutPercent = clamp((currentTime - textOutStartTime) / textOutDuration, 0.0, 1.0);',
           '  float headerInPercent = clamp((currentTime - headerInStartTime) / headerInDuration, 0.0, 1.0);',
           '  float floorNum = floor(textInPercent * 10.0);',
           '  float myFloorNum = floor((textStart - vUv.y)/lineHeight);',
           '  if(vUv.x < .18 && abs(vUv.y - mid)*4.0 > bulletPercent ){',
           '    gl_FragColor.a = 0.0;',
           '  }',
           '  if(textInStartTime > 0.0 && vUv.x > .18 && vUv.y < textStart && vUv.x > (textInPercent - myFloorNum * .04 + .10 )){',
           '    gl_FragColor.a = 0.0;',
           '  }',
           '  if(textOutStartTime > 0.0 && vUv.x > .18 && vUv.y < textStart && vUv.x > (1.0-textOutPercent)){',
           '    gl_FragColor.a = 0.0;',
           '  }',
           '  if(headerInStartTime > 0.0 && vUv.x > .15 && vUv.y > textStart && vUv.y < textStart + .1 && vUv.x > headerInPercent){',
           '    gl_FragColor.a = 0.0;',
           '  }',
           '}',
       ].join('\n')
    };

    function drawBullet(ctx, yStart, dir, smallBox, drawLine){ 
        yStart = yStart + 75;
        var xEnd = 65;
        if(smallBox){
           xEnd = 58;
        }
        ctx.beginPath();
        if(drawLine){
            ctx.moveTo(22, yStart);
            ctx.lineTo(34, yStart + dir * 12);
            ctx.lineTo(42, yStart + dir * 12);
        } else {
            ctx.moveTo(42, yStart + dir * 12);
        }
        ctx.lineTo(42, yStart + dir * 12 + 2);
        ctx.lineTo(xEnd, yStart + dir * 12 + 2);
        ctx.lineTo(xEnd, yStart + dir * 12 - 2);
        ctx.lineTo(42, yStart + dir * 12 - 2);
        ctx.lineTo(42, yStart + dir * 12);
        ctx.stroke();
        ctx.beginPath();
        if(drawLine){
            ctx.fillStyle='#eac7df';
            ctx.arc(22, yStart, 1.5, 0, 2 * Math.PI);
        }
        ctx.fill();
    }

    function createNameCanvas(name, subject, details){

        return panel.renderToCanvas(400, 400, function(ctx){
            ctx.strokeStyle="#fff";

            ctx.font = "bold 12pt Roboto";
            ctx.fillStyle = '#12b7a7';
            ctx.lineWidth = 0;
            ctx.fillText("NAME", 80, 20);

            ctx.font = "30pt Roboto";
            ctx.fillStyle = '#eac7df';
            ctx.fillText(name.toUpperCase(), 78, 60);

            ctx.font = "14pt Roboto";
            ctx.fillStyle = '#eac7df';
            ctx.fillText("SUBJECT: " + subject.toUpperCase(), 80, 100);

            for(var i = 0; i< details.length; i++){
                ctx.font = "11pt Roboto";
                ctx.fillStyle = '#eac7df';
                ctx.fillText(details[i].toUpperCase(), 80, 138 + i*18);

            }

            ctx.strokeStyle='#12b7a7';
            ctx.lineWidth=2;
            ctx.beginPath();
            ctx.moveTo(68, 75);
            ctx.lineTo(68, 280);
            ctx.stroke();

            ctx.strokeStyle='#eac7df';
            ctx.lineWidth=1.2;
            ctx.fillStyle = 'rgba(234,199,223,0.3)';

            for(var k = 1; k<13; k++){
                var dir = -1;
                if(k > 6){
                    dir = 1;
                }
                drawBullet(ctx, 18 + k * 12, dir, (k === 11), (k!==12));
            }

            ctx.beginPath();
            ctx.fillStyle='#eac7df';
            ctx.arc(2, 172, 1.5, 0, 2 * Math.PI);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(2, 172);
            ctx.lineTo(28, 172);
            ctx.lineTo(34, 178);
            ctx.lineTo(42, 178);
            ctx.lineTo(42, 180);
            ctx.lineTo(58, 180);
            ctx.lineTo(58, 176);
            ctx.lineTo(42, 176);
            ctx.lineTo(42, 178);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(28, 172);
            ctx.lineTo(34, 166);
            ctx.lineTo(42, 166);
            ctx.lineTo(42, 168);
            ctx.lineTo(65, 168);
            ctx.lineTo(65, 164);
            ctx.lineTo(42, 164);
            ctx.lineTo(42, 166);
            ctx.stroke();

        });

    };

    function init(){

        for(var i = 0; i< textValues.length; i++){
            textures.push(new THREE.Texture(createNameCanvas(textHeader, textSubject, textValues[i])));
            textures[textures.length - 1].needsUpdate = true;
        }

        nameBoxMaterial = new THREE.ShaderMaterial({
            uniforms: nameBoxShader.uniforms,
            vertexShader: nameBoxShader.vertexShader,
            fragmentShader: nameBoxShader.fragmentShader,
        });


        nameBoxMaterial.uniforms.tDiffuse.value = textures[textureIndex];
        nameBoxMaterial.transparent = true;
        var planegeometry = new THREE.PlaneBufferGeometry( width, height );

        var plane = new THREE.Mesh( planegeometry, nameBoxMaterial );
        plane.position.set(height/2, width/2, 0);
        panel.addToScene( plane );

    }

    function render(time){

        if(lastTextStartTime + ROTATE_TIME < time){
           lastTextStartTime = time;
           textureIndex = (textureIndex + 1) % textures.length;

           nameBoxMaterial.uniforms.tDiffuse.value = textures[textureIndex];
           nameBoxMaterial.uniforms.textInStartTime.value = time;
           nameBoxMaterial.uniforms.textOutStartTime.value = time + ROTATE_TIME-2;
        }

        nameBoxShader.uniforms.currentTime.value = time -1;
        panel.render(time);
    }

    init();

    return Object.freeze({
        toString: function(){return "NamePanel"},
        render: render,
        width: width,
        height: height,
        renderTarget: panel.renderTarget,
        quad: panel.quad,
        checkBounds: panel.checkBounds,
        setBlur: panel.setBlur,
        setPosition: panel.setPosition,
        setDeltaPosition: panel.setDeltaPosition
    });
}

