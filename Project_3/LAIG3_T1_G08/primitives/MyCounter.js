/**
 * MyCounter
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyCounter extends CGFobject
{
    constructor(scene) {
        super(scene);

        this.minutesCounter = 0;
        this.secondsCounter = 0;
        this.piecesACounter = 0;
        this.piecesBCounter = 0;

        this.openNumbersTextures();

        this.cube = new MyCube(scene);

        this.piecesATexture = this.zero;
        this.dozensMinutesTexture = this.zero;
        this.unitsMinutesTexture = this.zero;
        this.dozensSecondsTexture = this.zero;
        this.unitsSecondsTexture = this.zero;
        this.piecesBTexture = this.zero;

        this.materialDefault = new CGFappearance(this.scene);
        this.dividerAppearance = new CGFappearance(this.scene);
        this.dividerAppearance.setShininess(100);
        this.dividerAppearance.setAmbient(0.1, 0.1, 0.1);
        this.dividerAppearance.setDiffuse(0.1, 0.1, 0.1);
        this.dividerAppearance.setSpecular(1, 1, 1);
    }

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

    update(deltaTime){
        this.secondsCounter += deltaTime / 1000;
        if(Math.floor(this.secondsCounter) >= 60){
            this.minutesCounter++;
            this.secondsCounter = 0;
        }
        if(Math.floor(this.secondsCounter) >= 60 && this.minutesCounter >= 60){
            this.minutesCounter = 0;
            this.secondsCounter = 0;
        }

        this.updateTextures();
    }

    updateTextures(){
        this.piecesATexture = this.getTexture(this.piecesACounter);
        this.piecesBTexture = this.getTexture(this.piecesBCounter);

        this.dozensMinutesTexture = this.getTexture(Math.floor(this.minutesCounter/10));
        this.unitsMinutesTexture = this.getTexture(this.minutesCounter%10);
        this.dozensSecondsTexture = this.getTexture(Math.floor(this.secondsCounter/10));
        this.unitsSecondsTexture = this.getTexture(Math.floor(this.secondsCounter%10));
    }

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

    incrementPlayerAEatenPieces(){
        this.piecesACounter++;
    }

    incrementPlayerBEatenPieces(){
        this.piecesBCounter++;
    }

	display(){
        if(this.scene.pickMode == true) return;

        this.scene.pushMatrix();
        this.materialDefault.setTexture(this.piecesATexture);
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
        this.materialDefault.setTexture(this.piecesBTexture);
        this.materialDefault.apply();
        this.scene.translate(7.5, 0, 0);
        this.cube.display();
        this.scene.popMatrix();
    }
    
    updateTexCoords(s, t) {}

};
