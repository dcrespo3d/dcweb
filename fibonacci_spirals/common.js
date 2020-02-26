CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
	if (w < 2 * r) r = w / 2;
	if (h < 2 * r) r = h / 2;
	this.beginPath();
	this.moveTo(x+r, y);
	this.arcTo(x+w, y,   x+w, y+h, r);
	this.arcTo(x+w, y+h, x,   y+h, r);
	this.arcTo(x,   y+h, x,   y,   r);
	this.arcTo(x,   y,   x+w, y,   r);
	this.closePath();
	return this;
  }

  function genericTouchHandler(f) {
	return function (e) {
		if (e.touches.length == 1) {
			if (f(e.touches[0])) {
				e.preventDefault();
				return false;
			}
		}
	}
}

CanvasRenderingContext2D.prototype.fillEllipse = function (x, y, r) {
	this.beginPath();
	this.ellipse(x, y, r, r, 0, 0, Math.PI * 2);
	this.fill();
}

CanvasRenderingContext2D.prototype.strokeEllipse = function (x, y, r) {
	this.beginPath();
	this.ellipse(x, y, r, r, 0, 0, Math.PI * 2);
	this.stroke();
}

  function genericTouchHandler(f) {
	return function (e) {
		if (e.touches.length == 1) {
			if (f(e.touches[0])) {
				e.preventDefault();
				return false;
			}
		}
	}
}

CanvasRenderingContext2D.prototype.arrow = function (x0, y0, x1, y1, w, arrw, arrh) {

	var dx = x1 - x0;
	var dy = y1 - y0;

	var l = 1.0/Math.sqrt(dx*dx + dy*dy);
	dx *= l;
	dy *= l;
	
	this.beginPath();
	this.moveTo(x0 -dy * w/2, y0 +dx * w/2);
	this.lineTo(x1 -dy * w/2 - dx*arrh, y1 +dx * w/2 - dy*arrh);
	this.lineTo(x1 -dy * arrw/2 - dx*arrh, y1 +dx * arrw/2 - dy*arrh);
	this.lineTo(x1, y1);
	this.lineTo(x1 +dy * arrw/2 - dx*arrh, y1 -dx * arrw/2 - dy*arrh);
	this.lineTo(x1 +dy * w/2 - dx*arrh, y1 -dx * w/2 - dy*arrh);
	this.lineTo(x0 +dy * w/2, y0 -dx * w/2);

	this.closePath();
	return this;
  }

  function genericTouchHandler(f) {
	return function (e) {
		if (e.touches.length == 1) {
			if (f(e.touches[0])) {
				e.preventDefault();
				return false;
			}
		}
	}
}


function matrix_invert(a) {
    var a00 = a[0],
        a01 = a[1],
        a02 = a[2];
    var a10 = a[3],
        a11 = a[4],
        a12 = a[5];
    var a20 = a[6],
        a21 = a[7],
        a22 = a[8];
    var b01 = a22 * a11 - a12 * a21;
    var b11 = -a22 * a10 + a12 * a20;
    var b21 = a21 * a10 - a11 * a20;

    var det = a00 * b01 + a01 * b11 + a02 * b21;

    if (!det) {
        return null;
    }

    det = 1.0 / det;
    var out = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    out[0] = b01 * det;
    out[1] = (-a22 * a01 + a02 * a21) * det;
    out[2] = (a12 * a01 - a02 * a11) * det;
    out[3] = b11 * det;
    out[4] = (a22 * a00 - a02 * a20) * det;
    out[5] = (-a12 * a00 + a02 * a10) * det;
    out[6] = b21 * det;
    out[7] = (-a21 * a00 + a01 * a20) * det;
    out[8] = (a11 * a00 - a01 * a10) * det;
    return out;
}

function matrix_mul(a, b) {
	/* 0 1 2
	   3 4 5
	   6 7 8 */

   var res = [];
   res[0] = a[0] * b[0] + a[1] * b[3] + a[2] * b[6];
   res[1] = a[0] * b[1] + a[1] * b[4] + a[2] * b[7];
   res[2] = a[0] * b[2] + a[1] * b[5] + a[2] * b[8];

   res[3] = a[3] * b[0] + a[4] * b[3] + a[5] * b[6];
   res[4] = a[3] * b[1] + a[4] * b[4] + a[5] * b[7];
   res[5] = a[3] * b[2] + a[4] * b[5] + a[5] * b[8];

   res[6] = a[6] * b[0] + a[7] * b[3] + a[8] * b[6];
   res[7] = a[6] * b[1] + a[7] * b[4] + a[8] * b[7];
   res[8] = a[6] * b[2] + a[7] * b[5] + a[8] * b[8];

   return res;
}


