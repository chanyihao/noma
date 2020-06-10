<template>
  <div class="app-container">
    <el-container>
      <el-main>
        <div class="filter">
          <el-date-picker
            v-model="select_date"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            unlink-panels="true"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            size="mini"
            @change="handleFilter"
          />
          <el-select
            v-model="listQuery.city"
            placeholder="县市"
            :clearable="true"
            size="mini"
            style="width: 90px"
            class="filter-item"
            @change="handleFilter"
          >
            <el-option v-for="item in citys" :key="item" :label="item" :value="item" />
          </el-select>
          <el-select
            v-model="listQuery.is_solved"
            placeholder="是否解决"
            :clearable="true"
            size="mini"
            style="width: 100px"
            class="filter-item"
            @change="handleFilter"
          >
            <el-option v-for="item in yes_or_no" :key="item" :label="item" :value="item" />
          </el-select>
          <el-select
            v-model="listQuery.is_overtime"
            placeholder="是否超期"
            :clearable="true"
            size="mini"
            style="width: 100px"
            class="filter-item"
            @change="handleFilter"
          >
            <el-option v-for="item in yes_or_no" :key="item" :label="item" :value="item" />
          </el-select>
          <el-input
            v-model="keyword"
            prefix-icon="el-icon-search"
            placeholder="搜索用户号码/投诉地点"
            style="width: 230px;"
            class="filter-item"
            :clearable="true"
            size="mini"
            @keyup.enter.native="handleFilter"
            @change="handleFilter"
          />
          <el-button
            class="filter-item"
            type="primary"
            size="mini"
            icon="el-icon-search"
            @click="handleFilter"
          >搜索</el-button>
          <el-button
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            size="mini"
            icon="el-icon-refresh-right"
            @click="handleClear"
          >清空筛选</el-button>
          <el-button
            :loading="downloadLoading"
            class="filter-item"
            size="mini"
            type="primary"
            icon="el-icon-download"
            @click="handleDownload"
          >批量导出</el-button>
          <el-upload
            ref="upload"
            class="upload"
            size="mini"
            accept=".xlsx"
            :multiple="false"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :http-request="uploadExcel"
            :auto-upload="true"
          >
            <el-button
              slot="trigger"
              :loading="upLoading"
              class="filter-item"
              type="primary"
              size="mini"
              icon="el-icon-upload"
            >批量导入</el-button>
            <div slot="tip" class="el-upload__tip">
              <a :href="demo_download" download="无线投诉清单导入模板.xlsx">导入模板下载</a>
            </div>
          </el-upload>
        </div>
        <!-- 主体表格 -->
        <div class="table">
          <el-table
            v-loading="listLoading"
            :data="list"
            stripe
            height="620"
            element-loading-text="Loading"
            border
            fit
            highlight-current-row
          >
            <el-table-column align="center" label="编号" width="80">
              <template slot-scope="scope">{{ scope.row.cp_id }}</template>
            </el-table-column>
            <!--      <el-table-column label="流水号" width="80" align="center" show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ scope.row.cp_no }}
        </template>
            </el-table-column>-->
            <el-table-column label="投诉日期" width="130" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <i class="el-icon-time" />
                <span>{{ scope.row.cp_time }}</span>
              </template>
            </el-table-column>
            <el-table-column label="县市" width="50" align="center">
              <template slot-scope="scope">{{ scope.row.city }}</template>
            </el-table-column>
            <el-table-column label="乡镇/街道" width="100" align="center">
              <template slot-scope="scope">{{ scope.row.town }}</template>
            </el-table-column>
            <el-table-column label="投诉地点" width="100" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{ scope.row.area }}</template>
            </el-table-column>
            <el-table-column label="用户号码" width="130" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{ scope.row.user_tel }}</template>
            </el-table-column>
            <el-table-column label="投诉内容" width="200" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{ scope.row.cp_info }}</template>
            </el-table-column>
            <el-table-column
              label="处理过程"
              width="180"
              align="center"
              height="50"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">{{ scope.row.deal_info }}</template>
            </el-table-column>
            <el-table-column class-name="status-col" label="原因分类" width="110" align="center">
              <template slot-scope="scope">{{ scope.row.cp_type }}</template>
            </el-table-column>
            <el-table-column class-name="status-col" label="当前进度" width="110" align="center">
              <template slot-scope="scope">{{ scope.row.plan_progres }}</template>
            </el-table-column>
            <el-table-column class-name="status-col" label="是否解决" width="80" align="center">
              <template slot-scope="scope">
                <el-tag :type="scope.row.is_solved | statusFilter">{{ scope.row.is_solved }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80" align="center">
              <template slot-scope="scope">
                <!-- <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.cp_id, scope.row)"
          >
                删除 </el-button>-->
                <el-button size="mini" type="primary" @click="handleUpdate(scope.row)">编辑</el-button>
              </template>
            </el-table-column>
            <el-table-column class-name="status-col" label="地图查看" width="80" align="center">
              <template slot-scope="scope">
                <el-button
                  type="warning"
                  icon="el-icon-view"
                  size="mini"
                  circle
                  @click="gotoMap(scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="getComplainList"
        />
        <!-- 编辑信息弹窗 -->
        <el-dialog
          :title="textMap[dialogStatus]"
          :visible.sync="dialogFormVisible"
          center
          width="50%"
          top="5vh"
          :fullscreen="true"
          :before-close="closeUpdate"
          class="my"
        >
          <div class="edit-pop">
            <div class="left-form">
              <el-form
                ref="dataForm"
                :rules="rules"
                :model="temp"
                label-position="left"
                label-width="70px"
                style="width: 700px; margin-left:50px;"
                size="mini"
              >
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-form-item label="流水号">
                      <el-input v-model="temp.cp_no" disabled="true" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="投诉时间">
                      <el-input v-model="temp.cp_time" disabled="true" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="投诉日期">
                      <el-input v-model="temp.cp_date" disabled="true" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-form-item label="县市" prop="type">
                      <el-select v-model="temp.city" class="filter-item" placeholder="选择县市">
                        <el-option v-for="item in citys" :key="item" :label="item" :value="item" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="用户号码">
                      <el-input v-model="temp.user_tel" disabled="true" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="用户星级">
                      <el-input v-model="temp.user_star" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-form-item label="终端型号">
                      <el-input v-model="temp.phone_type" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="城区农村" prop="type">
                      <el-select v-model="temp.is_village" class="filter-item" placeholder="选择区域">
                        <el-option v-for="item in is_village" :key="item" :label="item" :value="item" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="区域类型">
                      <el-select
                        v-model="temp.place"
                        class="filter-item"
                        placeholder="Please select"
                      >
                        <el-option
                          v-for="item in area_type"
                          :key="item"
                          :label="item"
                          :value="item"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="投诉内容">
                      <el-input v-model="temp.cp_info" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="处理过程">
                      <el-input
                        v-model="temp.deal_info"
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-form-item label="经度" prop="type">
                      <el-input
                        v-model="temp.lng"
                        tabindex="lng"
                        :class="change_flag? 'input-change':''"
                        @input="inputChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="纬度" prop="type">
                      <el-input
                        v-model="temp.lat"
                        :class="change_flag? 'input-change':''"
                        @input="inputChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="修改报错">
                      <el-button
                        v-if="!getcoord_flag"
                        type="success"
                        icon="el-icon-location"
                        size="mini"
                        round
                        @click="opengetCoord"
                      >开启地图拾取经纬度</el-button>
                      <el-button
                        v-else
                        type="danger "
                        icon="el-icon-location"
                        size="mini"
                        round
                        @click="opengetCoord"
                      >关闭地图拾取经纬度</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-form-item label="乡镇街道" prop="type">
                      <el-input v-model="temp.town" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="投诉区域" prop="type">
                      <el-input v-model="temp.area" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="影响人口" prop="type">
                      <el-input v-model="temp.poor_coverage" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="详细地址">
                      <el-input
                        v-model="temp.address"
                        :class="change_flag? 'input-change':''"
                        @input="inputChange"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-form-item label="原因分类" prop="type">
                      <el-select v-model="temp.cp_type" class="filter-item" placeholder="选择原因">
                        <el-option v-for="item in cp_type" :key="item" :label="item" :value="item" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="影响网络">
                      <el-select v-model="temp.net_type" class="filter-item" placeholder="请选择">
                        <el-option
                          v-for="item in net_type"
                          :key="item"
                          :label="item"
                          :value="item"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="投诉栅格" prop="type">
                      <el-input v-model="temp.raster" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-form-item label="方案类型">
                      <el-select v-model="temp.solve_type" class="filter-item" placeholder="选择方案类型">
                        <el-option
                          v-for="item in solve_type"
                          :key="item"
                          :label="item"
                          :value="item"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="解决方案" prop="type">
                      <el-input v-model="temp.solve_plan" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="方案进度">
                      <el-input v-model="temp.plan_progres" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-form-item label="是否解决" prop="type">
                      <el-badge :value="temp.is_solved=='否'?'待解决':''" class="item">
                        <el-select
                          v-model="temp.is_solved"
                          class="filter-item"
                          placeholder="Please select"
                        >
                          <el-option
                            v-for="item in yes_or_no"
                            :key="item"
                            :label="item"
                            :value="item"
                          />
                        </el-select>
                      </el-badge>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="预计时间">
                      <!-- <el-date-picker
              v-model="temp.plan_time"
              type="date"
              placeholder="选择日期"
              size="mini">
                      </el-date-picker>-->
                      <el-input v-model="temp.plan_time" placeholder="预计解决（格式2020-03-28）" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="实际时间">
                      <el-input v-model="temp.solved_time" placeholder="实际解决（格式2020-03-28）" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="最新进展">
                      <el-input
                        v-model="temp.tracking_info"
                        type="textarea"
                        :autosize="{ minRows: 1, maxRows: 2}"
                        placeholder="解决方案的最新进度"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-form-item label="处理人">
                      <el-input v-model="temp.deal_user" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="值班人">
                      <el-input v-model="temp.duty_user" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item>
                      <el-button type="info" @click="closeUpdate">关闭</el-button>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item>
                      <el-button type="primary" @click="updateData">保存</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>

            <!-- 查看地图弹窗 ,需放在信息编辑弹窗中-->
            <div class="right-map">
              <template>
                <YiBaiduMap
                  v-loading="loading"
                  element-loading-text="投诉数据加载中"
                  :zoom="zoom"
                  :center="center"
                  :marker="center"
                  :is-get-coord="getcoord_flag"
                  :points="complain_points"
                  @getCoord="getCoord"
                />
              </template>
            </div>
          </div>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getComplain, updateComplain, uploadComplain } from "@/api/complain.js";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { parseTime } from "@/utils";
