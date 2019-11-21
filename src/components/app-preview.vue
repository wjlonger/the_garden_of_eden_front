<template >
<el-tabs :tab-position="'left'">
    <el-tab-pane label="预览">
      <div class="app-preview" :id="'app-preview-' + onlineInfo.id" @dblclick="copy">
        {{ total }}&nbsp;&nbsp;您好：
        <div>
            <div class="preview-main-title">一、上线时间</div>
            <div class="preview-one-date">
                {{onlineInfo | formateDate}}<span style="color:red">{{onlineInfo | formatTime}}</span>
            </div>
        </div>
        <div>
          <div class="preview-main-title">二、上线内容</div>
          <div class="preview-two-date">
              <div class="preview-minor-title">1、功能需求</div>
              <ul>
                  <li v-for="need in onlineInfo.needList" :key="need.id">
                      {{ need | needInfo(onlineNeedTypes) }}
                  </li>
              </ul>
          </div>
          <div>
            <div class="preview-minor-title">2、运维上线内容</div>
            <template v-if="devops.length > 0">
              <ul>
                <li v-for="devop in devops" :key="devop.id">{{ devop.remark }}</li>
              </ul>
            </template>
            <template v-else>
              <ul>
                <li>无</li>
              </ul>
            </template>
          </div>
          <div>
            <div class="preview-minor-title">3、终端上线内容</div>
            <template v-if="terminals.length > 0">
              <ul>
                <li v-for="terminal in terminals" :key="terminal.id">{{ terminal.remark }}</li>
              </ul>
            </template>
            <template v-else>
              <ul>
                <li>无</li>
              </ul>
            </template>
          </div>
          <div class="preview-two-date">
            <div class="preview-minor-title">4、数据库上线内容</div>
            <div class="preview-two-four-date">
              <template v-if="hasSql">
                <ul>
                <template v-for="need in onlineInfo.needList">
                  <template v-if="need.sqlList.length > 0">
                    <li :key="need.id">{{ need.name }}</li>
                    <template v-for="(sql, sqlIndex) in need.sqlList">
                      <p class="preview-two-four-date-sql" v-for="(remark, remarkIndex) in sql.remark.split('\n')" :key="need.id + '-' + sqlIndex + '-' + remarkIndex">
                        {{remark}}
                      </p>
                      <br :key="sql.id"/>
                    </template>
                  </template>
                </template>  
              </ul>
              </template>
              <template v-else>
                <ul>
                  <li>无</li>
                </ul>
              </template>
            </div>
          </div>
        </div>
        <div>
          <div class="preview-main-title">三、上线影响</div>
          <template v-if="effects.length > 0">
            <ul>
              <li v-for="effect in effects" :key="effect.id">{{ effect.remark }}</li>
            </ul>
          </template>
          <template v-else>
            <ul>
              <li>无</li>
            </ul>
          </template>
        </div>
        <div>
          <div class="preview-main-title">四、上线风险及注意事项</div>
          <template v-if="notes.length > 0">
            <ul>
              <li v-for="note in notes" :key="note.id">{{ note.remark }}</li>
            </ul>
          </template>
          <template v-else>
            <ul>
              <li>无</li>
            </ul>
          </template>
        </div>
        <div>
          <div class="preview-main-title">五、上线流程</div>
          <ul>
            <li v-for="flow in onlineFlow" :key="flow.id" v-bind:class="{ 'deleteFlow': flow.delete }" @click.prevent.stop="flow.delete = !flow.delete" >{{ flow.label }}</li>
          </ul>
        </div>
        <div>
            <div class="preview-main-title">六、回滚方案</div>
            <ul>
                <li>上线失败（影响支付等），立即回滚到各个机房的上线前版本。</li>
            </ul>
        </div>
        <div>
            <div class="preview-main-title">七、上线人员</div>
            <div>研发：{{ developer | at }}</div>
            <div>测试：{{ tester | at }}</div>
            <div>DBA：@郜文博</div>
            <div>运维：@纪宪博</div>
        </div>
        <div>
            <div class="preview-main-title">八、值班人员</div>
            <div>请以下人员第二天5点后保持手机畅通：</div>
            <div>研发：@沈会亮 15033519983</div>
            <div>运维：@林常禹 13520060543</div>
        </div>
        <div>
            <div class="preview-main-title">九、上线应用列表</div>
            <div>
                <div class="preview-minor-title">1、华东应用上线列表</div>
                <table class="preview-border" border="1">
                  <thead>
                    <tr>
                        <th>zys华东应用</th>
                        <th>上线前版本</th>
                        <th>计划上线版本</th>
                        <th>是否新增</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(common, commonIndex) in commons" :key="commonIndex">
                      <td>{{ common }}</td>
                      <td> - </td>
                      <td> - </td>
                      <td>否</td>
                    </tr>
                    <tr v-for="(project, projectIndex) in eastProjects" :key="project.id + '-0-' + projectIndex">
                      <td>{{ project.projectName }}</td>
                      <td>{{ project.lastVersion }}</td>
                      <td>{{ onlineInfo.version }}</td>
                      <td>{{ project.newProject ? '是' : '否' }}</td>
                    </tr>
                  </tbody>
                </table>
                <div class="preview-minor-title">2、华北应用上线列表</div>
                <table class="preview-border" border="1">
                  <thead>
                    <tr>
                        <th>zys华北应用</th>
                        <th>上线前版本</th>
                        <th>计划上线版本</th>
                        <th>是否新增</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(common, commonIndex) in commons" :key="commonIndex">
                      <td>{{ common }}</td>
                      <td> - </td>
                      <td> - </td>
                      <td>否</td>
                    </tr>
                    <tr v-for="(project, projectIndex) in northProjects" :key="project.id + '-' + projectIndex">
                      <td>{{ project.projectName }}</td>
                      <td>{{ project.lastVersion }}</td>
                      <td>{{ onlineInfo.version }}</td>
                      <td>{{ project.newProject ? '是' : '否' }}</td>
                    </tr>
                  </tbody>
                </table>
            </div>
        </div>
        <div>
          <div class="preview-main-title">十、代码分支列表</div>
          <table class="preview-border" border="1">
            <thead>
              <tr>
                <th>应用</th>
                <th>分支</th>
                <th>关联上线内容</th>
                <th>后端研发</th>
                <th>前端研发</th>
                <th>终端研发</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(needsValue, needsKey) in needs">
                <template v-if="rowspan(needsValue[1]) > 0">
                  <template v-for="(needValue, needkey)  in needsValue[1]" >
                    <template v-for="(need, needIndex) in needValue[1]">
                      <tr :key="needsKey + '-' + needkey + '-' + needIndex" v-if="needIndex === 0">
                        <td style="width: 15%;">{{ need.projectName }}</td>
                        <td style="width: 20%;" :rowspan="needValue[1].length">{{ need.projectBranch }}</td>
                        <td v-if="needkey === 0 && needIndex === 0" :rowspan="needsValue[1] | rowspan">{{ needsValue[0] | needName(onlineInfo, onlineNeedTypes) }}</td>
                        <td style="width: 10%;" v-if="(need.type === 1 && need.userName.length !== 0)">{{ need.userName }}</td>
                        <td style="width: 10%;" v-else > - </td>
                        <td style="width: 10%;" v-if="(need.type === 0 && need.userName.length !== 0)">{{ need.userName }}</td>
                        <td style="width: 10%;" v-else > - </td>
                        <td style="width: 10%;"> - </td>
                      </tr>
                      <tr :key="needsKey + '-' + needkey + '-' + needIndex" v-else >
                        <td style="width: 15%;">{{ need.projectName }}</td>
                        <td style="width: 10%;" v-if="need.type === 1 && need.userName.length !== 0">{{ need.userName }}</td>
                        <td style="width: 10%;" v-else > - </td>
                        <td style="width: 10%;" v-if="need.type === 0 && need.userName.length !== 0">{{ need.userName }}</td>
                        <td style="width: 10%;" v-else > - </td>
                        <td style="width: 10%;"> - </td>
                      </tr>
                    </template>
                  </template>
                </template>
                <template v-else>
                  <tr :key="needsKey + '-0-0'" bgcolor="#FFB6C1">
                    <td style="width: 15%;"> - </td>
                    <td style="width: 20%;"> - </td>
                    <td>{{ needsValue[0] | needName(onlineInfo, onlineNeedTypes) }}</td>
                    <td style="width: 10%;" > - </td>
                    <td style="width: 10%;" > - </td>
                    <td style="width: 10%;"> - </td>
                  </tr>
                </template>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="运维">
      <el-card class="box-card" v-if="needPassword">
        <el-input placeholder="请输入密码" v-model="password" show-password></el-input>
        <div class="demo-drawer__footer" style="margin-top:10px">
          <el-button @click="getPassword(onlineInfo.id)" >获 取 密 码</el-button>
          <el-button type="primary" >确 定</el-button>
        </div>
      </el-card>
    </el-tab-pane>
    <el-tab-pane label="测试"></el-tab-pane>
  </el-tabs>