function matrix_mul_vec(a, b) {
    var res = [];
    res[0] = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    res[1] = a[3] * b[0] + a[4] * b[1] + a[5] * b[2];
    res[2] = a[6] * b[0] + a[7] * b[1] + a[8] * b[2];

    return res;
}

function matrix_transpose(a) {

   var res = [a[0],a[3],a[6],
              a[1],a[4],a[7],
              a[2],a[5],a[8]];
   return res;
}



function scale_matrix (a) {
    return [a, 0, 0,  0, a, 0,  0, 0, a];
}

function rot_x_matrix (a) {
    var c = Math.cos(a);
    var s = Math.sin(a);

    return [1, 0, 0,  0, c, -s,  0,  s, c];
}

function rot_y_matrix (a) {
    var c = Math.cos(a);
    var s = Math.sin(a);

    return [c, 0, s,  0, 1, 0,  -s, 0, c];
}

function rot_z_matrix (a) {
    var c = Math.cos(a);
    var s = Math.sin(a);

    return [c, -s, 0,  s, c, 0,  0, 0, 1];
}


var ident_matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];

function vec_add(a,b) {
	var r = [];
	for (var i = 0; i < a.length; i++)
		r.push(a[i] + b[i]);
	return r;
}

function vec_sub(a,b) {
	var r = [];
	for (var i = 0; i < a.length; i++)
		r.push(a[i] - b[i]);
	return r;
}

function vec_scale(a,x) {
	var r = [];
	for (var i = 0; i < a.length; i++)
		r.push(a[i]*x);
	return r;
}


function vec_dot(a,b) {
	var r = 0
	for (var i = 0; i < a.length; i++)
		r += a[i] * b[i];
	return r;
}

function vec_cross(a,b) {
	return [a[1]*b[2] - a[2]*b[1], -a[0]*b[2]+a[2]*b[0], a[0]*b[1] - a[1]*b[0]];
}

function vec_len(a) {
	var d = 0;
	for (var i = 0; i < a.length; i++)
		d += a[i] * a[i];
	
	return Math.sqrt(d);
}

function vec_eq(a, b) {
	for (var i = 0; i < a.length; i++)
		if (a[i] != b[i])
			return false;
	
	return true;;
}

function vec_norm(a) {
	var d = 0;
	for (var i = 0; i < a.length; i++)
		d += a[i] * a[i];
	
	d = 1.0/Math.sqrt(d);
	var r = [];
	if (d < 0.0001) {
		for (var i = 0; i < a.length; i++)
			r.push(0);
		return r;
	}

	for (var i = 0; i < a.length; i++)
		r.push(a[i] * d);
	return r;
}

function vec_lerp(a,b,f) {
	var r = [];
	for (var i = 0; i < a.length; i++)
		r[i] = lerp(a[i], b[i], f);
	return r;
}


function lerp(a,b,f) {
	if (f == 0)
		return a;
	else if (f==1)
		return b;

	return a * (1-f) + b * f;
}

document.addEventListener("DOMContentLoaded", function ()
{
	if (window.bc_touch_down_state === undefined)
	{
		window.bc_touch_down_state = false;
		document.addEventListener("touchstart", function(e){
			window.bc_touch_down_state = true;
		}, false);
		document.addEventListener("touchend", function(e){
			window.bc_touch_down_state = false;
		}, false);

		document.addEventListener("touchcancel", function(e){
			window.bc_touch_down_state = false;
		}, false);
	}
	
});


