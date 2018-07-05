const SERVERURL = 'ws://192.16.9.2:9202';
const ws = new WebSocket(SERVERURL); //实例化WebSocket对象
const wsMessageCallback = {};

let createDeviceFn = null;

/**
 * websocket 请求函数
 * @param {Object} obj  {messagetype:'',data:{}}
 * @param {function} fn 回调函数
 */
const wsRequest = function(obj, fn = null) {
    const MessageID = scadaUntil.createTimeStamp();
    if (fn) {
        wsMessageCallback[MessageID] = fn;
    }
    var message = {
        MessageID: MessageID,
        Sender: 'test',
        Receivcer: 'server1',
        ZoneCode: 'gw',
        MessageType: obj.messagetype,
        Data: obj.data || {}
    };
    console.log('请求type：' + obj.messagetype);
    console.log(message);
    try {
        ws.send(JSON.stringify([message]));
    } catch (error) {
        alert('服务器出错，请重试');
        console.log('WS错误');
    }
};

ws.onopen = function(e) {
    console.log('开始连接！');
    //checkUser('Login', userName);

    wsRequest(
        {
            messagetype: 'Login',
            data: {
                UserID: 'userid',
                PassWord: 'passwrd'
            }
        },
        function() {
            console.log('登陆请求回调运行成功');
        }
    );

    //设备监控
    createDeviceFn = deviceWatch(ws);
    // 配置界面
    scadaConfig(ws);
    //货架
    goodsWatch(ws);
};

// 处理服务端返回的数据
ws.onmessage = function(e) {
    const json = JSON.parse(e.data); //连接正式服务端时启用
    //var json = e.data;               //连接模拟服务端时启用
    const dataArr = json.Data;
    //console.log(dataArr);
    console.log('数据来了:', json);
    if (wsMessageCallback[json.MessageID]) {
        wsMessageCallback[json.MessageID](json);
        // ws.send({
        //     MessageID: json.MessageID,
        //     MesssageType: 'stopPush'
        // });
    }

    if (json.Sender == 'WCS') {
        switch (json.MessageType) {
            case 'Init':
                //为了兼容之前，把 Init 回调写在这了
                createDeviceFn(json.Data);
                break;
            case 'checkMesg':
                //用户权限验证反馈
                if (json.message == 1) {
                    console.log('我是用户验证成功');
                    $('#tcMsg').text('用户权限验证成功');
                    checkFlag = true;
                    console.log('我是成功标识' + checkFlag);
                } else if (json.message == 999) {
                    console.log('我是用户验证失败');
                    $('#tcMsg').text('用户权限验证失败！请重新输入');
                }
                break;
            case 'Response':
                //服务端信息反馈
                break;
            case 'serverMonitor':
                //服务端数据监控
                break;
            default:
                console.log('未知的MessageType:' + json.MessageType, json);
                break;
        }
    }
};

const commonVue = new Vue({
    el: '#commonVue',
    data: {
        showLoginDiv: false,
        showMenu: true,
        password: '',
        username: ''
    },
    methods: {
        login: function() {
            var group = [];
            const messagetype = 'checkUser';

            wsRequest({
                ws: ws,
                messagetype: 'checkUser',
                data: { userid: this.username, password: this.password }
            });
        }
    },
    watch: {
        showMenu(val) {
            if (!val) {
                $('#myTab').hide();
            } else {
                $('#myTab').show();
            }
        }
    }
});
