/***************************************************
    Detect browser
***************************************************/
if((window.chrome !== null) && (window.navigator.vendor === "Google Inc.")) {
} else { 
   alert('This application will only work on Google Chrome!');
}

var jsVideoRecorder = new jsHtml5VideoRecorder();

/***************************************************
	Init Html5 Video Streaming
***************************************************/
jsVideoRecorder.whammy                      = Whammy;              //Whammy object from https://github.com/antimatter15/whammy
jsVideoRecorder.width                       = '640';               //Width of the canvas and video tag element
jsVideoRecorder.height                      = '480';               //Height of the canvas and video tag element

jsVideoRecorder.resultTagIdHost             = 'media';             //Div id where to store (the video recorded by the user)
jsVideoRecorder.resultTagId                 = 'myPicture';         //Id of the video to show to user inside the resultTagIdHost

jsVideoRecorder.videoTagIdHost              = 'media';             //Div id where to store (video and canvas html tag element)
jsVideoRecorder.videoTagId                  = 'video';             //Id of the video tag element
jsVideoRecorder.canvasTagId                 = 'canvas';            //Id of the canvas tag element

//There is no counter that stops the record in this script
//This number just helps us calculates the video fps, depending on your machine and webcam
//If you want to stop the record after x seconds, use your own countdown
jsVideoRecorder.maxRecordTime               = 30;

jsVideoRecorder.videoExtension              = 'webm';              //Only "webm" format is supported
jsVideoRecorder.hideWebcamWhileRecording    = true;                //Hide webcam while recording, strongly improves performance
jsVideoRecorder.mediaPath                   = '/medias/Temp/';
jsVideoRecorder.phpFile                     = '/form/videoProcess.php'; //File is included inside the repository

jsVideoRecorder.init();


function startRecording() {
    jsVideoRecorder.startRecording();
}

/**
 * You can use "save", "saveAndDownload" or "saveAndStream", "downloadAndStream" parameters
 */
function stopRecording() {
    jsVideoRecorder.stopRecording('saveAndStream');
}
