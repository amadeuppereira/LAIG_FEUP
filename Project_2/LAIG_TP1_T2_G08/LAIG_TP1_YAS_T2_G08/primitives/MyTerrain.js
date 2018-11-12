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

        this.shader = new CGFshader(this.scene.gl, "shaders/shader.vert", "shaders/shader.frag");
        this.shader.setUniformsValues({uTexture: 1, uHeightmap: 2, uHeightScale: this.heightscale});

        this.texture = new CGFtexture(this.scene, this.idtexture);
        this.heightmap = new CGFtexture(this.scene, this.idheightmap);

    };

    display() {
        this.scene.setActiveShader(this.shader);
        this.texture.bind(1);
        this.heightmap.bind(2);
        this.scene.scale(10, 10, 10);
        this.obj.display();
        this.scene.setActiveShader(this.scene.defaultShader);
    }

};

