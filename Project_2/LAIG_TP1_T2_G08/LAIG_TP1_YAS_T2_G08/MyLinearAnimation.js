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
            this.totalDistance += vec3.dist(vec3.fromValues(points[i][0], points[i][1], points[i][2]), vec3.fromValues(points[i + 1][0], points[i + 1][1], points[i + 1][2]));
            this.routes.push(this.totalDistance);
        }
        this.animationVelocity = this.currentDistance / this.time;
        this.previousAngle = 0;
        
        this.difference = 0;
        this.currentFirstPoint = 0;
        this.currentSecondPoint = 0;
    }

    update(time){
        if(time > this.time)
            time = this.time;

        //Calculations for translation
        this.currentPosition = this.animationVelocity * time;

        var i;
        for(i = 0; i < this.routes.length; ){
            if(this.currentPosition > this.routes[i])
                i++;
        }

        this.currentFirstPoint = this.points[i];
        this.currentSecondPoint = this.points[i+1];

        if(i == 0)
            this.difference = this.currentPosition/this.routes[i];
        else
            this.difference = (this.currentPosition - this.routes[i-1]) / (this.routes[i] - this.routes[i-1]);

    
        //Calculations for rotation
        var angle = Math.atan((this.currentSecondPoint[0] - p1[0]) / (this.currentSecondPoint[2] - p1[2]));

        if (this.currentSecondPoint[2] - this.currentFirstPoint[2] < 0)
            angle += Math.PI;
        else if ((this.currentSecondPoint[0] - this.currentFirstPoint[0] == 0) && (this.currentSecondPoint[2] - this.currentFirstPoint[2] == 0))
            angle = this.previousAngle;
    
        this.previousAngle = angle;
    }

    apply(){
        this.scene.translate((this.currentSecondPoint[0] - this.currentFirstPoint[0]) * this.difference + this.currentFirstPoint[0], (this.currentSecondPoint[1] - this.currentFirstPoint[1]) * this.difference + this.currentFirstPoint[1], (this.currentSecondPoint[2] - this.currentFirstPoint[2]) * this.difference + this.currentFirstPoint[2]);
        this.scene.rotate(this.previousAngle, 0, 1, 0);
    }
}