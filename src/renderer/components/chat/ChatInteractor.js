import OpenAI from 'openai';

// 在实际应用中，请确保您的API密钥是安全存储的，例如通过环境变量。
const openai = new OpenAI({
  baseURL: "https://api.siliconflow.cn/v1",
  model: "MiniMaxAI/MiniMax-M1-80k",
  apiKey: "sk-nsgzbpqyelmpmqtujpkudirrvxwaqlqrpepgsxqmgkdbppoq", // 请替换为您的OpenAI API密钥
  dangerouslyAllowBrowser: true
});

const getAIResponse = async (messages) => {
  try {
    const completion = await openai.chat.completions.create({
      baseURL: "https://api.siliconflow.cn/v1",
      model: "MiniMaxAI/MiniMax-M1-80k",
      apiKey: "sk-nsgzbpqyelmpmqtujpkudirrvxwaqlqrpepgsxqmgkdbppoq", 
      dangerouslyAllowBrowser: true,
      messages: messages.map(msg => ({ role: msg.sender === 'user' ? 'user' : 'assistant', content: msg.text })),
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
