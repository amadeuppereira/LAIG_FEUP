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

                this.lights[i].update();

                i++;
            }
        }
    }

    initViews(){
        this.views = [];
        for(var key in this.graph.views){
            var near = this.graph.views[key].near;
            var far = this.graph.views[key].far;
            var angle = this.graph.views[key].angle;
            var left = this.graph.views[key].left;
            var right = this.graph.views[key].right;
            var top = this.graph.views[key].top;
            var bottom = this.graph.views[key].top;
            var from = this.graph.views[key].from;
            var to = this.graph.views[key].to;

            if(this.graph.views[key].type == "perspective"){
                this.views[key] = new CGFcamera(angle, near, far, vec3.fromValues(from.x, from.y, from.z), vec3.fromValues(to.x, to.y, to.z));
            }
            else{
                //this.views[key] = new CGFcameraOrtho(left,right,bottom,top,near,far);
            }
        }
    }


    /* Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.initViews();
        this.camera = this.views[this.graph.defaultView];
        this.interface.setActiveCamera(this.camera);

        //TODO: Change reference length according to parsed graph
        this.axis = new CGFaxis(this, this.graph.axisLength);

        // TODO: Change ambient and background details according to parsed graph
        this.setGlobalAmbientLight(this.graph.ambientIllumination[0], this.graph.ambientIllumination[1], 
            this.graph.ambientIllumination[2], this.graph.ambientIllumination[3]);
        this.gl.clearColor(this.graph.backgroundColor[0], this.graph.backgroundColor[1], this.graph.backgroundColor[2], this.graph.backgroundColor[3]);

        this.initLights();
        
        // Adds lights group.
        this.interface.addLightsGroup(this.graph.lights);

        // Adds Views
        var viewsKeys = [];
        for (var key in this.views) {
            if (this.views.hasOwnProperty(key)) {
                viewsKeys.push(key);
            }
        }
        this.currentView = this.graph.defaultView;
        this.interface.gui.add(this, 'currentView', viewsKeys);

        this.sceneInited = true;
    }


    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

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

            this.camera = this.views[this.currentView];
            this.interface.setActiveCamera(this.camera);

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
            this.popMatrix();
        }

        // ---- END Background, camera and axis setup
    }
}