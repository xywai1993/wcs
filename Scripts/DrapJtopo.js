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
        if (item.ShowStatus) {
            node.setImage(0);
            node.fillColor = item.ShowStatus;
        } else {
            if (item.Direction == 'V') {
                node.setImage(BACEIMGURL + 's-rl.png');
            } else {
                node.setImage(BACEIMGURL + 'h-tb.png');
            }
        }

        // todo: 新增节点
    } else {
        const node = new JTopo.Node(cc);
        //node.setSize(BACEWHPX, BACEWHPX);
        node.selected = false;
        node.dragable = false;
        node.textPosition = 'Middle_Center';
        node.setSize(50, 50);

        if (item.ShowStatus) {
            node.fillColor = item.ShowStatus;
        } else {
            if (item.Direction == 'V') {
                node.setImage(BACEIMGURL + 's-rl.png');
            } else {
                node.setImage(BACEIMGURL + 'h-tb.png');
            }
        }
        node.DeviceType = item.DeviceType;
        // node.setImage(0);
        console.log(item.ShowStatus, node);

        node.setCenterLocation(item.Coordinate_X, item.Coordinate_Y);
        scene.add(node);
    }
};

/**
 * 绘制堆剁机
 * @param {Object} item 绘制数据包
 * @param {Number} i   当前数量
 * @param {Object} stage 绘制舞台
 */
const crawSRM = function(item, i, stage) {
    var cc = item.DeviceID;

    var scene = stage.childs[0];
    var nodes = scene.childs.filter(function(e) {
        return e instanceof JTopo.Node;
    });
    nodes = nodes.filter(function(e) {
        if (e.text == null) return false;
        return e.text.indexOf(cc) != -1;
    });

    if (nodes.length > 0) {
        const node = nodes[0];
        console.log('堆剁机', item.Coordinate_X, item.Coordinate_Y);

        node.setLocation(item.Coordinate_X, item.Coordinate_Y);
    } else {
        const scene = stage.childs[0];
        var nodeRobot = new JTopo.Node(item.DeviceID);
        nodeRobot.setSize(100, 100);

        nodeRobot.setImage(BACEIMGURL + 'sc.png');
        nodeRobot.dragable = false;
        scene.add(nodeRobot);
    }
};

/**
 * 绘制机械手
 * @param {Object} item 绘制数据包
 * @param {Number} i   当前数量
 * @param {Object} stage 绘制舞台
 */
const crawPutRobot = function(item, i, stage) {
    console.log('我是机械手');
    var scene = stage.childs[0];
    var nodeRobot = new JTopo.Node(item.DeviceID);
    nodeRobot.setSize(50, 50);
    nodeRobot.setLocation(item.Coordinate_X, item.Coordinate_Y);
    nodeRobot.setImage(BACEIMGURL + 'robot.png');
    scene.add(nodeRobot);
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

/**
 * 入口函数
 */
const deviceWatch = function(ws) {
    const BACEIMGURL = '../../Content/img/';
    const IMGURL = {
        left: BACEIMGURL + 'left.png',
        right: BACEIMGURL + 'right.png',
        'left-right': BACEIMGURL + 'left-right.png',
        top: BACEIMGURL + 'top.png',
        bottom: BACEIMGURL + 'bottom.png',
        'top-bottom': BACEIMGURL + 'top-bottom.png'
    };

    //创建舞台
    var canvas = document.getElementById('canvas');
    const stage = new JTopo.Stage(canvas);
    showJTopoToobar(stage, 'content'); //显示工具栏

    var scene = new JTopo.Scene(stage);
    stage.eagleEye.visible = true;
    scene.setBackground(BACEIMGURL + 'bg.jpg');
    // scene.alpha = 1;
    // scene.backgroundColor = '49,90,119'; //49,90,119
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
        }
    });

    //托盘双击事件
    scene.dbclick(function(event) {
        if (event.target == null) return;
        var e = event.target;
        console.log(e);

        wsRequest({ messagetype: 'getStationInfo', data: { DeviceID: e.text, DeviceType: 'STA' } }, function(data) {
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

    //红色：'237,19,12'
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
                let data = null;
                switch (type) {
                    case 'updateInfo':
                        data = this.equipmentinfo;
                        fn = res => {
                            alert(res.Data.msg);
                            if (res.Data.Code == 200) {
                                this.copyEquipmentinfo = JSON.parse(JSON.stringify(data));
                            }
                        };
                        break;
                    case 'delInfo':
                        data = this.equipmentinfo;
                        let delInfo = this.stationData.ButtonData['delInfo'];
                        Object.keys(delInfo).forEach(item => {
                            data[item] = [delInfoitem];
                        });
                        fn = function(res) {
                            console.log('delInfo更新信息成功');
                        };
                        break;
                    case 'getInfo':
                        break;
                    case 'normalRemove':
                        let normalRemove = this.stationData.ButtonData['normalRemove'];
                        Object.keys(normalRemove).forEach(item => {
                            this.equipmentinfo[item] = normalRemove[item];
                        });

                        fn = function() {
                            console.log('正常排出成功');
                        };
                        break;
                    case 'abnormalRemove':
                        let abnormalRemove = this.stationData.ButtonData['abnormalRemove'];
                        Object.keys(abnormalRemove).forEach(item => {
                            this.equipmentinfo[item] = abnormalRemove[item];
                        });

                        fn = function() {
                            console.log('异常排出成功');
                        };
                        break;
                }
                confirm('确定修改') &&
                    wsRequest(
                        {
                            messagetype: 'WriteDevice',
                            data: {
                                DeviceType: this.stationData.DeviceType,
                                DeviceID: this.stationData.DeviceID,
                                DeviceInfo: this.equipmentinfo
                            }
                        },
                        fn
                    );
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
        createFn(dataArr);
    });
    const createFn = dataArr => {
        dataArr.forEach((item, i) => {
            if (item.ShowStatus) {
                console.log(item.ShowStatus);
            }
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
