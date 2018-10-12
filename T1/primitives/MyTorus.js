class MyTorus extends CGFobject {
    constructor(scene, inner, outer, slices, loops) { 
      super(scene);
      
      this.inner = inner;
      this.outer = outer;
      this.slices = slices;
      this.loops = loops;

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

    display() {
        this.object.display();
    }
  

  }