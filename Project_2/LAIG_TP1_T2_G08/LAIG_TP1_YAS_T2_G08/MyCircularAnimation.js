/**
 * MyCircularAnimation
 * @constructor
 */
class MyCircularAnimation extends MyAnimation{

    /**
     * @constructor
     */
    constructor(scene, id, time, center, initialAngle, rotationAngle, radius) {
        super();

        this.scene = scene;
        this.id = id;
        this.time = time;
        this.center = center;
        this.initialAngle = initialAngle;
        this.rotationAngle = rotationAngle;
        this.radius = radius;

        this.animationVelocity = this.rotationAngle / this.time;
        this.currentAngle = 0;
    }

    update(time){
        if (time > this.time)
            time = this.time;
            
        this.currentAngle = this.initialAngle + this.animationVelocity * time;
    }

    apply(){
        this.scene.translate(this.center[0], this.center[1], this.center[2]);
        this.scene.rotate(this.currentAngle, 0, 1, 0);
        this.scene.translate(this.radius, 0, 0);
    }
}