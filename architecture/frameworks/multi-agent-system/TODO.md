# 多Agent协同系统 - 任务清单

## 第一阶段：基础框架搭建

### 1.1 项目准备
- [x] 创建项目目录结构
- [x] 编写README.md
- [x] 编写架构设计文档
- [ ] 编写部署指南

### 1.2 飞书应用准备（已完成）
- [x] 确认要创建的飞书应用数量和职责（DocAgent+CalendarAgent）
- [x] 在飞书开放平台创建 DocAgent 应用
- [x] 在飞书开放平台创建 CalendarAgent 应用
- [x] 获取各应用的 appId 和 appSecret（已同步到memory-index.json）
- [x] 配置各应用的权限（DocAgent:文档读写/Wiki编辑；CalendarAgent:日程管理）

### 1.3 OpenClaw配置
- [ ] 备份当前 openclaw.json
- [ ] 在 openclaw.json 中添加多账户配置
- [ ] 配置 Agent 绑定
- [ ] 测试配置是否生效

### 1.4 主Agent开发
- [x] 开发意图理解模块
- [x] 开发能力路由模块
- [ ] 开发任务分发模块
- [ ] 开发结果汇总模块
- [x] 开发上下文管理模块

### 1.5 子Agent开发
- [x] 创建 DocAgent 基础框架（路径：agents/doc-agent/）
- [ ] 创建 CalendarAgent 基础框架
- [x] 测试子Agent通信（DocAgent已完成集成测试）

---

## 需要老潘确认的问题

1. **第一阶段先配置几个飞书应用？**
   - 建议：DocAgent（文档）+ CalendarAgent（日程），2个开始

2. **你有飞书开放平台的访问权限吗？**
   - 需要在飞书开放平台创建应用

3. **各应用的权限范围？**
   - DocAgent：文档读写、Wiki编辑
   - CalendarAgent：日程管理

---

## 备注

- 项目文件位置：`/Users/evcgs/.openclaw/workspace/multi-agent-system/`
- 架构文档：`architecture/architecture-design.md`
