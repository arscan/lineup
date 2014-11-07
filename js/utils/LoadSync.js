// a simple lightweight synchronization class
// kinda hacky
// author: @arscan

var LOADSYNC = (function(){
    var count = 0,
        runWhenFinished = function(){},
        started = false;

    function register(callback){
        count++;
        console.log('up to ' + count);
        return function(){

            if(typeof(callback) == "function"){
                callback.apply(this, arguments);
            }

            count--;
            console.log('down to ' + count);
            if(count === 0 && started){
                runWhenFinished();
                console.log('running finished normal way');
            }
        };
    }

    function onComplete(_cb){
        runWhenFinished = _cb;
    }

    function start(){
        if(count === 0){
            runWhenFinished();
            console.log('running finished deffered');
        }
        started = true;
    }

    return {
        register: register,
        onComplete: onComplete,
        start: start
    }

})();
