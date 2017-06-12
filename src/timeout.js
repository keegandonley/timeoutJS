// timeoutjs
// www.timeoutjs.io
// by Keegan Donley
// www.keegandonley.com
// www.github.com/keegandonley
// kd@keegandonley.com

(function(window){
    'use strict';
    function define_timeout(){
        // Basic data for timeoutjs
        var timer;              // Default timer, stores the ID
        var uCB;                // Callback defined by the user
        var timeout   = {};     // Timeout object
        timeout.count = {};     // Beta features
        var uSec      = 0;      // User defined number of seconds
        var timedOut  = false;  // Used for default timer
        var delayVal  = 0;      // Stores the value of the delay


        // Date for beta features
        var countData = {
            seconds   : 0,      // Initial value
            remaining : 0,      // Remaning time (in seconds)
            expired   : false,  // Has the timer been expired?
            timer     : null    // Stores the ID of the count
        };


        // Keep track of which kind of counter was initilized
        var isCount = false;    // Beta feature
        var isTimer = false;    // Default timer type


        // Sets a timer with the ID stored at timer
        function set(s, cb) {
            isTimer  = true;
            var ms   = s * 1000;
            timedOut = false;
            delayVal = s;

            // Interval is set for the duration of the timer
            timer = setInterval(function() {
                if (!timedOut) {
                    timedOut = true;
                    cb();
                }
            }, ms);
            return timer;
        }


        // Sets the count (beta feature)
        function setCount(s, cb, elem) {
            isCount             = true;
            countData.seconds   = s;
            countData.remaining = s;
            var uiEnabled       = !!(elem);

            // Interval is set for 1 second, and after each second
            // re-evaluates the remaining time. Less efficient, but
            // allows for determining how much time is left (i.e. countdown
            // on-screen until timeout)
            countData.timer = setInterval(function() {
                if (countData.remaining > 0) {
                    countData.remaining = countData.remaining - 1;
                } else {
                    countData.expired = true;
                    clearInterval(countData.timer);
                    if (uiEnabled) {
                        uiGen(elem, cb);
                    } else {
                        cb();
                    }
                }
            }, 1000);
        }

        function uiGen(elem, cb) {
            var markup  = document.createElement("div");
            markup.className = "timeoutThemeContainer";
            var inner = document.createElement("div");
            inner.className = "timeoutContentContainer";
            var p = document.createElement("p");
            p.innerHTML = "<h4>Your page has timed out!</h4><br>Sorry about that!";
            inner.appendChild(p);
            markup.appendChild(inner);
            document.getElementsByClassName(elem)[0].className = "timeoutWrapper";
            document.getElementsByClassName("timeoutWrapper")[0].appendChild(markup);
            cb();
        }


        // Removes all timing information - default timer only
        function unset() {
            timedOut = false;
            clearInterval(timer);
        }


        // Has a count been initiated?
        timeout.isCount = function() {
            return isCount;
        };


        // Has a standard timer been initiated?
        timeout.isTimer = function() {
            return isTimer;
        };


        // Initializes a standard timer
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


        // Initializes a beta countdown
        timeout.count.new = function (seconds, callback, element) {
            if(typeof seconds === "undefined" || !callback) {
                if(typeof seconds === "undefined") {
                    console.error("timeoutjs at newCount()", "Specify a timeout length in seconds when calling timeout.newCount().");
                }
                if(!callback) {
                    console.error("timeoutjs at newCount()", "Specify a callback for timeout event when calling timeout.newCount().");
                }
                return null;
            }
            setCount(seconds, callback, element);
        };


        // Gets the initial length of a count
        timeout.count.length = function() {
            return countData.seconds;
        };


        // Gets the remaining time of the count
        timeout.count.remaining = function() {
            return countData.remaining;
        };


        // Stops a count from expiring
        timeout.count.stop = function() {
            clearInterval(countData.timer);
        };


        // Stops a timer from expiring
        timeout.stop = function stop() {
            if (!timer) {
                console.error("timeoutjs at stop()", "Timer has not been properly initialized!");
            }
            unset();
        };


        // Restarts the timer
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


        // Restarts the countdown
        // Call this on an action to preserve the session
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


        // Gets the initial time that was set
        // NOTE: This is NOT the remaining time, but the initial value.
        // If the remaining time is needed, a count should be initialized instead.
        timeout.getTime = function getTime() {
            return delayVal;
        };


        return timeout;
    }
    if(typeof(timeout) === 'undefined'){
        // Define timeout namespace
        window.timeout = define_timeout();

        // Listen for clicks and refresh the appropriate timer(s)
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
