/***************************************************
    Detect browser
***************************************************/
if((window.chrome !== null) && (window.navigator.vendor === "Google Inc.")) {
} else { 
   alert('This application will only work on Google Chrome!');
}

var jsVideoRecorder = new jsHtml5VideoRecorder();

/***************************************************
	Init Html5 Audio Streaming
***************************************************/
jsVideoRecorder.whammy                      = Whammy;
jsVideoRecorder.width                       = '640';
jsVideoRecorder.height                      = '480';
jsVideoRecorder.videoTagIdHost              = 'media';
jsVideoRecorder.videoTagId                  = 'video';
jsVideoRecorder.canvasTagId                 = 'canvas';
jsVideoRecorder.maxRecordTime               = 30;
jsVideoRecorder.videoFormat                 = '.webm';
jsVideoRecorder.hideWebcamWhileRecording    = true; //Hide webcam while recording, strongly improves performance
jsVideoRecorder.mediaPath                   = '/medias/Temp/';
jsVideoRecorder.phpFile                     = '/form/Process.php'; //Create your own file or ask me for it (edouard.kombo@gmail.com)

jsVideoRecorder.init();


function startRecording() {
    jsVideoRecorder.startRecording();
}

function stopRecording() {
    jsVideoRecorder.stopRecording('downloadAndStream');
    
    //No parameters will make your file to be downloaded on your server
    //jsVideoRecorder.stopRecording();
}
