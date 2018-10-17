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
		
		this.a = vec3.distance(this.p1, this.p3);
		this.b = vec3.distance(this.p1, this.p2);
		this.c = vec3.distance(this.p2, this.p3);
		this.beta = Math.acos((this.a*this.a - this.b*this.b + this.a*this.a)/(2*this.a*this.c));
		
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

		this.getNormals();

		this.texCoords = [];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

	getNormals() {
		this.normals = [];
		var v1 = vec3.fromValues(this.p2[0] - this.p1[0], this.p2[1] - this.p1[1], this.p2[2] - this.p1[2]);
		var v2 = vec3.fromValues(this.p3[0] - this.p2[0], this.p3[1] - this.p2[1], this.p3[2] - this.p2[2]);

		var normal = vec3.create();
		vec3.cross(normal, v1, v2);
		vec3.normalize(normal, normal);
	
		this.normals.push(normal[0], normal[1], normal[2]);
		this.normals.push(normal[0], normal[1], normal[2]);
		this.normals.push(normal[0], normal[1], normal[2]);
	};

	updateTexCoords(s, t) {
		this.texCoords = [
			(this.c - this.a * Math.cos(this.beta))/s, (t - this.a * Math.sin(this.beta)),
			0, t,
			(this.c)/s, t
		];
		// this.texCoords = [
		// 	(this.c - this.a * Math.cos(this.beta))/s, (t - this.a * Math.sin(this.beta))/t,
		// 	0, t/t,
		// 	(this.c)/s, t/t
		// ];

		this.updateTexCoordsGLBuffers();

		// console.log(this.texCoords);
	}

};
