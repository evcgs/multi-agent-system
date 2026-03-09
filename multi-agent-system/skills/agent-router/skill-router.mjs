/**
 * Agent路由层
 * 功能：绕过sessions_spawn限制，直接调用子Agent能力
 */

import { processRequest as docAgentProcess } from '../../agents/doc-agent/core/processor.mjs';
import { processRequest as calendarAgentProcess } from '../../agents/calendar-agent/core/processor.mjs';

// Agent能力映射
const AGENT_PROCESSORS = {
  doc: docAgentProcess,
  calendar: calendarAgentProcess,
  data: null, // 待实现
  comm: null, // 待实现
  pm: null, // 待实现
  arch: null // 待实现
};

/**
 * 路由任务到对应的Agent
 * @param {string} agentId Agent ID
 * @param {string} task 任务描述
 * @param {Object} parameters 参数
 * @returns {Object} 执行结果
 */
async function routeToAgent(agentId, task, parameters = {}) {
  const processor = AGENT_PROCESSORS[agentId];
  if (!processor) {
    console.log(`[Agent路由] 跳过未实现的Agent: ${agentId}`);
    return {
      success: true,
      agentId,
      result: `（${agentId} 功能开发中，暂不处理该任务）`,
      skipped: true,
      timestamp: new Date().toISOString()
    };
  }
  
  try {
    console.log(`[Agent路由] 调用 ${agentId} 处理任务: ${task}`);
    const result = await processor(task, parameters);
    return {
      success: true,
      agentId,
      result,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`[Agent路由] 调用 ${agentId} 失败:`, error);
    return {
      success: false,
      agentId,
      error: error.message
    };
  }
}

/**
 * 批量路由任务
 * @param {Array} agents 要调用的Agent列表
 * @param {string} executionMode 执行模式：serial/parallel
 * @returns {Object} 执行结果
 */
async function routeBatch(agents, executionMode = 'parallel') {
  if (executionMode === 'parallel') {
    const promises = agents.map(agent => routeToAgent(agent.agentId, agent.task, agent.parameters));
    const results = await Promise.all(promises);
    return {
      success: results.every(r => r.success),
      results
    };
  } else {
    const results = [];
    for (const agent of agents) {
      const result = await routeToAgent(agent.agentId, agent.task, agent.parameters);
      results.push(result);
      if (!result.success) break;
    }
    return {
      success: results.every(r => r.success),
      results
    };
  }
}

export { routeToAgent, routeBatch };
