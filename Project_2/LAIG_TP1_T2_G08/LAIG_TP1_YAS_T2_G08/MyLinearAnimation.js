/**
 * MyLinearAnimation
 * @constructor
 */
class MyLinearAnimation extends MyAnimation{

    /**
     * @constructor
     */
    constructor(scene, id, time, points) {
        super();

        this.scene = scene;
        this.id = id;
        this.time = time;
        this.points = points;
        this.totalDistance = 0;
        this.routes = [];
        for(var i = 0; i < points.length - 1; i++){
            this.totalDistance += vec3.dist(vec3.fromValues(points[i].x, points[i].y, points[i].z), vec3.fromValues(points[i + 1].x, points[i + 1].y, points[i + 1].z));
            this.routes.push(this.totalDistance);
        }
        this.animationVelocity = this.totalDistance / this.time;
        this.previousAngle = 0;
        
        this.difference = 0;
        this.currentFirstPoint = 0;
        this.currentSecondPoint = 0;
        this.timeCounter = 0;
    }

    update(deltaTime){
        this.timeCounter += (deltaTime / 1000);

        if(this.timeCounter > this.time)
            this.timeCounter = this.time;
        
        //Calculations for translation
        this.currentPosition = this.animationVelocity * this.timeCounter;

        var i = 0;
        while (this.currentPosition > this.routes[i] && i < this.routes.length)
		    i++;

        this.currentFirstPoint = this.points[i];
        this.currentSecondPoint = this.points[i+1];

        if(i == 0)
            this.difference = this.currentPosition/this.routes[i];
        else
            this.difference = (this.currentPosition - this.routes[i-1]) / (this.routes[i] - this.routes[i-1]);
    
        //Calculations for rotation
        var angle = Math.atan((this.currentSecondPoint.x - this.currentFirstPoint.x) / (this.currentSecondPoint.z - this.currentFirstPoint.z));

        if (this.currentSecondPoint.z - this.currentFirstPoint.z < 0)
            angle += Math.PI;
    
        this.previousAngle = angle;
    }

    apply(){
        this.scene.translate((this.currentSecondPoint.x - this.currentFirstPoint.x) * this.difference + this.currentFirstPoint.x, (this.currentSecondPoint.y - this.currentFirstPoint.y) * this.difference + this.currentFirstPoint.y, (this.currentSecondPoint.z - this.currentFirstPoint.z) * this.difference + this.currentFirstPoint.z);
        this.scene.rotate(this.previousAngle, 0, 1, 0);
    }

    clone(){
        return new MyLinearAnimation(this.scene, this.id, this.time, this.points);
    }
}