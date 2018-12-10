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
        this.sensor = new MyPickableObject(this.scene, 0.72);

        this.previewMaterial = new CGFappearance(this.scene);
        this.previewMaterial.setAmbient(1,0,0,0); 
        this.piecePreview = new MyPiece(this.scene, 30, 30, this.previewMaterial); 
        this.piecePreviewCoord = undefined;
    };

    sensorIdToCoord(id) {
        let c = Math.floor(id/this.size);
        return {row: id - c * this.size + 1,
                col: this.size - c};
    }

    logPicking() {
        if(this.scene.pickMode == false) {
            if(this.scene.pickResults != null && this.scene.pickResults.length > 0) {
                for(let i = 0; i < this.scene.pickResults.length; i++) {
                    let sensor = this.scene.pickResults[i][0];
                    if(sensor) {
                        let coords = this.sensorIdToCoord(this.scene.pickResults[i][1]);
                        if(this.scene.mouseHoverEvent) {
                            this.piecePreviewCoord = {
                                row: coords.row - 1,
                                col: 19 - coords.col
                            };
                            this.scene.mouseHoverEvent = false;
                        } else {
                            console.log(coords);
                        }
                    }
                }
                this.scene.pickResults.splice(0, this.scene.pickResults.length);
            }
            else {
                if(this.scene.mouseHoverEvent) {
                    this.scene.mouseHoverEvent = false;
                    this.piecePreviewCoord = undefined;
                }
            }
        }

    }

    display() {
        this.logPicking();

        this.scene.pushMatrix();
        this.scene.scale(0.2, 0.2, 0.2);
        this.scene.translate(0, 0, 19);
        this.scene.rotate(-Math.PI/2, 1,0,0);

        if(this.scene.pickMode == false) {
            this.board.display();
            if(this.piecePreviewCoord != undefined) {
                this.scene.pushMatrix();
                this.scene.translate(0.6, 0.6, 0);
                this.scene.translate(this.piecePreviewCoord.row*0.99,
                                    this.piecePreviewCoord.col*0.99,
                                    0);
                this.scene.rotate(Math.PI/2, 1,0,0);
                this.scene.scale(0.4, 0.4, 0.4);
                this.piecePreview.display();
                this.scene.popMatrix();
            }
        }
        else {
            this.scene.pushMatrix();
            this.scene.translate(0.23, 0.3, 0);
            for(let i = 0; i < this.size; i++) {
                for(let j = 0; j < this.size; j++) {
                    this.scene.pushMatrix();
                    this.scene.translate(j*0.99, i*0.99, 0);
                    this.scene.registerForPick(j+i*this.size, this.sensor);
                    this.sensor.display();
                    this.scene.popMatrix();
                }
            }
            this.scene.popMatrix();
        }

        this.scene.popMatrix();
    }

    updateTexCoords(s, t) {
        this.board.updateTexCoords(s, t);
    }

};