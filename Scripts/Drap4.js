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
window.ws = new wsImpl('ws://127.0.0.1:7181/');

    // when data is comming from the server, this metod is called  169.254.203.236
ws.onmessage = function (evt) {
data_ = evt;
//inc.innerHTML += evt.data + '<br/>';     //报文日志   

var json = JSON.parse(evt.data)
console.log(json+"我是json")
if (json.status == "success") {
    if (json.messagetype == "drap")
    {
        var dataArr = eval(json.rows);
        $.each(dataArr, function (i) {
            console.log(dataArr)
            var cc = dataArr[i].STATION;
            var div = $('<div class="' + cc + '" ></div>');
            div.css({ background: "#a3a375", color: "#000000", left: dataArr[i].X + 'px', top: dataArr[i].Y + 'px', width: dataArr[i].WIDTH * 60 + 'px', height: dataArr[i].HEIGHT * 60 + 'px', position: "absolute", border: '2px solid #d6d6c2' });
            div.html(dataArr[i].STATION);
            $("#c").append(div);

            ////点击事件，弹出tc,弹出的数据显示来源于下面
            //$('#c').on('click', '.' + cc, function (e) {
            //    $('#tc').show().html(cc)
            //});
        });
    }
    else if (json.messagetype == "getStadata")
    {
       // var allPart=[];
        var dataArr = eval(json.rows);
        console.log(dataArr);
        $.each(dataArr, function (i) {
            if (dataArr[i].TASKNO != "0") {
               // console.log(dataArr[i].STATIONNO + "我是变绿色")              
                 var a = dataArr[i].STATIONNO;          
                 var test = a;         
                 $('.' + test).css({ background: "#00ff00", color: "#000000" })

                //点击事件，弹出tc,弹出的数据显示来源于下面
                 $('#c').on('click', '.' + a, function () {
                     $('#tc').show();
                     $('#stationText').val(dataArr[i].STATIONNO)
                     $('#taskText').val(dataArr[i].TASKNO)
                     $('#fromText').val(dataArr[i].FROMSTATION)
                     $('#toText').val(dataArr[i].TOSTATION)
                     $('#goodsText').val(dataArr[i].GOODTYPE)
                     $('#barcodeText').val(dataArr[i].BARCODE)
                 });                              
            }
            else if(dataArr[i].TASKNO == "0")
            {
               // console.log(dataArr[i].STATIONNO + "我是恢复颜色")
                var a = dataArr[i].STATIONNO;
                var test = a;
                $('.' + test).css({ background: "#a3a375", color: "#000000" })

                //点击事件，弹出tc,弹出的数据显示来源于下面
                $('#c').on('click', '.' + a, function () {
                    $('#tc').show();
                    $('#stationText').val(dataArr[i].STATIONNO)
                    $('#taskText').val(dataArr[i].TASKNO)
                    $('#fromText').val(dataArr[i].FROMSTATION)
                    $('#toText').val(dataArr[i].TOSTATION)
                    $('#goodsText').val(dataArr[i].GOODTYPE)
                    $('#barcodeText').val(dataArr[i].BARCODE)
                });
            }                    
        });
        //点击取消，关闭弹窗
        $('#cancelText').on('click', function () {
            $('#tc').hide();
        });
        //点击确认，获取输入值
        $('#okText').on('click', function () {                        
            var group = [];
            station = $('#stationText').val();
            task = $('#taskText').val();
            from = $('#fromText').val();
            to = $('#toText').val();
            goods = $('#goodsText').val();
            barcode = $('#barcodeText').val();
            group.push({ 'station': station, 'task': task, 'from': from, 'to': to, 'goods': goods, 'barcode': barcode })
            console.log(group)
            ws.send(JSON.stringify(group));
            $('#tc').hide();
        });
    }
}                  
};
   

// when the connection is established, this method is called
ws.onopen = function () {
    inc.innerHTML += '.. connection open<br/>';
    ws.send(1);
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




