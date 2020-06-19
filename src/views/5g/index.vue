<template>
  <el-row>
    <el-col
      v-loading="loading"
      element-loading-text="地图数据加载中"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :span="24"
    >
      <div class="content">
        <baidu-map
          class="bm-view"
          :center="center"
          :zoom="zoom"
          :scroll-wheel-zoom="true"
          :map-type="mapType"
          @ready="handler"
        >
          <!--弹窗信息窗体-->
          <bm-info-window
            :position="infoWindow.position"
            :title="infoWindow.title"
            :show="infoWindow.show"
            @close="infoWindowClose"
            @open="infoWindowOpen"
          >
            <p>
              <span class="left"></span>
              <span class="right">{{ infoWindow.content.info1 }}</span>
            </p>
            <p>
              <span class="left"></span>
              <span class="right">{{ infoWindow.content.info2 }}</span>
            </p>
            <p>
              <span class="left"></span>
              <span class="right">{{ infoWindow.content.info3 }}</span>
            </p>
            <p>
              <span class="left"></span>
              <span class="right">{{ infoWindow.content.info4 }}</span>
            </p>
            <p>
              <a class="edit-complain" href>更新信息</a>
            </p>
          </bm-info-window>
          <!-- 加载投诉海量点 -->
          <bm-point-collection
            :points="complain_points"
            shape="BMAP_POINT_SHAPE_RHOMBUS"
            color="#00ffff"
            size="BMAP_POINT_SIZE_NORMAL"
            @click="clickComplainsHandler"
          ></bm-point-collection></baidu-map>
      </div>
    </el-col>
  </el-row>
</template>

<script>
// import BaiduMap from "vue-baidu-map/components/map/Map.vue";
// import mapStyle from './static/mapStyle.json'
// import * as mapv from 'mapv'
import "@/styles/base.css";
import "@/styles/infowindow.css";
import { getAllComplain } from "@/api/all-complain.js";
import { wgs84tobd09 } from "@/utils/transformCoordinate.js";

