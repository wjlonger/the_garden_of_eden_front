<template>
  <div class="cnode-container">
    <m-box>
      <el-button type="text" @click="dialogFormVisible = true">开始新的上线计划</el-button>
      <el-timeline>
        
          <el-timeline-item v-for="online in onlineList" :key="online.id">
            <el-card>
              <el-link type="danger" @click.stop.prevent="openNeedOperateDialog(online)" >{{online | formateDate}} 上线计划</el-link>
              <br />
              <el-link type="primary" @click.stop.prevent="openNeedOperateDialog(online)" >{{online | userInfo}}</el-link>
              <el-collapse accordion >
                <el-collapse-item :disabled="online.needList.length === 0">
                  <template slot="title">
                    上线需求<span style="color:#ff0000; margin-left:5px;">[{{ online.needList.length }}]</span>
                  </template>
                  <el-row :gutter="10">
                    <draggable :list="online.needList" :options="{group:'needList', sort: false,animation:150,scroll:true,scrollSensitivity:200}" 
                     :move="dragMove" >
                     <transition-group>
                      <el-col v-for="(need, needIndex) in online.needList" :key="need.id" :span="8" style="margin-top: 10px;" >
                        <el-card shadow="hover" @click.native="openOnlineNeedDrawer(need)" class="upload-application-title" >
                          {{ needIndex + 1 }}、{{ need | needInfo(onlineNeedTypes) }}
                        </el-card>
                      </el-col>
                      </transition-group>
                    </draggable>
                  </el-row>
                </el-collapse-item>
              </el-collapse>
              <el-collapse accordion>
                <el-collapse-item>
                  <template slot="title">
                    文件库<span style="color:#ff0000; margin-left:5px;">[{{ online.fileList.length }}]</span>
                  </template>
                  <div v-loading="isUploading" element-loading-text="拼命上传中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" >
                    <el-upload class="upload-demo" drag :action="uploadAction + online.id" :show-file-list="false" :on-success="uploadSuccess" :on-progress="uploading" :on-error="uploadErr" >
                      <i class="el-icon-upload"></i>
                      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>
                    <ul class="el-upload-list el-upload-list--picture-card">
                      <li v-for="(file, fileIndex) in online.fileList" :key="file.id" class="el-upload-list__item is-success">
                        <div>
                          <span>{{ file.originName }}</span>
                          <span class="el-upload-list__item-actions">
                            <span class="el-upload-list__item-delete">
                              <a :href="downloadAction + file.id" ><i class="el-icon-download"></i></a>
                            </span>
                            <span class="el-upload-list__item-delete" @click="remove(file.id, online.fileList, fileIndex)"><i class="el-icon-delete"></i></span>
                          </span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </el-collapse-item>
              </el-collapse>
              <el-collapse accordion>
                <el-collapse-item :disabled="online.needList.length === 0">
                  <template slot="title">
                    预览<i class="header-icon el-icon-info"></i>
                  </template>
                  <app-preview :onlineInfo="online" :token="token" ></app-preview>
                </el-collapse-item>
              </el-collapse>
            </el-card>
          </el-timeline-item>
        
      </el-timeline>
    </m-box>

    <el-drawer title="上线计划" :visible.sync="dialogFormVisible" direction="rtl" size="50%" @close='closeOnlineAppDialog'  custom-class="demo-drawer" ref="drawer">
      <div class="demo-drawer__content" style="margin: 0px 25px 0 25px;">
        <el-form :model="onlineAppform" :rules="onlineAppformRules" ref="onlineAppform">
          <el-form-item label="申 请 人" :label-width="formLabelWidth" prop="name">
            <el-select v-model="onlineAppform.name" filterable remote allow-create default-first-option placeholder="请输入关键词" :remote-method="queryPerson">
              <el-option v-for="item in personOptions" :key="item.name" :label="item.name" :value="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手 机 号" :label-width="formLabelWidth" prop="phone">
            <el-input v-model.number="onlineAppform.phone" autocomplete="off" style="width:50%"></el-input>
          </el-form-item>
          <el-form-item label="邮 箱" :label-width="formLabelWidth" prop="email">
            <el-input v-model="onlineAppform.email" autocomplete="off" style="width:50%"></el-input>
          </el-form-item>
          <el-form-item label="上 线 日 期" :label-width="formLabelWidth" prop="date">
            <el-date-picker v-model="onlineAppform.date" value-format="timestamp" align="center" type="date" placeholder="请选择日期" :picker-options="pickerOptions"></el-date-picker>
          </el-form-item>
          <el-form-item label="上 线 时 间" :label-width="formLabelWidth" prop="time">
            <el-select v-model="onlineAppform.time" placeholder="请选择时间">
              <el-option v-for="onlineTime in onlineTimes" :key="onlineTime.value" :label="onlineTime.label" :value="onlineTime.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上 线 版 本" :label-width="formLabelWidth" >
            <el-input v-model="onlineAppform.version" autocomplete="off" style="width:50%"></el-input>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button type="primary" @click="onlineAppSave('onlineAppform')">确 定</el-button>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
        </div>
      </div>
    </el-drawer>
    
    <el-drawer title="上线需求" :visible.sync="dialogTableVisible" direction="rtl" size="85%" @closed="closeOnlineNeedDialog" >
      <div style="margin: 0px 25px 0px 25px;">
        <el-button type="primary" @click="online.needList.push({id: null,  name: '', type: 0, executePermission: 0, appId: online.id})">+ 需 求</el-button>
        <el-table :data="online.needList" :max-height="tableMaxHeight"> 
          <el-table-column align="center" label="类型">
            <template slot-scope="scope" >
              <el-select v-model="scope.row.type" placeholder="请选择需求类型">
                <el-option v-for="onlineNeedType in onlineNeedTypes" :key="onlineNeedType.value" :label="onlineNeedType.label" :value="onlineNeedType.value"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column align="center" label="需求">
            <template slot-scope="scope" >
              <el-input type="textarea" rows="5" v-model="scope.row.name" placeholder="请填写需求" />
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope" >
              <el-button @click="onlineNeedSave(scope.row)">保存</el-button>
              <el-button @click="openDeleteOnlineNeedMessageBox(scope.row.id,scope.$index)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>

    <el-drawer title="develop -> master" :visible.sync="dialogMergeVisible" direction="rtl" size="35%" @closed="closeMergedDialog" >
      <div style="margin: 0px 25px 0px 25px;">
        <el-button type="primary" @click="merge" :disabled="online.version === '' || !online.needList">合 并</el-button>
        <div :style="{'max-height': tableMaxHeight, 'height': tableMaxHeight, 'margin-top': '25px'}">
          <el-steps direction="vertical" align-center>
            <el-step v-for="(project, projectIndex) in projects" :key="projectIndex" :title="project.name" :status="statues[project.status]" :icon="icons[project.icon]" @click.native="mergeTrigger(project)" ></el-step>
          </el-steps>
        </div>
      </div>
    </el-drawer>

    <el-drawer :title="onlineNeed | needInfo(onlineNeedTypes)" :visible.sync="needDrawer" direction="rtl" size="85%" @closed="closeOnlineNeedDrawer" >
      <el-tabs type="border-card" style="margin: 0px 25px 0px 25px;" v-model="onlineNeedActive" >
        <el-tab-pane label="前端" name="front">
          <el-button type="primary" @click="onlineNeed.frontList.push({id: null, projectName: '', projectBranch: '', userName: '', newProject: false, lastVersion:'', type: 0, needId: onlineNeed.id})">+ 工 程</el-button>
          <el-table :data="onlineNeed.frontList" :max-height="tableMaxHeight">
            <el-table-column align="center" label="工程名称">
              <template slot-scope="scope" >
                <el-select v-model="scope.row.projectName" filterable remote allow-create default-first-option placeholder="请选择工程" :remote-method="queryFrontProject">
                  <el-option v-for="front in fronts" :key="front.value" :label="front.label" :value="front.value"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column align="center" label="分支名称">
              <template slot-scope="scope" >
                <el-input type="text" v-model="scope.row.projectBranch" />
              </template>
            </el-table-column>
            <el-table-column align="center" label="开发者">
              <template slot-scope="scope" >
                <el-input type="text" v-model="scope.row.userName" />
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope" >
                <el-button @click="onlineNeedDetailSave(scope.row, fronts)">保存</el-button>
                <el-button @click="openDeleteOnlineNeedDetailMessageBox(scope.row.id,scope.$index,onlineNeed.frontList)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="后台" name="server">
          <el-button type="primary" @click="onlineNeed.serverList.push({id: null, projectName: '', projectBranch: '', userName: '', newProject: false, lastVersion:'', type: 1, needId: onlineNeed.id})">+ 工 程</el-button>
          <el-table :data="onlineNeed.serverList" :max-height="tableMaxHeight">
            <el-table-column align="center" label="工程名称">
              <template slot-scope="scope" >
                <el-select v-model="scope.row.projectName" filterable remote allow-create default-first-option placeholder="请选择工程" :remote-method="queryServerProject">
                  <el-option v-for="server in servers" :key="server.value" :label="server.label" :value="server.value"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column align="center" label="分支名称">
              <template slot-scope="scope" >
                <el-input type="text" v-model="scope.row.projectBranch" />
              </template>
            </el-table-column>
            <el-table-column align="center" label="开发者">
              <template slot-scope="scope" >
                <el-input type="text" v-model="scope.row.userName" />
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope" >
                <el-button @click="onlineNeedDetailSave(scope.row, servers)">保存</el-button>
                <el-button @click="openDeleteOnlineNeedDetailMessageBox(scope.row.id,scope.$index,onlineNeed.serverList)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="SQL" name="sql">
          <el-button type="primary" @click="onlineNeed.sqlList.push({id: null, remark: '', type: 0, remarkType: 0, needId: onlineNeed.id})">+ S Q L</el-button>
          <el-table :data="onlineNeed.sqlList" :max-height="tableMaxHeight" >
            <el-table-column align="center" label="SQL">
              <template slot-scope="scope" >
                <el-input type="textarea" :rows="25" style="width:100%" placeholder="请填写SQL" v-model="scope.row.remark"></el-input>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope" >
                <el-button @click="onlineNeedRemarkSave(scope.row)">保存</el-button>
                <el-button @click="openDeleteOnlineNeedRemarkMessageBox(scope.row.id,scope.$index,onlineNeed.sqlList)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="其他" name="other">
          <el-button type="primary" @click="onlineNeed.remarkList.push({id: null, remark: '', type: 1, remarkType: 0, needId: onlineNeed.id})">+ 备 注</el-button>
          <el-table :data="onlineNeed.remarkList" :max-height="tableMaxHeight" >
            <el-table-column align="center" label="注意事项">
              <template slot-scope="scope" >
                <el-select v-model="scope.row.remarkType" placeholder="请选择注意事项" style="width:100%">
                  <el-option v-for="remarkType in remarkTypes" :key="remarkType.value" :label="remarkType.label" :value="remarkType.value"></el-option>
                </el-select>
                <el-input type="textarea" :rows="23" style="width:100%" placeholder="请填写备注" v-model="scope.row.remark"></el-input>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope" >
                <el-button @click="onlineNeedRemarkSave(scope.row)">保存</el-button>
                <el-button @click="openDeleteOnlineNeedRemarkMessageBox(scope.row.id,scope.$index,onlineNeed.remarkList)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="测试" name="test">
          <el-button type="primary" @click="onlineNeed.testList.push({id: null, projectName: '', projectBranch: '', userName: '', newProject: false, lastVersion:'', type: 2, needId: onlineNeed.id})">+ 测 试</el-button>
          <el-table :data="onlineNeed.testList" :max-height="tableMaxHeight" >
            <el-table-column align="center" label="测试者">
              <template slot-scope="scope" >
                <el-input type="text" v-model="scope.row.userName" />
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope" >
                <el-button @click="onlineNeedTestDetailSave(scope.row)">保存</el-button>
                <el-button @click="openDeleteOnlineNeedDetailMessageBox(scope.row.id,scope.$index,onlineNeed.testList)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>

    <el-dialog :visible.sync="needOperateDialogVisible" width="30%" center :show-close="false">
      <el-row :gutter="10">
        <el-col :span="12" @click.native="openOnlineAppDialog()" >
          <el-card shadow="hover">
            修改
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover" @click.native="openDeleteOnlineAppMessageBox()">
            删除
          </el-card>
        </el-col>
        <el-col :span="12" style="margin-top:5px;">
          <el-card shadow="hover" @click.native="openOnlineNeedsDialog()">
            需求
          </el-card>
        </el-col>
        <el-col :span="12" style="margin-top:5px;">
          <el-card shadow="hover" @click.native="openMergeDialog()">
            合并
          </el-card>
        </el-col>
      </el-row>
    </el-dialog>
    
  </div>
