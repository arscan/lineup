// a simple lightweight synchronization class
// kinda hacky
// author: @arscan

var LOADSYNC = (function(){
    var count = 0,
        runWhenFinished = function(){};

    function register(callback){
        count++;
        return function(){

            if(typeof(callback) == "function"){
                callback.apply(this, arguments);
            }

            count--;
            if(count === 0){
                runWhenFinished();
            }
        };
    }

    function onComplete(_cb){
        runWhenFinished = _cb;
    }

    return {
        register: register,
        onComplete: onComplete
    }

})();
