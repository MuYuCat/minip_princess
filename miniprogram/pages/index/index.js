// index.js
// const app = getApp()
const { envList } = require('../../envList.js');

Page({
  data: {
    showUploadTip: false,
    powerList: [{
      title: '数据库',
      tip: '安全稳定的文档型数据库',
      showItem: true,
      item: [{
        title: '完成任务',
        page: 'toCompleteMission',
        icon: '../../images/icons/star.png'
      }, {
        title: '兑换奖励',
        page: 'toExchangeRewards',
        icon: '../../images/icons/iceCream.png'
      }, {
        title: '查询记录',
        page: 'selectRecord',
        icon: '../../images/icons/calendar.png'
      },
      {
        title: '任务管理',
        page: 'updateMission',
        icon: '../../images/icons/buyGoods.png'
      },
      {
        title: '奖励管理',
        page: 'updateRewards',
        icon: '../../images/icons/plane.png'
      }
    ]
    }],
    envList,
    selectedEnv: envList[0],
    haveCreateCollection: false,
    userIntegral: 0,
    userName: '',
    operatorType: {
      COMPLETE_MISSION: 'complete mission',
      EXCHANGE_REWARDS: 'exchange rewards'
    }
  },

  onLoad(){
    this.resetMission();
    
  },

  onShow(){
    this.selectUser()
  },

  onClickPowerInfo(e) {
    const index = e.currentTarget.dataset.index;
    const powerList = this.data.powerList;
    powerList[index].showItem = !powerList[index].showItem;
    if (powerList[index].title === '数据库' && !this.data.haveCreateCollection) {
      this.onClickDatabase(powerList);
    } else {
      this.setData({
        powerList
      });
    }
  },

  onChangeShowEnvChoose() {
    wx.showActionSheet({
      itemList: this.data.envList.map(i => i.alias),
      success: (res) => {
        this.onChangeSelectedEnv(res.tapIndex);
      },
      fail (res) {
        console.log(res.errMsg);
      }
    });
  },

  onChangeSelectedEnv(index) {
    if (this.data.selectedEnv.envId === this.data.envList[index].envId) {
      return;
    }
    const powerList = this.data.powerList;
    powerList.forEach(i => {
      i.showItem = false;
    });
    this.setData({
      selectedEnv: this.data.envList[index],
      powerList,
      haveCreateCollection: false
    });
  },

  jumpPage(e) {
    wx.navigateTo({
      url: `/pages/${e.currentTarget.dataset.page}/index?envId=${this.data.selectedEnv.envId}`,
    });
  },

  onClickDatabase(powerList) {
    wx.showLoading({
      title: '',
    });
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {
        env: this.data.selectedEnv.envId
      },
      data: {
        type: 'createCollection'
      }
    }).then((resp) => {
      if (resp.result.success) {
        this.setData({
          haveCreateCollection: true
        });
      }
      this.setData({
        powerList
      });
      wx.hideLoading();
    }).catch((e) => {
      console.log(e);
      this.setData({
        showUploadTip: true
      });
      wx.hideLoading();
    });
  },

  selectUser() {
    wx.cloud.callFunction({
     name: 'quickstartFunctions',
     config: {
       env: this.data.envId
     },
     data: {
       type: 'selectUser',
     }
   }).then((resp) => {
     this.setData({
      userIntegral: resp.result.data[0].user_integral,
      userName: resp.result.data[0].user_name
     })
   }).catch((e) => {
  });
 },

  resetMission() {
    
    wx.cloud.callFunction({
        name: 'quickstartFunctions',
        config: {
          env: this.data.envId
        },
        data: {
          type: 'selectOperator'
        }
      }).then((resp) => {
        const operatorData = resp.result.data.reverse();
        let lastMissionDate;
        operatorData.some(item => {
          if(item.operator_type === this.data.operatorType.COMPLETE_MISSION){
            lastMissionDate = new Date(item.operator_time).getDate();
            return true
          }
          return false
        })
        const currentDate = new Date().getDate();
        if (lastMissionDate !== currentDate){
          wx.cloud.callFunction({
            name: 'quickstartFunctions',
            config: {
              env: this.data.envId
            },
            data: {
              type: 'resetMission'
            }
          }).then((resp) => {

          })
        }
        
    }).catch((e) => {
    });
  },
});
