var ppi;
var num_rows;
var num_cols;
var box_size;
var space_horiz;
var space_vert;
var sticker_size;
var sticker_cols;
var margin_left;
var margin_top;

function generateImages() {
  ppi = parseInt($("#ppi").val());
  num_rows = parseInt($("#rows").val());
  num_cols = parseInt($("#cols").val());
  sticker_cols = parseInt($("#sticker_cols").val());
  box_size = parseFloat($("#sticker_size").val()) * ppi;
  space_horiz = parseFloat($("#spacing_horiz").val()) * ppi;
  space_vert = parseFloat($("#spacing_vert").val()) * ppi;
  sticker_size = parseFloat($("#sticker_size").val()) * ppi;
  margin_left = parseFloat($("#margin_left").val()) * ppi;
  margin_top = parseFloat($("#margin_top").val()) * ppi;

  $("#output_num_stickers").html("Total # stickers: " + num_rows * num_cols);

  generateGrid();
  generateImage();
}

function generateImage() {

  console.log("# Cols; " + num_cols);
  console.log("Box size; " + box_size);
  console.log("Space horiz; " + space_horiz);
  console.log("Multiplied together: " + (num_cols * space_horiz));

  var actual_width = num_cols * box_size;
  var actual_height = num_rows * box_size;
  var actual_width_with_border = actual_width + space_horiz
  var actual_height_with_border = actual_height + space_vert
  var total_width_with_margins = actual_width + (space_horiz * (num_cols));
  var total_height_with_margins = actual_height + (space_vert * (num_rows));

  var output_width_with_margins = (sticker_cols * box_size) + (space_horiz * (sticker_cols)) + (margin_left * 2);
  var num_stickers = (num_rows * num_cols)
  num_output_rows = Math.floor(num_stickers / sticker_cols);
  if (num_stickers % sticker_cols > 0) {
    num_output_rows += 1;
  }
  var output_height_with_margins = (num_output_rows * box_size) + (space_vert * (num_output_rows)) + (margin_top * 2);

	console.log("Total dimensions including margins when getting result: " + actual_width_with_border + "x" + actual_height_with_border);

  image_cropper.croppie('result', {
    type: 'base64',
    size: {width: actual_width_with_border, height: actual_height_with_border},
    format: 'jpeg'
    /*format: 'jpeg'*/
  }).then(function (resp) {

	  var img = new Image();
	  img.src = resp;
		$("#temp_image").attr('width', actual_width_with_border);
		$("#temp_image").attr('height', actual_height_with_border);
		$("#image_canvas").attr('width', output_width_with_margins);
		$("#image_canvas").attr('height', output_height_with_margins);

    /* The output grid_image dimensions should match the sticker sheet sticker_cols # of columns, so the dimensions might be different */
		$("#grid_image").attr('width', output_width_with_margins);
		$("#grid_image").attr('height', output_height_with_margins);
	
	  img.onload = function(){
	    $("#temp_image").get(0).getContext("2d").drawImage(img, 0, 0);
			addNumbersToTempImage();
      scrambleImage();
	  }
  });
}

