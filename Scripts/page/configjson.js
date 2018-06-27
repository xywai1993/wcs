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
            "1": {
                name: '空托盘'
            },
            "2": {
                name: '实托盘'
            },
            "3": {
                name: '复测托盘'
            },
            "4": {
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
            },
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
}


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
}

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
}

const GOODSTYPE = {
    "1": {
        name: '空托盘'
    },
    "2": {
        name: '实托盘'
    },
    "3": {
        name: '复测托盘'
    },
    "4": {
        name: '异常托盘'
    }
}

const STATIONS= {
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
