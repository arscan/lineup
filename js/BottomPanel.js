/* based on a 1920 screen */
/* scale based on real image size */

function createBottomPanel(elem){
    var scale = elem.width()/1920; /* everything on this is against 1920, which is what it was originally developed at */

    var PANEL_COLORS = {
        BLUE: '#12b7a7', 
        RED: '#eac7df', 
        ORANGE: '#fd5f00'
    };

    var paper = new Raphael(elem[0], '100%', 100);
    function drawTrapezoid(x, y, width, height){
        x *= scale;
        y *= scale;
        width *= scale;
        height *= scale;
        paper
        .path(['M', x, y+height, 'L', x, y+height-10, 'L', x+ (height-10), y, 'L', x+width, y, 'L', x+width, y+10, 'L', x+width-(height-10), y+height, 'Z'])
        .attr({'fill': PANEL_COLORS.BLUE, opacity: 0.4, 'stroke-width': 0});
    }

    function drawHorizontalLine(x, y, width, strokeWidth, color){
        x *= scale;
        y *= scale;
        strokeWidth *= scale;
        paper
        .path( ['M', x, y, 'L', x + width, y ] )
        .attr({stroke: color, 'stroke-width':strokeWidth, 'opacity': 0.4})
        .glow({color: color, opacity: 0.2, width: 5});
    }

    function drawTickMarks(x, y, width, height, gapWidth, count, color, label){
        x *= scale;
        y *= scale;
        width *= scale;
        height *= scale;
        gapWidth *= scale;

        for(var i = 0; i< count; i++){

            paper
            .rect(x + i * gapWidth,y,width,height)
            .attr({'stroke-width': 0, fill: color, 'opacity': 0.4})
            .glow({color: color, opacity: 0.2, width: 5});


            if(typeof label === 'function'){
                var labelVal = label.call(window, i);
                if(typeof labelVal === 'string' && labelVal.length > 0){
                    paper
                    .text(2 + x + i * gapWidth, y-8, labelVal)
                    .attr({'font-size': 12, fill: color, 'font-weight': 'bold', 'opacity': 0.4});
                }

            }

        }
    } 


    drawHorizontalLine(0,23,elem.width(),5,PANEL_COLORS.RED);
    drawHorizontalLine(0,30,elem.width(),3,PANEL_COLORS.RED);

    drawHorizontalLine(0,42,elem.width(),8,PANEL_COLORS.BLUE);

    $(paper.rect(850,40,150,5)
      .attr({'stroke-width': 0, fill: PANEL_COLORS.RED, 'opacity': 0.8}).node)
      .velocity({x: '-=100', width: '+=120'}, {duration: 8000, loop: true, easing: 'linear'});

      drawHorizontalLine(850,42,150,6,PANEL_COLORS.BLUE);
      drawHorizontalLine(0,75,elem.width(),6,PANEL_COLORS.BLUE);
      drawHorizontalLine(1240,40,20,8,PANEL_COLORS.BLUE);


      drawHorizontalLine(100,43,10,6,PANEL_COLORS.BLUE);
      drawHorizontalLine(1440,45,260,5,PANEL_COLORS.ORANGE);
      drawHorizontalLine(1750,38,100,5,PANEL_COLORS.ORANGE);
      drawHorizontalLine(1460,38,180,5,PANEL_COLORS.RED);

      drawTickMarks(10,15,3,5,80,elem.width()/80,PANEL_COLORS.RED);
      drawTickMarks(30,32,9,4,120,elem.width()/120,PANEL_COLORS.RED);
      drawTickMarks(300,15,3,5,25,15,PANEL_COLORS.RED);
      drawTickMarks(1300,15,3,5,100,5,PANEL_COLORS.RED);
      drawTickMarks(10,78,4,6,95,(elem.width())/95,PANEL_COLORS.BLUE);

      drawTickMarks(500,65,4,10,60,(elem.width()-1000)/60,PANEL_COLORS.BLUE, function(index){
          if(index % 2){
              return null;
          } else {
              return '' +  (10 + Math.floor(Math.random()*90));
          }
      });

      drawTrapezoid(160, 33, 600, 40);
      drawTrapezoid(1300, 65, 500, 20);
      drawTrapezoid(250, 25, 550, 25);

      $(paper.rect(500,15,200,4)
        .attr({'stroke-width': 0, fill: PANEL_COLORS.BLUE, 'opacity': 0.8}).node)
        .velocity({x: '+=900'}, {duration: 2000, loop: true, easing: 'linear'});

        $(paper.rect(800,48,35,8)
          .attr({'stroke-width': 0, fill: PANEL_COLORS.BLUE, 'opacity': 0.8}).node)
          .velocity({x: '+=500'}, {delay: 234, duration: 1000, loop: true, easing: 'linear'});

          $(paper.rect(800,30,100,4)
            .attr({'stroke-width': 0, fill: PANEL_COLORS.RED, 'opacity': 0.5}).node)
            .velocity({x: '+=500', width: '-=80'}, {delay: 150, duration: 4000, loop: true, easing: 'linear'});


   return Object.freeze({
       element: elem



   });


}
