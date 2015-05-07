/////// NodeClass ///////
function Node(x,y,z) {
    this.x=x;
    this.y=y;
    this.z=z;
    this.ux=0;
    this.uy=0;
    this.uz=0;
    this.fx=0;
    this.fy=0;
    this.fz=0;
    this.fixx=false;
    this.fixy=false;
    this.fixz=false;
}
Node.prototype.Move=function(damping, dt) {
    this.ux*=damping;
    this.uy*=damping;
    this.uz*=damping;
    this.ux+=this.fx*dt;
    this.uy+=this.fy*dt;
    this.uz+=this.fz*dt;
    if (!this.fixx)
        this.x+=this.ux*dt;
    if (!this.fixy)
        this.y+=this.uy*dt;
    if (!this.fixz)
        this.z+=this.uz*dt;
}
function Edge(_n0, _n1) {
    this.n0=_n0;
    this.n1=_n1;
    this.k=0.3;
    this.d=0;
    this.d0=20;
}
Edge.prototype.ApplySpringForce=function() {
    var dx=this.n1.x-this.n0.x;
    var dy=this.n1.y-this.n0.y;
    var dz=this.n1.z-this.n0.z;
    this.d=Math.sqrt(dx*dx+dy*dy+dz*dz);
    if (this.d==0.0) {
        dx=1;
        dy=0;
        dz=0;
    }
    else {
        dx/=this.d;
        dy/=this.d;
        dz/=this.d;
    }
    var force=(this.d-this.d0)*this.k;
    this.n0.fx+=dx*force;
    this.n0.fy+=dy*force;
    this.n0.fz+=dz*force;
    this.n1.fx-=dx*force;
    this.n1.fy-=dy*force;
    this.n1.fz-=dz*force;
}
/////// PaperNodeClass ///////
function NodeP(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;

    this.ux = 0;
    this.uy = 0;
    this.uz = 0;

    this.fx = 0;
    this.fy = 0;
    this.fz = 0;

    this.fixx = false;
    this.fixy = false;
    this.fixz = false;
}
NodeP.prototype.Move = function (damping, dt) {
    this.ux *= damping;
    this.uy *= damping;
    this.uz *= damping;
    this.ux += this.fx * dt;
    this.uy += this.fy * dt;
    this.uz += this.fz * dt;
    if (!this.fixx)
        this.x += this.ux * dt;

    if (!this.fixy)
        this.y += this.uy * dt;

    if (!this.fixz)
        this.z += this.uz * dt;
}
function EdgePaper(_n0, _n1) {
    this.n0 = _n0;
    this.n1 = _n1;
    this.k = 0.05;
    this.d = 100;
    this.d0 = 70;
}
EdgePaper.prototype.ApplySpringForce = function () {
    var dx = this.n1.x - this.n0.x;
    var dy = this.n1.y - this.n0.y;
    var dz = this.n1.z - this.n0.z;
    this.d = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (this.d < 70.0) {
        //dx=0;
        //dy=0;
        //dz=0;
        dx /= (-this.d * 5)
        dy /= (-this.d * 5)
        dz /= (-this.d * 5)
    }
    else {
        dx /= (this.d * 5);
        dy /= (this.d * 5);
        dz /= (this.d * 5);
    }
    var force = (this.d - this.d0) * this.k;
    this.n0.fx += dx * force;
    this.n0.fy += dy * force;
    this.n0.fz += dz * force;
    this.n1.fx -= dx * force;
    this.n1.fy -= dy * force;
    this.n1.fz -= dz * force;
}
/////// suppliment functions ///////
function meanCalculation(l) {
    var i;
    var sum = 0;
    var mean;
    for (var i = 0; i < l.length; i++) {
        sum += l[i];
    }
    mean = sum / l.length;
    return (mean);
}
function varianceCalculation(l) {
    var variance;
    var i;
    var sum = 0;
    var meanValue;
    meanValue = meanCalculation(l);
    for (i = 0; i < l.length; i++) {
        sum += (l[i] - meanValue) * (l[i] - meanValue);
    }
    return (sum / (l.length - 1));
}
function stdDeviation(l) {
    var stdDeviation;
    stdDeviation = Math.sqrt(varianceCalculation(l));
    return (stdDeviation)
}
function refineT(x) {
    if (x < 10) {
        x = 1
    }
    else if (x > 40) {
        x = 2
    }
    else {
        x = x / 40 + 1
    }
    return (x)
}
/////// Shaders ///////
var TraceShader0 = {
    uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib["fog"],
        THREE.UniformsLib["lights"],
        THREE.UniformsLib['shadowmap'],
        {
            color: {type: 'f', value: 0.0},
            time: {type: "f", value: 1.0}
        }
    ]),
    vertexShader: [
        "precision mediump float;",
        "precision mediump int;",
        "uniform mat4 modelViewMatrix;",
        "uniform mat4 projectionMatrix;",
        "attribute vec3 position;",
        "attribute vec4 color;",
        "varying vec3 vPosition;",
        "varying vec4 vColor;",
        THREE.ShaderChunk["shadowmap_pars_vertex"],
        "void main(){",
        "vPosition = position;",
        "vColor = color;",
        THREE.ShaderChunk["shadowmap_vertex"],
        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
        "}"
    ].join("\n"),
    fragmentShader: [
        "precision mediump float;",
        "precision mediump int;",
        "uniform float time;",
        "uniform float gate;",
        "varying vec3 vPosition;",
        "varying vec4 vColor;",
        THREE.ShaderChunk["shadowmap_pars_fragment"],
        "void main(){",
        "vec4 color = vec4(0.9, 0.0, 0.0, 1.0);",
        "color.g += cos( (vPosition.y / 20.0 ) * sin( time / 15.0 ) * 8.0 ) + sin(( vPosition.x / 10.0) * sin( time / 15.0 ) * 1.0 );",
        "color.b += cos( (vPosition.x / 10.0 ) * sin( time / 15.0 ) * 8.0 ) + sin(( vPosition.y / 20.0) * sin( time / 15.0 ) * 1.0 );",
        "gl_FragColor = color;",
        THREE.ShaderChunk["shadowmap_fragment"],
        "}"
    ].join("\n")
}
var TraceShader1={
    uniforms: THREE.UniformsUtils.merge([
        {
            texture1: { type: "t", value: null}//THREE.ImageUtils.loadTexture( "./img/poster.jpg" ) }
        }
    ]),
    vertexShader: [
        "varying vec2 vUv;",
        "void main(){",
        "vUv = uv;",
        "gl_Position =   projectionMatrix * modelViewMatrix * vec4(position,1.0);",
        "}"
    ].join("\n"),
    fragmentShader: [
        "uniform sampler2D texture1;",
        "varying vec2 vUv;",
        "void main(){",
       // "gl_FragColor = vec4(vUv.x, 0.0, vUv.y, 1.0);",
        "vec4 col = texture2D(texture1, vUv);",
        "if (col.a<0.5) discard;",
        "gl_FragColor = col;",
        "}"
    ].join("\n")
}
var PaperShader0 = {
    uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib["common"],
        THREE.UniformsLib["lights"],
        THREE.UniformsLib['shadowmap'],
        {
            time: {type: "f", value: 1.0},
            "emissive" : { type: "c", value: new THREE.Color( 0x000000 ) },
            "specular" : { type: "c", value: new THREE.Color( 0xffffff ) },
            "shininess": { type: "f", value: 30 },
            "wrapRGB"  : { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) }
        }
    ]),
    attributes:{},
    vertexShader: [
        "#define PHONG",
        "varying vec3 vViewPosition;",
        THREE.ShaderChunk[ "common" ],
        "varying vec3 vWorldPosition;",
        "varying vec4 vColor;",
        "varying vec2 vUv;",
        "varying vec3 vNormal;",
        THREE.ShaderChunk["shadowmap_pars_vertex"],
        "void main(){",
        "vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",
        "vWorldPosition = worldPosition.xyz;",
        "vColor.xyz = color;",
        "vColor.w = 1.0;",
        "vec3 transformedNormal = normalMatrix * normal;",
        "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
        "vViewPosition=mvPosition.xyz;",
        "vNormal = normalize( transformedNormal );",
        "vUv = uv;",
        THREE.ShaderChunk["shadowmap_vertex"],
        "gl_Position = projectionMatrix * mvPosition;",
        "}"
    ].join("\n"),
    fragmentShader: [
        "#extension GL_OES_standard_derivatives : enable",
        "#define PHONG",
        "uniform vec3 emissive;",
        "uniform vec3 specular;",
        "uniform float shininess;",
        THREE.ShaderChunk[ "common" ],
        "varying vec3 vWorldPosition;",
        "varying vec4 vColor;",
        "varying vec2 vUv;",
        THREE.ShaderChunk[ "lights_phong_pars_fragment" ],
        THREE.ShaderChunk["shadowmap_pars_fragment"],
        "void main(){",
        "vec4 color = vColor;",
        "color.r = 1.0;",
        "color.g = 1.0;",
        "color.b = 1.0;",
        "float specularStrength = 1.0;",
        "float ambient = 0.2;",
        "vec3 diffuse = color.xyz;",
        "vec3 outgoingLight =vec3( 0.0 );",
        "vec4 diffuseColor = color;",
        "gl_FragColor = vec4( 1.0 );",
        THREE.ShaderChunk[ "lights_phong_fragment" ],
        THREE.ShaderChunk["shadowmap_fragment"],
        "}"
    ].join("\n")
}
var PaperShader0F = {
    uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib["common"],
        THREE.UniformsLib["lights"],
        THREE.UniformsLib['shadowmap'],
        {
            time: {type: "f", value: 1.0}
        }
    ]),
    attributes:{},
    vertexShader: [
        "varying vec3 vViewPosition;",
        "varying vec3 vWorldPosition;",
        "varying vec4 vColor;",
        "varying vec2 vUv;",
        "varying vec3 vNormal;",
        THREE.ShaderChunk["shadowmap_pars_vertex"],
        "void main(){",
        "vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",
        "vWorldPosition = worldPosition.xyz;",
        "vColor.xyz = color;",
        "vColor.w = 1.0;",
        "vec3 transformedNormal = normalMatrix * normal;",
        "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
        "vViewPosition=mvPosition.xyz;",
        "vNormal = normalize( transformedNormal );",
        "vUv = uv;",
        THREE.ShaderChunk["shadowmap_vertex"],
        "gl_Position = projectionMatrix * mvPosition;",
        "}"
    ].join("\n"),
    fragmentShader: [
        "#extension GL_OES_standard_derivatives : enable",
        "varying vec3 vWorldPosition;",
        "varying vec4 vColor;",
        "varying vec2 vUv;",
        THREE.ShaderChunk[ "lights_phong_pars_fragment" ],
        THREE.ShaderChunk["shadowmap_pars_fragment"],
        "void main(){",
        "vec4 color = vColor;",
        "color.r = 1.0;",
        "color.g = 1.0;",
        "color.b = 1.0;",
        " vec3 fdx = dFdx( vViewPosition );",
        " vec3 fdy = dFdy( vViewPosition );",
        " vec3 normal = normalize( cross( fdx, fdy ) );",
        "float diffLight=dot(normal,directionalLightDirection[ 0 ]);",
        "gl_FragColor = vec4( color.xyz*diffLight, color.w );",
        THREE.ShaderChunk["shadowmap_fragment"],
        "}"
    ].join("\n")
}
var PaperShader1 = {
    uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib["common"],
        THREE.UniformsLib["lights"],
        THREE.UniformsLib['shadowmap'],
        {
            time: {type: "f", value: 1.0},
            "emissive" : { type: "c", value: new THREE.Color( 0x000000 ) },
            "specular" : { type: "c", value: new THREE.Color( 0xffffff ) },
            "shininess": { type: "f", value: 30 },
            "wrapRGB"  : { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) }
        }
    ]),
    attributes:{},
    vertexShader: [
        "#define PHONG",
        "varying vec3 vViewPosition;",
        THREE.ShaderChunk[ "common" ],
        "varying vec3 vWorldPosition;",
        "varying vec4 vColor;",
        "varying vec2 vUv;",
        "varying vec3 vNormal;",
        THREE.ShaderChunk["shadowmap_pars_vertex"],
        "void main(){",
        "vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",
        "vWorldPosition = worldPosition.xyz;",
        "vColor.xyz = color;",
        "vColor.w = 1.0;",
        "vec3 transformedNormal = normalMatrix * normal;",
        "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
        "vViewPosition=mvPosition.xyz;",
        "vNormal = normalize( transformedNormal );",
        "vUv = uv;",
        THREE.ShaderChunk["shadowmap_vertex"],
        "gl_Position = projectionMatrix * mvPosition;",
        "}"
    ].join("\n"),
    fragmentShader: [
        "#extension GL_OES_standard_derivatives : enable",
        "#define PHONG",
        "uniform float time;",
        "uniform vec3 emissive;",
        "uniform vec3 specular;",
        "uniform float shininess;",
        THREE.ShaderChunk[ "common" ],
        "varying vec3 vWorldPosition;",
        "varying vec4 vColor;",
        "varying vec2 vUv;",
        THREE.ShaderChunk[ "lights_phong_pars_fragment" ],
        THREE.ShaderChunk["shadowmap_pars_fragment"],
        "void main(){",
        "vec4 color = vColor;",
        "float a=cos(vWorldPosition.y / 15.0 * cos(time)) + sin(vWorldPosition.x / 5.0 * sin(time));",
        "float b=cos(vWorldPosition.y / 15.0 * cos(time - 10.0)) + sin(vWorldPosition.x / 5.0 * sin(time - 10.0));",
        "color.rgb=vec3((1.0+a*0.5-b*0.3)*0.5);",
        "float specularStrength = 1.0;",
        "float ambient = 0.2;",
        "vec3 diffuse = color.xyz;",
        "vec3 outgoingLight =vec3( 0.0 );",
        "vec4 diffuseColor = color;",
        "gl_FragColor = vec4( 1.0 );",
        THREE.ShaderChunk[ "lights_phong_fragment" ],
        THREE.ShaderChunk["shadowmap_fragment"],
        "}"
    ].join("\n")
}
var PaperShader2 = {
    uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib["common"],
        THREE.UniformsLib["lights"],
        THREE.UniformsLib['shadowmap'],
        {
            time: {type: "f", value: 1.0},
            "emissive" : { type: "c", value: new THREE.Color( 0x000000 ) },
            "specular" : { type: "c", value: new THREE.Color( 0xffffff ) },
            "shininess": { type: "f", value: 30 },
            "wrapRGB"  : { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) }
        }
    ]),
    attributes:{},
    vertexShader: [
        "#define PHONG",
        "varying vec3 vViewPosition;",
        THREE.ShaderChunk[ "common" ],
        "varying vec3 vWorldPosition;",
        "varying vec4 vColor;",
        "varying vec2 vUv;",
        "varying vec3 vNormal;",
        THREE.ShaderChunk["shadowmap_pars_vertex"],
        "void main(){",
        "vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",
        "vWorldPosition = worldPosition.xyz;",
        "vColor.xyz = color;",
        "vColor.w = 1.0;",
        "vec3 transformedNormal = normalMatrix * normal;",
        "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
        "vViewPosition=mvPosition.xyz;",
        "vNormal = normalize( transformedNormal );",
        "vUv = uv;",
        THREE.ShaderChunk["shadowmap_vertex"],
        "gl_Position = projectionMatrix * mvPosition;",
        "}"
    ].join("\n"),
    fragmentShader: [
        "#extension GL_OES_standard_derivatives : enable",
        "#define PHONG",
        "uniform float time;",
        "uniform vec3 emissive;",
        "uniform vec3 specular;",
        "uniform float shininess;",
        THREE.ShaderChunk[ "common" ],
        "varying vec3 vWorldPosition;",
        "varying vec4 vColor;",
        "varying vec2 vUv;",
        THREE.ShaderChunk[ "lights_phong_pars_fragment" ],
        THREE.ShaderChunk["shadowmap_pars_fragment"],
        "void main(){",
        "vec4 color = vColor;",
        "float a=abs( sin( vWorldPosition.x / 200.0 * (vWorldPosition.y + 500.0) / 200.0 + time / 5.0 ) );",
        "float b=abs( sin( vWorldPosition.x / 100.0 * (vWorldPosition.y + 500.0) / 100.0 + time / 4.0 ) );",
        "float c=abs( sin( vWorldPosition.x / 50.0 * (vWorldPosition.y + 500.0) / 50.0 + time / 3.0 ) );",
        "color.rgb=vec3((1.0+a*0.5-b*0.3 + c*0.1)*0.5);",
        "float specularStrength = 1.0;",
        "float ambient = 0.2;",
        "vec3 diffuse = color.xyz;",
        "vec3 outgoingLight =vec3( 0.0 );",
        "vec4 diffuseColor = color;",
        "gl_FragColor = vec4( 1.0 );",
        THREE.ShaderChunk[ "lights_phong_fragment" ],
        THREE.ShaderChunk["shadowmap_fragment"],
        "}"
    ].join("\n")
}
var PaperShader22 = {
    uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib["common"],
        THREE.UniformsLib["lights"],
        THREE.UniformsLib['shadowmap'],
        {
            time: {type: "f", value: 1.0},
            "emissive" : { type: "c", value: new THREE.Color( 0x000000 ) },
            "specular" : { type: "c", value: new THREE.Color( 0xffffff ) },
            "shininess": { type: "f", value: 30 },
            "wrapRGB"  : { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) }
        }
    ]),
    attributes:{},
    vertexShader: [
        "#define PHONG",
        "varying vec3 vViewPosition;",
        THREE.ShaderChunk[ "common" ],
        "varying vec3 vWorldPosition;",
        "varying vec4 vColor;",
        "varying vec2 vUv;",
        "varying vec3 vNormal;",
        THREE.ShaderChunk["shadowmap_pars_vertex"],
        "void main(){",
        "vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",
        "vWorldPosition = worldPosition.xyz;",
        "vColor.xyz = color;",
        "vColor.w = 1.0;",
        "vec3 transformedNormal = normalMatrix * normal;",
        "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
        "vViewPosition=mvPosition.xyz;",
        "vNormal = normalize( transformedNormal );",
        "vUv = uv;",
        THREE.ShaderChunk["shadowmap_vertex"],
        "gl_Position = projectionMatrix * mvPosition;",
        "}"
    ].join("\n"),
    fragmentShader: [
        "#extension GL_OES_standard_derivatives : enable",
        "#define PHONG",
        "uniform float time;",
        "uniform vec3 emissive;",
        "uniform vec3 specular;",
        "uniform float shininess;",
        THREE.ShaderChunk[ "common" ],
        "varying vec3 vWorldPosition;",
        "varying vec4 vColor;",
        "varying vec2 vUv;",
        THREE.ShaderChunk[ "lights_phong_pars_fragment" ],
        THREE.ShaderChunk["shadowmap_pars_fragment"],
        "void main(){",
        "vec4 color = vColor;",
        "float k = 0.0;",
        "float a= cos( (vWorldPosition.y / 100.0)  * 1.0 );",
        "float b= sin( (vWorldPosition.x / 100.0)  *  10.0);",
        "float c= sin( (vWorldPosition.y / 100.0)  * 8.0 );",
        "c *= sin( time / 10.0 ) * 0.5;",
        "color.rgb=vec3(sin(a*0.1-b*0.3 + c*10.0)*0.8);",
        "float specularStrength = 1.0;",
        "float ambient = 0.2;",
        "vec3 diffuse = color.xyz;",
        "vec3 outgoingLight =vec3( 0.0 );",
        "vec4 diffuseColor = color;",
        "gl_FragColor = vec4( 1.0 );",
        THREE.ShaderChunk[ "lights_phong_fragment" ],
        THREE.ShaderChunk["shadowmap_fragment"],
        "}"
    ].join("\n")
}
var PaperShader23 = {
    uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib["common"],
        THREE.UniformsLib["lights"],
        THREE.UniformsLib['shadowmap'],
        {
            time: {type: "f", value: 1.0},
            "emissive" : { type: "c", value: new THREE.Color( 0x000000 ) },
            "specular" : { type: "c", value: new THREE.Color( 0xffffff ) },
            "shininess": { type: "f", value: 30 },
            "wrapRGB"  : { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) }
        }
    ]),
    attributes:{},
    vertexShader: [
        "#define PHONG",
        "varying vec3 vViewPosition;",
        THREE.ShaderChunk[ "common" ],
        "varying vec3 vWorldPosition;",
        "varying vec4 vColor;",
        "varying vec2 vUv;",
        "varying vec3 vNormal;",
        THREE.ShaderChunk["shadowmap_pars_vertex"],
        "void main(){",
        "vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",
        "vWorldPosition = worldPosition.xyz;",
        "vColor.xyz = color;",
        "vColor.w = 1.0;",
        "vec3 transformedNormal = normalMatrix * normal;",
        "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
        "vViewPosition=mvPosition.xyz;",
        "vNormal = normalize( transformedNormal );",
        "vUv = uv;",
        THREE.ShaderChunk["shadowmap_vertex"],
        "gl_Position = projectionMatrix * mvPosition;",
        "}"
    ].join("\n"),
    fragmentShader: [
        "#extension GL_OES_standard_derivatives : enable",
        "#define PHONG",
        "uniform float time;",
        "uniform vec3 emissive;",
        "uniform vec3 specular;",
        "uniform float shininess;",
        THREE.ShaderChunk[ "common" ],
        "varying vec3 vWorldPosition;",
        "varying vec4 vColor;",
        "varying vec2 vUv;",
        THREE.ShaderChunk[ "lights_phong_pars_fragment" ],
        THREE.ShaderChunk["shadowmap_pars_fragment"],
        "void main(){",
        "vec4 color = vColor;",
        "float k = 0.0;",
        "float a= cos( (3.0*vWorldPosition.y / 100.0)  * 1.0 );",
        "float b= sin( (vWorldPosition.x / 100.0)  *  10.0);",
        "float c= sin( (vWorldPosition.y / 500.0 )  * 8.0 );",
        "c *= sin( time / 10.0 ) * 0.5;",
        "color.rgb=vec3(sin(a*0.1-b*0.3 + c*50.0)*0.8);",
        "float specularStrength = 1.0;",
        "float ambient = 0.2;",
        "vec3 diffuse = color.xyz;",
        "vec3 outgoingLight =vec3( 0.0 );",
        "vec4 diffuseColor = color;",
        "gl_FragColor = vec4( 1.0 );",
        THREE.ShaderChunk[ "lights_phong_fragment" ],
        THREE.ShaderChunk["shadowmap_fragment"],
        "}"
    ].join("\n")
}
var PaperShader3 = {
    uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib["common"],
        THREE.UniformsLib["lights"],
        THREE.UniformsLib['shadowmap'],
        {
            time: {type: "f", value: 1.0},
            NodeV: { type: "f", value: 1.0 },
            "emissive" : { type: "c", value: new THREE.Color( 0x000000 ) },
            "specular" : { type: "c", value: new THREE.Color( 0xffffff ) },
            "shininess": { type: "f", value: 30 },
            "wrapRGB"  : { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) }
        }
    ]),
    attributes:{},
    vertexShader: [
        "#define PHONG",
        "varying vec3 vViewPosition;",
        THREE.ShaderChunk[ "common" ],
        "varying vec3 vWorldPosition;",
        "varying vec4 vColor;",
        "varying vec2 vUv;",
        "varying vec3 vNormal;",
        THREE.ShaderChunk["shadowmap_pars_vertex"],
        "void main(){",
        "vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",
        "vWorldPosition = worldPosition.xyz;",
        "vColor.xyz = color;",
        "vColor.w = 1.0;",
        "vec3 transformedNormal = normalMatrix * normal;",
        "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
        "vViewPosition=mvPosition.xyz;",
        "vNormal = normalize( transformedNormal );",
        "vUv = uv;",
        THREE.ShaderChunk["shadowmap_vertex"],
        "gl_Position = projectionMatrix * mvPosition;",
        "}"
    ].join("\n"),
    fragmentShader: [
        "#extension GL_OES_standard_derivatives : enable",
        "#define PHONG",
        "uniform float time;",
        "uniform float NodeV;",
        "uniform vec3 emissive;",
        "uniform vec3 specular;",
        "uniform float shininess;",
        THREE.ShaderChunk[ "common" ],
        "varying vec3 vWorldPosition;",
        "varying vec4 vColor;",
        "varying vec2 vUv;",
        THREE.ShaderChunk[ "lights_phong_pars_fragment" ],
        THREE.ShaderChunk["shadowmap_pars_fragment"],
        "void main(){",
        "vec4 color = vColor;",
        "color.r += sin( (vWorldPosition.y / 20.0 ) * cos( NodeV / 15.0 ) * 8.0 ) + cos(( vWorldPosition.x / 20.0) * cos( NodeV / 15.0 ) * 1.0 + time);",
        "color.g += sin( (vWorldPosition.y / 20.0 ) * cos( NodeV / 15.0 ) * 4.0 ) + cos(( vWorldPosition.x / 20.0) * cos( NodeV / 15.0 ) * 1.0 + time);",
        "color.b += sin( (vWorldPosition.y / 20.0 ) * cos( NodeV / 15.0 ) * 2.0 ) + cos(( vWorldPosition.x / 20.0) * cos( NodeV / 15.0 ) * 1.0 + time);",
        "float specularStrength = 1.0;",
        "float ambient = 0.2;",
        "vec3 diffuse = color.xyz;",
        "vec3 outgoingLight =vec3( 0.0 );",
        "vec4 diffuseColor = color;",
        "gl_FragColor = vec4( 1.0 );",
        THREE.ShaderChunk[ "lights_phong_fragment" ],
        THREE.ShaderChunk["shadowmap_fragment"],
        "}"
    ].join("\n")
}
var PaperShader4 = {
    uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib["common"],
        THREE.UniformsLib["lights"],
        THREE.UniformsLib['shadowmap'],
        {
            time: {type: "f", value: 1.0},
            NodeV: { type: "f", value: 1.0 },
            "emissive" : { type: "c", value: new THREE.Color( 0x000000 ) },
            "specular" : { type: "c", value: new THREE.Color( 0xffffff ) },
            "shininess": { type: "f", value: 30 },
            "wrapRGB"  : { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) }
        }
    ]),
    attributes:{},
    vertexShader: [
        "#define PHONG",
        "varying vec3 vViewPosition;",
        THREE.ShaderChunk[ "common" ],
        "varying vec3 vWorldPosition;",
        "varying vec4 vColor;",
        "varying vec2 vUv;",
        "varying vec3 vNormal;",
        THREE.ShaderChunk["shadowmap_pars_vertex"],
        "void main(){",
        "vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",
        "vWorldPosition = worldPosition.xyz;",
        "vColor.xyz = color;",
        "vColor.w = 1.0;",
        "vec3 transformedNormal = normalMatrix * normal;",
        "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
        "vViewPosition=mvPosition.xyz;",
        "vNormal = normalize( transformedNormal );",
        "vUv = uv;",
        THREE.ShaderChunk["shadowmap_vertex"],
        "gl_Position = projectionMatrix * mvPosition;",
        "}"
    ].join("\n"),
    fragmentShader: [
        "#extension GL_OES_standard_derivatives : enable",
        "#define PHONG",
        "uniform float time;",
        "uniform float NodeV;",
        "uniform vec3 emissive;",
        "uniform vec3 specular;",
        "uniform float shininess;",
        THREE.ShaderChunk[ "common" ],
        "varying vec3 vWorldPosition;",
        "varying vec4 vColor;",
        "varying vec2 vUv;",
        THREE.ShaderChunk[ "lights_phong_pars_fragment" ],
        THREE.ShaderChunk["shadowmap_pars_fragment"],
        "void main(){",
        "vec4 color = vColor;",
        "float k = 0.0;",
        "k += cos( (vWorldPosition.y / 20.0) * cos( NodeV / 30.0 ) * 1.0 );",
        "k += cos( (vWorldPosition.x / 20.0) * sin( NodeV / 50.0 ) * 4.0 );",
        "k += sin( (vWorldPosition.y / 20.0) * sin( NodeV / 70.0 ) * 8.0 );",
        "k *= sin( time / 10.0 ) * 0.5;",
        "color.r = k;",
        "color.g = k * 0.5;",
        "color.b = k * 0.25;",
        "float specularStrength = 1.0;",
        "float ambient = 0.2;",
        "vec3 diffuse = color.xyz;",
        "vec3 outgoingLight =vec3( 0.0 );",
        "vec4 diffuseColor = color;",
        "gl_FragColor = vec4( 1.0 );",
        THREE.ShaderChunk[ "lights_phong_fragment" ],
        THREE.ShaderChunk["shadowmap_fragment"],
        "}"
    ].join("\n")
}
var PaperShader5 = {
    uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib["common"],
        THREE.UniformsLib["lights"],
        THREE.UniformsLib['shadowmap'],
        {
            time: {type: "f", value: 1.0},
            NodeV: { type: "f", value: 1.0 },
            "emissive" : { type: "c", value: new THREE.Color( 0x000000 ) },
            "specular" : { type: "c", value: new THREE.Color( 0xffffff ) },
            "shininess": { type: "f", value: 30 },
            "wrapRGB"  : { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) }
        }
    ]),
    attributes:{},
    vertexShader: [
        "#define PHONG",
        "varying vec3 vViewPosition;",
        THREE.ShaderChunk[ "common" ],
        "varying vec3 vWorldPosition;",
        "varying vec4 vColor;",
        "varying vec2 vUv;",
        "varying vec3 vNormal;",
        THREE.ShaderChunk["shadowmap_pars_vertex"],
        "void main(){",
        "vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",
        "vWorldPosition = worldPosition.xyz;",
        "vColor.xyz = color;",
        "vColor.w = 1.0;",
        "vec3 transformedNormal = normalMatrix * normal;",
        "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
        "vViewPosition=mvPosition.xyz;",
        "vNormal = normalize( transformedNormal );",
        "vUv = uv;",
        THREE.ShaderChunk["shadowmap_vertex"],
        "gl_Position = projectionMatrix * mvPosition;",
        "}"
    ].join("\n"),
    fragmentShader: [
        "#extension GL_OES_standard_derivatives : enable",
        "#define PHONG",
        "uniform float time;",
        "uniform float NodeV;",
        "uniform vec3 emissive;",
        "uniform vec3 specular;",
        "uniform float shininess;",
        THREE.ShaderChunk[ "common" ],
        "varying vec3 vWorldPosition;",
        "varying vec4 vColor;",
        "varying vec2 vUv;",
        THREE.ShaderChunk[ "lights_phong_pars_fragment" ],
        THREE.ShaderChunk["shadowmap_pars_fragment"],
        "void main(){",
        "vec4 color = vColor;",
        "float a = sin( (vWorldPosition.x / 200.0 ) * 8.0  + NodeV);",
        "float b = sin( (vWorldPosition.x / 200.0 ) * 4.0  - 2.0*NodeV);",
        "color.rgb=vec3((1.0+a*0.5-b*0.3)*0.5);",
        "color.g += sin( (vWorldPosition.x / 200.0 ) * 1.0  + NodeV);",
        "color.b += sin( (vWorldPosition.x / 200.0 ) * 1.0  + NodeV);",
        "float specularStrength = 1.0;",
        "float ambient = 0.2;",
        "vec3 diffuse = color.xyz;",
        "vec3 outgoingLight =vec3( 0.0 );",
        "vec4 diffuseColor = color;",
        "gl_FragColor = vec4( 1.0 );",
        THREE.ShaderChunk[ "lights_phong_fragment" ],
        THREE.ShaderChunk["shadowmap_fragment"],
        "}"
    ].join("\n")
}
var PaperShader6 = {
    uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib["common"],
        THREE.UniformsLib["lights"],
        THREE.UniformsLib['shadowmap'],
        {
            time: {type: "f", value: 1.0},
            NodeVX: { type: "f", value: 1.0 },
            NodeVY: { type: "f", value: 1.0 },
            "emissive" : { type: "c", value: new THREE.Color( 0x000000 ) },
            "specular" : { type: "c", value: new THREE.Color( 0xffffff ) },
            "shininess": { type: "f", value: 30 },
            "wrapRGB"  : { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) }
        }
    ]),
    attributes:{},
    vertexShader: [
        "#define PHONG",
        "varying vec3 vViewPosition;",
        THREE.ShaderChunk[ "common" ],
        "varying vec3 vWorldPosition;",
        "varying vec4 vColor;",
        "varying vec2 vUv;",
        "varying vec3 vNormal;",
        THREE.ShaderChunk["shadowmap_pars_vertex"],
        "void main(){",
        "vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",
        "vWorldPosition = worldPosition.xyz;",
        "vColor.xyz = color;",
        "vColor.w = 1.0;",
        "vec3 transformedNormal = normalMatrix * normal;",
        "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
        "vViewPosition=mvPosition.xyz;",
        "vNormal = normalize( transformedNormal );",
        "vUv = uv;",
        THREE.ShaderChunk["shadowmap_vertex"],
        "gl_Position = projectionMatrix * mvPosition;",
        "}"
    ].join("\n"),
    fragmentShader: [
        "#extension GL_OES_standard_derivatives : enable",
        "#define PHONG",
        "uniform float time;",
        "uniform float NodeVX;",
        "uniform float NodeVY;",
        "uniform vec3 emissive;",
        "uniform vec3 specular;",
        "uniform float shininess;",
        THREE.ShaderChunk[ "common" ],
        "varying vec3 vWorldPosition;",
        "varying vec4 vColor;",
        "varying vec2 vUv;",
        THREE.ShaderChunk[ "lights_phong_pars_fragment" ],
        THREE.ShaderChunk["shadowmap_pars_fragment"],
        "void main(){",
        "vec4 color = vColor;",
        "float temptx = vWorldPosition.x - NodeVX;",
        "if(abs(temptx) > 100.0){" ,
        "temptx *= 20.0;" ,
        "}",
        "else{" ,
        "temptx *= 0.1;" ,
        "}",
        "float tempty = vWorldPosition.y - NodeVY;",
        "if(abs(tempty) <= 100.0){" ,
        "tempty *= 20.0;" ,
        "}",
        "else{" ,
        "tempty *= 0.1;" ,
        "}",
        "float a = 0.5*(sin(tempty / 2.0 )+ cos(temptx / 2.0));",
        "float b = 0.5*(sin(vWorldPosition.y / 20.0 )+ cos(vWorldPosition.x / 20.0));",
        "color.rgb=vec3((1.0+a*0.9 - b*0.5)*0.5);",
        "float specularStrength = 1.0;",
        "float ambient = 0.2;",
        "vec3 diffuse = color.xyz;",
        "vec3 outgoingLight =vec3( 0.0 );",
        "vec4 diffuseColor = color;",
        "gl_FragColor = vec4( 1.0 );",
        THREE.ShaderChunk[ "lights_phong_fragment" ],
        THREE.ShaderChunk["shadowmap_fragment"],
        "}"
    ].join("\n")
}
//////////////////////////////////////////
function DrawTraceIndex() {
    if(Gate == 0){
        var DrawCount = 30;
        var pointCount = DrawCount * 2;
        var faceCount = pointCount - 2;
        var indices = new THREE.BufferAttribute(new Uint32Array(faceCount * 3), 1);
        for (var i = 0; i < faceCount / 2; i++) {
            indices.array[i * 2 * 3] = i * 2 + 2;
            indices.array[i * 2 * 3 + 1] = i * 2 + 1;
            indices.array[i * 2 * 3 + 2] = i * 2;
            indices.array[i * 2 * 3 + 3] = i * 2 + 1;
            indices.array[i * 2 * 3 + 4] = i * 2 + 2;
            indices.array[i * 2 * 3 + 5] = i * 2 + 3;
        }
        return indices;
    }
    else if(Gate == 1){
        var DrawCount = 60;
        var pointCount = DrawCount * 2;
        var faceCount = pointCount - 2;
        var indices = new THREE.BufferAttribute(new Uint32Array(faceCount * 3), 1);
        for (var i = 0; i < faceCount / 2; i++) {
            indices.array[i * 6] = i * 2 + 2;
            indices.array[i * 6 + 1] = i * 2 + 1;
            indices.array[i * 6 + 2] = i * 2;
            indices.array[i * 6 + 3] = i * 2 + 1;
            indices.array[i * 6 + 4] = i * 2 + 2;
            indices.array[i * 6 + 5] = i * 2 + 3;
        }
        return indices;
    }
    else if(Gate == 2 || Gate == 3 || Gate == 9 || Gate == 10){
        var DrawCount = 30;
        var pointCount = DrawCount * 2;
        var faceCount = pointCount - 2;
        var indices = new THREE.BufferAttribute(new Uint32Array(faceCount * 3), 1);
        for (var i = 0; i < faceCount / 2; i++) {
            indices.array[i * 2 * 3] = i * 2 + 2;
            indices.array[i * 2 * 3 + 1] = i * 2 + 1;
            indices.array[i * 2 * 3 + 2] = i * 2;
            indices.array[i * 2 * 3 + 3] = i * 2 + 1;
            indices.array[i * 2 * 3 + 4] = i * 2 + 2;
            indices.array[i * 2 * 3 + 5] = i * 2 + 3;
        }
        return indices;
    }
}
function DrawTrace(Index) {
    if(Gate == 0){
        var DrawCount = 30;
        var pointCount = DrawCount * 2;
        this.Geo = new THREE.BufferGeometry();
        this.Index = Index;
        this.DrawCount = DrawCount;
        this.pointCount = pointCount;
        this.Pos = new THREE.BufferAttribute(new Float32Array(pointCount * 3), 3);
        this.Col = new THREE.BufferAttribute(new Float32Array(pointCount * 4), 4);
        this.Nor = new THREE.BufferAttribute(new Float32Array(pointCount * 3), 3);
        var shader = TraceShader0;
        this.Material = new THREE.RawShaderMaterial({
            uniforms: shader.uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader,
            side: THREE.DoubleSide,
            lights: true
        });
    }
    else if(Gate == 1){
        var DrawCount = 60;
        var pointCount = DrawCount * 2;
        var uvs = new THREE.BufferAttribute(new Float32Array(pointCount * 2), 2);
        for(var i = 0 ; i < DrawCount; i++){
            uvs.array[4*i] = i / (DrawCount-1);
            uvs.array[4*i + 1] = 0;
            uvs.array[4*i + 2] = i /(DrawCount-1);
            uvs.array[4*i + 3] = 1;
        }
        this.uv = uvs;
        this.Geo = new THREE.BufferGeometry();
        this.Index = Index;
        this.DrawCount = DrawCount;
        this.pointCount = pointCount;
        this.Pos = new THREE.BufferAttribute(new Float32Array(pointCount * 3), 3);
        this.Col = new THREE.BufferAttribute(new Float32Array(pointCount * 4), 4);
        this.Nor = new THREE.BufferAttribute(new Float32Array(pointCount * 3), 3);
        var shader = TraceShader1;

        var that=this;
        var tex=THREE.ImageUtils.loadTexture( "./img/01Stroke.png", undefined, function() {
            shader.uniforms.texture1.value=tex;

            that.Material = new THREE.ShaderMaterial({
                uniforms: shader.uniforms,
                vertexShader: shader.vertexShader,
                fragmentShader: shader.fragmentShader,
                side: THREE.DoubleSide
            });
        } );
    }
    else if(Gate == 2){
        var DrawCount = 30;
        var pointCount = DrawCount * 2;
        this.Geo = new THREE.BufferGeometry();
        this.Index = Index;
        this.DrawCount = DrawCount;
        this.pointCount = pointCount;
        this.Pos = new THREE.BufferAttribute(new Float32Array(pointCount * 3), 3);
        this.Col = new THREE.BufferAttribute(new Float32Array(pointCount * 4), 4);
        this.Nor = new THREE.BufferAttribute(new Float32Array(pointCount * 3), 3);
        var shader = TraceShader0;

        this.Material = new THREE.RawShaderMaterial({
            uniforms: shader.uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader,
            side: THREE.DoubleSide,
            lights: true
        });
    }
    else if(Gate == 3){
        var DrawCount = 30;
        var pointCount = DrawCount * 2;
        this.Geo = new THREE.BufferGeometry();
        this.Index = Index;
        this.DrawCount = DrawCount;
        this.pointCount = pointCount;
        this.Pos = new THREE.BufferAttribute(new Float32Array(pointCount * 3), 3);
        this.Col = new THREE.BufferAttribute(new Float32Array(pointCount * 4), 4);
        this.Nor = new THREE.BufferAttribute(new Float32Array(pointCount * 3), 3);

        this.Material = new THREE.MeshPhongMaterial( {
            color: 0xaaaaaa, specular: 0xffffff , shininess: 250 , side: THREE.DoubleSide, vertexColors: THREE.VertexColors, shading: THREE.FlatShading, opacity: 0.5, transparent: true
        } );

    }
    else if(Gate == 9 || Gate == 10){
        var DrawCount = 30;
        var pointCount = DrawCount * 2;
        this.Geo = new THREE.BufferGeometry();
        this.Index = Index;
        this.DrawCount = DrawCount;
        this.pointCount = pointCount;
        this.Pos = new THREE.BufferAttribute(new Float32Array(pointCount * 3), 3);
        this.Col = new THREE.BufferAttribute(new Float32Array(pointCount * 4), 4);
        this.Nor = new THREE.BufferAttribute(new Float32Array(pointCount * 3), 3);
        this.Material = new THREE.MeshPhongMaterial( {
            color: 0xaaaaaa, specular: 0xffffff , shininess: 250 , side: THREE.DoubleSide, vertexColors: THREE.VertexColors, shading: THREE.FlatShading, opacity: 0.5, transparent: true
        } );
    }
}
function DrawTraceCreate(DrawTrace, scene) {
    if(Gate == 0){
        for (var i = 0; i < DrawTrace.Pos.length / 3; i++) {
            DrawTrace.Pos.setXYZ(i, 0, 0, 0);
            DrawTrace.Nor.setXYZ(i, 0, 0, 0);
        }
        for (var i = 0; i < DrawTrace.Col.length / 4; i++) {
            DrawTrace.Col.setXYZW(i, 1, 1, 1, 1);
        }
        DrawTrace.Geo.addAttribute('position', DrawTrace.Pos);
        DrawTrace.Geo.addAttribute('normal', DrawTrace.Nor);
        DrawTrace.Geo.addAttribute('color', DrawTrace.Col);
        DrawTrace.Geo.addAttribute('index', DrawTrace.Index);
        var DrawTraceFin = new THREE.Mesh(DrawTrace.Geo, DrawTrace.Material);
        DrawTraceFin.castShadow = true;
        DrawTraceFin.receiveShadow = true;
        scene.add(DrawTraceFin);
    }
    else if(Gate == 1){
        for ( var i = 0; i < DrawTrace.Pos.length/3; i ++ ) {
            DrawTrace.Pos.setXYZ( i,  0 , 0 , 0  );
            DrawTrace.Nor.setXYZ( i,  0 , 0 , 0  );
        }
        for ( var i = 0; i < DrawTrace.Col.length/4; i ++ ) {
            DrawTrace.Col.setXYZW( i,  0 , 0 , 0 , 1);
        }
        DrawTrace.Geo.addAttribute( 'position', DrawTrace.Pos );
        DrawTrace.Geo.addAttribute( 'normal', DrawTrace.Nor );
        DrawTrace.Geo.addAttribute( 'color', DrawTrace.Col );
        DrawTrace.Geo.addAttribute( 'index', DrawTrace.Index );
        DrawTrace.Geo.addAttribute( 'uv', DrawTrace.uv );
        var DrawTraceFin = new THREE.Mesh( DrawTrace.Geo, DrawTrace.Material );
        DrawTraceFin.castShadow = true;
        DrawTraceFin.receiveShadow = true;
        scene.add( DrawTraceFin );
    }
    else if(Gate == 2 || Gate == 3 || Gate == 9 || Gate == 10 ){
        for (var i = 0; i < DrawTrace.Pos.length / 3; i++) {
            DrawTrace.Pos.setXYZ(i, 0, 0, 0);
            DrawTrace.Nor.setXYZ(i, 0, 0, 0);
        }
        for (var i = 0; i < DrawTrace.Col.length / 4; i++) {
            DrawTrace.Col.setXYZW(i, 1, 1, 1, 1);
        }
        DrawTrace.Geo.addAttribute('position', DrawTrace.Pos);
        DrawTrace.Geo.addAttribute('normal', DrawTrace.Nor);
        DrawTrace.Geo.addAttribute('color', DrawTrace.Col);
        DrawTrace.Geo.addAttribute('index', DrawTrace.Index);
        var DrawTraceFin = new THREE.Mesh(DrawTrace.Geo, DrawTrace.Material);
        DrawTraceFin.castShadow = true;
        DrawTraceFin.receiveShadow = true;
        scene.add(DrawTraceFin);
    }
}
function DrawColleDynamic(DrawColle, pos, PosIndicater) {
    if(Gate == 0 || Gate == 1 || Gate == 2 || Gate == 3 || Gate == 9 || Gate == 10){
        if (DrawColle.length == 0) {
            DrawColle.push(pos[PosIndicater]);
            DrawColle.push(pos[PosIndicater + 1]);
            DrawColle.push(pos[PosIndicater + 2]);
        }
        else {
            var DrawPosD = 100 * Math.sqrt(Math.abs(DrawColle[0] - pos[PosIndicater]) * Math.abs(DrawColle[0] - pos[PosIndicater]) +
                    Math.abs(DrawColle[1] - pos[PosIndicater + 1]) * Math.abs(DrawColle[1] - pos[PosIndicater + 1]) +
                    Math.abs(DrawColle[2] - pos[PosIndicater + 2]) * Math.abs(DrawColle[2] - pos[PosIndicater + 2]));
            if (DrawPosD > 5) {
                DrawColle.push(pos[PosIndicater]);
                DrawColle.push(pos[PosIndicater + 1]);
                DrawColle.push(pos[PosIndicater + 2]);
            }
        }
        if (DrawColle.length > 3) {
            DrawColle.shift();
            DrawColle.shift();
            DrawColle.shift();
        }
    }
}
function DrawTraceDynamic(AnchorAcc, DrawTrace, DrawColle,ControlOutput) {
    if(Gate == 0){
        var AnchorF = Math.abs(AnchorAcc.X) + Math.abs(AnchorAcc.Y) + Math.abs(AnchorAcc.Z);
        if (AnchorF > 8) {
            AnchorF = 1;
        }
        else if (AnchorF < 1) {
            AnchorF = 0;
        }
        else {
            AnchorF = AnchorF / 8;
        }
        if (DrawColle.length == 3) {
            for (var i = 0; i < DrawTrace.Pos.array.length - 6; i++) {
                DrawTrace.Pos.array[i] = DrawTrace.Pos.array[i + 6];
                DrawTrace.Nor.array[i] = DrawTrace.Nor.array[i + 6];
            }
            for (var i = 0; i < DrawTrace.Col.array.length - 8; i++) {
                DrawTrace.Col.array[i] = DrawTrace.Col.array[i + 8];
            }
            DrawTrace.Pos.array[DrawTrace.DrawCount * 6 - 6] = DrawColle[0] * 400;
            DrawTrace.Pos.array[DrawTrace.DrawCount * 6 - 5] = DrawColle[1] * 400;
            DrawTrace.Pos.array[DrawTrace.DrawCount * 6 - 4] = DrawColle[2] * 400;
            var drawX = 25 / Math.pow(Math.abs(AnchorAcc.X), 0.5);
            var drawY = 25 / Math.pow(Math.abs(AnchorAcc.Y), 0.5);
            var drawZ = 25 / Math.pow(Math.abs(AnchorAcc.Z), 0.5);
            if (drawX > 100) drawX = 100;
            if (drawY > 100) drawY = 100;
            if (drawZ > 100) drawZ = 100;
            if (drawX < 25) drawX = 25;
            if (drawY < 25) drawY = 25;
            if (drawZ < 25) drawZ = 25;
            DrawTrace.Pos.array[DrawTrace.DrawCount * 6 - 3] = DrawColle[0] * 400 + drawX;
            DrawTrace.Pos.array[DrawTrace.DrawCount * 6 - 2] = DrawColle[1] * 400 + drawY;
            DrawTrace.Pos.array[DrawTrace.DrawCount * 6 - 1] = DrawColle[2] * 400 + drawZ;
            var Vec1 = new THREE.Vector3(DrawTrace.Pos.array[(DrawTrace.DrawCount - 1) * 6 - 6], DrawTrace.Pos.array[(DrawTrace.DrawCount - 1) * 6 - 5], DrawTrace.Pos.array[(DrawTrace.DrawCount - 1) * 6 - 4]);
            var Vec2 = new THREE.Vector3(DrawTrace.Pos.array[(DrawTrace.DrawCount - 1) * 6 - 3], DrawTrace.Pos.array[(DrawTrace.DrawCount - 1) * 6 - 2], DrawTrace.Pos.array[(DrawTrace.DrawCount - 1) * 6 - 1]);
            var Vec3 = new THREE.Vector3(DrawTrace.Pos.array[DrawTrace.DrawCount * 6 - 6], DrawTrace.Pos.array[DrawTrace.DrawCount * 6 - 5], DrawTrace.Pos.array[DrawTrace.DrawCount * 6 - 4]);
            var Vec4 = new THREE.Vector3(DrawTrace.Pos.array[DrawTrace.DrawCount * 6 - 3], DrawTrace.Pos.array[DrawTrace.DrawCount * 6 - 2], DrawTrace.Pos.array[DrawTrace.DrawCount * 6 - 1]);
            var VecBase = [Vec2, Vec1, Vec3, Vec2, Vec3, Vec4];
            var VecNormal = []
            for (var i = 0; i < VecBase.length / 3; i++) {
                var Vec1 = new THREE.Vector3(VecBase[3 * i].x - VecBase[3 * i + 1].x, VecBase[3 * i].y - VecBase[3 * i + 1].y, VecBase[3 * i].z - VecBase[3 * i + 1].z);
                var Vec2 = new THREE.Vector3(VecBase[3 * i + 1].x - VecBase[3 * i + 2].x, VecBase[3 * i + 1].y - VecBase[3 * i + 2].y, VecBase[3 * i + 1].z - VecBase[3 * i + 2].z);
                var Vec3 = new THREE.Vector3(VecBase[3 * i].x - VecBase[3 * i + 2].x, VecBase[3 * i].y - VecBase[3 * i + 2].y, VecBase[3 * i].z - VecBase[3 * i + 2].z);
                var normal1 = new THREE.Vector3();
                var normal2 = new THREE.Vector3();
                var normal3 = new THREE.Vector3();
                normal1.crossVectors(Vec1, Vec3);
                normal2.crossVectors(Vec1, Vec2);
                normal3.crossVectors(Vec3, Vec2);
                VecNormal.push(normal1);
                VecNormal.push(normal2);
                VecNormal.push(normal3);
            }
            for (var i = 0; i < VecNormal.length; i++) {
                DrawTrace.Nor.array[DrawTrace.pointCount * 3 - (VecNormal.length - i) * 3] = VecNormal[i].x;
                DrawTrace.Nor.array[DrawTrace.pointCount * 3 - (VecNormal.length - i) * 3 + 1] = VecNormal[i].y;
                DrawTrace.Nor.array[DrawTrace.pointCount * 3 - (VecNormal.length - i) * 3 + 2] = VecNormal[i].z;
            }
            if (DrawTrace.Paper == false) {
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 8] = AnchorF + 0.5;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 7] = AnchorF - 0.3;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 6] = AnchorF - 0.3;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 5] = 1;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 4] = AnchorF + 0.5;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 3] = AnchorF - 0.3;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 2] = AnchorF - 0.3;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 1] = 1;
            }
            else if (DrawTrace.Paper == true) {
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 8] = 0.5;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 7] = 0.5;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 6] = 0.5;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 5] = 0.5;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 4] = 0.5;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 3] = 0.5;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 2] = 0.5;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 1] = 0.5;
            }
        }
    }
    else if(Gate == 1){
        var AnchorF = Math.abs(AnchorAcc.X) + Math.abs(AnchorAcc.Y) + Math.abs(AnchorAcc.Z);
        if(AnchorF > 8){
            AnchorF = 1;
        }
        else if (AnchorF < 1){
            AnchorF = 0;
        }
        else{
            AnchorF = AnchorF / 8;
        }
        if(DrawColle.length == 3 ){
            for ( var i = 0; i < DrawTrace.Pos.array.length - 6; i ++ ) {
                DrawTrace.Pos.array[ i ] = DrawTrace.Pos.array[ i+6 ];
                DrawTrace.Nor.array[ i ] = DrawTrace.Nor.array[ i+6 ];
            }
            for ( var i = 0; i < DrawTrace.Col.array.length - 8; i ++ ) {
                DrawTrace.Col.array[ i ] = DrawTrace.Col.array[ i+8 ];
            }
            DrawTrace.Pos.array[ DrawTrace.DrawCount*6-6 ] = DrawColle[0]*400;
            DrawTrace.Pos.array[ DrawTrace.DrawCount*6-5 ] = DrawColle[1]*400;
            DrawTrace.Pos.array[ DrawTrace.DrawCount*6-4 ] = DrawColle[2]*400;
            DrawTrace.Pos.array[ DrawTrace.DrawCount*6-3 ] = ControlOutput.X;
            DrawTrace.Pos.array[ DrawTrace.DrawCount*6-2 ] = ControlOutput.Y;
            DrawTrace.Pos.array[ DrawTrace.DrawCount*6-1 ] = ControlOutput.Z;

            var Vec1 = new THREE.Vector3(  DrawTrace.Pos.array[ (DrawTrace.DrawCount-1)*6-6 ], DrawTrace.Pos.array[ (DrawTrace.DrawCount-1)*6-5 ], DrawTrace.Pos.array[ (DrawTrace.DrawCount-1)*6-4 ] );
            var Vec2 = new THREE.Vector3(  DrawTrace.Pos.array[ (DrawTrace.DrawCount-1)*6-3 ], DrawTrace.Pos.array[ (DrawTrace.DrawCount-1)*6-2 ], DrawTrace.Pos.array[ (DrawTrace.DrawCount-1)*6-1 ] );
            var Vec3 = new THREE.Vector3(  DrawTrace.Pos.array[ DrawTrace.DrawCount*6-6 ], DrawTrace.Pos.array[ DrawTrace.DrawCount*6-5 ], DrawTrace.Pos.array[ DrawTrace.DrawCount*6-4 ] );
            var Vec4 = new THREE.Vector3(  DrawTrace.Pos.array[ DrawTrace.DrawCount*6-3 ], DrawTrace.Pos.array[ DrawTrace.DrawCount*6-2 ], DrawTrace.Pos.array[ DrawTrace.DrawCount*6-1 ] );
            var VecBase = [Vec2,Vec1,Vec3,Vec2,Vec3,Vec4];
            var VecNormal = []
            for ( var i = 0; i < VecBase.length/3; i ++ ) {
                var Vec1 = new THREE.Vector3( VecBase[3*i].x - VecBase[3*i+1].x, VecBase[3*i].y - VecBase[3*i+1].y, VecBase[3*i].z - VecBase[3*i+1].z );
                var Vec2 = new THREE.Vector3( VecBase[3*i+1].x - VecBase[3*i+2].x, VecBase[3*i+1].y - VecBase[3*i+2].y, VecBase[3*i+1].z - VecBase[3*i+2].z );
                var Vec3 = new THREE.Vector3( VecBase[3*i].x - VecBase[3*i+2].x, VecBase[3*i].y - VecBase[3*i+2].y, VecBase[3*i].z - VecBase[3*i+2].z );
                var normal1 = new THREE.Vector3();
                var normal2 = new THREE.Vector3();
                var normal3 = new THREE.Vector3();
                normal1.crossVectors( Vec1, Vec3 );
                normal2.crossVectors( Vec1, Vec2 );
                normal3.crossVectors( Vec3, Vec2 );
                VecNormal.push(normal1);
                VecNormal.push(normal2);
                VecNormal.push(normal3);
            }
            for ( var i = 0; i < VecNormal.length; i ++ ) {
                DrawTrace.Nor.array[ DrawTrace.pointCount*3-(VecNormal.length-i)*3 ]    = VecNormal[i].x;
                DrawTrace.Nor.array[ DrawTrace.pointCount*3-(VecNormal.length-i)*3 + 1] = VecNormal[i].y;
                DrawTrace.Nor.array[ DrawTrace.pointCount*3-(VecNormal.length-i)*3 + 2] = VecNormal[i].z;
            }
            DrawTrace.Col.array[ DrawTrace.DrawCount*8-8 ] = 0.2;
            DrawTrace.Col.array[ DrawTrace.DrawCount*8-7 ] = 0.2;
            DrawTrace.Col.array[ DrawTrace.DrawCount*8-6 ] = 0.2;
            DrawTrace.Col.array[ DrawTrace.DrawCount*8-5 ] = 0.5;
            DrawTrace.Col.array[ DrawTrace.DrawCount*8-4 ] = 0.2;
            DrawTrace.Col.array[ DrawTrace.DrawCount*8-3 ] = 0.2;
            DrawTrace.Col.array[ DrawTrace.DrawCount*8-2 ] = 0.2;
            DrawTrace.Col.array[ DrawTrace.DrawCount*8-1 ] = 0.5;
        }
    }
    else if(Gate == 3){
        var AnchorF = Math.abs(AnchorAcc.X) + Math.abs(AnchorAcc.Y) + Math.abs(AnchorAcc.Z);
        if (AnchorF > 8) {
            AnchorF = 1;
        }
        else if (AnchorF < 1) {
            AnchorF = 0;
        }
        else {
            AnchorF = AnchorF / 8;
        }
        if (DrawColle.length == 3) {
            for (var i = 0; i < DrawTrace.Pos.array.length - 6; i++) {
                DrawTrace.Pos.array[i] = DrawTrace.Pos.array[i + 6];
                DrawTrace.Nor.array[i] = DrawTrace.Nor.array[i + 6];
            }
            for (var i = 0; i < DrawTrace.Col.array.length - 8; i++) {
                DrawTrace.Col.array[i] = DrawTrace.Col.array[i + 8];
            }
            DrawTrace.Pos.array[DrawTrace.DrawCount * 6 - 6] = DrawColle[0] * 400;
            DrawTrace.Pos.array[DrawTrace.DrawCount * 6 - 5] = DrawColle[1] * 400;
            DrawTrace.Pos.array[DrawTrace.DrawCount * 6 - 4] = DrawColle[2] * 400;
            var drawX = 25 / Math.pow(Math.abs(AnchorAcc.X), 0.5);
            var drawY = 25 / Math.pow(Math.abs(AnchorAcc.Y), 0.5);
            var drawZ = 25 / Math.pow(Math.abs(AnchorAcc.Z), 0.5);
            if (drawX > 100) drawX = 100;
            if (drawY > 100) drawY = 100;
            if (drawZ > 100) drawZ = 100;
            if (drawX < 25) drawX = 25;
            if (drawY < 25) drawY = 25;
            if (drawZ < 25) drawZ = 25;
            DrawTrace.Pos.array[DrawTrace.DrawCount * 6 - 3] = DrawColle[0] * 400 + drawX;
            DrawTrace.Pos.array[DrawTrace.DrawCount * 6 - 2] = DrawColle[1] * 400 + drawY;
            DrawTrace.Pos.array[DrawTrace.DrawCount * 6 - 1] = DrawColle[2] * 400 + drawZ;
            var Vec1 = new THREE.Vector3(DrawTrace.Pos.array[(DrawTrace.DrawCount - 1) * 6 - 6], DrawTrace.Pos.array[(DrawTrace.DrawCount - 1) * 6 - 5], DrawTrace.Pos.array[(DrawTrace.DrawCount - 1) * 6 - 4]);
            var Vec2 = new THREE.Vector3(DrawTrace.Pos.array[(DrawTrace.DrawCount - 1) * 6 - 3], DrawTrace.Pos.array[(DrawTrace.DrawCount - 1) * 6 - 2], DrawTrace.Pos.array[(DrawTrace.DrawCount - 1) * 6 - 1]);
            var Vec3 = new THREE.Vector3(DrawTrace.Pos.array[DrawTrace.DrawCount * 6 - 6], DrawTrace.Pos.array[DrawTrace.DrawCount * 6 - 5], DrawTrace.Pos.array[DrawTrace.DrawCount * 6 - 4]);
            var Vec4 = new THREE.Vector3(DrawTrace.Pos.array[DrawTrace.DrawCount * 6 - 3], DrawTrace.Pos.array[DrawTrace.DrawCount * 6 - 2], DrawTrace.Pos.array[DrawTrace.DrawCount * 6 - 1]);
            var VecBase = [Vec2, Vec1, Vec3, Vec2, Vec3, Vec4];
            var VecNormal = []
            for (var i = 0; i < VecBase.length / 3; i++) {
                var Vec1 = new THREE.Vector3(VecBase[3 * i].x - VecBase[3 * i + 1].x, VecBase[3 * i].y - VecBase[3 * i + 1].y, VecBase[3 * i].z - VecBase[3 * i + 1].z);
                var Vec2 = new THREE.Vector3(VecBase[3 * i + 1].x - VecBase[3 * i + 2].x, VecBase[3 * i + 1].y - VecBase[3 * i + 2].y, VecBase[3 * i + 1].z - VecBase[3 * i + 2].z);
                var Vec3 = new THREE.Vector3(VecBase[3 * i].x - VecBase[3 * i + 2].x, VecBase[3 * i].y - VecBase[3 * i + 2].y, VecBase[3 * i].z - VecBase[3 * i + 2].z);
                var normal1 = new THREE.Vector3();
                var normal2 = new THREE.Vector3();
                var normal3 = new THREE.Vector3();
                normal1.crossVectors(Vec1, Vec3);
                normal2.crossVectors(Vec1, Vec2);
                normal3.crossVectors(Vec3, Vec2);
                VecNormal.push(normal1);
                VecNormal.push(normal2);
                VecNormal.push(normal3);
            }
            for (var i = 0; i < VecNormal.length; i++) {
                DrawTrace.Nor.array[DrawTrace.pointCount * 3 - (VecNormal.length - i) * 3] = VecNormal[i].x;
                DrawTrace.Nor.array[DrawTrace.pointCount * 3 - (VecNormal.length - i) * 3 + 1] = VecNormal[i].y;
                DrawTrace.Nor.array[DrawTrace.pointCount * 3 - (VecNormal.length - i) * 3 + 2] = VecNormal[i].z;
            }
            if (DrawTrace.Paper == false) {
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 8] = AnchorF + 0.5;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 7] = AnchorF - 0.3;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 6] = AnchorF - 0.3;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 5] = 1;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 4] = AnchorF + 0.5;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 3] = AnchorF - 0.3;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 2] = AnchorF - 0.3;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 1] = 1;
            }
            else if (DrawTrace.Paper == true) {
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 8] = 0.5;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 7] = 0.5;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 6] = 0.5;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 5] = 0.5;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 4] = 0.5;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 3] = 0.5;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 2] = 0.5;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 1] = 0.5;
            }
        }
    }
    else if(Gate == 9 || Gate == 10){
        var AnchorF = Math.abs(AnchorAcc.X) + Math.abs(AnchorAcc.Y) + Math.abs(AnchorAcc.Z);
        if (AnchorF > 8) {
            AnchorF = 1;
        }
        else if (AnchorF < 1) {
            AnchorF = 0;
        }
        else {
            AnchorF = AnchorF / 8;
        }
        if (DrawColle.length == 3) {
            for (var i = 0; i < DrawTrace.Pos.array.length - 6; i++) {
                DrawTrace.Pos.array[i] = DrawTrace.Pos.array[i + 6];
                DrawTrace.Nor.array[i] = DrawTrace.Nor.array[i + 6];
            }
            for (var i = 0; i < DrawTrace.Col.array.length - 8; i++) {
                DrawTrace.Col.array[i] = DrawTrace.Col.array[i + 8];
            }
            DrawTrace.Pos.array[DrawTrace.DrawCount * 6 - 6] = DrawColle[0] * 400;
            DrawTrace.Pos.array[DrawTrace.DrawCount * 6 - 5] = DrawColle[1] * 400;
            DrawTrace.Pos.array[DrawTrace.DrawCount * 6 - 4] = DrawColle[2] * 400;
            var drawX = 25 / Math.pow(Math.abs(AnchorAcc.X), 0.5);
            var drawY = 25 / Math.pow(Math.abs(AnchorAcc.Y), 0.5);
            var drawZ = 25 / Math.pow(Math.abs(AnchorAcc.Z), 0.5);
            if (drawX > 100) drawX = 100;
            if (drawY > 100) drawY = 100;
            if (drawZ > 100) drawZ = 100;
            if (drawX < 25) drawX = 25;
            if (drawY < 25) drawY = 25;
            if (drawZ < 25) drawZ = 25;
            DrawTrace.Pos.array[DrawTrace.DrawCount * 6 - 3] = DrawColle[0] * 400 + drawX;
            DrawTrace.Pos.array[DrawTrace.DrawCount * 6 - 2] = DrawColle[1] * 400 + drawY;
            DrawTrace.Pos.array[DrawTrace.DrawCount * 6 - 1] = DrawColle[2] * 400 + drawZ;
            var Vec1 = new THREE.Vector3(DrawTrace.Pos.array[(DrawTrace.DrawCount - 1) * 6 - 6], DrawTrace.Pos.array[(DrawTrace.DrawCount - 1) * 6 - 5], DrawTrace.Pos.array[(DrawTrace.DrawCount - 1) * 6 - 4]);
            var Vec2 = new THREE.Vector3(DrawTrace.Pos.array[(DrawTrace.DrawCount - 1) * 6 - 3], DrawTrace.Pos.array[(DrawTrace.DrawCount - 1) * 6 - 2], DrawTrace.Pos.array[(DrawTrace.DrawCount - 1) * 6 - 1]);
            var Vec3 = new THREE.Vector3(DrawTrace.Pos.array[DrawTrace.DrawCount * 6 - 6], DrawTrace.Pos.array[DrawTrace.DrawCount * 6 - 5], DrawTrace.Pos.array[DrawTrace.DrawCount * 6 - 4]);
            var Vec4 = new THREE.Vector3(DrawTrace.Pos.array[DrawTrace.DrawCount * 6 - 3], DrawTrace.Pos.array[DrawTrace.DrawCount * 6 - 2], DrawTrace.Pos.array[DrawTrace.DrawCount * 6 - 1]);
            var VecBase = [Vec2, Vec1, Vec3, Vec2, Vec3, Vec4];
            var VecNormal = []
            for (var i = 0; i < VecBase.length / 3; i++) {
                var Vec1 = new THREE.Vector3(VecBase[3 * i].x - VecBase[3 * i + 1].x, VecBase[3 * i].y - VecBase[3 * i + 1].y, VecBase[3 * i].z - VecBase[3 * i + 1].z);
                var Vec2 = new THREE.Vector3(VecBase[3 * i + 1].x - VecBase[3 * i + 2].x, VecBase[3 * i + 1].y - VecBase[3 * i + 2].y, VecBase[3 * i + 1].z - VecBase[3 * i + 2].z);
                var Vec3 = new THREE.Vector3(VecBase[3 * i].x - VecBase[3 * i + 2].x, VecBase[3 * i].y - VecBase[3 * i + 2].y, VecBase[3 * i].z - VecBase[3 * i + 2].z);
                var normal1 = new THREE.Vector3();
                var normal2 = new THREE.Vector3();
                var normal3 = new THREE.Vector3();
                normal1.crossVectors(Vec1, Vec3);
                normal2.crossVectors(Vec1, Vec2);
                normal3.crossVectors(Vec3, Vec2);
                VecNormal.push(normal1);
                VecNormal.push(normal2);
                VecNormal.push(normal3);
            }
            for (var i = 0; i < VecNormal.length; i++) {
                DrawTrace.Nor.array[DrawTrace.pointCount * 3 - (VecNormal.length - i) * 3] = VecNormal[i].x;
                DrawTrace.Nor.array[DrawTrace.pointCount * 3 - (VecNormal.length - i) * 3 + 1] = VecNormal[i].y;
                DrawTrace.Nor.array[DrawTrace.pointCount * 3 - (VecNormal.length - i) * 3 + 2] = VecNormal[i].z;
            }
            if (DrawTrace.Paper == false) {
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 8] = AnchorF + 0.5;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 7] = AnchorF - 0.3;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 6] = AnchorF - 0.3;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 5] = 1;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 4] = AnchorF + 0.5;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 3] = AnchorF - 0.3;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 2] = AnchorF - 0.3;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 1] = 1;
            }
            else if (DrawTrace.Paper == true) {
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 8] = 0.5;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 7] = 0.5;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 6] = 0.5;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 5] = 0.5;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 4] = 0.5;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 3] = 0.5;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 2] = 0.5;
                DrawTrace.Col.array[DrawTrace.DrawCount * 8 - 1] = 0.5;
            }
        }
    }
}
function CtrlField(ControlColle,Index,ControlOutput){
    var CtrlPart;
    if(Index == 0){
        CtrlPart = rightWrist;
    }
    else if(Index == 1){
        CtrlPart = leftWrist;
    }
    if(ControlColle.length < 50){
        ControlColle.push(CtrlPart);
    }
    else{
        ControlColle.shift()
        ControlColle.push(CtrlPart);
        var XSum = 0;
        var YSum = 0;
        var ZSum = 0;
        var XD = [];
        var YD = [];
        var ZD = [];
        for(var i = 0 ; i < ControlColle.length ; i++){
            XSum += ControlColle[i].X;
            YSum += ControlColle[i].Y;
            ZSum += ControlColle[i].Z;
            XD.push(ControlColle[i].X);
            YD.push(ControlColle[i].Y);
            ZD.push(ControlColle[i].Z);
        }
        var XDt = stdDeviation(XD);
        var YDt = stdDeviation(YD);
        var ZDt = stdDeviation(ZD);
        if(XDt + YDt + ZDt > 180){
            NodeTrigger[Index] = 1;
        }
        else{
            NodeTrigger[Index] = 0;
        }
        ControlOutput.X = XSum / ControlColle.length;
        ControlOutput.Y = YSum / ControlColle.length;
        ControlOutput.Z = ZSum / ControlColle.length;
    }
}

