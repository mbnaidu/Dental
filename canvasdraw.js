// by Chtiwi Malek ===> CODICODE.COM

var mousePressed = false;
var lastX, lastY;
var ctx;
var xcoordinates = [];
var ycoordinates = [];
var k;
var xvalue;
var yvalue;
var xarray = [];
var yarray = [];
var setacoord = 4500;
var setbcoord = 3600;
var AreaOfTheFigure = 0
var HeightOfTheFigure = 0
var WidthOfTheFigure = 0
var filepath;

$(function () {
  // Vars
  var pointsA = [],
    pointsB = [],
    $canvas = null,
    canvas = null,
    context = null,
    vars = null,
    points = 8,
    viscosity = 20,
    mouseDist = 70,
    damping = 0.05,
    showIndicators = false
  ;(mouseX = 0),
    (mouseY = 0),
    (relMouseX = 0),
    (relMouseY = 0),
    (mouseLastX = 0),
    (mouseLastY = 0),
    (mouseDirectionX = 0),
    (mouseDirectionY = 0),
    (mouseSpeedX = 0),
    (mouseSpeedY = 0)

  /**
   * Get mouse direction
   */
  function mouseDirection(e) {
    if (mouseX < e.pageX) mouseDirectionX = 1
    else if (mouseX > e.pageX) mouseDirectionX = -1
    else mouseDirectionX = 0

    if (mouseY < e.pageY) mouseDirectionY = 1
    else if (mouseY > e.pageY) mouseDirectionY = -1
    else mouseDirectionY = 0

    mouseX = e.pageX
    mouseY = e.pageY

    relMouseX = mouseX - $canvas.offset().left
    relMouseY = mouseY - $canvas.offset().top
  }
  $(document).on('mousemove', mouseDirection)

  /**
   * Get mouse speed
   */
  function mouseSpeed() {
    mouseSpeedX = mouseX - mouseLastX
    mouseSpeedY = mouseY - mouseLastY

    mouseLastX = mouseX
    mouseLastY = mouseY

    setTimeout(mouseSpeed, 50)
  }
  mouseSpeed()

  /**
   * Init button
   */
  function initButton() {
    // Get button
    var button = $('.btn-liquid')
    var buttonWidth = button.width()
    var buttonHeight = button.height()

    // Create canvas
    $canvas = $('<canvas></canvas>')
    button.append($canvas)

    canvas = $canvas.get(0)
    canvas.width = buttonWidth + 100
    canvas.height = buttonHeight + 100
    context = canvas.getContext('2d')

    // Add points

    var x = buttonHeight / 2
    for (var j = 1; j < points; j++) {
      addPoints(x + ((buttonWidth - buttonHeight) / points) * j, 0)
    }
    addPoints(buttonWidth - buttonHeight / 5, 0)
    addPoints(buttonWidth + buttonHeight / 10, buttonHeight / 2)
    addPoints(buttonWidth - buttonHeight / 5, buttonHeight)
    for (var j = points - 1; j > 0; j--) {
      addPoints(x + ((buttonWidth - buttonHeight) / points) * j, buttonHeight)
    }
    addPoints(buttonHeight / 5, buttonHeight)

    addPoints(-buttonHeight / 10, buttonHeight / 2)
    addPoints(buttonHeight / 5, 0)
    // addPoints(x, 0);
    // addPoints(0, buttonHeight/2);

    // addPoints(0, buttonHeight/2);
    // addPoints(buttonHeight/4, 0);

    // Start render
    renderCanvas()
  }

  /**
   * Add points
   */
  function addPoints(x, y) {
    pointsA.push(new Point(x, y, 1))
    pointsB.push(new Point(x, y, 2))
  }

  /**
   * Point
   */
  function Point(x, y, level) {
    this.x = this.ix = 50 + x
    this.y = this.iy = 50 + y
    this.vx = 0
    this.vy = 0
    this.cx1 = 0
    this.cy1 = 0
    this.cx2 = 0
    this.cy2 = 0
    this.level = level
  }

  Point.prototype.move = function () {
    this.vx += (this.ix - this.x) / (viscosity * this.level)
    this.vy += (this.iy - this.y) / (viscosity * this.level)

    var dx = this.ix - relMouseX,
      dy = this.iy - relMouseY
    var relDist = 1 - Math.sqrt(dx * dx + dy * dy) / mouseDist

    // Move x
    if (
      (mouseDirectionX > 0 && relMouseX > this.x) ||
      (mouseDirectionX < 0 && relMouseX < this.x)
    ) {
      if (relDist > 0 && relDist < 1) {
        this.vx = (mouseSpeedX / 4) * relDist
      }
    }
    this.vx *= 1 - damping
    this.x += this.vx

    // Move y
    if (
      (mouseDirectionY > 0 && relMouseY > this.y) ||
      (mouseDirectionY < 0 && relMouseY < this.y)
    ) {
      if (relDist > 0 && relDist < 1) {
        this.vy = (mouseSpeedY / 4) * relDist
      }
    }
    this.vy *= 1 - damping
    this.y += this.vy
  }

  /**
   * Render canvas
   */
  function renderCanvas() {
    // rAF
    rafID = requestAnimationFrame(renderCanvas)

    // Clear scene
    context.clearRect(0, 0, $canvas.width(), $canvas.height())
    context.fillStyle = '#fff'
    context.fillRect(0, 0, $canvas.width(), $canvas.height())

    // Move points
    for (var i = 0; i <= pointsA.length - 1; i++) {
      pointsA[i].move()
      pointsB[i].move()
    }

    // Create dynamic gradient
    var gradientX = Math.min(
      Math.max(mouseX - $canvas.offset().left, 0),
      $canvas.width()
    )
    var gradientY = Math.min(
      Math.max(mouseY - $canvas.offset().top, 0),
      $canvas.height()
    )
    var distance =
      Math.sqrt(
        Math.pow(gradientX - $canvas.width() / 2, 2) +
          Math.pow(gradientY - $canvas.height() / 2, 2)
      ) /
      Math.sqrt(
        Math.pow($canvas.width() / 2, 2) + Math.pow($canvas.height() / 2, 2)
      )

    var gradient = context.createRadialGradient(
      gradientX,
      gradientY,
      300 + 300 * distance,
      gradientX,
      gradientY,
      0
    )
    gradient.addColorStop(0, '#102ce5')
    gradient.addColorStop(1, '#E406D6')

    // Draw shapes
    var groups = [pointsA, pointsB]

    for (var j = 0; j <= 1; j++) {
      var points = groups[j]

      if (j == 0) {
        // Background style
        context.fillStyle = '#1CE2D8'
      } else {
        // Foreground style
        context.fillStyle = gradient
      }

      context.beginPath()
      context.moveTo(points[0].x, points[0].y)

      for (var i = 0; i < points.length; i++) {
        var p = points[i]
        var nextP = points[i + 1]
        var val = 30 * 0.552284749831

        if (nextP != undefined) {
          // if (nextP.ix > p.ix && nextP.iy < p.iy) {
          // 	p.cx1 = p.x;
          // 	p.cy1 = p.y-val;
          // 	p.cx2 = nextP.x-val;
          // 	p.cy2 = nextP.y;
          // } else if (nextP.ix > p.ix && nextP.iy > p.iy) {
          // 	p.cx1 = p.x+val;
          // 	p.cy1 = p.y;
          // 	p.cx2 = nextP.x;
          // 	p.cy2 = nextP.y-val;
          // }  else if (nextP.ix < p.ix && nextP.iy > p.iy) {
          // 	p.cx1 = p.x;
          // 	p.cy1 = p.y+val;
          // 	p.cx2 = nextP.x+val;
          // 	p.cy2 = nextP.y;
          // } else if (nextP.ix < p.ix && nextP.iy < p.iy) {
          // 	p.cx1 = p.x-val;
          // 	p.cy1 = p.y;
          // 	p.cx2 = nextP.x;
          // 	p.cy2 = nextP.y+val;
          // } else {

          p.cx1 = (p.x + nextP.x) / 2
          p.cy1 = (p.y + nextP.y) / 2
          p.cx2 = (p.x + nextP.x) / 2
          p.cy2 = (p.y + nextP.y) / 2

          context.bezierCurveTo(p.x, p.y, p.cx1, p.cy1, p.cx1, p.cy1)
          // 	continue;
          // }

          // context.bezierCurveTo(p.cx1, p.cy1, p.cx2, p.cy2, nextP.x, nextP.y);
        } else {
          nextP = points[0]
          p.cx1 = (p.x + nextP.x) / 2
          p.cy1 = (p.y + nextP.y) / 2

          context.bezierCurveTo(p.x, p.y, p.cx1, p.cy1, p.cx1, p.cy1)
        }
      }

      // context.closePath();
      context.fill()
    }

    if (showIndicators) {
      // Draw points
      context.fillStyle = '#000'
      context.beginPath()
      for (var i = 0; i < pointsA.length; i++) {
        var p = pointsA[i]

        context.rect(p.x - 1, p.y - 1, 2, 2)
      }
      context.fill()

      // Draw controls
      context.fillStyle = '#f00'
      context.beginPath()
      for (var i = 0; i < pointsA.length; i++) {
        var p = pointsA[i]

        context.rect(p.cx1 - 1, p.cy1 - 1, 2, 2)
        context.rect(p.cx2 - 1, p.cy2 - 1, 2, 2)
      }
      context.fill()
    }
  }

  // Init
  initButton()
})
function readURL(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('#myimage')
                        .attr('src', e.target.result);
                };

                reader.readAsDataURL(input.files[0]);
            }
        }
