const BACEWHPX = 80;
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

const createTimeStamp = function() {
    const date = new Date();
    return `${date.getFullYear()}${date.getMonth()}${date.getDay()}${date.getTime()}`;
};
//初始编号

const scadaConfig = function(ws) {
    const canvas = document.getElementById('configCanvas');
    setCanvasWH(canvas);
    const stage = new JTopo.Stage(canvas);

    var scene = new JTopo.Scene(stage);
    scene.setBackground(IMGSRC.bg);
    // stage.wheelZoom = 0.85;

    let createNodeIndex = 1;
    let startCopy = false;
    let $copyNode = $('#copyNode');
    let createType = '';
    $copyNode.css({ width: BACEWHPX, height: BACEWHPX });
    //action
    //点击创建
    // $('#createItem>li').on('click', function() {
    //     const type = $(this).attr('data-type');
    //     createNode(type);
    // });

    $('#createItem>li').on('mousedown', function(e) {
        //const type = $(this).attr('data-type');
        //createNode(type);
        createType = $(this).attr('data-type');
        const x = e.pageX - BACEWHPX / 2;
        const y = e.pageY - BACEWHPX / 2;
        startCopy = true;
        console.log(IMGSRC[createType]);

        $copyNode.show().css({ backgroundImage: `url(${IMGSRC[createType]})`, top: y, left: x });
        console.log(e);
    });

    $(document).on('mousemove', function(e) {
        if (startCopy) {
            const x = e.pageX - BACEWHPX / 2;
            const y = e.pageY - BACEWHPX / 2;
            $copyNode.css({ top: y, left: x });
        }
    });

    $(document).on('mouseup', function(e) {
        console.log(canvas.offsetTop);

        // const zoom = stage.wheelZoom;
        console.log();
        // 画布缩放后会有误差， 需 计算 画布放大或缩小的倍数
        if (startCopy) {
            console.log(scene);

            const canvasOffsetTop = canvas.offsetTop;
            const canvasOffsetLeft = canvas.offsetLeft;
            $copyNode.hide();
            createNode(createType, e.pageX - canvasOffsetLeft, e.pageY - canvasOffsetTop);
            startCopy = false;
        }
    });

    // stage.mouseup(function(e) {
    //     console.log(1111);

    //     if (startCopy) {
    //         $copyNode.hide();
    //         createNode(createType, e.x, e.y);
    //         startCopy = false;
    //     }
    // });

    $('#commitConfig').on('click', function() {
        commit();
    });

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
        node.setImage(IMGSRC[type]);
        node.setSize(BACEWHPX, BACEWHPX);
        createNodeIndex++;
        //node.setLocation(-11, -6);
        scene.add(node);

        //拖拽完成修复位置
        node.setCenterLocation(fixXY(x), fixXY(y));

        node.mouseup(function(e) {
            node.setCenterLocation(fixXY(e.x), fixXY(e.y));
        });
    };

    /**
     * //吸附功能
     * @param {Number} num  要修复的数据
     * @param {Number} base  要吸附的数据
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
            MessageID: createTimeStamp(),
            Sender: 'WCS',
            Receivcer: 'WMS',
            ZoneCode: '553EFD8264E94FCC8F355A58C0808419',
            MesssageType: 'SystemConfig',
            UserID: null,
            Password: null,
            data: data
        };
        console.log(reqData);
    };

    return {};
};
