/**
 * MyCounter
 * @constructor
 */

class MyCounter extends CGFobject
{
    /**
     * @constructor
     * @param {CGFscene} scene 
     */
    constructor(scene) {
        super(scene);

        this.minutesCounter = 0;
        this.secondsCounter = 0;
        this.piecesACounter = 0;
        this.piecesBCounter = 0;
        this.countdown = 0;

        this.openNumbersTextures();

        this.cube = new MyCube(scene);

        this.dozensPiecesATexture = this.zero;
        this.unitsPiecesATexture = this.zero;
        this.dozensPiecesBTexture = this.zero;
        this.unitsPiecesBTexture = this.zero;
        this.dozensMinutesTexture = this.zero;
        this.unitsMinutesTexture = this.zero;
        this.dozensSecondsTexture = this.zero;
        this.unitsSecondsTexture = this.zero;
        this.dozensCountdownP1 = this.zero;
        this.unitsCountdownP1 = this.zero;
        this.dozensCountdownP2 = this.zero;
        this.unitsCountdownP2 = this.zero;

        this.materialDefault = new CGFappearance(this.scene);
        this.materialDefault.setEmission(0.5, 0.5, 0.5);
        this.dividerAppearance = new CGFappearance(this.scene);
        this.dividerAppearance.setShininess(100);
        this.dividerAppearance.setAmbient(0.1, 0.1, 0.1);
        this.dividerAppearance.setDiffuse(0.1, 0.1, 0.1);
        this.dividerAppearance.setSpecular(1, 1, 1);
        this.redAppearance = new CGFappearance(this.scene);
        this.redAppearance.setEmission(0.5, 0.5, 0.5);
        this.redAppearance.setAmbient(0.9, 0, 0);
        this.redAppearance.setDiffuse(0.9, 0, 0);
        this.redAppearance.setSpecular(1, 1, 1);
    }

    /**
     * Creates numbers textures from files.
     */
    openNumbersTextures(){
        this.zero = new CGFtexture(this.scene, "./scenes/images/zero.jpg");
        this.one = new CGFtexture(this.scene, "./scenes/images/one.jpg");
        this.two = new CGFtexture(this.scene, "./scenes/images/two.jpg");
        this.three = new CGFtexture(this.scene, "./scenes/images/three.jpg");
        this.four = new CGFtexture(this.scene, "./scenes/images/four.jpg");
        this.five = new CGFtexture(this.scene, "./scenes/images/five.jpg");
        this.six = new CGFtexture(this.scene, "./scenes/images/six.jpg");
        this.seven = new CGFtexture(this.scene, "./scenes/images/seven.jpg");
        this.eight = new CGFtexture(this.scene, "./scenes/images/eight.jpg");
        this.nine = new CGFtexture(this.scene, "./scenes/images/nine.jpg");
        this.twoPointsTexture = new CGFtexture(this.scene, "./scenes/images/two_points.jpg");
    }

    /**
     * Updates the counter information (clock, countdown and captures).
     */
    update(deltaTime, pente){
        this.secondsCounter += deltaTime / 1000;
        if(Math.floor(this.secondsCounter) >= 60){
            this.minutesCounter++;
            this.secondsCounter = 0;
        }
        if(Math.floor(this.secondsCounter) >= 60 && this.minutesCounter >= 60){
            this.minutesCounter = 0;
            this.secondsCounter = 0;
        }

        this.piecesACounter = parseInt(pente.captures.b);
        this.piecesBCounter = parseInt(pente.captures.w);

        if(pente.next == "w"){
            this.countdownP1 = pente.maxTime - pente.timer;
            this.countdownP2 = pente.maxTime;
        }
        else{
            this.countdownP2 = pente.maxTime - pente.timer;
            this.countdownP1 = pente.maxTime;
        }

        this.updateTextures();
    }

    /**
     * Updates the variables textures.
     */
    updateTextures(){
        this.dozensPiecesATexture = this.getTexture(Math.floor(this.piecesACounter/10));
        this.unitsPiecesATexture = this.getTexture(this.piecesACounter%10);
        this.dozensPiecesBTexture = this.getTexture(Math.floor(this.piecesBCounter/10));
        this.unitsPiecesBTexture = this.getTexture(this.piecesBCounter%10);

        this.dozensMinutesTexture = this.getTexture(Math.floor(this.minutesCounter/10));
        this.unitsMinutesTexture = this.getTexture(this.minutesCounter%10);
        this.dozensSecondsTexture = this.getTexture(Math.floor(this.secondsCounter/10));
        this.unitsSecondsTexture = this.getTexture(Math.floor(this.secondsCounter%10));

        this.dozensCountdownP1 = this.getTexture(Math.floor(this.countdownP1/10));
        this.unitsCountdownP1 = this.getTexture(Math.floor(this.countdownP1%10));
        this.dozensCountdownP2 = this.getTexture(Math.floor(this.countdownP2/10));
        this.unitsCountdownP2 = this.getTexture(Math.floor(this.countdownP2%10));
    }

