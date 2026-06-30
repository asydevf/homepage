@echo off
REM 请先设置你的 Cloudflare API Token
REM set CLOUDFLARE_API_TOKEN=你的token

echo 正在设置 Cloudflare Pages 环境变量...

echo maomao | npx wrangler pages secret put NEXT_PUBLIC_SITE_NAME --project-name=qqhkx-homepage
echo .com | npx wrangler pages secret put NEXT_PUBLIC_SITE_DOMAIN --project-name=qqhkx-homepage
echo maomao | npx wrangler pages secret put NEXT_PUBLIC_SITE_TITLE --project-name=qqhkx-homepage
echo maomao的个人主页 | npx wrangler pages secret put NEXT_PUBLIC_PROFILE_NAME --project-name=qqhkx-homepage
echo ko不了你的只会让你变得更ok | npx wrangler pages secret put NEXT_PUBLIC_PROFILE_MOTTO --project-name=qqhkx-homepage
echo 中国·重庆 | npx wrangler pages secret put NEXT_PUBLIC_PROFILE_LOCATION --project-name=qqhkx-homepage
echo 研究生 | npx wrangler pages secret put NEXT_PUBLIC_PROFILE_ROLE --project-name=qqhkx-homepage
echo 我是来自{location}的{role}，目前正在研究人体动作交互生成领域的论文，我始终相信人类交互与ai共舞 | npx wrangler pages secret put NEXT_PUBLIC_PROFILE_DESCRIPTION --project-name=qqhkx-homepage
echo [{\"name\":\"GitHub\",\"url\":\"https://github.com/asydevf\"},{\"name\":\"QQ\",\"url\":\"https://wpa.qq.com/msgrd?v=3&uin=3886439010&site=qq&menu=yes\"}] | npx wrangler pages secret put NEXT_PUBLIC_SOCIALS --project-name=qqhkx-homepage

echo 完成！请在 Cloudflare Dashboard 触发重新部署。
pause
