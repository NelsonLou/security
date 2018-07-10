const data = {
  // 表格列数据
  columns: [{
    value: 'name',
    label: '标识',
    width: 150
  }, {
    value: 'display_name',
    label: '角色名',
    width: 150
  }, {
    value: 'description',
    label: '说明',
    minw: 250
  }, {
    value: 'r_level',
    label: '角色等级',
    width: 200,
    formatter: row => row.r_level === 1
      ? '最高权限'
      : row.r_level === 2
        ? '业主权限'
        : row.r_level === 3
          ? '民警权限'
          : ''
  }, {
    value: 'created_at',
    label: '创建时间',
    width: 200
  }],
  // 编辑表单元素
  editItem: [
    {
      eleType: 'input',
      label: '标识（英文）',
      value: 'name',
      plh: '请输入标识（英文）'
    }, {
      eleType: 'input',
      label: '角色名称',
      value: 'display_name',
      plh: '请输入角色名称'
    }, {
      eleType: 'select',
      label: '角色等级',
      value: 'r_level',
      plh: '请选择角色等级',
      options: [{
        label: '最高权限',
        value: 1
      }, {
        label: '业主权限',
        value: 2
      }, {
        label: '民警权限',
        value: 3
      }]
    }, {
      eleType: 'input',
      label: '说明',
      value: 'description',
      plh: '请输入说明',
      iptType: 'textarea'
    }
  ],
  // 编辑表单验证
  editRule: {
    name: [{
      required: true,
      message: '请输入标识（英文）',
      trigger: 'blur'
    }],
    display_name: [{
      required: true,
      message: '请输入角色名',
      trigger: 'blur'
    }],
    r_level: [{
      required: true,
      message: '请选择角色等级',
      trigger: 'blur',
      type: 'integer'
    }]
  }
}

export default data
