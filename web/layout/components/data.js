/*
 * @Author: yuszhou
 * @Date: 2021-02-23 16:43:12
 * @LastEditTime: 2021-03-25 23:39:29
 * @LastEditors: Please set LastEditors
 * @Description: components data and function
 * @FilePath: \rise\src\layout\components\data.js
 */

//界面左边条目btn列表
export const iconData = [
  {
    icon: 'iconhomeweixuanzhong',
    acIcon: 'iconhomexuanzhong',
    active: false,
    key: 'first',
    path: '/partsign',
    // path: "/approval/template",
    menuData: []
  },
  {
    icon: 'iconworkbenchweixuanzhong',
    acIcon: 'iconworkbenchxuanzhong',
    active: false,
    key: 'tow',
    path: '/priceorder/stocksheet',
    // path: '/partsprocure',
    menuData: []
  },
  {
    icon: 'iconcommonfunctionweixuanzhong',
    acIcon: 'iconcommonfunctionxuanzhong',
    active: false,
    key: 'three',
    // path: '/partsrfq',
    path: '/priceorder/postmanagement',
    menuData: [
      {
        label: '任务中心',
        active: false,
        key: 1,
        path: '/taskcenter',
        languagekey: 'LK_RENWUZHONGXIN'
      }
    ]
  }
]

export const menuData = [
  {
    label: '菜单测试目录',
    active: true,
    key: 1
  },
  {
    label: '菜单测试目录',
    active: false,
    key: 2
  },
  {
    label: '菜单测试目录',
    active: false,
    key: 3
  },
  {
    label: '菜单测试目录',
    active: false,
    key: 4
  }
]

export const messageTypeMap = {
  '4': 'message',
  '5': 'notice'
}
