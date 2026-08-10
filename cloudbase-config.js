// ==========================================
// 小屋 2.0 · CloudBase PostgreSQL + Web Push 配置
// ==========================================
// CloudBase 环境 ID 必须与控制台完整 EnvId 完全一致。
// VAPID 公钥可以公开放在前端；VAPID 私钥绝不能放进前端或 GitHub。

window.LOVE_HOUSE_CLOUD = {
  envId: "yuyutata-d1gp5z51kb54273af",
  table: "couple_todos",
  // PostgreSQL 目前用轻量轮询同步共同约定状态。
  pollMs: 4000,
  // Web Push 的 VAPID 公钥（公开信息，可以放前端）
  vapidPublicKey: "BGJjMsHKhPWIuqWf2Hkdwc4XNrc0c6LCkhgXfJWDrGav9rihnhnXkY3qlpC2bHXBo5WFkPv3NyD1MbLoQCYjNgA"
};
