$(function () {

    var width_Pscreen = $(window).width();       //获取父级窗口的宽度
    var heigth_Pscreen = $(window).height();
    console.log("1父级屏幕高度：" + heigth_Pscreen + ",1父级屏幕宽度：" + width_Pscreen);
    $('#topdiv').css({ 'height': heigth_Pscreen * 0.7 + 'px', 'width': width_Pscreen + 'px' });
    //$('#drapdiv').css({ 'width': width_Pscreen - $('#heartdiv').width()-2 + 'px' });  //此语句用于初始化左侧有div时
    $('#drapdiv').css({ 'width': width_Pscreen + 'px' });
    $('#logtextdiv').css({ 'height': heigth_Pscreen - $('#topdiv').height() + 'px', 'width': width_Pscreen + 'px' });
});

var ws = '';
var userName = parseInt(Math.random(1) * 888);
var el = document.getElementById("textarea")
//登录框的样式你用js控制了吧 等我找给你
//初始化连接
connect();
function connect() {
    el.value += "开始连接----\r\n";
    var address = "ws://127.0.0.1:9201";//服务端地址
    ws = new WebSocket(address);            //实例化WebSocket对象
    el.value += "连接中---\r\n";
    //开始连接时
    ws.onopen = function (e) {
        el.value += userName + "用户连接成功！\r\n";
        checkUser("login", userName);
    };
    //ws.onopen = function (e) {
    //    el.value += userName + "用户连接成功！\r\n";
    //    zoneName = "常温段";
    //    checkUser("login", userName, zoneName);
    //};
    //收到信息时
    var sumNum = 0;
    ws.onmessage = function (e) {
        var json = e.data
        console.log("我是打印:" + json);
        var obj = eval('(' + json + ')');    //由JSON字符串转换为JSON对象        
        if (obj.Sender == "WCS") {
            //初次登录接收到画图数据
            if (obj.MesssageType == "Init") {
                var dataArr = obj.Data;
                console.log(dataArr);
                $.each(dataArr, function (i) {
                    var cc = dataArr[i].DeviceCode;  //读取站台号
                    if (cc >= 2001 && dataArr[i].Coordinate_X != 0) {
                        var div = $('<div class="' + cc + '" ></div>');
                        if (dataArr[i].Direction == 'T') {
                            if (dataArr[i].Width == '1') {
                                div.css({ background: "url('../Content/img/bigH.png')", backgroundSize: "cover", color: "#000000", left: dataArr[i].Coordinate_X + 'px', top: dataArr[i].Coordinate_Y + 'px', width: dataArr[i].Width * 50 + 'px', height: dataArr[i].Hight * 50 + 'px', position: "absolute", border: '2px solid #d6d6c2', color: " #ffffff", "z-index": "1000" });
                            }
                            else {
                                div.css({ background: "url('../Content/img/guntongHs.png')", backgroundSize: "cover", color: "#000000", left: dataArr[i].Coordinate_X + 'px', top: dataArr[i].Coordinate_Y + 'px', width: dataArr[i].Width * 50 + 'px', height: dataArr[i].Hight * 50 + 'px', position: "absolute", border: '2px solid #d6d6c2', color: " #ffffff", "z-index": "1000" });
                            }
                        }
                        else {
                            if (dataArr[i].Width == '2') {
                                div.css({ background: "url('../Content/img/bigS.png')", backgroundSize: "cover", color: "#000000", left: dataArr[i].Coordinate_X + 'px', top: dataArr[i].Coordinate_Y + 'px', width: dataArr[i].Width * 50 + 'px', height: dataArr[i].Hight * 50 + 'px', position: "absolute", border: '2px solid #d6d6c2', color: " #ffffff", "z-index": "1000" });
                            }
                            else {
                                div.css({ background: "url('../Content/img/guntongSs.png')", backgroundSize: "cover", color: "#000000", left: dataArr[i].Coordinate_X + 'px', top: dataArr[i].Coordinate_Y + 'px', width: dataArr[i].Width * 50 + 'px', height: dataArr[i].Hight * 50 + 'px', position: "absolute", border: '2px solid #d6d6c2', color: " #ffffff", "z-index": "1000" });
                            }
                        }
                        div.html(dataArr[i].DeviceCode);
                        $("#drapdiv").append(div);
                        buttonStaClick(cc);
                    }
                    else { }

                });
                console.log('div1')
                sc_line1();
                sc_line2();
                sc_line3();
                sc_line4();
                sc_car1();
                sc_car2();
                robot1();
                robot2();
            }
                //接收到获取输送机运行数据
            else if (json.messagetype == "getStadata") {
                var dataArr = eval(json.rows);
                //console.log(dataArr);
                $.each(dataArr, function (i) {
                    if (dataArr[i].TASKNO != "0") {
                        var a = dataArr[i].STATIONNO;
                        var test = a;
                        $('.' + test).css({ background: "#00ff00", color: "#000000" })

                        //点击事件，弹出tc,弹出的数据显示来源于下面
                        $('#drapdiv').on('click', '.' + a, function () {
                            // $('#big_tc').show();
                            $('#stationText').val(dataArr[i].STATIONNO)
                            $('#taskText').val(dataArr[i].TASKNO)
                            $('#fromText').val(dataArr[i].FROMSTATION)
                            $('#toText').val(dataArr[i].TOSTATION)
                            $('#goodsText').val(dataArr[i].GOODTYPE)
                            $('#barcodeText').val(dataArr[i].BARCODE)

                            $('#tc_task').css("display", "block");
                            $('#tc_error').css("display", "block");
                            $('#tc_button').css("display", "block");
                            $('#sc_message').css("display", "none");
                            $('#sc_button').css("display", "none");
                            $('#robot_message').css("display", "none");
                            $('#robot_button').css("display", "none");
                            //shrinkDiv();
                        });
                    }
                    else if (dataArr[i].TASKNO == "0") {
                        // console.log(dataArr[i].STATIONNO + "我是恢复颜色")
                        var a = dataArr[i].STATIONNO;
                        var test = a;
                        $('.' + test).css({ background: "#a3a375", color: "#000000" })

                        //点击事件，弹出tc,弹出的数据显示来源于下面
                        $('#drapdiv').on('click', '.' + a, function () {
                            // $('#big_tc').show();
                            $('#stationText').val(dataArr[i].STATIONNO)
                            $('#taskText').val(dataArr[i].TASKNO)
                            $('#fromText').val(dataArr[i].FROMSTATION)
                            $('#toText').val(dataArr[i].TOSTATION)
                            $('#goodsText').val(dataArr[i].GOODTYPE)
                            $('#barcodeText').val(dataArr[i].BARCODE)

                            $('#tc_task').css("display", "block");
                            $('#tc_error').css("display", "block");
                            $('#tc_button').css("display", "block");
                            $('#sc_message').css("display", "none");
                            $('#sc_button').css("display", "none");
                            $('#robot_message').css("display", "none");
                            $('#robot_button').css("display", "none");

                            //shrinkDiv();
                        });

                    }
                });

            }
                //接收到获取堆垛机运行数据
            else if (json.messagetype == "getSCdata") {
                var dataArr = eval(json.rows);
                // console.log(dataArr + "我是堆垛机数据");
                $.each(dataArr, function (i) {
                    //当点击堆垛机按钮时把堆垛机数据值赋值给右侧窗口，并做div的运动变换
                    var a = dataArr[i].SCNUM;
                    // console.log(a + "我是堆垛机编号数据,列：" + dataArr[i].COLUMN);
                    $('#drapdiv').on('click', '#' + a, function () {
                        $('#tc_task').css("display", "none");
                        $('#tc_error').css("display", "none");
                        $('#tc_button').css("display", "none");
                        $('#robot_message').css("display", "none");
                        $('#robot_button').css("display", "none");
                        $('#sc_message').css("display", "block");
                        $('#sc_button').css("display", "block");

                        $('#sc_number').val(dataArr[i].SCNUM)
                        $('#sc_mode').val(dataArr[i].SCMODE)
                        $('#sc_status').val(dataArr[i].STATUS)
                        $('#sc_task').val(dataArr[i].SCTASK)
                        $('#sc_goodstype').val(dataArr[i].GOODSTYPE)
                        $('#sc_barcode').val(dataArr[i].BARCODE)
                        $('#sc_fromstation').val(dataArr[i].SCFROM)
                        $('#sc_tostation').val(dataArr[i].SCTO)
                        $('#sc_column').val(dataArr[i].COLUMN)
                        $('#sc_layer').val(dataArr[i].LAYER)

                        //shrinkDiv();
                    });
                    if (dataArr[i].COLUMN != "") {
                        $("#" + dataArr[i].SCNUM).animate({ left: (350 + (dataArr[i].COLUMN - 1) * 40) + 'px', speed: 'fase' });

                    }

                });
            }
                //接收到获取机械手运行数据
            else if (json.messagetype == "getRobotdata") {
                var dataArr = eval(json.rows);
                //console.log(dataArr + "我是机械手数据");
                $.each(dataArr, function (i) {
                    var a = dataArr[i].ROBOTNUM;
                    // console.log(a + "我是堆垛机编号数据,列：" + dataArr[i].ROBOTNUM);
                    $('#drapdiv').on('click', '#' + a, function () {
                        $('#tc_task').css("display", "none");
                        $('#tc_error').css("display", "none");
                        $('#tc_button').css("display", "none");
                        $('#sc_message').css("display", "none");
                        $('#sc_button').css("display", "none");
                        $('#robot_message').css("display", "block");
                        $('#robot_button').css("display", "block");

                        $('#robot_number').val(dataArr[i].ROBOTNUM)
                        $('#robot_mode').val(dataArr[i].ROBOTMODE)
                        $('#robot_status').val(dataArr[i].STATUS)

                        //shrinkDiv();
                    });
                });
            }
                //接收到验证信息,验证成功则紧接着写入站台信息给服务端
            else if (json.messagetype == "checkMesg") {
                console.log("我是数据" + json.message);
                if (json.message == 1) {
                    $("#tcMsg").text("用户权限验证成功");
                    writeStaInfo();
                }
                else if (json.message == 999) {
                    $("#tcMsg").text("用户权限验证失败！请重新输入");
                }
            }
                //接收按钮权限
            else if (json.messagetype == "GetOperate") {
                var dataArr = eval(json.rows);
                $.each(dataArr, function (i) {
                    buttonStaShrink(dataArr[i].COLUMN_VALUE);

                });
            }
        }
        else if (json == "888") {
            var str = $("#tcMsg").val;
            console.log("我是打印当前数据" + str);
            $("#tcMsg").val($("#tcMsg").val() + "写入成功")

        }

    };
    //发生错误时
    ws.onerror = function (e) {

    };
    //连接关闭时
    ws.onclose = function (e) {
        //$('#msgBox').append('<p>与服务端的连接已断开。</p>');
        el.value += "与服务端的连接已断开----\r\n";
    };
}

