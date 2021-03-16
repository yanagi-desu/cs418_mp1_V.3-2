
var gl;
var canvas;
var shaderProgram;
var vertexPositionBuffer;
var defAngle = 0;
var twicePi=2.0*3.14159;
// Create a place to store vertex colors
var vertexColorBuffer;

var mvMatrix = mat4.create();
var rotAngle = 0;    //#initialize rotate angle
var lastTime = 0;   //#counting how long motion has last
function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}


function degToRad(degrees) {
        return degrees * Math.PI / 180;
}

/**create context for webgl**/
function createGLContext(canvas) {
  var names = ["webgl", "experimental-webgl"];
  var context = null;
  for (var i=0; i < names.length; i++) {
    try {
      context = canvas.getContext(names[i]);
    } catch(e) {}
    if (context) {
      break;
    }
  }
  if (context) {
    context.viewportWidth = canvas.width;
    context.viewportHeight = canvas.height;
  } else {
    alert("Failed to create WebGL context!");
  }
  return context;
}

function loadShaderFromDOM(id) {
  var shaderScript = document.getElementById(id);

  // If we don't find an element with the specified id
  // we do an early exit
  if (!shaderScript) {
    return null;
  }

  // Loop through the children for the found DOM element and
  // build up the shader source code as a string
  var shaderSource = "";
  var currentChild = shaderScript.firstChild;
  while (currentChild) {
    if (currentChild.nodeType == 3) { // 3 corresponds to TEXT_NODE
      shaderSource += currentChild.textContent;
    }
    currentChild = currentChild.nextSibling;
  }

  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }

  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}
/**
 * Setup the fragment and vertex shaders
 */
