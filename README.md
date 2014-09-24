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
    jsVideoRecorder.whammy                      = Whammy;              //Whammy object from https://github.com/antimatter15/whammy
    jsVideoRecorder.width                       = '640';               //Width of the canvas and video tag element
    jsVideoRecorder.height                      = '480';               //Height of the canvas and video tag element

    jsVideoRecorder.resultTagIdHost             = 'media';             //Div id where to store the video recorded by the user
    jsVideoRecorder.resultTagId                 = 'myVideo';           //Id of the video to show to user inside the resultTagIdHost

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

    //Initialize it
    jsVideoRecorder.init();

    function startRecording() {
        jsVideoRecorder.startRecording();
    }

    /**
     * You can use "save", "saveAndDownload" or "saveAndStream", "downloadAndStream" parameters
     */
    function stopRecording() {
        //For demo
        jsVideoRecorder.stopRecording('downloadAndStream');
        
        //Use this on production
        //jsVideoRecorder.stopRecording('saveAndStream');
    }

        
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
