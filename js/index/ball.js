function Ball (radius, color, lineWidth) {
	if (radius === undefined) { radius = 40; };
	if (color === undefined) { color = "#ff0000"; };
	if (lineWidth === undefined) { lineWidth = 0 };
	this.x = 0;
	this.y = 0;
	this.radius = radius;
	this.rotation = 0;
	this.scaleX = 1;
	this.scaleY = 1;
	this.color = utils.parseColor(color);
	this.lineWidth = lineWidth;
	this.dir = 0;
	this.dis = 0;
	this.vel = 0;
	this.vx = 0;
	this.vy = 0;
	this.dx = 0;
	this.dy = 0;
	this.mass = 0;
	this.force = 0;
};
Ball.prototype.draw = function (context) {
	context.save();
	context.translate(this.x, this.y);
	context.rotate(this.rotation);
	context.scale(this.scaleX, this.scaleY);
	context.lineWidth = this.lineWidth;
	context.fillStyle = this.color;
	context.beginPath();
	//x, y, radius, start_angle, end_angle, anti-clockwise
	context.arc(0, 0, this.radius, 0, (Math.PI * 2), true);
	context.closePath();
	context.fill();
	if (this.lineWidth > 0) { context.stroke();};
	context.restore();
};