function DrawCut(){
    if(Gate == 0){
        var CutCount = 5;
        var CutPtCount=CutCount*1*3;
        this.Geo = new THREE.BufferGeometry();
        this.CutCount = CutCount;
        this.CutPtCount = CutPtCount;
        this.Pos = new THREE.BufferAttribute( new Float32Array( CutPtCount * 3 ), 3 );
        this.Col = new THREE.BufferAttribute( new Float32Array( CutPtCount * 4 ), 4 );
        this.Nor = new THREE.BufferAttribute( new Float32Array( CutPtCount * 3 ), 3 );
        this.Material = new THREE.MeshPhongMaterial( {
            color: 0xffffff, specular: 0xffffff , shininess: 250 , side: THREE.DoubleSide, vertexColors: THREE.VertexColors, shading: THREE.FlatShading,
        } );
        this.CutVecColle = [];
        this.CutVecPt = 0;
    }
    else if(Gate == 1){
        var Count = 4;
        this.Geo1 = [];
        for(var i = 0; i < Count;i++){
            this.Geo1.push(new THREE.PlaneBufferGeometry( 1200, 1200 ));
        }
        var map00 = THREE.ImageUtils.loadTexture( "./img/S00Ink.png" );
        var map01 = THREE.ImageUtils.loadTexture( "./img/S01Ink.png" );
        var map02 = THREE.ImageUtils.loadTexture( "./img/S02Ink.png" );
        var map03 = THREE.ImageUtils.loadTexture( "./img/S03Ink.png" );
        var map1Colle = [map00,map01,map02,map03]
        var map1Sel;
        var Dice1 = Math.random();
        if(Dice1<0.25){
            map1Sel = map1Colle[0];
        }
        else if(Dice1>=0.25 && Dice1<0.5){
            map1Sel = map1Colle[1];
        }
        else if(Dice1>=0.5 && Dice1<0.75){
            map1Sel = map1Colle[2];
        }
        else if(Dice1>=0.75){
            map1Sel = map1Colle[3];
        }
        this.Material1 = [];
        for(var i = 0; i < Count;i++){
            var material = new THREE.MeshBasicMaterial( { map: map1Sel } );
            material.transparent = true;
            material.blending = THREE[ "NormalBlending" ];
            this.Material1.push(material);
        }
        this.Map1Colle = map1Colle;
        this.Mesh1 = [];
        for(var i = 0; i < Count;i++){
            this.Mesh1.push(new THREE.Mesh( this.Geo1[i], this.Material1[i] ));
        }
        this.CutVecColle = [];
        this.CutVecPt = 0;
        this.Count = Count;
    }
}
function DrawCutCreate(DrawCut,scene){
    if(Gate == 0){
        for ( var i = 0; i < DrawCut.Pos.length/3; i ++ ) {
            DrawCut.Pos.setXYZ( i,  0 , 0 , 0  );
            DrawCut.Nor.setXYZ( i,  0 , 0 , 0  );
        }
        for ( var i = 0; i < DrawCut.Col.length/4; i ++ ) {
            DrawCut.Col.setXYZW( i,  1 , 0 , 0 , 1);
        }
        DrawCut.Geo.addAttribute( 'position', DrawCut.Pos );
        DrawCut.Geo.addAttribute( 'normal', DrawCut.Nor );
        DrawCut.Geo.addAttribute( 'color', DrawCut.Col );
        var DrawCutFin = new THREE.Mesh( DrawCut.Geo, DrawCut.Material );
        scene.add( DrawCutFin );
    }
    else if(Gate == 1){
        for(var i = 0; i < DrawCut.Count;i++) {
            DrawCut.Mesh1[i].position.set( 5000, 5000, 300 );
            scene.add( DrawCut.Mesh1[i] );
        }
    }
}
function DrawCutDynamic(AnchorAcc,AnchorP,DrawCut,DrawColle){
    if(Gate == 0 ){
        var AnchorAccF = Math.abs(AnchorAcc.X) + Math.abs(AnchorAcc.Y);
        if(AnchorAccF > 6){
            DrawCut.CutVecColle.push(AnchorAcc);
            DrawCut.CutVecPt = DrawColle;
        }
        else{
            if(DrawCut.CutVecColle.length != 0) {
                cut0Draw();
            }
        }
        for ( var i = 0; i < DrawCut.Col.length/4; i ++ ) {
            if(DrawCut.Col.array[ i*4 + 1] < 0.8) DrawCut.Col.array[ i*4 + 1] += 0.01;
            if(DrawCut.Col.array[ i*4 + 2] < 0.8) DrawCut.Col.array[ i*4 + 2] += 0.01;
        }
        function cut0Draw(){
            var SumX = DrawCut.CutVecPt[0];
            var SumY = DrawCut.CutVecPt[1];
            var SumZ = DrawCut.CutVecPt[2];
            for ( var i = 0; i < DrawCut.CutVecColle.length ; i ++ ) {
                SumX += DrawCut.CutVecColle[i].X;
                SumY += DrawCut.CutVecColle[i].Y;
                SumZ += DrawCut.CutVecColle[i].Z;
            }
            var CutVecPtEd = [25*SumX,25*SumY,25*SumZ + 400];
            var CutVecPtst = [DrawCut.CutVecPt[0]-25*SumX,DrawCut.CutVecPt[1]-25*SumY,DrawCut.CutVecPt[2]-25*SumZ + 400];
            var CutVecPtMid = [(SumX + DrawCut.CutVecPt[0])/2 + 2*DrawCut.CutVecColle.length,
                (SumY + DrawCut.CutVecPt[1])/2 + 2*DrawCut.CutVecColle.length,
                (SumZ + DrawCut.CutVecPt[2])/2 + 2*DrawCut.CutVecColle.length + 400];
            var CutPtColle = [CutVecPtst,CutVecPtMid,CutVecPtEd];
            for ( var i = 0; i < DrawCut.Pos.array.length - 9; i ++ ) {
                DrawCut.Pos.array[ i ] = DrawCut.Pos.array[ i+9 ];
            }
            for ( var i = 0; i < DrawCut.Col.array.length - 12; i ++ ) {
                DrawCut.Col.array[ i ] =  DrawCut.Col.array[ i+12 ];
            }
            for ( var i = 0; i < CutPtColle.length; i ++ ) {
                DrawCut.Pos.array[ DrawCut.CutPtCount*3-(3-i)*3 ]    = CutPtColle[i][0] + AnchorP.X;
                DrawCut.Pos.array[ DrawCut.CutPtCount*3-(3-i)*3 + 1] = CutPtColle[i][1] + AnchorP.Y;
                DrawCut.Pos.array[ DrawCut.CutPtCount*3-(3-i)*3 + 2] = CutPtColle[i][2] + 400;
            }
            for ( var i = 0; i < CutPtColle.length; i ++ ) {
                DrawCut.Col.array[ DrawCut.CutPtCount*4 - (3-i)*4 ]    = 1;
                DrawCut.Col.array[ DrawCut.CutPtCount*4 - (3-i)*4 + 1] = 0;
                DrawCut.Col.array[ DrawCut.CutPtCount*4 - (3-i)*4 + 2] = 0;
                DrawCut.Col.array[ DrawCut.CutPtCount*4 - (3-i)*4 + 3] = 1;
            }
            DrawCut.CutVecColle = [];
            DrawCut.CutVecPt = 0;
        }
    }
    else if(Gate == 1 ){
        var AnchorAccF = Math.abs(AnchorAcc.X) + Math.abs(AnchorAcc.Y);
        if(AnchorAccF > 6){
            DrawCut.CutVecColle.push(AnchorAcc);
            DrawCut.CutVecPt = DrawColle;
        }
        else{
            if(DrawCut.CutVecColle.length != 0) {
                cut1Draw();
            }
        }
        function cut1Draw(){
            var SumX = DrawCut.CutVecPt[0];
            var SumY = DrawCut.CutVecPt[1];
            var SumZ = DrawCut.CutVecPt[2];
            for ( var i = 0; i < DrawCut.CutVecColle.length ; i ++ ) {
                SumX += DrawCut.CutVecColle[i].X;
                SumY += DrawCut.CutVecColle[i].Y;
                SumZ += DrawCut.CutVecColle[i].Z;
            }
            if(CutTarget > DrawCut.Count-1){
                CutTarget = 0;
            }
            DrawCut.Mesh1[CutTarget].position.set( AnchorP.X, AnchorP.Y, 350 );
            DrawCut.Mesh1[CutTarget].rotation.set( 0, 0,  SumY/SumX );
            var map1Sel;
            var Dice1 = Math.random();
            if(Dice1<0.25){
                map1Sel = DrawCut.Map1Colle[0];
            }
            else if(Dice1>=0.25 && Dice1<0.5){
                map1Sel = DrawCut.Map1Colle[1];
            }
            else if(Dice1>=0.5 && Dice1<0.75){
                map1Sel = DrawCut.Map1Colle[2];
            }
            else if(Dice1>=0.75){
                map1Sel = DrawCut.Map1Colle[3];
            }
            DrawCut.Material1[CutTarget].map = map1Sel;
            DrawCut.CutVecColle = [];
            DrawCut.CutVecPt = 0;
            CutTarget ++;
        }
    }
}

