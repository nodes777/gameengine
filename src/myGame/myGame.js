function myGame(htmlCanvasID){
    gEngine.Core.initializeWebGL(htmlCanvasID);
    var gl = gEngine.Core.getGL();
    //simpleSHader(vertexSHaderID, fragmentShaderID)
    this.mConstColorShader = new SimpleShader("src/GLSLShaders/SimpleVS.glsl", "src/GLSLShaders/simpleFS.glsl");

        this.mBlueSq = null;
        this.mRedSq = null;
    // Step C: Create the Renderable objects:
    this.mBlueSq = new Renderable(this.mConstColorShader);
    this.mBlueSq.setColor([0.25, 0.25, 0.95, 1]);
    this.mRedSq = new Renderable(this.mConstColorShader);
    this.mRedSq.setColor([1, 0.25, 0.25, 1]);
    //top left square
    this.mTLSq = new Renderable(this.mConstColorShader);
    this.mTLSq.setColor([0.9, 0.1, 0.1, 1]);
    this.mTRSq = new Renderable(this.mConstColorShader);
    this.mTRSq.setColor([0.1, 0.9, 0.1, 1]);
    //bottom right square
    this.mBRSq = new Renderable(this.mConstColorShader);
    this.mBRSq.setColor([0.1, 0.1, 0.9, 1]);
    this.mBLSq = new Renderable(this.mConstColorShader);
    this.mBLSq.setColor([0.1, 0.1, 0.1, 1]);

    // clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1]);

    // Set the viewport, a given func
    gl.viewport(
        20,     // x position of bottom-left corner of the area to be drawn
        40,     // y position of bottom-left corner of the area to be drawn
        600,    // width of the area to be drawn
        300     // height of the area to be drawn
    );

    // Step E2: set up the corresponding scissor area to limit clear area
    // a given func
    gl.scissor(
        20,     // x position of bottom-left corner of the area to be drawn
        40,     // y position of bottom-left corner of the area to be drawn
        600,    // width of the area to be drawn
        300     // height of the area to be drawn
    );

    // Step E3: enable the scissor area, clear, and then disable the scissor area
    gl.enable(gl.SCISSOR_TEST);
    gEngine.Core.clearCanvas([0.8, 0.8, 0.8, 1.0]);  // clear the scissor area
    gl.disable(gl.SCISSOR_TEST);

    //Define the WC by setting up the View-Projection transform operator.
    // Step F: Set up View and Projection matrices
    var viewMatrix = mat4.create();
    var projMatrix = mat4.create();

    // Step F1: define the view matrix
    mat4.lookAt(viewMatrix, //defines the center
        [20, 60, 10],   // camera position
        [20, 60, 0],    // look at position
        [0, 1, 0]);     // orientation

    // Step F2: define the projection matrix
    mat4.ortho(projMatrix, //defines the dimesion of the WC
        -10,   // distance to left of WC
         10,   // distance to right of WC
        -5,    // distance to bottom of WC
         5,    // distance to top of WC
         0,    // z-distance to near plane
         1000  // z-distance to far plane
    );


    /* lookAt and ortho define the following:
        Center: (20,60)
        Top-left corner: (10, 65)
        Top-right corner: (30, 65)
        Bottom-right corner: (30, 55)
        Bottom-left corner: (10, 55)
    */
    // Step F3: concatenate to form the View-Projection operator
    var vpMatrix = mat4.create();
    mat4.multiply(vpMatrix, projMatrix, viewMatrix);

    // Step G: Draw the blue square, order of operations counts
    // Centre Blue, slightly rotated square
    this.mBlueSq.getXform().setPosition(20, 60);
    this.mBlueSq.getXform().setRotationInRad(0.2); // In Radians
    this.mBlueSq.getXform().setSize(5, 5);
    this.mBlueSq.draw(vpMatrix);

    // Step H: Draw with the red shader
    // centre red square
    this.mRedSq.getXform().setPosition(20, 60);
    this.mRedSq.getXform().setSize(2, 2);
    this.mRedSq.draw(vpMatrix);

    // top left
    this.mTLSq.getXform().setPosition(10, 65);
    this.mTLSq.draw(vpMatrix);

    // top right
    this.mTRSq.getXform().setPosition(30, 65);
    this.mTRSq.draw(vpMatrix);

    // bottom right
    this.mBRSq.getXform().setPosition(30, 55);
    this.mBRSq.draw(vpMatrix);

    // bottom left
    this.mBLSq.getXform().setPosition(10, 55);
    this.mBLSq.draw(vpMatrix);
}