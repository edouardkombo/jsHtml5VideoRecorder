Js Html5 Video Recorder
=======================

JsHtml5VideoRecorder is a native html5 object that helps you record live video stream from your browser.
it provides automatic fps depending on your cpu.
It works perfectly and only on Google Chrome.


1) How to install
---------------------

    bower install js-html5-video-recorder


2) How to use it?
-----------------

    //Instantiate the object
    var jsVideoRecorder = new jsHtml5VideoRecorder();
    

    //Set Parameters
    jsVideoRecorder.whammy                      = Whammy; //Whammy object from https://github.com/antimatter15/whammy
    jsVideoRecorder.width                       = '640';
    jsVideoRecorder.height                      = '480';
    jsVideoRecorder.videoTagIdHost              = 'media'; //Html tag where is contained the media (video or tag)
    jsVideoRecorder.videoTagId                  = 'video';
    jsVideoRecorder.canvasTagId                 = 'canvas';
    jsVideoRecorder.maxRecordTime               = 30;      //Maximum time of the recorded
    jsVideoRecorder.videoFormat                 = '.webm';    
    jsVideoRecorder.hideWebcamWhileRecording    = true; //Hide webcam while recording, strongly improves performance
    jsVideoRecorder.mediaPath                   = '/medias/Temp/';
    jsVideoRecorder.phpFile                     = '/form/Process.php'; //Create your own file or ask me for it (edouard.kombo@gmail.com)

    //Initialize it
    jsVideoRecorder.init();

    //Start recording
    jsVideoRecorder.startRecording();

    //Stop recording with options
    jsVideoRecorder.stopRecording(); //Save video on your server
    jsVideoRecorder.stopRecording('save'); //Save video on your server
    jsVideoRecorder.stopRecording('download'); //Download video from browser
    jsVideoRecorder.stopRecording('stream'); //Directly stream video from browser
    jsVideoRecorder.stopRecording('saveAndStream'); //Save video on server and stream it
    jsVideoRecorder.stopRecording('downloadAndStream'); //Download video from browser and stream it

        
3) Live Demonstration
---------------------

http://edouardkombo.github.io/jsHtml5VideoRecorder/demo/
    

Contributing
-------------

If you do contribute, please make sure it conforms to the PSR coding standard. The easiest way to contribute is to work on a checkout of the repository, or your own fork, rather than an installed version.

Want to learn more? Visit my blog http://creativcoders.wordpress.com


Issues
------

Bug reports and feature requests can be submitted on the [Github issues tracker](https://github.com/edouardkombo/jsHtml5VideoRecorder/issues).

For further informations, contact me directly at edouard.kombo@gmail.com.
