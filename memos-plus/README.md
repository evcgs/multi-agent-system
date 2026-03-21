# 🚀 MemOS Plus - MemOS Cloud OpenClaw 集成增强包

> 整合了官方MemOS Cloud插件 + 自动同步技能 + Agent记忆使用指南，修复了官方插件已知bug，开箱即用。

[![OpenClaw](https://img.shields.io/badge/OpenClaw-Compatible-blue.svg)](https://openclaw.ai)
[![Version](https://img.shields.io/badge/Version-1.0.0-green.svg)](https://github.com/evcgs/memos-plus/releases)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🎯 项目说明

MemOS Plus 是 [OpenClaw](https://github.com/openclaw/openclaw) 生态下的 MemOS Cloud 完整集成包，包含：

| 模块 | 说明 | 位置 |
|------|------|------|
| **memos-cloud-openclaw-plugin** | 修复后的官方 MemOS Cloud 插件，提供基础的记忆召回和写入功能 | `plugin/` |
| **memos-sync-skill** | 自动同步技能 —— 自动将本地记忆增量同步到 MemOS Cloud 云端，支持定时同步、冲突检测、健康检查 | `skills/memos-sync-skill/` |
| **memos-memory-guide** | Agent 记忆使用指南 —— 教 Agent 正确使用 MemOS 记忆工具，提升上下文检索质量 | `skills/memos-memory-guide/` |

### 我们修复了官方插件的哪些问题？

1. ✅ **修复 Windows 安装兼容问题**：提供完整手动安装指南
2. ✅ **完善多 Agent 支持**：正确实现多 Agent 记忆数据隔离
3. ✅ **增强环境变量读取逻辑**：兼容多种配置方式
4. ✅ **提供额外同步功能**：自动增量同步、定时检查、冲突检测

---

## 🚀 快速安装

### 前置要求

- OpenClaw >= 2026.3.x
- 已注册 [MemOS Cloud](https://memos-dashboard.openmem.net/cn/apikeys/) 账号并获取 API Key
- Node.js >= 18 (OpenClaw 已满足)

### 一键安装（OpenClaw 技能商店）

```bash
openclaw install evcgs/memos-plus
openclaw gateway restart
```

### 手动安装

```bash
cd ~/.openclaw/workspace
git clone https://github.com/evcgs/memos-plus.git
# 启用插件
# 修改 ~/.openclaw/openclaw.json 添加插件
# 重启 gateway
openclaw gateway restart
```

---

## ⚙️ 配置说明

### 1. API Key 配置

在 `~/.openclaw/.env` 中添加：

```env
MEMOS_API_KEY=your-memosh-api-key-here
```

**获取 API Key：**
1. 登录 [MemOS Cloud 控制台](https://memos-dashboard.openmem.net/cn/apikeys/)
2. 点击 "创建 API Key"
3. 复制 Key 粘贴到 `.env` 文件

### 2. 插件配置

在 OpenClaw 插件配置中添加（可选，大部分情况默认配置即可）：

```json
{
  "baseUrl": "https://memos.memtensor.cn/api/openmem/v1",
  "apiKey": "YOUR_API_KEY",
  "userId": "memos_user_123",
  "conversationId": "openclaw-main",
  "recallGlobal": true,
  "multiAgentMode": false
}
```

### 3. 同步功能配置

同步功能配置文件路径：`skills/memos-sync-skill/config/sync_config.json`

```json
{
  "enabled": true,
  "auto_sync": true,          // 自动同步新记忆
  "schedule_sync": true,      // 每日定时同步
  "schedule_time": "0 2 * * *", // 定时执行时间（cron格式），默认每天凌晨2点
  "incremental_sync": true,   // 增量同步，只同步新增
  "conflict_strategy": "latest", // 冲突策略：latest/keep_local/keep_cloud
  "alert_on_failure": true,   // 同步失败发送告警
  "sync_log_retention": 30    // 日志保留天数
}
```

---

## 🚀 首次初始化同步

安装配置完成后，需要**一次性把本地已有的记忆全量同步到云端**：

```bash
cd ~/.openclaw/workspace/memos-plus/skills/memos-sync-skill

# 1. 先检查云端连接和配置是否正确
python3 scripts/health_check.py

# 2. 执行全量同步，把本地所有记忆同步到云端
python3 scripts/memos_sync.py --full
```

### 命令说明

| 命令 | 参数 | 作用 | 使用场景 |
|------|------|------|----------|
| `memos_sync.py` | `--full` | **全量同步** | 首次初始化，同步本地所有记忆 |
| `memos_sync.py` | 无参数 | **增量同步** | 日常使用，只同步新增记忆 |
| `sync_check.py` | - | 检查同步状态 | 对比本地与云端差异 |
| `health_check.py` | - | 健康检查 | 验证API连通性和认证 |

### 同步完成后

同步完成会输出统计报告：

```
📊 MemOS 同步报告（2026-03-21 08:53）
==================================================
✅ 同步状态：成功
📈 统计：
   本地记录总数：2137
   云端记录总数：0
   新增同步：2137 条
   失败：0 条
   成功率：100%
⏱️ 耗时：125 秒
🌐 云端状态：正常
⚠️  异常：无
```

之后：
- 自动增量同步已开启，每天凌晨2点自动同步
- 需要手动同步时，直接执行 `python3 scripts/memos_sync.py`（增量同步）

---

## ✨ 核心功能

### 插件核心（官方修复版）

| 功能 | 说明 |
|------|------|
| 📥 **自动召回** | 每轮对话前自动从 MemOS Cloud 检索相关记忆注入上下文 |
| 📤 **自动保存** | 每轮对话结束自动保存到 MemOS Cloud |
| 🔍 **记忆过滤** | 可选支持 LLM 二次过滤召回结果，减少冗余 |
| 👥 **多 Agent 隔离** | 完整支持多 Agent 记忆数据隔离，每个 Agent 独立记忆 |

### 同步技能新增功能

| 功能 | 说明 |
|------|------|
| 🚀 **自动增量同步** | 只同步上次同步后新增的记忆，效率提升 90% |
| ⏰ **定时同步** | 支持 cron 定时自动同步，保证云端永远最新 |
| ⚖️ **冲突检测** | 自动检测本地与云端差异，按配置策略处理 |
| 🏥 **健康检查** | 自动检测 API 连通性和认证有效性，异常告警 |
| 📊 **同步报告** | 每次同步生成详细统计报告 |
| 💾 **安全备份** | 同步前自动备份，防止数据丢失 |

### Agent 使用指南

memos-memory-guide 是给 OpenClaw Agent 的技能，告诉你的 Agent 如何正确使用 MemOS 记忆工具：
- 什么时候需要主动调用记忆搜索
- 如何使用 task_summary 获取完整任务上下文
- 如何使用 memory_timeline 获取对话上下文
- 帮助 Agent 养成正确使用记忆的习惯

---

## 📊 性能指标

| 指标 | 数值 |
|------|------|
| 召回延迟 | < 1s |
| 全量同步速度 | 2-3 条/秒 |
| 增量同步 | < 1 分钟（千条记忆） |
| 成功率 | ≥ 99% |

---

## 📝 更新日志

### v1.0.0 (2026-03-21)

🎉 首次发布整合版本
- ✅ 整合官方修复版 memos-cloud-openclaw-plugin
- ✅ 添加 memos-sync-skill 自动同步功能
- ✅ 添加 memos-memory-guide Agent 使用指南
- ✅ 修复官方插件已知 bug
- ✅ 支持完整配置化

---

## 📞 联系我们

欢迎交流讨论，一起改进：

### 个人微信

添加微信，备注「memos-plus+来意」：

<img src="https://raw.githubusercontent.com/evcgs/memos-plus/main/wx.png" alt="作者微信" width="200" height="200">

---

## 📄 许可证

MIT License - 详见 [LICENSE](plugin/LICENSE)

---

*让你的 MemOS 记忆自动同步，安全不丢失* 📝