function DrawImpact(){
    if(Gate == 0){
        var Count = 2;
        this.Geo = [];
        for(var i = 0; i < Count;i++){
            this.Geo.push(new THREE.PlaneBufferGeometry( 200, 200 ));
        }
        var map00 = THREE.ImageUtils.loadTexture( "./img/00Pow.png" );
        var map01 = THREE.ImageUtils.loadTexture( "./img/01Pow.png" );
        var map02 = THREE.ImageUtils.loadTexture( "./img/02Pow.png" );
        var mapColle = [map00,map01,map02];
        var mapSel;
        var Dice = Math.random();
        if(Dice<0.33){
            mapSel = mapColle[0];
        }
        else if(Dice>=0.33 && Dice<0.67){
            mapSel = mapColle[1];
        }
        else if(Dice>=0.67){
            mapSel = mapColle[2];
        }
        this.Material = [];
        for(var i = 0; i < Count;i++){
            var material = new THREE.MeshBasicMaterial( { map: mapSel } );
            material.transparent = true;
            material.blending = THREE[ "NormalBlending" ];
            this.Material.push(material);
        }
        this.MapColle = mapColle;
        this.Mesh = [];
        for(var i = 0; i < Count;i++){
            this.Mesh.push(new THREE.Mesh( this.Geo[i], this.Material[i] ))
        }
        this.ScaleT = [];
        for(var i = 0; i < Count;i++){
            this.ScaleT.push(0.5*Math.random()+ 1.1);
        }
        this.Switch = 0;
        this.Count = Count;
    }
    else if (Gate == 1){
        var Count = 3;
        this.Geo1 = [];
        this.Geo2 = [];
        for(var i = 0; i < Count;i++){
            this.Geo1.push(new THREE.PlaneBufferGeometry( 200, 200 ));
            this.Geo2.push(new THREE.PlaneBufferGeometry( 200, 200 ));
        }
        var map00 = THREE.ImageUtils.loadTexture( "./img/00Ink.png" );
        var map01 = THREE.ImageUtils.loadTexture( "./img/01Ink.png" );
        var map02 = THREE.ImageUtils.loadTexture( "./img/02Ink.png" );
        var map03 = THREE.ImageUtils.loadTexture( "./img/03Ink.png" );
        var map1Colle = [map00,map01,map02,map03]
        var map1Sel;
        var Dice1 = Math.random();
        if(Dice1<0.25){
            map1Sel = map1Colle[0];
        }
        else if(Dice1>=0.25 && Dice1<0.5){
            map1Sel = map1Colle[1];
        }
        else if(Dice1>=0.5 && Dice1<0.75){
            map1Sel = map1Colle[2];
        }
        else if(Dice1>=0.75){
            map1Sel = map1Colle[3];
        }
        this.Material1 = [];
        for(var i = 0; i < Count;i++){
            var material = new THREE.MeshBasicMaterial( { map: map1Sel } );
            material.transparent = true;
            material.blending = THREE[ "NormalBlending" ];
            this.Material1.push(material);
        }
        this.Map1Colle = map1Colle;
        var map10 = THREE.ImageUtils.loadTexture( "./img/10Ink.png" );
        var map11 = THREE.ImageUtils.loadTexture( "./img/11Ink.png" );
        var map12 = THREE.ImageUtils.loadTexture( "./img/12Ink.png" );
        var map13 = THREE.ImageUtils.loadTexture( "./img/13Ink.png" );
        var map2Colle = [map10,map11,map12,map13]
        var map2Sel;
        var Dice2 = Math.random();
        if(Dice2<0.25){
            map2Sel = map2Colle[0];
        }
        else if(Dice2>=0.25 && Dice2<0.5){
            map2Sel = map2Colle[1];
        }
        else if(Dice2>=0.5 && Dice2<0.75){
            map2Sel = map2Colle[2];
        }
        else if(Dice2>=0.75){
            map2Sel = map2Colle[3];
        }
        this.Material2 = [];
        for(var i = 0; i < Count;i++){
            var material = new THREE.MeshBasicMaterial( { map: map2Sel } );
            material.transparent = true;
            material.blending = THREE[ "NormalBlending" ];
            this.Material2.push(material);
        }
        this.Map2Colle = map2Colle;
        this.Mesh1 = [];
        this.Mesh2 = [];
        for(var i = 0; i < Count;i++){
            this.Mesh1.push(new THREE.Mesh( this.Geo1[i], this.Material1[i] ));
            this.Mesh2.push(new THREE.Mesh( this.Geo2[i], this.Material2[i] ));
        }
        this.Switch = 0;
        this.Count = Count;
    }
}
function DrawImpactCreate(DrawImpact,scene){
    if(Gate == 0){
        for(var i = 0; i < DrawImpact.Count;i++){
            DrawImpact.Mesh[i].position.set( 5000, 5000, 300 );
            scene.add( DrawImpact.Mesh[i] );
        }
    }
    else if(Gate == 1){
        for(var i = 0; i < DrawImpact.Count;i++) {
            DrawImpact.Mesh1[i].position.set( 5000, 5000, 300 );
            scene.add( DrawImpact.Mesh1[i] );
            DrawImpact.Mesh2[i].position.set( 5000, 5000, 300 );
            scene.add( DrawImpact.Mesh2[i] );
        }
    }
}
function DrawImpactDynamic(AnchorAcc,AnchorP,DrawImpact){
    if(Gate == 0 ){
        var AnchorI = AnchorAcc.Z;
        var AnchorF = Math.abs(AnchorAcc.X) + Math.abs(AnchorAcc.Y);
        if(interval < 100) interval ++;
        if(AnchorI<-2.0 && AnchorF<4 && interval == 100){
            DrawImpact.Switch = 1;
            interval = 0;
        }
        if(DrawImpact.Switch != 0 && AnchorI > -0.2){
            imp0Draw();
            DrawImpact.Switch = 0;
        }
        impact0Spread();
        function imp0Draw(){
            var ImpOri = new THREE.Vector3();
            ImpOri.x = AnchorP.X;
            ImpOri.y = AnchorP.Y;
            ImpOri.z = AnchorP.Z;
            ImpTarget ++;
            if(ImpTarget > DrawImpact.Count-1) ImpTarget = 0;
            DrawImpact.Mesh[ImpTarget].position.set( ImpOri.x, ImpOri.y , 1200 );
            var dice = (Math.random() - 0.5 ) * 0.9;
            DrawImpact.Mesh[ImpTarget].rotation.set( 0, 0 , dice );
            DrawImpact.Mesh[ImpTarget].scale.set( 1, 1, 1 );
            var mapSel;
            var Dice = Math.random();
            if(Dice<0.33){
                mapSel = DrawImpact.MapColle[0];
            }
            else if(Dice>=0.33 && Dice<0.67){
                mapSel = DrawImpact.MapColle[1];
            }
            else if(Dice>=0.67){
                mapSel = DrawImpact.MapColle[2];
            }
            DrawImpact.Material[ImpTarget].map = mapSel;
        }
        function impact0Spread(){
            for(var i = 0 ; i < DrawImpact.Count; i++ ){
                if(DrawImpact.Mesh[i].position.z != 300){
                    if(DrawImpact.Mesh[i].position.z > 1100 ){
                        DrawImpact.Mesh[i].position.z -=1;
                    }
                    if(DrawImpact.Mesh[i].scale.x < DrawImpact.ScaleT[i] ){
                        DrawImpact.Mesh[i].scale.x +=0.005;
                        DrawImpact.Mesh[i].scale.y +=0.005;
                    }
                }
            }
        }
    }
    else if (Gate == 1 ){
        var AnchorI = AnchorAcc.Z;
        var AnchorF = Math.abs(AnchorAcc.X) + Math.abs(AnchorAcc.Y);
        if(interval < 100) interval ++;
        if(AnchorI<-2.0 && AnchorF<4 && interval == 100){
            DrawImpact.Switch = 1;
            interval = 0;
        }
        if(DrawImpact.Switch != 0 && AnchorI > -0.2){
            imp1Draw();
            DrawImpact.Switch = 0;
        }
        impact1Spread();
        function imp1Draw(){
            var ImpOri = new THREE.Vector3();
            ImpOri.x = AnchorP.X;
            ImpOri.y = AnchorP.Y;
            ImpOri.z = AnchorP.Z;
            ImpTarget ++;
            if(ImpTarget > DrawImpact.Count-1) ImpTarget = 0;
            DrawImpact.Mesh1[ImpTarget].position.set( ImpOri.x, ImpOri.y , 400 );
            DrawImpact.Mesh1[ImpTarget].scale.set( 1, 1, 1 );
            var map1Sel;
            var Dice1 = Math.random();
            if(Dice1<0.25){
                map1Sel = DrawImpact.Map1Colle[0];
            }
            else if(Dice1>=0.25 && Dice1<0.5){
                map1Sel = DrawImpact.Map1Colle[1];
            }
            else if(Dice1>=0.5 && Dice1<0.75){
                map1Sel = DrawImpact.Map1Colle[2];
            }
            else if(Dice1>=0.75){
                map1Sel = DrawImpact.Map1Colle[3];
            }
            DrawImpact.Material1[ImpTarget].map = map1Sel;
            DrawImpact.Mesh2[ImpTarget].position.set( ImpOri.x, ImpOri.y , 400 );
            DrawImpact.Mesh2[ImpTarget].scale.set( 1, 1, 1 );
            var map2Sel;
            var Dice2 = Math.random();
            if(Dice2<0.25){
                map2Sel = DrawImpact.Map2Colle[0];
            }
            else if(Dice2>=0.25 && Dice2<0.5){
                map2Sel = DrawImpact.Map2Colle[1];
            }
            else if(Dice2>=0.5 && Dice2<0.75){
                map2Sel = DrawImpact.Map2Colle[2];
            }
            else if(Dice2>=0.75){
                map2Sel = DrawImpact.Map2Colle[3];
            }
            DrawImpact.Material2[ImpTarget].map = map2Sel;
        }
        function impact1Spread(){
            for(var i = 0 ; i < DrawImpact.Count; i++ ){
                if(DrawImpact.Mesh1[i].position.z != 300){
                    if(DrawImpact.Mesh1[i].scale.x < 1.5 ){
                        DrawImpact.Mesh1[i].scale.x +=0.005;
                        DrawImpact.Mesh1[i].scale.y +=0.005;
                    }
                    if(DrawImpact.Mesh2[i].scale.x < 2.0 ){
                        DrawImpact.Mesh2[i].scale.x +=0.02;
                        DrawImpact.Mesh2[i].scale.y +=0.02;
                    }
                }
            }
        }
    }
}

function DrawExplode(){
    if(Gate == 0){
        this.Geo = new THREE.PlaneBufferGeometry( 500, 500 );
        var map00 = THREE.ImageUtils.loadTexture( "./img/03Pow.png" );
        var material1 = new THREE.MeshBasicMaterial( { map: map00 } );
        material1.transparent = true;
        material1.blending = THREE[ "NormalBlending" ];
        this.Material = material1;
        var mesh = new THREE.Mesh( this.Geo, this.Material );
        this.Mesh = mesh;
        this.Switch = 0;
    }
}
function DrawExplodeCreate(DrawExplode,scene){
    if(Gate == 0){
        DrawExplode.Mesh.position.set( 5000, 5000, 300 );
        scene.add( DrawExplode.Mesh );
    }
}
function DrawExplodeDynamic(DrawImpactColle, DrawExplode){
    if(Gate == 0){
        var ImpXColle = [];
        var ImpYColle = [];
        for(var i = 0; i <DrawImpactColle.length; i++ ){
            for(var j = 0; j <DrawImpactColle[i].Count; j++ ){
                if(DrawImpactColle[i].Mesh[j].position.z != 300){
                    ImpXColle.push(DrawImpactColle[i].Mesh[j].position.x)
                    ImpYColle.push(DrawImpactColle[i].Mesh[j].position.y)
                }
            }
        }
        if(ImpXColle.length > 4 && DrawExplode.Switch == 0){
            var EX = meanCalculation(ImpXColle);
            DrawExplode.Mesh.position.set( EX, 0 , 1050 );
            var dice = (Math.random() - 0.5 ) * 2;
            DrawExplode.Mesh.rotation.set( 0, 0 , dice );
            DrawExplode.Mesh.scale.set( 1, 1, 1 );
            DrawExplode.Switch = 1;
            for(var i = 0; i <DrawImpactColle.length; i++ ){
                for(var j = 0; j <DrawImpactColle[i].Count; j++ ){
                    DrawImpactColle[i].Mesh[j].position.set( 5000, 5000, 300 );
                }
            }
        }
        if(DrawExplode.Switch == 1){
            if(DrawExplode.Mesh.scale.x < 1.5 ){
                DrawExplode.Mesh.scale.x +=0.005;
                DrawExplode.Mesh.scale.y +=0.005;
            }
            else{
                interval2 --;
                if(interval2 < 0){
                    DrawExplode.Mesh.position.set( 5000, 5000, 300 );
                    DrawExplode.Switch = 0;
                    interval2 = 75;
                }
            }
        }
    }
}

