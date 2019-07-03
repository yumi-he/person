<template>
    <div class="release-wrap">
      <div class="release-head-wrap">
        <div class="head-search-state"></div>
        <div class="release-head clearfix">
          <a href="javascript:;" class="back" @click="backHome"></a>
          <div class="release-head-title">发布</div>
        </div>
      </div>
      <!--<el-form :model="ruleForm"  ref="ruleForm" label-width="80px" label-position='left' class='person-edit-form'>-->
        <div class="release-content-wrap">
          <!--上传图片-->
          <div class="release-content-upload-wrap">
            <div class="release-content-upload-title-wrap clearfix">
              <span>标题</span>
              <div class="release-content-upload-title">
                <input type="text" placeholder="请输入标题" v-model="ruleForm.name">
              </div>
            </div>

            <div class="release-content-upload-describe">
              <textarea placeholder="描述一下宝贝的转手原因、入手渠道和使用感受" v-model="ruleForm.description"></textarea>
            </div>
              <el-upload
                class="upload-demo clearfix"
                action="https://up-na0.qiniup.com"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :before-upload="beforeUpload"
                :data="form"
                :file-list="fileList2"
                list-type="picture">
                <el-button class="up_button"></el-button>
              </el-upload>
            <div class="release-condition-wrap clearfix" @click="getCondition">
              <span>全新</span>
              <div class="release-condition-choose" :class="{active:condition==1}" v-model="condition">
                <!--<input type="radio" v-model="condition">-->
              </div>

            </div>
          </div>

          <!--其他选择-->
          <div class="release-other-wrap">
            <div class="release-other-list clearfix">
              <span>价格(美元)</span>
              <div class="release-prize">
                <!--<input onKeyPress="if (event.keyCode!=46 && event.keyCode!=45 && event.keyCode<48 || event.keyCode>57)) event.returnValue=false" type="text" placeholder="请输入价格" v-model="ruleForm.price">-->

                <input type="number" placeholder="请输入价格" v-model="ruleForm.price">
              </div>
            </div>
            <div class="release-other-list clearfix">
              <span>联系方式</span>
              <div class="release-prize">
                <input type="text" placeholder="请输入联系方式" v-model="ruleForm.wechat">
              </div>
            </div>
            <div class="release-other-list clearfix" @click="classification">
              <span>选择分类</span>
              <div class="release-selective-classification clearfix">
                <span><input type="text" v-model="classificationValue" ></span>
                <i></i>
              </div>
            </div>
            <div class="release-other-list clearfix">
              <span>交易方式</span>
              <div class="release-transaction-mode clearfix">
                <div class="release-transaction-list" @click="getReleaseMode">邮寄</div>
                <div class="release-transaction-list" @click="getReleaseMode">面交</div>
                <div class="release-transaction-list" @click="getReleaseMode">自提</div>
              </div>
            </div>
          </div>


          <!--选择分类弹层-->
          <div class="selective-classification-dialog" v-if="isSlots">
            <div class="selective-classification-dialog-hide" @click="classificationHide"></div>
            <div class="selective-classification-model">
              <div class="selective-classification-model-title">
                <span @click="classificationHide">取消</span>
                <label @click="definiteClassification">确定</label>
              </div>
              <div class="selective-classification-model-content">
                <mt-picker :slots="slots" ids="ids" @change="onValuesChange"></mt-picker>
                <!--<ul>-->
                  <!--<li>最近上新</li>-->
                  <!--<li>最近上新</li>-->
                  <!--<li>最近上新</li>-->
                  <!--<li>最近上新</li>-->
                  <!--<li>最近上新</li>-->
                  <!--<li>最近上新</li>-->
                  <!--<li>最近上新</li>-->
                  <!--<li>最近上新</li>-->
                <!--</ul>-->
              </div>
            </div>
          </div>
        </div>

        <div class="selective-hint" v-if="isSubmitHint">{{submitHint}}</div>

        <div class="release-confirm-wrap">
          <div class="release-confirm-btn" @click="submitRelease"></div>
        </div>
      <!--</el-form>-->
    </div>
