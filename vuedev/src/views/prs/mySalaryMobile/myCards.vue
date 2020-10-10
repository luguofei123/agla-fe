<!--
 * @Author: sunch
 * @Date: 2020-07-31 16:15:43
 * @LastEditTime: 2020-08-05 11:35:25
 * @LastEditors: Please set LastEditors
 * @Description: 我的银行卡
 * @FilePath: /agla-fe-8.50/vuedev/src/views/prs/mySalaryMobile/myCards.vue
-->
<template>
  <div class="main" ref="main">
    <MintHeader ref="MintHeader" type="detail" :title="title" :backToApp="true"> </MintHeader>
    <div class="list" :style="{ height: listH + 'px' }">
      <div class="card" :class="item.cardType + 'Bg'" v-for="item in cardList" :key="item.chrId" @click="editCard(item.auditStatus, item.chrId, item.billNo)">
        <!-- 卡片中包含7部分动态内容 -->
        <div class="leftWrap">
          <img v-if="item.cardType" class="bankLogo" :src="require('../../../assets/imgs/mobile/' + item.cardType + '.png')" />
          <div v-else class="bankLogo noCardLogo" >银行</div>
        </div>
        <div class="rightWrap">
          <div class="bankNameWrap">
            <div class="bankName">{{ item.bankCategoryName?item.bankCategoryName:'未知银行' }}</div>
            <!-- <div class="auditStatus" v-if="item.auditStatus === '0'">已审核</div> -->
            <div class="auditStatus" v-if="item.auditStatus === '1'">审核中</div>
            <div class="auditStatus" v-if="item.auditStatus === '2'">被退回</div>
          </div>
          <div class="accountNameWrap">
            <span class="accountName">{{ item.accountName }}</span>
            <span class="cardAttr" v-if="item.isPrsCard === '1'">工资卡</span>
            <span class="cardAttr" v-if="item.isReimburseCard === '1'">报销卡</span>
            <span class="cardAttr" v-if="item.accountAttr === '2'">公务卡</span>
          </div>
          <div class="accountNoWrap">
            <div class="accountNoHide">{{ item.accountNoHide }}</div>
            <div class="accountNoLast">{{ item.accountNoLast }}</div>
          </div>
        </div>
      </div>
      <div class="btnWrap" ref="btn">
        <MintButton type="primary" @click="addCard">添加银行卡</MintButton>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import MintHeader from './components/MintHeader'
