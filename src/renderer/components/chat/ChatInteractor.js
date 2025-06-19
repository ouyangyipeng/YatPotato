import OpenAI from 'openai';
import { getAllInteractorDescriptions } from '../../../interactor/GeneralInteractor.js';

// 在实际应用中，请确保您的API密钥是安全存储的，例如通过环境变量。

const dataStorage = await window.DataStorage.loadDataStorage("ds-test");
const KEY = await dataStorage.load('KEY');

const openai = new OpenAI({
  baseURL: "https://api.siliconflow.cn/v1",
//   model: "Qwen/Qwen3-30B-A3B",
  apiKey: KEY,
  dangerouslyAllowBrowser: true
});

// 辅助函数：将图片转换为 base64（通过主进程）
const imageToBase64 = async (imagePath) => {
  try {
    const { base64, mimeType } = await window.electron.readImageFile(imagePath);
    return `data:${mimeType};base64,${base64}`;  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
};

const getAIResponse = async (messages, imagePath = null) => {
  const currentDate = new Date().toLocaleString();
  // 在这里填写你的系统提示词
  const systemPrompt = `这是一个番茄钟智能计划助手软件，YatPotato! 而你是它的智能助手，你将和用户对话，帮助他解决问题。
  对于用户的问题和对话，你要尽可能利用接口获取用户的数据形成量身定制的答案，也可以对用户做一些提醒有什么即将截止的事项。
  对于抽象的日期，比如下周几，转换为具体日期，包括加入日程的时候。
  对于任务，最好简明列出具体内容。
  当前时间: ${currentDate}
(可以使用markdown语法，可以用表情和图标)
下面是你回答的格式，你需要生成相应格式的json字符串，
不要把代码给到用户，尽可能向用户隐藏处理过程
{
  "call": [{
    "function": "函数名（字符串）",
    "args": ["参数1", "参数2", ...],
    } 
    ...
  ]
  
  "returnValueRequired": true 或 false 是否需要接收返回值, 
  "message": "需要发送给用户的文本"
  "messageRequired" : true 或 false 是否需要给用户发送信息。
}
以下是你可以调用的函数列表:\n${getAllInteractorDescriptions()}`; // <-- 在这里填写你的系统提示词

  try {
    // 处理消息，支持异步图片转换
    const processedMessages = await Promise.all(messages.map(async (msg) => {
      if (msg.image && msg.sender === 'user') {
        // 处理包含图片的用户消息
        const base64Image = await imageToBase64(msg.image);
        return {
          role: 'user',
          content: [
            {
              type: 'text',
              text: msg.text || '请分析这张图片'
            },
            {
              type: 'image_url',
              image_url: {
                url: base64Image
              }
            }
          ]
        };
      } else {
        // 处理普通文本消息
        return { 
          role: msg.sender === 'user' ? 'user' : 'assistant', 
          content: msg.text 
        };
      }
    }));

    // 如果系统提示词存在，则添加到消息列表的开头
    if (systemPrompt) {
      processedMessages.unshift({ role: 'system', content: systemPrompt });
    }

    const completion = await openai.chat.completions.create({
      baseURL: "https://api.siliconflow.cn/v1",
      model: "Qwen/Qwen2.5-VL-32B-Instruct",
      apiKey: KEY,
      dangerouslyAllowBrowser: true,
      messages: processedMessages,
      max_tokens: 1000,
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
    openImageDialog: () => window.electron.openImageDialog(),
  };
};

export const getInteractorDescription = () => {
  return `
    getAIResponse: (功能：获取AI的回复），参数列表： messages（对话历史）, imagePath（可选，图片路径） 返回值描述：返回AI的回复内容的字符串。
    openImageDialog: (功能：打开图片选择对话框），参数列表： 无 返回值描述：返回选中的图片文件路径字符串，如果取消则返回null。
  `;
};
