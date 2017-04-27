// timeoutjs.io
(function(window){
    'use strict';
    function define_timeout(){
        var timeout = {}, timer, uSec, uCB, timedOut = false, delayVal;

        // Sets a timer with the ID stored at timer
        function set(s, cb) {
            var ms   = s * 1000;
            timedOut = false;
            delayVal = s;

            timer = setInterval(function() {
                if (!timedOut) {
                    timedOut = true;
                    cb();
                }
            }, ms);
            return timer;
        }

        // Removes all timing information
        function unset() {
            timedOut = false;
            clearInterval(timer);
        }

        // Public - initializes a timer
        timeout.newTimer = function newTimer(seconds, callback) {
            if(typeof seconds === "undefined" || !callback) {
                if(typeof seconds === "undefined") {
                    console.error("timeoutjs at newTimer()", "Specify a timeout length in seconds when calling timeout.newTimer().");
                }
                if(!callback) {
                    console.error("timeoutjs at newTimer()", "Specify a callback for timeout event when calling timeout.newTimer().");
                }
                return null;
            }
            uSec  = seconds;
            uCB   = callback;
            return set(uSec, uCB);
        };

        // Public - hard stop for a timer
        timeout.stop = function stop() {
            if (!timer) {
                console.error("timeoutjs at stop()", "Timer has not been properly initialized!");
            }
            unset();
        };

        // Public - restarts the timer
        // Call this on an action to preserve the session
        timeout.refresh = function refresh() {
            if(typeof uSec === "undefined" || !uCB) {
                console.error("timeoutjs:", "Timer has not been properly initialized!");
                return null;
            } else {
                unset();
                return set(uSec, uCB);
            }
        };

        // Public - resume paused timeout behavior
        timeout.resume = function resume(reset) {
            if (typeof reset === undefined) {
                timedOut = false;
            } else {
                if (reset) {
                    unset();
                    set(uSec, uCB);
                } else {
                    timedOut = false;
                }
            }
        };

        // Public - timer keeps counting, but timeout behavior is paused
        timeout.pause = function pause() {
            timedOut = true;
        };

        timeout.getTime = function getTime() {
            return delayVal;
        };

        return timeout;
    }
    if(typeof(timeout) === 'undefined'){
        window.timeout = define_timeout();
        window.document.onclick = function() {
            timeout.refresh();
        };
    }
})(window);
