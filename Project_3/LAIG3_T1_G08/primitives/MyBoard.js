/**
 * MyBoard
 * @constructor
 */
class MyBoard extends CGFobject
{
	constructor(scene, p1_mat, p2_mat, preview_mat) {
        super(scene);
        this.scene.board = this;

        this.size = 19;

        this.board = new MyQuad(this.scene, 0, 0, this.size, this.size);
        this.sensor = new MyPickableObject(this.scene, 0.72);

        this.piecePreviewCoord = undefined;
        this.piecePreview = new MyPiece(this.scene, 30, 30, preview_mat); 
        this.pieceP1 = new MyPiece(this.scene, 30, 30, p1_mat);    
        this.pieceP2 = new MyPiece(this.scene, 30, 30, p2_mat); 

        this.pieces = [];
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
                                col: this.size - coords.col
                            };
                            this.scene.mouseHoverEvent = false;
                        } else {
                            this.scene.board_click(coords);
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

    updateBoard(board) {
        board = board.replace(/[,\[\]]/g, "");
        let flag;
        for(let i = 0; i < this.size*this.size; i++) {
            flag = true;
            let t = Math.floor(i/this.size);
            let coords = {row: t + 1, col: i - t*this.size + 1}
            for(let j = this.pieces.length - 1; j >= 0; j--) {
                if(coords.row == this.pieces[j].coords.row && coords.col == this.pieces[j].coords.col) {
                    flag = false;
                    if(board[i] == "c") {
                        this.pieces.splice(j, 1);
                        break;
                    } else if (board[i] == "w" || board[i] == "b") break;
                }
            }
            if(flag) {
                if(board[i] == "w") {
                    let initialCoordsP1 = {x: 20.4, y: -0.1, z: 1};
                    this.pieces.push({coords: coords, currentCoords: initialCoordsP1, piece: this.pieceP1});
                }
                else if(board[i] == "b") {
                    let initialCoordsP2 = {x: 20.4, y: 17.9, z: 1};
                    this.pieces.push({coords: coords, currentCoords: initialCoordsP2, piece: this.pieceP2});
                }
            }
        }            
    }

    displayPreview() {
        if(this.piecePreviewCoord != undefined) {
            this.scene.pushMatrix();
            this.scene.translate(0.6, 0.6, 0);
            this.scene.translate(this.piecePreviewCoord.row*0.99,
                                this.piecePreviewCoord.col*0.99,
                                0.1);
            this.scene.rotate(Math.PI/2, 1,0,0);
            this.scene.scale(0.4, 0.4, 0.4);
            this.piecePreview.display();
            this.scene.popMatrix();
        }
    }

    displayPieces() {
        this.pieces.forEach(e => {
            this.scene.pushMatrix();
            this.scene.translate(0.6, 0.6, 0);
            this.scene.translate(e.currentCoords.x, e.currentCoords.y, e.currentCoords.z);
            this.scene.rotate(Math.PI/2, 1,0,0);
            this.scene.scale(0.4, 0.4, 0.4);
            e.piece.display();
            this.scene.popMatrix();
            
            let finalCoords = {x: (e.coords.row-1) *0.99, y: (this.size - e.coords.col)*0.99, z: 0.2};
            let x_increment = 0.1;
            let y_increment = 0.1;

            if(Math.abs(finalCoords.x-e.currentCoords.x) > Math.abs(finalCoords.y-e.currentCoords.y)){
                y_increment = Math.abs(finalCoords.y-e.currentCoords.y)* 0.1/Math.abs(finalCoords.x-e.currentCoords.x);
            }
            else{
                x_increment = Math.abs(finalCoords.x-e.currentCoords.x)*0.1/Math.abs(finalCoords.y-e.currentCoords.y);
            }

            if(Math.abs(finalCoords.x-e.currentCoords.x) < 0.1){
                e.currentCoords.x = finalCoords.x;
            } else{
                if(finalCoords.x > e.currentCoords.x){
                    e.currentCoords.x += x_increment;
                } else{
                    e.currentCoords.x -= x_increment;
                }
            }

            if(Math.abs(finalCoords.y-e.currentCoords.y) < 0.1){
                e.currentCoords.y = finalCoords.y;
            } else{
                if(finalCoords.y > e.currentCoords.y){
                    e.currentCoords.y += y_increment;
                } else{
                    e.currentCoords.y -= y_increment;
                }
            }

            if(e.currentCoords.y == finalCoords.y && e.currentCoords.x == finalCoords.x){
                if(e.currentCoords.z > finalCoords.z)
                    e.currentCoords.z -= 0.1;
                else{
                    e.currentCoords.z = finalCoords.z;
                }
            }
        });
    }

    display() {
        this.logPicking();

        this.scene.pushMatrix();
        this.scene.scale(0.2, 0.2, 0.2);
        this.scene.translate(0, 0, this.size);
        this.scene.rotate(-Math.PI/2, 1,0,0);

        if(this.scene.pickMode == false) {
            this.board.display();
            this.displayPreview();
            this.displayPieces();
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