</template>
<script>

import { onlineTimes, onlineNeedTypes } from '@/pages/data/onlineTools'
import { onlineFlow } from './data/onlinePerview'
import { eastServers, commons } from '@/pages/data/projects'
import {api} from '@/api/api'

export default {
  props: ['onlineInfo','needPassword'],
  data () {
    return {
      onlineFlow,
      onlineNeedTypes,
      eastServers,
      commons,
      password: ''
    }
  },
  filters: {
    formateDate: function (value) {
      let date = new Date(value.date)
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      let hour = parseInt(value.time / 60)
      let hourName = ''
      if (hour >= 18) {
        hourName = '晚上'
      } else if (hour < 18 && hour >= 12) {
        hourName = '下午'
      } else if (hour < 12 && hour >= 8) {
        hourName = '上午'
      } else if (hour < 8) {
        hourName = '凌晨'
      }
      return year + '年' + month + '月' + day + '日' + hourName
    },
    formatTime: function (value) {
      return _.filter(onlineTimes, function (o) { return value.time === o.value })[0].label
    },
    userInfo: function (value) {
      return '申请人：' + value.name + '  手机号：' + value.phone + '  邮箱：' + value.email
    },
    needInfo: function (value, onlineNeedTypes) {
      if (value.type === undefined) {
        return ''
      }
      return '【' + onlineNeedTypes[value.type]['label'] + '】 ' + value.name
    },
    needName: function (value, onlineInfo, onlineNeedTypes) {
      for (let need of onlineInfo.needList) {
        if (need.name === value) {
          return '【' + onlineNeedTypes[need.type]['label'] + '】 ' + value
        }
      }
      return ''
    },
    rowspan: function (needs) {
      let length = 0
      for (let need of needs) {
        length += need[1].length
      }
      return length
    },
    at: function (value) {
      if (value.length > 0) {
        let userNameArr = value.split('，')
        for (let index in userNameArr) {
          userNameArr[index] = '@' + userNameArr[index]
        }
        return userNameArr.join('，')
      }
      return ''
    }
  },
  computed: {
    developer () {
      let userNameArr = []
      let needList = this.onlineInfo.needList
      for (let needIndex in needList) {
        let need = needList[needIndex]
        let total = need.serverList.concat(need.frontList)
        for (let totalIndex in total) {
          if (userNameArr.indexOf(total[totalIndex]['userName']) === -1) {
            userNameArr.push(total[totalIndex]['userName'])
          }
        }
      }
      return userNameArr.join('，')
    },
    tester () {
      let userNameArr = []
      let needList = this.onlineInfo.needList
      for (let needIndex in needList) {
        let need = needList[needIndex]
        let total = need.testList
        for (let totalIndex in total) {
          if (userNameArr.indexOf(total[totalIndex]['userName']) === -1) {
            userNameArr.push(total[totalIndex]['userName'])
          }
        }
      }
      return userNameArr.join('，')
    },
    total () {
      let total = []
      if (this.developer.length > 0) {
        total.push(this.developer)
      }
      if (this.tester.length > 0) {
        total.push(this.tester)
      }
      return total.join('，')
    },
    needs () {
      let needs = this.onlineInfo.needList
      let onlineInfoMap = new Map()
      for (let needIndex in needs) {
        let map = new Map()
        let need = needs[needIndex]
        let serverList = need.serverList
        let frontList = need.frontList
        let totalLength = serverList.concat(frontList).length
        if (totalLength !== 0) {
          for (let serverIndex in serverList) {
            let server = serverList[serverIndex]
            let needArr = map.get(server.projectBranch)
            if (typeof needArr !== 'undefined') {
              needArr.push(server)
            } else {
              needArr = []
              needArr.push(server)
            }
            map.set(server.projectBranch, needArr)
          }
          for (let frontIndex in frontList) {
            let front = frontList[frontIndex]
            let needArr = map.get(front.projectBranch)
            if (typeof needArr !== 'undefined') {
              needArr.push(front)
            } else {
              needArr = []
              needArr.push(front)
            }
            map.set(front.projectBranch, needArr)
          }
        }
        onlineInfoMap.set(need.name, map)
      }
      return onlineInfoMap
    },
    northProjects () {
      let needList = this.onlineInfo.needList
      let projects = []
      let projectNames = []
      for (let need of needList) {
        let serverList = need.serverList
        let frontList = need.frontList
        for (let front of frontList) {
          if (projectNames.indexOf(front.projectName) === -1) {
            projects.push(JSON.parse(JSON.stringify(front)))
            projectNames.push(front.projectName)
          }
        }
        for (let server of serverList) {
          if (projectNames.indexOf(server.projectName) === -1) {
            projects.push(JSON.parse(JSON.stringify(server)))
            projectNames.push(server.projectName)
            if (server.projectName === 'zys-pay') {
              projects.push(Object.assign(JSON.parse(JSON.stringify(server)), { projectName: 'zys-payschedule' }))
            }
          }
        }
      }
      return projects.sort((project1, project2) => {
        return project1.projectName > project2.projectName ? 1 : -1
      })
    },
    eastProjects () {
      let projects = []
      for (let project of this.northProjects) {
        for (let eastServer of this.eastServers) {
          if (project.projectName === eastServer.value) {
            projects.push(JSON.parse(JSON.stringify(project)))
          }
        }
      }
      return projects
    },
    hasSql () {
      for (let needs of this.onlineInfo.needList) {
        if (needs.sqlList.length > 0) {
          return true
        }
      }
      return false
    },
    devops () {
      return this.onlineInfo.needList.map(need => {
        return need.remarkList.filter(remark => {
          return remark.remarkType === 0
        })
      }).flat()
    },
    terminals () {
      return this.onlineInfo.needList.map(need => {
        return need.remarkList.filter(remark => {
          return remark.remarkType === 1
        })
      }).flat()
    },
    effects () {
      return this.onlineInfo.needList.map(need => {
        return need.remarkList.filter(remark => {
          return remark.remarkType === 2
        })
      }).flat()
    },
    notes () {
      return this.onlineInfo.needList.map(need => {
        return need.remarkList.filter(remark => {
          return remark.remarkType === 3
        })
      }).flat()
    }
  },
  methods: {
    rowspan (needs) {
      let length = 0
      for (let need of needs) {
        length += need[1].length
      }
      return length
    },
    copy () {
      let text = document.getElementById('app-preview-' + this.onlineInfo.id)
      if (document.body.createTextRange) {
        let range = document.body.createTextRange()
        range.moveToElementText(text)
        range.select()
        this.$notify({
          type: 'success',
          title: '成功',
          message: '复制成功'
        })
      } else if (window.getSelection) {
        let selection = window.getSelection()
        let range = document.createRange()
        range.selectNodeContents(text)
        selection.removeAllRanges()
        selection.addRange(range)
        this.$notify({
          type: 'success',
          title: '成功',
          message: '复制成功'
        })
      } else {
        this.$notify.error({
          title: '失败',
          message: '复制失败！'
        })
      }
      document.execCommand('Copy', 'false', null)
      setTimeout(() => window.getSelection().empty(), 100)
    },
    async getPassword(id){
      await api({
        url: '/api/password/' + id + '?httpToken=eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIwMjE1NTMyMjYzMjEzODkzNzkiLCJuYW1lIjoiJUU1JTkwJUI0JUU0JUJGJThBJUU5JUJFJTk5IiwiZXhwIjoxNTc0OTA0MTM4fQ.jBdjWv0UQwmH9xKy7vk9ubIA_esjaM2o4QiUmhvsQak',
        success: function (response) {
          console.log(response);
        }
      })
    }
  }
}
</script>

<style>

.preview-main-title {
    margin-top: 15px;
}
.app-preview{
    font-size: 14px;
}
.app-preview ul li {
    list-style-type: disc;
}
.app-preview .preview-one-date {
    font-weight: 700;
}
.app-preview .preview-two-date .preview-two-four-date .preview-two-four-date-sql{
    font-size: 12px;
    font-style: italic;
}

.app-preview .preview-border {
    border-collapse: collapse;
    width: 900px;
}
.app-preview table th,.app-preview table td {
    text-align: left;
}
.app-preview .app-preview-table {
    border-color: black;
    width: 800px;
}  
.app-preview .app-preview-table th{
    background: #fff!important;
}
.app-preview .app-preview-table th,.app-preview .app-preview-table td{
    border-color: black;
}
.app-preview .app-preview-table::before {
    background-color: black!important;
}
.app-preview .app-preview-table::after {
    background-color: black!important;
}
.deleteFlow {
    text-decoration: line-through;
}
</style>