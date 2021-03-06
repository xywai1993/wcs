/**
 *  yiper.fan 学不进  2018.6.22
 */

//初始编号

const scadaConfig = function(ws) {
    const BACEIMGURL = '../../Content/img/';
    const BACEIMGURL2 = '../../Content/locationImg/';
    const goodsPX = 40; // 货架尺寸
    const IMGSRC = {
        'convery-t': BACEIMGURL + 'top-bottom.png',
        'convery-v': BACEIMGURL + 'left-right.png',
        'convery-t-t': BACEIMGURL + 'top.png',
        'convery-v-l': BACEIMGURL + 'left.png',
        'left-right': BACEIMGURL + 'left-right.png',
        right: BACEIMGURL + 'right.png',
        left: BACEIMGURL + 'left.png',
        'top-bottom': BACEIMGURL + 'top-bottom.png',
        top: BACEIMGURL + 'top.png',
        bottom: BACEIMGURL + 'bottom.png',
        srm: BACEIMGURL + 'sc.png',
        robot: BACEIMGURL + 'robot.png',
        goods: BACEIMGURL2 + '_0.png',
        bg: BACEIMGURL + 'bg.jpg'
    };
    const DEVICETYPE = {
        'convery-t': 'Convery',
        'convery-v': 'Convery',
        srm: 'SRM',
        robot: 'PutRobot',
        goods: 'LOC'
    };

    const canvas = document.getElementById('configCanvas');
    setCanvasWH(canvas);
    const stage = new JTopo.Stage(canvas);
    const scene = new JTopo.Scene(stage);
    scene.setBackground(IMGSRC.bg);
    // scene.alpha = 1;
    // scene.backgroundColor = '49,90,119'; //49,90,119
    stage.wheelZoom = 0.85;

    let createNodeIndex = 1;
    let currentNode = null;

    //
    stage.click(function(e) {
        if (e.button == 0) {
            configVue.contextmenu = false;
        }
    });

    scene.dbclick(function(event) {
        if (event.target == null) return;
        const e = event.target;
        currentNode = e;
        configVue.contextmenu = true;
        configVue.contextmenuXY = [event.pageX + 30, event.pageY + 30];
    });

    /**
     * 绘制输送机
     * @param {Object} item 绘制数据包
     * @param {Number} i   当前数量
     * @param {Object} stage 绘制舞台
     */
    const crawConvery = function(item, i, stage) {
        const node = new JTopo.Node(item.DeviceID);
        node.DeviceID = item.DeviceID;
        node.font = '16px Consolas';
        node.fontColor = '255,255,35';
        node.textPosition = 'Middle_Center';
        node.DeviceType = item.DeviceType;
        node.setSize(item.Size, item.Size);

        let dir = '';
        let type = '';
        if (item.Direction == 'V') {
            type = 'convery-v';
            url = IMGSRC['left-right'];
            node.direction = 'V';
            node.dir = 'left-right';

            if (item.Flow == 'L') {
                node.dir = 'left';
            } else if (item.Flow == 'R') {
                node.dir = 'right';
            }
        } else {
            node.direction = 'T';
            type = 'convery-t';
            if (item.Flow == 'T') {
                node.dir = 'top';
            } else if (item.Flow == 'B') {
                node.dir = 'bottom';
            }
        }

        //createNode();
        node.setImage(IMGSRC[node.dir]);
        node.devType = type;
        node.DeviceType = item.DeviceType;
        // node.setImage(0);
        node.setCenterLocation(fixXY(item.Coordinate_X), fixXY(item.Coordinate_Y));
        node.mouseup(function(e) {
            node.setCenterLocation(fixXY(e.x), fixXY(e.y));
            currentNode = this;
        });
        scene.add(node);
    };

    /**
     * 绘制堆剁机
     * @param {Object} item 绘制数据包
     * @param {Number} i   当前数量
     * @param {Object} stage 绘制舞台
     */
    const crawSRM = function(item, i, stage) {
        var nodeRobot = new JTopo.Node(item.DeviceID);
        nodeRobot.DeviceID = item.DeviceID;
        nodeRobot.DeviceType = item.DeviceType;
        nodeRobot.textPosition = 'Middle_Center';
        nodeRobot.setSize(item.Size, item.Size);
        nodeRobot.setLocation(fixXY(item.Coordinate_X), fixXY(item.Coordinate_Y));
        nodeRobot.setImage(BACEIMGURL + 'sc.png');
        scene.add(nodeRobot);
    };

    /**
     * 绘制机械手
     * @param {Object} item 绘制数据包
     * @param {Number} i   当前数量
     * @param {Object} stage 绘制舞台
     */
    const crawPutRobot = function(item, i, stage) {
        var scene = stage.childs[0];
        var nodeRobot = new JTopo.Node(item.DeviceID);
        nodeRobot.setSize(item.Size, item.Size);
        nodeRobot.DeviceType = item.DeviceType;
        nodeRobot.setLocation(item.Coordinate_X, item.Coordinate_Y);
        nodeRobot.setLocation(fixXY(item.Coordinate_X), fixXY(item.Coordinate_Y));
        scene.add(nodeRobot);
    };

    /**
     * 创建新节点
     * @param {String} type 设备类型 见常量DEVICETYPE
     * @param {Number} x  节点坐标
     * @param {Number} y  节点坐标
     */
    const createNode = function(type, x, y, dir) {
        const node = new JTopo.Node(createNodeIndex);

        node.devType = type;
        node.font = '16px Consolas';
        node.fontColor = '255,255,35';
        node.textPosition = 'Middle_Center';
        node.setSize(BACEWHPX, BACEWHPX);
        switch (type) {
            //V 水平，T 垂直
            case 'convery-t':
                node.direction = 'T';
                node.dir = dir || 'top-bottom';
                break;
            case 'convery-v':
                node.direction = 'V';
                node.dir = dir || 'left-right';
                break;
            case 'srm':
                break;
            case 'robot':
                break;
            case 'goods':
                node.setSize(goodsPX, goodsPX);
                break;
            default:
                break;
        }

        if (dir) {
            node.setImage(IMGSRC[dir]);
        } else {
            node.setImage(IMGSRC[type]);
        }

        createNodeIndex++;
        //node.setLocation(-11, -6);
        //node.selected = true;
        scene.add(node);

        //修复位置

        fix(x, y);
        node.mouseup(function(e) {
            fix(e.x, e.y);
            //node.setCenterLocation(fixXY(e.x), fixXY(e.y));
            currentNode = this;
            // if (e.button == 2) {
            //     configVue.contextmenu = true;
            //     configVue.contextmenuXY = [e.pageX, e.pageY];
            // }
        });

        function fix(x, y) {
            if (type == 'goods') {
                node.setCenterLocation(fixXY(x, goodsPX), fixXY(y, goodsPX));
            } else {
                node.setCenterLocation(fixXY(x), fixXY(y));
            }
        }
    };

    /**
     * //吸附功能
     * @param {Number} num  要修复的数据
     * @param {Number} base  吸附的参考值
     */
    const fixXY = function(num, base = BACEWHPX) {
        const n = Number(num);
        let data = 0;
        // if (n < base) {
        //     return 0;
        // }
        if (Math.abs(n) > base) {
            const m = parseInt(n / base);

            if (Math.abs(n) % base > base / 2) {
                data = (m + 1) * base;
            } else {
                data = m * base;
            }
        }
        return data;
    };

    /**
     * 提交数据
     */
    const commit = function() {
        console.log(scene.childs);

        const dir2flow = function(type) {
            switch (type) {
                case 'top-bottom':
                    return 'UD';
                    break;
                case 'top':
                    return 'U';
                    break;
                case 'bottom':
                    return 'D';
                    break;
                case 'left-right':
                    return 'LR';
                    break;
                case 'left':
                    return 'L';
                    break;
                case 'right':
                    return 'R';
                    break;
                default:
                    return '';
                    break;
            }
        };

        const data = scene.childs.map(item => {
            return {
                DeviceID: item.text,
                DeviceCode: item.text,
                DeviceType: DEVICETYPE[item.devType],
                InteractiveType: 1,
                Coordinate_X: item.x,
                Coordinate_Y: item.y,
                Coordinate_Z: 1,
                Flow: dir2flow(item.dir),
                Length: 1,
                Width: 1,
                Hight: 1,
                Size: item.devType == 'goods' ? goodsPX : BACEWHPX,
                Direction: item.direction || 'T' // V 水平，T 垂直
            };
        });

        wsRequest(
            {
                messagetype: 'SystemConfig',
                data: data
            },
            function(data) {
                console.log(data);
                // dosomething
                console.log('提交配置后的回调');
                alert(data.Data.Msg);
            }
        );
    };

    /**
     * 克隆节点
     * @param {*} num
     */
    const cloneNode = function(num) {
        if (num == 0) {
            return;
        }
        const x = currentNode.x;
        const y = currentNode.y;
        const type = currentNode.devType;
        const bacePX = type == 'goods' ? goodsPX : BACEWHPX;

        new Array(Number(num)).fill(1).forEach((item, i) => {
            console.log(i);

            if (currentNode.direction == 'T') {
                createNode('convery-t', x + bacePX, y + (i + 2) * bacePX, currentNode.dir);
            } else {
                createNode(type, x + (i + 2) * bacePX, y + bacePX, currentNode.dir);
            }
        });
        console.log(currentNode);
    };

    const changeDir = function() {
        const t = ['top', 'bottom', 'top-bottom'];
        const v = ['left', 'right', 'left-right'];

        if (currentNode.direction == 'V') {
            nextDir(v);
        }
        if (currentNode.direction == 'T') {
            nextDir(t);
        }

        function nextDir(arr) {
            let i = arr.indexOf(currentNode.dir);
            if (i == arr.length - 1) {
                i = 0;
                currentNode.dir = arr[0];
            } else {
                i++;
                currentNode.dir = arr[i];
            }
            currentNode.setImage(IMGSRC[currentNode.dir]);
            console.log(currentNode.dir);
        }
    };

    /**
     * 重命名
     * @param {String} name 重命名
     */
    const renameNode = function(name) {
        if (!name) {
            return;
        }
        console.log(currentNode);

        currentNode.text = name;
    };

    /**
     *  交互动作 入口
     */
    const configVue = new Vue({
        el: '#configVue',
        data: {
            contextmenu: false,
            contextmenuXY: [100, 100],
            cloneNum: 1, //复制数量
            rename: ''
        },
        methods: {
            createNode(type) {
                createNode(type, 100, 100);
            },
            renameNode() {
                renameNode(this.rename);
            },
            delNode() {
                scene.remove(currentNode);
                this.contextmenu = false;
            },
            clone() {
                cloneNode(this.cloneNum);
            },
            changeDir() {
                changeDir();
            },
            commit() {
                commit();
            }
        }
    });

    wsRequest({ messagetype: 'getSystemConfig' }, function(data) {
        const dataArr = data.Data;
        createFn(dataArr);
        console.log('收到配置的数据：', dataArr);
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
                case 'PickRobot':
                    //绘制机械手
                    crawPutRobot(item, i, stage);
                    break;
                default:
                    console.log('未知的DeviceType');
                    break;
            }
        });
    };

    return {};
};
