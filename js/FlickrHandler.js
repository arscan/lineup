var FLICKR = {
    items: [],
    setItems: function(input){
        for(var i = 0; i< input.length; i++){
            this.items[i] = input[i];
            var hRes = /height=\"(\d+)\"/.exec(input[i].description);
            if(hRes.length > 1 && !isNaN(parseInt(hRes[1],10))){
                this.items[i].height = parseInt(hRes[1],10);
            } 
            var wRes = /width=\"(\d+)\"/.exec(input[i].description);
            if(wRes.length > 1 && !isNaN(parseInt(wRes[1],10))){
                this.items[i].width = parseInt(wRes[1],10);
            } 

        }
    },
    getRandom: function(num){
        var res = [];
        while(num > 0){
            res.push(items[Math.floor(Math.random() * items.length)]);
            num--;
        }

        return res;
    },
    getRecent: function(num){
        return this.items.slice(0,num);
    }
};

function jsonFlickrFeed(result){
    FLICKR.setItems(result.items);
}
