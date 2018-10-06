/**
 * MyUnitCubeQuad
 * @constructor
 */
class MyUnitCubeQuad extends CGFobject
{
	constructor(scene) 
	{
		super(scene);

		this.quad = new MyQuad(this.scene);
	};

	display() 
	{
		// Front face
		this.scene.pushMatrix();
		this.scene.translate(0, 0, 0.5);
		this.quad.display();
		this.scene.popMatrix();

		// Back face
		this.scene.pushMatrix();
		this.scene.rotate(180 * degToRad, 1, 0, 0);
		this.scene.translate(0, 0, 0.5);
		this.quad.display();
		this.scene.popMatrix();

		// Top face
		this.scene.pushMatrix();
		this.scene.rotate(-90 * degToRad, 1, 0, 0);
		this.scene.translate(0, 0, 0.5);
		this.quad.display();
		this.scene.popMatrix();

		// Back face
		this.scene.pushMatrix();
		this.scene.rotate(90 * degToRad, 1, 0, 0);
		this.scene.translate(0, 0, 0.5);
		this.quad.display();
		this.scene.popMatrix();

		// Right face
		this.scene.pushMatrix();
		this.scene.rotate(-90 * degToRad, 0, 1, 0);
		this.scene.translate(0, 0, 0.5);
		this.quad.display();
		this.scene.popMatrix();

		// Left face
		this.scene.pushMatrix();
		this.scene.rotate(90 * degToRad, 0, 1, 0);
		this.scene.translate(0, 0, 0.5);
		this.quad.display();
		this.scene.popMatrix();
	};
};
