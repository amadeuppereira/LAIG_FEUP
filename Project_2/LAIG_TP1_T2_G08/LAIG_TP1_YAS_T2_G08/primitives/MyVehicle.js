/**
 * MyVehicle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyVehicle extends CGFobject
{
    constructor(scene) {
        super(scene);

        let semiSphere_controlPoints =
            [
                [ 0, 0, 1, 1 ],
                [ -2, 0, 1, 1/3 ],
                [ -2, 0, -1, 1/3 ],
                [ 0, 0, -1, 1 ],

                [ 0, 0, 1, 1/3 ],
                [ -2, 4, 1, 1/9 ],
                [ -2, 4, -1, 1/9 ],
                [ 0, 0, -1, 1/3 ],

                [ 0, 0, 1, 1/3 ],
                [ 2, 4, 1, 1/9 ],
                [ 2, 4, -1, 1/9 ],
                [ 0, 0, -1, 1/3 ],

                [ 0, 0, 1, 1 ],
                [ 2, 0, 1, 1/3 ],
                [ 2, 0, -1, 1/3 ],
                [ 0, 0, -1, 1 ]
            ];

        this.semiSphere = new MyPatch(this.scene, 4, 4, 20, 20, semiSphere_controlPoints);
        this.cylinder = new MyCylinder2(this.scene, 6, 2, 1, 20, 10);
		
    }

	display(){
        this.scene.pushMatrix();
            this.scene.scale(2, 2, 2);
            this.scene.rotate(-40 * DEGREE_TO_RAD, 1, 0, 0);
            this.scene.translate(0, 1, 0);
            this.semiSphere.display();
        this.scene.popMatrix();
        this.scene.rotate(-90, 1, 0, 0);
        this.cylinder.display();
		
    }
    
    updateTexCoords(s, t) {}

};
