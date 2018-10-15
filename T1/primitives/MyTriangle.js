/**
 * MyTriangle
 * @constructor
 */

class MyTriangle extends CGFobject
{
	constructor(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3)
	{
		super(scene);

        this.p1 = [x1, y1, z1];
        this.p2 = [x2, y2, z2];
        this.p3 = [x3, y3, z3];

		this.initBuffers();
	};

	initBuffers()
	{
		this.vertices = [
			this.p1[0], this.p1[1], this.p1[2],
			this.p2[0], this.p2[1], this.p2[2],
			this.p3[0], this.p3[1], this.p3[2]
		];

		this.indices = [
		0, 1, 2
		];

		this.getTexCoords();
		this.getNormal();

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

	getTexCoords() {
    	this.texCoords = [0, 0];

    	var d1 = vec3.distance(this.p1, this.p2);
    	this.texCoords.push(d1, 0);

    	var d2 = vec3.distance(this.p2, this.p3);
    	var d3 = vec3.distance(this.p1, this.p3);

    	var cosBeta = Math.pow(d2, 2) - Math.pow(d3, 2) + Math.pow(d1, 2);
    	cosBeta /= 2 * d2 * d1;
    	var beta = Math.acos(cosBeta);
    	this.texCoords.push(
    	    d1 - d2 * cosBeta,
    	    d2 * Math.sin(beta));
	}

	getNormal() {
		var a = vec3.fromValues(
			this.p2[0] - this.p1[0],
	        this.p2[1] - this.p1[1],
	        this.p2[2] - this.p1[2]
	    );
	
		var b = vec3.fromValues(
		    this.p3[0] - this.p1[0],
		    this.p3[1] - this.p1[1],
		    this.p3[2] - this.p1[2]
		);
	
		var normal = vec3.create();
		vec3.cross(normal, a, b);
	
		vec3.normalize(normal, normal);
	
		this.normals = [];
		this.normals.push(normal[0], normal[1], normal[2]);
		this.normals.push(normal[0], normal[1], normal[2]);
		this.normals.push(normal[0], normal[1], normal[2]);
		
	};

	updateTexCoords(s, t) {
		for (var i = 0; i < this.texCoords.length; i += 2) {
			this.texCoords[i] = this.originalTexCoords[i] / s;
			this.texCoords[i+1] = 1 - (this.originalTexCoords[i+1] / t);
		}
	
		this.updateTexCoordsGLBuffers();
	}

};
