function RadialBorder(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.name;
	this.type;
	
	this.innerRadius = 0;
	this.isInnerTweening = false;
	this.innerTime = 0;
	this.innerStart_r;
	this.innerTarget_r;
	this.innerChange_r;
	this.innerDuration;
	this.innerDurationSpace;
	this.innerRadiusSpace;
	this.innerMax;
	
	this.outerRadius = 0;
	this.isOuterTweening = false;
	this.outerTime = 0;
	this.outerStart_r;
	this.outerTarget_r;
	this.outerChange_r;
	this.outerDuration;
	this.outerDurationSpace;
	this.outerRadiusSpace;
	this.outerMin;
};
RadialBorder.prototype.updateDimensions = function(canvas){
	this.width = canvas.width;
	this.height = canvas.height;
};

RadialBorder.prototype.tween = function(){
	this.type == "inner" ? this.innerTween(): (this.type == "outer" ? this.outerTween() : null);
}

RadialBorder.prototype.innerTween = function(){
	this.innerChange_r = this.innerTarget_r - this.innerRadius;
	this.innerRadius = Math.easeInOutQuad(this.innerTime, this.innerStart_r, this.innerChange_r, this.innerDuration);
	this.innerTime += 1;
	if (this.innerTime > this.innerDuration) {
		this.innerTweenSetup();
		//this.isTweening = false;
    }
}

RadialBorder.prototype.innerTweenSetup = function(){
	this.innerDuration = this.innerDurationSpace * Math.random();
	this.innerTime = 0;
	this.innerStart_r = this.innerRadius;
	this.innerTarget_r = this.innerMax - this.innerRadiusSpace * Math.random();
	this.isInnerTweening = true;
	//console.log("inner setup: " + this.innerMax + ", " + this.innerRadiusSpace);
}

RadialBorder.prototype.outerTween = function(){
	this.outerChange_r = this.outerTarget_r - this.outerRadius;
	this.outerRadius = Math.easeInOutQuad(this.outerTime, this.outerStart_r, this.outerChange_r, this.outerDuration);
	this.outerTime += 1;
	if (this.outerTime > this.outerDuration) {
		this.outerTweenSetup();
		//this.isTweening = false;
    }
}

RadialBorder.prototype.outerTweenSetup = function(){
	this.outerDuration = this.outerDurationSpace * Math.random();
	this.outerTime = 0;
	this.outerStart_r = this.outerRadius;
	this.outerTarget_r = this.outerMin + this.outerRadiusSpace * Math.random();
	this.isOuterTweening = true;
	//console.log("outer setup: " + this.outerMin + ", " + this.outerRadiusSpace);
}


RadialBorder.prototype.draw = function (context) {
	var my_gradient;
	// create radial gradient
	var origoX = this.width * 0.5;
	var origoY = this.height * 0.5;
    var grd = context.createRadialGradient(origoX, origoY, this.innerRadius, origoX, origoY, this.outerRadius);
    // light blue
    grd.addColorStop(0, "rgba(0,0,0,0)");
    // dark blue
    grd.addColorStop(1, "#000000");

    context.fillStyle = grd;
    context.fillRect(this.x, this.y, this.width, this.height);
	/*
	my_gradient.addColorStop(0, "black");
	my_gradient.addColorStop(1, "rgba(0,0,0,0)");
	context.fillStyle = my_gradient;
	context.fillRect(this.x, this.y, this.width, this.height);
	*/
};