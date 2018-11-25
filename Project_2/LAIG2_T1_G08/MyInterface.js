/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)

        this.initKeys();
        return true;
    }

    /**
     * Adds a folder containing the IDs of the lights passed as parameter.
     * @param {array} lights
     */
    addLightsGroup(lights) {

        var group = this.gui.addFolder("Lights");

        for (var i = 0; i < lights.length; i++) {
            let key = lights[i].id;
            this.scene.lightValues[key] = lights[i].enabled;
            group.add(this.scene.lightValues, key);
        }

    }

    /**
     * Adds a dropdown for all the cameras stores in the scene passed as parameter.
     * @param {CGFscene} scene
     */
    addViews(scene){
        var viewsKeys = [];
        for (var key in this.scene.views) {
            if (this.scene.views.hasOwnProperty(key)) {
                viewsKeys.push(key);
            }
        }

        var controller = this.gui.add(this.scene, 'currentView', viewsKeys);
        controller.onChange(function(value){
            scene.changeCamera(scene.currentView);
        });
    }

    /**
     * Adds a slide to change the camera near attribute of the scene passed as parameter.
     * @param {CGFscene} scene
     */
    addNear(scene){
        var controller = this.gui.add(scene, 'cameraNear', 0.1, 300);
        controller.onChange(function(value){
            scene.updateCameraNear();
        });
    }

    /**
     * Initializes keyboard keys reader.
     */
    initKeys() {
		this.scene.gui=this;
		this.processKeyboard=function(){};
		this.activeKeys={};
	}
    
    /**
     * Processes key pressed.
     */
	processKeyDown(event) {
		this.activeKeys[event.code]=true;
	};

    /**
     * Processes key released.
     */
	processKeyUp(event) {
		this.activeKeys[event.code]=false;
	};

    /**
     * Checks if a key is pressed.
     */
	isKeyPressed(keyCode) {
		return this.activeKeys[keyCode] || false;
    }
    
    /**
     * Checks if a key is released.
     */
    isKeyReleased(keyCode){
        if(this.activeKeys[keyCode])
            return false;
        else
            return true;
    }

}