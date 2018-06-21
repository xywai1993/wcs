window.onload = function () {
    var div1 = document.getElementById("div1");
    div1.onmousedown = function (ev) {
        var oevent = ev || event;

        var distanceX = oevent.clientX - div1.offsetLeft;
        var distanceY = oevent.clientY - div1.offsetTop;

        document.onmousemove = function (ev) {
            var oevent = ev || event;
            div1.style.left = oevent.clientX - distanceX + 'px';
            div1.style.top = oevent.clientY - distanceY + 'px';
        };
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        };
        ;
    };
}