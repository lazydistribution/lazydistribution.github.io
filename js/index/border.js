function Border(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.name;
	this.distance;
	this.offsetX = 0;
	this.offsetY = 0;
	this.maxOffset = 0;
};
Border.prototype.updateDimensions = function(canvas){
	switch(this.direction) {
		case "left" :
			this.height = canvas.height;
			this.x = canvas.width - this.width;
			break;
		case "right" :
			this.height = canvas.height;
			break;
		case "top" :
			this.width = canvas.width;
			this.y = canvas.height - this.height;
			break;
		case "down" :
			this.width = canvas.width;
			break;
		default :
			break;
	};
};


Border.prototype.draw = function (context) {
	var my_gradient;
	var dots = {};
	switch(this.direction) {
		case "left" :
			my_gradient = context.createLinearGradient(this.x+this.width, 0, this.x, 0);
			dots = {ax:this.x, ay:50,
					bx:this.x + this.width, by:0,
					cx:this.x + this.width, cy:this.height,
					dx:this.x, dy:this.height - 50};
			break;
		case "right" :
			my_gradient = context.createLinearGradient(0, 0, this.distance, 0);
			dots = {ax:this.x, ay:0,
					bx:this.x + this.width, by:50,
					cx:this.x + this.width, cy:this.height-50,
					dx:this.x, dy:this.height};
			break;
		case "top" :
			my_gradient = context.createLinearGradient(0, this.y+this.height, 0, this.y);
			dots = {ax:0, ay:this.y + this.height,
					bx:50, by:this.y,
					cx:this.width - 50, cy:this.y,
					dx:this.width, dy:this.y + this.height};
			break;
		case "down" :
		default :
			my_gradient = context.createLinearGradient(0, 0, 0, this.distance);
			dots = {ax:0, ay:this.y,
					bx:this.width, by:this.y,
					cx:this.width - 50, cy:this.y + this.height,
					dx:50, dy:this.y + this.height};
			break;
	};
	my_gradient.addColorStop(0, "rgba(0,0,0,0.2)");
	my_gradient.addColorStop(1, "rgba(0,0,0,0)");
	context.fillStyle = my_gradient;
	context.beginPath();
	context.moveTo(dots.ax,dots.ay);
	context.lineTo(dots.bx,dots.by);
	context.lineTo(dots.cx,dots.cy);
	context.lineTo(dots.dx,dots.dy);
	context.closePath();
	context.fill();
};