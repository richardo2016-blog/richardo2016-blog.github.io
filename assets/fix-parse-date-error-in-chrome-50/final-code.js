function padStart (str = '', len = 2, padContent = '0') {
  while (str.length < len) {
    str = padContent + str
  }

  return str
}

// 分析环境中的 Date 对象信息
function parseDateEnvInfo () {
  // new Date(numberOrString) 时, 如果传入的是字符串, 内部会调用 Date.parse 解析传入的参数
  // 为了对比检测环境对 ISO-8601 格式字符串的解析是否正确，我们
  // 使用 new Date(0) 来创建系统初始时间
  const accurate = new Date(0)
  const iso8601 = new Date("1970-01-01T00:00:00")

  // 从系统中获取时间差, 判定环境是否属于 GMT 0 时区
  const offsetMs = accurate.getTimezoneOffset() * 6e4
  const in_gmt_0 = offsetMs === 0
  const offsetMsCalculated = iso8601 - accurate

  // 对比两个值:
  //  1. 正确的时区 millisecond 值: offsetMs;
  //  2. 解析 ISO-8601 日期时间字符串得到的"本地时间"和 UTC 0 时间之间的 millisecond 值: offsetMsCalculated
  //
  // 如果两个值不相等, 说明环境不遵守解析 ISO-8601 日期时间字符串的规则, 在解析字符串的时候,
  // 总会产生一个误差值; 反之, 说明环境正确解析了 ISO-8601 日期时间字符串
  const follow_iso_8601_outside_gmt0_zone = offsetMs === offsetMsCalculated

  return {
    in_gmt_0,
    follow_iso_8601_outside_gmt0_zone,
    // 这个值便是环境中解析 ISO-8601 日期时间字符串时的误差值, 如果没有误差, 这个值为 0
    error_offset_ms_when_date_parse: offsetMsCalculated - offsetMs,
    offsetMs,
    offsetMsCalculated
  }
}
// 该正则表达式并不能匹配出所有的 ISO_8601 格式的字符串, 此处仅用作示例
const ISO_8601_REG = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/

function dateFormat (value, format = 'YYYY-MM-dd HH:mm:ss') {
  // 消除环境误差
  const errorValue = ISO_8601_REG.test(value) ? parseDateEnvInfo().error_offset_ms_when_date_parse : 0
  const time = Date.parse(value) - errorValue

  const dateObj = new Date(time)
  const year = dateObj.getFullYear()
  const month = dateObj.getMonth() + 1
  const date = dateObj.getDate()
  const hours = dateObj.getHours()
  const minutes = dateObj.getMinutes()
  const seconds = dateObj.getSeconds()
  const rs = format
      .replace('YYYY', padStart(year + '', 4))
      .replace('MM', padStart(month + ''))
      .replace('dd', padStart(date + ''))
      .replace('HH', padStart(hours + ''))
      .replace('mm', padStart(minutes + ''))
      .replace('ss', padStart(seconds + ''))

  return rs
}
