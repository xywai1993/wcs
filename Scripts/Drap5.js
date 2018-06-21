var ws = '';//WebSocket对象
var userName = '测试同学' + parseInt(Math.random(1) * 888);//用户名
//初始化连接
function connect() {
    var address = "ws://127.0.0.1:10086";//服务端地址
    ws = new WebSocket(address);//实例化WebSocket对象
    //开始连接时
    ws.onopen = function (e) {
        ws.send('[login]{"userid":"' + userName + '"}');
    };
    //收到信息时
    ws.onmessage = function (e) {
        var Json = eval('(' + e.data + ')');
        switch (Json.type) {
            case '1':
                //新用户连接时
                break;
            case '2':
                var Html = '';
                Html += '<p>';
                Html += Json.user + ':' + Json.msg;
                Html += '</p>';
                $('#msgBox').append(Html);
                break;
        }
    };
    //发生错误时
    ws.onerror = function (e) {

    };
    //连接关闭时
    ws.onclose = function (e) {
        $('#msgBox').append('<p>与聊天室的连接已断开。</p>');
    };
}

//公聊发送
function send() {
    var SendText = $('#send').val();
    ws.send('[send]{"msg":"' + SendText + '","user":"' + userName + '"}');
}