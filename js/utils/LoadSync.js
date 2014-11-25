// a simple lightweight synchronization class
// kinda hacky
// author: @arscan

var LOADSYNC = (function(){
    var completedCount = 0,
        count = 0,
        runWhenFinished = function(){},
        started = false,
        onUpdateFunction = null;

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

            completedCount++;
            if(typeof onUpdateFunction === "function"){
                onUpdateFunction(completedCount, count + completedCount);
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

    function onUpdate(fn){
        onUpdateFunction = fn;
    }

    return {
        onUpdate: onUpdate,
        register: register,
        onComplete: onComplete,
        start: start
    }

})();
