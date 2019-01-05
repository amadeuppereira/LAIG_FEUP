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
     * Updates Pente status message.
     */
    updatePenteStatusMessage(msg) {
        this.penteOptions.status = msg;
    }

    /**
     * Adds all the Pente game information and options/settings.
     * @param {CGFscene} scene
     */
    addPenteGroup(scene) {
        let group = this.gui.addFolder("Pente");
        group.open();

        let PenteOptions = function() {
            this.player_vs_player = () => scene.updateGameMode(1);
            this.player_vs_bot    = () => scene.updateGameMode(2);
            this.bot_vs_player    = () => scene.updateGameMode(3);
            this.bot_vs_bot       = () => scene.updateGameMode(4);
            this.undo             = () => scene.undo();
            this.reset            = () => scene.reset();
            this.replay           = () => scene.replay();

            this.maxTime          = 10;

            this.difficulty       = 3;
            this.custom           = false;
            this.depth            = 4;
            this.padding          = 2;
            this.tournament       = false;
            this.width_1          = 4;
            this.width_2          = 3;
            this.width_3          = 2;

            this.status           = "Choose a game mode";
        }

        this.penteOptions = new PenteOptions();

        group.add(this.penteOptions, 'status').listen().name("Status");
        group.add(this.penteOptions, 'maxTime', 1, 60).name("Seconds/Turn");

        let gamemodes = group.addFolder("Game Modes");
        gamemodes.open();
        gamemodes.add(this.penteOptions, 'player_vs_player').name("Player vs Player");
        gamemodes.add(this.penteOptions, 'player_vs_bot').name("Player vs Bot");
        gamemodes.add(this.penteOptions, 'bot_vs_player').name("Bot vs Player");
        gamemodes.add(this.penteOptions, 'bot_vs_bot').name("Bot vs Bot");
    
        let bot_options = group.addFolder("Options");
        bot_options.add(this.penteOptions, 'tournament').name("Tournament Rule");
        bot_options.add(this.penteOptions, 'difficulty', {Trivial: 1, Easy: 2, Medium: 3, Hard: 4, Hardcore: 5}).name("Difficulty")
        .onChange(value => {
            value = parseInt(value);
            switch (value) {
                case 1:
                    this.penteOptions.depth   = 2;
                    this.penteOptions.padding = 1;
                    this.penteOptions.width_1 = 3;
                    this.penteOptions.width_2 = 3;
                    this.penteOptions.width_3 = 3;
                    break;
                case 2:
                    this.penteOptions.depth   = 3;
                    this.penteOptions.padding = 2;
                    this.penteOptions.width_1 = 4;
                    this.penteOptions.width_2 = 3;
                    this.penteOptions.width_3 = 2;
                    break;
                case 3:
                    this.penteOptions.depth   = 4;
                    this.penteOptions.padding = 2;
                    this.penteOptions.width_1 = 4;
                    this.penteOptions.width_2 = 3;
                    this.penteOptions.width_3 = 2;
                    break;
                case 4:
                    this.penteOptions.depth   = 5;
                    this.penteOptions.padding = 2;
                    this.penteOptions.width_1 = 4;
                    this.penteOptions.width_2 = 3;
                    this.penteOptions.width_3 = 2;
                    break;
                case 5:
                    this.penteOptions.depth   = 6;
                    this.penteOptions.padding = 2;
                    this.penteOptions.width_1 = 5;
                    this.penteOptions.width_2 = 4;
                    this.penteOptions.width_3 = 3;
                    break;
            }
        });

        let bot_settings = [5];
        bot_options.add(this.penteOptions, 'custom').onChange(value => this.update_bot_settings(value, bot_settings)).name("Custom");
        bot_settings[0] = bot_options.add(this.penteOptions, 'depth', 1, 10).step(1).listen().name("Depth");
        bot_settings[1] = bot_options.add(this.penteOptions, 'padding', 1, 9).step(1).listen().name("Padding");
        bot_settings[2] = bot_options.add(this.penteOptions, 'width_1', 1, 10).step(1).name("width 1").listen().name("Width (1)");
        bot_settings[3] = bot_options.add(this.penteOptions, 'width_2', 1, 10).step(1).name("width 2").listen().name("Width (2)");
        bot_settings[4] = bot_options.add(this.penteOptions, 'width_3', 1, 10).step(1).name("width 3").listen().name("Width (3)");

        this.update_bot_settings(this.penteOptions.custom, bot_settings);

        let options = group.addFolder("Actions");
        options.add(this.penteOptions, 'undo').name("Undo");
        options.add(this.penteOptions, 'reset').name("Reset");
        options.add(this.penteOptions, 'replay').name("Replay");
    }

    /**
     * Updates bot settings.
     */
    update_bot_settings(v, bot_settings) {
        if(v) {
            bot_settings.forEach(e => {
                e.domElement.style.pointerEvents = "";
                e.domElement.style.opacity = 1;
            })
        } else {
            bot_settings.forEach(e => {
                e.domElement.style.pointerEvents = "none";
                e.domElement.style.opacity = 0.5;
            })
        }
    }

    /**
     * Adds a dropdown for all the ambients in the scene passed as parameter.
     * @param {CGFscene} scene
     */
    addAmbients(scene){
        var ambients = [];

        for(let i = 0; i < scene.graph.rootComponent.children.componentref.length; i++){
            ambients.push(scene.graph.rootComponent.children.componentref[i].id);
        }

        this.gui.add(this.scene, 'currentAmbient', ambients);
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

        var controller = this.gui.add(this.scene, 'currentView', viewsKeys).listen();
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

    /**
     * Processes a mouse move event
     * @param {MouseEvent} event 
     */
    processMouseMove(event) {
        super.processMouseMove(event);
        this.scene.onPick(event);
        this.scene.mouseHoverEvent = true;
    }
}