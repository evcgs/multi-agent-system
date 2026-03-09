#!/usr/bin/env node
/**
 * 项目全景扫描工具
 * 功能：自动扫描工作区所有项目，生成项目状态全景报告
 */

import fs from 'fs/promises';
import path from 'path';

const WORKSPACE_ROOT = '/Users/evcgs/.openclaw/workspace';
const SYSTEM_AGENTS_DIR = '/Users/evcgs/.openclaw/agents';
const SCAN_PATHS = [
  'multi-agent-system',
  'CalendarAgent',
  'safety-boundary-initialization',
  'git-workflow'
];

// Agent识别规则
const AGENT_MARKERS = [
  'IDENTITY.md',
  'SOUL.md',
  'MEMORY.md',
  'SKILL.md',
  'README.md'
];

// Agent完成度配置维度标记
const AGENT_CONFIG_MARKERS = [
  'TOOLS.md',
  '.openclaw/config.yaml',
  '飞书应用配置完成'
];

// Agent开发完成维度标记
const AGENT_DEV_MARKERS = [
  'SYSTEM.md',
  'scripts/',
  '核心功能代码'
];

// Agent验证完成维度标记
const AGENT_VERIFY_MARKERS = [
  '测试报告',
  '验收通过标记'
];

// 状态枚举
const AGENT_STATUS = {
  PLANNING: '规划中',
  CONFIGURING: '配置中',
  DEVELOPING: '开发中',
  TESTING: '测试中',
  COMPLETED: '已完成'
};

// 配置文件识别规则
const CONFIG_FILES = [
  'config/*.yaml',
  'config/*.yml',
  'config/*.json',
  '.openclaw/config.yaml',
  'feishu-agents-config.yaml'
];

// 任务清单识别规则
const TODO_FILES = [
  'TODO.md',
  'AGENDA.md',
  'ROADMAP.md',
  '任务清单.md'
];

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function scanAgents() {
  const agents = [];
  
  // 扫描工作区根目录下的Agent
  const rootItems = await fs.readdir(WORKSPACE_ROOT, { withFileTypes: true });
  for (const item of rootItems) {
    if (item.isDirectory() && item.name.toLowerCase().includes('agent')) {
      const agentPath = path.join(WORKSPACE_ROOT, item.name);
      const agentInfo = await getAgentInfo(item.name, agentPath);
      agents.push(agentInfo);
    }
  }
  
  // 扫描multi-agent-system下的Agent
  const masAgentsDir = path.join(WORKSPACE_ROOT, 'multi-agent-system', 'agents');
  if (await fileExists(masAgentsDir)) {
    const masItems = await fs.readdir(masAgentsDir, { withFileTypes: true });
    for (const item of masItems) {
      if (item.isDirectory()) {
        const agentPath = path.join(masAgentsDir, item.name);
        const agentInfo = await getAgentInfo(item.name, agentPath);
        agents.push(agentInfo);
      }
    }
  }
  
  // 扫描系统级已安装的Agent
  if (await fileExists(SYSTEM_AGENTS_DIR)) {
    const systemAgents = await fs.readdir(SYSTEM_AGENTS_DIR, { withFileTypes: true });
    for (const item of systemAgents) {
      if (item.isDirectory()) {
        const agentPath = path.join(SYSTEM_AGENTS_DIR, item.name);
        const agentInfo = await getAgentInfo(`${item.name} (已安装)`, agentPath);
        agents.push(agentInfo);
      }
    }
  }
  
  return agents;
}

async function getAgentInfo(name, agentPath) {
  // 检查基础标记
  const baseMarkers = await Promise.all(
    AGENT_MARKERS.map(marker => fileExists(path.join(agentPath, marker)))
  );
  const baseComplete = baseMarkers.filter(Boolean).length >= 4;
  
  // 检查配置完成维度
  const configMarkers = await Promise.all(
    AGENT_CONFIG_MARKERS.map(marker => fileExists(path.join(agentPath, marker)))
  );
  const configComplete = configMarkers.filter(Boolean).length >= 2;
  
  // 检查开发完成维度
  const devMarkers = await Promise.all(
    AGENT_DEV_MARKERS.map(marker => fileExists(path.join(agentPath, marker)))
  );
  const devComplete = devMarkers.filter(Boolean).length >= 2;
  
  // 检查验证完成维度
  const verifyMarkers = await Promise.all(
    AGENT_VERIFY_MARKERS.map(marker => fileExists(path.join(agentPath, marker)))
  );
  const verifyComplete = verifyMarkers.filter(Boolean).length >= 1;
  
  // 判定状态
  let status = AGENT_STATUS.PLANNING;
  if (baseComplete && configComplete && devComplete && verifyComplete) {
    status = AGENT_STATUS.COMPLETED;
  } else if (baseComplete && configComplete && devComplete) {
    status = AGENT_STATUS.TESTING;
  } else if (baseComplete && configComplete) {
    status = AGENT_STATUS.DEVELOPING;
  } else if (baseComplete) {
    status = AGENT_STATUS.CONFIGURING;
  }
  
  // 计算整体完成度
  const totalDimensions = 3; // 配置+开发+验证
  const completedDimensions = [configComplete, devComplete, verifyComplete].filter(Boolean).length;
  const completionRate = Math.round((completedDimensions / totalDimensions) * 100);
  
  return {
    name,
    path: agentPath,
    status,
    dimensions: {
      config: configComplete ? '✅ 完成' : '⏳ 未完成',
      development: devComplete ? '✅ 完成' : '⏳ 未完成',
      verification: verifyComplete ? '✅ 完成' : '⏳ 未完成'
    },
    completionRate,
    baseMarkersComplete: baseMarkers.filter(Boolean).length,
    baseMarkersTotal: AGENT_MARKERS.length
  };
}

