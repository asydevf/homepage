/**
 * 一键同步 .env 到 Cloudflare Pages 环境变量
 * 用法：CLOUDFLARE_API_TOKEN=你的token node scripts/sync-env-to-cloudflare.js
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

// 配置
const PROJECT_NAME = "maomao-home";
const ACCOUNT_ID = ""; // 留空则自动获取

// 读取 .env 文件
function parseEnv(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const vars = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    vars[key] = value;
  }
  return vars;
}

// HTTP 请求封装
function request(method, url, token, body) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve(data);
        }
      });
    });
    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function main() {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (!token) {
    console.error("❌ 请设置 CLOUDFLARE_API_TOKEN 环境变量");
    console.error("   CLOUDFLARE_API_TOKEN=你的token node scripts/sync-env-to-cloudflare.js");
    process.exit(1);
  }

  // 获取账号 ID
  let accountId = ACCOUNT_ID;
  if (!accountId) {
    console.log("📡 获取账号信息...");
    const accounts = await request("GET", "https://api.cloudflare.com/client/v4/accounts", token);
    if (accounts.result && accounts.result.length > 0) {
      accountId = accounts.result[0].id;
      console.log(`   账号 ID: ${accountId}`);
    } else {
      console.error("❌ 无法获取账号信息，请手动设置 ACCOUNT_ID");
      process.exit(1);
    }
  }

  // 读取 .env
  const envPath = path.join(__dirname, "..", ".env");
  const envVars = parseEnv(envPath);
  const publicVars = Object.entries(envVars).filter(([k]) =>
    k.startsWith("NEXT_PUBLIC_")
  );

  console.log(`\n📋 读取到 ${publicVars.length} 个 NEXT_PUBLIC_ 变量\n`);

  // 获取现有变量
  console.log("📡 获取现有环境变量...");
  const existing = await request(
    "GET",
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${PROJECT_NAME}`,
    token
  );

  const currentVars = existing.result?.deployment_configs?.production?.env_vars || {};
  console.log(`   现有变量: ${Object.keys(currentVars).length} 个\n`);

  // 合并变量
  const env_vars = { ...currentVars };
  for (const [key, value] of publicVars) {
    env_vars[key] = { value };
    console.log(`   ✅ ${key} = ${value.length > 40 ? value.slice(0, 40) + "..." : value}`);
  }

  // 更新项目
  console.log("\n🚀 更新 Cloudflare Pages 环境变量...");
  const result = await request(
    "PATCH",
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${PROJECT_NAME}`,
    token,
    {
      deployment_configs: {
        production: { env_vars },
      },
    }
  );

  if (result.success) {
    console.log("\n🎉 环境变量同步成功！");
    console.log("   请在 Cloudflare Dashboard 触发重新部署");
  } else {
    console.error("\n❌ 同步失败:", JSON.stringify(result.errors, null, 2));
  }
}

main().catch(console.error);