window.TouchHandler = function (target, begin, move, end) {



	target.onmousedown = mouse_down;
    target.ontouchstart = genericTouchHandler(mouse_down);

	var move_handler = genericTouchHandler(mouse_move);
	
	function mouse_down(e) {
        window.addEventListener("mousemove", mouse_move, false);
        window.addEventListener("mouseup", mouse_up, false);

        window.addEventListener("touchmove", move_handler, false);
        window.addEventListener("touchend", mouse_up, false);
		window.addEventListener("touchcancel", mouse_up, false);

        return begin ? begin(e) : true;;
    }

    function mouse_move(e) {
		return move ? move (e) : true;
	}

    function mouse_up(e) {
        window.removeEventListener("mousemove", mouse_move, false);
        window.removeEventListener("mouseup", mouse_up, false);

        window.removeEventListener("touchmove", move_handler, false);
        window.removeEventListener("touchend", mouse_up, false);
		window.removeEventListener("touchcancel", mouse_up, false);
		
		return end ? end(e) : true;
    }
}


window.Dragger = function (target, callback) {

	target.onmousedown = mouse_down;
    target.ontouchstart = genericTouchHandler(mouse_down);

	var move_handler = genericTouchHandler(mouse_move);
	
	var prev_mouse_x, prev_mouse_y;

	function mouse_down(e) {

        prev_mouse_x = e.clientX;
        prev_mouse_y = e.clientY;


        window.addEventListener("mousemove", mouse_move, false);
        window.addEventListener("mouseup", mouse_up, false);

        window.addEventListener("touchmove", move_handler, false);
        window.addEventListener("touchend", mouse_up, false);
		window.addEventListener("touchcancel", mouse_up, false);
		
		if (e.preventDefault)
			e.preventDefault();

        return true;
    }

    function mouse_move(e) {
        callback (e.clientX - prev_mouse_x, e.clientY - prev_mouse_y);
    
        prev_mouse_x = e.clientX;
		prev_mouse_y = e.clientY;
		
		return true;
    }
    function mouse_up(e) {
        window.removeEventListener("mousemove", mouse_move, false);
        window.removeEventListener("mouseup", mouse_up, false);

        window.removeEventListener("touchmove", move_handler, false);
        window.removeEventListener("touchend", mouse_up, false);
        window.removeEventListener("touchcancel", mouse_up, false);
    }
}

window.SegmentedControl = function (container_div, callback, values, defopt) {
	var container = document.createElement("div");
	container.style.position = "relative";
	container.classList.add("segmented_control_container");

	container.onclick = mouse_click;
	
	container_div.appendChild(container);

	var segments = [];
	var option = (typeof(defopt) === 'undefined') ? 0 : defopt;
	var pad = 2.0;

	for (var i = 0; i < values.length; i++) {
		var el = document.createElement("div");
		el.style.top = pad + "px";
		el.classList.add("segmented_control_off");
		el.innerHTML = values[i];
		container.appendChild(el);
		segments.push(el);
	}

	segments[option].classList.remove("segmented_control_off");
	segments[option].classList.add("segmented_control_on");

	window.addEventListener("resize", layout, true);


	layout();
	callback (option);

	this.set_selection = function(o) {

		if (option != o) {

				segments[option].classList.remove("segmented_control_on");
				segments[option].classList.add("segmented_control_off");
				option = o;
	
				segments[option].classList.remove("segmented_control_off");
				segments[option].classList.add("segmented_control_on");
	
				callback (option);
		}
	}


	function layout() {
		var width = container.getBoundingClientRect().width;
		var w = Math.floor((width - (values.length + 1) * pad)/values.length);

		container.style.width = ((w + pad) * values.length + pad) + "px";

		for (var i = 0; i < values.length; i++) {
			var el = segments[i];
			el.style.left = (pad + (w + pad) * i) + "px";
			el.style.width = (w) + "px";
		}
	}

	function mouse_click(e) {

		var rect = container.getBoundingClientRect();
		var o = e.clientX - rect.left;
		o = Math.min(Math.max(0, Math.floor(o *values.length / rect.width)), values.length - 1);

		if (o != option) {

			segments[option].classList.remove("segmented_control_on");
			segments[option].classList.add("segmented_control_off");
			option = o;

			segments[option].classList.remove("segmented_control_off");
			segments[option].classList.add("segmented_control_on");

			callback (option);
		}

		if (e.preventDefault)
			e.preventDefault();
		return true;
	}

	
}

