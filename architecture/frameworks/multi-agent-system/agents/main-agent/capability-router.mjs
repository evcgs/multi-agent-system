/**
 * 能力路由模块
 * 功能：根据意图判断需要调用哪些子Agent，确定调用顺序和数据传递关系
 */

import { INTENT_TYPES } from './intent-parser.mjs';

// Agent能力映射
const AGENT_CAPABILITIES = {
  doc: {
    name: 'DocAgent',
    description: '文档知识域Agent',
    capabilities: ['文档读写', 'Wiki编辑', '知识库管理', '多维表格操作']
  },
  calendar: {
    name: 'CalendarAgent',
    description: '日程协调域Agent',
    capabilities: ['日程管理', '会议安排', '提醒通知', '时间协调']
  },
  data: {
    name: 'DataAgent',
    description: '数据管理域Agent',
    capabilities: ['数据录入', '数据分析', '报表生成']
  },
  comm: {
    name: 'CommAgent',
    description: '沟通协作域Agent',
    capabilities: ['消息推送', '通知分发', '群聊管理']
  },
  pm: {
    name: 'PMAgent',
    description: '项目管理域Agent',
    capabilities: ['任务拆解', '项目规划', '进度跟踪']
  },
  arch: {
    name: 'ArchAgent',
    description: '业务架构域Agent',
    capabilities: ['需求分析', '架构设计', '方案输出']
  }
};

function routeIntent(intent) {
  const { domains, intent: intentType } = intent;
  
  // 通用问题，不需要调用子Agent
  if (domains.length === 1 && domains[0] === 'general') {
    return {
      needAgent: false,
      message: '通用问题，由主Agent直接回答'
    };
  }
  
  // 单一能力域，直接调用对应Agent
  if (domains.length === 1) {
    const domain = domains[0];
    const agent = AGENT_CAPABILITIES[domain];
    return {
      needAgent: true,
      agents: [
        {
          agentId: domain,
          agentName: agent.name,
          task: buildTask(intent, domain),
          order: 'serial',
          dependencies: []
        }
      ],
      executionMode: 'serial'
    };
  }
  
  // 多能力域，并行调用多个Agent
  const agents = domains.map(domain => {
    const agent = AGENT_CAPABILITIES[domain];
    return {
      agentId: domain,
      agentName: agent.name,
      task: buildTask(intent, domain),
      order: 'parallel',
      dependencies: []
    };
  });
  
  return {
    needAgent: true,
    agents,
    executionMode: 'parallel'
  };
}

function buildTask(intent, domain) {
  const { intent: intentType, parameters, rawText } = intent;
  
  const taskTemplates = {
    doc: {
      [INTENT_TYPES.CREATE]: `请创建文档，标题：${parameters.title || '未命名文档'}，内容：${rawText}`,
      [INTENT_TYPES.QUERY]: `请查询文档相关信息：${rawText}`,
      [INTENT_TYPES.UPDATE]: `请更新文档：${rawText}`,
      [INTENT_TYPES.DELETE]: `请删除文档：${rawText}`
    },
    calendar: {
      [INTENT_TYPES.CREATE]: `请创建日程/会议：${rawText}`,
      [INTENT_TYPES.QUERY]: `请查询日程/会议信息：${rawText}`,
      [INTENT_TYPES.UPDATE]: `请更新日程/会议：${rawText}`,
      [INTENT_TYPES.DELETE]: `请删除日程/会议：${rawText}`
    },
    default: `请处理以下请求：${rawText}`
  };
  
  const domainTemplates = taskTemplates[domain] || {};
  return domainTemplates[intentType] || taskTemplates.default;
}

export { routeIntent, AGENT_CAPABILITIES };