import MintButton from './components/MintButton'
export default {
  name: 'myCards',
  data() {
    return {
      title: '银行卡',
      cardList: [],
      listH: 0
    }
  },
  components: {
    MintHeader,
    MintButton,
  },
  created() {
    this.getCardsData()
  },
  mounted() {
    let mainEl = this.$refs.main,
      headerEl = this.$refs.MintHeader.$el
    this.listH = $(mainEl).outerHeight() - $(headerEl).outerHeight()
    console.log(this.listH)
  },
  computed: {
    ...mapState({
      tokenId: (state) => state.tokenId,
    }),
  },
  methods: {
    editCard(auditStatus, chrId, billNo) {
      if (auditStatus === '1') {
        this.$router.push({ name: 'editBankCardMobile', query: { tokenid: this.tokenId, type: 'view', auditStatus: auditStatus, chrId: chrId, billNo: billNo ? billNo : '' } })
      } else {
        this.$router.push({ name: 'editBankCardMobile', query: { tokenid: this.tokenId, type: 'edit', auditStatus: auditStatus, chrId: chrId, billNo: billNo ? billNo : '' } })
      }
    },
    addCard() {
      this.$router.push({ name: 'editBankCardMobile', query: { tokenid: this.tokenId, type: 'add' } })
    },
    getCardsData() {
      this.$Indicator.open({
        text: '加载中...',
        spinnerType: 'snake'
      })
      this.$axios
        .post('/ma/emp/account/approval/selectMyAccountInfos', { tokenid: this.tokenId })
        .then((result) => {
          this.$Indicator.close()
          console.log(result)
          if (result.data.flag === 'success') {
            let cardList = result.data.data
            cardList.forEach((item) => {
              if (item.bankCategoryName) {
                item.cardType = this.getCardType(item.bankCategoryName)
              } else {
                item.cardType = ''
              }
              let len = item.accountNo.length - 4
              let str = ''
              for (let i = 0; i < len; i++) {
                str += '*'
              }
              item.accountNoHide = str.replace(/....(?!$)/g, '$& ')
              item.accountNoLast = item.accountNo.substr(-4)
            })
            this.cardList = cardList
            console.log(cardList)
          } else {
            throw result.data.msg
          }
        })
        .catch((error) => {
          this.$Toast({
            message: error,
            position: 'middle',
            duration: 3000,
            iconClass: 'icon icon-warning',
          })
        })
    },
    getCardType(name) {
      let obj = {
        youzheng: '邮政储蓄银行',
        nongye: '农业银行',
        zhaoshang: '招商银行',
        gongshang: '工商银行',
        zhongxin: '中信银行',
        zhongguo: '中国银行',
        jianshe: '建设银行',
        jiaotong: '交通银行',
        pufa: '浦发银行',
        xingye: '兴业银行',
        minsheng: '民生银行',
        guangda: '光大银行',
        pingan: '平安银行',
        huaxia: '华夏银行',
        beijing: '北京银行',
        shanghai: '上海银行',
        guangfa: '广发银行',
        jiangsu: '江苏银行',
        zheshang: '浙商银行',
        hengfeng: '恒丰银行',
      }
      function hasNameState(name, str) {
        return name.indexOf(str) > -1
      }
      for (let prop in obj) {
        if (hasNameState(name, obj[prop])) {
          return prop
        }
      }
      return ''
    },
  },
}
</script>
<style scoped>
.main {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.list {
  padding: 0 0.3rem;
  box-sizing: border-box;
  overflow-y: auto;
}
.card {
  width: 100%;
  height: 1.96rem;
  border-radius: 0.1rem;
  margin-top: 0.2rem;
  box-sizing: border-box;
  padding: 0.24rem;
  display: flex;
  align-items: flex-start;
  overflow: hidden;
}
.leftWrap {
  width: 0.8rem;
}
.bankLogo {
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
}
.noCardLogo{
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 15px;
  color: #2E64D0;
}
.rightWrap {
  width: 100%;
  margin-left: 0.24rem;
}
.bankNameWrap,
.accountNameWrap {
  color: #fff;
  font-weight: 400;
}
.bankNameWrap {
  font-size: 15px;
  font-weight: 500;
  line-height: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.accountNameWrap {
  font-size: 13px;
  margin-top: 0.15rem;
  display: flex;
  align-items: center;
}
.accountName {
  display: inline-block;
  max-width: 50%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cardAttr {
  margin-left: 0.2rem;
}
.accountNoWrap {
  color: #fff;
  font-weight: 400;
  margin-top: 0.15rem;
  font-size: 13px;
  display: flex;
}
.accountNoHide {
  font-size: 18px;
}
.accountNoLast {
  margin-left: 0.1rem;
}
.btnWrap {
  padding: 0.2rem 0;
}
.guangdaBg {
  background: linear-gradient(90deg, rgba(182, 77, 215, 1) 0%, rgba(147, 27, 185, 1) 100%);
}
.pinganBg {
  background: linear-gradient(90deg, rgba(240, 124, 47, 1) 0%, rgba(224, 104, 26, 1) 100%);
}
.youzhengBg,
.nongyeBg {
  background: linear-gradient(90deg, rgba(11, 200, 176, 1) 0%, rgba(4, 179, 157, 1) 100%);
}
.zhaoshangBg,
.gongshangBg,
.zhongxinBg,
.zhongguoBg,
.huaxiaBg,
.beijingBg,
.guangfaBg,
.zheshangBg {
  background: linear-gradient(90deg, rgba(254, 111, 101, 1) 0%, rgba(242, 78, 90, 1) 100%);
}
.jiansheBg,
.jiaotongBg,
.pufaBg,
.xingyeBg,
.minshengBg,
.shanghaiBg,
.jiangsuBg,
.hengfengBg,
.Bg {
  background: linear-gradient(90deg, rgba(44, 134, 213, 1) 0%, rgba(46, 100, 208, 1) 100%);
}
</style>
