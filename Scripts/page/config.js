/**a
 * 设置canvas宽高
 * @param {DOMNode} c
 */
/*const setCanvasWH = function(c) {
    const width_Pscreen = $(window).width(); //获取父级窗口的宽度
    const heigth_Pscreen = $(window).height();

    $(function() {
        $(c).attr('width', $(window).get(0).innerWidth);
        $(c).attr('height', $(window).get(0).innerHeight);
    });
};*/
const BACEWHPX = 50;
const SHOWMENU = false; // 是否显示菜单栏
const scadaUntil = {
    /**
     * 创建时间戳
     */
    createTimeStamp() {
        const date = new Date();
        return date.getTime() + '' + Math.ceil(Math.random() * 1000);
        // return date.getTime();
    }
};

/**a
 * 设置canvas宽高
 * @param {DOMNode} c
 */
const setCanvasWH = function(c) {
    /*const width_Pscreen = $(window).width(); //获取父级窗口的宽度
    const heigth_Pscreen = $(window).height();
    $(c).attr('width', $(window).get(0).innerWidth);
    $(c).attr('height', $(window).get(0).innerHeight);*/
    const width_Pscreen = $(window).width(); //获取父级窗口的宽度
    const heigth_Pscreen = $(window).height();

    $(function() {
        $(c).attr('width', $(window).get(0).innerWidth);
        $(c).attr('height', $(window).get(0).innerHeight);
    });
};
