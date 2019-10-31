const onlineFlow = [
  { id: 0, label: '1）、运维人员提前1个小时构建服务端应用Jenkins', delete: false },
  { id: 1, label: '2）、DBA升级华东数据库，然后升级华北数据库', delete: false },
  { id: 2, label: '3）、运维上线华东应用', delete: false },
  { id: 3, label: '4）、运维发送上线完成邮件', delete: false },
  { id: 4, label: '5）、测试人员测试支付', delete: false },
  { id: 5, label: '6）、测试人员发送测试完成邮件', delete: false },
  { id: 6, label: '7）、运维上线华北应用', delete: false },
  { id: 7, label: '8）、运维发送上线完成邮件', delete: false },
  { id: 8, label: '9）、测试人员测试支付', delete: false },
  { id: 9, label: '10）、测试人员发送测试完成邮件', delete: false },
  { id: 10, label: '11）、运维在出现问题后立即回滚华北应用及华东应用', delete: false }
]

export { onlineFlow }
