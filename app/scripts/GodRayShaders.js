
/**
 * @author huwb / http://huwbowles.com/
 *
 * God-rays (crepuscular rays)
 *
 * Similar implementation to the one used by Crytek for CryEngine 2 [Sousa2008].
 * Blurs a mask generated from the depth map along radial lines emanating from the light
 * source. The blur repeatedly applies a blur filter of increasing support but constant
 * sample count to produce a blur filter with large support.
 *
 * My implementation performs 3 passes, similar to the implementation from Sousa. I found
 * just 6 samples per pass produced acceptible results. The blur is applied three times,
 * with decreasing filter support. The result is equivalent to a single pass with
 * 6*6*6 = 216 samples.
 *
 * References:
 *
 * Sousa2008 - Crysis Next Gen Effects, GDC2008, http://www.crytek.com/sites/default/files/GDC08_SousaT_CrysisEffects.ppt
 */

/* 
 * Modified by rscanlon to be more like a projector
 */



THREE.ShaderGodRays = {

    /**
     * The god-ray generation shader.
     *
     * First pass:
     *
     * The input is the depth map. I found that the output from the
     * THREE.MeshDepthMaterial material was directly suitable without
     * requiring any treatment whatsoever.
     *
     * The depth map is blurred along radial lines towards the "sun". The
     * output is written to a temporary render target (I used a 1/4 sized
     * target).
     *
     * Pass two & three:
     *
     * The results of the previous pass are re-blurred, each time with a
     * decreased distance between samples.
     */

    'godrays_generate': {

        uniforms: {

            tInput: {
                type: "t",
                value: null
            },
            fStepSize: {
                type: "f",
                value: 1.0
            },

            vSunPositionScreenSpace: {
                type: "v2",
                value: new THREE.Vector2( 0.0, 0.0 )
            }

        },

        vertexShader: [

            "varying vec2 vUv;",

            "void main() {",

                "vUv = uv;",
                "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

            "}"

        ].join("\n"),

        fragmentShader: [

            "#define TAPS_PER_PASS 3.0",

            "varying vec2 vUv;",

            "uniform sampler2D tInput;",

            "uniform vec2 vSunPositionScreenSpace;",
            "uniform float fStepSize;", // filter step size

            "void main() {",

                // delta from current pixel to "sun" position

                "vec2 delta = -1.0 * (vSunPositionScreenSpace - vUv);", // MODIFIED BY RSCANLON TO BE NEGATIVE 1
                "float dist = length( delta );",

                // Step vector (uv space)

                "vec2 stepv = fStepSize * delta / dist;",

                // Number of iterations between pixel and sun

                "float iters = dist/fStepSize + 3.0;", // add 3.0 here to make it go to the edge...

                "vec2 uv = vUv.xy;",
                "vec4 col = vec4(0.0,0.0,0.0,0.0);",

                // This breaks ANGLE in Chrome 22
                //  - see http://code.google.com/p/chromium/issues/detail?id=153105

                /*
                // Unrolling didnt do much on my hardware (ATI Mobility Radeon 3450),
                // so i've just left the loop

                "for ( float i = 0.0; i < TAPS_PER_PASS; i += 1.0 ) {",

                    // Accumulate samples, making sure we dont walk past the light source.

                    // The check for uv.y < 1 would not be necessary with "border" UV wrap
                    // mode, with a black border colour. I don't think this is currently
                    // exposed by three.js. As a result there might be artifacts when the
                    // sun is to the left, right or bottom of screen as these cases are
                    // not specifically handled.

                    "col += ( i <= iters && uv.y < 1.0 ? texture2D( tInput, uv ).r : 0.0 );",
                    "uv += stepv;",

                "}",
                */

                // Unrolling loop manually makes it work in ANGLE

                "if ( 0.0 <= iters && uv.y < 1.0 ) col += texture2D( tInput, uv );",
                "uv += stepv;",

                "if ( 1.0 <= iters && uv.y < 1.0 ) col += texture2D( tInput, uv );",
                "uv += stepv;",

                "if ( 2.0 <= iters && uv.y < 1.0 ) col += texture2D( tInput, uv );",
                "uv += stepv;",

                "if ( 3.0 <= iters && uv.y < 1.0 ) col += texture2D( tInput, uv );",
                "uv += stepv;",

                "if ( 4.0 <= iters && uv.y < 1.0 ) col += texture2D( tInput, uv );",
                "uv += stepv;",

                "if ( 5.0 <= iters && uv.y < 1.0 ) col += texture2D( tInput, uv );",
                "uv += stepv;",

                // Should technically be dividing by 'iters', but 'TAPS_PER_PASS' smooths out
                // objectionable artifacts, in particular near the sun position. The side
                // effect is that the result is darker than it should be around the sun, as
                // TAPS_PER_PASS is greater than the number of samples actually accumulated.
                // When the result is inverted (in the shader 'godrays_combine', this produces
                // a slight bright spot at the position of the sun, even when it is occluded.
                
                // "gl_FragColor = base;",
                // "if ( base.rgb == 0.0 ) {",
                "   gl_FragColor = vec4(col/3.0);",
                "   gl_FragColor.a = 1.0;",
                // "} else {",
                // "   gl_FragColor.a = 0.0;",
                // "}",

            "}"

        ].join("\n")

    },

    /**
     * Additively applies god rays from texture tGodRays to a background (tColors).
     * fGodRayIntensity attenuates the god rays.
     */

    'godrays_combine': {

        uniforms: {

            tColors: {
                type: "t",
                value: null
            },

            // tBlur: {
            //     type: "t",
            //     value: null
            // },

            tGodRays: {
                type: "t",
                value: null
            },

            tMask: {
                type: "t",
                value: null
            },

            fTick: {
                type: "f",
                value: 0.0
            },

            fGodRayIntensity: {
                type: "f",
                value: 0.69
            },

            vSunPositionScreenSpace: {
                type: "v2",
                value: new THREE.Vector2( 0.5, 0.5 )
            }

        },

        vertexShader: [

            "varying vec2 vUv;",

            "void main() {",

                "vUv = uv;",
                "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

            "}"

            ].join("\n"),

        fragmentShader: [

            "varying vec2 vUv;",

            "uniform sampler2D tColors;",
            "uniform sampler2D tGodRays;",
            "uniform sampler2D tMask;",
            "uniform float fTick;",

            "uniform vec2 vSunPositionScreenSpace;",
            "uniform float fGodRayIntensity;",

            "void main() {",

                // Since THREE.MeshDepthMaterial renders foreground objects white and background
                // objects black, the god-rays will be white streaks. Therefore value is inverted
                // before being combined with tColors
            //
                "vec4 cColors = texture2D(tColors, vUv);",
                "vec4 cGodRays = texture2D(tGodRays, vUv);",
                // "vec4 cMask = texture2D(tMask, vUv);",
                "float offset = (fTick/30.0 );",
                // "float offset = tick;",
                // "float offset = 0.5;",
                // "vec4 cBlur = texture2D(tBlur, vUv);",

                // "cBlur.a = min(cBlur.a,1.0);",
                // "cGodRays.a = max(cGodRays.r + cGodRays.g + cGodRays.b, cBlur.a);",
                "cGodRays.a = min(cGodRays.r + cGodRays.g + cGodRays.b, 1.0);",

                // "cBlur.a = cBlur.a / 8.0;",
                "cGodRays.a = cGodRays.a / 3.0;",

                // "gl_FragColor = (cBlur + cGodRays) / 2.0;", //changed by rscanlon
                "gl_FragColor =cGodRays;", //changed by rscanlon
                // "gl_FragColor.a = max(cBlur.a, cGodRays.a);",
                //

                // "if(cGodRays.a > cBlur.a){",
                // "   gl_FragColor = cGodRays;",
                // "}",


                // "if (cBlur.a > 0.1 && cGodRays.a > 0.1){",
                // "  gl_FragColor = cBlur * 0.8 + cGodrays * 0.2;",
                // "}",

                "if (cColors.a > 0.0){",
                "  gl_FragColor = cColors;",
                "}",

                "gl_FragColor.a = gl_FragColor.a - texture2D(tMask, vec2(mod(vUv.x - offset - .3, 1.0), vUv.y)).r;",


                // "gl_FragColor.a = (texture2D(tGodRays, vUv).r + texture2D(tGodRays,vUv).g + texture2D(tGodRays, vUv).b + texture2D(tColors, vUv).a / 2.0 + texture2D(tBlur,vUv).a);",
                // "gl_FragColor.a = (texture2D(tGodRays, vUv).r + texture2D(tGodRays,vUv).g + texture2D(tGodRays, vUv).b + texture2D(tColors, vUv).a / 2.0 + texture2D(tBlur,vUv).a);",
                // "gl_FragColor.a = 1.0;",

                // "gl_FragColor = texture2D( tBlur, vUv );", //changed by rscanlon


            "}"

        ].join("\n")

    },
    'godrays_combineblur': {

        uniforms: {

            tColors: {
                type: "t",
                value: null
            },
            tGodRays: {
                type: "t",
                value: null
            },
            tBlur: {
                type: "t",
                value: null
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

            "varying vec2 vUv;",

            "uniform sampler2D tColors;",
            "uniform sampler2D tBlur;",
            "uniform sampler2D tGodRays;",

            "void main() {",

                "vec4 cColors = texture2D(tColors, vUv);",
                "vec4 cBlur = texture2D(tBlur, vUv);",
                "vec4 cGodRays = texture2D(tGodRays, vUv);",
                "cBlur.a = min(cBlur.r + cBlur.g + cBlur.b, 1.0);",

                // "cBlur.a = cBlur.a / 8.0;",
                // "cGodRays.a = cGodRays.a / 3.0;",

                "gl_FragColor = vec4(cBlur.rgb * cBlur.a, cBlur.a) + cGodRays;", //changed by rscanlon

                "if (cColors.a > 0.1){",
                "  gl_FragColor = cColors;",
                "}",

            "}"

        ].join("\n")

    },
    'godrays_blur_h': {

        uniforms: {
            RTScene: {
                type: "t",
                value: null
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

            "varying vec2 vUv;",
            "uniform sampler2D RTScene;",
            "const float blurSize = 1.0/800.0;",

            "void main() {",
               // take nine samples, with the distance blurSize between them
               "vec4 sum = vec4(0.0);",
               "sum += texture2D(RTScene, vec2(vUv.x - 15.0*blurSize, vUv.y)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x - 14.0*blurSize, vUv.y)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x - 13.0*blurSize, vUv.y)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x - 12.0*blurSize, vUv.y)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x - 11.0*blurSize, vUv.y)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x - 10.0*blurSize, vUv.y)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x - 9.0*blurSize, vUv.y)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x - 8.0*blurSize, vUv.y)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x - 7.0*blurSize, vUv.y)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x - 6.0*blurSize, vUv.y)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x - 5.0*blurSize, vUv.y)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x - 4.0*blurSize, vUv.y)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x - 3.0*blurSize, vUv.y)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x - 2.0*blurSize, vUv.y)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x - blurSize, vUv.y)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x, vUv.y)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x + blurSize, vUv.y)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x + 2.0*blurSize, vUv.y)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x + 3.0*blurSize, vUv.y)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x + 4.0*blurSize, vUv.y)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x + 5.0*blurSize, vUv.y)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x + 6.0*blurSize, vUv.y)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x + 7.0*blurSize, vUv.y)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x + 8.0*blurSize, vUv.y)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x + 9.0*blurSize, vUv.y)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x + 10.0*blurSize, vUv.y)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x + 11.0*blurSize, vUv.y)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x + 12.0*blurSize, vUv.y)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x + 13.0*blurSize, vUv.y)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x + 14.0*blurSize, vUv.y)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x + 15.0*blurSize, vUv.y)) * 0.05;",

               // "sum = max(texture2D(RTScene, vec2(vUv.x - 15.0*blurSize, vUv.y)), sum);",
               // "sum = max(texture2D(RTScene, vec2(vUv.x - 14.0*blurSize, vUv.y)), sum);",
               // "sum = max(texture2D(RTScene, vec2(vUv.x - 13.0*blurSize, vUv.y)), sum);",
               // "sum =max(texture2D(RTScene, vec2(vUv.x - 12.0*blurSize, vUv.y)), sum);",
               // "sum =max(texture2D(RTScene, vec2(vUv.x - 11.0*blurSize, vUv.y)), sum);",
               // "sum =max(texture2D(RTScene, vec2(vUv.x - 10.0*blurSize, vUv.y)), sum);",
               // "sum =max(texture2D(RTScene, vec2(vUv.x - 9.0*blurSize, vUv.y)), sum);",
               // "sum =max(texture2D(RTScene, vec2(vUv.x - 8.0*blurSize, vUv.y)), sum);",
               // "sum =max(texture2D(RTScene, vec2(vUv.x - 7.0*blurSize, vUv.y)), sum);",
               // "sum =max(texture2D(RTScene, vec2(vUv.x - 6.0*blurSize, vUv.y)), sum);",
               // "sum =max(texture2D(RTScene, vec2(vUv.x - 5.0*blurSize, vUv.y)), sum);",
               // "sum =max(texture2D(RTScene, vec2(vUv.x - 4.0*blurSize, vUv.y)), sum);",
               // "sum =max(texture2D(RTScene, vec2(vUv.x - 3.0*blurSize, vUv.y)), sum);",
               // "sum =max(texture2D(RTScene, vec2(vUv.x - 2.0*blurSize, vUv.y)), sum);",
               // "sum =max(texture2D(RTScene, vec2(vUv.x - blurSize, vUv.y)), sum);",
               // "sum =max(texture2D(RTScene, vec2(vUv.x, vUv.y)), sum);",
               // "sum =max(texture2D(RTScene, vec2(vUv.x + blurSize, vUv.y)), sum);",
               // "sum =max(texture2D(RTScene, vec2(vUv.x + 2.0*blurSize, vUv.y)), sum);",
               // "sum =max(texture2D(RTScene, vec2(vUv.x + 3.0*blurSize, vUv.y)), sum);",
               // "sum =max(texture2D(RTScene, vec2(vUv.x + 4.0*blurSize, vUv.y)), sum);",
               // "sum =max(texture2D(RTScene, vec2(vUv.x + 5.0*blurSize, vUv.y)), sum);",
               // "sum =max(texture2D(RTScene, vec2(vUv.x + 6.0*blurSize, vUv.y)), sum);",
               // "sum =max(texture2D(RTScene, vec2(vUv.x + 7.0*blurSize, vUv.y)), sum);",
               // "sum =max(texture2D(RTScene, vec2(vUv.x + 8.0*blurSize, vUv.y)), sum);",
               // "sum =max(texture2D(RTScene, vec2(vUv.x + 9.0*blurSize, vUv.y)), sum);",
               // "sum =max(texture2D(RTScene, vec2(vUv.x + 10.0*blurSize, vUv.y)), sum);",
               // "sum =max(texture2D(RTScene, vec2(vUv.x + 11.0*blurSize, vUv.y)), sum);",
               // "sum =max(texture2D(RTScene, vec2(vUv.x + 12.0*blurSize, vUv.y)), sum);",
               // "sum =max(texture2D(RTScene, vec2(vUv.x + 13.0*blurSize, vUv.y)), sum);",
               // "sum =max(texture2D(RTScene, vec2(vUv.x + 14.0*blurSize, vUv.y)), sum);",
               // "sum =max(texture2D(RTScene, vec2(vUv.x + 15.0*blurSize, vUv.y)), sum);",
 

            "sum = texture2D( RTScene, vec2( vUv.x - 4.0 * blurSize, vUv.y ) ) * 0.051;",
            "sum += texture2D( RTScene, vec2( vUv.x - 3.0 * blurSize, vUv.y ) ) * 0.0918;",
            "sum += texture2D( RTScene, vec2( vUv.x - 2.0 * blurSize, vUv.y ) ) * 0.12245;",
            "sum += texture2D( RTScene, vec2( vUv.x - 1.0 * blurSize, vUv.y ) ) * 0.1531;",
            "sum += texture2D( RTScene, vec2( vUv.x, vUv.y ) ) * 0.1633;",
            "sum += texture2D( RTScene, vec2( vUv.x + 1.0 * blurSize, vUv.y ) ) * 0.1531;",
            "sum += texture2D( RTScene, vec2( vUv.x + 2.0 * blurSize, vUv.y ) ) * 0.12245;",
            "sum += texture2D( RTScene, vec2( vUv.x + 3.0 * blurSize, vUv.y ) ) * 0.0918;",
            "sum += texture2D( RTScene, vec2( vUv.x + 4.0 * blurSize, vUv.y ) ) * 0.051;",

               "gl_FragColor = sum;",
               "gl_FragColor.a = 1.0;",
               // "gl_FragColor = max(sum, texture2D(RTScene, vUv));",
               // "gl_FragColor.a = (sum.r + sum.g + sum.b)/3.0;",
               // "gl_FragColor.a = 1.0;",
                // "  gl_FragColor = texture2D(tColors, vUv);",
                // "  gl_FragColor.r = 0.0;",
            "}"

        ].join("\n")

    },

    'godrays_blur_v': {

        uniforms: {
            RTScene: {
                type: "t",
                value: null
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

            "varying vec2 vUv;",
            "uniform sampler2D RTScene;",
            "const float blurSize = 1.0/800.0;",

            "void main() {",
               // take nine samples, with the distance blurSize between them
               "vec4 sum = vec4(0.0);",
               "sum += texture2D(RTScene, vec2(vUv.x, vUv.y - 15.0*blurSize)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x, vUv.y - 14.0*blurSize)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x, vUv.y - 13.0*blurSize)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x, vUv.y - 12.0*blurSize)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x, vUv.y - 11.0*blurSize)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x, vUv.y - 10.0*blurSize)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x, vUv.y - 9.0*blurSize)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x, vUv.y - 8.0*blurSize)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x, vUv.y - 7.0*blurSize)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x, vUv.y - 6.0*blurSize)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x, vUv.y - 5.0*blurSize)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x, vUv.y - 4.0*blurSize)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x, vUv.y - 3.0*blurSize)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x, vUv.y - 2.0*blurSize)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x, vUv.y - blurSize)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x, vUv.y)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x, vUv.y + blurSize)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x, vUv.y + 2.0*blurSize)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x, vUv.y + 3.0*blurSize)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x, vUv.y + 4.0*blurSize)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x, vUv.y + 5.0*blurSize)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x, vUv.y + 6.0*blurSize)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x, vUv.y + 7.0*blurSize)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x, vUv.y + 8.0*blurSize)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x, vUv.y + 9.0*blurSize)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x, vUv.y + 10.0*blurSize)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x, vUv.y + 11.0*blurSize)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x, vUv.y + 12.0*blurSize)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x, vUv.y + 13.0*blurSize)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x, vUv.y + 14.0*blurSize)) * 0.05;",
               "sum += texture2D(RTScene, vec2(vUv.x, vUv.y + 15.0*blurSize)) * 0.05;",


               // "sum = max(texture2D(RTScene, vec2(vUv.x, vUv.y - 15.0*blurSize)) , sum);",
               // "sum = max(texture2D(RTScene, vec2(vUv.x, vUv.y - 14.0*blurSize)) , sum);",
               // "sum = max(texture2D(RTScene, vec2(vUv.x, vUv.y - 13.0*blurSize)) , sum);",
               // "sum = max(texture2D(RTScene, vec2(vUv.x, vUv.y - 12.0*blurSize)) , sum);",
               // "sum = max(texture2D(RTScene, vec2(vUv.x, vUv.y - 11.0*blurSize)) , sum);",
               // "sum = max(texture2D(RTScene, vec2(vUv.x, vUv.y - 10.0*blurSize)) , sum);",
               // "sum = max(texture2D(RTScene, vec2(vUv.x, vUv.y - 9.0*blurSize)) , sum);",
               // "sum = max(texture2D(RTScene, vec2(vUv.x, vUv.y - 8.0*blurSize)) , sum);",
               // "sum = max(texture2D(RTScene, vec2(vUv.x, vUv.y - 7.0*blurSize)) , sum);",
               // "sum = max(texture2D(RTScene, vec2(vUv.x, vUv.y - 6.0*blurSize)) , sum);",
               // "sum = max(texture2D(RTScene, vec2(vUv.x, vUv.y - 5.0*blurSize)) , sum);",
               // "sum = max(texture2D(RTScene, vec2(vUv.x, vUv.y - 4.0*blurSize)) , sum);",
               // "sum = max(texture2D(RTScene, vec2(vUv.x, vUv.y - 3.0*blurSize)) , sum);",
               // "sum = max(texture2D(RTScene, vec2(vUv.x, vUv.y - 2.0*blurSize)) , sum);",
               // "sum = max(texture2D(RTScene, vec2(vUv.x, vUv.y - blurSize)) , sum);",
               // "sum = max(texture2D(RTScene, vec2(vUv.x, vUv.y)) , sum);",
               // "sum = max(texture2D(RTScene, vec2(vUv.x, vUv.y + blurSize)) , sum);",
               // "sum = max(texture2D(RTScene, vec2(vUv.x, vUv.y + 2.0*blurSize)) , sum);",
               // "sum = max(texture2D(RTScene, vec2(vUv.x, vUv.y + 3.0*blurSize)) , sum);",
               // "sum = max(texture2D(RTScene, vec2(vUv.x, vUv.y + 4.0*blurSize)) , sum);",
               // "sum = max(texture2D(RTScene, vec2(vUv.x, vUv.y + 5.0*blurSize)) , sum);",
               // "sum = max(texture2D(RTScene, vec2(vUv.x, vUv.y + 6.0*blurSize)) , sum);",
               // "sum = max(texture2D(RTScene, vec2(vUv.x, vUv.y + 7.0*blurSize)) , sum);",
               // "sum = max(texture2D(RTScene, vec2(vUv.x, vUv.y + 8.0*blurSize)) , sum);",
               // "sum = max(texture2D(RTScene, vec2(vUv.x, vUv.y + 9.0*blurSize)) , sum);",
               // "sum = max(texture2D(RTScene, vec2(vUv.x, vUv.y + 10.0*blurSize)) , sum);",
               // "sum = max(texture2D(RTScene, vec2(vUv.x, vUv.y + 11.0*blurSize)) , sum);",
               // "sum = max(texture2D(RTScene, vec2(vUv.x, vUv.y + 12.0*blurSize)) , sum);",
               // "sum = max(texture2D(RTScene, vec2(vUv.x, vUv.y + 13.0*blurSize)) , sum);",
               // "sum = max(texture2D(RTScene, vec2(vUv.x, vUv.y + 14.0*blurSize)) , sum);",
               // "sum = max(texture2D(RTScene, vec2(vUv.x, vUv.y + 15.0*blurSize)) , sum);",

            "sum = texture2D( RTScene, vec2( vUv.x, vUv.y - 4.0 * blurSize ) ) * 0.051;",
            "sum += texture2D( RTScene, vec2( vUv.x, vUv.y - 3.0 * blurSize ) ) * 0.0918;",
            "sum += texture2D( RTScene, vec2( vUv.x, vUv.y - 2.0 * blurSize ) ) * 0.12245;",
            "sum += texture2D( RTScene, vec2( vUv.x, vUv.y - 1.0 * blurSize ) ) * 0.1531;",
            "sum += texture2D( RTScene, vec2( vUv.x, vUv.y ) ) * 0.1633;",
            "sum += texture2D( RTScene, vec2( vUv.x, vUv.y + 1.0 * blurSize ) ) * 0.1531;",
            "sum += texture2D( RTScene, vec2( vUv.x, vUv.y + 2.0 * blurSize ) ) * 0.12245;",
            "sum += texture2D( RTScene, vec2( vUv.x, vUv.y + 3.0 * blurSize ) ) * 0.0918;",
            "sum += texture2D( RTScene, vec2( vUv.x, vUv.y + 4.0 * blurSize ) ) * 0.051;",

 
               "gl_FragColor = sum;",//(sum.r + sum.g + sum.b)/3.0;",
               "gl_FragColor.a = 1.0;",

               // "gl_FragColor = max(sum, texture2D(RTScene, vUv));",
               // "gl_FragColor.a = (sum.r + sum.g + sum.b)/3.0;",
                // "  gl_FragColor = texture2D(tColors, vUv);",
                // "  gl_FragColor.r = 0.0;",
            "}"

        ].join("\n")

    },


    /**
     * A dodgy sun/sky shader. Makes a bright spot at the sun location. Would be
     * cheaper/faster/simpler to implement this as a simple sun sprite.
     */

    'godrays_fake_sun': {

        uniforms: {

            vSunPositionScreenSpace: {
                type: "v2",
                value: new THREE.Vector2( 0.0, 0.0 )
            },

            fAspect: {
                type: "f",
                value: 1.0
            },

            sunColor: {
                type: "c",
                value: new THREE.Color( 0xffee00 )
            },

            bgColor: {
                type: "c",
                value: new THREE.Color( 0x000000 )
            }

        },

        vertexShader: [

            "varying vec2 vUv;",

            "void main() {",

                "vUv = uv;",
                "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

            "}"

        ].join("\n"),

        fragmentShader: [

            "varying vec2 vUv;",

            "uniform vec2 vSunPositionScreenSpace;",
            "uniform float fAspect;",

            "uniform vec3 sunColor;",
            "uniform vec3 bgColor;",

            "void main() {",

                "vec2 diff = vUv - vSunPositionScreenSpace;",

                // Correct for aspect ratio

                "diff.x *= fAspect;",

                "float prop = clamp( length( diff ) / 0.5, 0.0, 1.0 );",
                "prop = 0.35 * pow( 1.0 - prop, 3.0 );",

                "gl_FragColor.xyz = mix( sunColor, bgColor, 1.0 - prop );",
                "gl_FragColor.w = 1.0;",

            "}"

        ].join("\n")

    }

};
