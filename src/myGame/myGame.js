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
    // Step E: sets the white Renderable object’s transform

    this.mWhiteSq.getXform().setPosition(-0.2, 0.5);
    this.mWhiteSq.getXform().setRotationInRad(0.8);
    this.mWhiteSq.getXform().setSize(1.2, 1.2);
    // Step F: draws the white square (transform behavior in the object)
    this.mWhiteSq.draw();

    // it is possible to setX/Y separately
    this.mRedSq.getXform().setXPos(0.25);
    this.mRedSq.getXform().setYPos(-0.25);
    // Set in degrees
    this.mRedSq.getXform().setRotationInDegree(45);  
    this.mRedSq.getXform().setWidth(0.4);
    this.mRedSq.getXform().setHeight(0.4);
    // Step H: draw the red square (transform in the object)
    this.mRedSq.draw();
}