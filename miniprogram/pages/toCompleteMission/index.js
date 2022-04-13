Page({

  /**
   * 页面的初始数据
   */
  data: {
    showUploadTip: false,
    haveGetRecord: false,
    envId: '',
    record: '',
    operatorType: {
      COMPLETE_MISSION: 'complete mission',
      EXCHANGE_REWARDS: 'exchange rewards'
    }
  },

  onLoad(options) {
    this.setData({
      envId: options.envId
    });
    this.getRecord();
  },

  showMissionModal(event){
    const missionId = event.currentTarget.id;
    const data = this.data.record.find(item => {
      return item._id === missionId
    })
    const completeMission = this.completeMission
    console.log('mission', event, data, completeMission);
    wx.showModal({
      title: '请确认',
      content: '完成 '+data.mission_content,
      success (res) {
        if (res.confirm) {
          completeMission(data)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  completeMission(mission) {
     wx.showLoading();
     wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {
        env: this.data.envId
      },
      data: {
        type: 'setOperator',
        data: {
          mission_id: mission._id,
          operator_type: 'complete mission'
        }
      }
    }).then((resp) => {
      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        config: {
          env: this.data.envId
        },
        data: {
          type: 'updateUser',
          data: {
            integral: mission.mission_integral
          }
        }
      }).then(resp => {
        wx.cloud.callFunction({
          name: 'quickstartFunctions',
          config: {
            env: this.data.envId
          },
          data: {
            type: 'updateMission',
            data: {
              id: mission._id
            }
          }
        }).then(resp => {
          this.getRecord()
          wx.showToast({
            title: '完成任务',
            icon: 'success',
            duration: 2000
          })
        })
      })
    }).catch((e) => {
   });
  },

  getRecord() {
    wx.showLoading({
      title: '',
    });
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {
        env: this.data.envId
      },
      data: {
        type: 'selectMission'
      }
    }).then((resp) => {
      let nowTime = new Date();
      let nowYear = nowTime.getFullYear();
      let nowMonth = nowTime.getMonth() + 1;
      let nowDay = nowTime.getDate();
      let nowHour = nowTime.getHours();
      let nowMin = nowTime.getMinutes();
      let nowSec = nowTime.getSeconds();
      const finTime = `${nowYear}-${nowMonth}-${nowDay} ${nowHour}:${nowMin}:${nowSec}`;
      resp.result.data.map((item)=>{
        if(item.is_finished && item.finish_time) {
          const pastTime = item.finish_time;
          const pastDay = pastTime.split(' ')[0].split('-');
          if ((+pastDay[0]< nowYear) || 
          (+pastDay[0] === nowYear && +pastDay[1]< nowMonth) || 
          (+pastDay[0] === nowYear && +pastDay[1] === nowMonth && pastDay[2]< nowDay)) {
            this.resetMission();
          }
        }
      })
      this.setData({
        haveGetRecord: true,
        record: resp.result.data
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

  resetMission() {
    wx.showLoading();
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {
        env: this.data.envId
      },
      data: {
        type: 'resetMission'
      }
    });
    this.getRecord();
    wx.hideLoading();
  },

  clearRecord() {
    this.setData({
      haveGetRecord: false,
      record: ''
    });
  }
});
