/**
 * 结果汇总模块
 * 功能：整合多个子Agent的输出，形成统一的最终回答
 */

function aggregateResults(dispatchResult) {
  const { success, results } = dispatchResult;
  
  // 过滤掉跳过的未实现Agent
  const validResults = results.filter(r => !r.skipped);
  const skippedResults = results.filter(r => r.skipped);
  
  if (validResults.length === 0) {
    return {
      success: true,
      message: '所有相关Agent功能都在开发中，暂无法处理该请求',
      details: results
    };
  }
  
  if (validResults.length === 1) {
    // 单Agent结果，直接返回
    const result = validResults[0];
    return {
      success: result.success,
      message: result.success ? result.result : `任务执行失败：${result.error}`,
      details: results
    };
  }
  
  // 多Agent结果，整合汇总
  const successCount = validResults.filter(r => r.success).length;
  const totalCount = validResults.length;
  
  let message = `✅ 已完成 ${successCount}/${totalCount} 个任务：\n\n`;
  
  validResults.forEach((result, index) => {
    const status = result.success ? '✅' : '❌';
    message += `${index + 1}. ${status} ${result.agentName}：${result.success ? result.result : `失败：${result.error}`}\n`;
  });
  
  if (skippedResults.length > 0) {
    message += `\n⚠️  以下Agent开发中，暂未处理：${skippedResults.map(r => r.agentId).join('、')}\n`;
  }
  
  // 添加总结
  message += `\n🎉 可处理的任务已全部完成`;
  
  return {
    success: successCount === totalCount,
    message,
    details: results
  };
}

// 冲突解决：当多个Agent结果不一致时的处理策略
function resolveConflicts(results) {
  // 简单策略：优先返回成功的结果，失败的结果作为补充说明
  const successResults = results.filter(r => r.success);
  const failedResults = results.filter(r => !r.success);
  
  if (successResults.length > 0) {
    return successResults;
  }
  
  return results;
}

export { aggregateResults, resolveConflicts };
