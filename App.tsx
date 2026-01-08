
import React, { useState, useEffect, useRef } from 'react';
import { 
  FileStack, 
  Scissors, 
  FileArchive, 
  FileText, 
  Image as ImageIcon, 
  Cpu, 
  MessageSquare,
  ArrowRight,
  Upload,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Zap,
  Coffee,
  Languages,
  Copy,
  Check,
  Download,
  Trash2,
  Loader2,
  FileDown
} from 'lucide-react';
import { ToolType, PDFTool } from './types.ts';
import { summarizePDF, chatWithPDF } from './services/geminiService.ts';
import { translations } from './translations.ts';

type Language = 'ar' | 'en';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ar');
  const [selectedTool, setSelectedTool] = useState<ToolType | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [chatQuery, setChatQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = { ...translations[lang], dir: lang === 'ar' ? 'rtl' : 'ltr' };

  useEffect(() => {
    document.documentElement.dir = t.dir;
    document.documentElement.lang = lang;
  }, [lang, t.dir]);

  const tools: PDFTool[] = [
    { id: 'merge', title: t.tool_merge, description: t.tool_merge_desc, icon: <FileStack className="w-8 h-8"/>, color: 'bg-red-600' },
    { id: 'split', title: t.tool_split, description: t.tool_split_desc, icon: <Scissors className="w-8 h-8"/>, color: 'bg-rose-500' },
    { id: 'compress', title: t.tool_compress, description: t.tool_compress_desc, icon: <FileArchive className="w-8 h-8"/>, color: 'bg-red-500' },
    { id: 'pdf-to-word', title: t.tool_pdf_word, description: t.tool_pdf_word_desc, icon: <FileText className="w-8 h-8"/>, color: 'bg-rose-600' },
    { id: 'word-to-pdf', title: t.tool_word_pdf, description: t.tool_word_pdf_desc, icon: <FileText className="w-8 h-8"/>, color: 'bg-red-700' },
    { id: 'pdf-to-jpg', title: t.tool_pdf_jpg, description: t.tool_pdf_jpg_desc, icon: <ImageIcon className="w-8 h-8"/>, color: 'bg-rose-700' },
    { id: 'ai-summarize', title: t.tool_ai_sum, description: t.tool_ai_sum_desc, icon: <Cpu className="w-8 h-8"/>, color: 'bg-slate-900' },
    { id: 'ai-chat', title: t.tool_ai_chat, description: t.tool_ai_chat_desc, icon: <MessageSquare className="w-8 h-8"/>, color: 'bg-slate-800' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (selectedTool === 'merge') {
        setFiles(prev => [...prev, ...newFiles]);
      } else {
        setFiles(newFiles.slice(0, 1));
      }
      setResult(null);
      setDownloadUrl(null);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    if (files.length <= 1) {
      setDownloadUrl(null);
      setResult(null);
    }
  };

  const processTool = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setResult(null);
    setDownloadUrl(null);

    try {
      if (selectedTool === 'ai-summarize') {
        const prompt = lang === 'ar' ? "يرجى تلخيص محتوى هذا الملف بشكل مفصل." : "Please summarize the content of this file in detail.";
        const summary = await summarizePDF(files[0].name, prompt);
        setResult(summary || t.success);
      } else {
        // محاكاة عملية معالجة الملفات لإنتاج رابط تحميل
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // إنشاء رابط تحميل وهمي لملف PDF "معالج"
        const blob = new Blob(["Processed PDF Content"], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setResult(t.download_ready);
      }
    } catch (error) {
      console.error(error);
      setResult(lang === 'ar' ? "حدث خطأ أثناء المعالجة." : "Error during processing.");
    } finally {
      setProcessing(false);
    }
  };

  const handleChat = async () => {
    if (!chatQuery.trim() || files.length === 0) return;
    const userMsg = chatQuery;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatQuery('');
    
    setProcessing(true);
    try {
      const aiResponse = await chatWithPDF(userMsg, files[0].name, "Document context placeholder...");
      setChatHistory(prev => [...prev, { role: 'ai', text: aiResponse || (lang === 'ar' ? "لم أتمكن من استيعاب الملف." : "Could not process file.") }]);
    } catch (e) {
      setChatHistory(prev => [...prev, { role: 'ai', text: "Error connection." }]);
    } finally {
      setProcessing(false);
    }
  };

  const totalSize = (files.reduce((acc, f) => acc + f.size, 0) / (1024 * 1024)).toFixed(2);

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 ${t.dir}`}>
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-200">
              <FileDown className="text-white w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold text-slate-900 leading-tight">
                {lang === 'ar' ? <>نخبة الـ <span className="text-brand-600">PDF</span></> : <><span className="text-brand-600">PDF</span> Elite</>}
              </span>
              <span className="text-[10px] uppercase tracking-tighter text-slate-400 font-bold">{t.no_subscription}</span>
            </div>
          </div>
          
          <button 
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 rounded-full text-sm font-bold hover:bg-slate-200 transition-all border border-slate-200"
          >
            <Languages className="w-4 h-4 text-brand-600" />
            <span>{t.lang_btn}</span>
          </button>
        </div>
      </header>

      <main className="flex-grow">
        {!selectedTool ? (
          <>
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-28">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand-50 rounded-full blur-[120px] opacity-40 -z-10"></div>
              <div className="max-w-4xl mx-auto px-4 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100 text-brand-700 text-sm font-bold mb-8 animate-bounce">
                  <Zap className="w-4 h-4" /> {t.free_tag}
                </div>
                <h1 className="text-5xl md:text-7xl font-[800] text-slate-900 mb-8 leading-[1.15]">
                  {t.hero_title}
                </h1>
                <p className="text-xl text-slate-600 mb-12 leading-relaxed max-w-2xl mx-auto">
                  {t.hero_desc}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a href="#tools" className="bg-brand-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-brand-700 transition-all shadow-xl shadow-brand-200 flex items-center gap-3 transform hover:-translate-y-1">
                    {t.explore_tools} <ArrowRight className={`w-6 h-6 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                  </a>
                </div>
              </div>
            </section>

            {/* Tools Grid */}
            <section id="tools" className="max-w-7xl mx-auto px-4 py-20">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-extrabold text-slate-900 mb-4">{t.free_tools_title}</h2>
                <div className="h-1.5 w-24 bg-brand-600 mx-auto rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {tools.map(tool => (
                  <div 
                    key={tool.id}
                    onClick={() => { setSelectedTool(tool.id); setFiles([]); setResult(null); setDownloadUrl(null); }}
                    className="group bg-white p-8 rounded-[2rem] border border-slate-100 hover:border-brand-100 transition-all cursor-pointer pdf-card-shadow flex flex-col items-center text-center relative overflow-hidden transform hover:-translate-y-2"
                  >
                    <div className={`w-16 h-16 ${tool.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                      {tool.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{tool.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{tool.description}</p>
                    <div className="mt-6 text-brand-600 font-bold text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {lang === 'ar' ? 'ابدأ الآن' : 'Start Now'} <ChevronLeft className={`w-4 h-4 ${lang === 'en' ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          /* Tool View */
          <div className="max-w-4xl mx-auto px-4 py-12 fade-in">
            <button 
              onClick={() => { setSelectedTool(null); setFiles([]); setResult(null); setChatHistory([]); }}
              className="mb-8 inline-flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors font-bold text-lg"
            >
              <ArrowRight className={`w-6 h-6 ${lang === 'ar' ? 'rotate-0' : 'rotate-180'}`} /> {t.back_to_tools}
            </button>

            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
              <header className="bg-slate-50/50 p-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{tools.find(t => t.id === selectedTool)?.title}</h1>
                  <p className="text-slate-500 font-medium">{tools.find(t => t.id === selectedTool)?.description}</p>
                </div>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${tools.find(t => t.id === selectedTool)?.color}`}>
                  {tools.find(t => t.id === selectedTool)?.icon}
                </div>
              </header>

              <div className="p-10">
                {/* Upload Area */}
                <div 
                  className={`border-4 border-dashed rounded-[2rem] p-12 transition-all text-center relative
                    ${files.length > 0 ? 'border-brand-200 bg-brand-50/20' : 'border-slate-100 bg-slate-50 hover:border-brand-300 hover:bg-brand-50/10'}`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple={selectedTool === 'merge'}
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto transition-transform ${files.length > 0 ? 'bg-brand-600 text-white scale-110' : 'bg-brand-100 text-brand-600'}`}>
                    {files.length > 0 ? <CheckCircle className="w-10 h-10" /> : <Upload className="w-10 h-10" />}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{t.upload_title}</h3>
                  <p className="text-slate-400 font-medium">{t.upload_desc}</p>
                </div>

                {/* File List for Merging */}
                {files.length > 0 && (
                  <div className="mt-10 space-y-4">
                    <div className="flex justify-between items-center px-2 mb-4">
                      <span className="text-slate-500 font-bold text-sm uppercase tracking-wider">
                        {t.total_files}: <span className="text-brand-600">{files.length}</span>
                      </span>
                      <span className="text-slate-500 font-bold text-sm uppercase tracking-wider">
                        {t.total_size}: <span className="text-brand-600">{totalSize} MB</span>
                      </span>
                    </div>
                    
                    <div className="max-h-60 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                      {files.map((file, idx) => (
                        <div key={idx} className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center justify-between shadow-sm group hover:border-brand-200 transition-colors">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-brand-50 group-hover:text-brand-600">
                              <FileText className="w-6 h-6" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-800 truncate text-sm">{file.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => removeFile(idx)}
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    {!downloadUrl && (
                      <button 
                        onClick={processTool}
                        disabled={processing}
                        className={`w-full py-5 rounded-2xl font-extrabold text-xl text-white shadow-xl transition-all flex items-center justify-center gap-3
                          ${processing ? 'bg-slate-300 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700 shadow-brand-200 transform hover:-translate-y-1'}`}
                      >
                        {processing ? <><Loader2 className="w-6 h-6 animate-spin" /> {t.processing}</> : t.start_processing}
                      </button>
                    )}

                    {/* Result and Download Section */}
                    {result && selectedTool !== 'ai-chat' && (
                      <div className="mt-8 bg-emerald-50 border border-emerald-100 rounded-[2rem] p-8 fade-in text-center">
                        <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
                          <Check className="w-10 h-10" />
                        </div>
                        <h4 className="text-2xl font-bold text-emerald-900 mb-2">{result}</h4>
                        <p className="text-emerald-600/70 font-medium mb-8">{t.secure_notice}</p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          {downloadUrl && (
                            <a 
                              href={downloadUrl} 
                              download={`elite-pdf-${Date.now()}.pdf`}
                              className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-extrabold text-xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 transform hover:-translate-y-1"
                            >
                              <Download className="w-6 h-6" /> {t.download_btn}
                            </a>
                          )}
                          {selectedTool === 'ai-summarize' && (
                            <button 
                              onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(()=>setCopied(false), 2000); }}
                              className="bg-white border-2 border-emerald-600 text-emerald-600 px-8 py-5 rounded-2xl font-bold text-lg hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
                            >
                              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                              {copied ? (lang === 'ar' ? 'تم النسخ' : 'Copied') : (lang === 'ar' ? 'نسخ الملخص' : 'Copy Summary')}
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* AI Chat Interface */}
                    {selectedTool === 'ai-chat' && (
                      <div className="mt-8 space-y-4">
                        <div className="h-96 overflow-y-auto bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-4 custom-scrollbar">
                          {chatHistory.length === 0 && (
                            <div className="text-slate-300 text-center py-20">
                              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-10" />
                              <p className="font-bold text-lg">{t.chat_start}</p>
                            </div>
                          )}
                          {chatHistory.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[85%] px-5 py-3.5 rounded-2xl shadow-sm text-sm leading-relaxed ${msg.role === 'user' ? 'bg-brand-600 text-white rounded-tl-none' : 'bg-white border border-slate-100 text-slate-800 rounded-tr-none'}`}>
                                {msg.text}
                              </div>
                            </div>
                          ))}
                          {processing && <div className="text-brand-500 animate-pulse text-xs font-bold flex items-center gap-2 px-2">
                            <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-ping"></div> {t.ai_thinking}
                          </div>}
                        </div>
                        <div className="flex gap-3">
                          <input 
                            type="text" 
                            value={chatQuery}
                            onChange={(e) => setChatQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleChat()}
                            placeholder={t.chat_placeholder}
                            className="flex-grow bg-white border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 shadow-sm transition-all"
                          />
                          <button 
                            onClick={handleChat}
                            disabled={!chatQuery.trim() || processing}
                            className="bg-brand-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center hover:bg-brand-700 transition-all shadow-lg shadow-brand-100 disabled:opacity-40"
                          >
                            <MessageSquare className="w-7 h-7" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="bg-slate-50 p-6 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-400 font-medium flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {t.delete_notice}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Donation Section */}
      {!selectedTool && (
        <section className="max-w-7xl mx-auto px-4 py-20">
          <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden text-center md:text-right flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/20 blur-[100px] rounded-full"></div>
            <div className="relative z-10 flex-1">
              <span className="inline-block px-4 py-1.5 bg-brand-600 text-white text-xs font-bold rounded-full mb-6">{t.donation_tag}</span>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6">{t.donation_title}</h2>
              <p className="text-slate-400 text-lg md:text-xl max-w-xl">
                {t.donation_desc}
              </p>
            </div>
            <div className="relative z-10">
              <a 
                href="https://buymeacoffee.com/guidai" 
                target="_blank" 
                className="bg-white text-slate-900 px-12 py-6 rounded-[2rem] font-black text-2xl hover:bg-brand-50 transition-all flex items-center gap-4 shadow-2xl group"
              >
                {t.donation_btn}
                <Coffee className="w-8 h-8 text-brand-600 group-hover:rotate-12 transition-transform" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Simple Footer */}
      <footer className="py-12 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 opacity-50 grayscale">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <FileDown className="text-white w-5 h-5" />
            </div>
            <span className="font-black text-slate-900">{t.brand}</span>
          </div>
          <p className="text-slate-400 text-sm font-medium text-center">
            {t.copyright} <br className="sm:hidden" /> {t.secure_notice}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