function InitThis() {
    ctx = document.getElementById('myCanvas').getContext("2d");
    $('#myCanvas').mousedown(function (e) {
        mousePressed = true;
        Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
    });
    $('#myCanvas').mousemove(function (e) {
        if (mousePressed) {
            Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
        }
    });
    $('#myCanvas').mouseup(function (e) {
        if (mousePressed) {
            mousePressed = false;
            cPush();
        }
    });
    $('#myCanvas').mouseleave(function (e) {
        if (mousePressed) {
            mousePressed = false;
            cPush();
        }
    });
    drawImage();
}
function moveleft() {
    xvalue = xvalue - 1;
    drawImage(xvalue, yvalue);
}
function movetop() {
    yvalue = yvalue - 1;
    drawImage(xvalue, yvalue);
}
function moveright() {
    xvalue = xvalue + 1;
    drawImage(xvalue, yvalue);
}
function movedown() {
    yvalue = yvalue + 1;
    drawImage(xvalue, yvalue);
}
function rer(x, y,f){
    xvalue = x
    yvalue = y
    filepath = f
    console.log(f)
    drawImage()
}
function setcoord(x, y){
    setacoord = x;
    setbcoord = y;
}
function drawImage() {
    var image = new Image();
    image.src = filepath;
    $(image).load(function () {
        // left or right
        // up or down
        ctx.drawImage(image, xvalue, yvalue, setacoord, setbcoord);
        cPush();
    });    
}
function moveleft(){
    xvalue = Math.round(xvalue) - 1
    drawImage(xvalue, yvalue)
}
function movetop(){
    yvalue = Math.round(yvalue) - 1
    drawImage(xvalue, yvalue)
}
function moveright(){
    xvalue = Math.round(xvalue) + 1
    drawImage(xvalue, yvalue)
}
function movedown(){
    yvalue = Math.round(yvalue) + 1
    drawImage(xvalue, yvalue)
}
function Draw(x, y, isDown) {
    if (isDown) {
        ctx.beginPath();
        ctx.strokeStyle = $('#selColor').val();
        ctx.lineWidth = $('#selWidth').val();
        ctx.lineJoin = "round";
        ctx.moveTo(lastX, lastY);
        xcoordinates.push(Math.round(x));
        ycoordinates.push(Math.round(y));
        ctx.lineTo(x, y);        
        // console.log("X = ",Math.round(x),"Y = ",Math.round(y))
        ctx.closePath();
        ctx.stroke();
    }
    lastX = x;
    lastY = y;
}

