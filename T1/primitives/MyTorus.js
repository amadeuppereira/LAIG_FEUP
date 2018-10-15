class MyTorus extends CGFobject {
    constructor(scene, inner, outer, slices, loops) { 
      super(scene);
      
      this.inner = inner;
      this.outer = outer;
      this.slices = slices;
      this.loops = loops;

      this.initBuffers();

      var func = function(u, v) {
        u *= 2*Math.PI; 
        v *= 2*Math.PI; 

        let x = (outer + inner * Math.cos(u)) * Math.cos(v);
        let y = inner * Math.sin(u);
        let z = (outer + inner * Math.cos(u)) * Math.sin(v);


        return [x, y, z];
      };   

      this.object = new CGFnurbsObject(this.scene, func, this.slices, this.loops);
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
      var deltaPhi = 2*Math.PI / this.slices;
      var deltaTheta = 2*Math.PI / this.loops;

      var deltaTexS = 1.0 / this.slices;
      var deltaTexT = 1.0 / this.loops;

      for(let v = 0; v <= this.slices; v++) {
        for(let u = 0; u <= this.loops; u++) {
          let x = (this.outer + this.inner * Math.cos(u*deltaTheta)) * Math.cos(v*deltaPhi);
          let z = this.inner * Math.sin(u*deltaTheta);
          let y = (this.outer + this.inner * Math.cos(u*deltaTheta)) * Math.sin(v*deltaPhi);
          this.vertices.push(x, y, z);

          let cx = Math.cos(v*deltaPhi) * this.outer;
          let cy = 0;
          let cz = Math.sin(v*deltaPhi) * this.outer;

          let n = vec3.fromValues(x - cx, y - cy, z - cz);
          vec3.normalize(n, n);

          this.normals.push(
            n[0], n[1], n[2]  
          );

          this.texCoords.push(
            u * deltaTexS,
            v * deltaTexT);
            
        }
      } 

      for (var i = 0; i < this.slices; i++) {
        for (var j = 0; j < this.loops; j++) {
          this.indices.push(
              i * (this.loops + 1) + j,
              i * (this.loops + 1) + j + 1,
              (i + 1) * (this.loops + 1) + j);
          this.indices.push(
              i * (this.loops + 1) + j + 1,
              (i + 1) * (this.loops + 1) + j + 1,
              (i +1) * (this.loops + 1) + j);
        }
    }


    }
  

  }