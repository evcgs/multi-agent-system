# 技能模板 - 快速创建符合规范的OpenClaw技能 V1.0
## 🎯 项目说明
技能模板是一个帮助开发者快速创建符合OpenClaw技能开发规范的工具，自动生成所有必要的配置文件、目录结构和示例代码，减少重复工作，确保所有技能都遵循统一的标准。

### 解决的核心痛点
- ❌ 每次创建新技能都要重复编写相似的配置文件
- ❌ 技能结构不统一，维护成本高
- ❌ 容易遗漏必要的配置项，导致技能无法正常安装
- ❌ 测试用例和文档不规范，质量参差不齐

## ✨ 核心特性
- ✅ 一键生成标准的技能目录结构
- ✅ 自动生成所有必要的配置文件（skill.md、README.md、manifest.json、package.json）
- ✅ 内置示例代码和测试用例模板
- ✅ 自动初始化git仓库
- ✅ 符合最新的技能开发规范V1.0
- ✅ 支持三种技能类型（独立技能/工具增强技能/MCP集成技能）

## 🚀 安装方式
### 方式1：OpenClaw技能市场安装（推荐）
1. 打开OpenClaw控制面板 → 技能市场
2. 搜索「技能模板」
3. 点击「安装」即可自动完成部署

### 方式2：本地安装
```bash
# 1. 下载到技能目录
cd ~/.openclaw/skills
git clone https://github.com/evcgs/skill-template.git

# 2. 安装依赖
cd skill-template
npm install
```

## 📝 使用指南
### 基础用法
```bash
# 创建新技能
skill create <skill-id> <skill-name> <description> <category>

# 示例：创建一个天气查询技能
skill create weather-query "天气查询技能" "查询当前天气和天气预报" 生活工具
```

### 高级用法
```bash
# 指定技能类型
skill create <skill-id> <skill-name> <description> <category> --type <skill-type>

# 示例：创建一个MCP集成技能
skill create multi-agent "多Agent协同" "多Agent协同工作流" 工作流 --type mcp-integrated
```

## 📋 典型使用场景
### 1. 快速创建新技能
> 开发新技能时，一键生成基础结构，专注业务逻辑开发
```bash
skill create doc-generator "文档生成器" "自动生成各类文档模板" 内容创作
```

### 2. 统一团队技能规范
> 团队开发时，确保所有技能都遵循统一的结构和规范
```bash
# 团队成员都使用这个模板创建技能，保证结构一致
```

### 3. 技能批量生成
> 需要创建多个相似技能时，批量生成基础结构
```bash
# 批量生成多个行业解决方案技能
skill create medical-solution "医疗解决方案" "医疗行业解决方案生成" 行业应用
skill create finance-solution "金融解决方案" "金融行业解决方案生成" 行业应用
```

## 📝 生成的目录结构
```
skill-id/
├── skill.md            # 技能元数据+AI调用说明
├── README.md           # 用户使用文档
├── manifest.json       # 技能包元数据
├── package.json        # 依赖配置
├── prompts/            # 提示词模板目录
│   ├── system.md       # 系统提示词模板
│   └── user.md         # 用户提示词模板
├── scripts/            # 可执行脚本目录
│   └── main.mjs        # 主执行脚本示例
├── templates/          # 输出模板目录
│   └── output.md       # 输出模板示例
├── tests/              # 测试用例目录
│   └── test-cases.json # 测试用例模板
└── assets/             # 资源文件目录
    └── images/         # 图片资源目录
```

## 📝 更新日志
### v1.0.0 (2026-03-09)
- ✅ 基础功能：一键生成标准技能结构
- ✅ 支持三种技能类型模板
- ✅ 自动生成所有必要配置文件
- ✅ 内置示例代码和测试用例
- ✅ 符合技能开发规范V1.0

## 💬 交流与支持
### 微信交流群
扫码加入用户交流群，获取最新更新、使用技巧和技术支持：

<img src="wxq.jpg" alt="微信群二维码" width="200" height="200">

> （群二维码已过期，请添加下方微信备注来意拉群）

### 联系我们
- **微信**：添加微信，备注「技能模板+来意」

<img src="wx.png" alt="个人微信" width="200" height="200">
