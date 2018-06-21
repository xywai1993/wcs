
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
        //console.log(data_.data + " 1");
        inc.innerHTML += evt.data + '<br/>';
        ////画图的写法
        var jsonObj = eval(data_.data)
        console.log(jsonObj)
        var jsonStr1 = JSON.stringify(jsonObj)
        console.log(jsonStr1 + "jsonStr1")
        var jsonArr = [];
        for (var i = 0 ; i < jsonObj.length; i++) {
            jsonArr[i] = jsonObj[i];
        }
        console.log(typeof (jsonArr))
        console.log(jsonObj);
        var data = jsonArr;
        console.log(data.length);
        if (data.length >= 3)
        {
            for (var i = 0; i < data.length; i++) {
                ctx.fillStyle = 'green';
                ctx.fillRect(data[i].x, data[i].y, Number(data[i].width) * 30, Number(data[i].height) * 30);
                ctx.fillStyle = '#ffffff';
                ctx.fillText(data[i].station, Number(data[i].x), Number(data[i].y) + 10);
            }
            ctx.fillStyle = 'green';
            console.log('1111555');
        }
        else
        {
            ctx.fillRect(50, 50, 1 * 30, 1 * 30);
            ctx.fillStyle = 'red';
      
            console.log('我是变色2');
        }     
        ////画图的写法
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

    const canvas = document.querySelector('canvas');
    const ctx = document.querySelector('canvas').getContext('2d');
    
    //var json = JSON.parse(data_);
    //console.log(data_.data + " 1");
    //var data = JSON.parse(data_);
    //console.log(data);
    //var data = JSON.parse(data_.data);
    //const data = data_.data;
    //const data = [                    
    //    { station: '1001', x: '50', y: '50', width: 1, height: 1 },
    //    { station: '1002', x: '50', y: '80', width: 1, height: 1 },
    //    { station: '1003', x: '50', y: '110', width: 1, height: 1 },
    //    { station: '1004', x: '50', y: '140', width: 1, height: 1 },
    //    { station: '1005', x: '50', y: '170', width: 1, height: 2 },
    //    { station: '1006', x: '80', y: '200', width: 1, height: 1 },
    //    { station: '1007', x: '110', y: '200', width: 1, height: 1 }
    //];
    //setInterval(function () { console.log(data_); }, 3000);
    //ctx.fillStyle = 'green';

    //for (var i = 0; i < data.length; i++) {
    //    ctx.fillStyle = 'green';
    //    ctx.fillRect(data[i].x, data[i].y, Number(data[i].width) * 30, Number(data[i].height) * 30);
    //    ctx.fillStyle = '#ffffff';
    //    ctx.fillText(data[i].station, Number(data[i].x), Number(data[i].y) + 10);
    //}


    //var str = '{"name":"小明","age":18}';
    //var str = '{"station":"1001","x":"10","y":"11","width":"1","height":"2"}';
    //var json = JSON.parse(str);    //字符串到json对像
    //var jsonObj = JSON.parse(str);  //字符串转json对象  
    //var jsonStr1 = JSON.stringify(jsonObj);//json对象转字符串
    //var jsonStr = '[{"id":"01","open":false,"pId":"0","name":"A部门"},{"id":"01","open":false,"pId":"0","name":"A部门"},{"id":"011","open":false,"pId":"01","name":"A部门"},{"id":"03","open":false,"pId":"0","name":"A部门"},{"id":"04","open":false,"pId":"0","name":"A部门"}, {"id":"05","open":false,"pId":"0","name":"A部门"}, {"id":"06","open":false,"pId":"0","name":"A部门"}]';
    //  var jsonObj = $.parseJSON(jsonStr);

    //var jsonObj = JSON.parse(jsonStr)
    //console.log(jsonObj)
    //var jsonStr1 = JSON.stringify(jsonObj)
    //console.log(jsonStr1 + "jsonStr1")
    //var jsonArr = [];
    //for (var i = 0 ; i < jsonObj.length; i++) {
    //    jsonArr[i] = jsonObj[i];
    //}
    //console.log(typeof (jsonArr))
    //console.log(jsonObj);



    canvas.addEventListener('click', function (event) {
        if (event.region) {
            alert('hit region: ' + event.region);
        }
    });

//}



