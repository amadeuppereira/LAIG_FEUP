/**
 * MyCylinder
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyCylinder extends CGFobject
{
	constructor(scene, base, top, heigth, slices, stacks) 
	{
		super(scene);

		this.slices = slices;
		this.stacks = stacks;
		this.base = base;
		this.radius = 1;
		this.top = top; 
		this.heigth = heigth;

		if(this.base > this.top){
			this.b1 = this.top;
			this.b2 = this.base;
		}else{
			this.b2 = this.base; 
			this.b1 = this.top;
		}

		this.baseCover = new MyCircle(this.scene, this.base, this.slices);
		this.topCover = new MyCircle(this.scene, this.top, this.slices);

		this.initBuffers();
	};

	getRadius(z){
		return (((z / this.heigth) * this.b1) + ((this.heigth - z)/this.heigth) * this.b2);
	}

	initBuffers() 
	{
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		this.getVertices();

		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

	getVertices() {
		let ang = (Math.PI * 2) / this.slices;
		let stackSize = this.heigth / this.stacks;

		for(let j = 0; j <= this.stacks; j++){

			var z = j * stackSize;

			for(let i = 0; i <= this.slices; i++){
				var x = this.getRadius(z) * Math.cos(ang * i);
				var y = this.getRadius(z) *  Math.sin(ang * i); 

				this.vertices.push(x, y, z);
				this.texCoords.push(i/this.slices, z);
				this.normals.push(x, y, 0);

			}

		}
		
		var offset = this.slices + 1;
		
		for(let i = 0; i < (this.stacks * offset); i++){
	   	    if( (i+1) % offset == 0){
                this.indices.push(i, i + 1 - offset, i + offset);
                this.indices.push(i +1 - offset, i +1, i + offset);
		    }
		    else{
            this.indices.push(i, i+1, i + offset);
            this.indices.push(i+1, i +1 + offset, i + offset);
			}
			
		}
	}

	display(){
		super.display();

		this.scene.pushMatrix();
			this.scene.translate(0, 0, this.heigth);
			this.topCover.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
			this.scene.rotate(Math.PI, 1, 0, 0);
			this.baseCover.display();
		this.scene.popMatrix();

	}

	updateTexCoords(s, t) {}
};