    /**
     * Returns the texture corresponding to the number.
     */
    getTexture(number){
        switch (number) {
            case 0:
                return this.zero;
            case 1:
                return this.one;
            case 2:
                return this.two;
            case 3:
                return this.three;
            case 4:
                return this.four;
            case 5:
                return this.five;
            case 6:
                return this.six;
            case 7:
                return this.seven;
            case 8:
                return this.eight;
            case 9:
                return this.nine;
            default:
                break;
        }
    }
    
    /**
     * Resets the counter information.
     */
    reset(){
        this.minutesCounter = 0;
        this.secondsCounter = 0;
        this.piecesACounter = 0;
        this.piecesBCounter = 0;
    }

    /**
     * Displays the counter.
     */
	display(){
        if(this.scene.pickMode == true) return;

        this.scene.pushMatrix();
        this.materialDefault.setTexture(this.dozensPiecesATexture);
        this.materialDefault.apply();
        this.scene.translate(-1, 0, 0);
        this.cube.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.materialDefault.setTexture(this.unitsPiecesATexture);
        this.materialDefault.apply();
        this.cube.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.dividerAppearance.apply();
        this.scene.translate(1, 0, 0);
        this.cube.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.materialDefault.setTexture(this.dozensMinutesTexture);
        this.materialDefault.apply();
        this.scene.translate(2, 0, 0);
        this.cube.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.materialDefault.setTexture(this.unitsMinutesTexture);
        this.materialDefault.apply();
        this.scene.translate(3, 0, 0);
        this.cube.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.materialDefault.setTexture(this.twoPointsTexture);
        this.materialDefault.apply();
        this.scene.translate(3.75, 0, 0);
        this.scene.scale(0.5, 1, 1);
        this.cube.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.materialDefault.setTexture(this.dozensSecondsTexture);
        this.materialDefault.apply();
        this.scene.translate(4.5, 0, 0);
        this.cube.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.materialDefault.setTexture(this.unitsSecondsTexture);
        this.materialDefault.apply();
        this.scene.translate(5.5, 0, 0);
        this.cube.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.dividerAppearance.apply();
        this.scene.translate(6.5, 0, 0);
        this.cube.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.materialDefault.setTexture(this.dozensPiecesBTexture);
        this.materialDefault.apply();
        this.scene.translate(7.5, 0, 0);
        this.cube.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.materialDefault.setTexture(this.unitsPiecesBTexture);
        this.materialDefault.apply();
        this.scene.translate(8.5, 0, 0);
        this.cube.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.dividerAppearance.apply();
        this.scene.translate(3.75, 0.6, 0);
        this.scene.scale(10.5, 0.2, 1);
        this.cube.display();
        this.scene.popMatrix();

        // UP
        this.scene.pushMatrix();
        if(this.countdownP2 < 4){
            this.redAppearance.setTexture(this.dozensCountdownP2);
            this.redAppearance.apply();
        }
        else{
            this.materialDefault.setTexture(this.dozensCountdownP2);
            this.materialDefault.apply();
        }
        this.scene.translate(0.5, 1.2, 0);
        this.cube.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        if(this.countdownP2 < 4){
            this.redAppearance.setTexture(this.unitsCountdownP2);
            this.redAppearance.apply();
        }
        else{
            this.materialDefault.setTexture(this.unitsCountdownP2);
            this.materialDefault.apply();
        }
        this.scene.translate(1.5, 1.2, 0);
        this.cube.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        if(this.countdownP1 < 4){
            this.redAppearance.setTexture(this.dozensCountdownP1);
            this.redAppearance.apply();
        }
        else{
            this.materialDefault.setTexture(this.dozensCountdownP1);
            this.materialDefault.apply();
        }
        this.scene.translate(6, 1.2, 0);
        this.cube.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        if(this.countdownP1 < 4){
            this.redAppearance.setTexture(this.unitsCountdownP1);
            this.redAppearance.apply();
        }
        else{
            this.materialDefault.setTexture(this.unitsCountdownP1);
            this.materialDefault.apply();
        }
        this.scene.translate(7, 1.2, 0);
        this.cube.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.dividerAppearance.apply();
        this.scene.translate(-0.75, 1.2, 0);
        this.scene.scale(1.5, 1, 1);
        this.cube.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.dividerAppearance.apply();
        this.scene.translate(3.75, 1.2, 0);
        this.scene.scale(3.5, 1, 1);
        this.cube.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.dividerAppearance.apply();
        this.scene.translate(8.25, 1.2, 0);
        this.scene.scale(1.5, 1, 1);
        this.cube.display();
        this.scene.popMatrix();
    }
    
    updateTexCoords(s, t) {}

};
