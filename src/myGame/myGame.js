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
    //activate the right shader
   //this.mShader.activateShader([0, 0, 1, 1]);

    this.mWhiteSq.draw();
    this.mRedSq.draw();
    //var gl = gEngine.Core.getGL();
    //gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
}