// a simple lightweight synchronization class
// author: @arscan

var LOADSYNC = (function(){
    var count = 0,
        cb = function(){};

    function register(){
        count++;
        return function(){
            count--;
            if(count === 0){
                cb();
            }
        };
    }

    function onComplete(_cb){
        cb = _cb;
    }

    return {
        register: register,
        onComplete: onComplete
    }

})();
