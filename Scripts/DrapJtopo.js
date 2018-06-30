const BACEIMGURL = '../../Content/img/';
const SERVERURL = 'ws://192.16.9.3:9201';
const wsMessageCallback = {};
/**
 * 绘制输送机
 * @param {Object} item 绘制数据包
 * @param {Number} i   当前数量
 * @param {Object} stage 绘制舞台
 */
const crawConvery = function(item, i, stage) {
    var cc = item.DeviceID;
    var nodeFrom;

    var scene = stage.childs[0];
    var nodes = scene.childs.filter(function(e) {
        return e instanceof JTopo.Node;
    });
    nodes = nodes.filter(function(e) {
        if (e.text == null) return false;
        return e.text.indexOf(cc) != -1;
    });

    if (nodes.length > 0) {
        var node = nodes[0];
        //存在就更新1.任务号大于1000，读取原来的颜色进行比较更新
        if (item.Tags.TaskNum >= 1000) {
            if (item.DeviceID == item.Tags.ToStation) {
                var stationType = '是';
            } else {
                var stationType = '否';
            }
            var old_myType = node.myType;

            if (stationType == '是') {
                node.setImage(0);
                node.fillColor = '251,143,27';
                console.log('变红色');
            } else if (stationType == '否') {
                node.setImage(0);
                node.fillColor = '48,187,35';
                console.log('变绿色');
            } else {
                node.setImage(0);
                node.myType = 'black';
                console.log('否则清颜色');
            }
            node.setSize(50, 50);
        } else {
            node.setImage(0);
            node.setSize(50, 50);
            node.myType = 'black';
            if (item.Direction == 'T') {
                if (item.Width == '1') {
                    node.setImage(BACEIMGURL + 'guntongHs.png');
                    node.setSize(50, 50);
                } else {
                    node.setImage(BACEIMGURL + 'bigH.png');
                    node.setSize(100, 50);
                }
            } else {
                if (item.Width == '2') {
                    node.setImage(BACEIMGURL + 'bigS.png');
                    node.setSize(100, 50);
                } else {
                    node.setImage(BACEIMGURL + 'guntongSs.png');
                    node.setSize(50, 50);
                }
            }
            //node.setImage(' ../../Contnt/img/guntongHs.png');
            node.shadow = true;
        }

        if (item.Tags.TotalError == true) {
            node.alarm = '设备报警，请及时处理！'; //添加节点的报警信息
            var ErrorType = '是';
        } else {
            node.alarm = '';
        }
    } else {
        checkFlag = i + 1;
        nodeFrom = new JTopo.Node(cc);
        //新增的属性值
        nodeFrom.myType = 'black';
        nodeFrom.serializedProperties.push('myType');

        if (item.Tags.TaskNum >= 1000) {
            if (item.DeviceID == item.Tags.ToStation) {
                nodeFrom.fillColor = '251,143,27';
                nodeFrom.myType = 'yellow';
            } else {
                nodeFrom.fillColor = '48,187,35';
                nodeFrom.myType = 'green';
            }
            nodeFrom.setSize(50, 50);
            nodeFrom.shadow = false;
        } else {
            nodeFrom.myType = 'picture';
            nodeFrom.shadow = true;
            if (item.Direction == 'T') {
                if (item.Width == '1') {
                    nodeFrom.setImage(BACEIMGURL + 'guntongHs.png');
                    nodeFrom.setSize(50, 50);
                } else {
                    nodeFrom.setImage(BACEIMGURL + 'bigH.png');
                    nodeFrom.setSize(100, 50);
                }
            } else {
                if (item.Width == '2') {
                    nodeFrom.setImage(BACEIMGURL + 'bigS.png');
                    nodeFrom.setSize(100, 50);
                } else {
                    nodeFrom.setImage(BACEIMGURL + 'guntongSs.png');
                    nodeFrom.setSize(50, 50);
                }
            }
        }

        nodeFrom.dragable = 0;
        nodeFrom.fontColor = '255,255,0'; //字体颜色
        //节点高度宽度
        nodeFrom.textPosition = 'Middle_Center'; //文字显示位置为中间 Bottom_Center是显示再下方
        var objX = item.Coordinate_X;
        nodeFrom.setLocation(parseInt(objX), parseInt(item.Coordinate_Y));

        console.log('我是报警：' + item.Tags.TotalError);
        if (item.Tags.TotalError == true) {
            nodeFrom.alarm = '设备报警，请及时处理！'; //添加节点的报警信息
        }
        nodeFrom.alarmColor = '255,0,0';
        nodeFrom.alarmAlpha = 0.9;
        scene.add(nodeFrom);

        //鼠标事件监听
        var currentNode = null;
        function handler(event) {
            if (event.button == 2) {
                // 右键
                // 当前位置弹出菜单（div）
                stationNo = event.target.text;
                console.log('我是当前点击站台号:' + stationNo);
            }
        }
        nodeFrom.addEventListener('mouseup', function(event) {
            currentNode = this;
            handler(event);
        });
    }
};

