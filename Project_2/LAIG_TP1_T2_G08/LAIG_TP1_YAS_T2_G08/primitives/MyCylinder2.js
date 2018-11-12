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

		this.slices = slices;
		this.stacks = stacks;
		this.base = base;
		this.radius = 1;
		this.top = top; 
        this.heigth = heigth;
    }

	display(){

	}

};
