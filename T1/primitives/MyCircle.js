/**
 * MyCircle
 * @constructor
 */
class MyCircle extends CGFobject
{
	constructor(scene, slices)
	{
		super(scene);

		this.slices = slices;

		this.initBuffers();
	};

	initBuffers()
	{
		this.vertices = [];
		this.indices = [];
  	this.normals = [];
    this.texCoords = [];

    this.getVertices();

		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	};

  getVertices() {

    var angle = 2*Math.PI / this.slices;

    this.vertices.push(0, 0, 0);
    this.normals.push(0, 0, 1);
    this.texCoords.push(0.5, 0.5);

    for(let i = 0; i < this.slices; i++) {
			let x = Math.cos(i * angle);
			let y = Math.sin(i * angle);
      this.vertices.push(x, y, 0);
      this.normals.push(0, 0, 1);
      this.texCoords.push((x/2)+0.5, 1-((y/2)+ 0.5));
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
};