/**
 * 绘制堆剁机
 * @param {Object} item 绘制数据包
 * @param {Number} i   当前数量
 * @param {Object} stage 绘制舞台
 */
const crawSRM = function(item, i, stage) {
    console.log('我是sc报文' + item.DeviceType);
    var scene = stage.childs[0];
    var cc = item.DeviceID;
    stage.frames = 24; //设置当前舞台播放的帧数/秒
    var animates = [{ x: 500 }];
    for (let i = 0; i < animates.length; i++) {
        var node = new JTopo.Node('SC02');
        node.setSize(80, 80);
        node.setCenterLocation(400 + i * 90, 305);
        var color = JTopo.util.randomColor();
        node.setImage(BACEIMGURL + 'sc.png');
        scene.add(node);
    }

    var animates = [{ x: 0 }];
    for (let i = 0; i < animates.length; i++) {
        var node = new JTopo.Node('SC03');
        node.setSize(80, 80);
        node.setCenterLocation(1250 + i * 90, 305);
        var color = JTopo.util.randomColor();
        node.setImage(BACEIMGURL + 'sc.png');
        scene.add(node);
    }

    function myNode(text, x, y) {
        var nodeSC = new JTopo.Node(text);
        nodeSC.fontColor = '0, 0, 0';
        var color = '255,240,245';
        nodeSC.fillColor = color;
        nodeSC.setSize(30, 30);
        nodeSC.textPosition = 'Middle_Center'; //文字显示位置为中间 Bottom_Center是显示再下方
        nodeSC.setLocation(parseInt(x), parseInt(y));
        scene.add(nodeSC);
    }
    var a = 0;
    for (let i = 1; i <= 7; i++) {
        var x = 330;
        var y = 230;
        a = x + 30 * (i - 1);
        myNode('' + i, a, y);
    }
    var b = 0;
    for (let i = 1; i <= 7; i++) {
        var x = 330;
        var y = 355;
        b = x + 30 * (i - 1);
        myNode('' + i, b, y);
    }
    var h = 0;
    for (let i = 1; i <= 20; i++) {
        var x = 850;
        var y = 230;
        h = x + 30 * (i - 1);
        myNode('' + i, h, y);
    }
    var g = 0;
    for (let i = 1; i <= 20; i++) {
        var x = 850;
        var y = 350;
        g = x + 30 * (i - 1);
        myNode('' + i, g, y);
    }
};

/**
 * 绘制机械手
 * @param {Object} item 绘制数据包
 * @param {Number} i   当前数量
 * @param {Object} stage 绘制舞台
 */
const crawPutRobot = function(item) {
    console.log('我是机械手');
    var scene = stage.childs[0];
    var nodeRobot = new JTopo.Node('RB01');
    nodeRobot.setSize(80, 80);
    nodeRobot.setLocation(30, 300);
    nodeRobot.setImage(BACEIMGURL + 'robot.png');
    scene.add(nodeRobot);

    var nodeRobot = new JTopo.Node('RB02');
    nodeRobot.setSize(80, 80);
    nodeRobot.setLocation(1850, 280);
    nodeRobot.setImage(BACEIMGURL + 'robot.png');
    scene.add(nodeRobot);
};

/**
 *
 * @param {String} type  站台类型  STA/SRM
 */
const createPublicButton = function(stationData, config = STATIONBASEDATA) {
    const data = config[stationData.deviceType].actionButton;

    //Object.keys().filter(item)
    const list = [];

    //查找公共按钮
    Object.keys(data).forEach(item => {
        if (data[item].isPublic == 1) {
            list.push(item);
        }
    });
    return list;
};

/**
 *
 * @param {Object} stationData 站台信息
 * @param {Object} config 配置项
 */
const createStationButton = function(stationData) {
    return Object.keys(stationData.buttonData);
};

/**
 * ws写入请求
 * @param {WS} ws ws实例
 * @param {Object} data 写入数据
 * @param {Function} fn  回调函数
 */
