const Drapjtopo = function() {
    //创建舞台
    var canvas = document.getElementById('canvas');
    const stage = new JTopo.Stage(canvas);
    showJTopoToobar(stage); //显示工具栏

    var scene = new JTopo.Scene(stage);
    stage.eagleEye.visible = true;

    until.loadImg(BACEIMGURL + 'bg.jpg', function(url) {
        scene.setBackground(url);
    });

    setCanvasWH(canvas);
    //stage.mode = "select";  //可以框选多个节点、可以点击单个节点
    // 舞台单击事件
    stage.click(function(event) {
        if (event.button == 0) {
            // 右键
            // 关闭弹出菜单（div）
            $('#equipmentinfo').hide();
            $('#logindiv').hide();
            $('#UpdateInfo').hide();
            $('#contextmenu').hide();
        }
    });

    //托盘双击事件
    scene.dbclick(function(event) {
        if (event.target == null) return;
        var e = event.target;
        if (e.text == 'SC01' || e.text == 'SC02' || e.text == 'SC03') {
            console.log('我是鼠标双击效果堆垛机：' + e.text);
            console.log('打印进入堆垛机的报文：' + dataArr);
            $('#equipmentinfo')
                .css({
                    top: event.pageY - 100,
                    left: event.pageX + 100
                })
                .show();
            $('#span0').text('设备号：' + '123');
            $('#span1').text('设备状态：' + '123');
            $('#span2').text('报警代码：' + '123');
            $('#span3').text('堆垛机模式：' + '123');
            $('#span4').text('手自动：' + '123');
            $('#span5').text('工位1任务号：' + '123');
        } else if (e.text == 'RB01' || e.text == 'RB02') {
            console.log('我是鼠标双击效果堆垛机：' + e.text);
            console.log('打印进入堆垛机的报文：' + dataArr);
            $('#equipmentinfo')
                .css({
                    top: event.pageY - 100,
                    left: event.pageX + 100
                })
                .show();
            $('#span0').text('设备号：' + '234');
            $('#span1').text('设备状态：' + '678');
            $('#span2').text('报警代码：' + '789');
            $('#span3').text('堆垛机模式：' + '456');
            $('#span4').text('手自动：' + '111');
            $('#span5').text('工位1任务号：' + '4567');
        } else {
            $('#equipmentinfo')
                .css({
                    top: event.pageY - 100,
                    left: event.pageX + 50
                })
                .show();

            dataArr.forEach(element => {
                if (e.text == element.DeviceID) {
                    $('#span0').text('站台号：' + element.DeviceID);
                    $('#span1').text('任务号：' + element.Tags.TaskNum);
                    $('#span4').text('起始地址：' + element.Tags.FromStation);
                    $('#span5').text('目标地址：' + element.Tags.ToStation);
                    $('#span3').text('托盘条码：' + element.Tags.TrayCode);
                    $('#span2').text('货物类型：' + element.Tags.GoodsType);
                }
            });
        }
    });

    /**
     * 设置canvas宽高
     * @param {DOMNode} c
     */
    const setCanvasWH = function(c) {
        const width_Pscreen = $(window).width(); //获取父级窗口的宽度
        const heigth_Pscreen = $(window).height();
        $(c).attr('width', $(window).get(0).innerWidth);
        $(c).attr('height', $(window).get(0).innerHeight);
    };

    return {
        crawConvery: function(item, i, stage) {
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
                console.log('你是打印node信息:' + node);
                //存在就更新1.任务号大于1000，读取原来的颜色进行比较更新
                if (item.Tags.TaskNum >= 1000) {
                    if (item.DeviceID == item.Tags.ToStation) {
                        var stationType = '是';
                    } else {
                        var stationType = '否';
                    }
                    var old_myType = node.myType;
                    console.log(
                        '是否申请：' +
                            stationType +
                            '，当前站台号：' +
                            item.DeviceID +
                            ',目标：' +
                            item.Tags.ToStation +
                            ',原来的颜色：' +
                            old_myType
                    );
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
                    console.log('一键清除');
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
                        $('#contextmenu')
                            .css({
                                top: event.pageY,
                                left: event.pageX
                            })
                            .show();
                        stationNo = event.target.text;
                        console.log('我是当前点击站台号:' + stationNo);
                    }
                }
                nodeFrom.addEventListener('mouseup', function(event) {
                    currentNode = this;
                    handler(event);
                });
            }
        },
        crawSRM: function(item, i, stage) {
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
        },
        crawPutRobot: function(item) {
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
        }
    };
};
