/**
 * MyCylinder2
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyCylinder2 extends CGFobject
{
	constructor(scene, base, top, heigth, slices, stacks) 
	{
		super(scene);

		this.base = base;
		this.top = top; 
		this.heigth = heigth;
		this.slices = slices;
		this.stacks = stacks;
		this.controlPoints = [
			[
				[0, 		 -this.base,  0, 1],
				[-this.base, -this.base,  0, 1],
				[-this.base, 0,   		  0, 1],
				[-this.base, this.base,   0, 1],
				[0,		     this.base,   0, 1],
				[this.base,  this.base,   0, 1],
				[this.base,	 0,    	      0, 1],
				[this.base,	 -this.base,  0, 1],
				[0, 		 -this.base,  0, 1]
			],
			[
				[0, 		  -this.base,  this.heigth, 1],
				[-this.base,  -this.base,  this.heigth, 1],
				[-this.base,  0,  		   this.heigth, 1],
				[-this.base,  this.base,   this.heigth, 1],
				[0,		      this.base,   this.heigth, 1],
				[this.base,   this.base,   this.height, 1],
				[this.base,	  0,    	   this.height, 1],
				[this.base,	  -this.base,  this.height, 1],
				[0, 		  -this.base,  this.height, 1]
			]
		];

		let nurbsSurface = new CGFnurbsSurface(1, 8, this.controlPoints);
		this.obj = new CGFnurbsObject(this.scene, this.slices, this.stacks, nurbsSurface);
		
		console.log(this.obj.vertices);
    }

	display(){
		this.obj.display();
	}

};
