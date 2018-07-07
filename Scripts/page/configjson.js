const STATIONBASEDATA = {
    STA: {
        actionButton: {
            updateInfo: {
                name: '修改信息',
                isPublic: 1
            },
            delInfo: {
                name: '一键删除',
                isPublic: 1
            },
            getInfo: {
                name: '一键申请',
                isPublic: 1
            },
            normalRemove: {
                name: '正常排出',
                isPublic: 0
            },
            abnormalRemove: {
                name: '异常排出',
                isPublic: 0
            },
            jKMS: {
                name: '调mes接口',
                isPublic: 0
            },
            fullInbound: {
                name: '实盘入库',
                isPublic: 0
            },
            emptyInbound: {
                name: '空盘入库',
                isPublic: 0
            },
            standOneInbound: {
                name: '常温1入库',
                isPublic: 0
            },
            standTwoInbound: {
                name: '常温2入库',
                isPublic: 0
            }
        },
        urlButton: {
            wcsLink: {
                name: 'wcs链接',
                isPublic: 0,
                url: ''
            },
            wmsLink: {
                name: 'wms链接',
                isPublic: 0,
                url: ''
            },
            fixexpueceLink: {
                name: '维修链接',
                isPublic: 0,
                url: ''
            }
        },
        goodsType: {
            '1': {
                name: '空托盘'
            },
            '2': {
                name: '实托盘'
            },
            '3': {
                name: '复测托盘'
            },
            '4': {
                name: '异常托盘'
            }
        }
    },
    SRM: {
        actionButton: {
            updateInfo: {
                name: '修改信息',
                isPublic: 1
            },
            delInfo: {
                name: '一键删除',
                isPublic: 1
            }
        },
        command: {
            '1': {
                name: '移动'
            },
            '2': {
                name: '取放货'
            },
            '3': {
                name: '召回'
            },
            '4': {
                name: '取消任务'
            },
            '5': {
                name: '消防任务'
            }
        },
        urlButton: {
            wcsLink: {
                name: 'wcs链接',
                isPublic: 0,
                url: ''
            },
            wmsLink: {
                name: 'wms链接',
                isPublic: 0,
                url: ''
            },
            fixexpueceLink: {
                name: '维修链接',
                isPublic: 0,
                url: ''
            }
        }
    }
};

const ACTIONBUTTON = {
    updateInfo: {
        name: '修改信息',
        isPublic: 1
    },
    delInfo: {
        name: '一键删除',
        isPublic: 1
    },
    getInfo: {
        name: '一键申请',
        isPublic: 1
    },
    normalRemove: {
        name: '正常排出',
        isPublic: 0
    },
    abnormalRemove: {
        name: '异常排出',
        isPublic: 0
    },
    jKMS: {
        name: '调mes接口',
        isPublic: 0
    },
    fullInbound: {
        name: '实盘入库',
        isPublic: 0
    },
    emptyInbound: {
        name: '空盘入库',
        isPublic: 0
    },
    standOneInbound: {
        name: '常温1入库',
        isPublic: 0
    },
    standTwoInbound: {
        name: '常温2入库',
        isPublic: 0
    }
};

const URLBUTTON = {
    wcsLink: {
        name: 'wcs链接',
        isPublic: 0,
        url: ''
    },
    wmsLink: {
        name: 'wms链接',
        isPublic: 0,
        url: ''
    },
    fixexpueceLink: {
        name: '维修链接',
        isPublic: 0,
        url: ''
    }
};

const GOODSTYPE = {
    '0': {
        name: '无'
    },
    '1': {
        name: '空托盘(1)'
    },
    '2': {
        name: '实托盘(2)'
    },
    '3': {
        name: '复测托盘(3)'
    },
    '4': {
        name: '异常托盘(4)'
    }
};

const EN2EH = {
    DeviceID: '站台号',
    TaskNum: '任务号',
    FromStation: '起始地址',
    ToStation: '目标地址',
    TrayCode: '托盘条码',
    GoodsType: '货物类型',
    Load1Status: '工位1载货状态',
    Load2Status: '工位2载货状态',
    b_I_Row: '当前位置',
    b_I_State: '执行状态',
    b_I_TaskId1: '工位1任务号',
    b_I_TaskId2: '工位2任务号',
    b_I_TaskStatus1: '任务1状态',
    b_I_TaskStatus2: '任务2状态',
    IsInit: '是否初始化完成',
    SendFlag: '是否允许下发'
};

const STATIONS = {
    '2018': {
        deviceType: 'STA',
        DeviceID: '1028',
        warm: '',
        InfoData: {
            TaskNum: '1',
            FromStation: '1',
            ToStation: '1',
            TrayCode: '1',
            GoodsType: '1'
        },
        ButtonData: {
            updateInfo: {},
            delInfo: {
                TaskNum: 0,
                FromStation: 0,
                ToStation: 0,
                TrayCode: 0,
                GoodsType: 0
            },
            getInfo: {},
            normalRemove: {
                ToStation: '2022'
            },
            abnormalRemove: {
                GoodsType: '4',
                ToStation: '2022'
            }
        }
    },
    '2002': {
        button: ['normalRemove', 'abnormalRemove'],
        data: {
            normalRemove: {
                ToStation: '2022'
            },
            abnormalRemove: {
                GoodsType: '5',
                ToStation: '2022'
            }
        }
    }
};

// 货位状态
const LOCATIONSTATE = {
    A_empty_Empty: 'A类'
};