</template>

<script>

import {api} from '@/api/api'
import { setTimeout } from 'timers'
import { fronts, servers, gits, commons } from './data/projects'
import { onlineTimes, shortcuts, onlineAppformRules, onlineNeedTypes } from './data/onlineTools'
import person from './data/person'
import appPreview from '@/components/app-preview'
import draggable from 'vuedraggable'

export default {
  components: {
    appPreview,
    draggable
  },
  data () {
    return {
      token: '',
      remarkTypes: [
        {
          value: 0,
          label: '运维上线内容'
        },
        {
          value: 1,
          label: '终端上线内容'
        },
        {
          value: 2,
          label: '上线影响'
        },
        {
          value: 3,
          label: '上线风险及注意事项'
        }
      ],
      onlineNeedActive: 'front',
      statues: ['process', 'finish', 'success', 'error', 'wait'],
      icons: ['el-icon-info', 'el-icon-loading', 'el-icon-success', 'el-icon-error', 'el-icon-remove'],
      loading: true,
      needOperateDialogVisible: false,
      onlineNeed: {},
      needDrawer: false,
      onlineList: [],
      online: {},
      dialogTableVisible: false,
      dialogFormVisible: false,
      lastId: null,
      onlineTimes,
      fronts,
      servers,
      gits,
      commons,
      onlineAppform: {
        name: '',
        phone: null,
        email: null,
        date: Date.parse(new Date()),
        time: 1350,
        version: ''
      },
      formLabelWidth: '120px',
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now()
        },
        shortcuts
      },
      onlineAppformRules,
      onlineNeedTypes,
      person,
      personOptions: [],
      projectOptions: [],
      uploadAction: window.API_ROOT + '/api/file/',
      downloadAction: window.API_ROOT + '/api/file/',
      isUploading: false,
      dialogMergeVisible: false,
      projects: []
    }
  },
  filters: {
    formateDate: function (value) {
      let date = new Date(value.date)
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      let hour = parseInt(value.time / 60)
      let minute = value.time % 60
      return year + '-' + month + '-' + day + ' ' + hour + ':' + minute
    },
    userInfo: function (value) {
      return '申请人：' + value.name + '  手机号：' + value.phone + '  邮箱：' + value.email
    },
    needInfo: function (value, onlineNeedTypes) {
      if (value.type === undefined) {
        return ''
      }
      console.log(value)
      return '【' + onlineNeedTypes[value.type]['label'] + '】 ' + value.name
    }
  },
  methods: {
    async list (refresh = true) {
      let that = this
      this.loading = true
      await api({
        url: '/api/onlineapp',
        params: { lastId: that.lastId },
        args: { refresh },
        success: function (response, args) {
          that.loading = false
          let list = response.data.list
          if (args.refresh) {
            that.onlineList = list
          } else {
            that.onlineList.push(...list)
            that.lastId = list[list.length - 1]['id']
          }
        }
      })
    },
    async resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    async closeOnlineAppDialog () {
      setTimeout(() => {
        this.onlineAppform = {
          name: '',
          phone: null,
          email: null,
          date: Date.parse(new Date()),
          time: 1350,
          version: ''
        }
        this.online = {}
        this.resetForm('onlineAppform')
      }, 100)
    },
    async onlineAppSave (formName) {
      let that = this
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.onlineAppform.id) {
            await api({
              url: '/api/onlineapp',
              params: this.onlineAppform,
              method: 'PUT',
              success: function (response) {
                that.lastId = null
                that.$notify({
                  title: '成功',
                  message: '保存成功',
                  type: 'success'
                })
                that.list()
              }
            })
          } else {
            await api({
              url: '/api/onlineapp',
              params: this.onlineAppform,
              method: 'POST',
              success: function (response) {
                that.lastId = null
                that.$notify({
                  title: '成功',
                  message: '保存成功',
                  type: 'success'
                })
                that.list()
              }
            })
          }
          this.dialogFormVisible = false
        }
        return valid
      })
    },
    async openOnlineAppDialog () {
      this.dialogFormVisible = true
      this.needOperateDialogVisible = false
      Object.assign(this.onlineAppform, this.online)
    },
    async openDeleteOnlineAppMessageBox () {
      this.needOperateDialogVisible = false
      let that = this
      this.$confirm('确定删除此次上线计划?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api({
          url: '/api/onlineapp/' + this.online.id,
          method: 'delete',
          success (response) {
            that.list()
            that.$notify({
              type: 'success',
              title: '成功',
              message: '删除成功!'
            })
            that.online = {}
          }
        })
      }).catch(() => {
        that.$notify.error({
          type: 'success',
          title: '取消',
          message: '已取消删除!'
        })
        that.online = {}
      })
    },
    async openOnlineNeedsDialog () {
      this.dialogTableVisible = true
      this.needOperateDialogVisible = false
    },
    async onlineNeedSave (onlineNeed) {
      let that = this
      if (onlineNeed.id) {
        await api({
          url: '/api/onlineneed',
          params: onlineNeed,
          method: 'PUT',
          success (response) {
            that.$notify({
              type: 'success',
              title: '成功',
              message: '保存成功'
            })
          }
        })
      } else {
        await api({
          url: '/api/onlineneed',
          params: onlineNeed,
          method: 'POST',
          success (response) {
            that.$notify({
              type: 'success',
              title: '成功',
              message: '保存成功'
            })
            onlineNeed.id = response.data
          }
        })
      }
    },
    async openDeleteOnlineNeedMessageBox (id, index) {
      let that = this
      this.$confirm('确定删除此需求?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (id) {
          api({
            url: '/api/onlineneed/' + id,
            method: 'DELETE',
            success () {
              that.$notify({
                type: 'success',
                title: '成功',
                message: '删除成功'
              })
              that.online.needList.splice(index, 1)
            }
          })
        } else {
          this.$notify({
            type: 'success',
            title: '成功',
            message: '删除成功'
          })
          this.online.needList.splice(index, 1)
        }
      }).catch(() => {
        that.$notify.error({
          title: '取消',
          message: '已取消删除!'
        })
      })
    },
    async closeOnlineNeedDialog () {
      this.online = {}
      this.list()
    },
    async onlineNeedDetailSave (onlineNeedDetail, projects) {
      if (!onlineNeedDetail.projectName) {
        this.$notify({
          type: 'error',
          title: '保存失败',
          message: '请选择工程'
        })
        return
      }
      if (!onlineNeedDetail.projectBranch) {
        this.$notify({
          type: 'error',
          title: '保存失败',
          message: '请填写分支'
        })
        return
      }
      if (!onlineNeedDetail.userName) {
        this.$notify({
          type: 'error',
          title: '保存失败',
          message: '请填写开发者'
        })
        return
      }
      let currentVersion = ''
      label: {
        for (let index in projects) {
          if (onlineNeedDetail.projectName === projects[index]['value']) {
            await api({
              url: '/api/proxy/url',
              params: {
                url: projects[index]['url']
              },
              success (response) {
                if (typeof response.data === 'string') {
                  currentVersion = response.data.split('=')[1]
                } else {
                  currentVersion = response.data.git.branch
                }
              }
            })
            break label
          }
        }
        onlineNeedDetail.newProject = true
      }
      onlineNeedDetail.lastVersion = currentVersion
      let that = this
      if (onlineNeedDetail.id) {
        await api({
          url: '/api/onlineneeddetail',
          params: onlineNeedDetail,
          method: 'PUT',
          success (response) {
            that.$notify({
              type: 'success',
              title: '成功',
              message: '保存成功'
            })
          }
        })
      } else {
        await api({
          url: '/api/onlineneeddetail',
          params: onlineNeedDetail,
          method: 'POST',
          success (response) {
            that.$notify({
              type: 'success',
              title: '成功',
              message: '保存成功'
            })
            onlineNeedDetail.id = response.data
          }
        })
      }
    },
    async onlineNeedTestDetailSave (onlineNeedDetail) {
      if (!onlineNeedDetail.userName) {
        this.$notify({
          type: 'error',
          title: '保存失败',
          message: '请填写开发者'
        })
        return
      }
      let that = this
      if (onlineNeedDetail.id) {
        await api({
          url: '/api/onlineneeddetail',
          params: onlineNeedDetail,
          method: 'PUT',
          success (response) {
            that.$notify({
              type: 'success',
              title: '成功',
              message: '保存成功'
            })
          }
        })
      } else {
        await api({
          url: '/api/onlineneeddetail',
          params: onlineNeedDetail,
          method: 'POST',
          success (response) {
            that.$notify({
              type: 'success',
              title: '成功',
              message: '保存成功'
            })
            onlineNeedDetail.id = response.data
          }
        })
      }
    },
    async openDeleteOnlineNeedDetailMessageBox (id, index, list) {
      let that = this
      this.$confirm('确定删除此项?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (id) {
          api({
            url: '/api/onlineneeddetail/' + id,
            method: 'DELETE',
            success () {
              that.$notify({
                type: 'success',
                title: '成功',
                message: '删除成功'
              })
              list.splice(index, 1)
            }
          })
        } else {
          this.$notify({
            type: 'success',
            title: '成功',
            message: '删除成功'
          })
          list.splice(index, 1)
        }
      }).catch(() => {
        that.$notify.error({
          title: '取消',
          message: '已取消删除!'
        })
      })
    },
    async onlineNeedRemarkSave (remark) {
      if (!remark.remark) {
        this.$notify({
          type: 'error',
          title: '保存失败',
          message: '请正确填写'
        })
        return
      }
      let that = this
      if (remark.id) {
        await api({
          url: '/api/onlineneedremark',
          params: remark,
          method: 'PUT',
          success (response) {
            that.$notify({
              type: 'success',
              title: '成功',
              message: '保存成功'
            })
          }
        })
      } else {
        await api({
          url: '/api/onlineneedremark',
          params: remark,
          method: 'POST',
          success (response) {
            that.$notify({
              type: 'success',
              title: '成功',
              message: '保存成功'
            })
            remark.id = response.data
          }
        })
      }
    },
    async openDeleteOnlineNeedRemarkMessageBox (id, index, list) {
      let that = this
      this.$confirm('确定删除此项?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (id) {
          api({
            url: '/api/onlineneedremark/' + id,
            method: 'DELETE',
            success () {
              that.$notify({
                type: 'success',
                title: '成功',
                message: '删除成功'
              })
              list.splice(index, 1)
            }
          })
        } else {
          this.$notify({
            type: 'success',
            title: '成功',
            message: '删除成功'
          })
          list.splice(index, 1)
        }
      }).catch(() => {
        that.$notify.error({
          title: '取消',
          message: '已取消删除!'
        })
      })
    },
    async queryPerson (query) {
      if (query) {
        setTimeout(() => {
          this.personOptions = this.person.filter(item => {
            return item.name.indexOf(query) > -1
          }, 200)
        })
      } else {
        this.options = [].concat(this.person)
      }
    },
    async queryFrontProject (query) {
      if (query) {
        setTimeout(() => {
          this.projectOptions = this.fronts.filter(item => {
            return item.value.indexOf(query) > -1
          }, 200)
        })
      } else {
        this.projectOptions = [].concat(this.fronts)
      }
    },
    async queryServerProject (query) {
      if (query) {
        setTimeout(() => {
          this.projectOptions = this.servers.filter(item => {
            return item.value.indexOf(query) > -1
          }, 200)
        })
      } else {
        this.projectOptions = [].concat(this.servers)
      }
    },
    async openOnlineNeedDrawer (need) {
      this.onlineNeed = JSON.parse(JSON.stringify(need))
      this.needDrawer = true
    },
    async closeOnlineNeedDrawer () {
      this.$confirm('是否每项都已保存？是否还需要商家中心配合？是否还需要刷库？是否还需要配置定时任务？', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        this.needDrawer = true
        this.onlineNeedActive = 'other'
      }).catch(() => {
        this.onlineNeed = {}
        this.onlineNeedActive = 'front'
        this.list()
      })
    },
    async openNeedOperateDialog (online) {
      this.online = JSON.parse(JSON.stringify(online))
      this.needOperateDialogVisible = true
    },
    async remove (id, fileList, index) {
      let that = this
      this.$confirm('确定删除此项?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (id) {
          api({
            url: '/api/file/' + id,
            method: 'DELETE',
            success () {
              that.$notify({
                type: 'success',
                title: '成功',
                message: '删除成功'
              })
              fileList.splice(index, 1)
            }
          })
        } else {
          this.$notify({
            type: 'success',
            title: '成功',
            message: '删除成功'
          })
          fileList.splice(index, 1)
        }
      }).catch(() => {
        that.$notify.error({
          title: '取消',
          message: '已取消删除!'
        })
      })
    },
    async uploadSuccess (res, file) {
      await this.list()
      this.isUploading = false
      this.$notify({
        type: 'success',
        title: '成功',
        message: '文件上传成功'
      })
    },
    async uploading () {
      this.isUploading = true
    },
    async uploadErr () {
      this.isUploading = false
      this.$notify.error({
        title: '失败',
        message: '文件上传失败'
      })
    },
    async openMergeDialog () {
      this.dialogMergeVisible = true
      this.needOperateDialogVisible = false
      let needList = this.online.needList
      let projectNames = []
      for (let common of this.commons) {
        this.projects.push({
          name: common,
          status: 0,
          icon: 0,
          noTag: true,
          merge: true
        })
      }
      if (needList) {
        for (let need of needList) {
          let serverList = need.serverList
          let frontList = need.frontList
          for (let server of serverList) {
            if (projectNames.indexOf(server.projectName) === -1) {
              this.projects.push({
                name: server.projectName,
                status: 0,
                icon: 0,
                noTag: false,
                merge: true
              })
              projectNames.push(server.projectName)
            }
          }
          for (let front of frontList) {
            if (projectNames.indexOf(front.projectName) === -1) {
              this.projects.push({
                name: front.projectName,
                status: 0,
                icon: 0,
                noTag: false,
                merge: true
              })
              projectNames.push(front.projectName)
            }
          }
        }
      }
    },
    async merge () {
      for (let project of this.projects) {
        if (project.merge) {
          let gitUrl = this.gits.get(project.name)
          if (gitUrl) {
            project.status = 1
            project.icon = 1
            api({
              baseURL: 'http://192.168.1.29:996',
              url: '/diabbo/merge',
              params: {
                tagName: project.noTag ? null : this.online.version,
                projectRepository: gitUrl
              },
              method: 'GET',
              success (response) {
                project.status = 2
                project.icon = 2
              },
              error (response) {
                project.status = 3
                project.icon = 3
              }
            })
          } else {
            project.status = 3
            project.icon = 3
          }
        }
      }
    },
    async closeMergedDialog () {
      this.dialogMergeVisible = false
      this.online = {}
      this.projects = []
    },
    async mergeTrigger (project) {
      if (project.merge) {
        project.merge = false
        project.status = 4
        project.icon = 4
      } else {
        project.merge = true
        project.status = 0
        project.icon = 0
      }
    },
    dragStart (e) {
      console.log('dragStart', e)
    },
    dragEnd (e) {
      console.log('dragEnd', e)
    },
    async dragMove (e) {
      let that = this
      let needId = e.draggedContext.element.id
      let appId = e.relatedContext.element.appId
      e.draggedContext.element.appId = appId
      await api({
        url: '/api/onlineneed/' + needId + '/' + appId,
        method: 'PUT',
        success (response) {
          that.$notify({
            type: 'success',
            title: '成功',
            message: '需求迁移成功'
          })
        },
        error (response) {
          that.$notify.error({
            title: '失败',
            message: '需求迁移失败'
          })
        }
      })
      // await this.list()
    },
    dragChange (e) {
      console.log('dragovdragChangeer', e)
    }
  },
  computed: {
    tableMaxHeight: function () {
      return parseInt((window.innerHeight - 150) * 0.93) + 'px'
    }
  },
  created () {
    this.list()
  },
  beforeCreate () {
    let that = this
    window.parent.postMessage('ok', '*')
    window.addEventListener('message', function (event) {
      that.token = event.data
      // that.token = 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIwMjE1NTMyMjYzMjEzODkzNzkiLCJuYW1lIjoiJUU1JTkwJUI0JUU0JUJGJThBJUU5JUJFJTk5IiwiZXhwIjoxNTc0OTA0MTM4fQ.jBdjWv0UQwmH9xKy7vk9ubIA_esjaM2o4QiUmhvsQak'
    })
  }
}

</script>

<style scoped>

  .new-refresh {
    position: fixed;
    right: 25px;
    z-index: 20;
    font-size: 40px;
    cursor: pointer;
  }

  i.new-refresh:active{
    box-shadow: -1px -1px 2px 2px #ccc;
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 240px;
    min-height: 0px;
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .el-upload-list--picture-card .el-upload-list__item {
    width: 300px !important;
  }

  .el-row {
    top: -10px !important;
  }

  .upload-application-title {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    height: 70px;
  }
</style>