import { wgs84tobd09 } from "@/utils/transformCoordinate.js";
import YiBaiduMap from "@/components/Yi-BaiduMap";

export default {
  name: "ComplainList",
  components: { Pagination, YiBaiduMap },
  filters: {
    statusFilter(status) {
      const statusMap = {
        是: "success",
        否: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      select_date: "", // 查询的日期区间
      list: null,
      listLoading: true,
      total: 0,
      keyword: "", // 搜索关键字
      fileList: [], // excel文件
      listQuery: {
        page: 1,
        limit: 10, // 每页显示数量
        city: "",
        user_tel: "",
        is_solved: "",
        is_overtime: "",
        start_date: "",
        end_date: "",
        area: ""
      },
      citys: ["柯城", "衢江", "江山", "龙游", "常山", "开化", "外地"],
      is_village: ["城区", "农村", "未知"],
      place: ["商业区", "居民小区", "住宅区"],
      cp_type: ["4G弱覆盖", "2G+4G弱覆盖", "2G弱覆盖", "设备故障", "无法确定"],
      net_type: ["4G", "2G+4G", "2G"],
      solve_type: ["规划", "优化", "不解决", "故障"],
      yes_or_no: ["是", "否"],
      temp: {
        cp_no: "",
        city: ""
      }, // 更新数据临时存储
      original: {},
      textMap: {
        update: "修改投诉详单",
        create: "创建投诉详单"
      },
      dialogFormVisible: false, // 控制对话框是否显示
      showPopMap: false, // 查看地图对话框
      dialogStatus: "", // 设置对话框是update还是create
      demo_download: "./static/complain.xlsx", // 导入模板地址
      center: "衢州市",
      ak: "U43Xy5aiHHDKWZwQOxPn7NS8kGdv8kFO",
      zoom: 17,
      lng: 0,
      lat: 0,
      town: "",
      address: "",
      change_flag: false, // 是否修改标记
      getcoord_flag: false, // 是否打开坐标拾取标价
      complain_points: [],
      loading: false,
      downloadLoading: false,
      upLoading: false
    };
  },
  created() {
    // this.fetchData()
    this.getComplainList();
  },
  methods: {
    // 弹窗页面，获取投诉数据
    getCompalins() {
      // 当前县市全量投诉
      this.listQuery.limit = 0;
      this.listQuery.city = this.temp.city;
      this.loading = true;
      getComplain(this.listQuery)
        .then(response => {
          // console.log(response.data);
          var data = response.data;
          var len = data.length;
          for (var i = 0; i < len; i++) {
            // console.log(data[i].lng);
            var point = wgs84tobd09(data[i].lng, data[i].lat);
            // console.log(point[0]);
            data[i].lng = point[0];
            data[i].lat = point[1];
          }
          this.complain_points = data;
          this.loading = false;
        })
        .catch(response => {
          this.loading = false;
        });
    },
    // 输入框发生变化
    inputChange(e) {
      // alert(e);
      if (e === "") {
        this.change_flag = false;
      } else {
        this.change_flag = true;
      }
    },
    // 打开拾取坐标
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
    getCoord(data) {
      // alert(data.address);
      this.temp.lng = data.lng;
      this.temp.lat = data.lat;
      this.temp.town = data.town;
      this.temp.address = data.address;
      this.change_flag = true;
    },
    // 获取用户投诉详单
    getComplainList() {
      this.listLoading = true;
      getComplain(this.listQuery).then(response => {
        // console.log(response.total)
        this.list = response.data;
        this.total = response.total;
        this.listLoading = false;
      });
    },
    // 条件过滤
    handleFilter() {
      this.listQuery.page = 1;
      if (this.checkMobile(this.keyword)) {
        // 搜索为用户号码
        this.listQuery.user_tel = this.keyword; // 用户号码搜索
      } else {
        this.listQuery.area = this.keyword; // 投诉地点搜索
      }
      this.listQuery.start_date = this.select_date[0];
      this.listQuery.end_date = this.select_date[1];
      this.getComplainList();
    },
    // 校验手机号码
    checkMobile(tel) {
      var r = RegExp(/^1(3|4|5|7|8|9)\d{9}$/).test(tel);
      if (!r) {
        return false;
      } else {
        return true;
      }
    },
    // 清空筛选
    handleClear() {
      this.select_date = "";
      this.listQuery.city = "";
      this.listQuery.is_solved = "";
      this.listQuery.is_overtime = "";
      this.listQuery.user_tel = "";
      this.listQuery.area = "";
      this.listQuery.start_date = "";
      this.listQuery.end_date = "";
      this.getComplainList();
    },
    // 编辑
    handleUpdate(row) {
      this.original = row;
      this.temp = Object.assign({}, row); // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
      this.viewOnMap();
      this.getComplainList();
    },
    // 取消按钮
    closeUpdate() {
      // 无更新直接关闭
      if (!this.change_flag) {
        this.dialogFormVisible = false;
        return;
      }
      this.$confirm("修改未保存，是否确认退出?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.dialogFormVisible = false;
          this.change_flag = false; // 还原默认未修改
          this.getcoord_flag = false;
        })
        .catch(() => {});
    },
    // 更新数据
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          // console.log(tempData)
          updateComplain(tempData.cp_id, tempData).then(() => {
            // const index = this.list.findIndex(v => v.id === this.temp.id)
            // this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false;
            this.$notify({
              title: "提醒",
              message: "更新成功",
              type: "success",
              duration: 2000
            });
          });
          this.getComplainList();
        }
      });
    },
    // 在地图查看
    gotoMap(row) {
      // alert(row.cp_id);
      // eslint-disable-next-line object-curly-spacing
      this.$router.push({
        name: "Map",
        // eslint-disable-next-line object-curly-spacing
        params: { point: { label: row.cp_info, lng: row.lng, lat: row.lat } }
      });
    },
    // 编辑弹窗中，查看地图
    async viewOnMap() {
      // alert(this.zoom);
      // 经纬度转换
      var point = wgs84tobd09(this.temp.lng, this.temp.lat);
      this.center = {
        lng: point[0],
        lat: point[1]
      };
      this.showPopMap = true;
      await this.baiduReverseGeocoder(this.center.lng, this.center.lat);
      // alert(this.town);
    },
    // 获取投诉点关联的百度地图地址信息
    async baiduReverseGeocoder(lng, lat) {
      var url =
        "http://api.map.baidu.com/reverse_geocoding/v3/?ak=" +
        this.ak +
        "&output=json&coordtype=bd09ll&ret_coordtype=bd09ll&extensions_poi=1&extensions_town=true&&location=" +
        lat +
        "," +
        lng;
      await this.$jsonp(url).then(res => {
        // console.log(res.result)
        var data = res.result;
        this.lng = data.location.lng;
        this.lat = data.location.lat;
        this.town = data.addressComponent.town; // 乡镇、街道
        // console.log(this.town);
        var address =
          data.addressComponent.district + data.addressComponent.town; // 县市+乡镇/街道
        var poi = data.sematic_description.split(",")[0]; // poi，具体到小区或村庄
        this.address = address + poi;
      });
    },
    // excel上传
    uploadExcel(item) {
      const fileObj = item.file;
      // console.log(fileObj)
      const form = new FormData();
      form.append("file", fileObj); // 文件对象 'file'为后端接收参数
      // console.log(form)
      uploadComplain(form)
        .then(response => {
          // console.log(response)
          if (response.code === 20000) {
            this.$notify({
              title: "提醒",
              message: "上传成功",
              type: "success",
              duration: 2000
            });
            this.getComplainList();
          }
        })
        .catch(response => {
          this.$notify({
            title: "提醒",
            message: "上传失败",
            type: "error",
            duration: 2000
          });
        });
    },
    // 文件上传前检测
    beforeUpload(file) {
      const file_type = file.name.split(".")[1];
      const size = file.size / 1024 / 1024;
      if (file_type !== "xlsx" && file_type !== "xls") {
        this.$notify.warning({
          title: "警告",
          message: `只能上传xlsx、xls格式文件`
        });
      }
      if (size > 1) {
        this.$notify.warning({
          title: "警告",
          message: `文件大小不能超过1M`
        });
      }
    },
    // 批量导出
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "序号",
          "投诉来源",
          "流水号",
          "受理日期",
          "派单时间",
          "用户号码",
          "用户姓名",
          "终端型号",
          "FDD支持类型",
          "用户星级",
          "用户号码归属地",
          "投诉县市",
          "城区农村",
          "投诉场景",
          "服务请求类别",
          "投诉内容",
          "处理过程",
          "原因分类",
          "网络制式",
          "乡镇",
          "电信是否优于我方",
          "电信4G测试情况",
          "投诉区域",
          "详细地址",
          "弱覆盖方案类型",
          "具体解决方案",
          "方案进度",
          "方案期限（天）",
          "预计解决时间",
          "弱覆盖人口",
          "归属栅格",
          "故障投诉分类",
          "故障发生时间",
          "故障处理历时",
          "故障是否超时/方案是否超时",
          "最新跟踪情况",
          "天气情况",
          "现场投诉处理完成时间",
          "现场投诉处理历时",
          "是否解决",
          "实际解决时间",
          "现场处理人员",
          "值班人员",
          "经度",
          "纬度",
          "备注（内部投诉工单来源等）",
          "更新人",
          "更新时间"
        ];
        const filterVal = [
          "cp_id",
          "cp_from",
          "cp_no",
          "cp_date",
          "cp_time",
          "user_tel",
          "user_name",
          "phone_type",
          "fdd_type",
          "user_star",
          "register_city",
          "city",
          "is_village",
          "place",
          "classify",
          "cp_info",
          "deal_info",
          "cp_type",
          "net_type",
          "town",
          "ct",
          "ct_info",
          "area",
          "address",
          "solve_type",
          "solve_plan",
          "plan_progres",
          "plan_limit",
          "plan_done_date",
          "poor_coverage",
          "raster",
          "fault_type",
          "fault_time",
          "fault_duration",
          "is_overtime",
          "tracking_info",
          "weather",
          "deal_time",
          "deal_duration",
          "is_solved",
          "finish_date",
          "deal_user",
          "duty_user",
          "lng",
          "lat",
          "remark",
          "update_user",
          "update_time"
        ];
        const list = this.list;
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "无线投诉清单",
          // autoWidth: this.autoWidth,
          bookType: this.bookType
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    }
  }
};
</script>
<style lang="scss">
.el-tooltip__popper {
  max-width: 50%;
}
.filter {
  display: flex;
  flex-flow: row;
  padding-bottom: 10px;
}
.el-row {
  padding: 0px;
  margin-bottom: 0px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
  padding: 0px;
}
.el-dialog el-dialog--center {
  font: bold;
}
// .el-dialog__footer{
//   padding: 5px;
// }
.filter {
  display: flex;
  padding-left: 5px;
}
.filter div {
  display: flex;
  padding-left: 5px;
}
.upload {
  display: flex;
}
.el-upload__tip {
  align-items: center;
  text-decoration: underline;
}
.app-container {
  padding-top: 30px;
}
.pagination-container {
  padding: 10px;
  float: right;
}
.el-main {
  padding: 10px;
}
.edit-pop {
  display: flex;
  flex-flow: row;
}
.left-form {
  display: flex;
  width: 40%;
}
.right-map {
  padding-left: 20px;
  width: 60%;
  border-radius: 5px;
}
// // 地图高度
// .BMap_mask {
//   height: 500px;
// }
.pop-loc {
  color: rgb(19, 19, 18);
  font-size: 20px;
}

.bm-view {
  width: 100%;
  height: 700px;
}
.my /deep/ .el-dialog__header {
  background-color: #0085d0;
}
.my /deep/ .el-dialog__title {
  color: #fff;
  font-size: bolder;
}
.my /deep/ .el-dialog__close {
  color: #fff;
}
.input-change .el-input__inner {
  background-color: rgba(230, 162, 60, 0.87);
  color: #fff;
}

// .no-null-input .el-input__inner {
//   background-color: rgb(60, 11, 173);
//   color: #524f52;
// }
</style>
