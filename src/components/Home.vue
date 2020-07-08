<template>
  <div class="main-container">
    <el-header height="100px">
      <i class="iconfont icon-he"></i>
      听荷文字识别工具
      <i class="iconfont icon-wenzishibie right-font"></i>
    </el-header>
    <div class="layout">
      <el-card class="upload-container">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-remove="handleRemove"
          :on-change="getFileValue"
          :limit="1"
          :auto-upload="false"
          drag
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">印刷体文字识别，手写文字识别效果不佳，一次上传一张图片进行识别</div>
        </el-upload>
      </el-card>
      <el-card class="recognize-container">
        <el-input
          type="textarea"
          :autosize="{ minRows: 10, maxRows: 15}"
          v-model="textValue"
          resize="none"
        ></el-input>
        <el-button
          type="primary"
          icon="el-icon-search"
          class="recognitize-btn"
          @click="textRecognition"
        >开始识别</el-button>
        <div class="rate-container">
          <span class="rate-font">小老板效果如何，给个评分，怎么说嘛</span>
          <el-rate v-model="stars" :texts="rateText" show-text></el-rate>
        </div>
      </el-card>
      <div class="welcome-container">
        <span>欢迎体验使用！</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      textValue: "",
      textValueList: [],
      base64Data: "",
      previewVisible: false,
      fileTmp: "",
      rateText: ["瓜皮", "多捞啊", "有东西", "牛逼", "起飞"],
      stars: 0,
      fileRemain:false
    };
  },
  methods: {
    getBase64(file) {
      return new Promise(function(resolve, reject) {
        let reader = new FileReader();
        let imgResult = "";
        reader.readAsDataURL(file);
        reader.onload = function() {
          imgResult = reader.result;
        };
        reader.onerror = function(error) {
          reject(error);
        };
        reader.onloadend = function() {
          resolve(imgResult);
        };
      });
    },
    getFileValue(file) {
      this.fileTmp = file.raw;
      this.$message.success("上传图片成功!");
      this.fileRemain = false
    },
    handleRemove() {
      this.textValue = "";
      this.fileTmp = "";
      this.$message.error("删除图片成功!");
    },
    textRecognition() {
      if (this.fileTmp === "") {
        this.$message.error("请先上传图片");
        return;
      }
      if(this.fileRemain){
        this.$message.error('请勿重复识别一张图片!')
        return
      }
      this.getBase64(this.fileTmp).then(async res => {
        this.base64Data = res.substring(res.indexOf(",") + 1);
        const result = await this.$http.post("/getTextInfo", {
          img: this.base64Data
        });
        if (result.data.success) {
          this.textValueList = result.data.ret;
          let t;
          this.textValueList.forEach((item, index) => {
            if (index === 0) {
              t = `${item.word}`;
            } else {
              t = `${t}
${item.word}`;
            }
          });
          this.textValue = t;
          this.$message.success("识别成功!");
          this.fileRemain = true
        } else {
          this.$message.error("识别失败!");
        }
      });
    }
  }
};
</script>

<style>
.main-container {
  height: 100%;
  background-color: #5cb87a;
}

.layout {
  position: relative;
  top: 180px;
  margin: auto;
  width: 920px;
}
.upload-container {
  float: left;
}

.recognize-container {
  float: right;
  width: 500px;
}

.textBox {
  width: 800px;
}

.rate-container {
  margin: 11px 20px 0 0;
}

.rate-font {
  font-size: 14px;
  color: #ff9900;
}
.icon-he:before {
  font-size: 40px;
  color: goldenrod;
}

.icon-wenzishibie:before {
  font-size: 40px;
  color: yellowgreen;
}

.right-font {
  float: right;
}

.welcome-container {
  position: absolute;
  top: -100px;
  left: 350px;
  font-size: 30px;
  color: whitesmoke;
}
</style>