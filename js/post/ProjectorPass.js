/**
 * @author rscanlon / http://robscanlon.com/
 */

THREE.ProjectorShaders = {

    Generate: {

        uniforms: {

            tDiffuse: {
                type: "t",
                value: null
            },
            fStepSize: {
                type: "f",
                value: 1.0
            },

            vProjectorLocation: {
                type: "v2",
                value: new THREE.Vector2( 0.0, 1.0 )
            },

            tMask: {
                type: "t",
                value: null
            },

            fTick: {
                type: "f",
                value: 0.0
            },

        },

        vertexShader: [

            "varying vec2 vUv;",

            "void main() {",

                "vUv = uv;",
                "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

            "}"

        ].join("\n"),

        fragmentShader: [

            "#define TAPS_PER_PASS 6.0",

            "varying vec2 vUv;",

            "uniform sampler2D tDiffuse;",

            "uniform vec2 vProjectorLocation;",
            "uniform float fStepSize;", // filter step size

            "uniform sampler2D tMask;",
            "uniform float fTick;",

            "void main() {",

                "vec2 virtualProjector = vProjectorLocation;",
                "if(vUv.x > .5){",
                "   virtualProjector.x = 1.0 - vProjectorLocation.x;",
                "}",

                "vec2 delta = vUv - virtualProjector;",
                "float dist = length( delta );",
                "float offset = (fTick/40.0 );",

                // Step vector (uv space)

                "vec2 stepv = fStepSize * delta / dist;",

                "vec2 uv = vUv.xy;",
                "vec4 col = vec4(0.0);",

                "for ( float i = 0.0; i < TAPS_PER_PASS; i += 1.0 ) {",
                " if((vUv.x < .5 && uv.x < .5) || (vUv.x > .5 && uv.x > .5)){",
                "  col += texture2D(tDiffuse, uv); ",
                "  uv += stepv; ",
                "}",
                "}",
                "gl_FragColor = vec4(col / 3.0);",
                "if(fTick > 0.0){",
                // "gl_FragColor.rgb = gl_FragColor.rgb * texture2D(tMask, vec2(mod(vUv.x - offset, 1.0), vUv.y)).rgb;",
                // "gl_FragColor.rgb = gl_FragColor.rgb - texture2D(tMask, vUv).rgb;",
                // "gl_FragColor.rgb = gl_FragColor.rgb - texture2D(tMask, vUv).rgb;",
                "gl_FragColor.a = pow(1.0-dist,2.0);",//length(vUv.x;",//texture2D(tMask, vUv).g;",
                    // "gl_FragColor.rgba = vec4(1.0, 1.0, 1.0, 1.0);",
                "}",
            "}"

        ].join("\n")
    }
};

THREE.ProjectorPass = function ( renderer, projectorLocation, maskTexture) {

    this.clock = new THREE.Clock();

    this.maskTexture = maskTexture;
    this.textureID = "tDiffuse";
    this.renderer = renderer;

    this.generateUniforms = THREE.UniformsUtils.clone(THREE.ProjectorShaders.Generate.uniforms);
    this.generateMaterial = new THREE.ShaderMaterial( {

        uniforms: this.generateUniforms,
        vertexShader: THREE.ProjectorShaders.Generate.vertexShader,
        fragmentShader: THREE.ProjectorShaders.Generate.fragmentShader,
        transparent: true

 


    } );

    if(projectorLocation !== undefined){
        this.generateUniforms.vProjectorLocation.value = projectorLocation;
    }

    if(maskTexture !== undefined){
        this.generateUniforms.tMask.value = maskTexture;
    }


    this.renderToScreen = true;

    this.enabled = true;
    this.needsSwap = true;
    this.clear = false;


    this.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
    this.scene  = new THREE.Scene();

    this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), null );
    this.scene.add( this.quad );
};


THREE.ProjectorPass.prototype = {

    render: function ( renderer, writeBuffer, readBuffer, delta ) {

        var time = this.clock.getElapsedTime();

        function calcStepLen(pass){
            var filterLen = 1.0;
            var TAPS_PER_PASS = 6.0;
            return filterLen * Math.pow(TAPS_PER_PASS, -pass);

        }

        if ( this.generateUniforms[ this.textureID ] ) {

            this.generateUniforms[ this.textureID ].value = readBuffer;

        }

        this.generateUniforms.fTick.value = 0.0;
        this.generateUniforms.fStepSize.value = calcStepLen(1.0);
        this.quad.material = this.generateMaterial;
        renderer.render( this.scene, this.camera, writeBuffer, this.clear );

        this.generateUniforms.fTick.value = 0.0;
        this.generateUniforms[ this.textureID ].value = writeBuffer;
        this.generateUniforms.fStepSize.value = calcStepLen(2.0);
        renderer.render( this.scene, this.camera, readBuffer, this.clear );

        // this.generateUniforms.fTick.value = 0.0;
        if(this.maskTexture !== undefined){
            this.generateUniforms.fTick.value = time;
        }
        this.generateUniforms[ this.textureID ].value = readBuffer;
        this.generateUniforms.fStepSize.value = calcStepLen(3.0);
        renderer.render( this.scene, this.camera, writeBuffer, this.clear );

        // if(this.maskTexture !== undefined){
        //     this.generateUniforms.fTick.value = 2.0;
        // }
        // this.generateUniforms.fTick.value = 1.0;
        // this.generateUniforms[ this.textureID ].value = writeBuffer;
        // this.generateUniforms.fStepSize.value = calcStepLen(4.0);
        // renderer.render( this.scene, this.camera, readBuffer, this.clear );

        // this.generateUniforms[ this.textureID ].value = readBuffer;
        // this.generateUniforms.fStepSize.value = calcStepLen(5.0);

        this.needsSwap = true;

        if ( this.renderToScreen ) {

            renderer.render( this.scene, this.camera );

        } else {

            // renderer.render( this.scene, this.camera, readBuffer, this.clear );

        }

    }

};
