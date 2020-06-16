import request from '@/utils/request'

// 获取投诉详情
export function getSite(town, lng, lat) {
  return request({
    url: 'http://127.0.0.1:5000/noma/api/v1/sites?town=' + town + '&lng=' + lng + '&lat=' + lat,
    method: 'get'
  })
}