</template>

<script>
  import {marketPostReq} from '../../utils/fetch.js'
  import {Message} from  'element-ui';
  export default {
    data(){
      return{
        ruleForm: {
         // token:getCookie('token'),//token值
         token:'token',//token值
          // token: '8f484c6443df07e1167f498381fa26e85c41e63d',
          name: '',//标题
          cover: '',//主图
          images: '',//图片
          category_name:'',//分类名称
          // category_id:'',//分类id
          // category_id:'12',//分类id
          price:'',//价格
          description:'',//商品简介
          wechat:'',//联系方式
          condition:'',//成色
          dispatch_type:'',//交易方式
        },
        form: {
          "Content-Type": "application/octet-stream",
          "token": ''
        },

        fileList2: [],
        imagelist:[],
        picList: [],
        modeText:[],
        slots:[
          {
            flex: 1,
            values: [],
            defaultIndex:1,
            className: 'slot1',
            textAlign: 'center',
          }
        ],
        isSlots:false,
        classificationValue:"",//选中的分类值
        condition:0,//成色
        categoryArr:[],
        categoryId:[],//分类的ID
        categoryName:[],//分类的名称
        category_ids:'',
        submitHint:'',
        isSubmitHint:false,
      }
    },
    methods:{
      submitRelease(){
        console.log("分类的名称"+this.ruleForm.category_name)
        let _this = this;
        marketPostReq('/goods/addGoods',_this.ruleForm).then(res=>{
          let {errcode,content,message} = res ;
          console.log(errcode)

          if(errcode == 0){
            _this.$message({
              message: '提交成功',
              type: 'success'
            });
            _this.$router.push({path:'/userInformation?isShowSale=0'});

          }else if(errcode == -2){
            _this.submitHint = content;
            _this.isSubmitHint = true;
            setTimeout(function () {
              _this.isSubmitHint = false;
            }, 1500)
          }
        })



      },
      //上传图片start
      getqnauth(){
        marketPostReq('/upload/getUploadToken',{}).then(res=>{
          let {errcode,content,message} = res ;
          if(errcode == 0){
            setCookie('qnauth',content.token,2);
            setCookie('qndomain',content.domain,2);
            this.form.token = content.token;
          }else {
            errorInfo(errcode,message);
          }
        })
      },
      handleRemove(file, fileList) {
        let index = this.imagelist.indexOf(file.response.key);
        if (index > -1) {
          this.imagelist.splice(index, 1);
        }
        this.ruleForm.images = this.imagelist.toString();
        this.ruleForm.cover = this.imagelist[0].toString();
      },
      handlePreview(file) {
        console.log(file);
      },
      handleSuccess(res, file, fileList) {
        console.log(res);
        this.imagelist.push(res.key);
        this.ruleForm.images = this.imagelist.toString();
        this.ruleForm.cover = this.imagelist[0].toString();
      },
      beforeUpload(file) {
        console.log(file)
        console.log(this.form)
        this.form.key = new Date().getTime() + ".jpg";
        const isJPG = file.type === 'image/jpeg' || 'image.png';
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isJPG) {
          Message.error('上传头像图片只能是 JPG / PNG格式!');
        }
        if (!isLt10M) {
          Message.error('上传头像图片大小不能超过 10MB!');
        }
        return isJPG && isLt10M;
      },
      //上传图片end

      //获取交易方式
      getReleaseMode(e){

        let index = this.modeText.indexOf(e.target.innerText);
        if (e.target.className.indexOf("active") == -1) {
          e.target.className = "release-transaction-list active"; //切换按钮样式
          this.modeText.push(e.target.innerText);
          this.ruleForm.dispatch_type = this.modeText;
          //写逻辑
        } else {
          e.target.className = "release-transaction-list";//切换按钮样式
          //写逻辑
          this.modeText.splice(index, 1);
          this.ruleForm.dispatch_type = this.modeText;
        }
      },

      //返回首页
      backHome(){
        this.$router.go(-1);
        // this.$router.push({path:'/'});
      },

      //选获取商品分类分类
      getCategory(){
        marketPostReq('/Category/getCategory').then(res=>{
          let {errcode,content,message} = res ;

          for(var i=0;i<content.length;i++){
            // this.categoryArr = content[i].category_id+" "+content[i].name;
            // // console.log(this.categoryArr)
            // this.slots[0].values.push(this.categoryArr);
            // let text = this.slots[0].values[i];

            this.slots[0].values.push(content[i].name);
            // this.slots[1].values.push(content[i].category_id);

          };

        })
      },

      //选择分类
      onValuesChange(picker, values) {
        // console.log(values[0])
        this.classificationValue = values[0];

        // this.classificationValue =  values[0].match(/ (\S*)/)[1];
        // this.category_ids =  values[0].match(/(\S*) /)[1];
        //
        // if (values[0] > values[1]) {
        //   picker.setSlotValue(1, values[0]);
        //   // console.log(values[1])
        // }
      },

      //选择分类确定
      definiteClassification(){
        this.isSlots = false;
        // this.ruleForm.category_id = this.category_ids;
        this.ruleForm.category_name = this.classificationValue;
      },

      //隐藏分类弹层
      classificationHide(){
        this.isSlots = false;
        this.classificationValue = '';
      },

      //点击选择分类弹出分类列表
      classification(){
        this.isSlots = true;
      },

      //获取成色
      getCondition(){

        if(this.condition == 0){
          this.condition = 1;
        } else{
          this.condition = 0;
        }
        this.ruleForm.condition = this.condition;
      },

    },
    created(){
      this.$nextTick(()=>{
        this.getqnauth();
        this.getCategory();
      })
    }
  }
