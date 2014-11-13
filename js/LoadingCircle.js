
function createLoadingCircle(element){
    var outerDiv = $('<div/>');

    outerDiv.css({
        opacity: 0.6,
        position: 'absolute',
        left: 500,
        top: 200,
        color: '#b6a0b4',
        'text-transform': 'uppercase',
        height: 200,
        width: 200,
    });

    var paper = new Raphael(outerDiv[0], 200, 200);

    function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = angleInDegrees * Math.PI / 180.0;
        var x = centerX + radius * Math.cos(angleInRadians);
        var y = centerY + radius * Math.sin(angleInRadians);
        return [x,y];
    }

    function createArc(centerX, centerY, radius, startAngle, endAngle){
        var start = polarToCartesian(centerX,centerY,radius,startAngle);
        var end = polarToCartesian(centerX,centerY,radius,endAngle);
        return paper.path('M ' + start[0] + ' ' + start[1] + ' A ' + radius + ' ' + radius + ' 0 1 0 ' + end[0] + ',' + end[1]);
    }

    createArc(100, 100, 80, 140, 270).attr({stroke: '#12b7a7', 'stroke-width': '2px'});
    createArc(100, 100, 60, 140, 270).attr({stroke: '#12b7a7', 'stroke-width': '2px'});
    createArc(100, 100, 99, 359, 0).attr({stroke: '#12b7a7', 'stroke-width': '2px'});

    element.append(outerDiv);

    // outerDiv.velocity({left: 200},{delay: 100, duration: 1000} );
    // outerDiv
    //     .velocity({left: 250, bottom: '-=20', scale: 0.9},{easing: 'easeOutBack', duration: 3000} )
    //     .velocity({left: -200},{duration: 1000, complete: function(){
    //         paper.forEach(function(el){
    //             el.blur(10);
    //         });
    //     }})
    //     .velocity({left: 100, bottom: '+=200', scale: 0.2, opacity: 1}, {duration: 1000})
    //     .velocity({left: '-=20', bottom: '-=20'}, {duration: 10000, loop: true});
}
