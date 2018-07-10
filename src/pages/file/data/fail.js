const data = {
  columns: [
    {
      value: 'file_number',
      label: '公文编号'
    }, {
      value: 'file_name',
      label: '公文名称'
    }, {
      value: 'file_type',
      label: '公文类型',
      width: 120
    }, {
      value: 'file_title',
      label: '公文标题'
    }, {
      value: 'file_port',
      label: '主送部门'
    }, {
      value: 'managerOptions',
      label: '处理建议',
      width: 120
    }, {
      value: 'update_at',
      label: '处理时间'
    }, {
      value: 'fileFormat',
      label: '文件格式',
      width: 100
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
      value: 'file_name'
    }, {
      eleType: 'select',
      value: 'file_type',
      label: '公文类型',
      options: [
        {
          value: '111',
          label: '111'
        }
      ]
    }, {
      eleType: 'input',
      value: 'file_title',
      label: '公文标题'
    }, {
      eleType: 'select',
      value: 'file_port',
      label: '主送部门',
      options: [
        {
          vaue: '111',
          label: '123123'
        }
      ]
    }, {
      eleType: 'select',
      value: 'managerStatus',
      label: '处理状态',
      options: [
        {
          value: '1',
          label: '是'
        }, {
          value: '0',
          label: '否'
        }
      ]
    }, {
      eleType: 'select',
      value: 'verifyStatus',
      label: '审核状态',
      options: [
        {
          value: '1',
          label: '是'
        }, {
          value: '0',
          label: '否'
        }
      ]
    }, {
      eleType: 'input',
      value: 'update_at',
      label: '处理时间',
      disabled: true
    }
  ]
}

export default data
