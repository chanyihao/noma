<template>
  <div>
    <el-row class="top">
      <el-col :span="8"><div class="grid-content bg-purple">
        <el-input v-model="input" placeholder="请输入经纬度"></el-input>
      </div></el-col>
      <el-col :span="8"><div class="grid-content bg-purple-light">
        <label class="title">坐标系转换</label>
        <el-radio-group v-model="radio" @change="changeCoord">
          <el-radio :label="1">百度（bd09l）→ 标准（wgs84）</el-radio>
          <el-radio :label="2">标准（wgs84）→ 百度（bd09l）</el-radio>
          <el-radio :label="3">国测（gcj02）</el-radio>
        </el-radio-group>
      </div></el-col>
      <el-col :span="8"><div class="grid-content bg-purple">
        <el-input v-model="output" placeholder="转换后经纬度"></el-input>
      </div></el-col>
    </el-row>

    <div class="map">
      <YiBaiduMap
        v-loading="loading"
        element-loading-text="投诉数据加载中"
        :zoom="zoom"
        :center="center"
        :marker="center"
        :is-get-coord="getcoord_flag"
        :points="complain_points"
        @getCoord="getCoord"
      >
      </YiBaiduMap>
    </div>
  </div>
</template>

<script>
import YiBaiduMap from "@/components/Yi-BaiduMap";
import { wgs84tobd09, bd09towgs84 } from "@/utils/transformCoordinate.js";

export default {
  name: "Coord",
  components: { YiBaiduMap },
  data() {
    return {
      center: "衢州市",
      ak: "U43Xy5aiHHDKWZwQOxPn7NS8kGdv8kFO",
      zoom: 10,
      lng: 0,
      lat: 0,
      lng_temp: 0,
      lat_temp: 0,
      town: "",
      address: "",
      temp: {
        cp_no: "",
        city: ""
      }, // 更新数据临时存储
      change_flag: false, // 是否修改标记
      getcoord_flag: true, // 是否打开坐标拾取标价
      complain_points: [],
      loading: false,
      radio: 3, // 单选默认值
      input: '', // 输入经纬度
      output: '',
      coordinate: 'wgs84'
    };
  },
  created() {
  },
  methods: {
    // 打开拾取坐标功能
    opengetCoord() {
      this.getcoord_flag = !this.getcoord_flag;
      // this.getcoord_flag = true;
      if (this.getcoord_flag) {
        this.$message({
          message: "已开启坐标拾取功能",
          type: "success",
          duration: "1000"
        });
      } else {
        this.$message({
          message: "坐标拾取已关闭",
          duration: "1000"
        });
      }
    },
    // 显示坐标地址信息
    getCoord(data) {
      // alert(data.address);
      this.temp.lng = data.lng;
      this.temp.lat = data.lat;
      this.temp.town = data.town;
      this.temp.address = data.address;
      this.change_flag = true;
    },
    changeCoord() {
      alert(this.lng_temp);
      this.inputCoord(this.input);
      switch (this.radio) {
        case 1:
          this.bdTowgs(this.lng_temp, this.lat_temp)
          break;
        case 2:
          this.wgsTobd(this.lng_temp, this.lat_temp)
          break;
        case 3:
          break;
        default:
      }
    },
    wgsTobd(lng, lat) {
      var point = wgs84tobd09(lng, lat);
      this.lng = point[0];
      this.lat = point[1];
      this.output = point[0] + "," + point[1];
    },
    bdTowgs(lng, lat) {
      var point = bd09towgs84(lng, lat);
      this.lng = point[0];
      this.lat = point[1];
      this.output = point[0] + "," + point[1];
    },
    inputCoord(keyword) {
      // alert("搜索坐标" + keyword);
      // this.coordinate = "wgs84";
      var arr = keyword.split(/,|，|;|；/);
      this.lng_temp = parseFloat(arr[0]); // 转换为float
      this.lat_temp = parseFloat(arr[1]);
      // var label = "当前经纬度：" + lng + ";" + lat;
      // 判断是否可以转换为float
      // if (!lng & !lat) {
      //   this.list = [];
      // } // 搜索结果为空
      // this.createMarker(lng, lat, label); // 创建搜索结果点
    }
    // searchCoord(keyword) {
    //   // alert("搜索坐标" + keyword);
    //   this.coordinate = "wgs84";
    //   var arr = keyword.split(/,|，|;|；/);
    //   var lng = parseFloat(arr[0]); // 转换为float
    //   var lat = parseFloat(arr[1]);
    //   var label = "当前经纬度：" + lng + ";" + lat;
    //   // 判断是否可以转换为float
    //   if (!lng & !lat) {
    //     this.list = [];
    //   } // 搜索结果为空
    //   this.createMarker(lng, lat, label); // 创建搜索结果点
    // }
  }
}
</script>

<style lang="scss" scoped>
.top {
  padding-top: 50px;
  padding-left: 20px;
}
.title{
  font-size: 16px;
  padding-right: 10px;
}
.map {
  padding-top: 20px;
}
// 穿透bm-view样式
.map /deep/ .bm-view {
  width: 100%;
  height: 800px;
}

</style>
