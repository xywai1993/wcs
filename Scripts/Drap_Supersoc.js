$(document).ready(function () {
    var canvas = document.getElementById('canvas');
    var stage = new JTopo.Stage(canvas);
    showJTopoToobar(stage);//显示工具栏
    stage.eagleEye.visible = true;
    var scene = new JTopo.Scene(stage);

    $(function () {
        var width_Pscreen = $(window).width();       //获取父级窗口的宽度
        var heigth_Pscreen = $(window).height();
        console.log("1父级屏幕高度：" + heigth_Pscreen + ",1父级屏幕宽度：" + width_Pscreen);
        $('#canvas').attr("width", $(window).get(0).innerWidth);
        $('#canvas').attr("height", $(window).get(0).innerHeight);
        $('.jtopo_toolbar').css({ 'width': $(window).get(0).innerWidth });
    });

    var ws = '';
    var userName = parseInt(Math.random(1) * 888);
    var stationNo;
    connect();
    var checkFlag = 1;

    var time = new Date();
    var systemtime = time.getFullYear() + time.getMonth(); //+ time.getDay()+ time.getHours() + time.getMinutes() + time.getSeconds();
    console.log("时间：" + systemtime)

    function connect() {
        console.log("开始连接！")
        var address = "ws://127.0.0.1:9201";    //服务端地址
        ws = new WebSocket(address);            //实例化WebSocket对象     
        ws.onopen = function (e) {
            checkUser("Login", userName);
        };
        var sumNum = 0;
        var oldArr = [];//全局变量数组

        ws.onmessage = function (e) {
            console.log("连接成功！")
            console.log("我是原始数据:" + e.data);
            var json = e.data;//JSON.parse(e.data)  从模拟服务端来的数据只需要直接赋值
            var dataArr = eval(json.Data);

            if (json.Sender == "WCS") {
                if (json.MesssageType == "Init") {
                    // console.log("进入方报文：" + obj)
                    // var dataArr = obj.Data;
                    //console.log("我是进入方法和的数组:"+dataArr);
                    //stage.mode = "select";  //可以框选多个节点、可以点击单个节点

                    $.each(dataArr, function (i) {
                        //绘制输送机
                        if (dataArr[i].DeviceType == "Convery") {
                            var cc = dataArr[i].DeviceID;
                            var nodeFrom;

                            var scene = stage.childs[0];
                            var nodes = scene.childs.filter(function (e) {
                                return e instanceof JTopo.Node;
                            });
                            nodes = nodes.filter(function (e) {
                                if (e.text == null) return false;
                                return e.text.indexOf(cc) != -1;
                            });

                            if (nodes.length > 0) {
                                var node = nodes[0];
                                console.log("你是打印node信息:" + node);
                                //存在就更新1.任务号大于1000，读取原来的颜色进行比较更新                           
                                if (dataArr[i].Tags.TaskNum >= 1000) {
                                    if (dataArr[i].DeviceID == dataArr[i].Tags.ToStation)
                                    { var stationType = "是"; }
                                    else
                                    { var stationType = "否"; }
                                    var old_myType = node.myType;
                                    console.log("是否申请：" + stationType + "，当前站台号：" + dataArr[i].DeviceID + ",目标：" + dataArr[i].Tags.ToStation + ",原来的颜色：" + old_myType);
                                    if (stationType == "是") {
                                        node.setImage(0);
                                        node.fillColor = "251,143,27";
                                        console.log("变红色")
                                    }
                                    else if (stationType == "否") {
                                        node.setImage(0);
                                        node.fillColor = "48,187,35";
                                        console.log("变绿色")
                                    }
                                    else {
                                        node.setImage(0);
                                        node.myType = "black";
                                        console.log("否则清颜色")
                                    }
                                    node.setSize(50, 50);
                                }
                                else {
                                    node.setImage(0);
                                    node.setSize(50, 50);
                                    node.myType = "black";
                                    console.log("一键清除")
                                    if (dataArr[i].Direction == 'T') {
                                        if (dataArr[i].Width == '1') {
                                            node.setImage('../Content/img/guntongHs.png');
                                            node.setSize(50, 50);

                                        }
                                        else {
                                            node.setImage('../Content/img/bigH.png');
                                            node.setSize(100, 50);
                                        }
                                    }
                                    else {
                                        if (dataArr[i].Width == '2') {
                                            node.setImage('../Content/img/bigS.png');
                                            node.setSize(100, 50);
                                        }
                                        else {
                                            node.setImage('../Content/img/guntongSs.png');
                                            node.setSize(50, 50);
                                        }
                                    }
                                    //node.setImage('../Content/img/guntongHs.png');
                                    node.shadow = true;
                                }
                            }
                            else {

                                checkFlag = i + 1;
                                nodeFrom = new JTopo.Node(cc);
                                //新增的属性值
                                nodeFrom.myType = "black";
                                nodeFrom.serializedProperties.push("myType");

                                if (dataArr[i].Tags.TaskNum >= 1000) {
                                    if (dataArr[i].DeviceID == dataArr[i].Tags.ToStation) {
                                        nodeFrom.fillColor = "251,143,27";
                                        nodeFrom.myType = "yellow";
                                    }
                                    else {
                                        nodeFrom.fillColor = "48,187,35";
                                        nodeFrom.myType = "green";
                                    }
                                    nodeFrom.setSize(50, 50);
                                    nodeFrom.shadow = false;
                                }
                                else {
                                    nodeFrom.myType = "picture";
                                    nodeFrom.shadow = true;
                                    if (dataArr[i].Direction == 'T') {
                                        if (dataArr[i].Width == '1') {
                                            nodeFrom.setImage('../Content/img/guntongHs.png');
                                            nodeFrom.setSize(50, 50);

                                        }
                                        else {
                                            nodeFrom.setImage('../Content/img/bigH.png');
                                            nodeFrom.setSize(100, 50);
                                        }
                                    }
                                    else {
                                        if (dataArr[i].Width == '2') {
                                            nodeFrom.setImage('../Content/img/bigS.png');
                                            nodeFrom.setSize(100, 50);
                                        }
                                        else {
                                            nodeFrom.setImage('../Content/img/guntongSs.png');
                                            nodeFrom.setSize(50, 50);
                                        }
                                    }
                                }

                                nodeFrom.dragable = 0;
                                nodeFrom.fontColor = "255,255,0";         //字体颜色
                                //节点高度宽度
                                nodeFrom.textPosition = 'Middle_Center';  //文字显示位置为中间 Bottom_Center是显示再下方
                                var objX = dataArr[i].Coordinate_X;
                                nodeFrom.setLocation(parseInt(objX), parseInt(dataArr[i].Coordinate_Y));

                                if (cc == "2001") {
                                    nodeFrom.alarm = '数据库异常，喀拉拉拉拉拉拉发发发发发hhhfnnfgf，是的';     //添加节点的报警信息
                                }
                                nodeFrom.alarmColor = '255,0,0';
                                nodeFrom.alarmAlpha = 0.9;
                                scene.add(nodeFrom);


                                //鼠标事件监听
                                var currentNode = null;
                                function handler(event) {
                                    if (event.button == 2) {// 右键
                                        // 当前位置弹出菜单（div）
                                        $("#contextmenu").css({
                                            top: event.pageY,
                                            left: event.pageX
                                        }).show();
                                        stationNo = event.target.text;
                                        console.log("我是当前点击战天号:" + stationNo);
                                    }
                                }
                                nodeFrom.addEventListener('mouseup', function (event) {
                                    currentNode = this;
                                    handler(event);
                                });
                                stage.click(function (event) {
                                    if (event.button == 0) {// 右键
                                        // 关闭弹出菜单（div）
                                        $("#contextmenu").hide();

                                    }
                                });
                                /* 右键菜单处理 */
                                $("#contextmenu a").click(function () {
                                    var text = $(this).text();
                                    if (text == '修改信息') {
                                        $("#UpdateInfo").css({
                                            top: event.pageY - 200,
                                            left: event.pageX + 50
                                        }).show();
                                        $.each(dataArr, function (i) {
                                            if (stationNo == dataArr[i].DeviceID) {
                                                $('#sta_station').val(stationNo);
                                                $('#sta_taskno').val(dataArr[i].Tags.TaskNum);
                                                $('#sta_goodtype').val(dataArr[i].Tags.GoodsType);
                                                $('#sta_barcode').val(dataArr[i].Tags.TrayCode);
                                                $('#sta_from').val(dataArr[i].Tags.FromStation);
                                                $('#sta_to').val(dataArr[i].Tags.ToStation);
                                            }
                                        });
                                        //var data = dataArr.filter(function (ele,index,array) {                                           
                                        //    if (ele.length > 2) { return true; }
                                        //    else { return false; }
                                        //});
                                        //var data1 = dataArr.filter(function (arr) {
                                        //    if (arr.DeviceCode == "2001") {
                                        //        return arr;
                                        //        console.log("我是打印过滤器内容:" + arr.DeviceCode);
                                        //    }
                                        //    else
                                        //    {
                                        //        return dataArr;
                                        //    }
                                        //});                                       
                                        console.log("我是过滤器:" + data1);
                                    }
                                    if (text == '一键清除') {
                                        $("#UpdateInfo").css({
                                            top: event.pageY,
                                            left: event.pageX
                                        }).show();
                                        $('#sta_station').val(stationNo);
                                        $('#sta_taskno').val(0);
                                        $('#sta_from').val(0);
                                        $('#sta_to').val(0);
                                        $('#sta_goodtype').val(0);
                                        $('#sta_barcode').val(0);
                                        console.log("我是清除信息:" + stationNo);
                                    }
                                    else if (text == '一键申请') {
                                        $("#UpdateInfo").css({
                                            top: event.pageY,
                                            left: event.pageX
                                        }).show();
                                        $.each(dataArr, function (i) {
                                            if (stationNo == dataArr[i].DeviceID) {
                                                $('#sta_station').val(stationNo);
                                                $('#sta_taskno').val(1000);
                                                $('#sta_goodtype').val(dataArr[i].Tags.GoodsType);
                                                $('#sta_barcode').val(dataArr[i].Tags.TrayCode);
                                                $('#sta_from').val(dataArr[i].Tags.FromStation);
                                                $('#sta_to').val(stationNo);
                                            }
                                        });
                                    }
                                    else if (text == '正常排出') {
                                        console.log("我是创建div:");
                                        var Odiv = document.createElement("div");
                                        var Ospan = document.createElement("span");
                                        Odiv.style.cssText = "width:200px;height:200px;background:#636363;";
                                        Odiv.appendChild(Ospan);
                                    }
                                    else if (text == '异常排出') {
                                        currentNode.scaleX += 0.2;
                                        currentNode.scaleY += 0.2;
                                    }
                                    $("#contextmenu").hide();
                                    stage.click(function (event) {
                                        if (event.button == 0) {// 右键
                                            // 关闭弹出菜单（div）
                                            $("#equipmentinfo").hide();
                                            $("#logindiv").hide();
                                            $("#UpdateInfo").hide();
                                        }
                                    });
                                });
                            }
                        }
                            //收到堆垛机数据
                        else if (dataArr[i].DeviceType == "SRM") {
                            console.log("我是sc报文" + dataArr[i].DeviceType);
                            var scene = stage.childs[0];
                            var cc = dataArr[i].DeviceID;
                            stage.frames = 24;  //设置当前舞台播放的帧数/秒
                            var animates = [
                                { x: 500 },
                            ]
                            for (var i = 0; i < animates.length; i++) {
                                var node = new JTopo.Node("SC02");
                                node.setSize(80, 80);
                                node.setCenterLocation(400 + i * 90, 305);
                                var color = JTopo.util.randomColor();
                                node.setImage('../Content/img/sc.png');
                                scene.add(node);
                            }

                            var animates = [
                                { x: 0 },
                            ]
                            for (var i = 0; i < animates.length; i++) {
                                var node = new JTopo.Node("SC03");
                                node.setSize(80, 80);
                                node.setCenterLocation(1250 + i * 90, 305);
                                var color = JTopo.util.randomColor();
                                node.setImage('../Content/img/sc.png');
                                scene.add(node);
                            }

                            function myNode(text, x, y) {
                                var nodeSC = new JTopo.Node(text);
                                nodeSC.fontColor = "0, 0, 0";
                                var color = "255,240,245";
                                nodeSC.fillColor = color;
                                nodeSC.setSize(30, 30);
                                nodeSC.textPosition = 'Middle_Center';  //文字显示位置为中间 Bottom_Center是显示再下方                                    
                                nodeSC.setLocation(parseInt(x), parseInt(y));
                                scene.add(nodeSC);
                            }
                            var a = 0;
                            for (var i = 1; i <= 7; i++) {
                                var x = 330; var y = 230;
                                a = x + 30 * (i - 1);
                                myNode('' + i, a, y);
                            }
                            var b = 0;
                            for (var i = 1; i <= 7; i++) {
                                var x = 330; var y = 355;
                                b = x + 30 * (i - 1);
                                myNode('' + i, b, y);
                            }
                            var h = 0;
                            for (var i = 1; i <= 20; i++) {
                                var x = 850; var y = 230;
                                h = x + 30 * (i - 1);
                                myNode('' + i, h, y);
                            }
                            var g = 0;
                            for (var i = 1; i <= 20; i++) {
                                var x = 850; var y = 350;
                                g = x + 30 * (i - 1);
                                myNode('' + i, g, y);
                            }
                            //绘制机械手

                            //测试过滤器的用法
                            //var data1 = dataArr.filter(function (arr) {
                            //    if (arr.DeviceCode == "SC01") { return arr; }
                            //    else { return dataArr; }
                            //});
                            //console.log("我是修改信息:" + stationNo);
                            //console.log("我是过滤器:" + arr);

                        }
                        else if (dataArr[i].DeviceType == "PutRobot") {
                            console.log("我是机械手");
                            var scene = stage.childs[0];
                            var nodeRobot = new JTopo.Node("RB01");
                            nodeRobot.setSize(80, 80);
                            nodeRobot.setLocation(30, 300);
                            nodeRobot.setImage('../Content/img/robot.png');
                            scene.add(nodeRobot);

                            var nodeRobot = new JTopo.Node("RB02");
                            nodeRobot.setSize(80, 80);
                            nodeRobot.setLocation(1850, 280);
                            nodeRobot.setImage('../Content/img/robot.png');
                            scene.add(nodeRobot);
                        }
                    });
                    scene.setBackground('../Content/img/bg.jpg');

                    //鼠标在画布右键：隐藏弹出框
                    stage.click(function (event) {
                        if (event.button == 0) {// 右键
                            // 关闭弹出菜单（div）
                            $("#equipmentinfo").hide();
                        }
                    });

                    //用户权限验证
                    $('#login_okText').on('click', function () {
                        var group = [];
                        messagetype = "checkUser";
                        loginName = $('#loginName').val();
                        passWord = $('#passWord').val();
                        group.push({ 'messagetype': messagetype, 'userid': loginName, 'password': passWord });
                        console.log(group)
                        ws.send(JSON.stringify(group));

                    });
                }

                else if (json.messagetype == "checkMesg") {    //用户权限验证反馈
                    console.log("我是数据" + json.message);
                    if (json.message == 1) {
                        console.log("我是用户验证成功");
                        $("#tcMsg").text("用户权限验证成功");
                        checkFlag = true;
                        console.log("我是成功标识" + checkFlag);
                    }
                    else if (json.message == 999) {
                        console.log("我是用户验证失败");
                        $("#tcMsg").text("用户权限验证失败！请重新输入");
                    }
                }
                else if (json.MesssageType == "Response") {    //服务端信息反馈
                    console.log("我是进入回复");
                    console.log("22:" + dataArr.Code);
                    if (dataArr.Code == "666") {
                        console.log("我是进入循环");
                        $("#tcMsg").text(dataArr.Msg);
                    }
                    else { $("#tcMsg").text(dataArr.Msg); }

                }
                else if (json.MesssageType == "serverMonitor")  //服务端数据监控
                {

                }
                else if (json.MesssageType == "sc")  //服务端数据监控
                {

                }

            }
            //最大的循环  
            scene.dbclick(function (event) {
                if (event.target == null) return;
                var e = event.target;
                if (e.text == "SC01" || e.text == "SC02" || e.text == "SC03") {
                    console.log("我是鼠标双击效果堆垛机：" + e.text);
                    console.log("打印进入堆垛机的报文：" + dataArr);
                    $("#equipmentinfo").css({
                        top: event.pageY - 100,
                        left: event.pageX + 100
                    }).show();
                    $("#span0").text("设备号：" + "123");
                    $("#span1").text("设备状态：" + "123");
                    $("#span2").text("报警代码：" + "123");
                    $("#span3").text("堆垛机模式：" + "123");
                    $("#span4").text("手自动：" + "123");
                    $("#span5").text("工位1任务号：" + "123");
                }
                else if (e.text == "RB01" || e.text == "RB02") {
                    console.log("我是鼠标双击效果堆垛机：" + e.text);
                    console.log("打印进入堆垛机的报文：" + dataArr);
                    $("#equipmentinfo").css({
                        top: event.pageY - 100,
                        left: event.pageX + 100
                    }).show();
                    $("#span0").text("设备号：" + "234");
                    $("#span1").text("设备状态：" + "678");
                    $("#span2").text("报警代码：" + "789");
                    $("#span3").text("堆垛机模式：" + "456");
                    $("#span4").text("手自动：" + "111");
                    $("#span5").text("工位1任务号：" + "4567");
                }
                else {
                    $("#equipmentinfo").css({
                        top: event.pageY - 100,
                        left: event.pageX + 50
                    }).show();

                    $.each(dataArr, function (i) {
                        if (e.text == dataArr[i].DeviceID) {
                            $("#span0").text("站台号：" + dataArr[i].DeviceID);
                            $("#span1").text("任务号：" + dataArr[i].Tags.TaskNum);
                            $("#span4").text("起始地址：" + dataArr[i].Tags.FromStation);
                            $("#span5").text("目标地址：" + dataArr[i].Tags.ToStation);
                            $("#span3").text("托盘条码：" + dataArr[i].Tags.TrayCode);
                            $("#span2").text("货物类型：" + dataArr[i].Tags.GoodsType);
                        }
                    });
                }
            });
        }
    }





    //初次连接服务端发送报文
    function checkUser(mestype, userName) {
        var login = [];
        userid = "gw";
        passwrd = "12345";
        messagetype = mestype;
        var time = new Date();
        var systemtime = time.getFullYear() + time.getMonth(); //+ time.getDay() + time.getHours() + time.getMinutes() + time.getSeconds();
        login.push({ 'MessageID': "123", 'Sender': 'test', 'Receivcer': 'server1', 'ZoneCode': 'gw', 'UserID': userid, 'PassWord': passwrd, 'MesssageType': messagetype, 'Data': "8888" })
        //console.log(login);
        console.log("我是写入站台信息报文：" + JSON.stringify(login));
        ws.send(JSON.stringify(login));
    }

    //绘画节点
    function drapNode(dataArr) {
        $.each(dataArr, function (i) {
            var nodeName = dataArr[i].STATION;
            var nodeX = dataArr[i].X;
            var nodeY = dataArr[i].Y;
            console.log("收到drap！" + nodeName + "，X:" + nodeX + "，Y:" + nodeY);
            drapNodeDetail(nodeName, 200, 300);
        });
    }

    function drapNodeDetail(nodeName, nodeX, nodeY) {
        var nodeTo = new JTopo.Node(nodeName);
        nodeTo.setLocation(nodeX, nodeY);
        scene.add(nodeTo);
    }

    //按钮事件：点击确认写入服务端站台信息
    $('#write_okText').on('click', function () {
        //$('#logindiv').css("display", "block");
        var group = [];
        userid = "gw";
        passwrd = "12345";
        var messagetype = "WriteSTA";
        var stationno = $('#sta_station').val();
        var task = $('#sta_taskno').val();
        var from = $('#sta_from').val();
        var to = $('#sta_to').val();
        var goods = $('#sta_goodtype').val();
        var barcode = $('#sta_barcode').val();
        group.push({ 'DeviceCode': stationno, 'TaskNum': task, 'BarCode': barcode, 'TrayType': goods, 'FromStation': from, 'ToStation': to })
        console.log(group);
        var message = { 'MessageID': "123", 'Sender': 'test', 'Receivcer': 'server1', 'ZoneCode': 'gw', 'UserID': userid, 'PassWord': passwrd, 'MesssageType': messagetype, 'Data': group };
        console.log(message);
        ws.send(JSON.stringify(message));
    });
    //按钮事件：点击取消按钮内容清0
    $('#write_cancelText').on('click', function () {
        $("#UpdateInfo").hide();
        $('#sta_station').val(0);
        $('#sta_taskno').val(0);
        $('#sta_to').val(0);
        $('#sta_goodtype').val(0);
        $('#sta_barcode').val(0);
    });

    //给后台写站台信息
    function writeInfo(mestype, userName) {
        var login = [];
        messagetype = mestype;
        userid = userName;
        passwrd = "12345";
        var time = new Date();
        var systemtime = time.getFullYear() + time.getMonth(); //+ time.getDay() + time.getHours() + time.getMinutes() + time.getSeconds();
        login.push({ 'MessageID': "123", 'Sender': 'client', 'Receivcer': 'server', 'ZoneCode': 'gw', 'UserID': userid, 'PassWord': passwrd, 'MesssageType': messagetype, 'Data': "8888" })
        console.log(login);
        console.log(JSON.stringify(login));
        ws.send(JSON.stringify(login));

    }


    function getEquipmentInfo(equipmenttype, taskno) {
        console.log(taskno);
        $("#span0").text(taskno);
    }

});


//红色：237,19,12
//绿色：48,187,35   浅绿：45,168,131
//橘黄色：251,143,27
//255,240,245 仓紫色
