/**
 * MyTerrain
 * @constructor
 */
class MyTerrain extends MyPlane
{
	constructor(scene, texture, heightmap, parts, heightscale) {
        super(scene, parts, parts);

        this.texture = texture;
        this.heightmap = heightmap;
        this.heightscale = heightscale;

        this.shader = new CGFshader(this.scene.gl);

    };

    display() {
        this.scene.setActiveShader(this.shader);
        this.obj.display();
        this.scene.setActiveShader(this.scene.defaultShader);
    }

};

