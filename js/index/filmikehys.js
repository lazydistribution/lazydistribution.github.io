function Filmikehys(x,y,width,height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.border = 1;
	this.offsetX = 0;
	this.offsetY = 0;
}

Filmikehys.prototype.update = function (width, height, offsetX, offsetY){
	this.width = width;
	this.height = height;
	this.offsetX = offsetX;
	this.offsetY = offsetY;
}

Filmikehys.prototype.draw = function (context) {
	// top
	context.beginPath();
	context.strokeStyle="rgba(0,0,0,0.3)";
	context.lineWidth=this.offsetY;
	context.moveTo(0,1);
	context.lineTo(this.width,1);
	context.stroke();
	// bottom
	context.beginPath();
	context.lineWidth=this.offsetY;
	context.moveTo(0,this.height-1);
	context.lineTo(this.width,this.height-1);
	context.stroke();
	// left
	context.beginPath();
	context.lineWidth=this.offsetX;
	context.moveTo(1,0);
	context.lineTo(1,this.height);
	context.stroke();
	// right
	context.beginPath();
	context.lineWidth=this.offsetX;
	context.moveTo(this.width-1,0);
	context.lineTo(this.width-1,this.height);
	context.stroke();
}