window.Slider = function (container_div, callback, style_prefix, default_value) {
	var container = document.createElement("div");
	container.style.width = "100%";
	container.style.height = "0";
	container.style.position = "relative";
	container.classList.add("slider_container");
	if (style_prefix)
		container.classList.add(style_prefix + "slider_container");

	var left_gutter = document.createElement("div");
	left_gutter.classList.add("slider_left_gutter");
	if (style_prefix)
		left_gutter.classList.add(style_prefix + "slider_left_gutter");

	var right_gutter = document.createElement("div");
	right_gutter.classList.add("slider_right_gutter");
	if (style_prefix)
		right_gutter.classList.add(style_prefix + "slider_right_gutter");

	left_gutter.onclick = mouse_click;
	right_gutter.onclick = mouse_click;

	var knob_container = document.createElement("div");
	knob_container.style.width = "0";
	knob_container.style.height = "0";
	knob_container.style.top = "0"
	knob_container.style.position = "absolute";

	var knob = document.createElement("div");
	knob.classList.add("slider_knob");
	if (style_prefix)
		knob.classList.add(style_prefix + "slider_knob");

	knob.onmousedown = mouse_down;
	knob.ontouchstart = genericTouchHandler(mouse_down);

	container_div.appendChild(container);
	container.appendChild(left_gutter);
	container.appendChild(right_gutter);
	container.appendChild(knob_container);
	knob_container.appendChild(knob);

	window.addEventListener("resize", layout, true);

	var percentage = default_value === undefined ? 0.5 : default_value;

	layout();
	callback (percentage);

	this.set_value = function(p) {
		percentage = p;
		layout();
	}

	function layout() {
		var width = container.getBoundingClientRect().width;

		left_gutter.style.width = width * percentage + "px";
		left_gutter.style.left = "0";

		right_gutter.style.width = (width * (1.0 - percentage)) + "px";
		right_gutter.style.left = width * percentage + "px";

		knob_container.style.left = (width * percentage) + "px"
	}

	var selection_offset;
	
	var move_handler = genericTouchHandler(mouse_move);

	function mouse_down(e) {

		if (window.bc_touch_down_state)
			return false;

		e == e || window.event;
		var knob_rect = knob_container.getBoundingClientRect();
		selection_offset = e.clientX - knob_rect.left - knob_rect.width / 2;

		window.addEventListener("mousemove", mouse_move, false);
        window.addEventListener("mouseup", mouse_up, false);

        window.addEventListener("touchmove", move_handler, false);
        window.addEventListener("touchend", mouse_up, false);
        window.addEventListener("touchcancel", mouse_up, false);


		if (e.preventDefault)
			e.preventDefault();
		return true;
	}

	function mouse_move(e) {
		var container_rect = container.getBoundingClientRect();
		var x = e.clientX - selection_offset - container_rect.left;

		var p = Math.max(0, Math.min(1.0, x / container_rect.width));

		if (percentage != p) {
			percentage = p;
			layout();
			callback (p);
		}

		return true;
	}

	function mouse_up(e) {
        window.removeEventListener("mousemove", mouse_move, false);
        window.removeEventListener("mouseup", mouse_up, false);

        window.removeEventListener("touchmove", move_handler, false);
        window.removeEventListener("touchend", mouse_up, false);
        window.removeEventListener("touchcancel", mouse_up, false);
	}

	function mouse_click(e) {
		var container_rect = container.getBoundingClientRect();
		var x = e.clientX - container_rect.left;

		var p = Math.max(0, Math.min(1.0, x / container_rect.width));

		if (percentage != p) {
			percentage = p;
			layout();
			callback (p);
		}

		return true;
	}
}