function NodeMulti(suffix,FrameCount,PtCount){
    if(suffix == 0){
        var NodeIndices = new THREE.BufferAttribute(new Uint32Array( (FrameCount*2-2) * PtCount ),1);
        for ( var i = 0; i < (FrameCount*2-2) * PtCount; i ++ ) {
            NodeIndices.array[i] = parseInt(i/(FrameCount*2-2)) + Math.round((i%(FrameCount*2-2))/2) * PtCount;
        }
    }
    else if(suffix == 1){
        var NodeIndices = new THREE.BufferAttribute(new Uint32Array( (FrameCount*2-2) * PtCount ),1);
        for ( var i = 0; i < FrameCount*Math.sqrt(PtCount)*( Math.sqrt(PtCount)*2 - 2); i ++ ) {
            var a = parseInt(i/(Math.sqrt(PtCount)*( Math.sqrt(PtCount)*2 - 2)));
            var aSub = i%(Math.sqrt(PtCount)*( Math.sqrt(PtCount)*2 - 2));
            var b = parseInt(aSub/( Math.sqrt(PtCount)*2 - 2));
            var bSub = aSub%( Math.sqrt(PtCount)*2 - 2);
            var c = Math.round(bSub/2);
            NodeIndices.array[i] =  a*PtCount + b*Math.sqrt(PtCount) + c;
        }
    }
    else if(suffix == 2){
        var NodeIndices = new THREE.BufferAttribute(new Uint32Array( (FrameCount*2-2) * PtCount ),1);
        for ( var i = 0; i < FrameCount * (PtCount * 2 - 2*Math.sqrt(PtCount)); i ++ ) {
            var a = parseInt(i/ (PtCount * 2 - 2*Math.sqrt(PtCount)));
            var aSub = i%(PtCount * 2 - 2*Math.sqrt(PtCount));
            var b = parseInt(aSub/( Math.sqrt(PtCount)*4 - 4 ));
            var bSub = aSub%( Math.sqrt(PtCount)*4 - 4 );
            var c = Math.ceil(bSub/4) + Math.ceil(((bSub%4)%3)/2)*Math.sqrt(PtCount)
            NodeIndices.array[i] =  a*PtCount + b*( Math.sqrt(PtCount)*2) + c;
        }
    }
    else if(suffix == 3){
        var NodeIndices = new THREE.BufferAttribute(new Uint32Array( (FrameCount*2-2) * PtCount ),1);
        for ( var i = 0; i < FrameCount * (PtCount * 2 - 2*Math.sqrt(PtCount)); i ++ ) {
            var a = parseInt(i/ (PtCount * 2 - 2*Math.sqrt(PtCount)));
            var aSub = i%(PtCount * 2 - 2*Math.sqrt(PtCount));
            var b = parseInt(aSub/( Math.sqrt(PtCount)*2 - 2 ));
            var bSub = aSub%( Math.sqrt(PtCount)*2 - 2 );
            var c = Math.round(bSub/2)*Math.sqrt(PtCount);
            NodeIndices.array[i] =  a*PtCount + b + c;
        }
    }
    this.Geo = new THREE.BufferGeometry();
    this.Pos = new THREE.BufferAttribute( new Float32Array( FrameCount * PtCount * 3 ), 3 );
    this.PosCur = new THREE.BufferAttribute( new Float32Array( PtCount * 3 ), 3 );
    this.Col = new THREE.BufferAttribute(new Float32Array( FrameCount * PtCount * 3 ), 3 );
    this.ColCur = new THREE.BufferAttribute(new Float32Array( PtCount * 3 ), 3 );
    this.Index = NodeIndices;
    this.Material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });
    this.FrameCount = FrameCount;
    this.PtCount = PtCount;
    this.Suffix = suffix;
}
function NodeMultiCreate(NodeMulti, scene){
    if(NodeMulti.Suffix !=4){
        var k=0;
        for(var i=0; i<Math.sqrt(NodeMulti.PtCount); i++) {
            for(var j=0; j<Math.sqrt(NodeMulti.PtCount); j++) {
                NodeMulti.PosCur[ k++ ]  = i * 20 - 1000;
                NodeMulti.PosCur[ k++ ]  = j * 20 - 1000;
                NodeMulti.PosCur[ k++ ]  = 10;

                var nd=new Node(i*20-1000, j*20-1000, 0);
                if (j==0 || j==Math.sqrt(NodeMulti.PtCount)-1) {
                    nd.fixx=true;
                    nd.fixy=true;
                    nd.fixz=true;
                }
                else if (i==0 || i==Math.sqrt(NodeMulti.PtCount)-1) {
                    nd.fixx=true;
                    nd.fixy=true;
                    nd.fixz=true;
                }
                Nodes.push(nd);
            }
        }
        for(var i=0; i<Math.sqrt(NodeMulti.PtCount)-1; i++) {
            for(var j=0; j<Math.sqrt(NodeMulti.PtCount); j++) {
                var e=new Edge(Nodes[j*Math.sqrt(NodeMulti.PtCount)+i], Nodes[j*Math.sqrt(NodeMulti.PtCount)+i+1]);
                Edges.push(e);
            }
        }
        for(var i=0; i<Math.sqrt(NodeMulti.PtCount); i++) {
            for(var j=0; j<Math.sqrt(NodeMulti.PtCount)-1; j++) {
                var e=new Edge(Nodes[j*Math.sqrt(NodeMulti.PtCount)+i], Nodes[(j+1)*Math.sqrt(NodeMulti.PtCount)+i]);
                Edges.push(e);
            }
        }
    }
    else{
        var k=0;
        for(var i=0; i<Math.sqrt(NodeMulti.PtCount); i++) {
            for(var j=0; j<Math.sqrt(NodeMulti.PtCount); j++) {
                NodeMulti.PosCur[ k++ ]  = i * 20 - 1000;
                var variation = parseInt(((Math.sqrt(NodeMulti.PtCount)*i + j)%(Math.sqrt(NodeMulti.PtCount)*8))/Math.sqrt(NodeMulti.PtCount));
                var fList = [0, 8.5, 10, 8.5, 0, -8.5, -10, -8.5];
                var f = fList[variation];
                NodeMulti.PosCur[ k++ ]  = j * 20 - 1000 + f;
                NodeMulti.PosCur[ k++ ]  = 10;
                var nd=new Node(i*20-1000, j*20-1000 + f, 0);
                if (j==0 || j==Math.sqrt(NodeMulti.PtCount)-1) {
                    nd.fixx=true;
                    nd.fixy=true;
                    nd.fixz=true;
                }
                else if (i==0 || i==Math.sqrt(NodeMulti.PtCount)-1) {
                    nd.fixx=true;
                    nd.fixy=true;
                    nd.fixz=true;
                }
                Nodes.push(nd);
            }
        }
        for(var i=0; i<Math.sqrt(NodeMulti.PtCount)-1; i++) {
            for(var j=0; j<Math.sqrt(NodeMulti.PtCount); j++) {
                var e=new Edge(Nodes[j*Math.sqrt(NodeMulti.PtCount)+i], Nodes[j*Math.sqrt(NodeMulti.PtCount)+i+1]);
                Edges.push(e);
            }
        }
        for(var i=0; i<Math.sqrt(NodeMulti.PtCount); i++) {
            for(var j=0; j<Math.sqrt(NodeMulti.PtCount)-1; j++) {
                var e=new Edge(Nodes[j*Math.sqrt(NodeMulti.PtCount)+i], Nodes[(j+1)*Math.sqrt(NodeMulti.PtCount)+i]);
                Edges.push(e);
            }
        }
    }
    var color = new THREE.Color(200, 200, 200);
    for ( var i = 0; i < NodeMulti.ColCur.length/3; i ++ ) {
        NodeMulti.ColCur[ 3*i ]     = color.r;
        NodeMulti.ColCur[ 3*i + 1 ] = color.g;
        NodeMulti.ColCur[ 3*i + 2 ] = color.b;
        NodeData.push({
            velocity: new THREE.Vector3( 0,0,0 )
        });
    }
    for ( var i = 0; i < NodeMulti.FrameCount; i ++ ) {
        for ( var j = 0; j < NodeMulti.PosCur.length; j ++ ) {
            NodeMulti.Pos[i*NodeMulti.PosCur.length + j] = NodeMulti.PosCur[j];
            NodeMulti.Col[i*NodeMulti.ColCur.length + j] = NodeMulti.ColCur[j];
        }
    }
    NodeMulti.Geo.addAttribute( 'position', NodeMulti.Pos );
    NodeMulti.Geo.addAttribute( 'index', NodeMulti.Index );
    NodeMulti.Geo.addAttribute( 'color', NodeMulti.Col );
    NodeMulti.Geo.computeBoundingSphere();
    var NodeMultiFin = new THREE.Line( NodeMulti.Geo, NodeMulti.Material, THREE.LinePieces );
    scene.add( NodeMultiFin );
}
function NodeMultiDynamic(NodeMulti,Mode){
    for ( var i = 0; i < NodeMulti.PtCount; i++ ) {
        Nodes[i].fx=0.0;
        Nodes[i].fy=0.0;
        Nodes[i].fz=0.0;
    }
    for(var i=0; i<Edges.length; ++i) {
        Edges[i].ApplySpringForce();
    }
    var disAcc1 = Math.sqrt(rightWristAcc.X * rightWristAcc.X + rightWristAcc.Y * rightWristAcc.Y + rightWristAcc.Z * rightWristAcc.Z);
    var disAcc2 = Math.sqrt(leftWristAcc.X * leftWristAcc.X + leftWristAcc.Y * leftWristAcc.Y + leftWristAcc.Z * leftWristAcc.Z);
    for ( var i = 0; i < NodeMulti.PtCount; i++ ) {
        var nd  =  Nodes[i];
        var fx1 =  ControlOutput[0].X - nd.x;
        var fy1 =  ControlOutput[0].Y - nd.y;
        var fz1 =  ControlOutput[0].Z - nd.z;
        var fx2 =  ControlOutput[1].X - nd.x;
        var fy2 =  ControlOutput[1].Y - nd.y;
        var fz2 =  ControlOutput[1].Z - nd.z;
        var dsq1=fx1 * fx1 + fy1 * fy1;
        var dsq2=fx2 * fx2 + fy2 * fy2;
        var dist1= Math.sqrt(fx1 * fx1 + fy1 * fy1 + fz1 * fz1);
        var dist2= Math.sqrt(fx2 * fx2 + fy2 * fy2 + fz2 * fz2);
        //both attract
        if(NodeTrigger[1] == 0 && NodeTrigger[0]  == 0){
            if(dist1 >= dist2){
                var dsq = dsq2;
                var dist = dist2;
                var fxTemp = fx2;
                var fyTemp = fy2;
                var fzTemp = fz2;
            }
            else{
                var dsq = dsq1;
                var dist = dist1;
                var fxTemp = fx1;
                var fyTemp = fy1;
                var fzTemp = fz1;
            }
            var ff=30.0*Math.exp(-0.00015*dsq);
            if (dist!=0) ff/=dist;
            var fx=fxTemp*ff;
            var fy=fyTemp*ff;
            var fz=fzTemp*ff;
        }
        //both release
        else if (NodeTrigger[1] == 1 && NodeTrigger[0]  == 1){
            if(dist1>=dist2){
                var dsq = dsq2;
                var TempAcc = leftWristAcc;
            }
            else{
                var dsq = dsq1;
                var TempAcc = rightWristAcc;
            }
            var ff=100.0*Math.exp(-0.00005*dsq);
            var fx=TempAcc.X*ff;
            var fy=TempAcc.Y*ff;
            var fz=TempAcc.Z*ff;
        }
        //one release one attract
        else if (NodeTrigger[1] == 1 && NodeTrigger[0]  == 0){
            if(dist1>=dist2){
                var dsq = dsq2;
                var TempAcc = leftWristAcc;
                var ff=100.0*Math.exp(-0.00005*dsq);
                var fx=TempAcc.X*ff;
                var fy=TempAcc.Y*ff;
                var fz=TempAcc.Z*ff;
            }
            else{
                var dsq = dsq1;
                var dist = dist1;
                var fxTemp = fx1;
                var fyTemp = fy1;
                var fzTemp = fz1;
                var ff=30.0*Math.exp(-0.00015*dsq);
                if (dist!=0) ff/=dist;
                var fx=fxTemp*ff;
                var fy=fyTemp*ff;
                var fz=fzTemp*ff;
            }
        }
        else if (NodeTrigger[1] == 0 && NodeTrigger[0]  == 1){
            if(dist1>=dist2){
                var dsq = dsq2;
                var dist = dist2;
                var fxTemp = fx2;
                var fyTemp = fy2;
                var fzTemp = fz2;
                var ff=30.0*Math.exp(-0.00015*dsq);
                if (dist!=0) ff/=dist;
                var fx=fxTemp*ff;
                var fy=fyTemp*ff;
                var fz=fzTemp*ff;
            }
            else{
                var dsq = dsq1
                var TempAcc = rightWristAcc
                var ff=100.0*Math.exp(-0.00005*dsq);
                var fx=TempAcc.X*ff;
                var fy=TempAcc.Y*ff;
                var fz=TempAcc.Z*ff;
            }
        }

        if(Mode == 0){
            nd.fx+=fx;
            nd.fy+=fy;
            nd.fz+=fz;
            nd.Move(0.8, 0.5);
        }
        else if(Mode == 1){
            nd.fx+=fx;
            nd.fy+=fy/100;
            nd.fz+=fz;
            nd.Move(0.8, 0.5);
        }
        else if(Mode == 2){
            nd.fx+=fx/100;
            nd.fy+=fy;
            nd.fz+=fz;
            nd.Move(0.8, 0.5);
        }
        else if(Mode == 3){
            nd.fx+=fx;
            nd.fy+=fy/100;
            nd.fz+=fz;
            nd.Move(0.1, 0.5);
        }
        NodeMulti.PosCur.array[i*3]=nd.x;
        NodeMulti.PosCur.array[i*3+1]=nd.y;
        NodeMulti.PosCur.array[i*3+2]=nd.z;
    }
    for ( var i = 0; i < NodeMulti.Pos.length - NodeMulti.PosCur.length; i ++ ) {
        NodeMulti.Pos.array[i] = NodeMulti.Pos.array[i + NodeMulti.PosCur.length];
        NodeMulti.Col.array[i] = NodeMulti.Col.array[i + NodeMulti.ColCur.length];
    }
    for ( var i = 0; i < NodeMulti.PosCur.length; i ++ ) {
        NodeMulti.Pos.array[ NodeMulti.Pos.length - NodeMulti.PosCur.length + i ] = NodeMulti.PosCur.array[i];
        NodeMulti.Col.array[ NodeMulti.Col.length - NodeMulti.ColCur.length + i ] = 0.8;
    }

    for ( var i = 0; i < NodeMulti.Col.length/3; i ++ ) {
        if(NodeMulti.Col.array[3*i]>0.3)NodeMulti.Col.array[3*i] -=  0.02;
        if(NodeMulti.Col.array[3*i+1]>0.3)NodeMulti.Col.array[3*i+1] -= 0.02;
        if(NodeMulti.Col.array[3*i+2]>0.3)NodeMulti.Col.array[3*i+2] -= 0.02;
    }
}

