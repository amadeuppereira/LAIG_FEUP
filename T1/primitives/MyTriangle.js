/**
 * MyTriangle
 * @constructor
 */
class MyTriangle extends CGFobject
{
	constructor(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3)
	{
		super(scene);

		this.minX = minX;
		this.maxX = maxX;
		this.minY = minY;
		this.maxY = maxY;

		this.initBuffers();
	};

	initBuffers()
	{
		this.vertices = [
			this.minX, this.minY, 0,
			this.maxX, this.minY, 0,
			this.minX, this.maxY, 0,
			this.maxX, this.maxY, 0
		];

		this.indices = [
		0, 1, 2,
		3, 2, 1
		];

		this.primitiveType = this.scene.gl.TRIANGLES;

		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];

		this.texCoords = [
			0, 1,
			1, 1,
			0, 0,
			1, 0,
		];

		this.initGLBuffers();
	};
};
