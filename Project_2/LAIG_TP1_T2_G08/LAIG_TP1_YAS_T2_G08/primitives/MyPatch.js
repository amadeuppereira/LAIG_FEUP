/**
 * MyPatch
 * @constructor
 */
class MyPatch extends CGFobject
{
	constructor(scene, nPointsU, nPointsV, uDiv, vDiv, controlPoints) {
        super(scene);

        this.uDiv = uDiv;
        this.vDiv = vDiv;
        this.nPointsU = nPointsU;
        this.nPointsV = nPointsV;
        this.controlPoints = controlPoints;
        this.uDeg = this.nPointsU - 1;
        this.vDeg = this.nPointsV - 1;

        let nurbsSurface = new CGFnurbsSurface(this.uDeg, this.vDeg, this.controlPoints);
        this.obj = new CGFnurbsObject(this.scene, this.uDiv, this.vDiv, nurbsSurface);

    };

    display() {
        this.obj.display();
    }

};

