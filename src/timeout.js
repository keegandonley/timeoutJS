// timeoutjs.io
(function(window){
    'use strict';
    function define_timeout(){
        var timer;
        var uCB;
        var timeout   = {};
        timeout.count = {};
        var uSec      = 0;
        var timedOut  = false;
        var delayVal  = 0;

        var countData = {
            seconds   : 0,
            remaining : 0,
            expired   : false,
            timer     : null
        };

        var isCount = false;
        var isTimer = false;

        // Sets a timer with the ID stored at timer
        function set(s, cb) {
            isTimer = true;
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

        function setCount(s, cb) {
            isCount = true;
            countData.seconds   = s;
            countData.remaining = s;

            countData.timer = setInterval(function() {
                if (countData.remaining > 0) {
                    countData.remaining = countData.remaining - 1;
                } else {
                    countData.expired = true;
                    clearInterval(countData.timer);
                    cb();
                }
            }, 1000);
        }

        // Removes all timing information
        function unset() {
            timedOut = false;
            clearInterval(timer);
        }

        timeout.isCount = function() {
            return isCount;
        };

        timeout.isTimer = function() {
            return isTimer;
        };

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

        // Public - initializes a countdown
        timeout.count.new = function (seconds, callback) {
            if(typeof seconds === "undefined" || !callback) {
                if(typeof seconds === "undefined") {
                    console.error("timeoutjs at newCount()", "Specify a timeout length in seconds when calling timeout.newCount().");
                }
                if(!callback) {
                    console.error("timeoutjs at newCount()", "Specify a callback for timeout event when calling timeout.newCount().");
                }
                return null;
            }
            setCount(seconds, callback);
        };

        // Gets the initial length of a count
        timeout.count.length = function() {
            return countData.seconds;
        };

        // Gets the remaining time of the count
        timeout.count.remaining = function() {
            return countData.remaining;
        };

        timeout.count.stop = function() {
            clearInterval(countData.timer);
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

        timeout.count.refresh = function() {
            countData.remaining = countData.seconds;
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
            if (timeout.isTimer()) {
                timeout.refresh();
            }
            if (timeout.isCount()) {
                timeout.count.refresh();
            }
        };
    }
})(window);
