window.onload = function()
{ 
//console.log("Ki holo re")
var canvas = $("#canvas"),
context = canvas.get(0).getContext("2d"),
$result = $('#result');
let dwn = document.querySelector('.download');
let dwnfilter = document.querySelector('.downloadfilter');
//console.log("Jhamela");
$('#fileInput').on('change', function () {
  if (this.files && this.files[0]) {
    if (this.files[0].type.match(/^image\//)) {
      var reader = new FileReader();
      reader.onload = function (evt) {
        var img = new Image();
		let x=0;
        img.onload = function () {
          context.canvas.height = img.height;
          context.canvas.width = img.width;
          context.drawImage(img, 0, 0);
          var cropper = canvas.cropper({
            aspectRatio: 16 / 9 });

          $('#btnCrop').click(function () {
            // Get a string base 64 data url
            var croppedImage = canvas.cropper('getCroppedCanvas')
			var imageDataURL= croppedImage.toDataURL("image/png");
            //$result.append($('<img>').attr('src', croppedImageDataURL));
			
			$result.append($('<img>').attr('id', "image-preview"));
			var newImage=document.getElementById('image-preview');
			newImage.setAttribute('src',imageDataURL);
			console.log(newImage);
			 
			//filter
			 newImage.onload = function(){
				  let mat = cv.imread(croppedImage);
				  document.getElementById("crop-area").style.display = "none";
				  let dst = new cv.Mat();
				  cv.cvtColor(mat, mat, cv.COLOR_RGBA2GRAY, 0);
				  console.log(dst);
				  //cv.adaptiveThreshold(mat, dst, 200, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 31, 15);
				  cv.adaptiveThreshold(mat, mat, 255, cv.ADAPTIVE_THRESH_MEAN_C, cv.THRESH_BINARY, 21, 9);
				  cv.threshold(mat,dst,0,255,cv.THRESH_BINARY + cv.THRESH_OTSU);
				  cv.imshow('filteredOutput', dst);
				  mat.delete();  
			 }			
            //download without filter
			
            dwn.download = 'imagename.png';
            dwn.setAttribute('href',imageDataURL);
          });
		  
		  $('#btnDownloadFilter').click(function(){
			  
			var canvasfilter = document.getElementById('filteredOutput').toDataURL("image/png");					
			console.log(canvasfilter);
			dwnfilter.download = 'imagename.png';
			
            dwnfilter.setAttribute('href',canvasfilter);
		  });
          $('#btnRestore').click(function () {
            canvas.cropper('reset');
            $result.empty();
          });
          $('#btnRotate').click(function(){
			  x=(x+90)%360;
		      canvas.cropper('rotateTo',x);
			  console.log(x);
		      //console.log(croppedImageDataURL);
		      //$result.append( $('<img>').attr('src', croppedImageDataURL) );
		     });
		     
		     
        };
        img.src = evt.target.result;
        

      };
      reader.readAsDataURL(this.files[0]);
    } else
    {
      alert("Invalid file type! Please select an image file.");
    }
  } else
  {
    alert('No file(s) selected.');
  }
  window.addEventListener('load', startup, false);

});
}