async function scanConfigs() {
  const configs = [];
  
  async function scanDir(dir) {
    const items = await fs.readdir(dir, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
        await scanDir(fullPath);
      } else if (item.isFile() && (
        item.name.endsWith('.yaml') || 
        item.name.endsWith('.yml') || 
        item.name.endsWith('.json')
      ) && item.name.includes('config')) {
        configs.push({
          name: item.name,
          path: fullPath,
          size: (await fs.stat(fullPath)).size
        });
      }
    }
  }
  
  for (const scanPath of SCAN_PATHS) {
    const fullPath = path.join(WORKSPACE_ROOT, scanPath);
    if (await fileExists(fullPath)) {
      await scanDir(fullPath);
    }
  }
  
  return configs;
}

async function scanTodos() {
  const todos = [];
  
  async function scanDir(dir) {
    const items = await fs.readdir(dir, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
        await scanDir(fullPath);
      } else if (item.isFile() && TODO_FILES.includes(item.name)) {
        const content = await fs.readFile(fullPath, 'utf-8');
        const todoItems = content.match(/\s*-\s*\[\s*( |x)\s*\]\s*(.+)/g) || [];
        const completed = todoItems.filter(item => item.includes('[x]')).length;
        const total = todoItems.length;
        
        todos.push({
          name: item.name,
          path: fullPath,
          completed,
          total,
          completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
        });
      }
    }
  }
  
  for (const scanPath of SCAN_PATHS) {
    const fullPath = path.join(WORKSPACE_ROOT, scanPath);
    if (await fileExists(fullPath)) {
      await scanDir(fullPath);
    }
  }
  
  return todos;
}

async function generateReport() {
  const [agents, configs, todos] = await Promise.all([
    scanAgents(),
    scanConfigs(),
    scanTodos()
  ]);
  
  const completedAgents = agents.filter(a => a.status === '已完成').length;
  const totalAgents = agents.length;
  const totalCompletedTodos = todos.reduce((sum, t) => sum + t.completed, 0);
  const totalTodos = todos.reduce((sum, t) => sum + t.total, 0);
  
  // 计算整体项目完成度（Agent平均完成度 * 0.6 + 任务完成度 * 0.4）
  const avgAgentCompletion = agents.reduce((sum, a) => sum + a.completionRate, 0) / (agents.length || 1);
  const taskCompletion = totalTodos > 0 ? Math.round((totalCompletedTodos / totalTodos) * 100) : 0;
  const overallCompletion = Math.round(avgAgentCompletion * 0.6 + taskCompletion * 0.4);
  
  const report = `
# 项目状态全景报告
生成时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}

## 🤖 Agent 状态
总Agent数：${totalAgents} | 已完成：${completedAgents} | 开发中：${totalAgents - completedAgents}

${agents.map(agent => `- ${agent.status === '已完成' ? '✅' : agent.status === '测试中' ? '🧪' : agent.status === '开发中' ? '💻' : '⚙️'} ${agent.name}
  状态：${agent.status}
  完成度：${agent.completionRate}%
  配置维度：${agent.dimensions.config}
  开发维度：${agent.dimensions.development}
  验证维度：${agent.dimensions.verification}
  路径：${agent.path}`).join('\n\n')}

## ⚙️ 配置文件状态
已发现配置文件：${configs.length} 个

${configs.map(config => `- 📄 ${config.name}
  路径：${config.path}
  大小：${config.size} bytes`).join('\n')}

## ✅ 任务完成状态
总任务数：${totalTodos} | 已完成：${totalCompletedTodos} | 整体完成度：${overallCompletion}%

${todos.map(todo => `- 📋 ${todo.name}
  路径：${todo.path}
  完成度：${todo.completed}/${todo.total} (${todo.completionRate}%)`).join('\n')}

## 🎯 整体项目进度
整体完成度：**${overallCompletion}%**
  `.trim();
  
  console.log(report);
  return report;
}

// 执行扫描
if (import.meta.url === `file://${process.argv[1]}`) {
  generateReport().catch(console.error);
}

export { generateReport, scanAgents, scanConfigs, scanTodos };
