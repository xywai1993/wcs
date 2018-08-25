/**
 *  yiper.fan 学不进  2018.6.22
 */

/**
 * 货位监控
 */

const goodsWatch = function(ws) {
    const cerateImgUrl = name => {
        return '../../Content/locationImg/' + name;
    };
    const IMGSRC = {
        '0': cerateImgUrl('0.PNG'),
        __start: cerateImgUrl('0.PNG'),
        A_0_stop: cerateImgUrl('a0st.PNG'),
        A_0_start: cerateImgUrl('a1sp.PNG'),
        A_1_start: cerateImgUrl('a1st.PNG')
    };
    const DEVICETYPE = {
        'convery-t': 'Convery',
        'convery-v': 'Convery',
        srm: 'SRM',
        robot: 'PutRobot'
    };

    const PX = {
        col: 10, //列
        row: 10, // 层
        box: 2, // 深度间隔
        width: 40 // 每个方块宽度
    };

    const locationInfoData = {
        zonename: 'J', //区域名称
        locationnumber: 'J0010020031', //货位编号
        itemname: 'A', //物料名称
        locationFlag: '0', //货位标记
        locationState: '0', //货位状态
        storeTime: '100000', //存储时间
        technology: '123' //工艺名称
    };

    const locationInfoData2zh = {
        Locationnumber: '货位编号',
        ItemName: '物料名称',
        TechnologyName: '工艺名称',
        Sotredtime: '存储时间',
        FirstInTime: '入库时间',
        LocationFlag: '货位标记',
        SelectZone: '' //选择区域

        //zonename: '区域名称', //区域名称
        //locationnumber: '货位编号', //货位编号
        //itemname: '物料名称', //物料名称
        //locationFlag: '货位标记', //货位标记
        //locationState: '货位状态', //货位状态
        //storeTime: '存储时间', //存储时间
        //technology: '工艺名称' //工艺名称
    };

    const locationOther = {
        SelectZone: '' //界面选择的区域名称
    };

    const goodsData = [
        ['001', '001', '001', '01'],
        ['001', '001', '003', '01'],
        ['001', '001', '003', '02'],
        ['001', '002', '003', '01'],
        ['001', '002', '003', '02'],
        ['001', '001', '004', '01'],
        ['001', '001', '004', '02'],
        ['001', '001', '005', '01'],
        ['001', '001', '005', '02'],
        ['001', '002', '004', '02'],
        ['001', '010', '001', '01'],

        ['002', '001', '003', '01'],
        ['002', '001', '003', '02'],
        ['002', '002', '003', '01'],
        ['002', '002', '003', '02'],
        ['002', '001', '004', '01'],
        ['002', '001', '004', '02'],
        ['002', '002', '004', '02'],
        ['002', '010', '001', '01'],
        ['002', '020', '015', '01']
    ];
    let isGet = false; // 是否获取了数据

    const canvas = document.getElementById('goodsCanvas');
    setCanvasWH(canvas);
    const stage = new JTopo.Stage(canvas);
    const scene = new JTopo.Scene(stage);
    // showJTopoToobar(stage, 'locationMonitor'); //显示工具栏
    //scene.setBackground('../../Content/locationImg/test_monitor_bg.png');
    scene.alpha = 1;
    scene.backgroundColor = '49,90,119'; //49,90,119
    // stage.wheelZoom = 0.85;
    stage.setCenter(100, -100);

    // 获取详情
    scene.dbclick(function(event) {
        if (event.target == null) return;
        const e = event.target;
        console.log(e);

        wsRequest(
            {
                messagetype: 'getLocationDetail',
                data: {
                    locationnumber: e.locationnumber,
                    zoneid: locationOther.zoneInfo
                }
            },
            function(res) {
                goodsVue.showModal = true;
                goodsVue.modalXY = [event.pageX + 20, event.pageY + 20];
                goodsVue.infoData = res.Data[0];
            }
        );
    });

    stage.click(function(e) {
        if (e.button == 0) {
            goodsVue.showModal = false;
        }
    });

    const aa = {
        LOCATIONCOLUMN: '22', //行
        LOCATIONDEPTH: '2', // 列
        LOCATIONLAYER: '7', //  层
        LOCATIONLINE: '2' // 深
    };
    /**
     * 创建货架
     * @param {Number} abs 排
     * @param {Number} col 列
     * @param {Number} row 行
     * @param {Number} box 深
     * @param {String} flag 状态
     * @param {String} id 货架ID
     */
    const createGoods = function(abs, col, row, box, flag, id) {
        // 每列 每行 起始坐标
        const x = (parseInt(col, 10) - 1) * (PX.col + PX.width * 2 + PX.box);
        const y = (parseInt(row, 10) - 1) * (-PX.row - PX.width);

        const boxX = x + parseInt(box) * PX.width + (parseInt(box) - 1) * PX.box;
        const boxY = y + PX.row - (PX.row + PX.width) / 2;

        const node = new JTopo.Node();
        node.locationnumber = id;
        node.fillColor = '0,0,0,0';
        node.font = '12px';
        node.textPosition = 'Middle_Center';
        if (IMGSRC[flag]) {
            node.setImage(IMGSRC[flag]);
        }

        node.setSize(PX.width, PX.width);
        node.dragable = false;

        if (parseInt(abs, 10) === 2) {
            node.setCenterLocation(-boxX, boxY);
        } else {
            node.setCenterLocation(boxX, boxY);
        }

        scene.add(node);
    };

    const createAll = function(data) {
        data.Data.forEach(aa => {
            createGoods(
                aa.LocationDepth,
                aa.LocationColumn,
                aa.LocationLayer,
                aa.LocationLine,
                aa.LocationFlag,
                aa.LocationNumber
            );
        });
        //console.log('我是货位监控，啦啦啦啦啦啦啦啦啦啦啦：', data);
    };

    /**
     * 生成坐标轴
     */
    new Array(30).fill(1).forEach((item, i) => {
        const node = new JTopo.Node(`${i}`);
        const node2 = new JTopo.Node(`${i}`);
        const node3 = new JTopo.Node(`${i}`);

        // x
        node.font = '12px';
        node.textPosition = 'Middle_Center';
        //node.setImage(IMGSRC[type]);
        node.setSize(PX.col + PX.width * 2 + PX.box, 1);
        node.selected = false;

        // -x
        node2.font = '12px';
        node2.textPosition = 'Middle_Center';
        //node.setImage(IMGSRC[type]);
        node2.setSize(PX.col + PX.width * 2 + PX.box, 1);
        node2.selected = false;

        // y
        node3.font = '12px';
        node3.textPosition = 'Bottom_Center';
        //node.setImage(IMGSRC[type]);
        node3.setSize(1, PX.row + PX.width);
        node3.selected = false;

        // 每列 每行 起始坐标

        let x = i * (PX.col + PX.width * 2 + PX.box) - (PX.col + PX.width * 2 + PX.box) / 2;
        let y = i * (PX.row + PX.width);
        node.setCenterLocation(x, 20);
        node2.setCenterLocation(-x, 20);
        node3.setCenterLocation(0, -y);
        if (i === 0) {
            x = 0;
            y = 0;
            node.setCenterLocation(x, 20);
            node2.setCenterLocation(-x, 20);
            node3.setCenterLocation(0, y);
            node3.visible = false;
        }

        scene.add(node);
        scene.add(node2);

        if (i <= 15) {
            scene.add(node3);
        }
    });

    const goodsVue = new Vue({
        el: '#goodsTool',
        data: {
            zoom: 1,
            keyword: '',
            showModal: false,
            modalXY: [0, 0],
            infoData: locationInfoData,
            region: '' // 绑定的区域 数据 。界面上选择的哪个区域 就可以用这个取值
        },
        watch: {
            zoom(val) {
                console.log(val);

                stage.centerAndZoom(val);
            }
        },
        methods: {
            zoomCenter() {
                stage.centerAndZoom();
            },
            zoomOut() {
                stage.zoomOut();
            },
            zoomIn() {
                stage.zoomIn();
            },
            find() {
                const text = this.keyword.trim();
                //var nodes = stage.find('node[text="'+text+'"]');
                const scene = stage.childs[0];
                let nodes = scene.childs.filter(function(e) {
                    return e instanceof JTopo.Node;
                });
                nodes = nodes.filter(function(e) {
                    if (e.locationnumber == null) return false;
                    return e.locationnumber.indexOf(text) != -1;
                });

                if (nodes.length > 0) {
                    var node = nodes[0];
                    node.selected = true;
                    var location = node.getCenterLocation();
                    // 查询到的节点居中显示
                    stage.setCenter(location.x, location.y);

                    function nodeFlash(node, n) {
                        if (n == 0) {
                            node.selected = false;
                            return;
                        }
                        node.selected = !node.selected;
                        setTimeout(function() {
                            nodeFlash(node, n - 1);
                        }, 300);
                    }

                    // 闪烁几下
                    nodeFlash(node, 6);
                }
            }
        },
        filters: {
            en2zh(name) {
                return locationInfoData2zh[name] ? locationInfoData2zh[name] : name;
            }
        },
        mounted() {
            //这里是页面初始化的回调 ，可以在这样进行第一次 服务器拉取操作
            // this.region  这个就是区域的值
            // todo
        }
    });

    // 获取区域等信息
    wsRequest({ messagetype: 'getLocationCond' }, function(data) {
        console.log('获取站台区域信息', data);
        //createAll(data);
    });

    $('#goodsMenu').on('click', function() {
        if (isGet) {
            return;
        }
        wsRequest({ messagetype: 'getLocation' }, function(data) {
            isGet = true;
            createAll(data);
        });
    });
    return {};
};
