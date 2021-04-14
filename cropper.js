(function() {

  var width = 320;    
  var height = 0; 

  var streaming = false;
  var video = null;
  var canvas = null;
  var photo = null;
  var startbutton = null;

  function startup() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    //photo = document.getElementById('photo');
    startbutton = document.getElementById('startbutton');

    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(function(stream) {
      video.srcObject = stream;
      video.play();
    })
    .catch(function(err) {
      console.log("An error occurred: " + err);
    });

    video.addEventListener('canplay', function(ev){
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth/width);      
        if (isNaN(height)) {
          height = width / (4/3);
        }
        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
      }
    }, false);

    startbutton.addEventListener('click', function(ev){
      takepicture();
      ev.preventDefault();
    }, false);
    
    clearphoto();
  }

  function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    console.log(data);
    //photo.setAttribute('src', data);

  }

  function takepicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
    
      var data = canvas.toDataURL('image/png');
      //console.log(data);
      //photo.setAttribute('src', data);
      cropping(data);
      
    } else {
      clearphoto();
    }
  }
    
  

function cropping(data){
  //console.log(data);
  var canvas  = $("#canvas"),
  context = canvas.get(0).getContext("2d"),
  $result = $('#result');
  let dwn = document.querySelector('.download');
  let dwnfilter = document.querySelector('.downloadfilter');
  //console.log(dwn);
   //console.log("On change");
   var img = new Image();
   img.src=data;
   img.id="photo";
   var newImage= new Image();
   var photo=document.getElementById("photo");
   //console.log(photo);
   img.onload = function() {
     context.canvas.height = img.height;
     context.canvas.width  = img.width;
     context.drawImage(img, 0, 0);
     var cropper = canvas.cropper({
       aspectRatio: 16 / 9
     });
     $('#btnCrop').click(function() {
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
				  document.getElementById("crop-area").style.display = none;
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
     $('#btnRestore').click(function() {
       canvas.cropper('reset');
       $result.empty();
     });
     $('#btnRotate').click(function(){
      canvas.cropper('rotateTo',90);
      //console.log(croppedImageDataURL);
      $result.append( $('<img>').attr('src', croppedImageDataURL) );
     });
     $('#btnRotate2').click(function(){
      canvas.cropper('rotateTo',-90);
      //$result.append( $('<img>').attr('src', croppedImageDataURL) );
     });
     
      
    }; 
     
     };
   //img.src = evt.target.result;

  
  window.addEventListener('load', startup, false);
})();
/*
// vars
let result = document.querySelector('.result'),
img_result = document.querySelector('.img-result'),
img_w = document.querySelector('.img-w'),
img_h = document.querySelector('.img-h'),
options = document.querySelector('.options'),
save = document.querySelector('.save'),
cropped = document.querySelector('.cropped'),

upload = document.querySelector('#file-input'),
cropper = '';

// on change show image with crop options
upload.addEventListener('change', (e) => {
  if (e.target.files.length) {
    // start file reader
    const reader = new FileReader();
    reader.onload = (e)=> {
      if(e.target.result){
        // create new image
        let img = document.createElement('img');
        img.id = 'image';
        img.src = e.target.result
        // clean result before
        result.innerHTML = '';
        // append new image
        result.appendChild(img);
        // show save btn and options
        save.classList.remove('hide');
        options.classList.remove('hide');
        // init cropper
        cropper = new Cropper(img);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  }
});

// save on click
save.addEventListener('click',(e)=>{
  e.preventDefault();
  // get result to data uri
  let imgSrc = cropper.getCroppedCanvas({
    width: img_w.value // input value
  }).toDataURL();
  // remove hide class of img
  cropped.classList.remove('hide');
  img_result.classList.remove('hide');
  // show image cropped
  cropped.src = imgSrc;
  dwn.classList.remove('hide');
  dwn.download = 'imagename.png';
  dwn.setAttribute('href',imgSrc);
});



/*var $imageCropper = $('#image-cropper');
var cropperOptions = {
  aspectRatio: 210 / 297,
  autoCropArea: 1,
  cropBoxResizable: true,
  dragMode: 'move',
  preview: '.img-thumbnail',
  crop: function (e) {
    $dataRotate.text(e.rotate);
  },
  zoom: function(e){
    var ratio = Math.round(e.ratio * 1000)/10;
    $dataZoom.text(ratio);
  }
};
var $dataRotate = $('#dataRotate');
var $dataZoom = $('#dataZoom');

$imageCropper.cropper(cropperOptions);

//cropper UI sliders
$('#zoom-slider').slider({
  min: 0.1,
  max: 4,
  value: 1,
  step: 0.01,
  slide: function( event, ui ) {
    if ($imageCropper.data('cropper')){
        $imageCropper.cropper('zoomTo', ui.value)
    }
  }
});
$('#rotate-slider').slider({
  min: -10,
  max: 10,
  value: 0,
  step: 0.1,
  slide: function( event, ui ) {
    if ($imageCropper.data('cropper')){
        $imageCropper.cropper('rotateTo', ui.value)
    }
  }
});*/