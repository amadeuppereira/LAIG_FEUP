/**
 * MyWater
 * @constructor
 */
class MyWater extends MyPlane {

	constructor(scene, texture, heightmap, parts, heightscale, texscale) {
        super(scene, parts, parts);

        this.texture = texture;
        this.heightmap = heightmap;
        this.heightscale = heightscale || 1.0;
        this.texscale = texscale || 1.0;
        this.speed = 1.6 * 1000;
        this.timeFactor = 0;

        this.shader = new CGFshader(this.scene.gl, "shaders/water_shader.vert", "shaders/water_shader.frag");
        this.shader.setUniformsValues({uTexture: 0,
                                    uHeightmap: 1,
                                    uHeightScale: this.heightscale,
                                    uTexscale: this.texscale});

        // this.texture = new CGFtexture(this.scene, this.idtexture);
        // this.heightmap = new CGFtexture(this.scene, this.idheightmap);
    };

    display() {
        this.scene.setActiveShader(this.shader);
        this.texture.bind(0);
        this.heightmap.bind(1);
        this.scene.scale(50, 50, 50);
        this.obj.display();
        this.scene.setActiveShader(this.scene.defaultShader);
    }

    update(deltaTime) {
        this.timeFactor += this.speed * deltaTime; //this.speed * deltaTime ~= 0.01;
        this.shader.setUniformsValues({uTimeFactor: this.timeFactor});
    }

    updateTexCoords(s, t) {}
};

