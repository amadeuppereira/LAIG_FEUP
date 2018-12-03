/**
 * MyPiece
 * @constructor
 */
class MyPiece extends CGFobject
{
	constructor(scene, uDiv, vDiv, material) {
        super(scene);

        this.uDiv = uDiv;
        this.vDiv = vDiv;
        this.material = material;
        console.log(this.material);
        let controlPoints = [
            [
                [ 0, 0, 1, 1 ],
                [ -2, 0, 1, 1/3 ],
                [ -2, 0, -1, 1/3 ],
                [ 0, 0, -1, 1 ]
            ],

            [
                [ 0, 0, 1, 1/3 ],
                [ -2, 4, 1, 1/9 ],
                [ -2, 4, -1, 1/9 ],
                [ 0, 0, -1, 1/3 ]
            ],

            [
                [ 0, 0, 1, 1/3 ],
                [ 2, 4, 1, 1/9 ],
                [ 2, 4, -1, 1/9 ],
                [ 0, 0, -1, 1/3 ]
            ],

            [
                [ 0, 0, 1, 1 ],
                [ 2, 0, 1, 1/3 ],
                [ 2, 0, -1, 1/3 ],
                [ 0, 0, -1, 1 ]
            ]
        ];

        let nurbsSurface = new CGFnurbsSurface(3, 3, controlPoints);
        this.obj = new CGFnurbsObject(this.scene, this.uDiv, this.vDiv, nurbsSurface);
    };

    display() {
        this.material.apply();

        this.scene.pushMatrix();
        this.scene.scale(1, 0.5, 1);

        this.scene.pushMatrix();
        this.obj.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.obj.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }

    updateTexCoords(s, t) {}

};

