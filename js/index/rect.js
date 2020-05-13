function Rect(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.rotation = 0;
	this.scaleX = 1;
	this.scaleY = 1;
	this.color = "#000000";
	this.opacity = 1;
	this.lineWidth = 0;
	this.scaleStepX = 0;
	this.maxWidthX = 0;
	this.minWidthX = 0;
	this.dirX = 0;
	this.isTweening = false;
	this.time;
	this.duration;
	this.start_x;
	this.start_y;
	this.target_x;
	this.target_y;
	this.change_x;
	this.change_y;
	this.areaWidth;
	this.areaHeight;
	this.durationSpace;
	this.name;
};
Rect.prototype.update = function(canvas){
	if(this.width > this.maxWidthX || this.width < this.minWidthX) this.dir *= -1;
	this.width += this.scaleStepX * this.dir;
};

Rect.prototype.tweenSetup = function(){
	this.duration = this.durationSpace * Math.random();
	this.time = 0;
	this.start_x = this.x;
	this.target_x = this.areaWidth * Math.random();
	this.isTweening = true;
}

Rect.prototype.tween = function(){
		this.change_x = this.target_x - this.x;
        this.x = Math.easeInOutQuad(this.time, this.start_x, this.change_x, this.duration);
        this.time += 1;
		if(this.x + this.width < 0 || this.x > this.areaWidth) {
			this.tweenSetup();
		}
        if (this.time > this.duration) {
			this.tweenSetup();
			//this.isTweening = false;
        }
	};


Rect.prototype.draw = function (context) {
	//context.save();
	//context.translate(this.x, this.y);
	//context.rotate(this.rotation);
	//console.log(this.name+", "+ this.x +", "+this.y)
	context.scale(this.scaleX, this.scaleY);
	context.lineWidth = this.lineWidth;
	if(this.color == "white"){
		context.fillStyle = "rgba("+Math.round(Math.random()* 30 + 225)+", "+
									Math.round(Math.random()* 30 + 225)+", "+
									Math.round(Math.random()* 30 + 225)+", "+
									this.opacity*5+")";	
	} else {
		context.fillStyle = "rgba("+Math.round(Math.random()*255)+", "+
									Math.round(Math.random()*255)+", "+
									Math.round(Math.random()*255)+", "+
									this.opacity+")";
	}
	context.rect(this.x, this.y, this.width, this.height);
	context.fill();
	if (this.lineWidth > 0) { context.stroke();};
	context.restore();
};