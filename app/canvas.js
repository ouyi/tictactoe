/*
// Create a Paper.js Path to draw a line into it:
var path = new Path();
// Give the stroke a color
path.strokeColor = 'red';
var start = new Point(100, 100);
// Move to start and draw a line from there
path.moveTo(start);
// Note the plus operator on Point objects.
// PaperScript does that for us, and much more!
path.lineTo(start + [ 100, -50 ]);

var path = new Path.Circle(view.bounds.center, 30);
path.fillColor = 'red';

view.onResize = function(event) {
    // Whenever the view is resized, move the path to its center:
    path.position = view.center;
    view.draw();
}
*/

window.onload = function() {
    paper.setup('myCanvas');
    with (paper) {
        var path = new Path();
        path.strokeColor = 'black';
        var start = new Point(100, 100);
        path.moveTo(start);
        path.lineTo(start.add([ 50, 50 ]));
        view.draw();
        view.onResize = function(event) {
            // Whenever the view is resized, move the path to its center:
            path.position = view.center;
            view.draw();
        }
    }
}

