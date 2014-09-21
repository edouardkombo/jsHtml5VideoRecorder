/**
 * Object:  jsHtml5VideoRecorder
 * Version: master
 * Author:  Edouard Kombo
 * Twitter: @EdouardKombo
 * Github:  https://github.com/edouardkombo
 * Blog:    http://creativcoders.wordpress.com
 * Url:     https://github.com/edouardkombo/jsHtml5VideoRecorder
 * 
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * 
 * Record live video stream in html5 with automatic fps, stream it, save it on server or download directly from browser
 */

var jsHtml5VideoRecorder = function(){};

jsHtml5VideoRecorder.prototype = {
    url: 0,
    hasStopped: false,    
    whammy: false,
    mediaStream: '',
    videoTagId: 'video',
    canvasTagId: 'canvas',
    videoTag: 0,
    canvasTag: 0,
    ctx: 0,
    frames: [],
    startTime: 0,
    endTime: 0,    
    rafId: 0,
    maxRecordTime: 0,
    width: 0,
    height: 0,
    mediaPath: '',    
    phpFile: '',
    videoTagIdHost: '',
    hideWebcamWhileRecording: true,
    
    /**
     * Get Proper html5 getUsermedia from window.navigator object, depending on the browser
     * 
     * @returns {undefined}
     */
    init: function (){
        if (!navigator.getUserMedia) {
            navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        }
        window.URL  = window.URL || window.webkitURL;
        this.url    = window.URL;        
        
        window.onload = this.onLoad();
    },

    /**
     * Instantiate navigator.getUserMedia Api and load video stream
     * 
     * @returns {undefined}
     */
    onLoad: function () {
        navigator.getUserMedia({ 
            video: true
        }, this.startUserMedia.bind(this), function(e) {
            console.log('No live video stream: ' + e);
            alert("Webcam not enabled or no live video stream");
        });        
    },    
    
    /**
     * Create live video stream, and create html video and canvas tags if not exists
     * 
     * @param {Object} stream
     * @returns {undefined}
     */    
    startUserMedia: function (stream)
    {   
        this.mediaStream = stream;
        
        //Create video and canvas tag if not exists
        this.createTag(this.videoId);
        this.createTag(this.canvasId);        
    },
    
    /**
     * Create html tag inside html document (video, canvas)
     * 
     * @param {String} tag
     * @returns {jsHtml5Webcam.prototype@pro;videoTagmyTag|jsHtml5Webcam.prototype.createTag.myTag|jsHtml5Webcam.prototype.createTag.thisTag|Element}
     */
    createTag: function(tag) 
    {           
        var myTag   = document.getElementById(tag);
        
        if (myTag === null) {
            
            myTag = document.createElement(tag);
            
            if (tag === 'canvas') {
                this.ctx                = myTag.getContext('2d');
                myTag.width             = this.width;
                myTag.height            = this.height;
                myTag.style.position    = 'absolute';
                myTag.style.visibility  = 'hidden';
                myTag.id                = tag;
                this.canvasTag          = myTag;
            
            } else if (tag === 'video') {    
                myTag.setAttribute('autoplay','true');
                myTag.width             = this.width;
                myTag.height            = this.height;
                myTag.id                = tag;
                if (this.mediaStream !== '') {
                    myTag.src = window.URL.createObjectURL(this.mediaStream);
                }
                this.videoTag   = myTag;
            }        
            document.getElementById(this.videoTagIdHost).appendChild(myTag);    
        
        } else {
            
            myTag.id = tag;
            
            if (tag === 'video') {
                this.videoTag = myTag;
                this.videoTag.setAttribute('autoplay','true');
                this.videoTag.width   = this.width;
                this.videoTag.height  = this.height;
                if (this.mediaStream !== '') {
                    this.videoTag.src = window.URL.createObjectURL(this.mediaStream);
                }            
                return this.videoTag;

            } else if (tag === 'canvas') {
                this.ctx       = myTag.getContext('2d');            
                this.canvasTag = myTag;
                this.canvasTag.width   = this.width;
                this.canvasTag.height  = this.height;            
                this.canvasTag.style.position   = 'absolute'; 
                return this.canvasTag;            
            }
        }
    },                
    
    /**
     * All frames images per images
     * 
     * @param {Integer} time
     * @returns {undefined}
     */
    drawVideoFrame_: function (time) 
    {
        this.ctx.drawImage(this.videoTag, 0, 0, this.videoTag.width, this.videoTag.height);
        var url = this.canvasTag.toDataURL('image/webp', 1);
        this.frames.push(url);

        this.rafId   = requestAnimationFrame(this.drawVideoFrame_.bind(this));        
    },  
    
    /**
     * Start video record
     * 
     * @returns {Boolean}
     */
    startRecording: function ()
    {
        //Remove video tag and recreate it to empty cache
        document.getElementById('video').remove();   
        this.createTag(this.videoId);
        this.createTag(this.canvasId);
        
        if (this.hideWebcamWhileRecording) {
            //Hide video stream while recording for performance
            this.videoTag.style.visibility  = 'hidden';
            this.videoTag.style.display     = 'none';
        }

        this.hasStopped = false;
		
        this.startTime   = Date.now();

        this.frames      = []; // clear existing frames;
        console.log('Recording video...');

        this.rafId = requestAnimationFrame(this.drawVideoFrame_.bind(this));

        return true;        
    },
    
    /**
     * Stop video record and triggers specific methods
     * (Save, download, stream, saveAndStream, downloadAndStream) 
     * 
     * @param {String} method
     * @returns {Boolean}
     */
    stopRecording: function (method)
    {
        this.endTime = Date.now();   
        
        this.hasStopped = true; 
        
        cancelAnimationFrame(this.rafId);

        //Recorded time
        var recordedTime = (this.endTime - this.startTime)/1000;

        console.log('Captured frames: ' + this.frames.length + ' => ' + recordedTime + 's video');

        //We consider that the normal gap between Max recording time and real user recording time is 1s
        //When the gap is greater than 1s, we auto-check the fps to synchronize the medias
        var recordingGap        = this.maxRecordTime - recordedTime;

        //Detect fps
        var fps                 = (this.frames.length / recordedTime).toFixed(1); 
        var encodingRatio       = fps; 

        //Expected frames is the number of frames expected depending on the max record time
        var expectedFrames      = (recordingGap <= 1) ? encodingRatio * this.maxRecordTime : encodingRatio * recordedTime ;
        var unexpectedFrames    = this.frames.length - expectedFrames; 

        //If there are more frames than expected, remove unexpected frames
        if (unexpectedFrames > 0) {
            var i=0;
            for (i = 0; i <= unexpectedFrames; i++) { 
               this.frames.pop();
            }
        } else {
            encodingRatio   = ((this.frames.length * fps) / expectedFrames).toFixed(3);
        }                

        console.log('Stop Recording video!'); 
        console.log('My FPS => '+ fps);
        console.log(encodingRatio);             

        var webmBlob = this.whammy.fromImageArray(this.frames, encodingRatio);
        console.log(webmBlob);
        
        if (method === 'save') {
            this.save(webmBlob, false);
        } else if (method === 'download') {
            this.downmload(webmBlob, false);
        } else if (method === 'stream') {
            this.stream(webmBlob);
        } else if (method === 'saveAndStream') {
            this.save(webmBlob, true);
        } else if (method === 'downloadAndStream') {
            this.download(webmBlob, true);
        } else {
            this.save(webmBlob, false);
        }
        
        //Empty frames for next video capture
        this.frames = [];
               
        return true;
    },
       
    /**
     * Save video file on server and stream it or not
     * 
     * @param   {Object}    blob
     * @param   {Boolean}   stream
     * @returns {undefined}
     */
    save: function (blob, stream) {
         
        var datas   = 'path='+this.mediaPath+'&format='+this.videoFormat;                  

        var client = new XMLHttpRequest();
        client.onreadystatechange = function() 
        {
            if (client.readyState === 4 && client.status === 200) 
            {
                console.log(client.response);
                if (stream) {
                    this.stream(blob);
                }
            }
        }.bind(this);                    
        client.open("post", this.phpFile+'?'+datas, true);
        client.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        client.setRequestHeader("cache-Control", "no-store, no-cache, must-revalidate");
        client.setRequestHeader("cache-Control", "post-check=0, pre-check=0");
        client.setRequestHeader("cache-Control", "max-age=0");
        client.setRequestHeader("Pragma", "no-cache");            
        client.setRequestHeader("X-File-Name", encodeURIComponent('1'));
        client.setRequestHeader("Content-Type", "application/octet-stream");
        client.send(blob);                
    },
    
    /**
     * Directly download video file from browser and stream it or not
     * 
     * @param   {Object}    blob
     * @paam    {Boolean}   stream
     * @returns {undefined}
     */
    download: function(blob, stream) {
        
        var url             = window.URL.createObjectURL(blob);
        //Create a link
        var hf              = document.createElement('a');

        var temporaryId     = new Date().toISOString();
        
        //Define link attributes
        hf.href             = url;
        hf.id               = temporaryId;
        hf.download         = temporaryId + this.videoFormat;
        hf.innerHTML        = hf.download;
        hf.style.display    = 'none';
        hf.style.visibility = 'hidden';
        //Append the link inside html code
        document.body.appendChild(hf);

        //Simulate click on link to download file, and instantly delete link
        document.getElementById(hf.id).click();
        document.getElementById(hf.id).remove();
        
        if (stream) {
            this.stream(blob);
        }        
    },
    
    /**
     * Stream
     * 
     * @param {Object} blob
     * @returns {undefined}
     */
    stream: function(blob) {
        
        var url             = window.URL.createObjectURL(blob);
        
        this.videoTag.style.visibility  = 'visible';
        this.videoTag.style.display     = 'block';       
        this.videoTag.src               = url;
        this.videoTag.setAttribute('autoplay', false);         
        this.videoTag.setAttribute('controls', true);
        this.videoTag.pause();
        
    }    
};
