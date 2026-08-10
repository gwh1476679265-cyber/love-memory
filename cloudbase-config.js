// ==========================================
// 小屋 2.0 · CloudBase PostgreSQL 配置
// ==========================================
// CloudBase 环境 ID 必须与控制台完整 EnvId 完全一致。
// 不要在前端放 SecretId / SecretKey / service_role API Key。

window.LOVE_HOUSE_CLOUD = {
  envId: "yuyutata-d1gp5z51kb54273af",
  table: "couple_todos",
  // PostgreSQL 目前用轻量轮询同步共同约定状态。
  pollMs: 4000
};