</script>
<style lang="scss">
  .upload-demo{
    width:100%;
    /*height:161px;*/
    padding:0 10px 30px;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    overflow-x: auto;
    overflow-y: hidden;
    .el-upload--picture.el-upload{
      float: left;
      margin:5px 15px 10px 0;
      button{
        width:156px;
        height:156px;
        background:url("../../../static/img/upload_add.png") no-repeat;
        background-size:100% 100%;
        border:none;
      }
    }
    .el-upload-list--picture{
      float: left;
      width:100%;
      /*height:161px;*/
      height:auto;
      /*overflow-x: auto;*/
      /*overflow-y: hidden;*/
      /*background-color: yellow;*/
      &:after{
        content:"";
        display: block;
        clear: both;
      }
      li{
        float: left;
        width:161px;
        height:161px;
        margin-top:0;
        padding:0;
        border:none;
        background:none;
        margin-right:15px;
        margin-bottom:20px;
        &:nth-child(3n){
          margin-right:0;
        }
        .el-upload-list__item-thumbnail{
          display: block;
          width:156px;
          height:156px;
          margin:0;
          position: absolute;
          left:0;
          bottom:0;
        }
        .el-upload-list__item-name{
          display: none;
        }
        .el-upload-list__item-status-label{
          display: none;
        }
        .el-icon-close{
          display: block;
          position: absolute;
          right:-5px;
          top:-5px;
          width:46px;
          height:46px;
          background:url("../../../static/img/upload_del.png") no-repeat;
          background-size:100% 100%;
          z-index:22;
          &::before{
            content:"";
            display: none;
          }
        }
      }
    }
  }
  .picker-center-highlight:before, .picker-center-highlight:after{
    background-color: #FFD34C;
    height:2px;
  }
  .textNone{
    opacity: 0;
  }
