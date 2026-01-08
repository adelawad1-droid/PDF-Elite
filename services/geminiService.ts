
import { GoogleGenAI } from "@google/genai";

// Always initialize the client using a named parameter and the API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const summarizePDF = async (fileName: string, contentDescription: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `قم بتلخيص هذا الملف المسمى "${fileName}". وصف الملف هو: ${contentDescription}. قدم التلخيص باللغة العربية بشكل نقاط احترافية.`,
      config: {
        systemInstruction: "أنت خبير في تحليل المستندات. قدم ملخصات دقيقة ومفيدة باللغة العربية."
      }
    });
    // Access response.text directly as a property as per guidelines
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "عذراً، حدث خطأ أثناء محاولة تلخيص الملف.";
  }
};

export const chatWithPDF = async (query: string, fileName: string, context: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `بناءً على المستند "${fileName}" والمحتوى التالي: "${context}"، أجب على السؤال: ${query}`,
      config: {
        systemInstruction: "أنت مساعد ذكي يساعد المستخدمين في فهم ملفات PDF الخاصة بهم. أجب دائماً بالعربية."
      }
    });
    // Access response.text directly as a property as per guidelines
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "حدث خطأ أثناء التواصل مع الذكاء الاصطناعي.";
  }
};