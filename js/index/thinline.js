function ThinLine(p0, p1, color, lineWidth){
	this.p0 = p0;
	this.p1 = p1;
	this.color = color ? color : "#000000";
	this.lineWidth = lineWidth ? lineWidth : 1;
}
ThinLine.prototype.draw = function(ctx){
	ctx.beginPath();
	ctx.moveTo(this.p0.x,this.p0.y);
	ctx.lineTo(this.p1.x,this.p1.y);
	ctx.lineWidth = this.lineWidth;
	ctx.strokeStyle = this.color;
	ctx.stroke();
}