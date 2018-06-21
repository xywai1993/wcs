//****1.连接服务端********************//
//****2.监听服务端********************//
//****3.接受服务端报文****************//
//****4.解析报文为数组格式************//
//****5.根据报文类型进行不同的处理****//
//****6.反馈给服务端收到内容信息******//
//****//
//window.onload = function () {
var data_;

!function start() {
    var inc = document.getElementById('incomming');
    var wsImpl = window.WebSocket || window.MozWebSocket;
    var form = document.getElementById('sendForm');
    var input = document.getElementById('sendText');

    inc.innerHTML += "connecting to server ..<br/>";

    // create a new websocket and connect
    window.ws = new wsImpl('ws://localhost:7181/');

    // when data is comming from the server, this metod is called
    ws.onmessage = function (evt) {
        data_ = evt;       
        inc.innerHTML += evt.data + '<br/>';


        ////1.解析报文为数组格式
        var jsonObj = eval(data_.data)
        console.log(jsonObj)
        var jsonStr1 = JSON.stringify(jsonObj)
        console.log(jsonStr1 + "jsonStr1")
        var jsonArr = [];
        for (var i = 0 ; i < jsonObj.length; i++) {
            jsonArr[i] = jsonObj[i];
        }
        console.log(typeof (jsonArr))
        console.log(jsonObj + "打印json对象");
        var data = jsonArr;
        console.log(data.length + "打印数组长度");

        if (data[0].messagetype == "drap") {
            for (var i = 1; i < data.length; i++) {
                var cc = data[i].station;
                var div = $('<div class="' + cc + '" ></div>');
                div.css({ background: "yellow", color: "#green", left: data[i].x, top: data[i].y, width: data[i].width * 30, height: data[i].height * 30 });
                div.html(data[i].station);
                $("#c").append(div);
                console.log(cc)
                $('#c').on('click', '.' + cc, function (e) {
                    console.log(cc + '556vvv')
                    $('#tc').show().html(cc + '556vvv')
                });
            }            
        }
        //console.log(a + '我是变色777')
        else if (data[0].messagetype == "stadate") {
            console.log(a + '我是打印变色');
            for (var i = 1; i < data.length; i++) {
                var a = data[i].station;
                console.log(a + '我是变色888');              
                var test = a;
                $('.' + a).css({ background: "black", color: "red" })               
                console.log('我是变色999');
            }
        }
        else if (data[0].messagetype == "scdate") {
            //堆垛机的数据报文
        }
        
    };

    // when the connection is established, this method is called
    ws.onopen = function () {
        inc.innerHTML += '.. connection open<br/>';
    };

    // when the connection is closed, this method is called
    ws.onclose = function () {
        inc.innerHTML += '.. connection closed<br/>';
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var val = input.value;
        ws.send(val);
        input.value = "";
    });





}();



//var Zdiv = $("<div id='ddd' class='' >dasd</div>");
//Zdiv.css({ background: "black", color: "#ccc", left: 200, top: 100, width: 10 * 30, height: 10 * 30 });
//$('#tc').append(Zdiv);