/**
 * MyCylinder
 * @constructor
 */
class MyCylinder extends CGFobject {
  constructor(scene, base, top, height, slices, stacks) {
    super(scene);

    this.base = base;
    this.top = top;
    this.height = height;
    this.slices = slices;
    this.stacks = stacks;

    this.topCircle = new MyCircle(scene, this.top, this.slices);
    this.baseCircle = new MyCircle(scene, this.base, this.slices);

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
    this.originalTexCoords = [];
    var deltaRadius = (this.top - this.base) / this.stacks;

    var deltaTheta = (2 * Math.PI) / this.slices;
    var deltaHeight = this.height / this.stacks;

    var deltaX = 1.0 / this.slices;
    var deltaY = 1.0 / this.stacks;

    var xCoord = 0;
    var yCoord = 0;

    for (let i = 0; i <= this.stacks; i++) {
        for (let j = 0; j < this.slices; j++) {
            this.vertices.push(
                Math.cos(deltaTheta * j) * (i * deltaRadius + this.base),
                Math.sin(deltaTheta * j) * (i * deltaRadius + this.base),
                i * deltaHeight);
            this.normals.push(
                Math.cos(deltaTheta * j),
                Math.sin(deltaTheta * j),
                0);

            this.vertices.push(
                Math.cos(deltaTheta * (j+1)) * (i * deltaRadius + this.base),
                Math.sin(deltaTheta * (j+1)) * (i * deltaRadius + this.base),
                i * deltaHeight);
            this.normals.push(
                Math.cos(deltaTheta * (j+1)),
                Math.sin(deltaTheta * (j+1)),
                0);

            this.originalTexCoords.push(xCoord, yCoord);
            xCoord += deltaX;
            this.originalTexCoords.push(xCoord, yCoord);
        }

        xCoord = 0;
        yCoord += deltaY;
    }

    // Indices
    for(let i = 0; i < this.stacks; i++) {
        for(let j = 0; j < this.slices; j++) {
            this.indices.push(i*this.slices*2 + j*2, i*this.slices*2 + j*2+1, (i+1)*this.slices*2 + j*2);
            this.indices.push(i*this.slices*2 + j*2+1, (i+1)*this.slices*2 + j*2+1, (i+1)*this.slices*2 + j*2);
        }
    }

    this.texCoords = this.originalTexCoords.slice();
  };

  display() {
    super.display();

    this.scene.pushMatrix();
    this.scene.translate(0, 0, this.height);
    this.topCircle.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.baseCircle.display();
    this.scene.popMatrix();
  };
};
