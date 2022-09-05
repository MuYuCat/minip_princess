const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  // 返回数据库查询结果
  console.log('updateMission',event.data.id);
  let nowTime = new Date();
  let nowYear = nowTime.getFullYear();
  let nowMonth = nowTime.getMonth() + 1;
  let nowDay = nowTime.getDate();
  let nowHour = nowTime.getHours();
  let nowMin = nowTime.getMinutes();
  let nowSec = nowTime.getSeconds();
  const finTime = `${nowYear}-${nowMonth}-${nowDay} ${nowHour}:${nowMin}:${nowSec}`;
  return await db.collection('mission').where({
    _id: event.data.id
  }).update({
    data:{
      is_finished: true,
      finish_time: finTime
    }
  });
};
