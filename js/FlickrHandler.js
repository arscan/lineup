function createFlickrParser(){
    var items = [];

    function setItems(input){
        for(var i = 0; i< input.items.length; i++){
            items[i] = input.items[i];
            var hRes = /height=\"(\d+)\"/.exec(input.items[i].description);
            if(hRes.length > 1 && !isNaN(parseInt(hRes[1],10))){
                items[i].height = parseInt(hRes[1],10);
            } 
            var wRes = /width=\"(\d+)\"/.exec(input.items[i].description);
            if(wRes.length > 1 && !isNaN(parseInt(wRes[1],10))){
                items[i].width = parseInt(wRes[1],10);
            } 

            /* flickr api doesn't allow for CORS, so run the downloadflickr.js periodically and grab locally */

            items[i].url = "images/flickr" + items[i].media.m.substring(items[i].media.m.lastIndexOf('/'));
        }
    }
    function getRandomLandscapes(num){
        var res = [];
        var seen = [];
        while(num > 0){
            var randIndex = Math.floor(Math.random() * items.length);
            if(items[randIndex].width > items[randIndex].height && seen.indexOf(randIndex) < 0){
                res.push(items[randIndex]);
                seen.push(randIndex);
                num--;
            }
        }

        return res;
    }

    function getRecent(num){
        return items.slice(0,num);
    }

    return Object.freeze({
        setItems: setItems,
        getRandomLandscapes: getRandomLandscapes,
        getRecent: getRecent
    });
};

FLICKR = createFlickrParser();

/*
function jsonFlickrFeed(result){
    FLICKR.setItems(result.items);
}
*/
