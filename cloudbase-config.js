// ==========================================
// 小屋 2.0 · CloudBase PostgreSQL 配置
// ==========================================
// 已根据当前 CloudBase 环境填写，无需再手动配置地域。
// 本方案使用匿名登录，不要在前端放 SecretId / SecretKey / service_role API Key。

window.LOVE_HOUSE_CLOUD = {
  envId: "yuyutata-d1gp5z51kb54273a",
  table: "couple_todos",
  // PG 暂无内置实时推送，这里每 4 秒轻量同步一次。
  pollMs: 4000,

  // 第四步：访客记录 + Web Push 通知
  visitFunction: "love-house-notify",
  vapidPublicKey: "BGJjMsHKhPWIuqWf2Hkdwc4XNrc0c6LCkhgXfJWDrGav9rihnhnXkY3qlpC2bHXBo5WFkPv3NyD1MbLoQCYjNgA"
};
