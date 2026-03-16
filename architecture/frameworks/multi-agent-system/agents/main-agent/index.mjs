/**
 * 主Agent入口文件
 * 功能：协调所有模块，处理用户请求
 */

import { extractIntent } from './intent-parser.mjs';
import { routeIntent } from './capability-router.mjs';
import { dispatchTasks } from './task-dispatcher.mjs';
import { aggregateResults } from './result-aggregator.mjs';

/**
 * 处理用户请求的主入口
 * @param {string} userInput 用户的自然语言输入
 * @returns {Object} 处理结果
 */
async function processRequest(userInput) {
  try {
    console.log(`[主Agent] 收到用户请求：${userInput}`);
    
    // 步骤1：意图理解
    const intent = extractIntent(userInput);
    console.log(`[主Agent] 识别意图：`, intent);
    
    // 步骤2：能力路由
    const routingResult = routeIntent(intent);
    console.log(`[主Agent] 路由结果：`, routingResult);
    
    // 不需要调用子Agent，直接返回
    if (!routingResult.needAgent) {
      return {
        success: true,
        message: '我可以直接回答你的问题：' + userInput,
        intent,
        routingResult
      };
    }
    
    // 步骤3：任务分发
    const dispatchResult = await dispatchTasks(routingResult);
    console.log(`[主Agent] 任务执行结果：`, dispatchResult);
    
    // 步骤4：结果汇总
    const finalResult = aggregateResults(dispatchResult);
    console.log(`[主Agent] 最终结果：`, finalResult);
    
    return {
      success: true,
      ...finalResult,
      intent,
      routingResult,
      dispatchResult
    };
    
  } catch (error) {
    console.error(`[主Agent] 处理请求失败：`, error);
    return {
      success: false,
      message: `处理请求失败：${error.message}`,
      error: error.stack
    };
  }
}

// 测试示例
if (import.meta.url === `file://${process.argv[1]}`) {
  // 测试单Agent调用
  testSingleAgent();
  
  // 测试多Agent调用
  // testMultiAgent();
}

async function testSingleAgent() {
  console.log('=== 测试单Agent调用：创建文档 ===');
  const result = await processRequest('帮我创建一个标题为"项目计划"的文档');
  console.log('测试结果：', result.message);
}

async function testMultiAgent() {
  console.log('=== 测试多Agent调用：安排会议并发送通知 ===');
  const result = await processRequest('帮我安排明天下午2点的会议，并给所有参会人发送通知');
  console.log('测试结果：', result.message);
}

export { processRequest };