function SkeMesh(Suffix, FrameCount, MeshType) {
    if(Gate != 9 && Gate != 10){
        if (Suffix == 0) {
            var SkeStruct1 = [8, 1, 10, 10, 1, 12, 10, 12, 16, 10, 16, 11, 12, 13, 16];
            var SkeStruct2 = [3, 4, 5, 3, 5, 20];
            var SubStruct1 = [5, 7, 5.5];
            var SubStruct2 = [13, 14, 13.5];
            var SubStruct3 = [17, 18, 17.5];
            var SkeStruct = [SkeStruct1, SkeStruct2, SubStruct1, SubStruct2, SubStruct3];
            var StructFlatTempt = SkeStruct1.concat(SkeStruct2, SubStruct1);
            var StructFlat = StructFlatTempt.concat(SubStruct2, SubStruct3);
            var IndexStruct = [];
            for (var i = 0; i < StructFlat.length; i++) {
                IndexStruct.push(i);
            }
            var Index = new THREE.BufferAttribute(new Uint32Array(IndexStruct.length), 1);
            for (var i = 0; i < IndexStruct.length; i++) {
                Index.array[i] = IndexStruct[i];
            }
            var PtCount = StructFlat.length;
            this.Geo = new THREE.BufferGeometry();
            this.Pos = new THREE.BufferAttribute(new Float32Array(FrameCount * PtCount * 3), 3);
            this.Nor = new THREE.BufferAttribute(new Float32Array(FrameCount * PtCount * 3), 3);
            this.Col = new THREE.BufferAttribute(new Float32Array(FrameCount * PtCount * 4), 4);
            this.ColH = new THREE.BufferAttribute(new Float32Array(FrameCount * PtCount * 4), 4);
            this.Index = Index;
            this.Struct = StructFlat;
            this.FrameCount = FrameCount;
            this.PtCount = PtCount;
            this.Hybrid = false;
            this.Count = PtCount * FrameCount;
            if (FrameCount == 1) {
                this.Material = new THREE.MeshPhongMaterial( {
                    color: 0xaaaaaa, specular: 0xffffff , shininess: 250 , side: THREE.DoubleSide, vertexColors: THREE.VertexColors, shading: THREE.FlatShading
                } );
            }
            else {
                if (MeshType == false) {
                    this.Material = new THREE.MeshPhongMaterial({
                        color: 0xaaaaaa,
                        specular: 0xffffff,
                        shininess: 250,
                        side: THREE.DoubleSide,
                        vertexColors: THREE.VertexColors,
                        shading: THREE.FlatShading,
                        wireframe: true,
                        wireframeLinewidth: 10
                    });
                }
                if (MeshType == true) {
                    this.Material = new THREE.MeshPhongMaterial({
                        color: 0xaaaaaa,
                        specular: 0xffffff,
                        shininess: 250,
                        side: THREE.DoubleSide,
                        vertexColors: THREE.VertexColors,
                        shading: THREE.FlatShading
                    });
                }
            }
        }
        else if (Suffix == 1) {
            var SkeStruct1 = [7, 0, 9];
            var SkeStruct2 = [5, 0, 11];
            var SkeStruct3 = [0, 12, 13, 0, 13, 17, 0, 17, 16];
            var SubStruct1 = [14, 13, 12, 0, 9, 8, 7];
            var SubStruct2 = [18, 17, 16, 0, 5, 4, 11];
            var StructFlat = SkeStruct1.concat(SkeStruct2, SkeStruct3);
            var StructSubFlat = SubStruct1.concat(SubStruct2);
            var IndexStruct = [];
            var IndexSubStruct = [];
            for (var i = 0; i < StructFlat.length; i++) {
                IndexStruct.push(i);
            }
            var Index = new THREE.BufferAttribute(new Uint32Array(IndexStruct.length), 1);
            for (var i = 0; i < IndexStruct.length; i++) {
                Index.array[i] = IndexStruct[i];
            }
            for (var i = 0; i < StructSubFlat.length; i++) {
                IndexSubStruct.push(i);
            }
            var IndexSub = new THREE.BufferAttribute(new Uint32Array(IndexSubStruct.length), 1);
            for (var i = 0; i < IndexSubStruct.length; i++) {
                IndexSub.array[i] = IndexSubStruct[i];
            }
            var PtCount = StructFlat.length;
            var PtSubCount = StructSubFlat.length;
            this.Geo = new THREE.BufferGeometry();
            this.GeoSub = new THREE.BufferGeometry();
            this.Pos = new THREE.BufferAttribute(new Float32Array(FrameCount * PtCount * 3), 3);
            this.Nor = new THREE.BufferAttribute(new Float32Array(FrameCount * PtCount * 3), 3);
            this.Col = new THREE.BufferAttribute(new Float32Array(FrameCount * PtCount * 4), 4);
            this.ColH = new THREE.BufferAttribute(new Float32Array(FrameCount * PtCount * 4), 4);
            this.PosSub = new THREE.BufferAttribute(new Float32Array(FrameCount * PtSubCount * 3), 3);
            this.ColSub = new THREE.BufferAttribute(new Float32Array(FrameCount * PtSubCount * 4), 4);
            this.ColHSub = new THREE.BufferAttribute(new Float32Array(FrameCount * PtSubCount * 4), 4);
            this.Index = Index;
            this.IndexSub = IndexSub;
            this.Struct = StructFlat;
            this.StructSub = StructSubFlat;
            this.FrameCount = FrameCount;
            this.PtCount = PtCount;
            this.PtSubCount = PtSubCount;
            this.Hybrid = true;
            this.Count = PtCount * FrameCount;
            this.CountSub = PtSubCount * FrameCount;
            this.Material = new THREE.MeshPhongMaterial({
                color: 0xaaaaaa,
                specular: 0xffffff,
                shininess: 250,
                side: THREE.DoubleSide,
                vertexColors: THREE.VertexColors,
                shading: THREE.FlatShading
            });
            this.MaterialSub = new THREE.LineBasicMaterial({vertexColors: THREE.VertexColors});
        }
        else if (Suffix == 2) {
            var SkeStruct1 = [7, 13, 12];
            var SkeStruct2 = [16, 17, 11];
            var SubStruct1 = [14, 5, 4];
            var SubStruct2 = [18, 9, 8];
            var SubStruct3 = [12, 7, 3, 11, 16];
            var StructFlat = SkeStruct1.concat(SkeStruct2);
            var StructSubFlat = SubStruct1.concat(SubStruct2, SubStruct3);
            var IndexStruct = [];
            var IndexSubStruct = [];
            for (var i = 0; i < StructFlat.length; i++) {
                IndexStruct.push(i);
            }
            var Index = new THREE.BufferAttribute(new Uint32Array(IndexStruct.length), 1);
            for (var i = 0; i < IndexStruct.length; i++) {
                Index.array[i] = IndexStruct[i];
            }
            for (var i = 0; i < StructSubFlat.length; i++) {
                IndexSubStruct.push(i);
            }
            var IndexSub = new THREE.BufferAttribute(new Uint32Array(IndexSubStruct.length), 1);
            for (var i = 0; i < IndexSubStruct.length; i++) {
                IndexSub.array[i] = IndexSubStruct[i];
            }
            var PtCount = StructFlat.length;
            var PtSubCount = StructSubFlat.length;
            this.Geo = new THREE.BufferGeometry();
            this.GeoSub = new THREE.BufferGeometry();
            this.Pos = new THREE.BufferAttribute(new Float32Array(FrameCount * PtCount * 3), 3);
            this.Nor = new THREE.BufferAttribute(new Float32Array(FrameCount * PtCount * 3), 3);
            this.Col = new THREE.BufferAttribute(new Float32Array(FrameCount * PtCount * 4), 4);
            this.ColH = new THREE.BufferAttribute(new Float32Array(FrameCount * PtCount * 4), 4);
            this.PosSub = new THREE.BufferAttribute(new Float32Array(FrameCount * PtSubCount * 3), 3);
            this.ColSub = new THREE.BufferAttribute(new Float32Array(FrameCount * PtSubCount * 4), 4);
            this.ColHSub = new THREE.BufferAttribute(new Float32Array(FrameCount * PtSubCount * 4), 4);
            this.Index = Index;
            this.IndexSub = IndexSub;
            this.Struct = StructFlat;
            this.StructSub = StructSubFlat;
            this.FrameCount = FrameCount;
            this.PtCount = PtCount;
            this.PtSubCount = PtSubCount;
            this.Hybrid = true;
            this.Count = PtCount * FrameCount;
            this.CountSub = PtSubCount * FrameCount;
            this.Material = new THREE.MeshPhongMaterial({
                color: 0xaaaaaa,
                specular: 0xffffff,
                shininess: 250,
                side: THREE.DoubleSide,
                vertexColors: THREE.VertexColors,
                shading: THREE.FlatShading
            });
            this.MaterialSub = new THREE.LineBasicMaterial({vertexColors: THREE.VertexColors});
        }
        else if (Suffix == 3) {
            var SkeStruct1 = [7, 0, 5];
            var SkeStruct2 = [9, 0, 11];
            var SkeStruct3 = [3, 4, 8];
            var SubStruct1 = [14, 13];
            var SubStruct2 = [18, 17];
            var StructFlat = SkeStruct1.concat(SkeStruct2, SkeStruct3);
            var StructSubFlat = SubStruct1.concat(SubStruct2);
            var IndexStruct = [];
            var IndexSubStruct = [];
            for (var i = 0; i < StructFlat.length; i++) {
                IndexStruct.push(i);
            }
            var Index = new THREE.BufferAttribute(new Uint32Array(IndexStruct.length), 1);
            for (var i = 0; i < IndexStruct.length; i++) {
                Index.array[i] = IndexStruct[i];
            }
            for (var i = 0; i < StructSubFlat.length; i++) {
                IndexSubStruct.push(i);
            }
            var IndexSub = new THREE.BufferAttribute(new Uint32Array(IndexSubStruct.length), 1);
            for (var i = 0; i < IndexSubStruct.length; i++) {
                IndexSub.array[i] = IndexSubStruct[i];
            }
            var PtCount = StructFlat.length;
            var PtSubCount = StructSubFlat.length;
            this.Geo = new THREE.BufferGeometry();
            this.GeoSub = new THREE.BufferGeometry();
            this.Pos = new THREE.BufferAttribute(new Float32Array(FrameCount * PtCount * 3), 3);
            this.Nor = new THREE.BufferAttribute(new Float32Array(FrameCount * PtCount * 3), 3);
            this.Col = new THREE.BufferAttribute(new Float32Array(FrameCount * PtCount * 4), 4);
            this.ColH = new THREE.BufferAttribute(new Float32Array(FrameCount * PtCount * 4), 4);
            this.PosSub = new THREE.BufferAttribute(new Float32Array(FrameCount * PtSubCount * 3), 3);
            this.ColSub = new THREE.BufferAttribute(new Float32Array(FrameCount * PtSubCount * 4), 4);
            this.ColHSub = new THREE.BufferAttribute(new Float32Array(FrameCount * PtSubCount * 4), 4);
            this.Index = Index;
            this.IndexSub = IndexSub;
            this.Struct = StructFlat;
            this.StructSub = StructSubFlat;
            this.FrameCount = FrameCount;
            this.PtCount = PtCount;
            this.PtSubCount = PtSubCount;
            this.Hybrid = true;
            this.Count = PtCount * FrameCount;
            this.CountSub = PtSubCount * FrameCount;
            this.Material = new THREE.MeshPhongMaterial({
                color: 0xaaaaaa,
                specular: 0xffffff,
                shininess: 250,
                side: THREE.DoubleSide,
                vertexColors: THREE.VertexColors,
                shading: THREE.FlatShading
            });
            this.MaterialSub = new THREE.LineBasicMaterial({vertexColors: THREE.VertexColors});
        }
    }
    else if(Gate == 9 || Gate == 10){
        if (Suffix == 0) {
            var SkeStruct1 = [8, 1, 10, 10, 1, 12, 10, 12, 16, 10, 16, 11, 12, 13, 16];
            var SkeStruct2 = [3, 4, 5, 3, 5, 20];
            var SubStruct1 = [5, 7, 5.5];
            var SubStruct2 = [13, 14, 13.5];
            var SubStruct3 = [17, 18, 17.5];
            var SkeStruct = [SkeStruct1, SkeStruct2, SubStruct1, SubStruct2, SubStruct3];
            var StructFlatTempt = SkeStruct1.concat(SkeStruct2, SubStruct1);
            var StructFlat = StructFlatTempt.concat(SubStruct2, SubStruct3);
            var IndexStruct = [];
            for (var i = 0; i < StructFlat.length; i++) {
                IndexStruct.push(i);
            }
            var Index = new THREE.BufferAttribute(new Uint32Array(IndexStruct.length), 1);
            for (var i = 0; i < IndexStruct.length; i++) {
                Index.array[i] = IndexStruct[i];
            }
            var PtCount = StructFlat.length;
            this.Geo = new THREE.BufferGeometry();
            this.Pos = new THREE.BufferAttribute(new Float32Array(FrameCount * PtCount * 3), 3);
            this.Nor = new THREE.BufferAttribute(new Float32Array(FrameCount * PtCount * 3), 3);
            this.Col = new THREE.BufferAttribute(new Float32Array(FrameCount * PtCount * 4), 4);
            this.ColH = new THREE.BufferAttribute(new Float32Array(FrameCount * PtCount * 4), 4);
            this.Index = Index;
            this.Struct = StructFlat;
            this.FrameCount = FrameCount;
            this.PtCount = PtCount;
            this.Hybrid = false;
            this.Count = PtCount * FrameCount;
            if (FrameCount == 1) {
                this.Material = new THREE.MeshPhongMaterial( {
                    color: 0xaaaaaa, specular: 0xffffff , shininess: 250 , side: THREE.DoubleSide, vertexColors: THREE.VertexColors, shading: THREE.FlatShading, opacity: 0.5, transparent: true
                } );
            }
            else {
                if (MeshType == false) {
                    this.Material = new THREE.MeshPhongMaterial({
                        color: 0xaaaaaa,
                        specular: 0xffffff,
                        shininess: 250,
                        side: THREE.DoubleSide,
                        vertexColors: THREE.VertexColors,
                        shading: THREE.FlatShading,
                        wireframe: true,
                        wireframeLinewidth: 10
                    });
                }
                if (MeshType == true) {
                    this.Material = new THREE.MeshPhongMaterial({
                        color: 0xaaaaaa,
                        specular: 0xffffff,
                        shininess: 250,
                        side: THREE.DoubleSide,
                        vertexColors: THREE.VertexColors,
                        shading: THREE.FlatShading
                    });
                }
            }
        }
        else if (Suffix == 1) {
            var SkeStruct1 = [7, 0, 9];
            var SkeStruct2 = [5, 0, 11];
            var SkeStruct3 = [0, 12, 13, 0, 13, 17, 0, 17, 16];
            var SubStruct1 = [14, 13, 12, 0, 9, 8, 7];
            var SubStruct2 = [18, 17, 16, 0, 5, 4, 11];
            var StructFlat = SkeStruct1.concat(SkeStruct2, SkeStruct3);
            var StructSubFlat = SubStruct1.concat(SubStruct2);
            var IndexStruct = [];
            var IndexSubStruct = [];
            for (var i = 0; i < StructFlat.length; i++) {
                IndexStruct.push(i);
            }
            var Index = new THREE.BufferAttribute(new Uint32Array(IndexStruct.length), 1);
            for (var i = 0; i < IndexStruct.length; i++) {
                Index.array[i] = IndexStruct[i];
            }
            for (var i = 0; i < StructSubFlat.length; i++) {
                IndexSubStruct.push(i);
            }
            var IndexSub = new THREE.BufferAttribute(new Uint32Array(IndexSubStruct.length), 1);
            for (var i = 0; i < IndexSubStruct.length; i++) {
                IndexSub.array[i] = IndexSubStruct[i];
            }
            var PtCount = StructFlat.length;
            var PtSubCount = StructSubFlat.length;
            this.Geo = new THREE.BufferGeometry();
            this.GeoSub = new THREE.BufferGeometry();
            this.Pos = new THREE.BufferAttribute(new Float32Array(FrameCount * PtCount * 3), 3);
            this.Nor = new THREE.BufferAttribute(new Float32Array(FrameCount * PtCount * 3), 3);
            this.Col = new THREE.BufferAttribute(new Float32Array(FrameCount * PtCount * 4), 4);
            this.ColH = new THREE.BufferAttribute(new Float32Array(FrameCount * PtCount * 4), 4);
            this.PosSub = new THREE.BufferAttribute(new Float32Array(FrameCount * PtSubCount * 3), 3);
            this.ColSub = new THREE.BufferAttribute(new Float32Array(FrameCount * PtSubCount * 4), 4);
            this.ColHSub = new THREE.BufferAttribute(new Float32Array(FrameCount * PtSubCount * 4), 4);
            this.Index = Index;
            this.IndexSub = IndexSub;
            this.Struct = StructFlat;
            this.StructSub = StructSubFlat;
            this.FrameCount = FrameCount;
            this.PtCount = PtCount;
            this.PtSubCount = PtSubCount;
            this.Hybrid = true;
            this.Count = PtCount * FrameCount;
            this.CountSub = PtSubCount * FrameCount;
            this.Material = new THREE.MeshPhongMaterial({
                color: 0xaaaaaa,
                specular: 0xffffff,
                shininess: 250,
                side: THREE.DoubleSide,
                vertexColors: THREE.VertexColors,
                shading: THREE.FlatShading
            });
            this.MaterialSub = new THREE.LineBasicMaterial({vertexColors: THREE.VertexColors});
        }
        else if (Suffix == 2) {
            var SkeStruct1 = [7, 13, 12];
            var SkeStruct2 = [16, 17, 11];
            var SubStruct1 = [14, 5, 4];
            var SubStruct2 = [18, 9, 8];
            var SubStruct3 = [12, 7, 3, 11, 16];
            var StructFlat = SkeStruct1.concat(SkeStruct2);
            var StructSubFlat = SubStruct1.concat(SubStruct2, SubStruct3);
            var IndexStruct = [];
            var IndexSubStruct = [];
            for (var i = 0; i < StructFlat.length; i++) {
                IndexStruct.push(i);
            }
            var Index = new THREE.BufferAttribute(new Uint32Array(IndexStruct.length), 1);
            for (var i = 0; i < IndexStruct.length; i++) {
                Index.array[i] = IndexStruct[i];
            }
            for (var i = 0; i < StructSubFlat.length; i++) {
                IndexSubStruct.push(i);
            }
            var IndexSub = new THREE.BufferAttribute(new Uint32Array(IndexSubStruct.length), 1);
            for (var i = 0; i < IndexSubStruct.length; i++) {
                IndexSub.array[i] = IndexSubStruct[i];
            }
            var PtCount = StructFlat.length;
            var PtSubCount = StructSubFlat.length;
            this.Geo = new THREE.BufferGeometry();
            this.GeoSub = new THREE.BufferGeometry();
            this.Pos = new THREE.BufferAttribute(new Float32Array(FrameCount * PtCount * 3), 3);
            this.Nor = new THREE.BufferAttribute(new Float32Array(FrameCount * PtCount * 3), 3);
            this.Col = new THREE.BufferAttribute(new Float32Array(FrameCount * PtCount * 4), 4);
            this.ColH = new THREE.BufferAttribute(new Float32Array(FrameCount * PtCount * 4), 4);
            this.PosSub = new THREE.BufferAttribute(new Float32Array(FrameCount * PtSubCount * 3), 3);
            this.ColSub = new THREE.BufferAttribute(new Float32Array(FrameCount * PtSubCount * 4), 4);
            this.ColHSub = new THREE.BufferAttribute(new Float32Array(FrameCount * PtSubCount * 4), 4);
            this.Index = Index;
            this.IndexSub = IndexSub;
            this.Struct = StructFlat;
            this.StructSub = StructSubFlat;
            this.FrameCount = FrameCount;
            this.PtCount = PtCount;
            this.PtSubCount = PtSubCount;
            this.Hybrid = true;
            this.Count = PtCount * FrameCount;
            this.CountSub = PtSubCount * FrameCount;
            this.Material = new THREE.MeshPhongMaterial({
                color: 0xaaaaaa,
                specular: 0xffffff,
                shininess: 250,
                side: THREE.DoubleSide,
                vertexColors: THREE.VertexColors,
                shading: THREE.FlatShading
            });
            this.MaterialSub = new THREE.LineBasicMaterial({vertexColors: THREE.VertexColors});
        }
        else if (Suffix == 3) {
            var SkeStruct1 = [7, 0, 5];
            var SkeStruct2 = [9, 0, 11];
            var SkeStruct3 = [3, 4, 8];
            var SubStruct1 = [14, 13];
            var SubStruct2 = [18, 17];
            var StructFlat = SkeStruct1.concat(SkeStruct2, SkeStruct3);
            var StructSubFlat = SubStruct1.concat(SubStruct2);
            var IndexStruct = [];
            var IndexSubStruct = [];
            for (var i = 0; i < StructFlat.length; i++) {
                IndexStruct.push(i);
            }
            var Index = new THREE.BufferAttribute(new Uint32Array(IndexStruct.length), 1);
            for (var i = 0; i < IndexStruct.length; i++) {
                Index.array[i] = IndexStruct[i];
            }
            for (var i = 0; i < StructSubFlat.length; i++) {
                IndexSubStruct.push(i);
            }
            var IndexSub = new THREE.BufferAttribute(new Uint32Array(IndexSubStruct.length), 1);
            for (var i = 0; i < IndexSubStruct.length; i++) {
                IndexSub.array[i] = IndexSubStruct[i];
            }
            var PtCount = StructFlat.length;
            var PtSubCount = StructSubFlat.length;
            this.Geo = new THREE.BufferGeometry();
            this.GeoSub = new THREE.BufferGeometry();
            this.Pos = new THREE.BufferAttribute(new Float32Array(FrameCount * PtCount * 3), 3);
            this.Nor = new THREE.BufferAttribute(new Float32Array(FrameCount * PtCount * 3), 3);
            this.Col = new THREE.BufferAttribute(new Float32Array(FrameCount * PtCount * 4), 4);
            this.ColH = new THREE.BufferAttribute(new Float32Array(FrameCount * PtCount * 4), 4);
            this.PosSub = new THREE.BufferAttribute(new Float32Array(FrameCount * PtSubCount * 3), 3);
            this.ColSub = new THREE.BufferAttribute(new Float32Array(FrameCount * PtSubCount * 4), 4);
            this.ColHSub = new THREE.BufferAttribute(new Float32Array(FrameCount * PtSubCount * 4), 4);
            this.Index = Index;
            this.IndexSub = IndexSub;
            this.Struct = StructFlat;
            this.StructSub = StructSubFlat;
            this.FrameCount = FrameCount;
            this.PtCount = PtCount;
            this.PtSubCount = PtSubCount;
            this.Hybrid = true;
            this.Count = PtCount * FrameCount;
            this.CountSub = PtSubCount * FrameCount;
            this.Material = new THREE.MeshPhongMaterial({
                color: 0xaaaaaa,
                specular: 0xffffff,
                shininess: 250,
                side: THREE.DoubleSide,
                vertexColors: THREE.VertexColors,
                shading: THREE.FlatShading
            });
            this.MaterialSub = new THREE.LineBasicMaterial({vertexColors: THREE.VertexColors});
        }
    }

}
function SkeMeshMulti(FrameCount, SkeMeshBase, MeshType){
    if(SkeMeshBase.FrameCount != 1){
        alert("Has Multiple Replay FrameCount");
    }
    else{
        if(SkeMeshBase.Hybrid == false){
            var IndexStructMax = SkeMeshBase.Index.array[0];
            for (var i = 0; i < SkeMeshBase.Index.length; i++) {
                if (IndexStructMax < SkeMeshBase.Index.array[i] ) {
                    IndexStructMax = SkeMeshBase.Index.array[i];
                }
            }
            IndexStructMax ++;
            var IndexF = []
            for(var i = 0; i < FrameCount ; i++){
                for(var j = 0; j < SkeMeshBase.Index.length ; j++){
                    IndexF.push(SkeMeshBase.Index.array[j] + i * IndexStructMax);
                }
            }
            var Index = new THREE.BufferAttribute( new Uint32Array ( IndexF.length ), 1 );
            for ( var i = 0; i < IndexF.length; i ++ ) {
                Index.array[i] =  IndexF[i];
            }
            this.Geo = new THREE.BufferGeometry();
            this.Pos = new THREE.BufferAttribute( new Float32Array( FrameCount*SkeMeshBase.PtCount * 3 ), 3 );
            this.Nor = new THREE.BufferAttribute( new Float32Array( FrameCount*SkeMeshBase.PtCount * 3 ), 3 );
            this.Col = new THREE.BufferAttribute(new Float32Array( FrameCount*SkeMeshBase.PtCount * 4 ), 4 );
            this.PosH = new THREE.BufferAttribute( new Float32Array( FrameCount*SkeMeshBase.PtCount * 3 ), 3 );
            this.NorH = new THREE.BufferAttribute( new Float32Array( FrameCount*SkeMeshBase.PtCount * 3 ), 3 );
            this.ColH = new THREE.BufferAttribute(new Float32Array( FrameCount*SkeMeshBase.PtCount * 4 ), 4 );
            this.PosShow = new THREE.BufferAttribute( new Float32Array( SkeMeshBase.PtCount * 3 ), 3 );
            this.NorShow = new THREE.BufferAttribute( new Float32Array( SkeMeshBase.PtCount * 3 ), 3 );
            this.ColShow = new THREE.BufferAttribute(new Float32Array( SkeMeshBase.PtCount * 4 ), 4 );
            this.Index = Index;
            this.Struct = SkeMeshBase.Struct;
            this.FrameCount = FrameCount;
            this.PtCount = SkeMeshBase.PtCount;
            this.Count = SkeMeshBase.PtCount * FrameCount;
            this.Hybrid = SkeMeshBase.Hybrid;
            if(MeshType == false){
                this.Material = new THREE.MeshPhongMaterial( {
                    color: 0xaaaaaa, specular: 0xffffff , shininess: 250 , side: THREE.DoubleSide, vertexColors: THREE.VertexColors, shading: THREE.FlatShading, wireframe: true , wireframeLinewidth: 10
                } );
            }
            if(MeshType == true){
                this.Material = new THREE.MeshPhongMaterial( {
                    color: 0xaaaaaa, specular: 0xffffff , shininess: 250 , side: THREE.DoubleSide, vertexColors: THREE.VertexColors, shading: THREE.FlatShading
                } );
            }
        }
        else if(SkeMeshBase.Hybrid == true){
            var IndexStructMax = SkeMeshBase.Index.array[0];
            for (var i = 0; i < SkeMeshBase.Index.length; i++) {
                if (IndexStructMax < SkeMeshBase.Index.array[i] ) {
                    IndexStructMax = SkeMeshBase.Index.array[i];
                }
            }
            IndexStructMax ++;
            var IndexF = []
            for(var i = 0; i < FrameCount ; i++){
                for(var j = 0; j < SkeMeshBase.Index.length ; j++){
                    IndexF.push(SkeMeshBase.Index.array[j] + i * IndexStructMax);
                }
            }
            var Index = new THREE.BufferAttribute( new Uint32Array ( IndexF.length ), 1 );
            for ( var i = 0; i < IndexF.length; i ++ ) {
                Index.array[i] =  IndexF[i];
            }
            var IndexSubStructMax = SkeMeshBase.IndexSub.array[0];
            for (var i = 0; i < SkeMeshBase.IndexSub.length; i++) {
                if (IndexSubStructMax < SkeMeshBase.IndexSub.array[i] ) {
                    IndexSubStructMax = SkeMeshBase.IndexSub.array[i];
                }
            }
            IndexSubStructMax ++;
            var IndexSubF = []
            for(var i = 0; i < FrameCount ; i++){
                if(i%2 == 0){
                    for(var j = 0; j < SkeMeshBase.IndexSub.length ; j++){
                        IndexSubF.push(SkeMeshBase.IndexSub.array[j] + i * IndexSubStructMax);
                    }
                }
                else if(i%2 == 1){
                    for(var j = SkeMeshBase.IndexSub.length-1; j >= 0 ; j--){
                        IndexSubF.push(SkeMeshBase.IndexSub.array[j] + i * IndexSubStructMax);
                    }
                }
            }
            var IndexSub = new THREE.BufferAttribute( new Uint32Array ( IndexSubF.length ), 1 );
            for ( var i = 0; i < IndexSubF.length; i ++ ) {
                IndexSub.array[i] =  IndexSubF[i];
            }
            this.Geo = new THREE.BufferGeometry();
            this.GeoSub = new THREE.BufferGeometry();
            this.Pos = new THREE.BufferAttribute( new Float32Array( FrameCount*SkeMeshBase.PtCount * 3 ), 3 );
            this.Nor = new THREE.BufferAttribute( new Float32Array( FrameCount*SkeMeshBase.PtCount * 3 ), 3 );
            this.Col = new THREE.BufferAttribute(new Float32Array( FrameCount*SkeMeshBase.PtCount * 4 ), 4 );
            this.PosH = new THREE.BufferAttribute( new Float32Array( FrameCount*SkeMeshBase.PtCount * 3 ), 3 );
            this.NorH = new THREE.BufferAttribute( new Float32Array( FrameCount*SkeMeshBase.PtCount * 3 ), 3 );
            this.ColH = new THREE.BufferAttribute(new Float32Array( FrameCount*SkeMeshBase.PtCount * 4 ), 4 );
            this.PosShow = new THREE.BufferAttribute( new Float32Array( SkeMeshBase.PtCount * 3 ), 3 );
            this.NorShow = new THREE.BufferAttribute( new Float32Array( SkeMeshBase.PtCount * 3 ), 3 );
            this.ColShow = new THREE.BufferAttribute(new Float32Array( SkeMeshBase.PtCount * 4 ), 4 );
            this.PosSub = new THREE.BufferAttribute( new Float32Array( FrameCount*SkeMeshBase.PtSubCount * 3 ), 3 );
            this.ColSub = new THREE.BufferAttribute(new Float32Array( FrameCount*SkeMeshBase.PtSubCount * 4 ), 4 );
            this.PosHSub = new THREE.BufferAttribute( new Float32Array( FrameCount*SkeMeshBase.PtSubCount * 3 ), 3 );
            this.ColHSub = new THREE.BufferAttribute(new Float32Array( FrameCount*SkeMeshBase.PtSubCount * 4 ), 4 );
            this.PosShowSub = new THREE.BufferAttribute( new Float32Array( SkeMeshBase.PtSubCount * 3 ), 3 );
            this.ColShowSub = new THREE.BufferAttribute(new Float32Array( SkeMeshBase.PtSubCount * 4 ), 4 );
            this.Index = Index;
            this.Struct = SkeMeshBase.Struct;
            this.FrameCount = FrameCount;
            this.PtCount = SkeMeshBase.PtCount;
            this.Count = SkeMeshBase.PtCount * FrameCount;
            this.IndexSub = IndexSub;
            this.StructSub = SkeMeshBase.StructSub;
            this.FrameCount = FrameCount;
            this.PtSubCount = SkeMeshBase.PtSubCount;
            this.CountSub = SkeMeshBase.PtSubCount * FrameCount;
            this.Hybrid = SkeMeshBase.Hybrid;
            this.Material = SkeMeshBase.Material;
            this.MaterialSub = SkeMeshBase.MaterialSub;
        }
    }
}
function SkeMeshCreate(SkeMesh, scene) {
    if (SkeMesh.Hybrid == false) {
        for (var i = 0; i < SkeMesh.Pos.length / 3; i++) {
            SkeMesh.Pos.setXYZ(i, 0, 0, 0);
            SkeMesh.Nor.setXYZ(i, 0, 0, 0);
        }
        for (var i = 0; i < SkeMesh.Col.length / 4; i++) {
            SkeMesh.Col.setXYZW(i, 1, 1, 1, 1);
        }
        SkeMesh.Geo.addAttribute('position', SkeMesh.Pos);
        SkeMesh.Geo.addAttribute('normal', SkeMesh.Nor);
        SkeMesh.Geo.addAttribute('color', SkeMesh.Col);
        SkeMesh.Geo.addAttribute('index', SkeMesh.Index);
        var SkeMeshFin = new THREE.Mesh(SkeMesh.Geo, SkeMesh.Material);
        SkeMeshFin.castShadow = true;
        SkeMeshFin.receiveShadow = true;
        scene.add(SkeMeshFin);
    }
    else if (SkeMesh.Hybrid == true) {
        for (var i = 0; i < SkeMesh.Pos.length / 3; i++) {
            SkeMesh.Pos.setXYZ(i, 0, 0, 0);
            SkeMesh.Nor.setXYZ(i, 0, 0, 0);
        }
        for (var i = 0; i < SkeMesh.Col.length / 4; i++) {
            SkeMesh.Col.setXYZW(i, 1, 1, 1, 1);
        }
        SkeMesh.Geo.addAttribute('position', SkeMesh.Pos);
        SkeMesh.Geo.addAttribute('normal', SkeMesh.Nor);
        SkeMesh.Geo.addAttribute('color', SkeMesh.Col);
        SkeMesh.Geo.addAttribute('index', SkeMesh.Index);
        var SkeMeshFin = new THREE.Mesh(SkeMesh.Geo, SkeMesh.Material);
        SkeMeshFin.castShadow = true;
        SkeMeshFin.receiveShadow = true;
        scene.add(SkeMeshFin);

        for (var i = 0; i < SkeMesh.PosSub.length / 3; i++) {
            SkeMesh.PosSub.setXYZ(i, 0, 0, 0);
        }
        for (var i = 0; i < SkeMesh.ColSub.length / 4; i++) {
            SkeMesh.ColSub.setXYZW(i, 1, 1, 1, 1);
        }
        SkeMesh.GeoSub.addAttribute('position', SkeMesh.PosSub);
        SkeMesh.GeoSub.addAttribute('color', SkeMesh.ColSub);
        SkeMesh.GeoSub.addAttribute('index', SkeMesh.IndexSub);
        var SkeMeshSubFin = new THREE.Line(SkeMesh.GeoSub, SkeMesh.MaterialSub);
        scene.add(SkeMeshSubFin);
    }
}
function SkeMeshDynamic(AnchorAcc,SkeFromKinect,SkeMesh){
    var AnchorAccCol = Math.abs(AnchorAcc.X) + Math.abs(AnchorAcc.Y) + Math.abs(AnchorAcc.Z)
    if(AnchorAccCol > 2.5){
        AnchorAccCol = 0.66
    }
    else if (AnchorAccCol <= 0.05){
        AnchorAccCol = 0
    }
    else{
        AnchorAccCol = 0.66 * AnchorAccCol/2.5
    }
    interval--;
    if(SkeMesh.FrameCount != 1 && interval < 1){
        for ( var i = 0; i < SkeMesh.Pos.length - SkeMesh.PtCount*3; i ++ ) {
            SkeMesh.Pos.array[ i ] = SkeMesh.Pos.array[ i+SkeMesh.PtCount*3 ];
            SkeMesh.Nor.array[ i ] = SkeMesh.Nor.array[ i+SkeMesh.PtCount*3 ];
        }
        for ( var i = 0; i < SkeMesh.Col.length - SkeMesh.PtCount*4; i ++ ) {
            SkeMesh.Col.array[ i ] = SkeMesh.Col.array[ i+SkeMesh.PtCount*4 ];
            SkeMesh.ColH.array[ i ] = SkeMesh.ColH.array[ i+SkeMesh.PtCount*4 ];
        }
        var Construct = SkeMesh.Struct;
        for ( var i = 0; i < Construct.length; i ++ ) {
            if( Construct[i] == parseInt(Construct[i]) ){
                SkeMesh.Pos.array[ SkeMesh.Count*3-(Construct.length-i)*3 ]    = SkeFromKinect[Construct[i]*3]
                SkeMesh.Pos.array[ SkeMesh.Count*3-(Construct.length-i)*3 + 1] = SkeFromKinect[Construct[i]*3 + 1]
                SkeMesh.Pos.array[ SkeMesh.Count*3-(Construct.length-i)*3 + 2] = SkeFromKinect[Construct[i]*3 + 2]
            }
            else{
                var tempt = parseInt(Construct[i])
                SkeMesh.Pos.array[ SkeMesh.Count*3-(Construct.length-i)*3 ]    = (SkeFromKinect[tempt*3] + 8 )
                SkeMesh.Pos.array[ SkeMesh.Count*3-(Construct.length-i)*3 + 1] = (SkeFromKinect[tempt*3 + 1] + 8 )
                SkeMesh.Pos.array[ SkeMesh.Count*3-(Construct.length-i)*3 + 2] = SkeFromKinect[tempt*3 + 2] + 20
            }
        }
        var VecBase = []
        for ( var i = 0; i < Construct.length; i ++ ) {
            var Vec = new THREE.Vector3( SkeFromKinect[parseInt(Construct[i])*3], SkeFromKinect[parseInt(Construct[i])*3 + 1], SkeFromKinect[parseInt(Construct[i])*3 + 2] );
            VecBase.push(Vec)
        }
        var VecNormal = []
        for ( var i = 0; i < VecBase.length/3; i ++ ) {
            var Vec1 = new THREE.Vector3( VecBase[3*i].x - VecBase[3*i+1].x, VecBase[3*i].y - VecBase[3*i+1].y, VecBase[3*i].z - VecBase[3*i+1].z );
            var Vec2 = new THREE.Vector3( VecBase[3*i+1].x - VecBase[3*i+2].x, VecBase[3*i+1].y - VecBase[3*i+2].y, VecBase[3*i+1].z - VecBase[3*i+2].z );
            var Vec3 = new THREE.Vector3( VecBase[3*i].x - VecBase[3*i+2].x, VecBase[3*i].y - VecBase[3*i+2].y, VecBase[3*i].z - VecBase[3*i+2].z );
            var normal1 = new THREE.Vector3();
            var normal2 = new THREE.Vector3();
            var normal3 = new THREE.Vector3();
            normal1.crossVectors( Vec1, Vec3 );
            normal2.crossVectors( Vec1, Vec2 );
            normal3.crossVectors( Vec3, Vec2 );
            VecNormal.push(normal1)
            VecNormal.push(normal2)
            VecNormal.push(normal3)
        }
        for ( var i = 0; i < VecNormal.length; i ++ ) {
            SkeMesh.Nor.array[ SkeMesh.Count*3-(VecNormal.length-i)*3 ]    = VecNormal[i].x
            SkeMesh.Nor.array[ SkeMesh.Count*3-(VecNormal.length-i)*3 + 1] = VecNormal[i].y
            SkeMesh.Nor.array[ SkeMesh.Count*3-(VecNormal.length-i)*3 + 2] = VecNormal[i].z
        }
        for ( var i = SkeMesh.PtCount*4; i > 0; i -- ) {
            SkeMesh.Col.array[ SkeMesh.Count*4-i ] = 1
        }
        for ( var i = SkeMesh.Struct.length-1; i >= 0; i -- ) {
            SkeMesh.ColH.array[ (SkeMesh.Count - i)*4-4 ] = 0.5 + AnchorAccCol;
            SkeMesh.ColH.array[ (SkeMesh.Count - i)*4-3 ] = 0.8;
            SkeMesh.ColH.array[ (SkeMesh.Count - i)*4-2 ] = 0.8;
            SkeMesh.ColH.array[ (SkeMesh.Count - i)*4-1 ] = 0.1;
        }
        for ( var i = 0; i < SkeMesh.Col.array.length; i+=4 ) {
            if(SkeMesh.Col.array[ i ]     > SkeMesh.ColH.array[i])     SkeMesh.Col.array[ i ] -=0.05;
            if(SkeMesh.Col.array[ i + 1 ] > SkeMesh.ColH.array[i + 1]) SkeMesh.Col.array[ i + 1 ] -=0.05;
            if(SkeMesh.Col.array[ i + 2 ] > SkeMesh.ColH.array[i + 2]) SkeMesh.Col.array[ i + 2 ] -=0.05;
            if(SkeMesh.Col.array[ i + 3 ] > SkeMesh.ColH.array[i + 3]) SkeMesh.Col.array[ i + 3 ] -=0.05;
        }
        interval = 7;
    }
    else if(SkeMesh.FrameCount == 1){
        var Construct = SkeMesh.Struct;
        for ( var i = 0; i < Construct.length; i ++ ) {
            if( Construct[i] == parseInt(Construct[i]) ){
                SkeMesh.Pos.array[ SkeMesh.PtCount*3-(Construct.length-i)*3 ]    = SkeFromKinect[Construct[i]*3]
                SkeMesh.Pos.array[ SkeMesh.PtCount*3-(Construct.length-i)*3 + 1] = SkeFromKinect[Construct[i]*3 + 1]
                SkeMesh.Pos.array[ SkeMesh.PtCount*3-(Construct.length-i)*3 + 2] = SkeFromKinect[Construct[i]*3 + 2]
            }
            else{
                var tempt = parseInt(Construct[i])
                SkeMesh.Pos.array[ SkeMesh.PtCount*3-(Construct.length-i)*3 ]    = SkeFromKinect[tempt*3] + 8
                SkeMesh.Pos.array[ SkeMesh.PtCount*3-(Construct.length-i)*3 + 1] = SkeFromKinect[tempt*3 + 1] + 8
                SkeMesh.Pos.array[ SkeMesh.PtCount*3-(Construct.length-i)*3 + 2] = SkeFromKinect[tempt*3 + 2] + 2
            }
        }
        ////
        if(SkeMesh.StructSub){
            var ConstructSub = SkeMesh.StructSub;
            for ( var i = 0; i < ConstructSub.length; i ++ ) {
                SkeMesh.PosSub.array[ SkeMesh.CountSub*3-(ConstructSub.length-i)*3 ]    = SkeFromKinect[ConstructSub[i]*3]
                SkeMesh.PosSub.array[ SkeMesh.CountSub*3-(ConstructSub.length-i)*3 + 1] = SkeFromKinect[ConstructSub[i]*3 + 1]
                SkeMesh.PosSub.array[ SkeMesh.CountSub*3-(ConstructSub.length-i)*3 + 2] = SkeFromKinect[ConstructSub[i]*3 + 2]
            }
        }
        ////
        var VecBase = []
        for ( var i = 0; i < Construct.length; i ++ ) {
            var Vec = new THREE.Vector3( SkeFromKinect[parseInt(Construct[i])*3], SkeFromKinect[parseInt(Construct[i])*3 + 1], SkeFromKinect[parseInt(Construct[i])*3 + 2] );
            VecBase.push(Vec)
        }
        var VecNormal = []
        for ( var i = 0; i < VecBase.length/3; i ++ ) {
            var Vec1 = new THREE.Vector3( VecBase[3*i].x - VecBase[3*i+1].x, VecBase[3*i].y - VecBase[3*i+1].y, VecBase[3*i].z - VecBase[3*i+1].z );
            var Vec2 = new THREE.Vector3( VecBase[3*i+1].x - VecBase[3*i+2].x, VecBase[3*i+1].y - VecBase[3*i+2].y, VecBase[3*i+1].z - VecBase[3*i+2].z );
            var Vec3 = new THREE.Vector3( VecBase[3*i].x - VecBase[3*i+2].x, VecBase[3*i].y - VecBase[3*i+2].y, VecBase[3*i].z - VecBase[3*i+2].z );
            var normal1 = new THREE.Vector3();
            var normal2 = new THREE.Vector3();
            var normal3 = new THREE.Vector3();
            normal1.crossVectors( Vec1, Vec3 );
            normal2.crossVectors( Vec1, Vec2 );
            normal3.crossVectors( Vec3, Vec2 );
            VecNormal.push(normal1)
            VecNormal.push(normal2)
            VecNormal.push(normal3)
        }
        for ( var i = 0; i < VecNormal.length; i ++ ) {
            SkeMesh.Nor.array[ SkeMesh.PtCount*3-(VecNormal.length-i)*3 ]    = VecNormal[i].x
            SkeMesh.Nor.array[ SkeMesh.PtCount*3-(VecNormal.length-i)*3 + 1] = VecNormal[i].y
            SkeMesh.Nor.array[ SkeMesh.PtCount*3-(VecNormal.length-i)*3 + 2] = VecNormal[i].z
        }
        for ( var i = Construct.length-1; i >= 0; i -- ) {
            SkeMesh.Col.array[ (SkeMesh.PtCount - i)*4-4 ] = 0.33 + AnchorAccCol;
            SkeMesh.Col.array[ (SkeMesh.PtCount - i)*4-3 ] = 0.2;
            SkeMesh.Col.array[ (SkeMesh.PtCount - i)*4-2 ] = 0.2;
            SkeMesh.Col.array[ (SkeMesh.PtCount - i)*4-1 ] = 1;
        }
    }
}
function SkeMeshDynamicShift(AnchorAcc,SkeFromKinect,SkeMesh){
    var AnchorAccCol = Math.abs(AnchorAcc.X) + Math.abs(AnchorAcc.Y) + Math.abs(AnchorAcc.Z)
    if(AnchorAccCol > 2.5){
        AnchorAccCol = 0.66
    }
    else if (AnchorAccCol <= 0.05){
        AnchorAccCol = 0
    }
    else{
        AnchorAccCol = 0.66 * AnchorAccCol/2.5
    }
    interval--;
    if(SkeMesh.FrameCount != 1 && interval < 1){
        for ( var i = 0; i < SkeMesh.Pos.length - SkeMesh.PtCount*3; i ++ ) {
            SkeMesh.Pos.array[ i ] = SkeMesh.Pos.array[ i+SkeMesh.PtCount*3 ];
            SkeMesh.Nor.array[ i ] = SkeMesh.Nor.array[ i+SkeMesh.PtCount*3 ];
        }
        for ( var i = 0; i < SkeMesh.Col.length - SkeMesh.PtCount*4; i ++ ) {
            SkeMesh.Col.array[ i ] = SkeMesh.Col.array[ i+SkeMesh.PtCount*4 ];
            SkeMesh.ColH.array[ i ] = SkeMesh.ColH.array[ i+SkeMesh.PtCount*4 ];
        }
        var Construct = SkeMesh.Struct;
        for ( var i = 0; i < Construct.length; i ++ ) {
            if( Construct[i] == parseInt(Construct[i]) ){
                SkeMesh.Pos.array[ SkeMesh.Count*3-(Construct.length-i)*3 ]    = SkeFromKinect[Construct[i]*3]     * 10
                SkeMesh.Pos.array[ SkeMesh.Count*3-(Construct.length-i)*3 + 1] = SkeFromKinect[Construct[i]*3 + 1] * 10
                SkeMesh.Pos.array[ SkeMesh.Count*3-(Construct.length-i)*3 + 2] = SkeFromKinect[Construct[i]*3 + 2]
            }
            else{
                var tempt = parseInt(Construct[i])
                SkeMesh.Pos.array[ SkeMesh.Count*3-(Construct.length-i)*3 ]    = (SkeFromKinect[tempt*3] + 8 )     * 10
                SkeMesh.Pos.array[ SkeMesh.Count*3-(Construct.length-i)*3 + 1] = (SkeFromKinect[tempt*3 + 1] + 8 ) * 10
                SkeMesh.Pos.array[ SkeMesh.Count*3-(Construct.length-i)*3 + 2] = SkeFromKinect[tempt*3 + 2] + 20
            }
        }
        var VecBase = []
        for ( var i = 0; i < Construct.length; i ++ ) {
            var Vec = new THREE.Vector3( SkeFromKinect[parseInt(Construct[i])*3], SkeFromKinect[parseInt(Construct[i])*3 + 1], SkeFromKinect[parseInt(Construct[i])*3 + 2] );
            VecBase.push(Vec)
        }
        var VecNormal = []
        for ( var i = 0; i < VecBase.length/3; i ++ ) {
            var Vec1 = new THREE.Vector3( VecBase[3*i].x - VecBase[3*i+1].x, VecBase[3*i].y - VecBase[3*i+1].y, VecBase[3*i].z - VecBase[3*i+1].z );
            var Vec2 = new THREE.Vector3( VecBase[3*i+1].x - VecBase[3*i+2].x, VecBase[3*i+1].y - VecBase[3*i+2].y, VecBase[3*i+1].z - VecBase[3*i+2].z );
            var Vec3 = new THREE.Vector3( VecBase[3*i].x - VecBase[3*i+2].x, VecBase[3*i].y - VecBase[3*i+2].y, VecBase[3*i].z - VecBase[3*i+2].z );
            var normal1 = new THREE.Vector3();
            var normal2 = new THREE.Vector3();
            var normal3 = new THREE.Vector3();
            normal1.crossVectors( Vec1, Vec3 );
            normal2.crossVectors( Vec1, Vec2 );
            normal3.crossVectors( Vec3, Vec2 );
            VecNormal.push(normal1)
            VecNormal.push(normal2)
            VecNormal.push(normal3)
        }
        for ( var i = 0; i < VecNormal.length; i ++ ) {
            SkeMesh.Nor.array[ SkeMesh.Count*3-(VecNormal.length-i)*3 ]    = VecNormal[i].x
            SkeMesh.Nor.array[ SkeMesh.Count*3-(VecNormal.length-i)*3 + 1] = VecNormal[i].y
            SkeMesh.Nor.array[ SkeMesh.Count*3-(VecNormal.length-i)*3 + 2] = VecNormal[i].z
        }
        for ( var i = SkeMesh.PtCount*4; i > 0; i -- ) {
            SkeMesh.Col.array[ SkeMesh.Count*4-i ] = 1
        }
        var ColorT1 = 0;
        var ColorT2 = 0;
        if(rightWrist.Y>122) ColorT1 = 1;
        if(leftWrist.Y>122) ColorT2 = 1;
        if( ColorT1 == 1 &&  ColorT2 == 1){
            for ( var i = SkeMesh.Struct.length-1; i >= 0; i -- ) {
                SkeMesh.ColH.array[ (SkeMesh.Count - i)*4-4 ] = 0.8 + AnchorAccCol;
                SkeMesh.ColH.array[ (SkeMesh.Count - i)*4-3 ] = 0.8 + AnchorAccCol;
                SkeMesh.ColH.array[ (SkeMesh.Count - i)*4-2 ] = 0.8;
                SkeMesh.ColH.array[ (SkeMesh.Count - i)*4-1 ] = 1;
            }
        }
        else if( ColorT1 == 1 &&  ColorT2 == 0){
            for ( var i = SkeMesh.Struct.length-1; i >= 0; i -- ) {
                SkeMesh.ColH.array[ (SkeMesh.Count - i)*4-4 ] = 0.8 + AnchorAccCol;
                SkeMesh.ColH.array[ (SkeMesh.Count - i)*4-3 ] = 0.8;
                SkeMesh.ColH.array[ (SkeMesh.Count - i)*4-2 ] = 0.8;
                SkeMesh.ColH.array[ (SkeMesh.Count - i)*4-1 ] = 1;
            }
        }
        else if( ColorT1 == 0 &&  ColorT2 == 1){
            for ( var i = SkeMesh.Struct.length-1; i >= 0; i -- ) {
                SkeMesh.ColH.array[ (SkeMesh.Count - i)*4-4 ] = 0.8;
                SkeMesh.ColH.array[ (SkeMesh.Count - i)*4-3 ] = 0.8 + AnchorAccCol;
                SkeMesh.ColH.array[ (SkeMesh.Count - i)*4-2 ] = 0.8;
                SkeMesh.ColH.array[ (SkeMesh.Count - i)*4-1 ] = 1;
            }
        }
        else if( ColorT1 == 0 &&  ColorT2 == 0){
            for ( var i = SkeMesh.Struct.length-1; i >= 0; i -- ) {
                SkeMesh.ColH.array[ (SkeMesh.Count - i)*4-4 ] = 0.8;
                SkeMesh.ColH.array[ (SkeMesh.Count - i)*4-3 ] = 0.8;
                SkeMesh.ColH.array[ (SkeMesh.Count - i)*4-2 ] = 0.8 + AnchorAccCol;
                SkeMesh.ColH.array[ (SkeMesh.Count - i)*4-1 ] = 1;
            }
        }


        for ( var i = 0; i < SkeMesh.Col.array.length; i+=4 ) {
            if(SkeMesh.Col.array[ i ]     > SkeMesh.ColH.array[i])     SkeMesh.Col.array[ i ] -=0.05;
            if(SkeMesh.Col.array[ i + 1 ] > SkeMesh.ColH.array[i + 1]) SkeMesh.Col.array[ i + 1 ] -=0.05;
            if(SkeMesh.Col.array[ i + 2 ] > SkeMesh.ColH.array[i + 2]) SkeMesh.Col.array[ i + 2 ] -=0.05;
        }
        interval = 7;
    }
    else if(SkeMesh.FrameCount == 1){
        var Construct = SkeMesh.Struct;
        for ( var i = 0; i < Construct.length; i ++ ) {
            if( Construct[i] == parseInt(Construct[i]) ){
                SkeMesh.Pos.array[ SkeMesh.PtCount*3-(Construct.length-i)*3 ]    = SkeFromKinect[Construct[i]*3]
                SkeMesh.Pos.array[ SkeMesh.PtCount*3-(Construct.length-i)*3 + 1] = SkeFromKinect[Construct[i]*3 + 1]
                SkeMesh.Pos.array[ SkeMesh.PtCount*3-(Construct.length-i)*3 + 2] = SkeFromKinect[Construct[i]*3 + 2] + 400
            }
            else{
                var tempt = parseInt(Construct[i])
                SkeMesh.Pos.array[ SkeMesh.PtCount*3-(Construct.length-i)*3 ]    = SkeFromKinect[tempt*3] + 8
                SkeMesh.Pos.array[ SkeMesh.PtCount*3-(Construct.length-i)*3 + 1] = SkeFromKinect[tempt*3 + 1] + 8
                SkeMesh.Pos.array[ SkeMesh.PtCount*3-(Construct.length-i)*3 + 2] = SkeFromKinect[tempt*3 + 2] + 2 + 400
            }
        }
        ////
        if(SkeMesh.StructSub){
            var ConstructSub = SkeMesh.StructSub;
            for ( var i = 0; i < ConstructSub.length; i ++ ) {
                SkeMesh.PosSub.array[ SkeMesh.CountSub*3-(ConstructSub.length-i)*3 ]    = SkeFromKinect[ConstructSub[i]*3]
                SkeMesh.PosSub.array[ SkeMesh.CountSub*3-(ConstructSub.length-i)*3 + 1] = SkeFromKinect[ConstructSub[i]*3 + 1]
                SkeMesh.PosSub.array[ SkeMesh.CountSub*3-(ConstructSub.length-i)*3 + 2] = SkeFromKinect[ConstructSub[i]*3 + 2] + 400
            }
        }
        ////
        var VecBase = []
        for ( var i = 0; i < Construct.length; i ++ ) {
            var Vec = new THREE.Vector3( SkeFromKinect[parseInt(Construct[i])*3], SkeFromKinect[parseInt(Construct[i])*3 + 1], SkeFromKinect[parseInt(Construct[i])*3 + 2] );
            VecBase.push(Vec)
        }
        var VecNormal = []
        for ( var i = 0; i < VecBase.length/3; i ++ ) {
            var Vec1 = new THREE.Vector3( VecBase[3*i].x - VecBase[3*i+1].x, VecBase[3*i].y - VecBase[3*i+1].y, VecBase[3*i].z - VecBase[3*i+1].z );
            var Vec2 = new THREE.Vector3( VecBase[3*i+1].x - VecBase[3*i+2].x, VecBase[3*i+1].y - VecBase[3*i+2].y, VecBase[3*i+1].z - VecBase[3*i+2].z );
            var Vec3 = new THREE.Vector3( VecBase[3*i].x - VecBase[3*i+2].x, VecBase[3*i].y - VecBase[3*i+2].y, VecBase[3*i].z - VecBase[3*i+2].z );
            var normal1 = new THREE.Vector3();
            var normal2 = new THREE.Vector3();
            var normal3 = new THREE.Vector3();
            normal1.crossVectors( Vec1, Vec3 );
            normal2.crossVectors( Vec1, Vec2 );
            normal3.crossVectors( Vec3, Vec2 );
            VecNormal.push(normal1)
            VecNormal.push(normal2)
            VecNormal.push(normal3)
        }
        for ( var i = 0; i < VecNormal.length; i ++ ) {
            SkeMesh.Nor.array[ SkeMesh.PtCount*3-(VecNormal.length-i)*3 ]    = VecNormal[i].x
            SkeMesh.Nor.array[ SkeMesh.PtCount*3-(VecNormal.length-i)*3 + 1] = VecNormal[i].y
            SkeMesh.Nor.array[ SkeMesh.PtCount*3-(VecNormal.length-i)*3 + 2] = VecNormal[i].z
        }
        for ( var i = Construct.length-1; i >= 0; i -- ) {
            SkeMesh.Col.array[ (SkeMesh.PtCount - i)*4-4 ] = 0.33 + AnchorAccCol;
            SkeMesh.Col.array[ (SkeMesh.PtCount - i)*4-3 ] = 0.2;
            SkeMesh.Col.array[ (SkeMesh.PtCount - i)*4-2 ] = 0.2;
            SkeMesh.Col.array[ (SkeMesh.PtCount - i)*4-1 ] = 1;
        }

    }
}
function SkeMeshMultiDynamic(AnchorAcc,SkeFromKinect,SkeMesh){
    var AnchorAccCol = Math.abs(AnchorAcc.X) + Math.abs(AnchorAcc.Y) + Math.abs(AnchorAcc.Z)
    if(AnchorAccCol > 2.5){
        AnchorAccCol = 0.66
    }
    else if (AnchorAccCol <= 0.05){
        AnchorAccCol = 0
    }
    else{
        AnchorAccCol = 0.66 * AnchorAccCol/2.5
    }

    for ( var i = 0; i < SkeMesh.Pos.length - SkeMesh.PtCount*3; i ++ ) {
        SkeMesh.Pos.array[ i ] = SkeMesh.Pos.array[ i+SkeMesh.PtCount*3 ];
        SkeMesh.Nor.array[ i ] = SkeMesh.Nor.array[ i+SkeMesh.PtCount*3 ];
    }
    for ( var i = 0; i < SkeMesh.Col.length - SkeMesh.PtCount*4; i ++ ) {
        SkeMesh.Col.array[ i ] = SkeMesh.Col.array[ i+SkeMesh.PtCount*4 ];
        SkeMesh.ColH.array[ i ] = SkeMesh.ColH.array[ i+SkeMesh.PtCount*4 ];
    }
    //
    if(SkeMesh.Hybrid == true){
        for ( var i = 0; i < SkeMesh.PosSub.length - SkeMesh.PtSubCount*3; i ++ ) {
            SkeMesh.PosSub.array[ i ] = SkeMesh.PosSub.array[ i+SkeMesh.PtSubCount*3 ];
        }
        for ( var i = 0; i < SkeMesh.ColSub.length - SkeMesh.PtSubCount*4; i ++ ) {
            SkeMesh.ColSub.array[ i ] = SkeMesh.ColSub.array[ i+SkeMesh.PtSubCount*4 ];
            SkeMesh.ColHSub.array[ i ] = SkeMesh.ColHSub.array[ i+SkeMesh.PtSubCount*4 ];
        }
    }
    //
    if(AnchorAccCol <= 0.05){
        for ( var i = SkeMesh.PtCount*3; i > 0; i -- ) {
            SkeMesh.Pos.array[ SkeMesh.PtCount*3-i ] = 0
            SkeMesh.Nor.array[ SkeMesh.PtCount*3-i ] = 0;
        }
        ////
        if(SkeMesh.Hybrid == true){
            for ( var i = SkeMesh.PtSubCount*3; i > 0; i -- ) {
                SkeMesh.PosSub.array[ SkeMesh.PtSubCount*3-i ] = 0
            }
        }
        ////
    }
    else{
        var Construct = SkeMesh.Struct;
        for ( var i = 0; i < Construct.length; i ++ ) {
            if( Construct[i] == parseInt(Construct[i]) ){
                SkeMesh.Pos.array[ SkeMesh.Count*3-(Construct.length-i)*3 ]    = SkeFromKinect[Construct[i]*3]
                SkeMesh.Pos.array[ SkeMesh.Count*3-(Construct.length-i)*3 + 1] = SkeFromKinect[Construct[i]*3 + 1]
                SkeMesh.Pos.array[ SkeMesh.Count*3-(Construct.length-i)*3 + 2] = SkeFromKinect[Construct[i]*3 + 2] + 400
            }
            else{
                var tempt = parseInt(Construct[i])
                SkeMesh.Pos.array[ SkeMesh.Count*3-(Construct.length-i)*3 ]    = SkeFromKinect[tempt*3] + 8
                SkeMesh.Pos.array[ SkeMesh.Count*3-(Construct.length-i)*3 + 1] = SkeFromKinect[tempt*3 + 1] + 8
                SkeMesh.Pos.array[ SkeMesh.Count*3-(Construct.length-i)*3 + 2] = SkeFromKinect[tempt*3 + 2] + 20 + 400
            }
        }
        ////
        if(SkeMesh.StructSub){
            var ConstructSub = SkeMesh.StructSub;

            for ( var i = 0; i < ConstructSub.length; i ++ ) {
                SkeMesh.PosSub.array[ SkeMesh.CountSub*3-(ConstructSub.length-i)*3 ]    = SkeFromKinect[ConstructSub[i]*3]
                SkeMesh.PosSub.array[ SkeMesh.CountSub*3-(ConstructSub.length-i)*3 + 1] = SkeFromKinect[ConstructSub[i]*3 + 1]
                SkeMesh.PosSub.array[ SkeMesh.CountSub*3-(ConstructSub.length-i)*3 + 2] = SkeFromKinect[ConstructSub[i]*3 + 2] + 400
            }
        }
        ////
        var VecBase = []
        for ( var i = 0; i < Construct.length; i ++ ) {
            var Vec = new THREE.Vector3( SkeFromKinect[parseInt(Construct[i])*3], SkeFromKinect[parseInt(Construct[i])*3 + 1], SkeFromKinect[parseInt(Construct[i])*3 + 2] );
            VecBase.push(Vec)
        }
        var VecNormal = []
        for ( var i = 0; i < VecBase.length/3; i ++ ) {
            var Vec1 = new THREE.Vector3( VecBase[3*i].x - VecBase[3*i+1].x, VecBase[3*i].y - VecBase[3*i+1].y, VecBase[3*i].z - VecBase[3*i+1].z );
            var Vec2 = new THREE.Vector3( VecBase[3*i+1].x - VecBase[3*i+2].x, VecBase[3*i+1].y - VecBase[3*i+2].y, VecBase[3*i+1].z - VecBase[3*i+2].z );
            var Vec3 = new THREE.Vector3( VecBase[3*i].x - VecBase[3*i+2].x, VecBase[3*i].y - VecBase[3*i+2].y, VecBase[3*i].z - VecBase[3*i+2].z );
            var normal1 = new THREE.Vector3();
            var normal2 = new THREE.Vector3();
            var normal3 = new THREE.Vector3();
            normal1.crossVectors( Vec1, Vec3 );
            normal2.crossVectors( Vec1, Vec2 );
            normal3.crossVectors( Vec3, Vec2 );
            VecNormal.push(normal1)
            VecNormal.push(normal2)
            VecNormal.push(normal3)
        }
        for ( var i = 0; i < VecNormal.length; i ++ ) {
            SkeMesh.Nor.array[ SkeMesh.Count*3-(VecNormal.length-i)*3 ]    = VecNormal[i].x
            SkeMesh.Nor.array[ SkeMesh.Count*3-(VecNormal.length-i)*3 + 1] = VecNormal[i].y
            SkeMesh.Nor.array[ SkeMesh.Count*3-(VecNormal.length-i)*3 + 2] = VecNormal[i].z
        }
    }

    for ( var i = SkeMesh.PtCount*4; i > 0; i -- ) {
        SkeMesh.Col.array[ SkeMesh.Count*4-i ] = 1
    }
    for ( var i = SkeMesh.Struct.length-1; i >= 0; i -- ) {
        SkeMesh.ColH.array[ (SkeMesh.Count - i)*4-4 ] = 0.66 + AnchorAccCol;
        SkeMesh.ColH.array[ (SkeMesh.Count - i)*4-3 ] = 0.66 - AnchorAccCol;
        SkeMesh.ColH.array[ (SkeMesh.Count - i)*4-2 ] = 0.66 - AnchorAccCol;
        SkeMesh.ColH.array[ (SkeMesh.Count - i)*4-1 ] = 1;
    }
    for ( var i = 0; i < SkeMesh.Col.array.length; i+=4 ) {
        if(SkeMesh.Col.array[ i ]     > SkeMesh.ColH.array[i])     SkeMesh.Col.array[ i ] -=0.05;
        if(SkeMesh.Col.array[ i + 1 ] > SkeMesh.ColH.array[i + 1]) SkeMesh.Col.array[ i + 1 ] -=0.05;
        if(SkeMesh.Col.array[ i + 2 ] > SkeMesh.ColH.array[i + 2]) SkeMesh.Col.array[ i + 2 ] -=0.05;
    }
}
function SkeMeshPaperDynamicShift(AnchorAcc, SkeFromKinect, SkeMesh) {
    var AnchorAccCol = Math.abs(AnchorAcc.X) + Math.abs(AnchorAcc.Y) + Math.abs(AnchorAcc.Z)
    if (AnchorAccCol > 2.5) {
        AnchorAccCol = 0.66
    }
    else if (AnchorAccCol <= 0.05) {
        AnchorAccCol = 0
    }
    else {
        AnchorAccCol = 0.66 * AnchorAccCol / 2.5
    }
    interval--;
    if (SkeMesh.FrameCount != 1 && interval < 1) {
        for (var i = 0; i < SkeMesh.Pos.length - SkeMesh.PtCount * 3; i++) {
            SkeMesh.Pos.array[i] = SkeMesh.Pos.array[i + SkeMesh.PtCount * 3];
            SkeMesh.Nor.array[i] = SkeMesh.Nor.array[i + SkeMesh.PtCount * 3];
        }
        for (var i = 0; i < SkeMesh.Col.length - SkeMesh.PtCount * 4; i++) {
            SkeMesh.Col.array[i] = SkeMesh.Col.array[i + SkeMesh.PtCount * 4];
            SkeMesh.ColH.array[i] = SkeMesh.ColH.array[i + SkeMesh.PtCount * 4];
        }
        var Construct = SkeMesh.Struct;
        for (var i = 0; i < Construct.length; i++) {
            if (Construct[i] == parseInt(Construct[i])) {
                SkeMesh.Pos.array[SkeMesh.Count * 3 - (Construct.length - i) * 3] = SkeFromKinect[Construct[i] * 3] * 10
                SkeMesh.Pos.array[SkeMesh.Count * 3 - (Construct.length - i) * 3 + 1] = SkeFromKinect[Construct[i] * 3 + 1] * 10
                SkeMesh.Pos.array[SkeMesh.Count * 3 - (Construct.length - i) * 3 + 2] = SkeFromKinect[Construct[i] * 3 + 2]
            }
            else {
                var tempt = parseInt(Construct[i])
                SkeMesh.Pos.array[SkeMesh.Count * 3 - (Construct.length - i) * 3] = (SkeFromKinect[tempt * 3] + 8 ) * 10
                SkeMesh.Pos.array[SkeMesh.Count * 3 - (Construct.length - i) * 3 + 1] = (SkeFromKinect[tempt * 3 + 1] + 8 ) * 10
                SkeMesh.Pos.array[SkeMesh.Count * 3 - (Construct.length - i) * 3 + 2] = SkeFromKinect[tempt * 3 + 2] + 20
            }
        }
        var VecBase = []
        for (var i = 0; i < Construct.length; i++) {
            var Vec = new THREE.Vector3(SkeFromKinect[parseInt(Construct[i]) * 3], SkeFromKinect[parseInt(Construct[i]) * 3 + 1], SkeFromKinect[parseInt(Construct[i]) * 3 + 2]);
            VecBase.push(Vec)
        }
        var VecNormal = []
        for (var i = 0; i < VecBase.length / 3; i++) {
            var Vec1 = new THREE.Vector3(VecBase[3 * i].x - VecBase[3 * i + 1].x, VecBase[3 * i].y - VecBase[3 * i + 1].y, VecBase[3 * i].z - VecBase[3 * i + 1].z);
            var Vec2 = new THREE.Vector3(VecBase[3 * i + 1].x - VecBase[3 * i + 2].x, VecBase[3 * i + 1].y - VecBase[3 * i + 2].y, VecBase[3 * i + 1].z - VecBase[3 * i + 2].z);
            var Vec3 = new THREE.Vector3(VecBase[3 * i].x - VecBase[3 * i + 2].x, VecBase[3 * i].y - VecBase[3 * i + 2].y, VecBase[3 * i].z - VecBase[3 * i + 2].z);
            var normal1 = new THREE.Vector3();
            var normal2 = new THREE.Vector3();
            var normal3 = new THREE.Vector3();
            normal1.crossVectors(Vec1, Vec3);
            normal2.crossVectors(Vec1, Vec2);
            normal3.crossVectors(Vec3, Vec2);
            VecNormal.push(normal1)
            VecNormal.push(normal2)
            VecNormal.push(normal3)
        }
        for (var i = 0; i < VecNormal.length; i++) {
            SkeMesh.Nor.array[SkeMesh.Count * 3 - (VecNormal.length - i) * 3] = VecNormal[i].x
            SkeMesh.Nor.array[SkeMesh.Count * 3 - (VecNormal.length - i) * 3 + 1] = VecNormal[i].y
            SkeMesh.Nor.array[SkeMesh.Count * 3 - (VecNormal.length - i) * 3 + 2] = VecNormal[i].z
        }

        for (var i = SkeMesh.PtCount * 4; i > 0; i--) {
            SkeMesh.Col.array[SkeMesh.Count * 4 - i] = 1
        }
        for (var i = SkeMesh.Struct.length - 1; i >= 0; i--) {
            SkeMesh.ColH.array[(SkeMesh.Count - i) * 4 - 4] = 0.5 + AnchorAccCol;
            SkeMesh.ColH.array[(SkeMesh.Count - i) * 4 - 3] = 0.8;
            SkeMesh.ColH.array[(SkeMesh.Count - i) * 4 - 2] = 0.8;
            SkeMesh.ColH.array[(SkeMesh.Count - i) * 4 - 1] = 0.1;
        }
        for (var i = 0; i < SkeMesh.Col.array.length; i += 4) {
            if (SkeMesh.Col.array[i] > SkeMesh.ColH.array[i])     SkeMesh.Col.array[i] -= 0.05;
            if (SkeMesh.Col.array[i + 1] > SkeMesh.ColH.array[i + 1]) SkeMesh.Col.array[i + 1] -= 0.05;
            if (SkeMesh.Col.array[i + 2] > SkeMesh.ColH.array[i + 2]) SkeMesh.Col.array[i + 2] -= 0.05;
            if (SkeMesh.Col.array[i + 3] > SkeMesh.ColH.array[i + 3]) SkeMesh.Col.array[i + 3] -= 0.05;
        }
        interval = 7;
    }
    else if (SkeMesh.FrameCount == 1) {
        var Construct = SkeMesh.Struct;
        for (var i = 0; i < Construct.length; i++) {
            if (Construct[i] == parseInt(Construct[i])) {
                SkeMesh.Pos.array[SkeMesh.PtCount * 3 - (Construct.length - i) * 3] = SkeFromKinect[Construct[i] * 3]
                SkeMesh.Pos.array[SkeMesh.PtCount * 3 - (Construct.length - i) * 3 + 1] = SkeFromKinect[Construct[i] * 3 + 1]
                SkeMesh.Pos.array[SkeMesh.PtCount * 3 - (Construct.length - i) * 3 + 2] = SkeFromKinect[Construct[i] * 3 + 2] + 400
            }
            else {
                var tempt = parseInt(Construct[i])
                SkeMesh.Pos.array[SkeMesh.PtCount * 3 - (Construct.length - i) * 3] = SkeFromKinect[tempt * 3] + 8
                SkeMesh.Pos.array[SkeMesh.PtCount * 3 - (Construct.length - i) * 3 + 1] = SkeFromKinect[tempt * 3 + 1] + 8
                SkeMesh.Pos.array[SkeMesh.PtCount * 3 - (Construct.length - i) * 3 + 2] = SkeFromKinect[tempt * 3 + 2] + 2 + 400
            }
        }
        var VecBase = []
        for (var i = 0; i < Construct.length; i++) {
            var Vec = new THREE.Vector3(SkeFromKinect[parseInt(Construct[i]) * 3], SkeFromKinect[parseInt(Construct[i]) * 3 + 1], SkeFromKinect[parseInt(Construct[i]) * 3 + 2]);
            VecBase.push(Vec)
        }
        var VecNormal = []
        for (var i = 0; i < VecBase.length / 3; i++) {
            var Vec1 = new THREE.Vector3(VecBase[3 * i].x - VecBase[3 * i + 1].x, VecBase[3 * i].y - VecBase[3 * i + 1].y, VecBase[3 * i].z - VecBase[3 * i + 1].z);
            var Vec2 = new THREE.Vector3(VecBase[3 * i + 1].x - VecBase[3 * i + 2].x, VecBase[3 * i + 1].y - VecBase[3 * i + 2].y, VecBase[3 * i + 1].z - VecBase[3 * i + 2].z);
            var Vec3 = new THREE.Vector3(VecBase[3 * i].x - VecBase[3 * i + 2].x, VecBase[3 * i].y - VecBase[3 * i + 2].y, VecBase[3 * i].z - VecBase[3 * i + 2].z);
            var normal1 = new THREE.Vector3();
            var normal2 = new THREE.Vector3();
            var normal3 = new THREE.Vector3();
            normal1.crossVectors(Vec1, Vec3);
            normal2.crossVectors(Vec1, Vec2);
            normal3.crossVectors(Vec3, Vec2);
            VecNormal.push(normal1)
            VecNormal.push(normal2)
            VecNormal.push(normal3)
        }
        for (var i = 0; i < VecNormal.length; i++) {
            SkeMesh.Nor.array[SkeMesh.PtCount * 3 - (VecNormal.length - i) * 3] = VecNormal[i].x
            SkeMesh.Nor.array[SkeMesh.PtCount * 3 - (VecNormal.length - i) * 3 + 1] = VecNormal[i].y
            SkeMesh.Nor.array[SkeMesh.PtCount * 3 - (VecNormal.length - i) * 3 + 2] = VecNormal[i].z
        }
        for (var i = Construct.length - 1; i >= 0; i--) {
            SkeMesh.Col.array[(SkeMesh.PtCount - i) * 4 - 4] = 0.33 + AnchorAccCol;
            SkeMesh.Col.array[(SkeMesh.PtCount - i) * 4 - 3] = 0.33 + AnchorAccCol;
            SkeMesh.Col.array[(SkeMesh.PtCount - i) * 4 - 2] = 0.33 + AnchorAccCol;
            SkeMesh.Col.array[(SkeMesh.PtCount - i) * 4 - 1] = 1;
        }

    }
}

