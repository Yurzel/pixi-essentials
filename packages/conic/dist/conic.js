/*!
 * @pixi-essentials/conic - v1.0.0
 * Compiled Sun, 09 Aug 2020 15:59:00 UTC
 *
 * @pixi-essentials/conic is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 * 
 * Copyright 2019-2020, Shukant K. Pal, All Rights Reserved
 * 
 */
this.PIXI=this.PIXI||{};var _pixi_essentials_conic=function(n,t,e,r,i,o){"use strict";const a=new t.AttributeRedirect({source:"vertexData",attrib:"aWorldPosition",type:"float32",size:2,glType:e.TYPES.FLOAT,glSize:2}),s=new t.AttributeRedirect({source:"uvData",attrib:"aTexturePosition",type:"float32",size:2,glType:e.TYPES.FLOAT,glSize:2}),c=new t.UniformRedirect({source:"k",uniform:"k"}),l=new t.UniformRedirect({source:"l",uniform:"l"}),v=new t.UniformRedirect({source:"m",uniform:"m"}),d=new t.BatchShaderFactory("#version 100\n#define SHADER_NAME Conic-Renderer-Fallback-Shader\n\nprecision mediump float;\n\nattribute vec2 aWorldPosition;\nattribute vec2 aTexturePosition;\nattribute float aMasterID;\nattribute float aUniformID;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vWorldCoord;\nvarying vec2 vTextureCoord;\nvarying float vMasterID;\nvarying float vUniformID;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aWorldPosition, 1)).xy, 0, 1);\n\n    vWorldCoord = gl_Position.xy;\n    vTextureCoord = aTexturePosition;\n    vMasterID = aMasterID;\n    vUniformID = aUniformID;\n}","#version 100\n#ifdef GL_OES_standard_derivatives\n    #extension GL_OES_standard_derivatives : enable\n#endif\n#define SHADER_NAME Conic-Renderer-Fallback-Shader\n\nprecision mediump float;\n\nuniform sampler2D uSamplers[%texturesPerBatch%];\n\nvarying vec2 vWorldCoord;\nvarying vec2 vTextureCoord;\nvarying float vMasterID;\nvarying float vUniformID;\n\nuniform vec3 k[%uniformsPerBatch%];\nuniform vec3 l[%uniformsPerBatch%];\nuniform vec3 m[%uniformsPerBatch%];\nuniform bool inside;\n\nfloat sampleCurve(vec2 point, vec3 kv, vec3 lv, vec3 mv)\n{\n    float k = dot(vec3(vTextureCoord, 1), kv);\n    float l = dot(vec3(vTextureCoord, 1), lv);\n    float m = dot(vec3(vTextureCoord, 1), mv);\n\n    return k*k - l*m;\n}\n\nvoid main(void)\n{\n    vec3 kv, lv, mv;\n\n    for (int i = 0; i < %uniformsPerBatch%; i++)\n    {\n        if (float(i) > vUniformID - 0.5) \n        {\n            kv = k[i];\n            lv = l[i];\n            mv = m[i];\n            break;\n        }\n    }\n\n    float k_ = dot(vec3(vTextureCoord, 1), kv);\n    float l_ = dot(vec3(vTextureCoord, 1), lv);\n    float m_ = dot(vec3(vTextureCoord, 1), mv);\n\n    float cv = k_ * k_ - l_ * m_;\n\n#ifdef GL_OES_standard_derivatives\n    float cvdx = dFdx(cv);\n    float cvdy = dFdy(cv);\n    vec2 gradientTangent = vec2(cvdx, cvdy);\n\n    float signedDistance = cv / length(gradientTangent);\n    bool antialias = signedDistance > -1. && signedDistance < 1.;\n#endif\n\n    vec4 color;\n\n    if ((inside && cv < 0.) || (!inside && cv >= 0.) \n#ifdef GL_OES_standard_derivatives\n            || antialias\n#endif\n    )\n    {\n        for (int i = 0; i < %texturesPerBatch%; i++)\n        {\n            if (float(i) > vMasterID - 0.5)\n            {\n                color = texture2D(uSamplers[i], vTextureCoord);\n                break;\n            }\n        }\n    }\n    else\n    {\n        color = vec4(0, 0, 0, 0);\n    }\n\n#ifdef GL_OES_standard_derivatives\n    if (antialias)\n    {\n        float weight = inside ? (1. - signedDistance) / 2. : (1. + signedDistance) / 2.;\n        \n        color = weight * color + (1. - weight) * vec4(0, 0, 0, 0);\n    }\n#endif\n\n    gl_FragColor = color;\n}",{inside:!0}).derive(),u=new t.BatchShaderFactory("#version 300 es\n\n#define SHADER_NAME Conic-Renderer-Shader\n\nprecision mediump float;\n\nin vec2 aWorldPosition;\nin vec2 aTexturePosition;\nin float aMasterID;\nin float aUniformID;\n\nuniform mat3 projectionMatrix;\n\nout vec2 vWorldCoord;\nout vec2 vTextureCoord;\nout float vMasterID;\nout float vUniformID;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aWorldPosition, 1)).xy, 0, 1);\n\n    vWorldCoord = gl_Position.xy;\n    vTextureCoord = aTexturePosition;\n    vMasterID = aMasterID;\n    vUniformID = aUniformID;\n}","#version 300 es\n#define SHADER_NAME Conic-Renderer-Shader\n\nprecision mediump float;\n\nuniform sampler2D uSamplers[%texturesPerBatch%];\n\nin vec2 vWorldCoord;\nin vec2 vTextureCoord;\nin float vMasterID;\nin float vUniformID;\n\nout vec4 fragmentColor;\n\nuniform vec3 k[%uniformsPerBatch%];\nuniform vec3 l[%uniformsPerBatch%];\nuniform vec3 m[%uniformsPerBatch%];\nuniform bool inside;\n\nvoid main(void)\n{\n    vec3 kv, lv, mv;\n\n    for (int i = 0; i < %uniformsPerBatch%; i++)\n    {\n        if (float(i) > vUniformID - 0.5) \n        {\n            kv = k[i];\n            lv = l[i];\n            mv = m[i];\n            break;\n        }\n    }\n\n    float k_ = dot(vec3(vTextureCoord, 1), kv);\n    float l_ = dot(vec3(vTextureCoord, 1), lv);\n    float m_ = dot(vec3(vTextureCoord, 1), mv);\n\n    float cv = k_ * k_ - l_ * m_;\n\n    float cvdx = dFdx(cv);\n    float cvdy = dFdy(cv);\n    vec2 gradientTangent = vec2(cvdx, cvdy);\n\n    float signedDistance = cv / length(gradientTangent);\n    bool antialias = signedDistance > -1. && signedDistance < 1.;\n\n    vec4 color;\n\n    if ((inside && cv < 0.) || (!inside && cv >= 0.) || antialias)\n    {\n        for (int i = 0; i < %texturesPerBatch%; i++)\n        {\n            if (float(i) > vMasterID - 0.5)\n            {\n                color = texture(uSamplers[i], vTextureCoord);\n                break;\n            }\n        }\n    }\n    else\n    {\n        color = vec4(0, 0, 0, 0);\n    }\n\n    if (antialias)\n    {\n        float weight = inside ? (1. - signedDistance) / 2. : (1. + signedDistance) / 2.;\n        \n        color = weight * color + (1. - weight) * vec4(0, 0, 0, 0);\n    }\n\n    fragmentColor = color;\n}",{inside:!0}).derive(),f=t.BatchRendererPluginFactory.from({attribSet:[a,s],uniformSet:[c,l,v],indexProperty:"indexData",textureProperty:"_texture",texIDAttrib:"aMasterID",uniformIDAttrib:"aUniformID",inBatchIDAttrib:"aBatchID",shaderFunction:n=>{const t=n.renderer,e=t.context;return 1!==e.webGLVersion||e.extensions.standardDerivatives||(e.extensions.standardDerivatives=t.gl.getExtension("OES_standard_derivatives")),1===e.webGLVersion?d(n):u(n)},BatchFactoryClass:t.AggregateUniformsBatchFactory});r.Renderer.registerPlugin("conic",f);const h=f,m=Math.sqrt(2);class x{constructor(){this.k=[1,0,0],this.l=[0,1,0],this.m=[0,0,1],this.controlPoints=[new i.Point(0,0),new i.Point(.5,0),new i.Point(1,1)],this._dirtyID=0}setk(n,t,e){return this.k[0]=n,this.k[1]=t,this.k[2]=e,this._dirtyID++,this}setl(n,t,e){return this.l[0]=n,this.l[1]=t,this.l[2]=e,this._dirtyID++,this}setm(n,t,e){return this.m[0]=n,this.m[1]=t,this.m[2]=e,this._dirtyID++,this}setControlPoints(n,t,e){this.controlPoints[0]=n,this.controlPoints[1]=t,this.controlPoints[2]=e}update(){return this._dirtyID++,this}static createCircle(n){const t=new x;return t.setk(1/m,1/m,-n/m),t.setl(1,0,0),t.setm(0,1,0),t}static createEllipse(n,t){const e=new x;return e.setk(1/n,1/t,-1),e.setl(2/n,0,0),e.setm(0,1/t,0),e}static createParabola(n){const t=new x;return t.setk(1,0,0),t.setl(0,4*n,0),t.setm(0,0,1),t}static createHyperbola(n,t){const e=new x;return e.setk(0,0,1),e.setl(-1/n,1/t,0),e.setm(1/n,1/t,0),e}}var g={adjoint:function(n,t){var e=t[0],r=t[1],i=t[2],o=t[3],a=t[4],s=t[5],c=t[6],l=t[7],v=t[8];return n[0]=a*v-s*l,n[1]=i*l-r*v,n[2]=r*s-i*a,n[3]=s*c-o*v,n[4]=e*v-i*c,n[5]=i*o-e*s,n[6]=o*l-a*c,n[7]=r*c-e*l,n[8]=e*a-r*o,n},clone:function(n){var t=new Float32Array(9);return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t},copy:function(n,t){return n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n[4]=t[4],n[5]=t[5],n[6]=t[6],n[7]=t[7],n[8]=t[8],n},create:function(){var n=new Float32Array(9);return n[0]=1,n[1]=0,n[2]=0,n[3]=0,n[4]=1,n[5]=0,n[6]=0,n[7]=0,n[8]=1,n},determinant:function(n){var t=n[0],e=n[1],r=n[2],i=n[3],o=n[4],a=n[5],s=n[6],c=n[7],l=n[8];return t*(l*o-a*c)+e*(a*s-l*i)+r*(c*i-o*s)},frob:function(n){return Math.sqrt(n[0]*n[0]+n[1]*n[1]+n[2]*n[2]+n[3]*n[3]+n[4]*n[4]+n[5]*n[5]+n[6]*n[6]+n[7]*n[7]+n[8]*n[8])},fromMat2:function(n,t){return n[0]=t[0],n[1]=t[1],n[2]=0,n[3]=t[2],n[4]=t[3],n[5]=0,n[6]=t[4],n[7]=t[5],n[8]=1,n},fromMat4:function(n,t){return n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[4],n[4]=t[5],n[5]=t[6],n[6]=t[8],n[7]=t[9],n[8]=t[10],n},fromQuat:function(n,t){var e=t[0],r=t[1],i=t[2],o=t[3],a=e+e,s=r+r,c=i+i,l=e*a,v=r*a,d=r*s,u=i*a,f=i*s,h=i*c,m=o*a,x=o*s,g=o*c;return n[0]=1-d-h,n[3]=v-g,n[6]=u+x,n[1]=v+g,n[4]=1-l-h,n[7]=f-m,n[2]=u-x,n[5]=f+m,n[8]=1-l-d,n},identity:function(n){return n[0]=1,n[1]=0,n[2]=0,n[3]=0,n[4]=1,n[5]=0,n[6]=0,n[7]=0,n[8]=1,n},invert:function(n,t){var e=t[0],r=t[1],i=t[2],o=t[3],a=t[4],s=t[5],c=t[6],l=t[7],v=t[8],d=v*a-s*l,u=-v*o+s*c,f=l*o-a*c,h=e*d+r*u+i*f;return h?(h=1/h,n[0]=d*h,n[1]=(-v*r+i*l)*h,n[2]=(s*r-i*a)*h,n[3]=u*h,n[4]=(v*e-i*c)*h,n[5]=(-s*e+i*o)*h,n[6]=f*h,n[7]=(-l*e+r*c)*h,n[8]=(a*e-r*o)*h,n):null},multiply:function(n,t,e){var r=t[0],i=t[1],o=t[2],a=t[3],s=t[4],c=t[5],l=t[6],v=t[7],d=t[8],u=e[0],f=e[1],h=e[2],m=e[3],x=e[4],g=e[5],D=e[6],_=e[7],p=e[8];return n[0]=u*r+f*a+h*l,n[1]=u*i+f*s+h*v,n[2]=u*o+f*c+h*d,n[3]=m*r+x*a+g*l,n[4]=m*i+x*s+g*v,n[5]=m*o+x*c+g*d,n[6]=D*r+_*a+p*l,n[7]=D*i+_*s+p*v,n[8]=D*o+_*c+p*d,n},normalFromMat4:function(n,t){var e=t[0],r=t[1],i=t[2],o=t[3],a=t[4],s=t[5],c=t[6],l=t[7],v=t[8],d=t[9],u=t[10],f=t[11],h=t[12],m=t[13],x=t[14],g=t[15],D=e*s-r*a,_=e*c-i*a,p=e*l-o*a,y=r*c-i*s,I=r*l-o*s,P=i*l-o*c,T=v*m-d*h,k=v*x-u*h,C=v*g-f*h,b=d*x-u*m,w=d*g-f*m,M=u*g-f*x,S=D*M-_*w+p*b+y*C-I*k+P*T;return S?(S=1/S,n[0]=(s*M-c*w+l*b)*S,n[1]=(c*C-a*M-l*k)*S,n[2]=(a*w-s*C+l*T)*S,n[3]=(i*w-r*M-o*b)*S,n[4]=(e*M-i*C+o*k)*S,n[5]=(r*C-e*w-o*T)*S,n[6]=(m*P-x*I+g*y)*S,n[7]=(x*p-h*P-g*_)*S,n[8]=(h*I-m*p+g*D)*S,n):null},rotate:function(n,t,e){var r=t[0],i=t[1],o=t[2],a=t[3],s=t[4],c=t[5],l=t[6],v=t[7],d=t[8],u=Math.sin(e),f=Math.cos(e);return n[0]=f*r+u*a,n[1]=f*i+u*s,n[2]=f*o+u*c,n[3]=f*a-u*r,n[4]=f*s-u*i,n[5]=f*c-u*o,n[6]=l,n[7]=v,n[8]=d,n},scale:function(n,t,e){var r=e[0],i=e[1];return n[0]=r*t[0],n[1]=r*t[1],n[2]=r*t[2],n[3]=i*t[3],n[4]=i*t[4],n[5]=i*t[5],n[6]=t[6],n[7]=t[7],n[8]=t[8],n},str:function(n){return"mat3("+n[0]+", "+n[1]+", "+n[2]+", "+n[3]+", "+n[4]+", "+n[5]+", "+n[6]+", "+n[7]+", "+n[8]+")"},translate:function(n,t,e){var r=t[0],i=t[1],o=t[2],a=t[3],s=t[4],c=t[5],l=t[6],v=t[7],d=t[8],u=e[0],f=e[1];return n[0]=r,n[1]=i,n[2]=o,n[3]=a,n[4]=s,n[5]=c,n[6]=u*r+f*a+l,n[7]=u*i+f*s+v,n[8]=u*o+f*c+d,n},transpose:function(n,t){if(n===t){var e=t[1],r=t[2],i=t[5];n[1]=t[3],n[2]=t[6],n[3]=e,n[5]=t[7],n[6]=r,n[7]=i}else n[0]=t[0],n[1]=t[3],n[2]=t[6],n[3]=t[1],n[4]=t[4],n[5]=t[7],n[6]=t[2],n[7]=t[5],n[8]=t[8];return n}};g.adjoint,g.clone,g.copy,g.create,g.determinant,g.frob,g.fromMat2,g.fromMat4,g.fromQuat,g.identity,g.invert,g.multiply,g.normalFromMat4,g.rotate,g.scale,g.str,g.translate,g.transpose;const D=new i.Matrix;class _ extends o.Container{constructor(n=new x,t){super(),this.shape=n,this._dirtyID=0,this._transformID=0,this._updateID=-1,this.vertexData=[],this.uvData=[],this._texture=t||r.Texture.WHITE}get k(){return this.shape.k}set k(n){this.shape.setk(...n)}get l(){return this.shape.l}set l(n){this.shape.setl(...n)}get m(){return this.shape.m}set m(n){this.shape.setm(...n)}get texture(){return this._texture}set texture(n){this._texture=n||r.Texture.WHITE}_calculateBounds(){this._bounds.addVertexData(this.vertexData,0,this.vertexData.length)}_render(n){n.plugins.conic||(n.plugins.conic=new h(n,null)),n.batch.setObjectRenderer(n.plugins.conic),n.plugins.conic.render(this)}drawControlPoints(){const n=this.shape.controlPoints;return this.drawTriangle(n[0].x,n[0].y,n[1].x,n[1].y,n[2].x,n[2].y),this}drawTriangle(n,t,e,r,i,o){const a=this.uvData,s=a.length;return a.length+=6,a[s]=n,a[s+1]=t,a[s+2]=e,a[s+3]=r,a[s+4]=i,a[s+5]=o,this}drawRect(n,t,e,r){const i=this.uvData,o=i.length;return i.length+=12,i[o]=n,i[o+1]=t,i[o+2]=n+e,i[o+3]=t,i[o+4]=n+e,i[o+5]=t+r,i[o+6]=n,i[o+7]=t,i[o+8]=n+e,i[o+9]=t+r,i[o+10]=n,i[o+11]=t+r,this}updateConic(){const n=this.vertexData,t=this.uvData;n.length=t.length;const e=D.copyFrom(this.worldTransform),{a:r,b:i,c:o,d:a,tx:s,ty:c}=e;for(let e=0,l=n.length/2;e<l;e++){const l=t[2*e],v=t[2*e+1];n[2*e]=r*l+o*v+s,n[2*e+1]=i*l+a*v+c}this._updateID=this._dirtyID;const l=this.indexData=new Array(n.length/2);for(let n=0,t=l.length;n<t;n++)l[n]=n}setControlPoints(n,t,e){const r=this.shape.controlPoints;this.setTransform(r[0],r[1],r[2],n,t,e)}setTransform(...n){const t=this.transform,e=t.localTransform;if(t._localID++,1===n.length)return e.copyFrom(n[0]),this;let r,i,o,a,s,c,l,v,d,u,f,h;if(9===n.length&&super.setTransform(...n),e.identity(),6===n.length){const t=n;r=t[0].x,i=t[0].y,o=t[1].x,a=t[1].y,s=t[2].x,c=t[2].y,l=t[3].x,v=t[3].y,d=t[4].x,u=t[4].y,f=t[5].x,h=t[5].y}else{const t=n;r=t[0],i=t[1],o=t[2],a=t[3],s=t[4],c=t[5],l=t[6],v=t[7],d=t[8],u=t[9],f=t[10],h=t[11]}const m=[r,o,s,i,a,c,1,1,1],x=g.invert(m,m);return e.a=x[0]*l+x[3]*d+x[6]*f,e.c=x[1]*l+x[4]*d+x[7]*f,e.tx=x[2]*l+x[5]*d+x[8]*f,e.b=x[0]*v+x[3]*u+x[6]*h,e.d=x[1]*v+x[4]*u+x[7]*h,e.ty=x[2]*v+x[5]*u+x[8]*h,t.setFromMatrix(e),this}updateTransform(){const n=super.updateTransform();return this._transformID!==this.transform._worldID&&(this.updateConic(),this._transformID=this.transform._worldID),n}}return n.Conic=x,n.ConicDisplay=_,n}({},pixiBatchRenderer,constants,core,math,display);Object.assign(this.PIXI,_pixi_essentials_conic);
//# sourceMappingURL=conic.js.map
