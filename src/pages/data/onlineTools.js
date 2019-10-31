import { isvalidPhone, isvalidEmail } from '@/utils'

const onlineTimes = [
  { value: 1350, label: '22:30' },
  { value: 1230, label: '20:30' }
]

const shortcuts = [
  {
    text: '今天',
    onClick (picker) {
      picker.$emit('pick', new Date())
    }
  },
  {
    text: '明天',
    onClick (picker) {
      const date = new Date()
      date.setTime(date.getTime() + 3600 * 1000 * 24)
      picker.$emit('pick', date)
    }
  }
]

const onlineAppformRules = {
  name: [
    { required: true, message: '请输入您的姓名', trigger: ['blur', 'change'] },
    { min: 2, max: 5, message: '请输入正确的姓名', trigger: ['blur', 'change'] }
  ],
  phone: [
    { required: true, message: '请输入电话号码', trigger: ['blur', 'change'] },
    { validator (rule, value, callback) {
      if (isvalidPhone(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的11位手机号码'))
      }
    },
    trigger: ['blur', 'change'] }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: ['blur', 'change'] },
    { validator (rule, value, callback) {
      if (isvalidEmail(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的邮箱'))
      }
    },
    trigger: ['blur', 'change'] }
  ],
  date: [
    { type: 'number', required: true, message: '请选择日期', trigger: ['blur', 'change'] }
  ],
  time: [
    { type: 'number', required: true, message: '请选择时间', trigger: ['blur', 'change'] }
  ]
}

const onlineNeedTypes = [
  { value: 0, label: '需求' },
  { value: 1, label: '优化' },
  { value: 2, label: 'BUG' }
]

export { onlineTimes, shortcuts, onlineAppformRules, onlineNeedTypes }
