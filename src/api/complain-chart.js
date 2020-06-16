import request from '@/utils/request'

//  获取日报表数据
export function getDayData(params) {
  return request({
    url: 'http://127.0.0.1:5000/noma/api/v1/complains/daychart',
    method: 'get',
    params
  })
}

// 获取所有数据
export function getAllData(params) {
  return request({
    url: 'http://127.0.0.1:5000/noma/api/v1/complains/table',
    method: 'get',
    params
  })
}

// 热点投诉数据
export function getHotData(params) {
  return request({
    url: 'http://127.0.0.1:5000/noma/api/v1/complains/hot',
    method: 'get',
    params
  })
}