window.BezierSlider = function (container, knob, min, max, callback) {

	var KnobWidth = 36;

	var GutWidth = 400;
	var GutHeight = 10;

	var knobPosition = new Point(KnobWidth / 2, 0);

	var dragsKnob;
	var selectionOffset;
	//

	container.style.height = GutHeight + "px";
	container.style.width = GutWidth + "px";
	container.style.background = craftGutGradient();
	container.style.position = "relative";
	container.style.userSelect = "none";
	container.style.webkitUserSelect = "none";

	craftTicks();


	container.removeChild(knob);
	container.appendChild(knob);

	knob.style.width = KnobWidth + "px";
	knob.style.height = KnobWidth + "px";
	knob.style.background = "linear-gradient(#eee 0%, #fff 100%)";
	knob.style.border = "1px #aaa solid";
	knob.style.borderRadius = KnobWidth / 2 + "px";
	knob.style.position = "relative";
	knob.style.boxShadow = "0 2px 3px rgba(0,0,0,0.2)";
	knob.style.cursor = "ew-resize";
	knob.style.top = (GutHeight - KnobWidth) / 2 + "px";

	// handlers

	knob.onmousedown = mouse_down;
	knob.ontouchstart = genericTouchHandler(mouse_down);

	var move_handler = genericTouchHandler(mouse_move);

	update(GutWidth / 2);

	function update(position) {

		var stepSize = GutWidth / (max - min);

		var clampedPosition = Math.min(Math.max(0, position), GutWidth);
		var value = min + Math.round(clampedPosition / stepSize);

		callback(value);

		knobPosition.x = Math.round((value - min) * stepSize - 0.5);

		knob.style.left = (knobPosition.x - KnobWidth / 2) + "px";
	}

	function mousePositionForEvent(e) {
		var rect = container.getBoundingClientRect();

		return new Point(e.clientX - rect.left, e.clientY - rect.top);
	}


	function mouse_down(e) {
		var position = mousePositionForEvent(e);
		var diff = position.sub(knobPosition);

		dragsKnob = true;
		selectionOffset = diff.x;

		window.addEventListener("mousemove", mouse_move, false);
        window.addEventListener("mouseup", mouse_up, false);

        window.addEventListener("touchmove", move_handler, false);
        window.addEventListener("touchend", mouse_up, false);
        window.addEventListener("touchcancel", mouse_up, false);


		if (e.preventDefault)
			e.preventDefault();

		return true;
	}

	function mouse_move(e) {
		var position = mousePositionForEvent(e);
		var diff = position.sub(knobPosition);

		if (dragsKnob) {
			update(position.x - selectionOffset);
			return true;
		}
	}

	function mouse_up(e) {

        window.removeEventListener("mousemove", mouse_move, false);
        window.removeEventListener("mouseup", mouse_up, false);

        window.removeEventListener("touchmove", move_handler, false);
        window.removeEventListener("touchend", mouse_up, false);
        window.removeEventListener("touchcancel", mouse_up, false);

		dragsKnob = false;
	}

	function craftGutGradient() {
		var elements = [];

		var center = GutHeight / 2;
		var width = 1;

		elements.push("transparent " + (center - width) + "px");
		elements.push("#bbb " + (center - width) + "px");
		elements.push("#bbb " + (center + width) + "px");
		elements.push("transparent " + (center + width) + "px");

		return "linear-gradient( " + elements.join(", ") + ")";
	}

	function craftTicks() {
		var ticks = max - min;

		var elements = [];

		var width = 0.5;

		for (var i = 0; i <= ticks; i++) {
			var center = 0.5 + Math.round((GutWidth - 1) * i / ticks);

			var tick = document.createElement("div");
			tick.style.background = "#bbb";
			tick.style.position = "absolute";
			tick.style.width = "1px";
			tick.style.display = "inline-block";
			tick.style.height = "6px";
			tick.style.left = center + "px";
			tick.style.top = "2px";
			tick.style.cursor = "default";
			container.appendChild(tick);
		}

	}



}

window.Shader = function (gl, vert_src, frag_src, attributes_names, uniforms_names) {

    var vert = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vert, vert_src);
	gl.compileShader(vert);
	
    var frag = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(frag, frag_src);
    gl.compileShader(frag);

    var shader = gl.createProgram();
    gl.attachShader(shader, vert);
    gl.attachShader(shader, frag);
	gl.linkProgram(shader);
	
	this.shader = shader;

	this.attributes = {};
	this.uniforms = {};

	if (attributes_names) {
		for (var i = 0; i < attributes_names.length; i++)
			this.attributes[attributes_names[i]] = gl.getAttribLocation(shader, attributes_names[i]);
	}

	if (uniforms_names) {
		for (var i = 0; i < uniforms_names.length; i++)
			this.uniforms[uniforms_names[i]] = gl.getUniformLocation(shader, uniforms_names[i]);
	}
}


