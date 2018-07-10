<template>
<div id="new-form-base">
  <el-form v-loading.body="loading" :model="formData" :rules="formRule" ref="formData" :inline="inline" :label-width="labelWidth || '80px'" class="form">
    <el-form-item v-for="(item, index) in formItem" :key="index" :label="(item.per === false && item.eleType === 'uploadfile') ? '附件列表' : item.label" :prop="item.value">
      <!-- 搜索框 -->
      <el-input v-if="item.eleType === 'search'" v-model="formData[item.value]" :placeholder="item.plh" :icon="close ? 'close' : ''" :on-icon-click="handleClose" @keyup.enter.native="search"></el-input>
      <!-- 输入框, 文本域 -->
      <el-input v-if="item.eleType === 'input' && item.number !== 'number'" :type="item.iptType" v-model="formData[item.value]" :placeholder="item.plh" :disabled="item.disabled"></el-input>
      <!-- 输入框, 文本域 -->
      <el-input v-if="item.eleType === 'input' && item.number === 'number'" type="number" v-model.number="formData[item.value]" :placeholder="item.plh" :disabled="item.disabled"></el-input>
      <!-- 输入框, 文本域 -->
      <!-- <el-input v-if="item.eleType === 'datetime'" type="date" v-model="formData[item.value]" :placeholder="item.plh" :disabled="item.disabled"></el-input> -->
      <!-- 输入框, 文本域 -->
      <el-input v-if="item.eleType === 'textarea'" type="textarea" v-model="formData[item.value]" :placeholder="item.plh" :disabled="item.disabled"></el-input>
      <!-- 下拉框 -->
      <el-select v-if="item.eleType === 'select'" v-model="formData[item.value]" :placeholder="item.plh" :disabled="item.disabled" :filterable="item.filter">
        <el-option filterable v-for="(opt, index) in item.options" :key="index" :label="opt.label" :value="opt.value" :disabled="opt.disabled"></el-option>
      </el-select>
      <!-- 日期 -->
      <el-date-picker v-if="item.eleType === 'date'" type="datetime" :placeholder="item.plh" v-model="formData[item.value]" @change="getTime" :disabled="item.disabled"></el-date-picker>
      <!-- 时间 -->
      <el-time-picker v-if="item.eleType === 'time'" :placeholder="item.plh" v-model="formData[item.value]" :disabled="item.disabled"></el-time-picker>
      <el-switch v-if="item.eleType === 'switch'" on-text="" off-text="" v-model="formData[item.value]"></el-switch>
      <!-- 多选框 -->
      <el-checkbox-group v-if="item.eleType === 'checkbox'" v-model="formData[item.value]">
        <el-checkbox v-for="(opt, index) in item.options" :key="index" :label="opt.value" :disabled="item.disabled">{{opt.label}}</el-checkbox>
      </el-checkbox-group>
      <!-- 单选框 -->
      <el-radio-group v-if="item.eleType === 'radio'" v-model="formData[item.value]">
        <el-radio v-for="(opt, index) in item.options" :key="index" :label="opt.value" :disabled="item.disabled">{{opt.label}}</el-radio>
      </el-radio-group>
      <!-- <div v-if="item.eleType === 'uploadfile'">
        <input type="file" multiple style="display:none" id="uploadfiles">
        <el-button class="" size='small' icon='plus' type="primary" @click="uploadfile"><em>点击上传</em></el-button>
        <p style="padding: 0;line-height:20px;font-size: 16px;" v-for="(item, index) in filelist">{{index + 1}}.&nbsp;&nbsp;&nbsp;{{item.name}} <i class="el-icon-success" style=""></i></p>
      </div> -->
      <!-- 链接 -->
      <a :href="item.url" v-if="item.eleType === 'url'" style="color: #3E92F2">{{item.name}}</a>
      <el-upload :name="item.name" :action="item.action" :headers="item.headers" style="text-indent: 5px" class="upload-demo" v-if="item.eleType === 'uploadfile'" :on-preview="showFileDetail" :on-remove="fileRemove" :fileList="item.filelist" :on-success="fileUploadSuccess">
      <el-button style="border:none" v-if="item.filelist.length === 0 && !item.per">{{item.nofile}}</el-button>
      <el-button v-if="item.per" class="" size='small' icon='plus' type="primary" @click="uploadfile"><em>点击上传</em></el-button>
      </el-upload>
    </el-form-item>
    <slot> </slot>
  </el-form>