function SkeMeshRP(FrameCount, SkeMeshBase, MeshType){
    if(SkeMeshBase.FrameCount != 1){
    }
    else{
        this.Geo = new THREE.BufferGeometry();
        this.Pos = new THREE.BufferAttribute( new Float32Array( FrameCount*SkeMeshBase.PtCount * 3 ), 3 );
        this.Nor = new THREE.BufferAttribute( new Float32Array( FrameCount*SkeMeshBase.PtCount * 3 ), 3 );
        this.Col = new THREE.BufferAttribute(new Float32Array( FrameCount*SkeMeshBase.PtCount * 4 ), 4 );
        this.PosH = new THREE.BufferAttribute( new Float32Array( FrameCount*SkeMeshBase.PtCount * 3 ), 3 );
        this.NorH = new THREE.BufferAttribute( new Float32Array( FrameCount*SkeMeshBase.PtCount * 3 ), 3 );
        this.ColH = new THREE.BufferAttribute(new Float32Array( FrameCount*SkeMeshBase.PtCount * 4 ), 4 );
        this.PosShow = new THREE.BufferAttribute( new Float32Array( SkeMeshBase.PtCount * 3 ), 3 );
        this.NorShow = new THREE.BufferAttribute( new Float32Array( SkeMeshBase.PtCount * 3 ), 3 );
        this.ColShow = new THREE.BufferAttribute(new Float32Array( SkeMeshBase.PtCount * 4 ), 4 );
        this.Index = SkeMeshBase.Index;
        this.Struct = SkeMeshBase.Struct;
        this.FrameCount = FrameCount;
        this.PtCount = SkeMeshBase.PtCount;
        this.Count = SkeMeshBase.PtCount * FrameCount;
        if(MeshType == false){
            this.Material = new THREE.MeshPhongMaterial( {
                color: 0xaaaaaa, specular: 0xffffff , shininess: 250 , side: THREE.DoubleSide, vertexColors: THREE.VertexColors, shading: THREE.FlatShading, wireframe: true , wireframeLinewidth: 10
            } );
        }
        if(MeshType == true){
            this.Material = new THREE.MeshPhongMaterial( {
                color: 0xaaaaaa, specular: 0xffffff , shininess: 250 , side: THREE.DoubleSide, vertexColors: THREE.VertexColors, shading: THREE.FlatShading
            } );
        }
    }
}
function SkeMeshRPData(SkeMeshRP){
    for ( var i = 0; i < SkeMeshRP.Pos.length/3; i ++ ) {
        SkeMeshRP.Pos.setXYZ( i,  0 , 0 , 0  );
        SkeMeshRP.Nor.setXYZ( i,  0 , 0 , 0  );
    }
    for ( var i = 0; i < SkeMeshRP.Col.length/4; i ++ ) {
        SkeMeshRP.Col.setXYZW( i,  1 , 1 , 1 , 1);
    }
}
function SkeMeshRPCreate(SkeMeshRP,scene){
    if (SkeMeshRP.Hybrid == false) {
        for ( var i = 0; i < SkeMeshRP.Pos.length/3; i ++ ) {
            SkeMeshRP.Pos.setXYZ( i,  0 , 0 , 0  );
            SkeMeshRP.Nor.setXYZ( i,  0 , 0 , 0  );
        }
        for ( var i = 0; i < SkeMeshRP.Col.length/4; i ++ ) {
            SkeMeshRP.Col.setXYZW( i,  1 , 1 , 1 , 1);
            SkeMeshRP.ColH.setXYZW( i,  1 , 1 , 1 , 1);
        }
        SkeMeshRP.Geo.addAttribute( 'position', SkeMeshRP.Pos );
        SkeMeshRP.Geo.addAttribute( 'normal', SkeMeshRP.Nor );
        SkeMeshRP.Geo.addAttribute( 'color', SkeMeshRP.Col );
        SkeMeshRP.Geo.addAttribute( 'index', SkeMeshRP.Index );
        var SkeMeshRPFin = new THREE.Mesh( SkeMeshRP.Geo, SkeMeshRP.Material );
        SkeMeshRPFin.castShadow = true;
        SkeMeshRPFin.receiveShadow = true;
        scene.add( SkeMeshRPFin );
    }
    else if (SkeMeshRP.Hybrid == true) {
        for (var i = 0; i < SkeMeshRP.Pos.length / 3; i++) {
            SkeMeshRP.Pos.setXYZ(i, 0, 0, 0);
            SkeMeshRP.Nor.setXYZ(i, 0, 0, 0);
        }
        for (var i = 0; i < SkeMeshRP.Col.length / 4; i++) {
            SkeMeshRP.Col.setXYZW(i, 1, 1, 1, 1);
        }
        SkeMeshRP.Geo.addAttribute('position', SkeMeshRP.Pos);
        SkeMeshRP.Geo.addAttribute('normal', SkeMeshRP.Nor);
        SkeMeshRP.Geo.addAttribute('color', SkeMeshRP.Col);
        SkeMeshRP.Geo.addAttribute('index', SkeMeshRP.Index);
        var SkeMeshRPFin = new THREE.Mesh(SkeMeshRP.Geo, SkeMeshRP.Material);
        SkeMeshRPFin.castShadow = true;
        SkeMeshRPFin.receiveShadow = true;
        scene.add(SkeMeshRPFin);

        for (var i = 0; i < SkeMeshRP.PosSub.length / 3; i++) {
            SkeMeshRP.PosSub.setXYZ(i, 0, 0, 0);
        }
        for (var i = 0; i < SkeMeshRP.ColSub.length / 4; i++) {
            SkeMeshRP.ColSub.setXYZW(i, 1, 1, 1, 1);
        }
        SkeMeshRP.GeoSub.addAttribute('position', SkeMeshRP.PosSub);
        SkeMeshRP.GeoSub.addAttribute('color', SkeMeshRP.ColSub);
        SkeMeshRP.GeoSub.addAttribute('index', SkeMeshRP.IndexSub);
        var SkeMeshRPSubFin = new THREE.Line(SkeMeshRP.GeoSub, SkeMeshRP.MaterialSub);
        scene.add(SkeMeshRPSubFin);
    }
}
function SkeMeshRPDataDynamic(AnchorAcc,SkeFromKinect,SkeMesh){

    var AnchorAccCol = Math.abs(AnchorAcc.X) + Math.abs(AnchorAcc.Y) + Math.abs(AnchorAcc.Z)
    if(AnchorAccCol > 2.5){
        AnchorAccCol = 0.66
    }
    else if (AnchorAccCol <= 0.05){
        AnchorAccCol = 0
    }
    else{
        AnchorAccCol = 0.66 * AnchorAccCol/2.5
    }

    for ( var i = 0; i < SkeMesh.Pos.length - SkeMesh.PtCount*3; i ++ ) {
        SkeMesh.Pos.array[ i ] = SkeMesh.Pos.array[ i+SkeMesh.PtCount*3 ];
        SkeMesh.Nor.array[ i ] = SkeMesh.Nor.array[ i+SkeMesh.PtCount*3 ];
    }
    for ( var i = 0; i < SkeMesh.Col.length - SkeMesh.PtCount*4; i ++ ) {
        SkeMesh.Col.array[ i ] = SkeMesh.Col.array[ i+SkeMesh.PtCount*4 ];
        SkeMesh.ColH.array[ i ] = SkeMesh.ColH.array[ i+SkeMesh.PtCount*4 ];
    }

    var Construct = SkeMesh.Struct;
    for ( var i = 0; i < SkeMesh.Struct.length; i ++ ) {
        if( Construct[i] == parseInt(Construct[i]) ){
            SkeMesh.Pos.array[ SkeMesh.Count*3-(Construct.length-i)*3 ]    = SkeFromKinect[Construct[i]*3]
            SkeMesh.Pos.array[ SkeMesh.Count*3-(Construct.length-i)*3 + 1] = SkeFromKinect[Construct[i]*3 + 1]
            SkeMesh.Pos.array[ SkeMesh.Count*3-(Construct.length-i)*3 + 2] = SkeFromKinect[Construct[i]*3 + 2]
        }
        else{
            var tempt = parseInt(Construct[i])
            SkeMesh.Pos.array[ SkeMesh.Count*3-(Construct.length-i)*3 ]    = (SkeFromKinect[tempt*3] + 8 )
            SkeMesh.Pos.array[ SkeMesh.Count*3-(Construct.length-i)*3 + 1] = (SkeFromKinect[tempt*3 + 1] + 8 )
            SkeMesh.Pos.array[ SkeMesh.Count*3-(Construct.length-i)*3 + 2] = SkeFromKinect[tempt*3 + 2] + 20
        }
    }
    ////
    if(SkeMesh.StructSub){
        var ConstructSub = SkeMesh.StructSub;
        for ( var i = 0; i < ConstructSub.length; i ++ ) {
            SkeMesh.PosSub.array[ SkeMesh.CountSub*3-(ConstructSub.length-i)*3 ]    = SkeFromKinect[ConstructSub[i]*3]
            SkeMesh.PosSub.array[ SkeMesh.CountSub*3-(ConstructSub.length-i)*3 + 1] = SkeFromKinect[ConstructSub[i]*3 + 1]
            SkeMesh.PosSub.array[ SkeMesh.CountSub*3-(ConstructSub.length-i)*3 + 2] = SkeFromKinect[ConstructSub[i]*3 + 2]
        }
    }
    ////
    var VecBase = []
    for ( var i = 0; i < Construct.length; i ++ ) {
        var Vec = new THREE.Vector3( SkeFromKinect[parseInt(Construct[i])*3], SkeFromKinect[parseInt(Construct[i])*3 + 1], SkeFromKinect[parseInt(Construct[i])*3 + 2] );
        VecBase.push(Vec)
    }
    var VecNormal = []
    for ( var i = 0; i < VecBase.length/3; i ++ ) {
        var Vec1 = new THREE.Vector3( VecBase[3*i].x - VecBase[3*i+1].x, VecBase[3*i].y - VecBase[3*i+1].y, VecBase[3*i].z - VecBase[3*i+1].z );
        var Vec2 = new THREE.Vector3( VecBase[3*i+1].x - VecBase[3*i+2].x, VecBase[3*i+1].y - VecBase[3*i+2].y, VecBase[3*i+1].z - VecBase[3*i+2].z );
        var Vec3 = new THREE.Vector3( VecBase[3*i].x - VecBase[3*i+2].x, VecBase[3*i].y - VecBase[3*i+2].y, VecBase[3*i].z - VecBase[3*i+2].z );
        var normal1 = new THREE.Vector3();
        var normal2 = new THREE.Vector3();
        var normal3 = new THREE.Vector3();
        normal1.crossVectors( Vec1, Vec3 );
        normal2.crossVectors( Vec1, Vec2 );
        normal3.crossVectors( Vec3, Vec2 );
        VecNormal.push(normal1)
        VecNormal.push(normal2)
        VecNormal.push(normal3)
    }
    for ( var i = 0; i < VecNormal.length; i ++ ) {
        SkeMesh.Nor.array[ SkeMesh.Count*3-(VecNormal.length-i)*3 ]    = VecNormal[i].x
        SkeMesh.Nor.array[ SkeMesh.Count*3-(VecNormal.length-i)*3 + 1] = VecNormal[i].y
        SkeMesh.Nor.array[ SkeMesh.Count*3-(VecNormal.length-i)*3 + 2] = VecNormal[i].z
    }

    for ( var i = SkeMesh.PtCount*4; i > 0; i -- ) {
        SkeMesh.Col.array[ SkeMesh.Count*4-i ] = 1
    }
    for ( var i = SkeMesh.Struct.length-1; i >= 0; i -- ) {
        SkeMesh.ColH.array[ (SkeMesh.Count - i)*4-4 ] = 0.5 + AnchorAccCol;
        SkeMesh.ColH.array[ (SkeMesh.Count - i)*4-3 ] = 0.8;
        SkeMesh.ColH.array[ (SkeMesh.Count - i)*4-2 ] = 0.8;
        SkeMesh.ColH.array[ (SkeMesh.Count - i)*4-1 ] = 0.1;
    }
    for ( var i = 0; i < SkeMesh.Col.array.length; i+=4 ) {
        if(SkeMesh.Col.array[ i ]     > SkeMesh.ColH.array[i])     SkeMesh.Col.array[ i ] -=0.05;
        if(SkeMesh.Col.array[ i + 1 ] > SkeMesh.ColH.array[i + 1]) SkeMesh.Col.array[ i + 1 ] -=0.05;
        if(SkeMesh.Col.array[ i + 2 ] > SkeMesh.ColH.array[i + 2]) SkeMesh.Col.array[ i + 2 ] -=0.05;
        if(SkeMesh.Col.array[ i + 3 ] > SkeMesh.ColH.array[i + 3]) SkeMesh.Col.array[ i + 3 ] -=0.05;
    }
}
function SkeMeshRPCapture(AnchorAcc,SkeMesh,SkeMeshRP,CrowdBool){
    var trigger = rightWrist.Y;
    if(trigger > 220.0 && RecSwitch == 0 && intervalRP == 100){
        RecSwitch = 1;
        intervalRP = 0;
    }
    if(intervalRP < 100){
        intervalRP++;
    }
    if(SkeMesh.Pos.array[0]!=0){
        if(RPChangeUpdate == -1 && intervalRP == 100 && RecSwitch == 1){
            for ( var i = 0; i < SkeMesh.Pos.length; i ++ ) {
                SkeMeshRP[RPChangeUpdate+1].Pos.array[ SkeMeshRP[RPChangeUpdate+1].Count * 3 - SkeMesh.Pos.length + i ] = SkeMesh.Pos.array[ i ];
                SkeMeshRP[RPChangeUpdate+1].Nor.array[ SkeMeshRP[RPChangeUpdate+1].Count * 3 - SkeMesh.Nor.length + i ] = SkeMesh.Nor.array[ i ];
            }
            if(SkeMeshRP[RPChangeUpdate+1].Pos.array[ 0 ] != 0 && CrowdBool == true){
                var Dice1 = Math.random()
                var Dice2 = Math.random()
                SkeRP(SkeMeshRP[RPChangeUpdate+1],Dice1,Dice2)
            }
            RPChangeUpdate ++;
            RecSwitch = 0;
        }
        else if(RPChangeUpdate == 0 && intervalRP == 100 && RecSwitch == 1){
            for ( var i = 0; i < SkeMesh.Pos.length; i ++ ) {
                SkeMeshRP[RPChangeUpdate+1].Pos.array[ SkeMeshRP[RPChangeUpdate+1].Count * 3 - SkeMesh.Pos.length + i ] = SkeMesh.Pos.array[ i ];
                SkeMeshRP[RPChangeUpdate+1].Nor.array[ SkeMeshRP[RPChangeUpdate+1].Count * 3 - SkeMesh.Nor.length + i ] = SkeMesh.Nor.array[ i ];
            }
            if(SkeMeshRP[RPChangeUpdate+1].Pos.array[ 0 ] != 0 && CrowdBool == true){
                var Dice1 = Math.random()
                var Dice2 = Math.random()
                SkeRP(SkeMeshRP[RPChangeUpdate+1],Dice1,Dice2)
            }
            RPChangeUpdate ++;
            RecSwitch = 0;
        }
        else if(RPChangeUpdate == 1 && intervalRP == 100 && RecSwitch == 1){
            for ( var i = 0; i < SkeMesh.Pos.length; i ++ ) {
                SkeMeshRP[RPChangeUpdate+1].Pos.array[ SkeMeshRP[RPChangeUpdate+1].Count * 3 - SkeMesh.Pos.length + i ] = SkeMesh.Pos.array[ i ];
                SkeMeshRP[RPChangeUpdate+1].Nor.array[ SkeMeshRP[RPChangeUpdate+1].Count * 3 - SkeMesh.Nor.length + i ] = SkeMesh.Nor.array[ i ];
            }
            if(SkeMeshRP[RPChangeUpdate+1].Pos.array[ 0 ] != 0 && CrowdBool == true){
                var Dice1 = Math.random()
                var Dice2 = Math.random()
                SkeRP(SkeMeshRP[RPChangeUpdate+1],Dice1,Dice2)
            }
            RPChangeUpdate ++;
            RecSwitch = 0;
        }
        else if(RPChangeUpdate == 2 && intervalRP == 100 && RecSwitch == 1){
            for ( var i = 0; i < SkeMesh.Pos.length; i ++) {
                SkeMeshRP[0].Pos.array[ SkeMeshRP[0].Count * 3 - SkeMesh.Pos.length + i ] = SkeMesh.Pos.array[ i ];
                SkeMeshRP[0].Nor.array[ SkeMeshRP[0].Count * 3 - SkeMesh.Nor.length + i ] = SkeMesh.Nor.array[ i ];
            }
            if(SkeMeshRP[0].Pos.array[ 0 ] != 0 && CrowdBool == true){
                var Dice1 = Math.random()
                var Dice2 = Math.random()
                SkeRP(SkeMeshRP[0],Dice1,Dice2)
            }
            RecSwitch = 0;
            RPChangeUpdate = 0;
        }
    }
    function SkeRP(SkeMeshRP,Dice1,Dice2){
        if(Dice1 < 0.5){
            var xHolder = []
            if(Dice2 < 0.25){
                // Go Normal
            }
            else if(Dice2 >= 0.25 && Dice2 < 0.5){
                // Flip x
                for ( var i = 0; i < SkeMeshRP.Pos.length/3; i ++ ) {
                    xHolder.push(SkeMeshRP.Pos.array[ 3*i ])
                }
                var xMax = Math.max.apply(Math,xHolder);
                var xMin = Math.min.apply(Math,xHolder);
                var target;
                if(xMax > 0 && xMin > 0){
                    target = Math.random()*(xMax - xMin)*0.5 + xMin;
                }
                else if(xMax < 0 && xMin < 0){
                    target = Math.random()*(xMax - xMin)*0.5 + xMin;
                }
                else{
                    target = Math.random()*1000 - 500;
                }
                for ( var i = 0; i < SkeMeshRP.Pos.length/3; i ++ ) {
                    SkeMeshRP.Pos.array[ 3*i ] = 2*target - SkeMeshRP.PosH.array[ 3*i ];
                    SkeMeshRP.Nor.array[ 3*i ] = 2*target - SkeMeshRP.NorH.array[ 3*i ];
                }
            }
            else if(Dice2 >= 0.5 && Dice2 < 0.75){
                // Flip y
                var target = Math.random()*300 - 150;
                for ( var i = 0; i < SkeMeshRP.Pos.length/3; i ++ ) {
                    SkeMeshRP.Pos.array[ 3*i + 1 ] = 2*target - SkeMeshRP.PosH.array[ 3*i + 1 ];
                    SkeMeshRP.Nor.array[ 3*i + 1 ] = 2*target - SkeMeshRP.NorH.array[ 3*i + 1 ];
                }
            }
            else if(Dice2 >= 0.75){
                // Flip x & y
                for ( var i = 0; i < SkeMeshRP.Pos.length/3; i ++ ) {
                    xHolder.push(SkeMeshRP.Pos.array[ 3*i ])
                }
                var xMax = Math.max.apply(Math,xHolder);
                var xMin = Math.min.apply(Math,xHolder);
                var target1;
                if(xMax > 0 && xMin > 0){
                    target1 = Math.random()*(xMax - xMin)*0.5 + xMin;
                }
                else if(xMax < 0 && xMin < 0){
                    target1 = Math.random()*(xMax - xMin)*0.5 + xMin;
                }
                else{
                    target1 = Math.random()*1000 - 500;
                }
                var target2 = Math.random()*300 - 150;

                for ( var i = 0; i < SkeMeshRP.Pos.length/3; i ++ ) {
                    SkeMeshRP.Pos.array[ 3*i ]     = 2*target1 - SkeMeshRP.PosH.array[ 3*i ];
                    SkeMeshRP.Pos.array[ 3*i + 1 ] = 2*target2 - SkeMeshRP.PosH.array[ 3*i + 1 ];
                    SkeMeshRP.Nor.array[ 3*i ]     = 2*target1 - SkeMeshRP.NorH.array[ 3*i ];
                    SkeMeshRP.Nor.array[ 3*i + 1 ] = 2*target2 - SkeMeshRP.NorH.array[ 3*i + 1 ];
                }
            }
        }
        else if(Dice1 >= 0.5){
            for ( var i = 0; i < SkeMeshRP.Pos.length/3; i ++ ) {
                SkeMeshRP.Pos.array[ 3*i ]     = SkeMeshRP.Pos.array[ 3*(SkeMeshRP.Pos.array.length/3-1-i) ];
                SkeMeshRP.Pos.array[ 3*i + 1 ] = SkeMeshRP.Pos.array[ 3*(SkeMeshRP.Pos.array.length/3-1-i) + 1 ];
                SkeMeshRP.Pos.array[ 3*i + 2 ] = SkeMeshRP.Pos.array[ 3*(SkeMeshRP.Pos.array.length/3-1-i) + 2 ];
                SkeMeshRP.Nor.array[ 3*i ]     = SkeMeshRP.Nor.array[ 3*(SkeMeshRP.Nor.array.length/3-1-i) ];
                SkeMeshRP.Nor.array[ 3*i + 1 ] = SkeMeshRP.Nor.array[ 3*(SkeMeshRP.Nor.array.length/3-1-i) + 1 ];
                SkeMeshRP.Nor.array[ 3*i + 2 ] = SkeMeshRP.Nor.array[ 3*(SkeMeshRP.Nor.array.length/3-1-i) + 2 ];
            }
            for ( var i = 0; i < SkeMeshRP.Pos.length; i ++ ) {
                SkeMeshRP.PosH.array[ i ] = SkeMeshRP.Pos.array[ i ];
                SkeMeshRP.NorH.array[ i ] = SkeMeshRP.Nor.array[ i ];
            }
            var xHolder = []
            if(Dice2 < 0.25){
                // Go Normal
            }
            else if(Dice2 >= 0.25 && Dice2 < 0.5){
                // Flip x
                for ( var i = 0; i < SkeMeshRP.Pos.length/3; i ++ ) {
                    xHolder.push(SkeMeshRP.Pos.array[ 3*i ])
                }
                var xMax = Math.max.apply(Math,xHolder);
                var xMin = Math.min.apply(Math,xHolder);
                var target;
                if(xMax > 0 && xMin > 0){
                    target = Math.random()*(xMax - xMin)*0.5 + xMin;
                }
                else if(xMax < 0 && xMin < 0){
                    target = Math.random()*(xMax - xMin)*0.5 + xMin;
                }
                else{
                    target = Math.random()*1000 - 500;
                }
                for ( var i = 0; i < SkeMeshRP.Pos.length/3; i ++ ) {
                    SkeMeshRP.Pos.array[ 3*i ] = 2*target - SkeMeshRP.PosH.array[ 3*i ];
                    SkeMeshRP.Nor.array[ 3*i ] = 2*target - SkeMeshRP.NorH.array[ 3*i ];
                }
            }
            else if(Dice2 >= 0.5 && Dice2 < 0.75){
                // Flip y
                var target = Math.random()*300 - 150;

                for ( var i = 0; i < SkeMeshRP.Pos.length/3; i ++ ) {
                    SkeMeshRP.Pos.array[ 3*i + 1 ] = 2*target - SkeMeshRP.PosH.array[ 3*i + 1 ];
                    SkeMeshRP.Nor.array[ 3*i + 1 ] = 2*target - SkeMeshRP.NorH.array[ 3*i + 1 ];
                }
            }
            else if(Dice2 >= 0.75){
                // Flip x & y
                for ( var i = 0; i < SkeMeshRP.Pos.length/3; i ++ ) {
                    xHolder.push(SkeMeshRP.Pos.array[ 3*i ])
                }
                var xMax = Math.max.apply(Math,xHolder);
                var xMin = Math.min.apply(Math,xHolder);
                var target1;
                if(xMax > 0 && xMin > 0){
                    target1 = Math.random()*(xMax - xMin)*0.5 + xMin;
                }
                else if(xMax < 0 && xMin < 0){
                    target1 = Math.random()*(xMax - xMin)*0.5 + xMin;
                }
                else{
                    target1 = Math.random()*1000 - 500;
                }
                var target2 = Math.random()*300 - 150;

                for ( var i = 0; i < SkeMeshRP.Pos.length/3; i ++ ) {
                    SkeMeshRP.Pos.array[ 3*i ]     = 2*target1 - SkeMeshRP.PosH.array[ 3*i ];
                    SkeMeshRP.Pos.array[ 3*i + 1 ] = 2*target2 - SkeMeshRP.PosH.array[ 3*i + 1 ];
                    SkeMeshRP.Nor.array[ 3*i ]     = 2*target1 - SkeMeshRP.NorH.array[ 3*i ];
                    SkeMeshRP.Nor.array[ 3*i + 1 ] = 2*target2 - SkeMeshRP.NorH.array[ 3*i + 1 ];
                }
            }
        }
    }
}
function SkeMeshMultiRPplay(SkeMeshRP){
    if(SkeMeshRP.Pos.array[0]!=0){
        var PosTempt = new THREE.BufferAttribute( new Float32Array( SkeMeshRP.Count * 3 ), 3 );
        var NorTempt = new THREE.BufferAttribute( new Float32Array( SkeMeshRP.Count * 3 ), 3 );
        for ( var i = 0; i < PosTempt.array.length; i ++ ) {
            PosTempt.array[i] = SkeMeshRP.Pos.array[i]
            NorTempt.array[i] = SkeMeshRP.Nor.array[i]
        }
        for ( var i = 0; i < PosTempt.array.length - SkeMeshRP.PosShow.length; i ++ ) {
            SkeMeshRP.Pos.array[i] = SkeMeshRP.Pos.array[i+SkeMeshRP.PosShow.length]
            SkeMeshRP.Nor.array[i] = SkeMeshRP.Nor.array[i+SkeMeshRP.NorShow.length]
        }
        for ( var i = SkeMeshRP.PosShow.length; i > 0; i -- ) {
            SkeMeshRP.Pos.array[SkeMeshRP.Pos.length - i] = PosTempt.array[SkeMeshRP.PosShow.length-i]
            SkeMeshRP.Nor.array[SkeMeshRP.Nor.length - i] = NorTempt.array[SkeMeshRP.PosShow.length-i]
        }

        for ( var i = 0; i < SkeMeshRP.Col.length-SkeMeshRP.PtCount*4; i ++ ) {
            SkeMeshRP.Col.array[i] = SkeMeshRP.Col.array[i + SkeMeshRP.PtCount*4]
        }
        for ( var i = SkeMeshRP.PtCount; i > 0; i -- ) {
            SkeMeshRP.Col.array[SkeMeshRP.Col.array.length - 4*i] = 1
            SkeMeshRP.Col.array[SkeMeshRP.Col.array.length - 4*i + 1] = 1
            SkeMeshRP.Col.array[SkeMeshRP.Col.array.length - 4*i + 2] = 1
        }
        for ( var i = 0; i < (SkeMeshRP.Col.length-SkeMeshRP.PtCount*4)/4; i ++ ) {
            if(SkeMeshRP.Col.array[4*i] > 0.9 )SkeMeshRP.Col.array[4*i] -= 0.02
            if(SkeMeshRP.Col.array[4*i + 1]> 0.9 )SkeMeshRP.Col.array[4*i + 1] -= 0.02
            if(SkeMeshRP.Col.array[4*i + 2]> 0.9 )SkeMeshRP.Col.array[4*i + 2] -= 0.02
        }

    }
}