function ArcBall(matrix) {
	this.x_offset = 0;
	this.y_offset = 0;
	this.matrix = matrix ? matrix.slice() : [1, 0, 0, 0, 1, 0, 0, 0, 1];
}

ArcBall.prototype.set_viewport_size = function(width, height) {
	this.width = width;
	this.height = height;
}

ArcBall.prototype.set_viewport = function(x, y, width, height) {
	this.x_offset = x;
	this.y_offset = y;
	this.width = width;
	this.height = height;
}

ArcBall.prototype.start = function (x, y) {
	this.last_x = x;
    this.last_y = y;
}

ArcBall.prototype.vec = function (x, y) {

	var size = Math.min(this.width, this.height) * 0.5;
	var p = [(x - this.x_offset - this.width/2) / size,
			 (y - this.y_offset - this.height/2) / size, 0];
	p[0] = -p[0];
	p[1] = -p[1];

	var d = p[0] * p[0] + p[1] * p[1];
	if (d <= 1) {
		p[2] = Math.sqrt(1 - d);
	}
	else {
		var s = 1.0 / Math.sqrt(d);
		p[0] *= s;
		p[1] *= s;
	}
		
	return p;
}

ArcBall.prototype.update = function(x, y) {


function matrix_mul(a, b) {
	/* 0 1 2
	   3 4 5
	   6 7 8 */

   var res = [];
   res[0] = a[0] * b[0] + a[1] * b[3] + a[2] * b[6];
   res[1] = a[0] * b[1] + a[1] * b[4] + a[2] * b[7];
   res[2] = a[0] * b[2] + a[1] * b[5] + a[2] * b[8];

   res[3] = a[3] * b[0] + a[4] * b[3] + a[5] * b[6];
   res[4] = a[3] * b[1] + a[4] * b[4] + a[5] * b[7];
   res[5] = a[3] * b[2] + a[4] * b[5] + a[5] * b[8];

   res[6] = a[6] * b[0] + a[7] * b[3] + a[8] * b[6];
   res[7] = a[6] * b[1] + a[7] * b[4] + a[8] * b[7];
   res[8] = a[6] * b[2] + a[7] * b[5] + a[8] * b[8];

   return res;
}

function matrix_rot (a, angle) {
	var c = Math.cos(angle);
	var s = Math.sin(angle);

	
	return [c + a[0] * a[0]*(1 - c), a[0]*a[1]*(1 - c) - a[2]*s, a[0]*a[2]*(1-c)+a[1]*s,
				 a[1]*a[0]*(1 - c) + a[2]*s, c + a[1] * a[1]*(1 - c),  a[1]*a[2]*(1-c)-a[0]*s,
				 a[2]*a[0]*(1 - c) - a[1]*s, a[2]*a[1]*(1-c)+a[0]*s, c + a[2] * a[2]*(1 - c)];
}
	

if (x == this.last_x && y == this.last_y)
	return;

	var va = this.vec(this.last_x, this.last_y);
    var vb = this.vec(x,  y);
	var angle = Math.acos(Math.min(1.0, va[0]*vb[0] + va[1]*vb[1] + va[2]*vb[2]));
	
	var a = [va[1]*vb[2] - va[2]*vb[1], va[2]*vb[0] - va[0]*vb[2], va[0]*vb[1] - va[1]*vb[0]];

	var al = a[0] * a[0] + a[1]*a[1] + a[2]*a[2];
	if (al <= 0)
		return;

		al = 1/Math.sqrt(al);
	
	a[0] *= al;
	a[1] *= al;
	a[2] *= al;

	
	var matrix = matrix_rot(a, angle);
	
	this.matrix = matrix_mul(matrix, this.matrix);
	
    this.last_x = x;
    this.last_y = y;
}

function compile_shader(gl, source, type) {
	var shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
   
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	  throw "could not compile shader:" + gl.getShaderInfoLog(shader);
	}
   
	return shader;
  }
  
  function create_program(gl, vertex, fragment) {
	var program = gl.createProgram();
	gl.attachShader(program, vertex);
	gl.attachShader(program, fragment);
	gl.linkProgram(program);
   
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		throw ("program filed to link:" + gl.getProgramInfoLog (program));
	}
   
	return program;
  };
  