function setupShaders() {
  vertexShader = loadShaderFromDOM("shader-vs");
  fragmentShader = loadShaderFromDOM("shader-fs");

  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Failed to setup shaders");
  }

  gl.useProgram(shaderProgram);
  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

}
//start creating vertices buffer and add in verticies data
function setupBuffers() {
  loadVertices();
//**start implementing clolor buffer and add in color data
  vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  var colors = [
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,

        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,

        1.0, 0.0, 0.0, 1.0, //strip 2 counting from left
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,

        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,

        1.0, 0.0, 0.0, 1.0, //strip 3 counting from left
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,

        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,

        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,

        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,

        1.0, 0.0, 0.0, 1.0, //strip 5 counting from left
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,

        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,

        1.0, 0.0, 0.0, 1.0, //strip 6 counting from left
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,

        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,

        0.25, 0.0, 1.0, 1.0, //Start I
        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,

        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,

        0.25, 0.0, 1.0, 1.0, //Start I
        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,

        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,

        0.25, 0.0, 1.0, 1.0, //Start I
        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,

        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,

        0.25, 0.0, 1.0, 1.0, //Start I
        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,

        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,

        0.25, 0.0, 1.0, 1.0, //Start I
        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,

        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,

        0.25, 0.0, 1.0, 1.0, //Start I
        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,

        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,

        0.25, 0.0, 1.0, 1.0, //Start I
        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,

        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,

        0.25, 0.0, 1.0, 1.0, //Start I
        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,

        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,

        0.25, 0.0, 1.0, 1.0, //Start I
        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,

        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,

        0.25, 0.0, 1.0, 1.0, //Start I
        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,

        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,

        //finish up I with upper rectangle

        0.25, 0.0, 1.0, 1.0, //Start I
        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,

        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,

        0.25, 0.0, 1.0, 1.0, //Start I
        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,

        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,

        0.25, 0.0, 1.0, 1.0, //Start I
        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,

        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,

        0.25, 0.0, 1.0, 1.0, //Start I
        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,

        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,


        0.25, 0.0, 1.0, 1.0, //Start I
        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,

        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,
        0.25, 0.0, 1.0, 1.0,



    ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  vertexColorBuffer.itemSize = 4;
  vertexColorBuffer.numItems = 114;
}

//loadVertices function
function loadVertices(){
  rotAngle = 0.7;
  sinscalar +=0.3*Math.sin(0.7);
  vertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  var eltriangleVertices = [
    //print the left most bottom strip
      -11+Math.cos(sinscalar-0.40)*0.25,-1+Math.cos(sinscalar-0.40)*0.25,0,
      -9+Math.sin(sinscalar-0.40)*0.25,-1+Math.sin(sinscalar-0.40)*0.25,0,
      -11+Math.cos(sinscalar-0.40)*0.25,-4+Math.cos(sinscalar-0.40)*0.25,0,

      -9+Math.cos(sinscalar-0.40)*0.25,-6+Math.cos(sinscalar-0.40)*0.25,0,
      -9+Math.sin(sinscalar-0.40)*0.25,-1+Math.sin(sinscalar-0.40)*0.25,0,
      -11+Math.cos(sinscalar-0.40)*0.25,-4+Math.cos(sinscalar-0.40)*0.25 ,0,
    //strip 2 counting from left
      -7+Math.cos(sinscalar-0.40)*0.25,-1+Math.cos(sinscalar-0.40)*0.25,0,
      -5+Math.cos(sinscalar-0.40)*0.25,-1+Math.cos(sinscalar-0.40)*0.25,0,
      -7+Math.cos(sinscalar-0.40)*0.25,-8+Math.cos(sinscalar-0.40)*0.25,0,

      -5+Math.cos(sinscalar-0.40)*0.25,-10+Math.cos(sinscalar-0.40)*0.25,0,
      -5+Math.cos(sinscalar-0.40)*0.25,-1+Math.cos(sinscalar-0.40)*0.25,0,
      -7+Math.cos(sinscalar-0.40)*0.25,-8+Math.cos(sinscalar-0.40)*0.25,0,
    //strip 3
      -3+Math.cos(sinscalar-0.40)*0.25+Math.sin(sinscalar-0.40)*0.25,-1+Math.cos(sinscalar-0.40)*0.25+Math.sin(sinscalar-0.40)*0.25,0,
      -3+Math.cos(sinscalar-0.40)*0.25+Math.sin(sinscalar-0.40)*0.25,-12+Math.cos(sinscalar-0.40)*0.25+Math.sin(sinscalar-0.40)*0.25,0,
      -1+Math.cos(sinscalar-0.40)*0.25+Math.sin(sinscalar-0.40)*0.25,-14+Math.cos(sinscalar-0.40)*0.25+Math.sin(sinscalar-0.40)*0.25,0,

      -3+Math.cos(sinscalar-0.40)*0.25+Math.sin(sinscalar-0.40)*0.25,-1+Math.cos(sinscalar-0.40)*0.25+Math.sin(sinscalar-0.40)*0.25,0,
      -1+Math.cos(sinscalar-0.40)*0.25+Math.sin(sinscalar-0.40)*0.25,-14+Math.cos(sinscalar-0.40)*0.25+Math.sin(sinscalar-0.40)*0.25,0,
      -1+Math.cos(sinscalar-0.40)*0.25+Math.sin(sinscalar-0.40)*0.25,-1+Math.cos(sinscalar-0.40)*0.25+Math.sin(sinscalar-0.40)*0.25,0,

      //print 4 counting from left
        11+Math.cos(sinscalar-0.40)*0.25,-1+Math.sin(sinscalar-0.40)*0.25,0,
        9+Math.sin(sinscalar-0.40)*0.25,-1+Math.cos(sinscalar-0.40)*0.25,0,
        11+Math.cos(sinscalar-0.40)*0.25,-4+Math.cos(sinscalar-0.40)*0.25,0,

        9+Math.cos(sinscalar-0.40)*0.25,-6+Math.sin(sinscalar-0.40)*0.25,0,
        9+Math.sin(sinscalar-0.40)*0.25,-1+Math.cos(sinscalar-0.40)*0.25,0,
        11+Math.cos(sinscalar-0.40)*0.25,-4+Math.cos(sinscalar-0.40)*0.25,0,
      //strip 5 counting from left
      7+Math.cos(sinscalar-0.40)*0.25,-1+Math.cos(sinscalar-0.40)*0.25,0,
      5+Math.cos(sinscalar-0.40)*0.25,-1+Math.cos(sinscalar-0.40)*0.25,0,
      7+Math.cos(sinscalar-0.40)*0.25,-8+Math.cos(sinscalar-0.40)*0.25,0,

      5+Math.cos(sinscalar-0.40)*0.25,-10+Math.cos(sinscalar-0.40)*0.25,0,
      5+Math.cos(sinscalar-0.40)*0.25,-1+Math.cos(sinscalar-0.40)*0.25,0,
      7+Math.cos(sinscalar-0.40)*0.25,-8+Math.cos(sinscalar-0.40)*0.25,0,
      //strip 6
      3+Math.cos(sinscalar-0.40)*0.25+Math.sin(sinscalar-0.40)*0.25,-1+Math.cos(sinscalar-0.40)*0.25+Math.sin(sinscalar-0.40)*0.25,0,
      3+Math.cos(sinscalar-0.40)*0.25+Math.sin(sinscalar-0.40)*0.25,-12+Math.cos(sinscalar-0.40)*0.25+Math.sin(sinscalar-0.40)*0.25,0,
      1+Math.cos(sinscalar-0.40)*0.25+Math.sin(sinscalar-0.40)*0.25,-14+Math.cos(sinscalar-0.40)*0.25+Math.sin(sinscalar-0.40)*0.25,0,

      3+Math.cos(sinscalar-0.40)*0.25+Math.sin(sinscalar-0.40)*0.25,-1+Math.cos(sinscalar-0.40)*0.25+Math.sin(sinscalar-0.40)*0.25,0,
      1+Math.cos(sinscalar-0.40)*0.25+Math.sin(sinscalar-0.40)*0.25,-14+Math.cos(sinscalar-0.40)*0.25+Math.sin(sinscalar-0.40)*0.25,0,
      1+Math.cos(sinscalar-0.40)*0.25+Math.sin(sinscalar-0.40)*0.25,-1+Math.cos(sinscalar-0.40)*0.25+Math.sin(sinscalar-0.40)*0.25,0,
// The I part
        -5,3,0, //bottom left rectangle
        -11,0,0,
        -11,3,0,

        -5,3,0,
        -5,0,0,
        -11,0,0,

        -5,3,0, //right rectangle
        -5,10,0,
        -3,10,0,

        -3,10,0,
        -3,3,0,
        -5,3,0,

        -5,3,0,//middle square
        -5,10,0,
        -11,3,0,

        -11,3,0,
        -5,10,0,
        -11,10,0,

        -11,13,0,//upper rectangle
        -5,10,0,
        -11,10,0,

        -11,13,0,
        -5,10,0,
        -5,13,0,

        //do mirror here to draw both side of I

        5,3,0, //bottom left rectangle
        11,0,0,
        11,3,0,

        5,3,0,
        5,0,0,
        11,0,0,

        5,3,0, //right rectangle
        5,10,0,
        3,10,0,

        3,10,0,
        3,3,0,
        5,3,0,

        5,3,0,//middle square
        5,10,0,
        11,3,0,

        11,3,0,
        5,10,0,
        11,10,0,

        11,13,0,//upper rectangle
        5,10,0,
        11,10,0,

        11,13,0,
        5,10,0,
        5,13,0,
        //finish up I with upper rectangle
        -13,16,0,//left square
        -13,13,0,
        -11,13,0,

        -13,16,0,
        -11,16,0,
        -11,13,0,

        -11,16,0,//middile square
        -5,16,0,
        -11,13,0,

        -11,13,0,
        -5,13,0,
        -5,16,0,

        13,16,0,//right square
        13,13,0,
        11,13,0,

        13,16,0,
        11,16,0,
        11,13,0,

        11,16,0,//right rectangle
        5,16,0,
        11,13,0,

        11,13,0,
        5,13,0,
        5,16,0,
        //last rectangle
        -5,16,0,
        5,16,0,
        -5,13,0,

        -5,13,0,
        5,16,0,
        5,13,0,

  ];
  var triangleVertices = [-11+Math.cos(sinscalar-0.40)*0.25,-1+Math.cos(sinscalar-0.40)*0.25,0];
  var divisor =18;
  var radius=0.5;
  var z=0;
  for (i=3;i<360;i+=3){
      angle = i *  twicePi / 10;
      x=eltriangleVertices[i];
      y=eltriangleVertices[i+1];
      dPt = deformSin(x,y);
      triangleVertices.push(x+dPt[0]);
      triangleVertices.push(y+dPt[1]);
      triangleVertices.push(z);
  }
  for(var i=0,length=360;i<length;i++){
    triangleVertices[i]=triangleVertices[i]/divisor;
  };
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
  vertexPositionBuffer.itemSize = 3;
  vertexPositionBuffer.numberOfItems = 114;
}

function draw() {
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  //mat4.identity(mvMatrix);
//  mat4.ortho(mvMatrix,-17, 17, -17, 17, -1, 1);//
 /*
  * Your code goes here
  * Affine transformations can be implemented as modifications to the model view matrix
  */
  mat4.identity(mvMatrix);
  mat4.rotateX(mvMatrix, mvMatrix, degToRad(rotAngle));
  mat4.rotateY(mvMatrix, mvMatrix, degToRad(rotAngle));

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
                         vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,
                            vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

  setMatrixUniforms();
  gl.drawArrays(gl.TRIANGLES, 0, vertexPositionBuffer.numberOfItems);
}
/*
 * Startup function called from html code to start program.
 */
function startup() {
  canvas = document.getElementById("myGLCanvas");
  gl = createGLContext(canvas);
  setupShaders();
  setupBuffers();
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  tick();
}
var sinscalar = 0;

//animate the badge, rearrange vertices in it everytime being called by tick//
function animate(){
    defAngle= (defAngle+1.0) % 360;
    loadVertices();
  }
//***from lab 2***
function deformSin(x,y){
    var circPt = vec2.fromValues(x,y);
    var dist   = 0.2*Math.sin(angle+degToRad(defAngle));
    vec2.normalize(circPt,circPt);
    vec2.scale(circPt,circPt,dist);
    return circPt;
}
/**
 * Tick called for every animation frame.
 */
function tick() {
    requestAnimFrame(tick);
    draw();
    animate();
}
