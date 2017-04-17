function myGame(htmlCanvasID){
    this.mShader = null;
    gEngine.Core.initializeWebGL(htmlCanvasID);
    //simpleSHader(vertexSHaderID, fragmentShaderID)
    this.mConstColorShader = new SimpleShader("src/GLSLShaders/SimpleVS.glsl", "src/GLSLShaders/simpleFS.glsl");

    this.mWhiteSq = new Renderable(this.mConstColorShader);
    this.mWhiteSq.setColor([1,1,1,1]);
    this.mRedSq = new Renderable(this.mConstColorShader);
    this.mRedSq.setColor([1,0,0,1]);

    gEngine.Core.clearCanvas([0,0.8,0,1]);
    //activate the right shader this is done inside Renderables now
   //this.mShader.activateShader([0, 0, 1, 1]);

    //var gl = gEngine.Core.getGL();
    //gl.drawArrays(gl.TRIANGLE_STRIP,0,4);

    // Create a new identify transform operator
    // From the gl-matrix library
    var xform = mat4.create();

    // Step E: compute the white square transform
    // These funcs are all in the gl-matrix library
    // TRS order

    // Move left and up
    // rotate0.2 radians
    // Scale 1.2 times
    mat4.translate(xform, xform, vec3.fromValues(-0.25, 0.25, 0.0));
    // Rotation is in radians
    mat4.rotateZ(xform, xform, 0.2);
    mat4.scale(xform, xform, vec3.fromValues(1.2, 1.2, 1.0));
    // Step F: draw the white square with the computed transform
    //draw(modelTransform) now takes the transforms
    this.mWhiteSq.draw(xform);

    // Step G: compute the red square transform
    // restart with the identity transform
    mat4.identity(xform);
    mat4.translate(xform, xform, vec3.fromValues(0.25, -0.25, 0.0));
    mat4.rotateZ(xform, xform, -0.785);   // rotation of about -45-degrees
    mat4.scale(xform, xform, vec3.fromValues(0.4, 0.4, 1.0));

    // Step H: draw the red square with the computed transform
    this.mRedSq.draw(xform);
}