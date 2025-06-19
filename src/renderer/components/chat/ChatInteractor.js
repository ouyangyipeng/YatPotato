import OpenAI from 'openai';

// 在实际应用中，请确保您的API密钥是安全存储的，例如通过环境变量。

const dataStorage = await window.DataStorage.loadDataStorage("ds-test");
const KEY = await dataStorage.load('KEY');

const openai = new OpenAI({
  baseURL: "https://api.siliconflow.cn/v1",
//   model: "Qwen/Qwen3-30B-A3B",
  apiKey: KEY,
  dangerouslyAllowBrowser: true
});

const getAIResponse = async (messages) => {
  // 在这里填写你的系统提示词
  const systemPrompt = `这是一个番茄钟智能计划助手软件，YatPotato! 而你是它的智能助手，你将和用户对话，帮助他解决问题。
(请不要使用markdown语法，可以用表情和图标)`; // <-- 在这里填写你的系统提示词

  try {
    const processedMessages = messages.map(msg => ({ role: msg.sender === 'user' ? 'user' : 'assistant', content: msg.text }));

    // 如果系统提示词存在，则添加到消息列表的开头
    if (systemPrompt) {
      processedMessages.unshift({ role: 'system', content: systemPrompt });
    }

    const completion = await openai.chat.completions.create({
      baseURL: "https://api.siliconflow.cn/v1",
      model: "deepseek-ai/DeepSeek-V3",
      apiKey: KEY,
      dangerouslyAllowBrowser: true,
      messages: processedMessages,
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
};

export const getInteractor = () => {
  return {
    getAIResponse,
  };
};

export const getInteractorDescription = () => {
  return `
    getAIResponse: (功能：获取AI的回复），参数列表： messages（对话历史） 返回值描述：返回AI的回复内容的字符串。
  `;
};
