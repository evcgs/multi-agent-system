# Agent基础框架 - 快速开发Agent的通用框架 V1.0
## 🎯 项目说明
Agent基础框架是所有Agent开发的通用基础框架，封装了Agent的通用能力，让开发者只需要关注业务逻辑，大大简化新Agent的开发工作，开发效率提升50%以上。

### 解决的核心痛点
- ❌ 每个Agent都重复开发通用能力（初始化、记忆、意图识别、工具调用等）
- ❌ Agent开发标准不统一，维护成本高
- ❌ 新Agent开发周期长，需要从零开始搭建基础能力
- ❌ Agent之间的通信和协作没有统一标准

## ✨ 核心特性
### 🧱 通用能力封装
- ✅ Agent生命周期管理：初始化、运行、暂停、恢复、停止
- ✅ 记忆管理：自动加载和保存Agent的记忆数据
- ✅ 配置管理：统一的配置加载和管理机制
- ✅ 意图识别：内置基础的意图识别能力，支持自定义扩展
- ✅ 能力路由：根据意图自动路由到对应的处理逻辑
- ✅ 工具调用：统一的工具调用接口，支持扩展各种工具

### 🔌 标准化接口
- ✅ 统一的输入输出格式
- ✅ 标准化的事件处理机制
- ✅ 统一的状态管理和查询接口
- ✅ 标准化的消息发送接口

### 🤝 协同支持
- ✅ 内置多Agent通信协议
- ✅ 支持任务分发和结果汇总
- ✅ 统一的错误处理和重试机制
- ✅ 支持跨Agent能力调用

### 📦 快速开发
- ✅ 继承BaseAgent即可快速开发新Agent
- ✅ 内置常用工具和能力，开箱即用
- ✅ 丰富的示例代码和模板
- ✅ 完善的开发者文档

## 🏗️ 架构设计
```
┌─────────────────────────────────────┐
│         业务Agent (子类)            │
│  业务逻辑 → 能力注册 → 意图处理      │
├─────────────────────────────────────┤
│         BaseAgent (基础框架)         │
│  生命周期 → 记忆管理 → 配置管理      │
│  意图识别 → 能力路由 → 工具调用      │
├─────────────────────────────────────┤
│         OpenClaw能力层               │
│  工具调用 → 消息发送 → 资源访问      │
└─────────────────────────────────────┘
```

## 🚀 快速开始
### 安装
```bash
# 直接引用框架
import { BaseAgent } from '../frameworks/agent-framework/base-agent.mjs';
```

### 开发新Agent
```javascript
// 1. 继承BaseAgent
class MyAgent extends BaseAgent {
  constructor() {
    super({
      name: 'my-agent',
      version: '1.0.0',
      description: '我的自定义Agent',
      capabilities: ['query', 'create', 'update'],
      permissions: ['file:read', 'file:write']
    });
  }

  // 2. 注册自定义能力
  registerCapabilities() {
    // 注册你的能力
  }

  // 3. 重写路由方法处理业务逻辑
  async routeToCapability(intent, input) {
    switch (intent) {
      case 'query':
        return this.handleQuery(input);
      case 'create':
        return this.handleCreate(input);
      default:
        return super.routeToCapability(intent, input);
    }
  }

  // 4. 实现业务方法
  async handleQuery(input) {
    // 处理查询逻辑
    return `查询结果：${input}`;
  }

  async handleCreate(input) {
    // 处理创建逻辑
    return `创建成功：${input}`;
  }
}

// 5. 使用Agent
const agent = new MyAgent();
await agent.init();
const result = await agent.processInput('帮我查询相关信息');
console.log(result);
```

## 📋 核心API
### 基础方法
- `init()`：初始化Agent
- `processInput(input, context)`：处理用户输入
- `getStatus()`：获取Agent状态
- `pause()`：暂停Agent
- `resume()`：恢复Agent
- `stop()`：停止Agent

### 可重写方法
- `registerCapabilities()`：注册自定义能力
- `recognizeIntent(input)`：自定义意图识别逻辑
- `routeToCapability(intent, input)`：自定义路由逻辑
- `getHelp()`：自定义帮助信息

### 工具方法
- `callTool(toolName, params)`：调用工具
- `sendMessage(message, options)`：发送消息给用户
- `saveMemory()`：保存记忆数据
- `loadMemory()`：加载记忆数据

## 📝 示例Agent
### 简单的文档处理Agent
```javascript
import { BaseAgent } from './base-agent.mjs';

class DocAgent extends BaseAgent {
  constructor() {
    super({
      name: 'doc-agent',
      version: '1.0.0',
      description: '文档处理智能体',
      capabilities: ['read', 'write', 'summary', 'translate'],
      permissions: ['file:read', 'file:write', 'feishu_doc:read', 'feishu_doc:write']
    });
  }

  async routeToCapability(intent, input) {
    switch (intent) {
      case 'read':
        return this.readDocument(input);
      case 'write':
        return this.writeDocument(input);
      case 'summary':
        return this.summarizeDocument(input);
      case 'translate':
        return this.translateDocument(input);
      default:
        return super.routeToCapability(intent, input);
    }
  }

  async readDocument(path) {
    // 读取文档逻辑
    return `已读取文档：${path}`;
  }

  async writeDocument(content) {
    // 写入文档逻辑
    return `文档写入成功，长度：${content.length}`;
  }

  async summarizeDocument(content) {
    // 摘要逻辑
    return `文档摘要：${content.slice(0, 100)}...`;
  }

  async translateDocument(content, targetLang = 'zh') {
    // 翻译逻辑
    return `翻译结果：[${targetLang}] ${content}`;
  }
}
```

## 📝 更新日志
### v1.0.0 (2026-03-09)
- ✅ 基础能力：Agent生命周期管理
- ✅ 记忆管理：自动加载和保存记忆
- ✅ 配置管理：统一配置加载机制
- ✅ 意图识别：内置基础意图识别
- ✅ 能力路由：根据意图自动分发处理
- ✅ 工具调用：统一的工具调用接口
- ✅ 消息发送：标准化的消息发送接口
- ✅ 完整的示例代码和文档

## 💬 交流与支持
### 微信交流群
扫码加入用户交流群，获取最新更新、使用技巧和技术支持：

<img src="https://raw.githubusercontent.com/evcgs/skill-common/main/images/wxq.jpg" alt="微信群二维码" width="200" height="200">

> （群二维码已过期，请添加下方微信备注来意拉群）

### 联系我们
- **微信**：添加微信，备注「Agent框架+来意」

<img src="https://raw.githubusercontent.com/evcgs/skill-common/main/images/wx.png" alt="个人微信" width="200" height="200">
