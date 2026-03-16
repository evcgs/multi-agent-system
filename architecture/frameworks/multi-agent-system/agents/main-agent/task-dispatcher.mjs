/**
 * 任务分发模块
 * 功能：将任务分发给对应的子Agent，收集执行结果
 */

import { routeBatch } from '../../skills/agent-router/skill-router.mjs';

async function dispatchTasks(routingResult) {
  const { needAgent, agents, executionMode } = routingResult;
  
  if (!needAgent) {
    return {
      success: true,
      results: []
    };
  }
  
  // 转换格式传递给路由层
  const taskList = agents.map(agent => ({
    agentId: agent.agentId,
    task: agent.task,
    parameters: {}
  }));
  
  // 调用Agent路由层处理
  const result = await routeBatch(taskList, executionMode);
  
  // 补充agentName信息
  if (result.success) {
    result.results = result.results.map((res, index) => ({
      ...res,
      agentName: agents[index].agentName,
      task: agents[index].task
    }));
  }
  
  return result;
}

export { dispatchTasks };
