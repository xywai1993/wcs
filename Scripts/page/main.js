const SERVERURL = 'ws://192.16.9.2:9201';
const ws = new WebSocket(SERVERURL); //实例化WebSocket对象
ws.onopen = function(e) {
    console.log('开始连接！');
    checkUser('Login', userName);
};

// 处理服务端返回的数据
ws.onmessage = function(e) {
    console.log('连接成功！');

    const json = JSON.parse(e.data); //连接正式服务端时启用
    //var json = e.data;               //连接模拟服务端时启用
    const dataArr = json.Data;

    if (json.Sender == 'WCS') {
        switch (json.MesssageType) {
            case 'Init':
                dataArr.forEach((item, i) => {
                    switch (item.DeviceType) {
                        case 'Convery':
                            //绘制输送机
                            crawConvery(item, i, stage);
                            break;
                        case 'SRM':
                            //收到堆垛机数据
                            crawSRM(item, i, stage);
                            break;
                        case 'PutRobot':
                            //绘制机械手
                            crawPutRobot(item, i, stage);
                            break;
                        default:
                            console.log('未知的DeviceType');
                            break;
                    }
                });
                break;
            case 'checkMesg':
                //用户权限验证反馈
                console.log('我是数据' + json.message);
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
                console.log('我是进入回复');
                console.log('22:' + dataArr.Code);
                if (dataArr.Code == '666') {
                    console.log('我是进入循环');
                    $('#tcMsg').text(dataArr.Msg);
                } else {
                    $('#tcMsg').text(dataArr.Msg);
                }
                break;
            case 'serverMonitor':
                //服务端数据监控
                break;
            case 'sc':
                //服务端数据监控
                break;
            default:
                console.log('未知的MesssageType');
                break;
        }
    }
};