var cPushArray = new Array();
var cStep = -1;

function cPush() {
    cStep++;
    if (cStep < cPushArray.length) { cPushArray.length = cStep; }
    cPushArray.push(document.getElementById('myCanvas').toDataURL());
    document.title = cStep + ":" + cPushArray.length;
}
function cUndo() {
    if (cStep > 0) {
        cStep--;
        var canvasPic = new Image();
        canvasPic.src = cPushArray[cStep];
        canvasPic.onload = function () { ctx.drawImage(canvasPic, 0, 0); }
        document.title = cStep + ":" + cPushArray.length;
    }
}
function haha(){
    ctx.beginPath();
    ctx.fillStyle = "#00ff00";
    for(var i=0;i<xarray.length;i++){
        AreaOfTheFigure = AreaOfTheFigure + 1
        ctx.arc(xarray[i], yarray[i], 1, 0, 2 * Math.PI, true);
    }
    ctx.fill();
}
function cCheck() {
    var madhu = xcoordinates[0];
    var mbn  = ycoordinates[0];
    var area = 0;
    xarray.push(madhu);
    yarray.push(mbn);
    for(var i=1;i<xcoordinates.length;i++){
        if (madhu - xcoordinates[i] <=5 && madhu - xcoordinates[i] >= -5 ){ 
            if(mbn - ycoordinates[i] <= 5 && mbn - ycoordinates[i] >= -5){
                xarray.push(xcoordinates[i]);
                yarray.push(ycoordinates[i]);
                madhu = xcoordinates[i];
                mbn = ycoordinates[i];
            }
        }
    }
    if(xcoordinates[0] - xarray[xarray.length - 1] <= 3 && xcoordinates[0] - xarray[xarray.length - 1] >= -3){
        if(ycoordinates[0] - yarray[yarray.length - 1] <= 3 && ycoordinates[0] - yarray[yarray.length - 1] >= -3){
                haha();
            for(var i=0;i<xarray.length-1;i++){
                area = area + (xarray[i]*yarray[i + 1] - yarray[i]*xarray[i + 1])
            }
        }
    }
    // Left
    for(var i=Math.min(...ycoordinates);i<Math.max(...ycoordinates);i++){
        ctx.beginPath();
        HeightOfTheFigure = HeightOfTheFigure + 1
        ctx.fillStyle = "#FF0000";
        ctx.arc(Math.min(...xcoordinates), i, 1, 0, 2 * Math.PI, true);
        ctx.fill();
    }
    // Top
    for(var i=Math.min(...xcoordinates);i<Math.max(...xcoordinates);i++){
        ctx.beginPath();
        WidthOfTheFigure = WidthOfTheFigure + 1
        ctx.fillStyle = "#FF0000";
        ctx.arc(i, Math.min(...ycoordinates), 1, 0, 2 * Math.PI, true);
        ctx.fill();
    }
    // Right
    for(var i=Math.min(...ycoordinates);i<Math.max(...ycoordinates);i++){
        ctx.beginPath();
        ctx.fillStyle = "#FF0000";
        ctx.arc(Math.max(...xcoordinates), i, 1, 0, 2 * Math.PI, true);
        ctx.fill();
    }
    // Bottom
    for(var i=Math.min(...xcoordinates);i<Math.max(...xcoordinates);i++){
        ctx.beginPath();
        ctx.fillStyle = "#FF0000";
        ctx.arc(i, Math.max(...ycoordinates), 1, 0, 2 * Math.PI, true);
        ctx.fill();
    }
}
function getvalues(){
    startxfunction(xcoordinates[0]);
    startyfunction(ycoordinates[0]);
    endxfunction(xcoordinates[xcoordinates.length - 1]);
    endyfunction(ycoordinates[ycoordinates.length - 1]);
    heightfunction(HeightOfTheFigure);
    widthfunction(WidthOfTheFigure);
    areafunction(AreaOfTheFigure * parseFloat(0.2645833333));
}
function generate(){
    var pdfname = document.getElementById("pdfname").value
    var NameOfTheDoctor = document.getElementById("NameOfTheDoctor").value;
    var Demography = document.getElementById("Demography").value;
    var OPDNumber = document.getElementById("OPDNumber").value;
    var ToothNumber = document.getElementById("ToothNumber").value;
    var ProcedureDetails = document.getElementById("ProcedureDetails").value;
    var RecallTime = document.getElementById("RecallTime").value;
    var doc = new jsPDF("p", "mm", [300, 400]);
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    if(dd<10) 
    {
        dd='0'+dd;
    } 
    if(mm<10) 
    {
        mm='0'+mm;
    } 
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    today = dd+'-'+mm+'-'+yyyy;
    if(xcoordinates[0]>0 && ycoordinates[0]>0 && xcoordinates[xcoordinates.length - 1]>0 && ycoordinates[ycoordinates.length - 1]>0 && pdfname!=""){
        h = "Height = " + String(HeightOfTheFigure)+"mm";
        w = "Width = " + String(WidthOfTheFigure)+"mm";
        a = "Area = " + String(AreaOfTheFigure * parseFloat(0.2645833333))+"mm";
        nameofthedoctor = "Name Of The Doctor : " + String(NameOfTheDoctor);
        demography = "Demography Of The Patient : " + String(Demography);
        opdnumber = "OPD Number : " + String(OPDNumber);
        toothnumber = "Tooth Number : "+ String(ToothNumber);
        proceduredetails = "Procedure Details : " + String(ProcedureDetails);
        recalltime = "Recall Time : " + String(RecallTime);
        Time = "Time : " + String(time);
        date = "Date : " + String(today);
        doc.text(date, 5, 10);
        doc.text(Time, 5,20);
        doc.text(h, 5, 330);
        doc.text(w, 5, 340);
        doc.text(a, 5, 350);
        doc.text('1 px = 0.2645833333mm', 5, 370);
        doc.text(nameofthedoctor, 75, 330)
        doc.text(demography, 75, 340)
        doc.text(opdnumber, 75, 350)
        doc.text(toothnumber, 195, 330)
        doc.text(proceduredetails, 195, 340)
        doc.text(recalltime, 195, 350)
        for(var i=0;i<xcoordinates.length;i++){
            doc.setTextColor(255, 0, 0);
            doc.text(".", xcoordinates[i], ycoordinates[i]);
        }
        doc.text(String(HeightOfTheFigure)+"mm", Math.min(...xcoordinates)-25, Math.min(...ycoordinates)+HeightOfTheFigure/2);
        doc.text(String(WidthOfTheFigure)+"mm", Math.min(...xcoordinates)+WidthOfTheFigure/2, Math.max(...ycoordinates) + 10);
        for(var i=Math.min(...xcoordinates);i<Math.max(...xcoordinates);i++){
            doc.setTextColor(0, 255, 0)
            doc.text(".",i, Math.max(...ycoordinates)+5);
        }
        doc.text("^", Math.min(...xcoordinates)-5.4, Math.min(...ycoordinates)+3);
        doc.text("v", Math.min(...xcoordinates)-5.5, Math.max(...ycoordinates)-1);
        doc.text("<", Math.min(...xcoordinates)-1, Math.max(...ycoordinates) + 6.6);
        doc.text(">", Math.max(...xcoordinates)-3, Math.max(...ycoordinates) + 6.6);
        for(var i=Math.min(...ycoordinates);i<Math.max(...ycoordinates);i++){
            doc.text(".",Math.min(...xcoordinates)-5, i);
        }
        var s = pdfname + ".pdf"
        doc.save(s);
    }
}
function cleararea(){
    xcoordinates= [];
    ycoordinates = [];
    xarray = [];
    yarray = [];
    AreaOfTheFigure = 0;
    HeightOfTheFigure = 0;
    WidthOfTheFigure = 0;
    drawImage(0,0);
    getvalues();
}
function cRedo() {
    if (cStep < cPushArray.length-1) {
        cStep++;
        var canvasPic = new Image();
        canvasPic.src = cPushArray[cStep];
        canvasPic.onload = function () { ctx.drawImage(canvasPic, 0, 0); }
        document.title = cStep + ":" + cPushArray.length;
    }
}