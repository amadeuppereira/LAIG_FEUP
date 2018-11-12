/**
 * MyPatch
 * @constructor
 */
class MyPatch extends CGFobject
{
	constructor(scene, uDiv, vDiv, controlPoints) {
        super(scene);

        this.uDiv = uDiv;
        this.vDiv = vDiv;
        this.controlPoints = controlPoints;
        this.uDeg = this.controlPoints.length - 1;
        this.vDeg = this.controlPoints[0].length - 1;

        let nurbsSurface = new CGFnurbsSurface(this.uDeg, this.vDeg, this.controlPoints);
        this.obj = new CGFnurbsObject(this.scene, this.uDiv, this.vDiv, nurbsSurface);

    };

    display() {
        this.obj.display();
    }

};