//公聊发送
function send() {
    var SendText = $('#send').val();
    ws.send('[send]{"msg":"' + SendText + '","user":"' + userName + '"}');
}

//用于发送用户信息
function checkUser(mestype, userName) {
    var login = [];
    messagetype = mestype;
    userid = userName;
    login.push({ 'messagetype': messagetype, 'userid': userid })
    console.log(login);
    console.log(JSON.stringify(login));
    ws.send(JSON.stringify(login));
}

//画出堆垛机的第一行值
function sc_line1() {
    drap_Shelves("", 9, 280, 30, 40, 50);
}

//画出堆垛机的第二行值
function sc_line2() {
    drap_Shelves("", 9, 280, 130, 40, 50);
}

//画出堆垛机的第三行值
function sc_line3() {
    drap_Shelves("", 9, 280, 230, 40, 50);
}

//画出堆垛机的第四行值
function sc_line4() {
    drap_Shelves("", 9, 280, 330, 40, 50);
}

//画货架
function drap_Shelves(i_lineQty, i_columnQty, i_left, i_top, i_width, i_height) {
    var v_lineQty = i_lineQty;
    //var v_columnQty = new Array(i_columnQty);
    var v_left = i_left
    var v_top = i_top
    var v_width = i_width
    var v_height = i_height
    for (var i = 1; i <= i_columnQty; i++) {
        var div1 = $('<div class="sc_line2_' + i + '" ></div>');
        div1.css({
            background: "#ffcc99",
            position: "absolute",
            left: v_left + 30 + 40 * i + 'px',   //间隔30个px的距离，再往后每间隔40PX画列
            top: v_top + 'px',
            width: v_width + 'px',
            height: v_height + 'px',
            border: '2px solid #d6d6c2',
            color: " #000000"
        });
        $("#drapdiv").append(div1)
        div1.html(i + '列1');
    }
}