function addNumbersToTempImage() {
  var box_width_with_margin = sticker_size + space_horiz;
  var box_height_with_margin = sticker_size + space_vert;

	var context = $("#temp_image").get(0).getContext("2d");

  var font_size = sticker_size * 0.25;
  if (font_size < 7) {
    font_size = 7; //Ensure a min font size
  }
	context.font = font_size + "px Arial";

	for (var x=0; x < num_rows; x++) {
    for (var y=0; y < num_cols; y++) {
      var this_number = (x * num_cols) + y + 1;
			//context.fillText(this_number, (y * box_width_with_margin) + (box_width_with_margin/ 4), (x * box_height_with_margin) + (3 * box_height_with_margin / 4));
      bottom_left_x = y * sticker_size;
      bottom_left_y = (x+1) * sticker_size;
      //Now adjust a little bit to 'center' the number and account for the top & left margins
      bottom_left_x += sticker_size * 0.25 + (space_horiz / 2)
      bottom_left_y -= sticker_size * 0.25 - (space_vert / 2)

	    context.strokeStyle = "rgba(255,255,255,0.5)";
	    context.lineWidth = 2;
	    context.strokeText(this_number, bottom_left_x, bottom_left_y)
	    //ctx.fillStyle = 'white';
			context.fillText(this_number, bottom_left_x, bottom_left_y);


    }
	}
}
function scrambleImage() {
  var box_width_with_margin = sticker_size + space_horiz;
  var box_height_with_margin = sticker_size + space_vert;

	var locations = shuffle(Array(num_rows * num_cols).fill().map((x,i)=>i));
	console.log(locations);

	var oldcontext = $("#temp_image").get(0).getContext("2d");
	var newcontext = $("#image_canvas").get(0).getContext("2d");

	for (var x=0; x < num_rows; x++) {
    for (var y=0; y < num_cols; y++) {
			/* Extract the square at [x,y], and move it to #grid_image location specified by locations[x*numcols + y]*/
			var source_x = (y * sticker_size);
      var source_y = (x * sticker_size)
		  var imgData = oldcontext.getImageData(source_x, source_y, box_width_with_margin, box_height_with_margin);

      var newindex = locations[x * num_cols + y];
      var new_row = Math.floor(newindex / sticker_cols);
      var new_col = newindex % sticker_cols;


      var dest_x = new_col * box_width_with_margin + margin_left;
      var dest_y = new_row * box_height_with_margin + margin_top;
      console.log("Going to move from " + (x * num_cols + y + 1) + " to num " + (newindex + 1) + ". Source coords: " + source_x + "x" + source_y + " -> " + dest_x + "x" + dest_y)
		  newcontext.putImageData(imgData, dest_x, dest_y);

    }
	}

  var output_img = $("#image_canvas").get(0).toDataURL("image/png");
  document.getElementById('output_image').innerHTML = '<img src="' + output_img + '"/>';
  
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function generateGrid() {
  var grid_canvas = document.getElementById("grid_canvas");

	var context = grid_canvas.getContext("2d");

  var ppi = document.getElementById('ppi').value;
  var num_rows = document.getElementById('rows').value;
  var num_cols = document.getElementById('cols').value;

  var box_size = document.getElementById('sticker_size').value * ppi;
  var stroke_size = 3;

  grid_canvas.width = (box_size * num_cols) + stroke_size;
  grid_canvas.height = (box_size * num_rows) + stroke_size;
  
  console.log("Size: " + box_size);
  console.log("Number of Rows: " + num_rows);
  console.log("Number of Columns: " + num_cols);

  var horiz_offset = (stroke_size / 2);
  var vert_offset = (stroke_size / 2);
  /* Draw horizontal lines */
  for (var x = 0; x <= num_rows; x += 1) {
    context.moveTo(0 + vert_offset, x * box_size + vert_offset);
    context.lineTo(num_cols * box_size + vert_offset, (x * box_size) + vert_offset);
  }

  /* Draw vertical lines */
  for (var y = 0; y <= num_cols; y += 1) {
    context.moveTo(y * box_size + horiz_offset, 0 + horiz_offset);
    context.lineTo(y * box_size + horiz_offset, num_rows * box_size + horiz_offset);
  }


  context.lineWidth = stroke_size;
  context.strokeStyle = "black";
  context.stroke();

	context.font = (box_size * 0.4) + "px Arial";
  /* Draw the number */
  for (var x=0; x < num_rows; x++) {
    for (var y=0; y < num_cols; y++) {
      var this_number = (x * num_cols) + y + 1;
			context.fillText(this_number, (y * box_size) + (box_size / 4), (x * box_size) + (3 * box_size / 4));
    }
  }
  

  var grid_img = grid_canvas.toDataURL("image/png");
  document.getElementById('output_grid').innerHTML = '<img src="' + grid_img + '"/>';
}

var image_cropper;

function initCroppie(width, height) {
	console.log("Called initCroppie with dimensions " + width + "x" + height);
  var viewport_width = 300;
  var viewport_height = 300;
  if (width > height) {
    var ratio = width / height;
    viewport_height = viewport_height / ratio;
  } else {
    var ratio = height / width;
    viewport_width = viewport_width / ratio;
  }

  $("#croppie").croppie('destroy');
  console.log("Going to create new croppie instance with dimensions: " + viewport_width + "x" + viewport_height);
  image_cropper = $("#croppie").croppie({
      enableExif: true,
      viewport: {
          width: viewport_width,
          height:viewport_height
      },
      boundary: {
          width: 400,
          height:400 
      },
  });
}

  function initImageSelector() {

    $('#image').on('change', function () { 
		  ppi = parseInt($("#ppi").val());
		  num_rows = parseInt($("#rows").val());
		  num_cols = parseInt($("#cols").val());
		  sticker_cols = $("#sticker_cols").val();
		  box_size = parseFloat($("#sticker_size").val()) * ppi;
		  space_horiz = $("#spacing_horiz").val() * ppi;
		  space_vert = $("#spacing_vert").val() * ppi;

      var total_width_with_margins = (num_cols * box_size) + (space_horiz);
      var total_height_with_margins = (num_rows * box_size) + (space_vert);

      console.log("Going create image cropper with size: " + total_width_with_margins + "x" + total_height_with_margins);

      var reader = new FileReader();
        reader.onload = function (e) {
          initCroppie(total_width_with_margins, total_height_with_margins);
          $("#croppie_container").show();
          image_cropper.croppie('bind', {
            url: e.target.result
          }).then(function(){
            console.log('jQuery bind complete');
          });
        }
        reader.readAsDataURL(this.files[0]);
    });


  }

window.onload = function() {
	initImageSelector();
}

