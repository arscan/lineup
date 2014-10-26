
var LeftPanelShaders = {
    skeleton: {
        uniforms : {
            currentTime: {type: 'f', value: 100.0},
        },
        vertexShader: [
            '#define INTRODURATION 5.0',
            'varying vec3 vNormal;',
            'uniform float currentTime;',
            'void main() {',
            '  vNormal = normalize( normalMatrix * normal );',
            '  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
            '}'
        ].join('\n'),
        fragmentShader: [
            'varying vec3 vNormal;',
            'uniform float currentTime;',
            'void main() {',
            '  if(gl_FragCoord.y < currentTime * 150.0){',
            '    float intensity = 1.1 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );',
            '    vec3 outline = vec3( 0.0708, 0.714, 0.652 ) * pow( intensity, 1.0 );',
            '    gl_FragColor = vec4(outline, intensity);',
            ' } ',
            '}'
        ].join('\n')
    },
    organs: {
        uniforms : {
            currentTime: {type: 'f', value: 100.0},
        },
        vertexShader: [
            '#define INTRODURATION 5.0',
            'varying vec3 vNormal;',
            'uniform float currentTime;',
            'void main() {',
            '  vNormal = normalize( normalMatrix * normal );',
            '  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
            '}'
        ].join('\n'),
        fragmentShader: [
            'varying vec3 vNormal;',
            'uniform float currentTime;',
            'uniform vec3 vMyColor;',
            'void main() {',
            '  if(gl_FragCoord.y < currentTime * 150.0){',
            '    float intensity = 1.3 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );',
            '    vec3 outline = vec3( 0.5708, 0.314, 0.252 ) * pow( intensity, 1.0 );',
            '    gl_FragColor = vec4(outline, intensity);',
            ' } ',
            '}'
        ].join('\n')
    },
    nameBox: {
        uniforms : {
            name1: {type: 't'},
            currentTime: {type: 'f', value: 10.0},
            bulletStartTime: {type: 'f', value: 2.0},
            bulletDuration: {type: 'f', value:0.6},
            headerInStartTime: {type: 'f', value: 0.5},
            headerInDuration: {type: 'f', value:2.0},
            textInStartTime: {type: 'f', value: 1.0},
            textInDuration: {type: 'f', value:3.0},
            textOutStartTime: {type: 'f', value: 6.0},
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
            'uniform sampler2D name1;',

            'void main() {',
            '  float mid = 0.61;',
            '  float textStart = 0.76;',

            '  float lineHeight = 0.038;',
            '  gl_FragColor = texture2D(name1, vUv);',
            // '  float bulletPercent = bulletEndTime;',
            '  float bulletPercent = clamp((currentTime - bulletStartTime) / bulletDuration, 0.0, 1.0);',
            '  float textInPercent = clamp((currentTime - textInStartTime) / textInDuration, 0.0, 1.0);',
            '  float textOutPercent = clamp((currentTime - textOutStartTime) / textOutDuration, 0.0, 1.0);',
            '  float headerInPercent = clamp((currentTime - headerInStartTime) / headerInDuration, 0.0, 1.0);',
            '  float floorNum = floor(textInPercent * 10.0);',
            '  float myFloorNum = floor((textStart - vUv.y)/lineHeight);',
            '  if(vUv.x < .15 && abs(vUv.y - mid)*4.0 > bulletPercent ){',
            '    gl_FragColor.a = 0.0;',
            '  }',
            '  if(textInStartTime > 0.0 && vUv.x > .15 && vUv.y < textStart && vUv.x > (textInPercent - myFloorNum * .12 + .10 )){',
            '    gl_FragColor.a = 0.0;',
            '  }',
            '  if(textOutStartTime > 0.0 && vUv.x > .15 && vUv.y < textStart && vUv.x > 1.0-textOutPercent){',
            '    gl_FragColor.a = 0.0;',
            '  }',
            '  if(headerInStartTime > 0.0 && vUv.x > .15 && vUv.y > textStart && vUv.y < textStart + .1 && vUv.x > headerInPercent){',
            '    gl_FragColor.a = 0.0;',
            '  }',
            '}',
        ].join('\n')
    }
};
