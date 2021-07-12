const menuPortal = [
  {
    title: '审批中心',
    url: '/bpm/approval/center',
  },
  {
    title: '组织树',
    url: '/org/chart',
  },
  {
    title: '组织管理',
    url: '/org/list',
    subMenus: [
      {
        ittle: '创建组织',
        url: '/org/create/0/createOrg/0/0',
        hidden: true,
      },
    ],
  },
  {
    title: '角色管理',
    url: '/roles',
    target: '_blank',
  },
  {
    title: '人员管理',
    url: '/users',
  },
  {
    title: '权限管理',
    url: '/auth',
  },
  {
    title: '审批模板',
    url: '/bpm/template',
  },
  {
    title: '文件管理',
    url: '/files',
    hidden: true,
  },
  {
    title: '岗位代理',
    url: '/position/agent',
  },
  {
    title: '轮岗申请',
    url: '/position/transfer',
  },
  {
    title: '岗位列表',
    url: '/position/list',
  },
]

const menuSupplier = [
  {
    title: '供应商360',
    url: '/supplier/supplierList',
  },
]

export default [
  {
    icon: 'iconhomeweixuanzhong',
    activeIcon: 'iconhomexuanzhong',
    title: '',
    key: 'first',
    url: '/index',
  },
  {
    icon: 'iconworkbenchweixuanzhong',
    activeIcon: 'iconworkbenchxuanzhong',
    title: '',
    key: 'tow',
    url: '/supplier',
    target: '_blank',
    subMenus: menuSupplier,
  },
  {
    icon: 'iconcommonfunctionweixuanzhong',
    activeIcon: 'iconcommonfunctionxuanzhong',
    title: '',
    key: 'three',
    url: '/bpm',
    subMenus: menuPortal,
  },
]
