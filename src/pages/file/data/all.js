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
      value: 'report_type',
      label: '公文类型',
      width: 100,
      formatter: row => row.report_type === '1' ? '风险报告' : ''
    }, {
      value: 'report_title',
      label: '公文标题',
      formatter: row => row.report_title.length > 10 ? row.report_title.substring(0, 10) + '...' : row.report_title
    }, {
      value: 'company_name',
      label: '接收业主'
    }, {
      value: 'deal_opinion',
      label: '处理建议',
      formatter: row => row.deal_opinion.length > 10 ? row.deal_opinion.substring(0, 10) + '...' : row.deal_opinion
    }, {
      value: 'updated_at',
      label: '发送时间'
    }, {
      value: 'deal_time',
      label: '建议处理时间'
    }, {
      value: 'status',
      label: '流程状态',
      width: 100,
      formatter: row => row.status === 0 ? '整改已发送' : row.status === 1 ? '整改中' : row.status === 2 ? '整改回执' : row.status === 3 ? '再次整改已发送' : row.status === 4 ? '审核通过' : row.status === 6 ? '再次整改已回执' : '超时'
    }, {
      value: 'is_read',
      label: '阅读状态',
      status: 'reading',
      formatter: row => row.is_read === 1 ? '已读' : '未读'
    }
  ],
  // 搜索表单元素
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
  report: [
    {
      eleType: 'textarea',
      value: 'report_info',
      label: '回执内容'
    }, {
      eleType: 'uploadfile',
      value: 'files',
      label: '附件上传',
      filelist: [],
      per: true,
      headers: headers,
      action: api.config.url + api.file.uploadFiles,
      name: 'files[]'
    }, {
      eleType: '',
      value: 'report_id',
      label: ''
    }, {
      eleType: '',
      value: 'file_name',
      label: ''
    }, {
      eleType: '',
      value: 'file_path',
      label: ''
    }, {
      eleType: '',
      value: 'admin_id',
      label: ''
    }
  ],
  ReportRule: {
    report_info: {
      type: 'string',
      required: true,
      message: '请输入回执内容',
      trigger: 'danger'
    }
  },
  verifyreport: [
    {
      eleType: 'input',
      value: 'deal_opinion',
      label: '审核意见'
    }, {
      eleType: '',
      value: 'report_id',
      label: ''
    }
  ],
  VerifyRule: {
    deal_opinion: {
      type: 'string',
      required: true,
      message: '请输入审核意见',
      trigger: 'danger'
    }
  }
}

export default data