</div>
</template>
<script>
export default {
  name: 'new-form-base',
  props: {
    inline: Boolean, // 行内表单模式
    labelWidth: String, // 表单域标签的宽度
    formItem: Array, // 表单元素
    formRule: Object // 表单规则
  },
  data: () => ({
    filelist: [],
    close: false,
    loading: false,
    formData: {}
  }),
  created() {
    this.dataType()
  },
  watch: {
    // 搜索
    formData: {
      handler: function(val) {
        this.formItem.map(item => {
          if (item.eleType === 'search') {
            this.close = val[item.value] ? 'true' : false
          }
        })
      },
      deep: true
    }
  },
  methods: {
    // 初始数据类型
    dataType() {
      this.formItem.map(item => {
        this.$set(this.formData, item.value, item.eleType === 'checkbox' ? [] : item.eleType === 'switch' ? false : '')
      })
    },
    // 搜索
    handleClose() {
      this.formItem.map(item => {
        if (item.eleType === 'search') {
          this.formData[item.value] = ''
          this.$emit('query', this.formData)
        }
      })
    },
    fileOnChange(e) {
    },
    fileUploadSuccess(response, file, fileList) {
      let code = response.code
      let data = response.data
      if (code === 1) {
        let url = this.$refs['formData'].model['file_path'] === null ? '' : this.$refs['formData'].model['file_path']
        let name = this.$refs['formData'].model['file_name'] === null ? '' : this.$refs['formData'].model['file_name']
        this.$refs['formData'].model['file_path'] = url + data.file_path
        this.$refs['formData'].model['file_name'] = name + data.file_name
      }
    },
    uploadfile() {
    },
    getTime(val) {
      this.formData['deal_time'] = val
    },
    // 文件删除
    fileRemove(file, fileList) {
      let filename = file.name
      let fileurl = file.url
      let temparr = fileurl.split('/')
      let length = temparr.length
      fileurl = temparr[length - 3] + '/' + temparr[length - 2] + '/' + temparr[length - 1]
      let temp = this.formData
      let yy = temp['file_name'].replace(filename + '|', '')
      let xx = temp['file_path'].replace(fileurl + '|', '')
      this.formData['file_name'] = yy
      this.formData['file_path'] = xx
    },
    showFileDetail(file) {
      window.open(file.url)
    },
    // 初始详情数据
    query(url, para, info, patch) {
      this.loading = true
      // 直接从 scope 中获取数据
      if (!url && !para) {
        this.loading = false
        this.formData = Object.assign({}, info)
        return
      }
      // 通过接口获取数据
      this.axios.get(url, {
        params: para
      }).then(res => {
        this.loading = false
        const {
          data
        } = res.data
        this.formData = Object.assign({}, data[info])
        // 是否重组数据结构
        if (patch === 'patch') {
          this.$emit('patch', this.formData)
        }
      }).catch(error => {
        this.loading = false
        console.log(error)
      })
    },
    // 补充详情数据
    patch(url) {
      this.loading = true
      this.axios.get(url).then(res => {
        this.loading = false
        const {
          data
        } = res.data
        this.formData = {
          ...this.formData,
          ...Object.assign({}, data)
        }
        this.$emit('patch', this.formData)
      }).catch(error => {
        this.loading = false
        console.log(error)
      })
    },
    // 合并详情数据
    merge(data) {
      this.formData = Object.assign({}, data)
    },
    // 保存表单数据
    save(url, para) {
      // this.loading = true
      this.axios.post(url, para).then(res => {
        // this.loading = false
        this.$emit('query')
        this.$message.success(res.data.msg)
      }).catch(error => {
        console.log(error)
      })
    },
    // 提交表单
    submit() {
      this.$refs['formData'].validate(valid => {
        if (valid) {
          this.$emit('submit', this.formData)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置表单
    reset() {
      this.$refs['formData'].resetFields()
    },
    // 搜索表单
    search() {
      this.$emit('query', this.formData)
    }
  }
}
</script>
<style lang='scss'>
.el-table th.is-leaf{
    background-color: #3E92F2;
    .cell{
      background-color: #3E92F2;
      color: #fff;
    }
}
</style>
<style lang="scss">
#new-form-base {
  .el-upload-list__item:first-child{
    margin-top: 5px;
  }
}
</style>
