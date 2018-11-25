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
    this.normals = [];
		this.indices = [];
    this.texCoords = [];

    this.getVertices();

		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	};

  getVertices() {
    var angle = Math.PI * 2 / this.slices;

    this.vertices.push(0, 0, 0);
    this.normals.push(0, 0, 1);
    this.texCoords.push(0.5, 0.5);

    for (let i = 0; i < this.slices; i++) {
      let x = this.radius * Math.cos(angle * i);
      let y = this.radius * Math.sin(angle * i)

      this.vertices.push(x, y, 0);
      this.normals.push(0, 0, 1);

      this.texCoords.push(
          (Math.cos(angle * i) / 2) + 0.5,
          0.5 - (Math.sin(angle * i) / 2));
    }

    for(let i = 0; i < this.slices; i++) {
      if(i != this.slices - 1) {
        this.indices.push(0, i + 1, i + 2);
      }
			else {
				this.indices.push(0, i + 1, 1);
			}
    }
    
  };

  updateTexCoords(s, t) {}
};
