class MySphere extends CGFobject {
    constructor(scene, radius, slices, stacks) { 
        super(scene);
        
        this.radius = radius;
        this.slices = slices;
        this.stacks = stacks;
    
        this.initBuffers();
    };

    initBuffers() {
        this.indices = [];
        this.vertices = [];
        this.normals = [];
        this.texCoords = [];

        this.getVertices();
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    getVertices() {
    
        var deltaTheta = Math.PI / this.stacks;
        var deltaPhi = 2 * Math.PI / this.slices;
    
        var deltaTexS = 1.0 / this.slices;
        var deltaTexT = 1.0 / this.stacks;
    
        for (var i = 0; i <= this.stacks; i++) {
            var deltaX = this.radius * Math.sin(i * deltaTheta);
            var deltaY = this.radius * Math.sin(i * deltaTheta);
            var currentZ = this.radius * Math.cos(i * deltaTheta);
    
            for (var j = 0; j <= this.slices; j++) {
                var x = deltaX * Math.cos(j * deltaPhi);
                var y = deltaY * Math.sin(j * deltaPhi);
                var z = currentZ;
    
                this.vertices.push(x, y, z);
    
                this.normals.push(
                    Math.sin(i * deltaTheta) * Math.cos(j * deltaPhi),
                    Math.sin(i * deltaTheta) * Math.sin(j * deltaPhi),
                    Math.cos(i * deltaTheta));
    
                this.texCoords.push(
                    j * deltaTexS,
                    i * deltaTexT);
            }
        }
    
        for (var i = 0; i < this.stacks; i++) {
            for (var j = 0; j < this.slices; j++) {
                this.indices.push(
                    i * (this.slices + 1) + j,
                    (i + 1) * (this.slices + 1) + j,
                    (i + 1) * (this.slices + 1) + j + 1);
                this.indices.push(
                    i * (this.slices + 1) + j,
                    (i + 1) * (this.slices + 1) + j + 1,
                    i * (this.slices + 1) + j + 1);
            }
        }
    }

    updateTexCoords(s, t) {}
}