const wsDoRequest = function(ws, data, fn = Null) {
    var group = data;
    const MessageID = scadaUntil.createTimeStamp();
    var message = {
        MessageID: MessageID,
        Sender: 'test',
        Receivcer: 'server1',
        ZoneCode: 'gw',
        UserID: userid,
        PassWord: passwrd,
        MesssageType: messagetype,
        Data: group
    };
    console.log('写入数据', message);
    if (fn) {
        wsMessageCallback[MessageID] = fn;
    }

    ws.send(JSON.stringify(message));
};

/**
 * 入口函数
 */
const init = function() {
    //创建舞台
    var canvas = document.getElementById('canvas');
    const stage = new JTopo.Stage(canvas);
    showJTopoToobar(stage, 'content'); //显示工具栏

    var scene = new JTopo.Scene(stage);
    stage.eagleEye.visible = true;
    //scene.setBackground(BACEIMGURL + 'bg.jpg');
    scene.alpha = 1;
    scene.backgroundColor = '49,90,119'; //49,90,119
    setCanvasWH(canvas);
    //stage.mode = "select";  //可以框选多个节点、可以点击单个节点

    let wsDataArr = [];
    let stationData = {}; // 单个站台信息
    // 舞台单击事件
    stage.click(function(event) {
        if (event.button == 0) {
            // 右键
            // 关闭弹出菜单（div）
            homeVue.showEquipmentinfo = false;
            $('#logindiv').hide();
            $('#UpdateInfo').hide();
        }
    });

    //托盘双击事件
    scene.dbclick(function(event) {
        if (event.target == null) return;
        var e = event.target;
        console.log(e);

        const DeviceID = e.text;
        // todo: 从后台获取对应的数据 ,现在写死 STATIONS['1028']
        stationData = STATIONS['1028'];
        homeVue.stationData = stationData;
        homeVue.publicButton = createPublicButton(stationData);
        homeVue.stationButton = createStationButton(stationData);

        homeVue.equipmentinfo = stationData.infoData;
        homeVue.copyEquipmentinfo = JSON.parse(JSON.stringify(stationData.infoData));
        homeVue.showEquipmentinfo = true;
        //homeVue.equipmentinfoXY = [event.pageX + 50, event.pageY - 100];
        homeVue.equipmentinfoXY = [10, 10];
    });

    $('#loginBox').on('click', function() {
        homeVue.showLoginDiv = true;
    });

    //连接服务端
    var userName = parseInt(Math.random(1) * 888);
    var stationNo;
    var checkFlag = 1;

    var time = new Date();
    var systemtime = time.getFullYear() + time.getMonth(); //+ time.getDay()+ time.getHours() + time.getMinutes() + time.getSeconds();

    const ws = new WebSocket(SERVERURL); //实例化WebSocket对象
    ws.onopen = function(e) {
        console.log('开始连接！');
        checkUser('Login', userName);
    };

    // 处理服务端返回的数据
    ws.onmessage = function(e) {
        console.log('连接成功！');
        console.log(new Date().getTime());

        const json = JSON.parse(e.data); //连接正式服务端时启用
        //var json = e.data;               //连接模拟服务端时启用
        console.log(json);
        const dataArr = json.Data;
        wsDataArr = dataArr;
        console.log(dataArr);

        if (wsMessageCallback[JSON.MessageID]) {
            wsMessageCallback[JSON.MessageID]();
            ws.send({
                MessageID: JSON.MessageID,
                MesssageType: 'stopPush'
            });
        }

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

    // 配置界面
    const settingConfig = scadaConfig(ws);
    const goodConfig = goodsWatch();
    //初次连接服务端发送报文
    function checkUser(mestype, userName) {
        var login = [];
        userid = 'gw';
        passwrd = '12345';
        messagetype = mestype;
        var time = new Date();
        var systemtime = time.getFullYear() + time.getMonth(); //+ time.getDay() + time.getHours() + time.getMinutes() + time.getSeconds();
        login.push({
            MessageID: '123',
            Sender: 'test',
            Receivcer: 'server1',
            ZoneCode: 'gw',
            UserID: userid,
            PassWord: passwrd,
            MesssageType: messagetype,
            Data: '8888'
        });
        //console.log(login);
        console.log('我是写入站台信息报文：' + JSON.stringify(login));
        ws.send(JSON.stringify(login));
    }

    //用户权限验证
    $('#login_okText').on('click', function() {
        var group = [];
        messagetype = 'checkUser';
        loginName = $('#loginName').val();
        passWord = $('#passWord').val();
        group.push({ messagetype: messagetype, userid: loginName, password: passWord });
        console.log(group);
        ws.send(JSON.stringify(group));
    });

    //给后台写站台信息
    function writeInfo(mestype, userName) {
        var login = [];
        messagetype = mestype;
        userid = userName;
        passwrd = '12345';
        var time = new Date();
        var systemtime = time.getFullYear() + time.getMonth(); //+ time.getDay() + time.getHours() + time.getMinutes() + time.getSeconds();
        login.push({
            MessageID: '123',
            Sender: 'client',
            Receivcer: 'server',
            ZoneCode: 'gw',
            UserID: userid,
            PassWord: passwrd,
            MesssageType: messagetype,
            Data: '8888'
        });
        console.log(login);
        console.log(JSON.stringify(login));
        ws.send(JSON.stringify(login));
    }

    //红色：237,19,12
    //绿色：48,187,35   浅绿：45,168,131
    //橘黄色：251,143,27
    //255,240,245 仓紫色

    // 界面交互数据入口
    const homeVue = new Vue({
        el: '#homeVue',
        data: {
            stationData: {},
            equipmentinfo: [],
            copyEquipmentinfo: [],
            showEquipmentinfo: false,
            equipmentinfoXY: [0, 0],

            publicButton: [],
            stationButton: [],

            GOODSTYPE: GOODSTYPE
        },
        methods: {
            changeEquipmentinfo() {},
            actionButton(type) {
                let wsData = {};
                let fn = null;
                switch (type) {
                    case 'updateInfo':
                        data = this.equipmentinfo;
                        fn = function(res) {
                            console.log(res);
                        };
                        break;
                    case 'delInfo':
                        data = this.equipmentinfo;
                        Object.keys(data).forEach(item => {
                            if (item == 'GoodsType') {
                                data[item] = 1;
                            } else {
                                data[item] = 0;
                            }
                        });

                        break;
                    case 'getInfo':
                        break;
                    case 'normalRemove':
                        let normalRemove = this.stationData.buttonData['normalRemove'];
                        Object.keys(normalRemove).forEach(item => {
                            this.equipmentinfo[item] = normalRemove[item];
                        });
                        data = this.equipmentinfo;
                        fn = function() {};
                        break;
                    case 'abnormalRemove':
                        let abnormalRemove = this.stationData.buttonData['abnormalRemove'];
                        Object.keys(abnormalRemove).forEach(item => {
                            this.equipmentinfo[item] = abnormalRemove[item];
                        });
                        data = this.equipmentinfo;
                        fn = function() {};
                        break;
                }
                wsDoRequest(ws, data, fn);
            }
        },
        filters: {
            button2zh(name) {
                if (stationData.deviceType) {
                    return STATIONBASEDATA[stationData.deviceType].actionButton[name].name;
                }
                //return name;
            },
            en2zh(name) {
                return EN2EH[name] ? EN2EH[name] : name;
            },
            other2zh(val, name) {
                let n = val;
                switch (name) {
                    case 'GoodsType':
                        n = GOODSTYPE[val].name;

                        break;
                }
                return n;
            }
        }
    });

    const commonVue = new Vue({
        el: '#commonVue',
        data: {
            showLoginDiv: false,
            password: '',
            username: ''
        },
        methods: {
            login: function() {
                var group = [];
                const messagetype = 'checkUser';

                group.push({ messagetype: messagetype, userid: this.username, password: this.password });

                ws.send(JSON.stringify(group));
            }
        }
    });
};

init();
//end

//测试过滤函数数组
var arrs = [
    { name: 'Tom', age: 18, sex: 'boy' },
    { name: 'jim', age: 19, sex: 'boy' },
    { name: 'anchor', age: 20, sex: 'boy' },
    { name: 'lucy', age: 18, sex: 'girl' },
    { name: 'lily', age: 19, sex: 'girl' }
];
//过滤条件
var limits = { name: 'Tom', age: 18, sex: 'boy' };
//filter回调函数
function dofilter(element, index, array) {
    if (limits.name && limits.name != element.name) {
        return false;
    } //姓名过滤
    else if (limits.age && limits.age != element.age) {
        return false;
    } //年龄过滤
    else if (limits.sex && limits.sex != element.sex) {
        return false;
    } //性别过滤
    return true;
}
var filtered = arrs.filter(dofilter);
