//asumsi jika buku dianimasikan dalam bentuk 3d
var cubeRotation = 0.0;

let dir = 1;
let velocity = 0.5;
let speed = 0.0126; //speed atau kecepatan sesuai nrp
 
main();

function main() {
  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    varying lowp vec4 vColor;
    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

  const fsSource = `
    varying lowp vec4 vColor;
    void main(void) {
      gl_FragColor = vColor;
    }
  `;

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  const shaderProgram2 = initShaderProgram(gl, vsSource, fsSource);
  
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    }
  };
  const programInfo2 = {
    program: shaderProgram2,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram2, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram2, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram2, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram2, 'uModelViewMatrix'),
    }
  };

  const buffers = initBuffers(gl, "kanan");
  const buffers2 = initBuffers(gl, "kiri");

  function render() {

      drawScene(gl, programInfo2, buffers2, null);
      drawScene(gl, programInfo, buffers, "second");

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

function initBuffers(gl, type) {

  const positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  let positions;

  if(type == "kanan") //antara X = 0 hingga 1
  positions = [ 
    // depan
    0.0,  0.0,  0.5, //titik H
    0.7,  0.0,  0.5, //titik G
    0.7,  1.0,  0.5, //titik C
    0.0,  1.0,  0.5, //titik B

    // belakang
    0.7,  0.0,  0.2, //titik F
    0.0,  0.0,  0.2, //titik E
    0.0,  1.0,  0.2, //titik A
    0.7,  1.0,  0.2, //titik D

    // atas
    0.0,  0.0,  0.2, //titik E
    0.7,  0.0,  0.2, //titik F
    0.7,  0.0,  0.5, //titik G
    0.0,  0.0,  0.5, //titik H

    // bawah
    0.0,  1.0,  0.2, //titik A
    0.7,  1.0,  0.2, //titik D
    0.7,  1.0,  0.5, //titik C
    0.0,  1.0,  0.5, //titik B

    // kanan
    0.7,  0.0,  0.2, //titik F
    0.7,  0.0,  0.5, //titik G
    0.7,  1.0,  0.5, //titik C
    0.7,  1.0,  0.2, //titik D

    // kiri
    0.0,  0.0,  0.2, //titik E
    0.0,  0.0,  0.5, //titik H
    0.0,  1.0,  0.5, //titik B
    0.0,  1.0,  0.2, //titik A
  ];
  
  if(type == "kiri") //sama seperti kanan tetapi antara X = -1 hingga 0
  positions = [
    // depan
     0.0,   0.0,  -0.5,
    -0.7,   0.0,  -0.5,
    -0.7,  -1.0,  -0.5,
     0.0,  -1.0,  -0.5,

    // belakang
    -0.7,   0.0,  -0.2,
     0.0,   0.0,  -0.2,
     0.0,  -1.0,  -0.2,
    -0.7,  -1.0,  -0.2,

    // atas
     0.0,  0.0,  -0.2,
    -0.7,  0.0,  -0.2,
    -0.7,  0.0,  -0.5,
     0.0,  0.0,  -0.5,

    // bawah
     0.0,  -1.0,  -0.2,
    -0.7,  -1.0,  -0.2,
    -0.7,  -1.0,  -0.5,
     0.0,  -1.0,  -0.5,

    // kanan
    -0.7,   0.0,  -0.2,
    -0.7,   0.0,  -0.5,
    -0.7,  -1.0,  -0.5,
    -0.7,  -1.0,  -0.2,

    // kiri
    0.0,   0.0,  -0.2,
    0.0,   0.0,  -0.5,
    0.0,  -1.0,  -0.5,
    0.0,  -1.0,  -0.2,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  
  const faceColors = [
    [0.0,  0.0,  1.0,  1.0],    // depan buku : biru
    [0.0,  0.0,  1.0,  1.0],    // belakang buku : biru
    [1.0,  1.0,  1.0,  1.0],    // atas buku : putih(warna kertas)
    [1.0,  1.0,  1.0,  1.0],    // bawah buku : putih(warna kertas)
    [1.0,  1.0,  1.0,  1.0],    // kanan buku : putih(warna kertas)
    [0.0,  0.0,  1.0,  1.0],    // kiri buku : biru
  ];

  var colors = [];

  for (var j = 0; j < faceColors.length; ++j) {
    const c = faceColors[j];
    colors = colors.concat(c, c, c, c);
  }

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  const indices = [
    0,  1,  2,      0,  2,  3,    // depan
    4,  5,  6,      4,  6,  7,    // belakang
    8,  9,  10,     8,  10, 11,   // atas
    12, 13, 14,     12, 14, 15,   // bawah
    16, 17, 18,     16, 18, 19,   // kanan
    20, 21, 22,     20, 22, 23,   // kiri
  ];

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    color: colorBuffer,
    indices: indexBuffer,
  };
}

function drawScene(gl, programInfo, buffers, order) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  
  gl.clearDepth(1.0);                 
  gl.enable(gl.DEPTH_TEST);           
  gl.depthFunc(gl.LEQUAL);            

  velocity += speed * dir;
  if(velocity >= 1.5 || velocity <= -2.5) dir*= -1
  
  if(order != "second")
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const fieldOfView = 45 * Math.PI / 180;   
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  const modelViewMatrix = mat4.create();

  if(order != "second"){

    mat4.translate(modelViewMatrix,modelViewMatrix,[-1.0, 0.5, -6.0]); 
    mat4.rotate(modelViewMatrix, modelViewMatrix, -0.1, [0, 1, 0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, -0.05, [0, 0, 1]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, 5.5 ,[1, 0, 0]); 
  }
  else{

    mat4.translate(modelViewMatrix, modelViewMatrix, [1.5, velocity , -6.0]); 
    mat4.rotate(modelViewMatrix, modelViewMatrix, 0.2, [0, 1, 0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, 0.2, [0, 0, 1]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, 5.5 ,[1, 0, 0]); 
  }
  
  
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
  }

  {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexColor);
  }

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  gl.useProgram(programInfo.program);

  gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);

  {
    const vertexCount = 36;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }
}

function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}