export default {
  name: "FiveG",
  data() {
    return {
      center: "衢州",
      zoom: 10,
      mapType: "BMAP_HYBRID_MAP",
      // mapStyle: { style: "normal" },
      complain_points: [],
      temp_complains: [], // 临时存储投诉点数据
      listQuery: {
        // 投诉库查询参数
        page: 1,
        limit: 0, // 每页显示数量
        city: "",
        user_tel: "",
        start_date: "2020-04-01",
        end_date: "2020-05-31",
        area: ""
      },
      infoWindow: {
        position: {
          lng: 0,
          lat: 0
        },
        title: "",
        show: false,
        content: {
          info1: "",
          info2: "",
          info3: "",
          info4: ""
        }
      },
      loading: false
    };
  },
  watch: {},
  mounted() {
    // console.log(mapv.OpenlayersLayer, mapv.DataSet, mapv.utilCityCenter)
    this.getDate();
  },
  methods: {
    // 获取当前时间
    getDate() {
      // 时间控件，默认当前日期
      var now = new Date();
      // 格式化日，如果小于9，前面补0
      var day = ("0" + now.getDate()).slice(-2);
      // 格式化月，如果小于9，前面补0
      var month = ("0" + (now.getMonth() + 1)).slice(-2);
      // 拼装完整日期格式
      var today = now.getFullYear() + "-" + month + "-" + day;
      this.listQuery.end_date = today;
    },
    infoWindowOpen(e) {
      this.infoWindow.show = true;
    },
    infoWindowClose(e) {
      this.infoWindow.show = false;
    },
    handler({ BMap, map }) {
      var mapv = require("mapv");
      this.loading = true;
      getAllComplain(this.listQuery)
        .then(response => {
          //   console.log(response.data);
          this.complain_points = response.data;
          var count = this.complain_points.length;
          var data = [];
          var point = [];
          // 构造数据
          for (var i = 0; i < count; i++) {
            point = wgs84tobd09(
              this.complain_points[i].lng,
              this.complain_points[i].lat
            ); // wgs84坐标系转换为bd09l
            data.push({
              geometry: {
                type: "Point",
                coordinates: [point[0], point[1]]
              },
              cp_name: this.complain_points[i].user_tel
            });
          }
          var dataSet = new mapv.DataSet(data);
          var options = {
            // shadowColor: 'rgba(255, 250, 50, 1)',
            // shadowBlur: 10,
            fillStyle: "rgba(255, 50, 0, 1.0)", // 非聚合点的颜色
            size: 5, // 非聚合点的半径
            minSize: 8, // 聚合点最小半径
            maxSize: 31, // 聚合点最大半径
            globalAlpha: 0.8, // 透明度
            clusterRadius: 150, // 聚合像素半径
            methods: {
              click: function(data) {
                console.log(data); // 点击事件
                // alert(data.geometry.coordinates[1]); // 点击事件
                this.infoWindow = {
                  position: {
                    lng: data.geometry.coordinates[0],
                    lat: data.geometry.coordinates[1]
                  },
                  title: "hello",
                  show: true,
                  content: {
                    info1: "投诉时间：",
                    info2: "投诉内容：",
                    info3: "处理过程：",
                    info4: "解决方案："
                  }
                };
                console.log(this.infoWindow);
              }
            },
            maxZoom: 18, // 最大显示级别，超过不显示点聚合
            minZoom: 8, // 最小显示级别
            label: {
              // 聚合文本样式
              show: true, // 是否显示
              fillStyle: "white"
              // shadowColor: 'yellow',
              // font: '20px Arial',
              // shadowBlur: 10,
            },
            gradient: { 0: "blue", 0.5: "yellow", 1.0: "rgb(255,0,0)" }, // 聚合图标渐变色
            draw: "cluster"
          };

          // eslint-disable-next-line new-cap
          var mapvLayer = new mapv.baiduMapLayer(map, dataSet, options);
          console.log(mapvLayer);
          this.loading = false;
          this.getCompalins(); // 同时加载投诉海量点
        })
        .catch(response => {
          this.loading = false;
        });
    },
    // 获取投诉数据
    getCompalins() {
      // this.complain_flag = !this.complain_flag;
      // this.loading = true;
      getAllComplain(this.listQuery)
        .then(response => {
          // console.log(response.data);
          var d = response.data;
          var len = d.length;
          var data = [];
          var point = [];
          // 构造数据
          for (var i = 0; i < len; i++) {
            point = wgs84tobd09(
              d[i].lng,
              d[i].lat
            ); // wgs84坐标系转换为bd09l
            data.push({
              geometry: {
                type: "Point",
                coordinates: [point[0], point[1]]
              },
              lng: point[0],
              lat: point[1],
              city: d[i].city,
              cp_time: d[i].cp_time,
              cell_name: d[i].cell_name,
              user_tel: d[i].user_tel,
              cp_type: d[i].cp_type,
              workorder: d[i].workorder,
              index: i // 对应数据数组中的索引
            });
          }
          this.complain_points = data;
          // this.loading = false;
        })
        .catch(response => {
          // this.loading = false;
        });
    },
    clickComplainsHandler(e) {
      // console.log(e.point.index); // 多点击的点对应所在数组的索引
      // this.cp_edit_data = this.CpAllData[e.point.index];
      var len = this.complain_points.length;
      for (var i = 0; i < len; i++) {
        var data = this.complain_points[i];
        if (data.lng === e.point.lng && data.lat === e.point.lat) {
          this.infoWindow = {
            position: {
              lng: e.point.lng,
              lat: e.point.lat
            },
            title: data.cell_name,
            show: true,
            content: {
              info1: "投诉时间：" + data.cp_time,
              info2: "投诉号码：" + data.user_tel,
              info3: "投诉现象：" + data.cp_type,
              info4: "是否落单：" + data.workorder
            }
          };
          return;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  height: 100%;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  .bm-view {
    width: 100%;
    height: 93vh;
  }
}
</style>
<style>
/*去除百度地图版权*/
/* .anchorBL {
  display: none;
} */
</style>
