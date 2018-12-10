/**
 * MyCube
 * @constructor
 */
class MyCube extends CGFobject
{
	constructor(scene) 
	{
		super(scene);

        this.quad = new MyQuad(this.scene, -0.5, -0.5, 0.5, 0.5);
        this.materialDefault = new CGFappearance(this.scene);
        this.materialDefault.setShininess(100);
        this.materialDefault.setAmbient(0, 0 ,0);
        this.materialDefault.setDiffuse(0, 0, 0);
        this.materialDefault.setSpecular(1, 1, 1);
	};

	display() 
	{
        if(this.scene.pickMode == true) return;

		// Front face
		this.scene.pushMatrix();
		this.scene.translate(0, 0, 0.5);
		this.quad.display();
		this.scene.popMatrix();

		// Back face
		this.scene.pushMatrix();
		this.scene.rotate(180 * degToRad, 1, 0, 0);
        this.scene.translate(0, 0, 0.5);
        this.materialDefault.apply();
		this.quad.display();
		this.scene.popMatrix();

		// Top face
		this.scene.pushMatrix();
		this.scene.rotate(-90 * degToRad, 1, 0, 0);
        this.scene.translate(0, 0, 0.5);
        this.materialDefault.apply();
		this.quad.display();
		this.scene.popMatrix();

		// Back face
		this.scene.pushMatrix();
		this.scene.rotate(90 * degToRad, 1, 0, 0);
        this.scene.translate(0, 0, 0.5);
        this.materialDefault.apply();
		this.quad.display();
		this.scene.popMatrix();

		// Right face
		this.scene.pushMatrix();
		this.scene.rotate(-90 * degToRad, 0, 1, 0);
        this.scene.translate(0, 0, 0.5);
        this.materialDefault.apply();
		this.quad.display();
		this.scene.popMatrix();

		// Left face
		this.scene.pushMatrix();
		this.scene.rotate(90 * degToRad, 0, 1, 0);
        this.scene.translate(0, 0, 0.5);
        this.materialDefault.apply();
		this.quad.display();
		this.scene.popMatrix();
	};
};