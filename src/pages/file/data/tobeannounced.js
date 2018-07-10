import * as api from '@/api'
const user = JSON.parse(localStorage.getItem('user'))
let headers = {}
if (user) {
  headers = {Authorization: `Bearer ${user.token}`}
}
const data = {
  columns: [
    {
      value: 'report_id',
      label: '编号',
      width: 80
    }, {
      value: 'report_name',
      label: '公文名称',
      formatter: row => row.report_name.length > 10 ? row.report_name.substring(0, 10) + '...' : row.report_name
    }, {
      value: 'examine_admin_nick',
      label: '审核人',
      width: 100,
      formatter: row => row.examine_admin_nick === '' ? '暂无' : row.examine_admin_nick
    }, {
      value: 'examine_add_admin_nick',
      label: '发布人'
    }, {
      value: 'examine_info',
      label: '审核信息',
      formatter: row => row.examine_info === '' ? '暂无' : row.examine_info.length > 10 ? row.examine_info.substring(0, 10) + '...' : row.examine_info
    }, {
      value: 'updated_at',
      label: '处理时间'
    }, {
      value: 'is_examine',
      label: '审核状态',
      formatter: row => row.is_examine === 0 ? '未审核' : row.is_examine === 1 ? '审核通过' : '审核未通过'
    }
  ],
  searchItem: [
    {
      eleType: 'search',
      value: 'keyword',
      plh: '请输入公文编号或名称'
    }
  ],
  editItem: [
    {
      eleType: 'input',
      label: '公文名称',
      disabled: true,
      value: 'report_name'
    }, {
      eleType: 'input',
      value: 'report_title',
      disabled: true,
      label: '公文标题'
    }, {
      eleType: 'select',
      value: 'report_type',
      label: '公文类型',
      disabled: true,
      options: [
        {
          value: '1',
          label: '风险报告'
        }
      ]
    }, {
      eleType: 'select',
      value: 'to_admin_id',
      filterable: 'filterable',
      label: '主送业主',
      disabled: true,
      filter: 'filterable',
      options: []
    }, {
      eleType: 'input',
      value: 'scan_times',
      number: 'number',
      label: '扫描次数'
    }, {
      eleType: 'select',
      value: 'risk_level',
      label: '危险等级',
      options: [
        {
          value: 1,
          label: '绝对安全'
        }, {
          value: 2,
          label: '比较安全'
        }, {
          value: 3,
          label: '相对危险'
        }, {
          value: 4,
          label: '绝对危险'
        }
      ]
    }, {
      eleType: 'date',
      value: 'deal_time',
      label: '建议处理时间',
      disabled: true
    }, {
      eleType: 'textarea',
      value: 'deal_opinion',
      label: '处理建议',
      disabled: true
    }, {
      eleType: 'select',
      value: 'status',
      label: '审核状态',
      disabled: true,
      options: [
        {
          value: 0,
          label: '未读'
        }, {
          value: 1,
          label: '已读'
        }, {
          value: 2,
          label: '已回执'
        }, {
          value: 3,
          label: '回执未通过'
        }, {
          value: 4,
          label: '审核通过'
        }, {
          value: 5,
          label: '超时'
        }, {
          value: 6,
          label: '再次整改已回执'
        }
      ]
    }, {
      eleType: 'input',
      value: 'updated_at',
      label: '发送时间',
      disabled: true
    }, {
      eleType: 'uploadfile',
      value: 'files[]',
      label: '附件上传',
      filelist: [],
      nofile: '无',
      headers: headers,
      action: api.config.url + api.file.uploadFiles,
      name: 'files[]',
      per: true
    }, {
      eleType: 'url',
      value: 'fileurl',
      name: '整改模板.doc',
      label: '整改模板',
      url: 'http://files.d.weknet.cn/app/files/zgmb/整改模板.doc'
    }, {
      eleType: '',
      value: 'file_name'
    }, {
      eleType: '',
      value: 'file_path'
    }
  ],
  gongwenRule: {
    report_name: [
      {
        type: 'string',
        required: true,
        message: '请输入公文名称',
        trigger: 'danger'
      }
    ],
    report_title: [
      {
        type: 'string',
        required: true,
        message: '请输入公文标题',
        trigger: 'danger'
      }
    ],
    to_admin_id: [
      {
        type: 'number',
        required: true,
        message: '请选择业主',
        trigger: 'danger'
      }
    ],
    deal_opinion: [
      {
        type: 'string',
        required: true,
        message: '请输入建议',
        trigger: 'danger'
      }
    ],
    scan_times: [
      {
        type: 'number',
        required: true,
        message: '请输扫描次数',
        trigger: 'danger'
      }
    ],
    report_type: [
      {
        type: 'string',
        required: true,
        message: '请选择公文类型',
        trigger: 'danger'
      }
    ],
    risk_level: [
      {
        type: 'number',
        required: true,
        message: '请选择危险等级',
        trigger: 'danger'
      }
    ]
  },
  verifyreport: [
    {
      eleType: 'input',
      value: 'examine_info',
      label: '审核意见'
    }, {
      eleType: 'select',
      value: 'is_examine',
      label: '审核意见',
      options: [
        {
          value: 2,
          label: '审核不通过'
        }, {
          value: 1,
          label: '审核通过'
        }
      ]
    }, {
      eleType: '',
      value: 'examine_id',
      label: ''
    }
  ],
  VerifyRule: {
    examine_info: {
      type: 'string',
      required: true,
      message: '请输入审核意见',
      trigger: 'danger'
    },
    is_examine: {
      type: 'number',
      required: true,
      message: '请选择审核结果',
      trigger: 'danger'
    }
  }
}

export default data
