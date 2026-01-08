
import { GoogleGenAI } from "@google/genai";

/**
 * Helper to get a fresh instance of Gemini API
 */
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure it is configured correctly.");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Summarizes PDF content using Gemini 3 Pro
 */
export const summarizePDF = async (fileName: string, contentDescription: string) => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `قم بتلخيص هذا الملف المسمى "${fileName}". وصف الملف هو: ${contentDescription}. قدم التلخيص باللغة العربية بشكل نقاط احترافية ومنظمة جداً، مع التركيز على النقاط الجوهرية.`,
      config: {
        systemInstruction: "أنت خبير في تحليل المستندات والذكاء الاصطناعي. مهمتك هي استخراج أدق التفاصيل وتقديم ملخصات تنفيذية عالية الجودة باللغة العربية."
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Summarization Error:", error);
    return "عذراً، حدث خطأ أثناء محاولة تلخيص الملف. يرجى التأكد من إعداد مفتاح API بشكل صحيح.";
  }
};

/**
 * Chat with PDF content using Gemini 3 Pro
 */
export const chatWithPDF = async (query: string, fileName: string, context: string) => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `بناءً على المستند "${fileName}" والمحتوى التالي: "${context}"، أجب على السؤال التالي بدقة: ${query}`,
      config: {
        systemInstruction: "أنت مساعد ذكي متخصص في فهم وتحليل ملفات PDF. أجب على أسئلة المستخدم بناءً على السياق المقدم فقط، وكن دقيقاً ومختصراً وباللغة العربية."
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "حدث خطأ أثناء التواصل مع الذكاء الاصطناعي. يرجى التأكد من صلاحية المفتاح والاتصال.";
  }
};
