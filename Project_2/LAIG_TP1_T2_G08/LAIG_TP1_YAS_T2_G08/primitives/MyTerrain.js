/**
 * MyTerrain
 * @constructor
 */
class MyTerrain extends MyPlane {

	constructor(scene, texture, heightmap, parts, heightscale) {
        super(scene, parts, parts);

        this.idtexture = texture;
        this.idheightmap = heightmap;
        this.heightscale = heightscale || 1;

        this.shader = new CGFshader(this.scene.gl, "shaders/terrain_shader.vert", "shaders/terrain_shader.frag");
        this.scene.setActiveShader(this.shader);
        this.shader.setUniformsValues({uTexture: 0, uHeightmap: 1, uHeightScale: this.heightscale});

        this.texture = new CGFtexture(this.scene, this.idtexture);
        this.heightmap = new CGFtexture(this.scene, this.idheightmap);

        this.scene.setActiveShader(this.scene.defaultShader);

    };

    display() {
        this.scene.setActiveShader(this.shader);
        this.texture.bind(0);
        this.heightmap.bind(1);
        this.scene.scale(50, 50, 50);
        this.obj.display();
        this.scene.setActiveShader(this.scene.defaultShader);
    }

};

