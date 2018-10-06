/**
 * MyCircle
 * @constructor
 */
class MyCircle extends CGFobject
{
	constructor(scene, radius, slices)
	{
		super(scene);

		this.radius = radius;
		this.slices = slices;

		this.initBuffers();
	};

	initBuffers()
	{
		this.vertices = [];
		this.indices = [];
    this.texCoords = [];

    this.getVertices();

		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	};

  getVertices() {
		this.originalTexCoords = [];

    // Assign vertices
    var deltaTheta = Math.PI * 2 / this.slices;
    for (let i = 0; i < this.slices; i++) {
        this.vertices.push(
            this.radius * Math.cos(deltaTheta * i),
            this.radius * Math.sin(deltaTheta * i), 0);

        this.originalTexCoords.push(
            (Math.cos(deltaTheta * i) / 2) + 0.5,
            0.5 - (Math.sin(deltaTheta * i) / 2));
    }

    // Center vertex
    var center_idx = this.vertices.length / 3;
    this.vertices.push(0, 0, 0);
    this.originalTexCoords.push(0.5, 0.5);

    // Assign indices
    for (let i = 0; i < this.slices; i++) {
        this.indices.push(center_idx, i, (i+1) % this.slices);
    }
    
    this.texCoords = this.originalTexCoords.slice();

  };
};
