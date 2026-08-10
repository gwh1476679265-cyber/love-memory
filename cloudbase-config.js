// ==========================================
// 小屋 2.0 · CloudBase PostgreSQL + Web Push 配置
// ==========================================
// Publishable Key 是 CloudBase 允许放在浏览器中的客户端 Key；
// VAPID 私钥仍然只能存在云函数环境变量里，绝不能上传 GitHub。

window.LOVE_HOUSE_CLOUD = {
  envId: "yuyutata-d1gp5z51kb54273af",
  table: "couple_todos",
  pollMs: 4000,
  visitFunction: "love-house-notify",
  publishableKey: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjA1MTA3NmQxLWVhYTctNGUwMi1iNjk0LWZiNDU2ODlkYzEzNyJ9.eyJpc3MiOiJodHRwczovL3l1eXV0YXRhLWQxZ3A1ejUxa2I1NDI3M2FmLmFwLXNoYW5naGFpLnRjYi1hcGkudGVuY2VudGNsb3VkYXBpLmNvbSIsInN1YiI6ImFub24iLCJhdWQiOiJ5dXl1dGF0YS1kMWdwNXo1MWtiNTQyNzNhZiIsImV4cCI6NDA5MDA0OTg1NiwiaWF0IjoxNzg2MzY2NjU2LCJub25jZSI6InpKSWFGbWN3VG5PdEFMUzBlSU80eFEiLCJhdF9oYXNoIjoiekpJYUZtY3dUbk90QUxTMGVJTzR4USIsIm5hbWUiOiJBbm9ueW1vdXMiLCJzY29wZSI6ImFub255bW91cyIsInByb2plY3RfaWQiOiJ5dXl1dGF0YS1kMWdwNXo1MWtiNTQyNzNhZiIsIm1ldGEiOnsicGxhdGZvcm0iOiJQdWJsaXNoYWJsZUtleSJ9LCJyb2xlIjoiYW5vbiIsImlzX2Fub255bW91cyI6dHJ1ZSwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiYW5vbnltb3VzIiwicHJvdmlkZXJzIjpbImFub255bW91cyJdfSwidXNlcl9tZXRhZGF0YSI6eyJuYW1lIjoiQW5vbnltb3VzIn0sInVzZXJfdHlwZSI6IiIsImNsaWVudF90eXBlIjoiY2xpZW50X3VzZXIiLCJpc19zeXN0ZW1fYWRtaW4iOmZhbHNlfQ.rOGQmKVeOaJRljCjJRZliUONCUu5glihbHyEn2QmGby0HZKujGJ1_KNJgFkICrh_B7eaEXZdd4kN77gCbNxX12fhmcoG1cU6rsGnvdROHMfF3VdERl48q_yr1wwR9Xqmz1703DFzps42oqt8iDpCTNyAYex7CjA--yDssvF8LwoAZKNFb7y36EoNUhwXBpMqLex6BMPUhijB9VYM7PLxLp-zO6iPGeHRDC_sfVjMqlupvas6sBZXOVAnag_rrH0kS8NQ2tL9ydGcmgVjHhdmsL1XLDL4stfwkQQtn5EE2yg4HQtqXkH3aLgfpH2dY_C1_AD-KHOMOienE17ds6rjGg",
  vapidPublicKey: "BGJjMsHKhPWIuqWf2Hkdwc4XNrc0c6LCkhgXfJWDrGav9rihnhnXkY3qlpC2bHXBo5WFkPv3NyD1MbLoQCYjNgA"
};
