// a simple lightweight synchronization class
// kinda hacky
// author: @arscan

var LOADSYNC = (function(){
    var count = 0,
        runWhenFinished = function(){},
        started = false;

    function register(callback){
        count++;
        return function(){

            if(typeof(callback) == "function"){
                callback.apply(this, arguments);
            }

            count--;
            if(count === 0 && started){
                setTimeout(runWhenFinished,1000);
            }
        };
    }

    function onComplete(_cb){
        runWhenFinished = _cb;
    }

    function start(){
        if(count === 0){
            setTimeout(runWhenFinished,1000);
        }
        started = true;
    }

    return {
        register: register,
        onComplete: onComplete,
        start: start
    }

})();
