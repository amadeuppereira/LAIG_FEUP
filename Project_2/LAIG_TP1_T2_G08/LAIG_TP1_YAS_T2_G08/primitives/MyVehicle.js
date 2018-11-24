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
        this.bigCylinder = new MyCylinder(this.scene, 6, 2, 1, 20, 20);
        this.smallCylinder = new MyCylinder(this.scene, 2, 1, 0.5, 20, 20);
        // this.torus = new MyTorus(this.scene, )
		
    }

	display(){
        this.scene.pushMatrix();
            this.scene.translate(0, 0.6, 0);
            this.scene.scale(2.1, 2.1, 2.1);
            this.semiSphere.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.rotate(-90 * DEGREE_TO_RAD, 1, 0, 0);
            this.bigCylinder.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
            this.scene.rotate(90 * DEGREE_TO_RAD, 1, 0, 0);
            this.bigCylinder.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
            this.scene.translate(0, -1, 0);
            this.scene.rotate(90 * DEGREE_TO_RAD, 1, 0, 0);
            this.smallCylinder.display();
		this.scene.popMatrix();
    }
    
    updateTexCoords(s, t) {}

};
