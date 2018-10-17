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
    addLightsGroup(scene, lights) {

        var group = this.gui.addFolder("Lights");
        //group.open();

        for (var i = 0; i < lights.length; i++) {
            let key = lights[i].id;
            this.scene.lightValues[key] = lights[i].enabled;
            var controller = group.add(this.scene.lightValues, key);
            console.log(this.scene.lightValues);
            controller.onChange(function(value){
                scene.updateLights();
            });
        }


    }

    addViews(scene, viewsKeys){
        var controller = this.gui.add(this.scene, 'currentView', viewsKeys);
        controller.onChange(function(value){
            scene.changeCamera(scene.currentView);
        });
    }

    addNear(scene){
        var controller = this.gui.add(scene, 'cameraNear', 0.1, 300);
        controller.onChange(function(value){
            scene.updateCameraNear();
        });
    }

    initKeys() {
		this.scene.gui=this;
		this.processKeyboard=function(){};
		this.activeKeys={};
	}
	
	processKeyDown(event) {
		this.activeKeys[event.code]=true;
	};

	processKeyUp(event) {
		this.activeKeys[event.code]=false;
	};

	isKeyPressed(keyCode) {
		return this.activeKeys[keyCode] || false;
    }
    
    isKeyReleased(keyCode){
        if(this.activeKeys[keyCode])
            return false;
        else
            return true;
    }

}