function SkeMeshCrowd(CrowdCount,SkeMeshRP){

    this.Geo = new THREE.BufferGeometry();
    this.Pos = new THREE.BufferAttribute( new Float32Array(CrowdCount*SkeMeshRP.Pos.length ), 3 );
    this.Nor = new THREE.BufferAttribute( new Float32Array(CrowdCount*SkeMeshRP.Nor.length ), 3 );
    this.Col = new THREE.BufferAttribute( new Float32Array(CrowdCount*SkeMeshRP.Col.length ), 4 );
    this.PosShow = new THREE.BufferAttribute( new Float32Array( CrowdCount*SkeMeshRP.PosShow.length ), 3 );
    this.NorShow = new THREE.BufferAttribute( new Float32Array( CrowdCount*SkeMeshRP.NorShow.length ), 3 );
    this.ColShow = new THREE.BufferAttribute( new Float32Array( CrowdCount*SkeMeshRP.ColShow.length ), 4 );
    //
    var IndexShow = new THREE.BufferAttribute( new Uint32Array ( CrowdCount*SkeMeshRP.Index.length ), 1 );
    var largest = SkeMeshRP.Index.array[0];
    for (var i = 0; i < SkeMeshRP.Index.length; i++) {
        if (largest < SkeMeshRP.Index.array[i] ) {
            largest = SkeMeshRP.Index.array[i];
            largest ++;
        }
    }
    for ( var j = 0; j < CrowdCount; j ++ ) {
        for ( var i = 0; i < SkeMeshRP.Index.length; i ++ ) {
            IndexShow.array[j*SkeMeshRP.Index.length+i] =  SkeMeshRP.Index.array[i] + j*largest;
        }
    }
    this.Index = IndexShow;
    this.Material = SkeMeshRP.Material;
    this.Count = CrowdCount * SkeMeshRP.Count;
    this.CrowdCount = CrowdCount;
}
function SkeMeshCrowdCreate(SkeMeshRP,scene){
    for ( var i = 0; i < SkeMeshRP.Pos.length/3; i ++ ) {
        SkeMeshRP.Pos.setXYZ( i,  0 , 0 , 0  );
        SkeMeshRP.Nor.setXYZ( i,  0 , 0 , 0  );
    }
    for ( var i = 0; i < SkeMeshRP.Col.length/4; i ++ ) {
        SkeMeshRP.Col.setXYZW( i,  1 , 1 , 1 , 1);
    }
    //
    for ( var i = 0; i < SkeMeshRP.PosShow.length/3; i ++ ) {
        SkeMeshRP.PosShow.setXYZ( i,  0 , 0 , 0  );
        SkeMeshRP.NorShow.setXYZ( i,  0 , 0 , 0  );
    }
    for ( var i = 0; i < SkeMeshRP.ColShow.length/4; i ++ ) {
        SkeMeshRP.ColShow.setXYZW( i,  1 , 1 , 1 , 1);
    }
    SkeMeshRP.Geo.addAttribute( 'position', SkeMeshRP.PosShow );
    SkeMeshRP.Geo.addAttribute( 'normal', SkeMeshRP.NorShow );
    SkeMeshRP.Geo.addAttribute( 'color', SkeMeshRP.ColShow );
    SkeMeshRP.Geo.addAttribute( 'index', SkeMeshRP.Index );
    var SkeMeshRPFin = new THREE.Mesh( SkeMeshRP.Geo, SkeMeshRP.Material );
    SkeMeshRPFin.castShadow = true;
    SkeMeshRPFin.receiveShadow = true;
    scene.add( SkeMeshRPFin );
}
function SkeMeshRPCrowdCapture(AnchorAcc,SkeMesh,SkeMeshCrowd,CrowdBool){
    if(intervalRP < 80) intervalRP++;
    if(SkeMesh.Pos.array[0]!=0){
        if(intervalRP == 80){
            if(CrowdBool == true){
                var Dice = Math.random();
                SkeCRP(SkeMesh,Dice);
            }
            for ( var i = 0; i < SkeMeshCrowd.Pos.length - SkeMesh.Pos.length; i ++ ) {
                SkeMeshCrowd.Pos.array[i] = SkeMeshCrowd.Pos.array[i + SkeMesh.Pos.length];
                SkeMeshCrowd.Nor.array[i] = SkeMeshCrowd.Nor.array[i + SkeMesh.Pos.length];
            }
            for ( var i = 0; i < SkeMesh.Pos.length; i ++ ) {
                SkeMeshCrowd.Pos.array[SkeMeshCrowd.Pos.length - SkeMesh.Pos.length + i] = SkeMesh.Pos.array[ i ];
                SkeMeshCrowd.Nor.array[SkeMeshCrowd.Nor.length - SkeMesh.Nor.length + i] = SkeMesh.Nor.array[ i ];
            }
            intervalRP = 0;
        }
    }
    //
    function SkeCRP(SkeMeshRP,Dice){



        var xHolder = [];
        var yHolder = [];
        var zHolder = [];
        for ( var i = 0; i < SkeMeshRP.Pos.length/3; i ++ ) {
            xHolder.push(SkeMeshRP.Pos.array[ 3*i ]);
            yHolder.push(SkeMeshRP.Pos.array[ 3*i + 1]);
            zHolder.push(SkeMeshRP.Pos.array[ 3*i + 2 ])
        }
        var xAvg = [];
        var yAvg = [];
        var zAvg = [];
        for ( var i = 0; i < SkeMeshRP.FrameCount; i ++ ) {
            var xHolderT = [];
            var yHolderT = [];
            var zHolderT = [];
            for ( var j = 0; j < xHolder.length/SkeMeshRP.FrameCount; j ++ ) {
                xHolderT.push(xHolder[ xHolder.length/SkeMeshRP.FrameCount*i + j ]);
                yHolderT.push(yHolder[ yHolder.length/SkeMeshRP.FrameCount*i + j ]);
                zHolderT.push(zHolder[ zHolder.length/SkeMeshRP.FrameCount*i + j ]);
            }
            var xMax = Math.max.apply(Math,xHolderT);
            var xMin = Math.min.apply(Math,xHolderT);
            var xAvgT = (xMax + xMin) / 2.0;
            xAvg.push(xAvgT);
            var yMax = Math.max.apply(Math,yHolderT);
            var yMin = Math.min.apply(Math,yHolderT);
            var yAvgT = (yMax + yMin) / 2.0;
            yAvg.push(yAvgT);
            var zMax = Math.max.apply(Math,zHolderT);
            var zMin = Math.min.apply(Math,zHolderT);
            var zAvgT = (zMax + zMin) / 2.0;
            zAvg.push(zAvgT);
        }

        var scale = (Math.random() + 0.4 ) / 2 ;
        for ( var i = 0; i < xAvg.length; i ++ ) {
            for ( var j = 0; j < xHolder.length/xAvg.length; j ++ ) {
                xHolder[i * xHolder.length/xAvg.length + j] = scale*(xHolder[i * xHolder.length/xAvg.length + j] - xAvg[i] ) + xAvg[i];
                yHolder[i * yHolder.length/yAvg.length + j] = scale*(yHolder[i * yHolder.length/yAvg.length + j] - yAvg[i] ) + yAvg[i];
                zHolder[i * zHolder.length/zAvg.length + j] = scale*(zHolder[i * zHolder.length/zAvg.length + j] - zAvg[i] ) + zAvg[i];
            }
        }

        if(Dice < 0.1){
        }
        else if(Dice >= 0.2 && Dice < 0.5){
            var xHolderT = [];
            var zHolderT = [];
            for ( var i = 0; i < xAvg.length; i ++ ) {
                for ( var j = 0; j < xHolder.length/xAvg.length; j ++ ) {
                    var Qx = -xHolder[i * xHolder.length/xAvg.length + j] + 2*xAvg[i];
                    var Qz = -zHolder[i * zHolder.length/zAvg.length + j] + 2*zAvg[i];
                    xHolderT.push (Qx);
                    zHolderT.push (Qz);
                }
            }
            for ( var i = 0; i < SkeMeshRP.Pos.length/3; i ++ ) {
                SkeMeshRP.Pos.array[ 3*i ] = xHolderT[i];
                SkeMeshRP.Pos.array[ 3*i + 1] = yHolder[i];
                SkeMeshRP.Pos.array[ 3*i + 2] = zHolderT[i];
            }
            //
            for ( var i = 0; i < SkeMeshRP.Nor.length; i ++ ) {
                SkeMeshRP.Nor.array[ i ] = 0;
            }
            for ( var j = 0; j < SkeMeshRP.Pos.length/9; j ++ ) {
                var VecBase = []
                for ( var i = 0; i < 3; i ++ ) {
                    var Vec = new THREE.Vector3( SkeMeshRP.Pos.array[j*9 + 3*i], SkeMeshRP.Pos.array[j*9 + 3*i + 1], SkeMeshRP.Pos.array[j*9 + 3*i + 2]);
                    VecBase.push(Vec);
                }
                var VecNormal = []
                var Vec1 = new THREE.Vector3( VecBase[0].x - VecBase[1].x, VecBase[0].y - VecBase[1].y, VecBase[0].z - VecBase[1].z );
                var Vec2 = new THREE.Vector3( VecBase[1].x - VecBase[2].x, VecBase[1].y - VecBase[2].y, VecBase[1].z - VecBase[2].z );
                var Vec3 = new THREE.Vector3( VecBase[0].x - VecBase[2].x, VecBase[0].y - VecBase[2].y, VecBase[0].z - VecBase[2].z );
                var normal1 = new THREE.Vector3();
                var normal2 = new THREE.Vector3();
                var normal3 = new THREE.Vector3();
                normal1.crossVectors( Vec1, Vec3 );
                normal2.crossVectors( Vec1, Vec2 );
                normal3.crossVectors( Vec3, Vec2 );
                VecNormal.push(normal1)
                VecNormal.push(normal2)
                VecNormal.push(normal3)
                for ( var i = 0; i < 3; i ++ ) {
                    SkeMeshRP.Nor.array[ j*9 + 3*i ]    = VecNormal[i].x
                    SkeMeshRP.Nor.array[ j*9 + 3*i  + 1] = VecNormal[i].y
                    SkeMeshRP.Nor.array[ j*9 + 3*i  + 2] = VecNormal[i].z
                }
            }
        }
        else if(Dice >= 0.5){
            var transx = 1800 * (Math.random() - 0.5);
            if(Math.abs(transx) < 500){
                if(transx>0){
                    transx = 500;
                }
                else{
                    transx = -500;
                }
            }
            var transz = 500 * Math.random();
            if(Math.abs(transz) < 100){
                transz = 100;
            }
            var xAvgTrans = [];
            var zAvgTrans = [];
            for ( var i = 0; i < xAvg.length; i ++ ) {
                xAvgTrans[i] = xAvg[i] - transx;
                zAvgTrans[i] = zAvg[i] - transz;
            }

            var xHolderT = [];
            var zHolderT = [];

            for ( var i = 0; i < xAvg.length; i ++ ) {
                for ( var j = 0; j < xHolder.length/xAvg.length; j ++ ) {
                    var Qx = xHolder[i * xHolder.length/xAvg.length + j] - xAvg[i] + xAvgTrans[i];
                    var Qz = zHolder[i * zHolder.length/zAvg.length + j] - zAvg[i] + zAvgTrans[i];
                    xHolderT.push (Qx);
                    zHolderT.push (Qz);
                }
            }
            for ( var i = 0; i < SkeMeshRP.Pos.length/3; i ++ ) {
                SkeMeshRP.Pos.array[ 3*i ] = xHolderT[i];
                SkeMeshRP.Pos.array[ 3*i + 1] = yHolder[i];
                SkeMeshRP.Pos.array[ 3*i + 2] = zHolderT[i];
            }
            //
            for ( var i = 0; i < SkeMeshRP.Nor.length; i ++ ) {
                SkeMeshRP.Nor.array[ i ] = 0;
            }
            for ( var j = 0; j < SkeMeshRP.Pos.length/9; j ++ ) {
                var VecBase = []
                for ( var i = 0; i < 3; i ++ ) {
                    var Vec = new THREE.Vector3( SkeMeshRP.Pos.array[j*9 + 3*i], SkeMeshRP.Pos.array[j*9 + 3*i + 1], SkeMeshRP.Pos.array[j*9 + 3*i + 2]);
                    VecBase.push(Vec);
                }
                var VecNormal = []
                var Vec1 = new THREE.Vector3( VecBase[0].x - VecBase[1].x, VecBase[0].y - VecBase[1].y, VecBase[0].z - VecBase[1].z );
                var Vec2 = new THREE.Vector3( VecBase[1].x - VecBase[2].x, VecBase[1].y - VecBase[2].y, VecBase[1].z - VecBase[2].z );
                var Vec3 = new THREE.Vector3( VecBase[0].x - VecBase[2].x, VecBase[0].y - VecBase[2].y, VecBase[0].z - VecBase[2].z );
                var normal1 = new THREE.Vector3();
                var normal2 = new THREE.Vector3();
                var normal3 = new THREE.Vector3();
                normal1.crossVectors( Vec1, Vec3 );
                normal2.crossVectors( Vec1, Vec2 );
                normal3.crossVectors( Vec3, Vec2 );
                VecNormal.push(normal1)
                VecNormal.push(normal2)
                VecNormal.push(normal3)
                for ( var i = 0; i < 3; i ++ ) {
                    SkeMeshRP.Nor.array[ j*9 + 3*i ]    = VecNormal[i].x
                    SkeMeshRP.Nor.array[ j*9 + 3*i  + 1] = VecNormal[i].y
                    SkeMeshRP.Nor.array[ j*9 + 3*i  + 2] = VecNormal[i].z
                }
            }
        }
    }
}
function SkeMeshCrowdPlay(SkeMeshCrowd){
    var PosCTempt = new THREE.BufferAttribute( new Float32Array( SkeMeshCrowd.Count * 3 ), 3 );
    var NorCTempt = new THREE.BufferAttribute( new Float32Array( SkeMeshCrowd.Count * 3 ), 3 );
    var m = SkeMeshCrowd.Pos.length / SkeMeshCrowd.CrowdCount;
    var n = SkeMeshCrowd.PosShow.length / SkeMeshCrowd.CrowdCount;
    var posHolder = [];
    var norHolder = [];
    for( var i = 0; i < SkeMeshCrowd.Pos.length; i ++ ) {
        PosCTempt.array[i] = SkeMeshCrowd.Pos.array[i];
        NorCTempt.array[i] = SkeMeshCrowd.Nor.array[i];
    }
    for( var i = 0; i < SkeMeshCrowd.CrowdCount; i ++ ) {
        for ( var j = 0; j < m; j ++ ) {
            SkeMeshCrowd.Pos.array[i * m + j] = SkeMeshCrowd.Pos.array[i * m + j + n];
            SkeMeshCrowd.Nor.array[i * m + j] = SkeMeshCrowd.Nor.array[i * m + j + n];
        }
        for ( var j = n; j > 0; j -- ) {
            SkeMeshCrowd.Pos.array[i * m + m - j] = PosCTempt.array[i * m + n - j];
            SkeMeshCrowd.Nor.array[i * m + m - j] = NorCTempt.array[i * m + n - j];
        }
        for ( var j = 0; j < n; j ++ ) {
            posHolder.push(SkeMeshCrowd.Pos.array[i * m + j]);
            norHolder.push(SkeMeshCrowd.Nor.array[i * m + j]);
        }
    }
    for ( var i = 0; i < SkeMeshCrowd.PosShow.length; i ++ ) {
        SkeMeshCrowd.PosShow.array[i] = posHolder[i];
        SkeMeshCrowd.NorShow.array[i] = norHolder[i];
    }

    var vari = []
    for( var j = 0; j < SkeMeshCrowd.CrowdCount; j ++){
        var xColle = [];
        for( var i = 0; i < SkeMeshCrowd.Pos.length/SkeMeshCrowd.CrowdCount; i +=3){
            xColle.push(SkeMeshCrowd.Pos.array[ j * SkeMeshCrowd.Pos.length/SkeMeshCrowd.CrowdCount + i])
        }
        var t = stdDeviation(xColle)
        t /= 150;
        vari.push(t);
    }

    for( var j = 0; j < SkeMeshCrowd.CrowdCount; j ++){
        for ( var i = 0; i < SkeMeshCrowd.ColShow.length/(4 * SkeMeshCrowd.CrowdCount); i ++ ) {
            SkeMeshCrowd.ColShow.array[j*SkeMeshCrowd.ColShow.length/(SkeMeshCrowd.CrowdCount) + 4*i] = vari[j];
            SkeMeshCrowd.ColShow.array[j*SkeMeshCrowd.ColShow.length/(SkeMeshCrowd.CrowdCount) + 4*i + 1] = 0;
            SkeMeshCrowd.ColShow.array[j*SkeMeshCrowd.ColShow.length/(SkeMeshCrowd.CrowdCount) + 4*i + 2] = 0;
            SkeMeshCrowd.ColShow.array[j*SkeMeshCrowd.ColShow.length/(SkeMeshCrowd.CrowdCount) + 4*i + 3] = 1;
        }
    }
}

