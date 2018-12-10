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

        this.dome = new MyPatch(this.scene, 4, 4, 20, 20, semiSphere_controlPoints);
        this.bodyCylinderTop = new MyCylinder(this.scene, 6, 2, 1, 20, 20);
        this.bodyCylinderBottom = new MyCylinder(this.scene, 2, 1, 0.5, 20, 20);
        this.domeTorus = new MyTorus(this.scene, 0.2, 2, 20, 20);
        this.bodyTorus = new MyTorus(this.scene, 0.1, 6, 50, 20);
        this.light = new MyCylinder(this.scene, 0.2, 0.2, 0.2, 20, 20);
        this.nLights = 15;
        this.triangle = new MyTriangle(this.scene, -0.5, 0, 0, 0.5, 0, 0, 0, 0, 1)
        this.quad = new MyQuad(this.scene, -0.5, -0.5, 0.5, 0.5);
        this.nParticles = 30;

        this.particleMaterial = new CGFappearance(this.scene);
        this.particleMaterial.setEmission(1,1,0,1);
        this.particleMaterial.setAmbient(1,1,0,1);

        this.domeMaterial = new CGFappearance(this.scene);
        this.domeMaterial.setAmbient(0.2,0.2,0.2,1);
        this.domeMaterial.setSpecular(0.2,0.2,0.2,1);
        this.domeMaterial.setDiffuse(0.2,0.2,0.2,1);

        this.detailsMaterial = new CGFappearance(this.scene);
        this.detailsMaterial.setAmbient(0.1,1,1,1);
        this.detailsMaterial.setSpecular(0.1,1,1,1);
        this.detailsMaterial.setDiffuse(0.1,1,1,1);
		
    }

	display(){
        if(this.scene.pickMode == true) return;

        this.scene.pushMatrix();
            this.scene.rotate(-90 * DEGREE_TO_RAD, 1, 0, 0);
            this.bodyCylinderTop.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
            this.scene.rotate(90 * DEGREE_TO_RAD, 1, 0, 0);
            this.bodyCylinderTop.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0, -1, 0);
            this.scene.rotate(90 * DEGREE_TO_RAD, 1, 0, 0);
            this.bodyCylinderBottom.display();
        this.scene.popMatrix();

        this.domeMaterial.apply();

        this.scene.pushMatrix();
            this.scene.translate(0, 0.6, 0);
            this.scene.scale(2.1, 2.1, 2.1);
            this.dome.display();
        this.scene.popMatrix();
        
        this.detailsMaterial.apply();
        
        this.scene.pushMatrix();
            this.scene.translate(0, 1, 0);
            this.scene.rotate(-90 * DEGREE_TO_RAD, 1, 0, 0);
            this.domeTorus.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
            this.scene.rotate(-90 * DEGREE_TO_RAD, 1, 0, 0);
            this.bodyTorus.display();
        this.scene.popMatrix();

        let ang = 2*Math.PI / this.nLights;
        for(let i = 0; i < this.nLights; i++) {
            this.scene.pushMatrix();
                this.scene.rotate(ang*i, 0, 1, 0);
                this.scene.translate(0, -0.3, 4.5);
                this.scene.rotate(70 * DEGREE_TO_RAD, 1, 0, 0);
                this.light.display();
            this.scene.popMatrix();
            
            this.scene.pushMatrix();
                this.scene.rotate(ang*i, 0, 1, 0);
                this.scene.translate(0, 0.3, 4.5);
                this.scene.rotate(-70 * DEGREE_TO_RAD, 1, 0, 0);
                this.light.display();
		    this.scene.popMatrix();
        }

        this.particleMaterial.apply();
        for(let i = 0; i < this.nParticles; i++) {
            this.scene.pushMatrix();

            let posx = Math.floor(Math.random() * (1 - (-1)) ) + (-1);
            let posy = Math.floor(Math.random() * (-1.5 - (-5)) ) + (-5);
            let posz = Math.floor(Math.random() * (1 - (-1)) ) + (-1);
            let angle = Math.floor(Math.random() * 2*Math.PI);
            let scale = Math.floor(Math.random() * (1 - (-0.1)) ) + (-0.1);
            let axis = Math.floor(Math.random() * 3);
            let x, y, z;
            switch(axis) {
                case 0:
                    x = true, y = false, z = false;
                    break;
                case 1:
                    x = false, y = true, z = false;
                    break;
                case 2:
                    x = false, y = false, z = true;
                    break;
            }
            this.scene.translate(posx, posy, posz);
            this.scene.rotate(angle, x?1:0, y?1:0, z?1:0);
            this.scene.scale(scale, scale, scale);

            let t = Math.floor(Math.random() * 2);
            switch(t) {
                case 0:
                    this.triangle.display();
                    break;
                case 1:
                    this.quad.display();
                    break;
            }
            this.scene.popMatrix();
        }
    }
    
    updateTexCoords(s, t) {}

};