//画出堆垛机
function drap_sc(i_scNumber, i_left, i_top, i_width, i_height) {
    var div1 = $('<div id="sc_car' + i_scNumber + '" ></div>');
    div1.css({
        background: "#ffff00",
        position: "absolute",
        left: i_left + 'px',   //间隔30个px的距离，再往后每间隔40PX画列
        top: i_top + 'px',
        width: i_width + 'px',
        height: i_height + 'px',
        border: '2px solid #d6d6c2',
        color: " #000000"
    });
    $("#drapdiv").append(div1)
    div1.html('car' + i_scNumber + '');
}


//画出一号堆垛机
function sc_car1() {
    drap_sc(1, 350, 80, 40, 50);
}

//画出二号堆垛机
function sc_car2() {
    drap_sc(2, 350, 280, 40, 50);
}

//画出机器人
function drap_robot(i_robotNumber, i_left, i_top, i_width, i_height) {
    var div1 = $('<div id="robot' + i_robotNumber + '" ></div>');
    div1.css({
        background: "#ffff00",
        position: "absolute",
        left: i_left + 'px',   //间隔30个px的距离，再往后每间隔40PX画列
        top: i_top + 'px',
        width: i_width + 'px',
        height: i_height + 'px',
        border: '2px solid #d6d6c2',
        color: " #000000"
    });
    $("#drapdiv").append(div1)
    div1.html('robot' + i_robotNumber + '');
}


