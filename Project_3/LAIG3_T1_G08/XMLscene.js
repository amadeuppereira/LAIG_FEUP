var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
        this.lightValues = {};
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);

        this.setPickEnabled(true);

        //to check when M key is pressed or released
        this.KeyMPressed = false;
        
        //Project 3
        this.mouseHoverEvent = false;
        this.pente = new Pente();
        this.board;

        this.FPS = 150;
        this.setUpdatePeriod(1000/this.FPS);
    }

    updateGameMode(mode) {
        let op = this.getOptionsString();
        let init = this.pente.init(mode, op);
        if(init) init.then(() => {
            this.updateMessage();
            this.board.updateBoard(this.pente.board)
            if(mode == 4) this.botvbot();
        })
    }

    getOptionsString() {
        let op = this.interface.penteOptions;
        let ret = "[";
        if(op.tournament) ret += "tournament(true)";
        else ret += "tournament(false)";
        if(!op.custom) ret += ",difficulty(" + op.difficulty + ")]";
        else {
            ret += ",depth(" + op.depth + ")";
            ret += ",padding(" + op.padding + ")";
            ret += ",width([" + op.width_1;
            ret += "," + op.width_2;
            ret += "," + op.width_3 + "])]";
        }
        return ret;
    }

    updateMessage() {
        if(this.pente.winner) {
            this.interface.updatePenteStatusMessage("Gameover ("
            + ((this.pente.winner == "w") ? "P1" : "P2") + " Won)");
            return;
        }

        if(!this.pente.active_game) {
            this.interface.updatePenteStatusMessage("Choose a game mode");
            return; 
        }

        switch(this.pente.game_mode) {
            case 1: 
            if(this.pente.next == "w") this.interface.updatePenteStatusMessage("P1 Turn"); 
            else this.interface.updatePenteStatusMessage("P2 Turn"); 
            break;
            case 2: 
            if(this.pente.next == "w") this.interface.updatePenteStatusMessage("P1 Turn"); 
            else this.interface.updatePenteStatusMessage("BOT2 Turn"); 
            break;
            case 3: 
            if(this.pente.next == "w") this.interface.updatePenteStatusMessage("BOT1 Turn"); 
            else this.interface.updatePenteStatusMessage("P2 Turn"); 
            break;
            case 4: 
            if(this.pente.next == "w") this.interface.updatePenteStatusMessage("BOT1 Turn"); 
            else this.interface.updatePenteStatusMessage("BOT2 Turn"); 
            break;
        }
    }

    undo() {
        if(this.pente.undo()) {
            this.board.updateBoard(this.pente.board);
            this.updateMessage();
        }
    }

    reset() {
        this.pente.reset().then( () => {
            this.board.updateBoard(this.pente.board);
            this.updateMessage();
        })
    }

    board_click(coords) {        
        if(this.pente.active_game && this.pente.player_turn) {
            switch(this.pente.game_mode) {
                case 1:
                    this.pente.player_turn = false;
                    this.pente.move(coords.row, coords.col)
                    .then(() => {
                        this.board.updateBoard(this.pente.board);
                        this.pente.gameover().then(r => {
                            this.pente.player_turn = true;
                            this.updateMessage();
                        })
                    }) 
                    break;
                case 2:
                    this.pente.player_turn = false;
                    this.pente.move(coords.row, coords.col)
                    .then(() => {
                        this.board.updateBoard(this.pente.board);
                        this.pente.gameover().then(r => {
                            if(!r) {
                                this.pente.bot().then( () => {
                                    this.board.updateBoard(this.pente.board);
                                    this.pente.gameover().then(r => {
                                        this.pente.player_turn = true;
                                        this.updateMessage();
                                    })
                                })  
                            }
                            this.updateMessage();
                        })
                    }) 
                    break;
                case 3:
                    this.pente.player_turn = false;
                    this.pente.move(coords.row, coords.col)
                    .then(() => {
                        this.board.updateBoard(this.pente.board);
                        this.pente.gameover().then(r => {
                            if(!r) {
                                this.pente.bot().then( () => {
                                    this.board.updateBoard(this.pente.board);
                                    this.pente.gameover().then(r => {
                                        this.pente.player_turn = true;
                                        this.updateMessage();
                                    })
                                })  
                            }
                            this.updateMessage();
                        })
                    }) 
                    break;
            }
        }    
    }

    botvbot() {
        if(this.pente.active_game) {
            this.pente.bot()
            .then(() => {
                this.board.updateBoard(this.pente.board);
                this.pente.gameover().then(r => {
                    if(!r) {
                        this.botvbot();
                    }
                    this.updateMessage();
                })
            })   
        }
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                //lights are predefined in cgfscene
                this.lights[i].setPosition(light.location[0], light.location[1], light.location[2], light.location[3]);
                this.lights[i].setAmbient(light.ambient[0], light.ambient[1], light.ambient[2], light.ambient[3]);
                this.lights[i].setDiffuse(light.diffuse[0], light.diffuse[1], light.diffuse[2], light.diffuse[3]);
                this.lights[i].setSpecular(light.specular[0], light.specular[1], light.specular[2], light.specular[3]);

                this.lights[i].setVisible(true);
                if (light.enabled)
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                if(light.angle != null) {
                    this.lights[i].setSpotCutOff(light.angle);
                    this.lights[i].setSpotDirection(light.target[0]-light.location[0], light.target[1]-light.location[1], light.target[2]-light.location[2]);
                    this.lights[i].setSpotExponent(light.exponent);
                }

                this.lights[i].update();

                i++;
            }
        }
    }

    /**
     * Creates all the scene cameras and stores them in an array.
     */
    initViews(){
        this.views = [];
        for(var key in this.graph.views){
            var near = this.graph.views[key].near;
            var far = this.graph.views[key].far;
            var angle = this.graph.views[key].angle;
            var left = this.graph.views[key].left;
            var right = this.graph.views[key].right;
            var top = this.graph.views[key].top;
            var bottom = this.graph.views[key].bottom;
            var from = this.graph.views[key].from;
            var to = this.graph.views[key].to;

            if(this.graph.views[key].type == "perspective"){
                this.views[key] = new CGFcamera(angle, near, far, vec3.fromValues(from.x, from.y, from.z), vec3.fromValues(to.x, to.y, to.z));
            }
            else{
                this.views[key] = new CGFcameraOrtho(left, right, bottom, top, near, far, vec3.fromValues(from.x, from.y, from.z), vec3.fromValues(to.x, to.y, to.z), vec3.fromValues(0,1,0));
            }
        }
    }

    /* 
     * Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.initViews();
        this.camera = this.views[this.graph.defaultView];
        this.interface.setActiveCamera(this.camera);

        this.axis = new CGFaxis(this, this.graph.axisLength);

        this.setGlobalAmbientLight(this.graph.ambientIllumination[0], this.graph.ambientIllumination[1], 
            this.graph.ambientIllumination[2], this.graph.ambientIllumination[3]);
        this.gl.clearColor(this.graph.backgroundColor[0], this.graph.backgroundColor[1], this.graph.backgroundColor[2], this.graph.backgroundColor[3]);

        this.initLights();
        
        // Adds lights group.
        this.interface.addLightsGroup(this.graph.lights);

        // Adds Views
        this.currentView = this.graph.defaultView;
        this.interface.addViews(this);

        //Add Camera Near
        this.cameraNear = this.camera.near;
        this.interface.addNear(this);

        this.interface.addPenteGroup(this);

        this.sceneInited = true;
    }

    /**
     * Updates scene lights.
     */
    updateLights(){
        var i = 0;
        for (var key in this.lightValues) {
            if (this.lightValues.hasOwnProperty(key)) {
                if (this.lightValues[key]) {
                    this.lights[i].setVisible(true);
                    this.lights[i].enable();
                }
                else {
                    this.lights[i].setVisible(false);
                    this.lights[i].disable();
                }
                this.lights[i].update();
                i++;
            }
        }
    }

    /**
     * Changes current camera when changed on gui.
     */
    changeCamera(currentCamera){
        this.camera = this.views[currentCamera];
        this.interface.setActiveCamera(this.camera);
    }

    /**
     * Updates camera near attribute when changes on gui.
     */
    updateCameraNear(){
        this.camera.near = this.cameraNear;
    }

    /**
     * Checks keyboard keys pressed.
     */
    checkKeyPressed(){
        if(this.gui.isKeyPressed("KeyM") && this.KeyMPressed == false){
            this.KeyMPressed = true;
        }

        if(this.gui.isKeyReleased("KeyM") && this.KeyMPressed == true){
            this.graph.materialCounter++;
            this.KeyMPressed = false;
        }
    }

    /**
     * Displays the scene.
     */
    display() {
        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        // Draw axis
        this.axis.display();

        if (this.sceneInited) {
            this.pushMatrix();
            this.updateLights();
            this.checkKeyPressed();

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();

            this.popMatrix();
        }
    }

    update(currTime){
        var today = new Date();

		currTime -= today.getTimezoneOffset()*60*1000;

		this.lastTime = this.lastTime || 0;
		this.deltaTime = currTime - this.lastTime;
		this.lastTime = currTime;

        if(this.sceneInited){
            var components = this.graph.components;
            for(let i = 0; i < components.length; i++){

                if(components[i].children.primitiveref.length == 1){
                    if(components[i].children.primitiveref[0].type == "water"){
                        components[i].children.primitiveref[0].primitive.update(this.deltaTime);
                    }
                    else if(components[i].children.primitiveref[0].type == "counter"){
                        if(this.pente.game_mode == null)
                            components[i].children.primitiveref[0].primitive.reset();
                        else if(this.pente.active_game)
                            components[i].children.primitiveref[0].primitive.update(this.deltaTime, this.pente.captures);
                        else if(this.pente.winner == null)
                            components[i].children.primitiveref[0].primitive.reset();
                    }
                }

                //update animations
                for(let n = 0; n < components[i].animations.length; n++){
                    if(components[i].animations[n].timeCounter < components[i].animations[n].time) {
                        components[i].animations[n].update(this.deltaTime);
                        break;
                    } 
                }
            }
        }
    }
}