</style>
<style scoped lang="scss">
  .release-wrap{
    width:100%;
    height:auto;
    .release-head-wrap{
      width:100%;
      height:auto;
      .head-search-state{
        width:100%;
        height:40px;
        background:#FFFFFF;
      }
      .release-head{
        width:100%;
        height:88px;
        line-height:88px;
        background: #ffffff;
        position: relative;
        .back{
          width:18px;
          height:34px;
          float: left;
          background:url("../../../static/img/back.png") no-repeat;
          background-size:100% 100%;
          margin-right:25px;
          z-index:22;
          position: absolute;
          left:30px;
          top:27px;
        }
        .release-head-title{
          width:100%;
          height:88px;
          line-height:88px;
          position: absolute;
          text-align: center;
          font-size:38px;
          color:#343434;
          font-weight: bold;
        }
      }
    }
    .release-content-wrap{
      width:100%;
      height:auto;
      padding:10px 10px 0;
      box-sizing: border-box;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      .release-content-upload-wrap{
        width:100%;
        height:auto;
        background:#ffffff;
        border-radius:30px;
        padding:0 0 20px 20px;
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        .release-content-upload-title-wrap{
          width:100%;
          height:92px;
          line-height:92px;
          /*border-bottom:2px solid #F2F2F2;*/
          padding-left:10px;
          padding-right:20px;
          box-sizing: border-box;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          span{
            float: left;
            width:20%;
            height:92px;
            line-height:92px;
            font-size:30px;
            color:#D6D6D6;
            font-weight: bold;
            border-bottom:2px solid #F2F2F2;
          }
          .release-content-upload-title{
            float: left;
            width:80%;
            height:92px;
            line-height:92px;
            position: relative;
            border-bottom:2px solid #F2F2F2;
            input{
              position: absolute;
              left:0;
              top:0;
              width:100%;
              height:100%;
              border:none;
              outline: none;
              background:none;
              font-size:30px;
              /*font-weight: bold;*/
              color:#333333;
              &::-webkit-input-placeholder{
                font-size:28px;
                font-weight: normal;
              }
            }
          }
        }

        .release-content-upload-describe{
          width:100%;
          height:276px;
          position: relative;
          padding-right:20px;
          box-sizing: border-box;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          textarea{
            position: absolute;
            left: 0;
            top:0;
            width:100%;
            height:100%;
            padding:36px 10px 0;
            box-sizing: border-box;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            border:none;
            background:none;
            outline: none;
            line-height:40px;
            color:#333333;
            &::-webkit-input-placeholder{
              font-size:24px;
              color:#D6D6D6;
              font-weight: bold;
            }
          }
        }

        .release-condition-wrap{
          width:100%;
          height:40px;
          padding-right:30px;
          box-sizing: border-box;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          .release-condition-choose{
            float: right;
            width:40px;
            height:40px;
            background:url("../../../static/img/choose-condition.png") no-repeat;
            background-size:100% 100%;
            position: relative;
            margin-right:15px;
            &.active{
              background:url("../../../static/img/choose-condition_active.png") no-repeat;
              background-size:100% 100%;
            }
            input{
              position: absolute;
              left:0;
              top:0;
              width:100%;
              height:100%;
              opacity: 0;
            }
          }
          span{
            float: right;
            font-size:30px;
            color:#FFD34C;
            height:40px;
            /*line-height: 40px;*/
            font-weight: bold;
            padding-top:4px;
          }
        }

        /*.upload-demo{*/
          /*width:100%;*/
          /*height:auto;*/
          /*padding:0 10px;*/
          /*box-sizing: border-box;*/
          /*-webkit-box-sizing: border-box;*/
          /*-moz-box-sizing: border-box;*/
          /*.el-upload--picture.el-upload{*/
            /*float: left;*/
            /*button{*/
              /*width:156px;*/
              /*height:156px;*/
              /*background:#F7F8FB;*/
              /*border:none;*/
            /*}*/
          /*}*/
          /*.el-upload-list--picture{*/
            /*float: left;*/
            /*width:50%;*/
            /*height:156px;*/
            /*background-color: red;*/
          /*}*/
        /*}*/
      }

      .release-other-wrap{
        width:100%;
        height:auto;
        padding:0 20px;
        border-radius:30px;
        background:#ffffff;
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        margin-top:20px;
        .release-other-list{
          width:100%;
          height:100px;
          border-bottom:2px solid #F2F2F2;
          padding:0 10px;
          box-sizing: border-box;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          &:last-child{
            border-bottom:none;
          }
          span{
            float: left;
            width:22%;
            height:100px;
            line-height:100px;
            font-size:30px;
            color:#333333;
          }
          .release-prize{
            float: left;
            width:72%;
            height:100px;
            /*line-height:98px;*/
            position: relative;
            input{
              position: absolute;
              left:0;
              top:0;
              width:100%;
              height:100%;
              padding:2px 0 0 20px;
              box-sizing: border-box;
              -webkit-box-sizing: border-box;
              -moz-box-sizing: border-box;
              border:none;
              outline: none;
              background:none;
              font-size:30px;
              /*font-weight: bold;*/
              color:#333333;
                &::-webkit-input-placeholder{
                  font-size:28px;
                  font-weight: normal;
                }
              &::-webkit-outer-spin-button,
              &::-webkit-inner-spin-button{
                -webkit-appearance: none !important;
                margin: 0;
              }
            }
          }
          .release-transaction-mode{
            float: left;
            width:76%;
            height:100px;
            padding:22px 0;
            box-sizing: border-box;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            .release-transaction-list{
              float: right;
              width:110px;
              height:52px;
              line-height:52px;
              text-align: center;
              color:#272161;
              font-size:30px;
              border:2px solid #FFD34C;
              border-radius:10px;
              margin-left:20px;
              &.active{
                background:#FFD34C;
              }
            }
          }

          .release-selective-classification{
            float: left;
            width:78%;
            height:100px;
            span{
              float: left;
              width:75%;
              height:100px;
              line-height:100px;
              position: relative;
              input{
                position: absolute;
                left:0;
                top:0;
                width:100%;
                height:100%;
                background:none;
                border:none;
                outline: none;
                padding:2px 0 0 20px;
                box-sizing: border-box;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                font-size: 0.4rem;
                /* font-weight: bold; */
                color: #333333;
              }
            }
            i{
              float: right;
              width:19px;
              height:37px;
              background:url("../../../static/img/more_btn.png") no-repeat;
              background-size:100% 100%;
              margin-top:30px;
            }
          }
        }
      }


      .selective-classification-dialog{
        width:100%;
        height:100%;
        /*position: fixed;*/
        /*top:0;*/
        /*left:0;*/
        /*background:rgba(0,0,0,.3);*/
        /*z-index:22;*/
        /*display: none;*/
        .selective-classification-dialog-hide{
          width:100%;
          height:100%;
          position: fixed;
          top:0;
          left:0;
          background:rgba(0,0,0,.3);
          z-index:22;
        }
        .selective-classification-model{
          width:100%;
          height:400px;
          position: fixed;
          left:0;
          bottom:0;
          background:#ffffff;
          z-index: 23;
          .selective-classification-model-title{
            width:100%;
            height:88px;
            line-height:88px;
            padding:0 30px;
            box-sizing: border-box;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            span{
              float: left;
              font-size:24px;
              color:#999999;
            }
            label{
              float: right;
              font-size:24px;
              color:#272161;
            }
          }
          .selective-classification-model-content{
            /*width:100%;*/
            width:45%;
            height:312px;
            padding:50px 0;
            box-sizing: border-box;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            margin:0 auto;
            ul{
              width:100%;
              height:240px;
              overflow-y: auto;

              li{
                width:20%;
                height:88px;
                line-height:88px;
                /*border-top:1px solid #272161;*/
                /*border-bottom:1px solid #272161;*/
                text-align: center;
                margin:0 auto;
                font-size:26px;

              }
            }
          }
        }
      }

    }
    .selective-hint{
      width:80%;
      height:80px;
      line-height:80px;
      text-align: center;
      background:rgba(0,0,0,.5);
      position: fixed;
      bottom:24%;
      left:10%;
      border-radius:10px;
      color:#ffffff;
      font-size:28px;
    }
    .release-confirm-wrap{
      width:100%;
      height:135px;
      background:#F2F2F2;
      position: fixed;
      left:0;
      bottom:0;
      .release-confirm-btn{
        width:272px;
        height:97px;
        background:url("../../../static/img/release-confirm-btn.png") no-repeat;
        background-size:100% 100%;
        margin:0 auto;
      }
    }
  }
</style>