//画出一号机械手
function robot1() {
    drap_robot(1, 80, 130, 50, 50);
}

//画出二号机械手
function robot2() {
    drap_robot(2, 80, 230, 50, 50);
}


////写入输送机信息给服务端
function writeStaInfo() {
    var group = [];
    messagetype = "writeStaInfo";
    station = $('#stationText').val();
    task = $('#taskText').val();
    from = $('#fromText').val();
    to = $('#toText').val();
    goods = $('#goodsText').val();
    barcode = $('#barcodeText').val();
    group.push({ 'messagetype': messagetype, 'station': station, 'task': task, 'from': from, 'to': to, 'goods': goods, 'barcode': barcode })
    console.log(group)
    ws.send(JSON.stringify(group));
};

////写入堆垛机信息给服务端
function writeScInfo() {
    var group = [];
    messagetype = "writeScInfo";
    station = $('#stationText').val();
    task = $('#taskText').val();
    from = $('#fromText').val();
    to = $('#toText').val();
    goods = $('#goodsText').val();
    barcode = $('#barcodeText').val();
    group.push({ 'messagetype': messagetype, 'station': station, 'task': task, 'from': from, 'to': to, 'goods': goods, 'barcode': barcode })
    console.log(group)
    ws.send(JSON.stringify(group));
};

////修改堆垛机的模式
function changeScMode() {
}

//用于获取输送机站台具备什么按钮
function getStaButton() {
    var group = [];
    messagetype = "GetOperate";
    stationno = $('#stationText').val();
    equipmenttype = "STA";
    group.push({ 'messagetype': messagetype, 'stationno': stationno, 'equipmenttype': equipmenttype })
    console.log(group)
    ws.send(JSON.stringify(group));
}


//用于左上角收缩按钮的控制
var flag = 0;
$('#h_shrinkBtn').on('click', function () {

    if (flag % 2 === 0) {
        $('#heartdiv').show();

        $('#drapdiv').css({ 'width': $(window).width() - $('#heartdiv').width() - 2 + 'px' });
    }
    else {
        $('#heartdiv').hide();

        $('#drapdiv').css({ 'width': $(window).width() + 'px' });

    }
    flag++;
});


//点击测试按钮，
$('#test').on('click', function () {
    //$("#sc_car1").animate({ left: '510px', speed: 'fase' });  //测试div的移动
    //location.href = "http://192.168.23.86:9002/User/User_One_Form.aspx?ListID=97026&T_id=0230EAED438549FFBE95D732026617A2";
    //var a = {"status":"success","messagetype":"checkMesg","page":0,"total":0,"message":};
    //console.log("数据格式" + a);
    //console.log("转换数据" + JSON.parse(a));
    //var json = JSON.parse(a);
});

//点击取消，关闭弹窗
$('#cancelText').on('click', function () {
    $('#tc').hide();
});

//点击左侧确认，获取输入值
$('#okText').on('click', function () {
    $('#logindiv').css("display", "block");
});

//点击输入用户确定按钮，获取输入用户名   登陆是在这里谈出的  样式是在html里
$('#login_okText').on('click', function () {
    var group = [];
    messagetype = "checkUser";
    loginName = $('#loginName').val();
    passWord = $('#passWord').val();
    group.push({ 'messagetype': messagetype, 'userid': loginName, 'password': passWord });
    console.log(group)
    ws.send(JSON.stringify(group));
});

//点击左侧确认，获取输入值
$('#login_cancelText').on('click', function () {
    $('#logindiv').css("display", "none");
});


////实现DIV的拖拽
//var div1 = document.getElementById("dragDiv");
//div1.onmousedown = function (ev) {
//    var oevent = ev || event;

//    var distanceX = oevent.clientX - div1.offsetLeft;
//    var distanceY = oevent.clientY - div1.offsetTop;

//    document.onmousemove = function (ev) {
//        var oevent = ev || event;
//        div1.style.left = oevent.clientX - distanceX + 'px';
//        div1.style.top = oevent.clientY - distanceY + 'px';
//    };
//    document.onmouseup = function () {
//        document.onmousemove = null;
//        document.onmouseup = null;
//    };
//    ;
//};


