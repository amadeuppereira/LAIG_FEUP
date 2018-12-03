/**
 * MyBoard
 * @constructor
 */
class MyBoard extends CGFobject
{
	constructor(scene, size) {
        super(scene);
        this.size = size;

        this.board = new MyQuad(this.scene, 0, 0, 19, 19);
        this.sensor = new MyQuad(this.scene, 0, 0, 0.72, 0.72);

        this.material = new CGFappearance(this.scene);
        this.material.setAmbient(0,0,1,0); 
        
    };

    display() {
        this.scene.pushMatrix();

        if(this.scene.pickMode == false) {
            this.board.display();
            this.material.apply();
            this.scene.pushMatrix();
            this.scene.translate(0.23, 0.3, 0.00001);
            for(let i = 0; i < this.size; i++) {
                for(let j = 0; j < this.size; j++) {
                    this.scene.pushMatrix();
                    this.scene.translate(j*0.99, i*0.99, 0.1);
                    this.sensor.display();
                    this.scene.popMatrix();
                }
            }
            this.scene.popMatrix();
        }
        else {
        }

        this.scene.popMatrix();
    }

    updateTexCoords(s, t) {
        this.board.updateTexCoords(s, t);
    }

};