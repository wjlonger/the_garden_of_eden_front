const fronts = [
  {value: 'front-manage', label: 'front-manage', url: 'http://zys.zhiyunshan.com/console/version.txt'},
  {value: 'front-reserve', label: 'front-reserve', url: 'http://zys.zhiyunshan.com/reserve/version.txt'},
  {value: 'front-mobile', label: 'front-mobile', url: 'http://zys.zhiyunshan.com/mobile/version.txt'},
  {value: 'front-aux', label: 'front-aux', url: 'http://zys.zhiyunshan.com/aux/version.txt'},
  {value: 'warehouse-orderApp', label: 'warehouse-orderApp', url: 'http://zys.zhiyunshan.com/orderapp/version.txt'}
]

const eastServers = [
  {value: 'zys-auth', label: 'zys-auth', url: 'http://zys.zhiyunshan.com/auth/shl/info'},
  {value: 'zys-base', label: 'zys-base', url: 'http://zys.zhiyunshan.com/base/shl/info'},
  {value: 'zys-food', label: 'zys-food', url: 'http://zys.zhiyunshan.com/food/shl/info'},
  {value: 'zys-pay', label: 'zys-pay', url: 'http://zys.zhiyunshan.com/pay/shl/info'},
  {value: 'zys-upload', label: 'zys-upload', url: 'http://zys.zhiyunshan.com/upload/shl/info'},
  {value: 'zys-report', label: 'zys-report', url: 'http://zys.zhiyunshan.com/report/shl/info'}
]

const servers = [
  {value: 'zys-auth', label: 'zys-auth', url: 'http://zys.zhiyunshan.com/auth/shl/info'},
  {value: 'zys-base', label: 'zys-base', url: 'http://zys.zhiyunshan.com/base/shl/info'},
  {value: 'zys-food', label: 'zys-food', url: 'http://zys.zhiyunshan.com/food/shl/info'},
  {value: 'zys-pay', label: 'zys-pay', url: 'http://zys.zhiyunshan.com/pay/shl/info'},
  {value: 'zys-upload', label: 'zys-upload', url: 'http://zys.zhiyunshan.com/upload/shl/info'},
  {value: 'zys-report', label: 'zys-report', url: 'http://zys.zhiyunshan.com/report/shl/info'},
  {value: 'zys-openapi-base', label: 'zys-openapi-base', url: 'http://zys.zhiyunshan.com/openapi-base/shl/info'},
  {value: 'zys-openapi-pay', label: 'zys-openapi-pay', url: 'http://zys.zhiyunshan.com/openapi-pay/shl/info'},
  {value: 'zys-access', label: 'zys-access', url: 'http://zys.zhiyunshan.com/access/shl/info'},
  {value: 'zys-assistant', label: 'zys-assistant', url: 'http://zys.zhiyunshan.com/assistant/shl/info'},
  {value: 'zys-zoloz-log', label: 'zys-zoloz-log', url: 'http://zys.zhiyunshan.com/zoloz-log/shl/info'},
  {value: 'zys-monitor', label: 'zys-monitor', url: 'http://zys.zhiyunshan.com/monitor/shl/info'},
  {value: 'zys-tiancang', label: 'zys-tiancang', url: 'http://zys.zhiyunshan.com/tiancang/shl/info'},
  {value: 'zys-mini-tools', label: 'zys-mini-tools', url: 'http://zys.zhiyunshan.com/mini-tools/shl/info'},
  {value: 'zys-retail', label: 'zys-retail', url: 'http://zys.zhiyunshan.com/retail/shl/info'},
  {value: 'zys-transaction', label: 'zys-transaction', url: 'http://zys.zhiyunshan.com/transaction/shl/info'}
]

const commons = ['common-api', 'common-spring', 'common-util']

const gits = new Map(
  [
    ['common-api', 'http://192.168.1.254:8989/zhiyunshan/server/zys-commons-api.git'],
    ['common-spring', 'http://192.168.1.254:8989/zhiyunshan/server/zqsy-commons-spring.git'],
    ['common-util', 'http://192.168.1.254:8989/zhiyunshan/server/zqsy-commons-util.git'],
    ['front-manage', 'http://192.168.1.254:8989/zhiyunshan/web/zys-manage-front.git'],
    ['front-reserve', 'http://192.168.1.254:8989/zhiyunshan/web/zys-reserve-front.git'],
    ['front-mobile', 'http://192.168.1.254:8989/zhiyunshan/web/zys-mobile-front.git'],
    ['front-aux', 'http://192.168.1.254:8989/zqsy-nb/zys-web-group/stats-manage-front.git'],
    ['warehouse-orderApp', 'http://192.168.1.254:8989/zhiyunshan/web/zys-warehouse-orderApp.git'],
    ['zys-auth', 'http://192.168.1.254:8989/zhiyunshan/server/zys-auth.git'],
    ['zys-base', 'http://192.168.1.254:8989/zhiyunshan/server/zys-base.git'],
    ['zys-food', 'http://192.168.1.254:8989/zhiyunshan/server/zys-food.git'],
    ['zys-pay', 'http://192.168.1.254:8989/zhiyunshan/server/zys-pay.git'],
    ['zys-upload', 'http://192.168.1.254:8989/zhiyunshan/server/zys-upload.git'],
    ['zys-report', 'http://192.168.1.254:8989/zhiyunshan/server/zys-report.git'],
    ['zys-openapi-base', 'http://192.168.1.254:8989/zhiyunshan/server/zys-openapi-base.git'],
    ['zys-openapi-pay', 'http://192.168.1.254:8989/zhiyunshan/server/zys-openapi-pay.git'],
    ['zys-access', 'http://192.168.1.254:8989/zhiyunshan/server/zys-access.git'],
    ['zys-assistant', 'http://192.168.1.254:8989/zhiyunshan/server/zys-assistant.git'],
    ['zys-zoloz-log', 'http://192.168.1.254:8989/zhiyunshan/server/zys-zoloz-log.git'],
    ['zys-monitor', 'http://192.168.1.254:8989/zhiyunshan/server/zys-monitor.git'],
    ['zys-tiancang', 'http://192.168.1.254:8989/zhiyunshan/server/zys-tiancang.git'],
    ['zys-mini-tools', 'http://192.168.1.254:8989/zhiyunshan/server/zys-mini-tools.git'],
    ['zys-retail', 'http://192.168.1.254:8989/zhiyunshan/server/retail.git'],
    ['zys-transaction', 'http://192.168.1.254:8989/zhiyunshan/server/zys-transaction.git']
  ]
)
export { fronts, eastServers, servers, gits, commons }
