/**
 * 入口函数
 */
const deviceWatch = function(ws) {
    const BACEIMGURL = '../../Content/img/';
    const GOODWIDTH = 7;  //货架宽度 原来是14
    const IMGURL = {
        left: BACEIMGURL + 'left.png',     //水平朝左方向
        right: BACEIMGURL + 'right.png',   //水平朝右方向
        'left-right': BACEIMGURL + 'left-right.png',    //水平双向
        top: BACEIMGURL + 'top.png',                    //垂直朝上方向
        bottom: BACEIMGURL + 'bottom.png',               //垂直朝下方向
        'top-bottom': BACEIMGURL + 'top-bottom.png',

        loadSc: BACEIMGURL + 't_hcg.png',  //载货中
        getBox:BACEIMGURL+'t_getBox.png',    //取货中
        putBox:BACEIMGURL+'t_putBox.png',    //放货中
        sc: BACEIMGURL + 'sc.png',
        robot: BACEIMGURL + 'robot.png'
    };

    /**
     * 绘制输送机
     * @param {Object} item 绘制数据包
     * @param {Number} i   当前数量
     * @param {Object} stage 绘制舞台
     */
    const crawConvery = function(item, i, stage) {
        var cc = item.DeviceID;
        var scene = stage.childs[0];
        var nodes = scene.childs.filter(function(e) {
            return e instanceof JTopo.Node;
        });
        nodes = nodes.filter(function(e) {
            if (e.text == null) return false;
            return e.text.indexOf(cc) != -1;
        });

        // todo : 更新节点
        if (nodes.length > 0) {
            console.log('更新节点111111111', item.ShowStatus);
            const node = nodes[0];
            updateConvery(node, item);
            // todo: 新增节点
        } else {
            const node = new JTopo.Node(cc);
            //node.setSize(BACEWHPX, BACEWHPX);
            node.DeviceID = item.DeviceID;
            node.selected = false;
            node.dragable = 0;            
            node.textPosition = 'Middle_Center';
            node.DeviceType = item.DeviceType;
            node.setSize(50, 50);
            node.fontColor = "255,255,0";         //字体颜色
            if (item.ShowStatus) {
                node.fillColor = item.ShowStatus;
            } else {
                let url = '';
                if (item.Direction == 'V') {
                    url = IMGURL['left-right'];
                    if (item.Flow == 'L') {
                        url = IMGURL.left;
                    } else if (item.Flow == 'R') {
                        url = IMGURL.right;
                    }
                } else {
                    url = IMGURL['top-bottom'];
                    if (item.Flow == 'U') {
                        url = IMGURL.top;
                    } else if (item.Flow == 'D') {
                        url = IMGURL.bottom;
                    }
                }
                node.setImage(url);
                
            }
            node.DeviceType = item.DeviceType;
            // node.setImage(0);

            node.setCenterLocation(item.Coordinate_X, item.Coordinate_Y);
            scene.add(node);
        }
    };

    /**
     *
     * @param {Node} node  JTopo.Node  节点
     * @param {Object} item  数据包
     */
    const updateConvery = function(node, item) {
        //更新状态颜色
        if (item.ShowStatus) {
            console.log('更新状态颜色', item.ShowStatus, item.DeviceID);
            node.setImage(0);
            node.fillColor = item.ShowStatus;
        } else {
            let url = '';
            if (item.Direction == 'V') {
                url = IMGURL['left-right'];
                if (item.Flow == 'L') {
                    url = IMGURL.left;
                } else if (item.Flow == 'R') {
                    url = IMGURL.right;
                }
            } else {
                url = IMGURL['top-bottom'];
                if (item.Flow == 'U') {
                    url = IMGURL.top;
                } else if (item.Flow == 'D') {
                    url = IMGURL.bottom;
                }
            }
            node.setImage(url);
        }

        // todo  设备报警
        if (item.Status != 1) {
            //alert('有设备报警，请及时处理');
            openAudio();
            node.alarm = '设备报警';
        } else {
            node.alarm = null;
            closeAudio();
        }
    };

    /**
     * 绘制堆剁机
     * @param {Object} item 绘制数据包
     * @param {Number} i   当前数量
     * @param {Object} stage 绘制舞台
     */
    const crawSRM = function(item, i, stage) {
        const SRMWidth = 100;
        var cc = item.DeviceID;

        var scene = stage.childs[0];
        var nodes = scene.childs.filter(function(e) {
            return e instanceof JTopo.Node;
        });
        nodes = nodes.filter(function(e) {
            if (e.DeviceID == null) return false;

            return e.DeviceID.indexOf(cc) != -1;
        });

        if (nodes.length > 0) {
            const node = nodes[0];

            node.text = `${item.DeviceID}位于${item.Row}列`;
            node.setLocation(item.Coordinate_X + item.Row * GOODWIDTH, item.Coordinate_Y);

            if (item.ShowStatus) {
                node.setImage(0);
                node.fillColor = item.ShowStatus;
            } else {
                node.setImage(BACEIMGURL + 'sc.png');
            }

            // todo  设备报警
            if (item.Status != 1) {
                node.alarm = '设备报警';
                openAudio();
            } 
            else 
            {
                node.alarm = null;
                closeAudio();
            }
            //Load状态为1是：载货行走，3：取货中，2：放货中,空或者为0：空堆垛机
            if (item.Load == 1) {
                // node.setImage(0);
                node.setImage(IMGURL.loadSc);
            }
            else if(item.Load == 2)
            {
                node.setImage(IMGURL.putBox);
            }
            else if(item.Load == 3)
            {
                node.setImage(IMGURL.getBox);
            }
            else if(item.Load == 0)
            {
                    node.setImage(IMGURL.sc);              
            }
            else
            node.setImage(IMGURL.sc);

        } else {
            const scene = stage.childs[0];
            var nodeRobot = new JTopo.Node(`${item.DeviceID}位于${item.Row}列`);
            nodeRobot.DeviceID = item.DeviceID;
            nodeRobot.DeviceType = item.DeviceType;
            nodeRobot.textPosition = 'Middle_Center';
            nodeRobot.setSize(SRMWidth, SRMWidth);
            nodeRobot.setLocation(item.Coordinate_X + item.Row * GOODWIDTH, item.Coordinate_Y);
            if (item.ShowStatus) {
                nodeRobot.fillColor = item.ShowStatus;
            } else {
                nodeRobot.setImage(BACEIMGURL + 'sc.png');
            }
            nodeRobot.dragable = false;
            // todo  设备报警
            if (item.Status != 1) {
                //alert('有设备报警，请及时处理');
                nodeRobot.alarm = '设备报警';
                console.log('堆垛机报警了啊:'+item.DeviceID);     
                openAudio();
            } else {
                nodeRobot.alarm = null;
            }
            //根据堆垛机编号画出列数，不同堆垛机有不同的列数   
            console.log('堆垛机编号:'+item.DeviceID);      
            /*if(item.DeviceID=='SC02')
            {
                var columnNum=20;               
            }
            else if(item.DeviceID=='SC03')
            {
                var columnNum=38;             
            }
            else if(item.DeviceID=='SC01')
            {
                var columnNum=8;
            }*/
            //g08列数
            if(item.DeviceID=='SC03')
            {
                var columnNum=80;               
            }
            else if(item.DeviceID=='SC04')
            {
                var columnNum=80;             
            }
            else if(item.DeviceID=='SC05')
            {
                var columnNum=80;
            }
            else if(item.DeviceID=='SC06')
            {
                var columnNum=80;             
            }
            else if(item.DeviceID=='SC07')
            {
                var columnNum=80;
            }
            else if(item.DeviceID=='SC01')
            {
                var columnNum=80;             
            }
            else if(item.DeviceID=='SC02')
            {
                var columnNum=80;
            }
            createGoods(columnNum, item.Coordinate_X, item.Coordinate_Y, SRMWidth, SRMWidth);
            scene.add(nodeRobot);
        }
        //根据堆垛机的位置画出货位列
        function createGoods(num, x, y, width, height) {
            new Array(num).fill(1).forEach((item, i) => {
                //const node = new JTopo.Node(i + 1 + '');  //扩号里的参数列的数字  
                //const node2 = new JTopo.Node(i + 1 + '');
                const node = new JTopo.Node();  //扩号里的参数列的数字  
                const node2 = new JTopo.Node();
                const [w, h] = [GOODWIDTH, GOODWIDTH];

                node.setSize(w, h);
                node2.setSize(w, h);
                node.setLocation(x + width+ w * i, y - h);
                node.textPosition = 'Middle_Center';
                node2.textPosition = 'Middle_Center';
                node2.setLocation(x + width + w * i, y + height);
                node.dragable = false;
                node2.dragable = false;
                node.selected = false;
                node2.selected = false;
                node.DeviceType = 'goods';
                node2.DeviceType = 'goods';

                scene.add(node2);
                scene.add(node);
            });
        }
    };

    /**
     * 绘制组盘机械手
     * @param {Object} item 绘制数据包
     * @param {Number} i   当前数量
     * @param {Object} stage 绘制舞台
     */
    const crawPutRobot = function(item, i, stage) {
        var cc = item.DeviceID;
        var scene = stage.childs[0];
        var nodes = scene.childs.filter(function(e) {
            return e instanceof JTopo.Node;
        });
        nodes = nodes.filter(function(e) {
            if (e.text == null) return false;
            return e.text.indexOf(cc) != -1;
        });

        // todo : 更新节点
        if (nodes.length > 0) {
            const node = nodes[0];
            // todo  设备报警
           if (item.Status != 0) {
            //alert('有设备报警，请及时处理');
              openAudio();
              node.alarm = '组盘设备报警';
           } else {
            node.alarm = null;
            closeAudio();
           }
        }
        else{
          console.log('我是组盘机械手');
          var scene = stage.childs[0];
          const nodeRobot = new JTopo.Node(item.DeviceID);
          nodeRobot.DeviceID = item.DeviceID;
          nodeRobot.setSize(100, 100);
          nodeRobot.DeviceType = item.DeviceType;

          //nodeRobot.textPosition = 'Middle_Center';
          console.log(item.Coordinate_X, item.Coordinate_Y);

          nodeRobot.setLocation(item.Coordinate_X, item.Coordinate_Y);
          nodeRobot.shadow = false;
          console.log(nodeRobot.getBound());

          nodeRobot.setImage(IMGURL.robot);
          nodeRobot.dragable = false;
          scene.add(nodeRobot);
        
          // todo  设备报警
          if (item.Status != 0) {
              //alert('有设备报警，请及时处理');
              openAudio();
              nodeRobot.alarm = '组盘设备报警';
          } else {
              nodeRobot.alarm = null;
              closeAudio();
          }
      }
    };

    /**
     * 绘制拆盘机械手
     * @param {Object} item 绘制数据包
     * @param {Number} i   当前数量
     * @param {Object} stage 绘制舞台
     */
    const crawPickRobot = function(item, i, stage) {
        var cc = item.DeviceID;
        var scene = stage.childs[0];
        var nodes = scene.childs.filter(function(e) {
            return e instanceof JTopo.Node;
        });
        nodes = nodes.filter(function(e) {
            if (e.text == null) return false;
            return e.text.indexOf(cc) != -1;
        });

        // todo : 更新节点
        if (nodes.length > 0) {
            const node = nodes[0];
            // todo  设备报警
           if (item.Status != 0) {
            //alert('有设备报警，请及时处理');
              openAudio();
              node.alarm = '拆盘设备报警';
           } else {
            node.alarm = null;
            closeAudio();
           }
        }
        else{
          console.log('我是拆盘机械手');
          var scene = stage.childs[0];
          const nodeRobot = new JTopo.Node(item.DeviceID);
          nodeRobot.DeviceID = item.DeviceID;
          nodeRobot.setSize(100, 100);
          nodeRobot.DeviceType = item.DeviceType;

          //nodeRobot.textPosition = 'Middle_Center';
          console.log(item.Coordinate_X, item.Coordinate_Y);

          nodeRobot.setLocation(item.Coordinate_X, item.Coordinate_Y);
          nodeRobot.shadow = false;
          console.log(nodeRobot.getBound());

          nodeRobot.setImage(IMGURL.robot);
          nodeRobot.dragable = false;
          scene.add(nodeRobot);
        
          // todo  设备报警
          if (item.Status != 0) {
              //alert('有设备报警，请及时处理');
              openAudio();
              nodeRobot.alarm = '拆盘设备报警';
          } else {
              nodeRobot.alarm = null;
              closeAudio();
          }
      }
    };

    /**
     *
     * @param {String} type  站台类型  STA/SRM
     */
    const createPublicButton = function(stationData, config = STATIONBASEDATA) {
        const data = config[stationData.DeviceType].actionButton;

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
        return Object.keys(stationData.ButtonData);
    };

    //创建舞台
    var canvas = document.getElementById('canvas');
    const stage = new JTopo.Stage(canvas);
    showJTopoToobar(stage, 'content'); //显示工具栏

    var scene = new JTopo.Scene(stage);
    stage.eagleEye.visible = true;
    stage.wheelZoom = 1.2;  //设置鼠标滚轮滑动时的缩放比例
    scene.setBackground(BACEIMGURL + 'bg.jpg');
    // scene.alpha = 1;
    // scene.backgroundColor = '49,90,119'; //49,90,119
    setCanvasWH(canvas);
    //stage.mode = "select";  //可以框选多个节点、可以点击单个节点

    let stationData = {}; // 单个站台信息 let定义块级变量
    // 舞台单击事件
    stage.click(function(event) {
        if (event.button == 0) {
            // 右键
            // 关闭弹出菜单（div）
            homeVue.showEquipmentinfo = false;
        }
    });

    //托盘双击事件
    scene.dbclick(function(event) {
        if (event.target == null) return;
        var e = event.target;

        //点击了货架，不需要处理
        if (e.DeviceType == 'goods') {
            return;
        }
        wsRequest({ messagetype: 'getStationInfo', data: { DeviceID: e.DeviceID, DeviceType: e.DeviceType } }, function(
            data
        ) {
            console.log('收到站台信息：', data);
            stationData = data.Data;
            homeVue.stationData = stationData;
            //homeVue.publicButton = createPublicButton(stationData);
            homeVue.stationButton = createStationButton(stationData);

            homeVue.equipmentinfo = stationData.InfoData;
            homeVue.copyEquipmentinfo = JSON.parse(JSON.stringify(stationData.InfoData));
            homeVue.showEquipmentinfo = true;
            //homeVue.equipmentinfoXY = [event.pageX + 50, event.pageY - 100];
            homeVue.equipmentinfoXY = [10, 10];
        });

        // todo: 从后台获取对应的数据 ,现在写死 STATIONS['1028']
        //stationData = STATIONS['1028'];
        // homeVue.stationData = stationData;
    });

    const openAudio = function() {
        const audio = document.querySelector('#audio');
        audio.play();
    };
    //openAudio();
    const closeAudio = function() {
        const audio = document.querySelector('#audio');
        audio.pause();
    };
    //红色：'237,19,12'
    //绿色：48,187,35   浅绿：45,168,131
    //橘黄色：251,143,27
    //255,240,245 仓紫色

    // 界面交互数据入口
    const homeVue = new Vue({
        el: '#homeVue',
        data: {
            stationData: { DeviceType: '' },
            equipmentinfo: [],
            copyEquipmentinfo: [],
            showEquipmentinfo: false,
            equipmentinfoXY: [0, 0],

            SRMInfo: {
                LoadNum: '',
                CommandType: '',
                TaskNum: '',
                BarCode: '',
                SourceAddress: '',
                TargetAddress: ''
            },

            publicButton: [],
            stationButton: [],

            GOODSTYPE: GOODSTYPE
        },
        methods: {
            changeEquipmentinfo() {},
            actionButton(type) {
                let wsData = {};
                let fn = null;
                let data = null;
                switch (type) {
                    case 'updateInfo':
                        data = this.equipmentinfo;
                        fn = res => {
                            alert(res.Data.Msg);
                            if (res.Data.Code == 200) {
                                this.copyEquipmentinfo = JSON.parse(JSON.stringify(data));
                            }
                        };
                        break;
                    case 'delInfo':
                        data = this.equipmentinfo;
                        let delInfo = this.stationData.ButtonData['delInfo'];
                        Object.keys(delInfo).forEach(item => {
                            data[item] = delInfo[item];
                        });

                        break;
                    case 'getInfo':
                        data = this.equipmentinfo;
                        let getInfo = this.stationData.ButtonData['getInfo'];
                        Object.keys(getInfo).forEach(item => {
                            data[item] = getInfo[item];
                        });
                        break;
                    case 'normalRemove':
                        let normalRemove = this.stationData.ButtonData['normalRemove'];
                        Object.keys(normalRemove).forEach(item => {
                            this.equipmentinfo[item] = normalRemove[item];
                        });

                        break;
                    case 'abnormalRemove':
                        let abnormalRemove = this.stationData.ButtonData['abnormalRemove'];
                        Object.keys(abnormalRemove).forEach(item => {
                            this.equipmentinfo[item] = abnormalRemove[item];
                        });

                        break;
                }
                confirm('确定修改？') &&
                    wsRequest(
                        {
                            messagetype: 'WriteDevice',
                            data: {
                                DeviceType: this.stationData.DeviceType,
                                DeviceID: this.stationData.DeviceID,
                                DeviceInfo: this.equipmentinfo
                            }
                        },
                        res => {
                            alert(res.Data.Msg);
                            if (res.Data.Code == 200) {
                                this.copyEquipmentinfo = JSON.parse(JSON.stringify(this.equipmentinfo));
                            }
                        }
                    );
            },
            sendSRMInfo() {
                wsRequest(
                    {
                        messagetype: 'WriteDevice',
                        data: {
                            DeviceType: this.stationData.DeviceType,
                            DeviceID: this.stationData.DeviceID,
                            DeviceInfo: this.SRMInfo
                        }
                    },
                    function(res) {
                        console.log('执行SRM设备的写入回调函数');
                        alert(res.Data.Msg);
                    }
                );
            },
            close() {
                this.showEquipmentinfo = false;
            },
            closeAudio() {
                closeAudio();
            }
        },
        filters: {
            button2zh(name) {
                if (stationData.DeviceType) {
                    return STATIONBASEDATA[stationData.DeviceType].actionButton[name].name;
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
                        n = GOODSTYPE[val] ? GOODSTYPE[val].name : val;

                        break;
                }
                return n;
            }
        }
    });

    wsRequest({ messagetype: 'Init' }, function(data) {
        console.log('收到type为Init的数据', data);
        const dataArr = data.Data;
        // createFn(dataArr);
    });
    const createFn = dataArr => {
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
                    //绘制组盘机械手
                    crawPutRobot(item, i, stage);
                    break;                 
                case 'PickRobot':
                    //绘制拆盘机械手
                    crawPickRobot(item, i, stage);
                    break;
                default:
                    console.log('未知的DeviceType');
                    break;
            }
        });
    };
    return createFn;
};

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
