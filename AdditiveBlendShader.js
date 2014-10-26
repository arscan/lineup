/**
 * @author stemkoski / http://github.com/stemkoski
 *
 * Blend two textures additively
 */

THREE.AdditiveBlendShader = {

    uniforms: {
    
        "tDiffuse": { type: "t", value: null },
        "tAdd": { type: "t", value: null },
        "fOpacity": { type: "f", value: 1.0 }
    },

    vertexShader: [

        "varying vec2 vUv;",

        "void main() {",

            "vUv = uv;",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

        "}"

    ].join("\n"),

    fragmentShader: [

        "uniform sampler2D tDiffuse;",
        "uniform sampler2D tAdd;",
        "uniform float fOpacity;",

        "varying vec2 vUv;",

        "void main() {",

            "vec4 texel1 = texture2D( tDiffuse, vUv );",
            "vec4 texel2 = texture2D( tAdd, vUv ) * fOpacity;",
            "gl_FragColor = texel1 + texel2;",
        "}"

    ].join("\n")

};
