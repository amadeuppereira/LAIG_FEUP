/**
 * MyCylinder
 * @constructor
 */
class MyCylinder extends CGFobject {
  constructor(scene, slices, stacks) {
    super(scene);

    this.slices = slices;
    this.stacks = stacks;

    this.initBuffers();
  };

  initBuffers() {

  this.vertices = [];
  this.normals = [];
  this.indices = [];
  this.texCoords = [];

  this.getVertices();

  this.primitiveType = this.scene.gl.TRIANGLES;

  this.initGLBuffers();
  };

  getVertices() {
    var angle = (2 * Math.PI) / this.slices;
    var stackSize = 1.0 / this.stacks;

    for (let k = 0; k <= this.stacks; k++) {
      for (let i = 0; i <= this.slices; i++) {
        this.vertices.push(Math.cos(i * angle), Math.sin(i * angle), k*stackSize);
        this.normals.push(Math.cos(i * angle), Math.sin(i * angle), 0);
        this.texCoords.push(i/this.slices,k*stackSize);
      }
    }

    for (let k = 0; k <= this.stacks; k++) {
      for (let i = 0; i <= this.slices; i++) {
        if(k != 0 && i != 0) {
          this.indices.push((this.slices+1)*k + i - 1, (this.slices+1)*(k-1) + i - 1, (this.slices+1)*(k-1) + i);
					this.indices.push((this.slices+1)*k + i - 1, (this.slices+1)*(k-1) + i , (this.slices+1)*k + i);
					if(i == this.slices) {
						this.indices.push((this.slices+1)*(k-1) + i, (this.slices+1)*(k-1), (this.slices+1)*k + i);
						this.indices.push((this.slices+1)*k + i, (this.slices+1)*(k-1), (this.slices+1)*k);
					}
				}
      }
    }
  };
};