function skeLineIndex(){
    var skeList1 = [ 2 , 20 , 1 , 0 , 12 , 13 , 14 , 15 ];
    var skeList2 = [ 0 , 16 , 17 , 18 , 19 ];
    var skeList3 = [ 21 , 7 , 6 , 5 , 4 , 20 ];
    var skeList4 = [ 22 , 7 ];
    var skeList5 = [ 23 , 11 , 10 , 9 , 8 , 20 ];
    var skeList6 = [ 24 , 11 ];
    var skeList = [skeList1,skeList2,skeList3,skeList4,skeList5,skeList6];
    var indexCount = 0;
    for(var i = 0; i < skeList.length; i++){
        var k = (skeList[i].length - 1) * 2
        indexCount += k
    }
    var Index = new THREE.BufferAttribute( new Uint16Array( indexCount ), 1 );
    var indexTempt = [];
    for ( var i = 0; i < skeList.length; i ++ ) {
        var indexT = [];
        for ( var j = 0; j < (skeList[i].length-1)*2; j ++ ) {
            var a = Math.ceil(j/2);
            indexT.push(skeList[i][a]);
        }
        indexTempt.push(indexT);
    }
    var Indexflat = indexTempt.reduce(function(a, b) {
        return a.concat(b);
    });

    for ( var i = 0; i < Indexflat.length; i ++ ) {
        Index.array[i] = Indexflat[i]
    }
    return Index;
}
function skeletonLine(Index){
    var PtCount = 25;
    this.Geo = new THREE.BufferGeometry();
    this.Index = Index;
    this.Pos = new THREE.BufferAttribute( new Float32Array( PtCount * 3 ), 3 );
    this.Col = new THREE.BufferAttribute( new Float32Array( PtCount * 4 ), 4 );
    this.PtCount = PtCount;
    this.Material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });
}
function skeletonLineHead(MOD){
    if(MOD == 0){
        this.Material = new THREE.LineBasicMaterial( { color: 0x730000} );
    }
    else if(MOD == 1){
        this.Material = new THREE.LineBasicMaterial( { color: 0x1e1e1e} );
    }

    var Radius = 40;
    var Segments = 32;
    var geometry = new THREE.CircleGeometry( Radius, Segments );
    geometry.vertices.shift();
    this.Geo = geometry
    this.Mesh = new THREE.Line( this.Geo, this.Material );
    var VerticesOri = []
    for(var i = 0 ; i < geometry.vertices.length ; i++){
        var VerTempt = new THREE.Vector3();
        VerTempt.x = geometry.vertices[i].x;
        VerTempt.y = geometry.vertices[i].y;
        VerTempt.z = geometry.vertices[i].x;
        VerticesOri.push(VerTempt);
    }
    this.VerticesOri = VerticesOri;
}
function skeLineCreate(skeLine,scene){
    //SkeSystem geometry
    for ( var i = 0; i < skeLine.Pos.length/3; i ++ ) {
        skeLine.Pos.setXYZ( i,  0 , 0 , 0  );
    }

    for ( var i = 0; i < skeLine.Col.length/4; i ++ ) {
        skeLine.Col.setXYZW( i,  0 , 0 , 0 , 1 );
    }
    skeLine.Geo.addAttribute( 'position', skeLine.Pos );
    skeLine.Geo.addAttribute( 'color', skeLine.Col );
    skeLine.Geo.addAttribute( 'index', ObjIndex1 );
    var SkeMesh = new THREE.Line( skeLine.Geo, skeLine.Material, THREE.LinePieces );
    scene.add( SkeMesh );
}
function skeHeadCreate(skeHead,scene){
    scene.add( skeHead.Mesh );
    for ( var i = 0; i < skeHead.VerticesOri.length; i ++ ) {
        skeHead.Geo.vertices[i].x = skeHead.VerticesOri[i].x + 5000;
        skeHead.Geo.vertices[i].y = skeHead.VerticesOri[i].y + 5000;
        skeHead.Geo.vertices[i].z = 600;
    }
}
function SkeDynamic(bodyAnchorAcc,SkeFromKinect,skeLine,skeHead){
    if(pos[0]){
        for( var j = 0; j < SkeFromKinect.length; j++ ) {
            SkeFromKinect[j] = pos[j]*400;
        }
        for ( var i = 0; i < skeLine.PtCount; i ++ ) {
            skeLine.Pos.array[ 3 * i + 0 ] = SkeFromKinect[3 * i + 0];
            skeLine.Pos.array[ 3 * i + 1 ] = SkeFromKinect[3 * i + 1];
            skeLine.Pos.array[ 3 * i + 2 ] = 600;
        }
        for ( var i = 0; i < skeLine.PtCount; i ++ ) {
            skeLine.Col.array[ 4 * i + 0 ] = 0.5;
            skeLine.Col.array[ 4 * i + 1 ] = 0;
            skeLine.Col.array[ 4 * i + 2 ] = 0;
            skeLine.Col.array[ 4 * i + 3 ] = 1;
        }
        var HeadCenterx = SkeFromKinect[3*3];
        var HeadCentery = SkeFromKinect[3*3 + 1];
        for ( var i = 0; i < skeHead.VerticesOri.length; i ++ ) {
            skeHead.Geo.vertices[i].x = skeHead.VerticesOri[i].x + HeadCenterx;
            skeHead.Geo.vertices[i].y = skeHead.VerticesOri[i].y + HeadCentery;
            skeHead.Geo.vertices[i].z = 600;
        }
    }
}
skeletonLine.prototype.trigger = function(bodyAnchorAcc,sceneObjectSub1){
    var trigger = rightWrist.Y;
    if(trigger > 220.0 && RecStickSwitch == 0 && intervalSt == 50){
        RecStickSwitch = 1;
        intervalSt = 0;
    }
    if(intervalSt < 50){
        intervalSt++;
    }
    if(this.Pos.array[0]!=0){
        if(intervalSt == 50 && RecStickSwitch == 1){
            RPChangeUpdate ++;
            if(RPChangeUpdate>2) RPChangeUpdate = 0;
            sceneObjectSub1[RPChangeUpdate].capture(this.Pos, this.Col);
            var HeadCenterx = SkeFromKinect[3*3];
            var HeadCentery = SkeFromKinect[3*3 + 1];
            sceneObjectSub1Head[RPChangeUpdate].capture(HeadCenterx, HeadCentery);
            RecStickSwitch = 0;
        }
    }
}
skeletonLine.prototype.capture = function(TemptPos, TemptCol){
    for ( var i = 0; i < this.Pos.array.length; i ++ ) {
        this.Pos.array[ i ] = TemptPos.array[ i ];
    }
    for ( var i = 0; i < this.Col.array.length/4; i ++ ) {
        this.Col.array[ 4*i ] = 0.4;
        this.Col.array[ 4*i + 1 ] = 0.4;
        this.Col.array[ 4*i + 2 ] = 0.4;
        this.Col.array[ 4*i + 3 ] = 1;
    }
}
skeletonLineHead.prototype.capture = function(HeadCenterx, HeadCentery){
    for ( var i = 0; i < this.VerticesOri.length; i ++ ) {
        this.Geo.vertices[i].x = this.VerticesOri[i].x + HeadCenterx;
        this.Geo.vertices[i].y = this.VerticesOri[i].y + HeadCentery;
        this.Geo.vertices[i].z = 600;
    }
}
function ColliAnalysis(skeLine,sceneObjectSub1){
    if(skeLine.Pos.array[0]){
        // two arm two leg
        var construct = [10, 11, 6, 7, 13, 14, 17, 18]
        var SkeBase = []
        for(var i = 0 ; i < construct.length/2 ; i ++){
            var SkeTempt = [];
            SkeTempt.push(skeLine.Pos.array[3 * construct[2*i]]);
            SkeTempt.push(skeLine.Pos.array[3 * construct[2*i] + 1]);
            SkeTempt.push(skeLine.Pos.array[3 * construct[2*i + 1]]);
            SkeTempt.push(skeLine.Pos.array[3 * construct[2*i + 1] + 1]);
            SkeBase.push(SkeTempt);
        }
        var RP1Base = [];
        var RP2Base = [];
        var RP3Base = [];
        var ColliAll = []
        for(var i = 0 ; i < skeLine.Index.array.length/2 ; i ++){
            var RP1Tempt = [];
            RP1Tempt.push(sceneObjectSub1[0].Pos.array[3 * skeLine.Index.array[2*i]]);
            RP1Tempt.push(sceneObjectSub1[0].Pos.array[3 * skeLine.Index.array[2*i] + 1]);
            RP1Tempt.push(sceneObjectSub1[0].Pos.array[3 * skeLine.Index.array[2*i + 1]]);
            RP1Tempt.push(sceneObjectSub1[0].Pos.array[3 * skeLine.Index.array[2*i + 1] + 1]);
            RP1Base.push(RP1Tempt);
            var RP2Tempt = [];
            RP2Tempt.push(sceneObjectSub1[1].Pos.array[3 * skeLine.Index.array[2*i]]);
            RP2Tempt.push(sceneObjectSub1[1].Pos.array[3 * skeLine.Index.array[2*i] + 1]);
            RP2Tempt.push(sceneObjectSub1[1].Pos.array[3 * skeLine.Index.array[2*i + 1]]);
            RP2Tempt.push(sceneObjectSub1[1].Pos.array[3 * skeLine.Index.array[2*i + 1] + 1]);
            RP2Base.push(RP2Tempt);
            var RP3Tempt = [];
            RP3Tempt.push(sceneObjectSub1[2].Pos.array[3 * skeLine.Index.array[2*i]]);
            RP3Tempt.push(sceneObjectSub1[2].Pos.array[3 * skeLine.Index.array[2*i] + 1]);
            RP3Tempt.push(sceneObjectSub1[2].Pos.array[3 * skeLine.Index.array[2*i + 1]]);
            RP3Tempt.push(sceneObjectSub1[2].Pos.array[3 * skeLine.Index.array[2*i + 1] + 1]);
            RP3Base.push(RP3Tempt);
        }
        if(RP1Base[0][0] != 0){
            var RPK = []
            for(var i = 0 ; i < SkeBase.length ; i ++){
                for(var j = 0 ; j < RP1Base.length ; j ++){
                    var oript = checkLineIntersection(SkeBase[i][0], SkeBase[i][1], SkeBase[i][2], SkeBase[i][3],
                        RP1Base[j][0], RP1Base[j][1], RP1Base[j][2], RP1Base[j][3] );
                    if(oript){
                        RPK.push(oript);
                    }
                }
            }
            ColliAll.push(RPK);
        }
        if(RP2Base[0][0] != 0){
            var RPK = []
            for(var i = 0 ; i < SkeBase.length ; i ++){
                for(var j = 0 ; j < RP2Base.length ; j ++){
                    var oript = checkLineIntersection(SkeBase[i][0], SkeBase[i][1], SkeBase[i][2], SkeBase[i][3],
                        RP2Base[j][0], RP2Base[j][1], RP2Base[j][2], RP2Base[j][3] );
                    if(oript){
                        RPK.push(oript);
                    }
                }
            }
            ColliAll.push(RPK);
        }
        if(RP3Base[0][0] != 0){
            var RPK = []
            for(var i = 0 ; i < SkeBase.length ; i ++){
                for(var j = 0 ; j < RP3Base.length ; j ++){
                    var oript = checkLineIntersection(SkeBase[i][0], SkeBase[i][1], SkeBase[i][2], SkeBase[i][3],
                        RP3Base[j][0], RP3Base[j][1], RP3Base[j][2], RP3Base[j][3] );
                    if(oript){
                        RPK.push(oript);
                    }
                }
            }
            ColliAll.push(RPK);
        }
        return ColliAll;
    }
}
function checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
    var denominator, a, b, numerator1, numerator2
    var result = {
        x: null,
        y: null
    };
    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
    if (denominator != 0) {
        a = line1StartY - line2StartY;
        b = line1StartX - line2StartX;
        numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
        numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
        a = numerator1 / denominator;
        b = numerator2 / denominator;
        result.x = line1StartX + (a * (line1EndX - line1StartX));
        result.y = line1StartY + (a * (line1EndY - line1StartY));
        if (a > 0 && a < 1 && b > 0 && b < 1) {
            return result;
        }
    }
}
function skeLineDown(skeLine,skeHead,sta,index){
    if(sta > 100 && skeLine.Pos.array[7] > -400){
        var horizontalT = (Math.random() - 0.5) * 2;
        for ( var i = 0; i < skeLine.PtCount; i ++ ) {
           if( skeLine.Pos.array[ 3 * i + 1 ] > -400){
               skeLine.Pos.array[ 3 * i + 1 ] -= 10;
               skeLine.Pos.array[ 3 * i ] -= horizontalT;
           }
        }
        for ( var i = 0; i < skeHead.Geo.vertices.length; i ++ ) {
            if(skeHead.Geo.vertices[i].y > -400){
                skeHead.Geo.vertices[i].y -= 10;
                skeHead.Geo.vertices[i].x -= horizontalT;
            }
        }
    }
    else if (skeLine.Pos.array[7] <= -400){
        Status[index] = 0;
    }
}

function ImpactPiece(){
    var Count = 500;
    this.Geo = [];
    for(var i = 0; i < Count;i++){
        var t = ( Math.random() + 1 ) * 50;
        this.Geo.push(new THREE.PlaneBufferGeometry( t, t ));
    }
    var map00 = THREE.ImageUtils.loadTexture( "./img/00Piece.png" );
    var map01 = THREE.ImageUtils.loadTexture( "./img/01Piece.png" );
    var map02 = THREE.ImageUtils.loadTexture( "./img/02Piece.png" );
    var mapColle = [map00,map01,map02];
    var mapSel;
    var Dice = Math.random();
    if(Dice<0.33){
        mapSel = mapColle[0];
    }
    else if(Dice>=0.33 && Dice<0.67){
        mapSel = mapColle[1];
    }
    else if(Dice>=0.67){
        mapSel = mapColle[2];
    }
    this.Material = [];
    for(var i = 0; i < Count;i++){
        var material = new THREE.MeshBasicMaterial( { map: mapSel } );
        material.transparent = true;
        material.blending = THREE[ "NormalBlending" ];
        this.Material.push(material);
    }
    this.MapColle = mapColle;
    this.Mesh = [];
    this.Time = [];
    this.Velocity = [];
    for(var i = 0; i < Count;i++){
        this.Mesh.push(new THREE.Mesh( this.Geo[i], this.Material[i] ));
        this.Time.push(50);
        var v = new THREE.Vector3();
        v.x = 0.0;
        v.y = 0.0;
        v.z = 0.0;
        this.Velocity.push(v);
    }
    this.Count = Count;
}
function ImpactPieceCreate(ImpactPiece,scene){
    for(var i = 0; i < ImpactPiece.Count;i++){
        ImpactPiece.Mesh[i].position.set( 5000, 5000, 300 );
        scene.add( ImpactPiece.Mesh[i] );
    }
}
function ImpactPieceDynamic(Colli,ImpactPiece,index){
    if(Colli.length != 0){
        Status[index] ++ ;
        for(var i = 0 ; i < Colli.length ; i++){
            for(var j = 0 ; j < 10 ; j++){
                ImpactPiece.Mesh[i * 10 + j].position.set( Colli[i].x, Colli[i].y , 600 );
                var mapSel;
                var Dice = Math.random();
                if(Dice<0.33){
                    mapSel = ImpactPiece.MapColle[0];
                }
                else if(Dice>=0.33 && Dice<0.67){
                    mapSel = ImpactPiece.MapColle[1];
                }
                else if(Dice>=0.67){
                    mapSel = ImpactPiece.MapColle[2];
                }
                ImpactPiece.Material[i * 10 + j].map = mapSel;
            }
        }
    }
}
function impactPieceSpread(ImpactPiece){
    for(var i = 0; i < ImpactPiece.Count;i++){
        if(ImpactPiece.Mesh[i].position.x != 5000){
            if(ImpactPiece.Velocity[i].x == 0 && ImpactPiece.Velocity[i].y == 0){
                var m = (Math.random() - 0.5 ) * 2.0;
                var n = Math.sqrt(1 - m * m);
                var dice = Math.random() - 0.5;
                if (dice <= 0) n *= -1;
                ImpactPiece.Velocity[i].x = 8 * Math.abs(dice) * m;
                ImpactPiece.Velocity[i].y = 8 * Math.abs(dice) * n;
            }
            else if(ImpactPiece.Velocity[i].x != 0 || ImpactPiece.Velocity[i].y != 0){
                if(ImpactPiece.Time[i] > 0){
                    ImpactPiece.Mesh[i].position.x += ImpactPiece.Velocity[i].x;
                    ImpactPiece.Mesh[i].position.y += ImpactPiece.Velocity[i].y;
                    ImpactPiece.Time[i] --;
                }
                else if(ImpactPiece.Time[i] <= 0){
                    ImpactPiece.Mesh[i].position.x = 5000;
                    ImpactPiece.Mesh[i].position.y = 5000;
                    ImpactPiece.Velocity[i].x = 0;
                    ImpactPiece.Velocity[i].y = 0;
                    ImpactPiece.Time[i] = 50;
                }
            }
        }
    }
}

function NodePaper(nodesX, nodesY, x0, x1, y0, y1, z0,PaperMode) {
    this.nodesX = nodesX;
    this.nodesY = nodesY;
    this.x0 = x0;
    this.x1 = x1;
    this.y0 = y0;
    this.y1 = y1;
    this.z0 = z0;
    this.PtCount = nodesX * nodesY;
    var quadsX = (nodesX - 1);
    var quadsY = (nodesY - 1);
    var quadCount = quadsX * quadsY;
    var NodeIndices = new THREE.BufferAttribute(new Uint32Array(6 * quadCount), 1);
    var k = 0;
    for (var j = 0; j < quadsY; j++) {
        for (var i = 0; i < quadsX; i++) {
            var n0 = j * nodesX + i;
            NodeIndices.array[k] = n0;
            NodeIndices.array[k + 1] = n0 + 1;
            NodeIndices.array[k + 2] = n0 + nodesX + 1;
            NodeIndices.array[k + 3] = n0;
            NodeIndices.array[k + 4] = n0 + nodesX + 1;
            NodeIndices.array[k + 5] = n0 + nodesX;
            k += 6;
        }
    }
    this.Geo = new THREE.BufferGeometry();
    this.Pos = new THREE.BufferAttribute(new Float32Array(this.PtCount * 3), 3);
    this.Nor = new THREE.BufferAttribute(new Float32Array(this.PtCount * 3), 3);
    this.Col = new THREE.BufferAttribute(new Float32Array(this.PtCount * 4), 4);
    this.Index = NodeIndices;
    var shader;
    if(Gate == 9){
        if(PaperMode == 0){
            shader=PaperShader0;
        }
        else if(PaperMode == 1){
            shader=PaperShader0F;
        }
        else if(PaperMode == 2){
            shader=PaperShader1;
        }
        else if(PaperMode == 3){
            shader=PaperShader2;
        }
        else if(PaperMode == 4){
            shader=PaperShader22;
        }
        else if(PaperMode == 5){
            shader=PaperShader23;
        }
    }
    else if(Gate == 10){
        if(PaperMode == 0){
            shader=PaperShader3;
        }
        if(PaperMode == 1){
            shader=PaperShader4;
        }
        if(PaperMode == 2){
            shader=PaperShader5;
        }
        if(PaperMode == 3){
            shader=PaperShader6;
        }
    }
    this.Material = new THREE.ShaderMaterial( {
        uniforms: shader.uniforms,
        attributes: shader.attributes,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader,
        vertexColors: THREE.VertexColors,
        lights: true
    } );
    this.Mesh = new THREE.Mesh(this.Geo, this.Material);
    this.Mesh.castShadow = true;
    this.Mesh.receiveShadow = true;
}
function NodePaperCreate(NodePaper, scene) {
    var k = 0;

    var x0 = NodePaper.x0;
    var x1 = NodePaper.x1;
    var y0 = NodePaper.y0;
    var y1 = NodePaper.y1;
    var z0 = NodePaper.z0;

    var nx = NodePaper.nodesX;
    var ny = NodePaper.nodesY;

    var ddx = (x1 - x0) / (nx - 1.0);
    var ddy = (y1 - y0) / (ny - 1.0);


    var k = 0;
    for (var j = 0; j < ny; j++) {
        for (var i = 0; i < nx; i++) {
            var nd = new NodeP(x0 + i * ddx, y0 + j * ddy, z0);


            if (j == 0 || j == ny - 1 || i == 0 || i == nx - 1) {
                nd.fixx = true;
                nd.fixy = true;
                nd.fixz = true;
            }

            Nodes.push(nd);
        }
    }

    for (var j = 0; j < ny; j++) {
        for (var i = 0; i < nx - 1; i++) {
            var e = new EdgePaper(Nodes[j * nx + i], Nodes[j * nx + i + 1]);
            Edges.push(e);
        }
    }

    for (var j = 0; j < ny - 1; j++) {
        for (var i = 0; i < nx; i++) {
            var e = new EdgePaper(Nodes[j * nx + i], Nodes[(j + 1) * nx + i]);
            Edges.push(e);
        }
    }


    for (var i = 0; i < Nodes.length; i++) {
        NodePaper.Pos.setXYZ(i, Nodes[i].x, Nodes[i].y, Nodes[i].z);
        NodePaper.Nor.setXYZ(i, 0, 0, 1);
        NodePaper.Col.setXYZW(i, (i % 30) / 30, (i % 30) / 30, (i % 30) / 30, 1);
    }


    NodePaper.Geo.addAttribute('position', NodePaper.Pos);
    NodePaper.Geo.addAttribute('normal', NodePaper.Nor);
    NodePaper.Geo.addAttribute('color', NodePaper.Col);
    NodePaper.Geo.addAttribute('index', NodePaper.Index);

    scene.add(NodePaper.Mesh);
}
function NodePaperDynamic(NodePaper, Mode,tt) {

    tt += 0.02;
    for (var i = 0; i < NodePaper.PtCount; i++) {
        Nodes[i].fx = 0.0;
        Nodes[i].fy = 0.0;
        Nodes[i].fz = 0.0;
        //  var x = Nodes[i].x;
        //  var y = Nodes[i].y;
        //  Nodes[i].z = Math.cos(x * 0.013 + tt) * Math.sin(y * 0.013 + tt * 3.0) * 200.0;
    }

    for(var i=0; i<Edges.length; ++i) {
        Edges[i].ApplySpringForce();
    }
    var disAcc1 = Math.sqrt(rightWristAcc.X * rightWristAcc.X + rightWristAcc.Y * rightWristAcc.Y + rightWristAcc.Z * rightWristAcc.Z);
    var disAcc2 = Math.sqrt(leftWristAcc.X * leftWristAcc.X + leftWristAcc.Y * leftWristAcc.Y + leftWristAcc.Z * leftWristAcc.Z);

    //
    for ( var i = 0; i < NodePaper.PtCount; i++ ) {
        var nd  =  Nodes[i];
        var fx1 =  ControlOutput[0].X - nd.x;
        var fy1 =  ControlOutput[0].Y - nd.y;
        var fz1 =  ControlOutput[0].Z - nd.z;
        var fx2 =  ControlOutput[1].X - nd.x;
        var fy2 =  ControlOutput[1].Y - nd.y;
        var fz2 =  ControlOutput[1].Z - nd.z;
        var dsq1=fx1 * fx1 + fy1 * fy1//+ fz1 * fz1;
        var dsq2=fx2 * fx2 + fy2 * fy2//+ fz2 * fz2;
        var dist1= Math.sqrt(fx1 * fx1 + fy1 * fy1 + fz1 * fz1);
        var dist2= Math.sqrt(fx2 * fx2 + fy2 * fy2 + fz2 * fz2);
        //both attract
        if(NodeTrigger[1] == 0 && NodeTrigger[0]  == 0){
            if(dist1 >= dist2){
                var dsq = dsq2;
                var dist = dist2;
                var fxTemp = fx2;
                var fyTemp = fy2;
                var fzTemp = fz2;
            }
            else{
                var dsq = dsq1;
                var dist = dist1;
                var fxTemp = fx1;
                var fyTemp = fy1;
                var fzTemp = fz1;
            }
            var ff=30.0*Math.exp(-0.00015*dsq);
            if (dist!=0) ff/=dist;
            var fx=fxTemp*ff;
            var fy=fyTemp*ff;
            var fz=fzTemp*ff;
        }
        //both release
        else if (NodeTrigger[1] == 1 && NodeTrigger[0]  == 1){
            if(dist1>=dist2){
                var dsq = dsq2;
                var TempAcc = leftWristAcc;
            }
            else{
                var dsq = dsq1;
                var TempAcc = rightWristAcc;
            }
            var ff=100.0*Math.exp(-0.00005*dsq);
            var fx=TempAcc.X*ff;
            var fy=TempAcc.Y*ff;
            var fz=TempAcc.Z*ff;
        }
        //one release one attract
        else if (NodeTrigger[1] == 1 && NodeTrigger[0]  == 0){
            if(dist1>=dist2){
                var dsq = dsq2;
                var TempAcc = leftWristAcc;
                var ff=100.0*Math.exp(-0.00005*dsq);
                var fx=TempAcc.X*ff;
                var fy=TempAcc.Y*ff;
                var fz=TempAcc.Z*ff;
            }
            else{
                var dsq = dsq1;
                var dist = dist1;
                var fxTemp = fx1;
                var fyTemp = fy1;
                var fzTemp = fz1;
                var ff=30.0*Math.exp(-0.00015*dsq);
                if (dist!=0) ff/=dist;
                var fx=fxTemp*ff;
                var fy=fyTemp*ff;
                var fz=fzTemp*ff;
            }
        }
        else if (NodeTrigger[1] == 0 && NodeTrigger[0]  == 1){
            if(dist1>=dist2){
                var dsq = dsq2;
                var dist = dist2;
                var fxTemp = fx2;
                var fyTemp = fy2;
                var fzTemp = fz2;
                var ff=30.0*Math.exp(-0.00015*dsq);
                if (dist!=0) ff/=dist;
                var fx=fxTemp*ff;
                var fy=fyTemp*ff;
                var fz=fzTemp*ff;
            }
            else{
                var dsq = dsq1
                var TempAcc = rightWristAcc
                var ff=100.0*Math.exp(-0.00005*dsq);
                var fx=TempAcc.X*ff;
                var fy=TempAcc.Y*ff;
                var fz=TempAcc.Z*ff;
            }
        }

        if(Mode == 0){
            nd.fx+=fx;
            nd.fy+=fy;
            nd.fz+=fz/3;
            //nd.Move(1, 0.2);
            nd.Move(0.15, 0.7);
        }
        else if(Mode == 1){
            nd.fx+=fx;
            nd.fy+=fy/100;
            nd.fz+=fz;
            nd.Move(0.8, 0.5);
        }
        else if(Mode == 2){
            nd.fx+=fx/100;
            nd.fy+=fy;
            nd.fz+=fz;
            nd.Move(0.8, 0.5);
        }
        else if(Mode == 3){
            nd.fx+=fx;
            nd.fy+=fy/100;
            nd.fz+=fz;
            nd.Move(0.1, 0.5);
        }
        else if(Mode == 4){
            nd.fx+=fx/100;
            nd.fy+=fy/100;
            nd.fz+=fz;
            nd.Move(0.8, 0.5);
        }
        else if(Mode == 5){
            nd.fx+=fx/20;
            nd.fy+=fy/20;
            nd.fz+=fz/3;
            nd.Move(0.8, 0.5);
        }

    }



    //.............................................Copy Node XYZ to buffer geometry and set update flags
    for (var i = 0; i < Nodes.length; i++) {
        NodePaper.Pos.setXYZ(i, Nodes[i].x, Nodes[i].y, Nodes[i].z);
    }

    NodePaper.Geo.computeVertexNormals(); //this sets the need update flag for normals too

    NodePaper.Geo.attributes.position.needsUpdate = true;
    NodePaper.Geo.attributes.color.needsUpdate = true;
    NodePaper.Mesh.material.needsUpdate = true;
}
function PatternUpdate() {
    if (typeof NodeV === "number") {
        if(PatMod == 2){
            var dRight = Math.abs(rightWristAcc.X + rightWristAcc.Y + rightWristAcc.Z)
            var dLeft = Math.abs(leftWristAcc.X + leftWristAcc.Y + leftWristAcc.Z)
            if (dRight - dLeft > 0.1 && NodeV < 290.0) {
                NodeV++;
            }
            else if (dLeft - dRight > 0.1 && NodeV > 0.0) {
                NodeV--;
            }
        }
        else if(PatMod == 0){
            var dRight = Math.abs(rightWrist.Z)
            var dLeft = Math.abs(leftWrist.Z)
            if (dRight - dLeft > 10 && NodeV < 290.0) {
                NodeV++;
            }
            else if (dLeft - dRight > 10 && NodeV > 0.0) {
                NodeV--;
            }
        }
        else if(PatMod == 1){
            var dRight = rightWrist.X
            var dLeft = leftWrist.X
            if (Math.abs(dRight - dLeft) <100 && NodeV < 290.0) {
                NodeV++;
            }
            else if (Math.abs(dRight - dLeft) > 450 && NodeV > 0.0) {
                NodeV--;
            }
        }
        else if(PatMod == 3){
            var dRight = rightWrist.Z
            var dLeft = leftWrist.Z
            if (dRight - dLeft <-50) {
                NodeVX = rightWrist.X;
                NodeVY = rightWrist.Y;
            }
            else if (dRight - dLeft > 50) {
                NodeVX = leftWrist.X;
                NodeVY = leftWrist.Y;
            }
        }

    }
}