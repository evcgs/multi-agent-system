/**
 * 意图理解模块
 * 功能：将用户自然语言输入转换为结构化意图
 */

// 能力域关键词映射
const DOMAIN_KEYWORDS = {
  doc: ['文档', '飞书文档', 'docx', 'wiki', '知识库', '云文档', '表格', 'bitable', '多维表格'],
  calendar: ['日程', '日历', '会议', '预约', '提醒', '时间', '安排', '开会', '参会'],
  data: ['数据', '统计', '分析', '报表', 'dashboard', '可视化'],
  comm: ['消息', '通知', '发送', '群聊', '邮件', '告知', '提醒'],
  pm: ['项目', '任务', '拆解', '规划', '进度', '风险', '排期'],
  arch: ['架构', '方案', '需求', '设计', 'ceo视角', '老板视角', '业务']
};

// 意图类型
const INTENT_TYPES = {
  QUERY: '查询',
  CREATE: '创建',
  UPDATE: '更新',
  DELETE: '删除',
  COORDINATE: '协调',
  ANALYSIS: '分析'
};

function extractIntent(text) {
  const lowerText = text.toLowerCase();
  
  // 识别涉及的能力域
  const domains = [];
  for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      domains.push(domain);
    }
  }
  
  // 识别意图类型
  let intentType = INTENT_TYPES.QUERY;
  if (lowerText.includes('创建') || lowerText.includes('新建') || lowerText.includes('生成')) {
    intentType = INTENT_TYPES.CREATE;
  } else if (lowerText.includes('更新') || lowerText.includes('修改') || lowerText.includes('编辑')) {
    intentType = INTENT_TYPES.UPDATE;
  } else if (lowerText.includes('删除') || lowerText.includes('移除')) {
    intentType = INTENT_TYPES.DELETE;
  } else if (lowerText.includes('协调') || lowerText.includes('安排') || lowerText.includes('组织')) {
    intentType = INTENT_TYPES.COORDINATE;
  } else if (lowerText.includes('分析') || lowerText.includes('统计')) {
    intentType = INTENT_TYPES.ANALYSIS;
  }
  
  // 提取关键参数（简单实现，后续可扩展为NLP）
  const parameters = {};
  
  // 提取文档标题/名称
  const docTitleMatch = text.match(/标题[为是：:]\s*([^，。！\n]+)/);
  if (docTitleMatch) parameters.title = docTitleMatch[1].trim();
  
  // 提取会议时间
  const timeMatch = text.match(/时间[为是：:]\s*([^，。！\n]+)/);
  if (timeMatch) parameters.time = timeMatch[1].trim();
  
  // 提取参会人
  const attendeeMatch = text.match(/参会人[为是：:]\s*([^，。！\n]+)/);
  if (attendeeMatch) parameters.attendees = attendeeMatch[1].trim().split(/[,，、]/).map(s => s.trim());
  
  return {
    intent: intentType,
    domains: domains.length > 0 ? domains : ['general'],
    parameters,
    priority: 'normal',
    rawText: text
  };
}

export { extractIntent, DOMAIN_KEYWORDS, INTENT_TYPES };
