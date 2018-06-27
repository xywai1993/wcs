/**
 *  yiper.fan 学不进  2018.6.22
 */

/**a
 * 设置canvas宽高
 * @param {DOMNode} c
 */
const setCanvasWH = function(c) {
    const width_Pscreen = $(window).width(); //获取父级窗口的宽度
    const heigth_Pscreen = $(window).height();
    $(c).attr('width', $(window).get(0).innerWidth);
    $(c).attr('height', $(window).get(0).innerHeight);
};

//初始编号

const scadaConfig = function(ws) {
    const BACEIMGURL = '../../Content/img/';
    const IMGSRC = {
        'convery-t': BACEIMGURL + 'guntongHs.png',
        'convery-v': BACEIMGURL + 'guntongSs.png',
        srm: BACEIMGURL + 'sc.png',
        robot: BACEIMGURL + 'robot.png',
        bg: BACEIMGURL + 'bg.jpg'
    };
    const DEVICETYPE = {
        'convery-t': 'Convery',
        'convery-v': 'Convery',
        srm: 'SRM',
        robot: 'PutRobot'
    };

    const canvas = document.getElementById('configCanvas');
    setCanvasWH(canvas);
    const stage = new JTopo.Stage(canvas);
    const scene = new JTopo.Scene(stage);
    scene.setBackground(IMGSRC.bg);
    //stage.wheelZoom = 0.85;

    let createNodeIndex = 1;
    let startCopy = false;
    let currentNode = null;
    const $copyNode = $('#copyNode');
    const $contextmenu = $('#configContextmenu');
    let createType = '';

    //
    stage.click(function(e) {
        if (e.button == 0) {
            configVue.contextmenu = false;
        }
    });

    scene.dbclick(function(event) {
        if (event.target == null) return;
        const e = event.target;
        console.log(event);

        configVue.contextmenu = true;
        configVue.contextmenuXY = [event.pageX + 30, event.pageY + 30];
    });
    /**
     * 创建新节点
     * @param {String} type 设备类型 见常量DEVICETYPE
     * @param {Number} x  节点坐标
     * @param {Number} y  节点坐标
     */
    const createNode = function(type, x, y) {
        const node = new JTopo.Node(createNodeIndex);
        switch (type) {
            case 'convery-t':
                node.direction = 'T';
                break;
            case 'convery-v':
                node.direction = 'V';
                break;
            case 'srm':
                break;
            case 'robot':
                break;
            default:
                break;
        }
        node.devType = type;
        node.font = '16px';
        node.textPosition = 'Middle_Center';
        node.setImage(IMGSRC[type]);
        node.setSize(BACEWHPX, BACEWHPX);
        createNodeIndex++;
        //node.setLocation(-11, -6);
        //node.selected = true;
        scene.add(node);

        //修复位置
        node.setCenterLocation(fixXY(x), fixXY(y));

        node.mouseup(function(e) {
            node.setCenterLocation(fixXY(e.x), fixXY(e.y));
            currentNode = this;
            // if (e.button == 2) {
            //     configVue.contextmenu = true;
            //     configVue.contextmenuXY = [e.pageX, e.pageY];
            // }
        });
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
        const data = scene.childs.map(item => {
            return {
                DeviceID: item.text,
                DeviceCode: item.text,
                DeviceType: DEVICETYPE[item.devType],
                InteractiveType: 1,
                Coordinate_X: item.x,
                Coordinate_Y: item.y,
                Coordinate_Z: 1,
                Length: 1,
                Width: 1,
                Hight: 1,
                Direction: item.direction || 'T' // V 水平，T 垂直
            };
        });

        const reqData = {
            MessageID: scadaUntil.createTimeStamp(),
            Sender: 'WCS',
            Receivcer: 'WMS',
            ZoneCode: '553EFD8264E94FCC8F355A58C0808419',
            MesssageType: 'SystemConfig',
            UserID: null,
            Password: null,
            data: data
        };
        console.log(reqData);
        ws.send(reqData);
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

        new Array(Number(num)).fill(1).forEach((item, i) => {
            console.log(i);
            if (currentNode.direction == 'T') {
                createNode(createType, x + BACEWHPX, y + (i + 2) * BACEWHPX);
            } else {
                createNode(createType, x + (i + 2) * BACEWHPX, y + BACEWHPX);
            }
        });
        console.log(currentNode);
    };

    /**
     * 重命名
     * @param {String} name 重命名
     */
    const renameNode = function(name) {
        if (!name) {
            return;
        }
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
                createType = type;
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
            commit() {
                commit();
            }
        }
    });

    return {};
};
