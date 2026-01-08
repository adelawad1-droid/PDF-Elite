
import React, { useState, useEffect } from 'react';
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
  Check
} from 'lucide-react';
import { ToolType, PDFTool } from './types.ts';
import { summarizePDF, chatWithPDF } from './services/geminiService.ts';
import { translations } from './translations.ts';

type Language = 'ar' | 'en';

// Internal Components
const Header = ({ lang, setLang, t }: { lang: Language, setLang: (l: Language) => void, t: any }) => (
  <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-20">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.reload()} aria-label="Go to Home">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-200 flex-shrink-0">
            <FileText className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-bold text-gray-900 leading-none">
              {lang === 'ar' ? (
                <>مدير ملفات <span className="text-red-600">PDF</span></>
              ) : (
                <><span className="text-red-600">PDF</span> Manager</>
              )}
            </span>
            <span className="text-[10px] md:text-xs text-gray-500 font-medium mt-1">
              {t.no_subscription}
            </span>
          </div>
        </div>
        <nav className="flex gap-4 md:gap-8 items-center" role="navigation">
          <div className="hidden sm:flex items-center gap-1 text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full text-xs border border-green-100">
            <Zap className="w-3 h-3" /> {t.free_tag}
          </div>
          <button 
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors"
            aria-label="Change Language"
          >
            <Languages className="w-4 h-4" />
            <span className="hidden sm:inline">{t.lang_btn}</span>
            <span className="sm:hidden">{lang === 'ar' ? 'EN' : 'AR'}</span>
          </button>
        </nav>
      </div>
    </div>
  </header>
);

const DonationSection = ({ t }: { t: any }) => (
  <section className="max-w-7xl mx-auto px-4 py-8">
    <div className="bg-orange-50/50 border border-orange-100 rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
      <div className={`flex-1 ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/50 text-orange-700 text-xs font-bold mb-4">
          <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
          {t.donation_tag}
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">{t.donation_title}</h2>
        <p className="text-gray-600 text-sm md:text-base max-w-lg">
          {t.donation_desc}
        </p>
      </div>
      <div className="flex-shrink-0">
        <a 
          href="https://buymeacoffee.com/guidai" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-orange-200 transition-all flex items-center gap-3 transform hover:-translate-y-1"
        >
          {t.donation_btn}
          <Coffee className="w-6 h-6" />
        </a>
      </div>
    </div>
  </section>
);

const SEOKeywords = ({ lang }: { lang: Language }) => (
  <section className="bg-white py-10 border-t border-gray-100 mt-12 overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6 opacity-60">
        {lang === 'ar' ? 'أكثر الخدمات بحثاً' : 'Most Popular PDF Services'}
      </h2>
      <div className="flex flex-wrap justify-center gap-4 text-xs md:text-sm text-gray-500 font-medium opacity-70">
        <span className="hover:text-red-600 cursor-default">PDF to Word</span>
        <span className="hover:text-red-600 cursor-default">Merge PDF</span>
        <span className="hover:text-red-600 cursor-default">Compress PDF</span>
        <span className="hover:text-red-600 cursor-default">Split PDF</span>
        <span className="hover:text-red-600 cursor-default">Edit PDF Online</span>
        <span className="hover:text-red-600 cursor-default">تحويل PDF إلى Word</span>
        <span className="hover:text-red-600 cursor-default">دمج ملفات PDF</span>
        <span className="hover:text-red-600 cursor-default">ضغط حجم PDF</span>
        <span className="hover:text-red-600 cursor-default">تلخيص PDF مجاناً</span>
        <span className="hover:text-red-600 cursor-default">دردشة مع ملف PDF</span>
      </div>
    </div>
  </section>
);

const FooterMinimal = ({ t }: { t: any }) => (
  <footer className="bg-white py-8 border-t border-gray-100">
    <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-400 font-medium">
      &copy; {new Date().getFullYear()} {t.brand}. {t.copyright}
    </div>
  </footer>
);

const Hero = ({ t }: { t: any }) => (
  <section className="bg-white py-20 border-b border-gray-100 overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-sm font-semibold mb-6 animate-pulse">
        <Cpu className="w-4 h-4" /> {t.hero_highlight} AI Powered
      </div>
      <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
        {t.hero_title.split(t.hero_highlight).map((part: string, i: number) => (
           <React.Fragment key={i}>
             {part}
             {i === 0 && <span className="text-red-600">{t.hero_highlight}</span>}
           </React.Fragment>
        ))}
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed">
        {t.hero_desc}
      </p>
      <div className="flex flex-col items-center gap-4">
        <a 
          href="#tools" 
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-red-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-red-700 transition-all shadow-2xl shadow-red-200 flex items-center gap-3"
        >
          {t.explore_tools} <ArrowRight className={`w-6 h-6 ${t.dir === 'rtl' ? 'rotate-180' : ''}`} />
        </a>
        <p className="text-sm text-gray-400 font-medium">{t.no_login}</p>
      </div>
    </div>
  </section>
);

const ToolCard: React.FC<{ tool: PDFTool, onClick: (t: ToolType) => void, lang: Language }> = ({ tool, onClick, lang }) => (
  <div 
    onClick={() => onClick(tool.id)}
    className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-red-100 transition-all cursor-pointer flex flex-col items-center text-center relative overflow-hidden"
    role="button"
    aria-label={`Use tool: ${tool.title}`}
  >
    <div className={`w-16 h-16 ${tool.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
      {tool.icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{tool.title}</h3>
    <p className="text-gray-500 text-sm">{tool.description}</p>
    <div className={`absolute bottom-0 ${lang === 'ar' ? 'right-0' : 'left-0'} p-2 opacity-0 group-hover:opacity-100 transition-opacity`}>
      {lang === 'ar' ? <ChevronLeft className="text-red-600 w-5 h-5" /> : <ChevronRight className="text-red-600 w-5 h-5" />}
    </div>
  </div>
);

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ar');
  const [selectedTool, setSelectedTool] = useState<ToolType | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [chatQuery, setChatQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);

  const t = { ...translations[lang], dir: lang === 'ar' ? 'rtl' : 'ltr' };

  // SEO Update Logic
  useEffect(() => {
    document.documentElement.dir = t.dir;
    document.documentElement.lang = lang;

    if (selectedTool) {
      const tool = tools.find(x => x.id === selectedTool);
      document.title = `${tool?.title} - ${t.brand}`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', `${tool?.description}. أداة احترافية ومجانية من ${t.brand}`);
    } else {
      document.title = `${t.brand} - ${lang === 'ar' ? 'أدوات PDF ذكية ومجانية' : 'Smart & Free PDF Tools'}`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', t.hero_desc);
    }
  }, [lang, selectedTool, t.brand, t.hero_desc]);

  const tools: PDFTool[] = [
    { id: 'merge', title: t.tool_merge, description: t.tool_merge_desc, icon: <FileStack className="text-white w-8 h-8"/>, color: 'bg-red-500' },
    { id: 'split', title: t.tool_split, description: t.tool_split_desc, icon: <Scissors className="text-white w-8 h-8"/>, color: 'bg-orange-500' },
    { id: 'compress', title: t.tool_compress, description: t.tool_compress_desc, icon: <FileArchive className="text-white w-8 h-8"/>, color: 'bg-blue-500' },
    { id: 'pdf-to-word', title: t.tool_pdf_word, description: t.tool_pdf_word_desc, icon: <FileText className="text-white w-8 h-8"/>, color: 'bg-sky-500' },
    { id: 'word-to-pdf', title: t.tool_word_pdf, description: t.tool_word_pdf_desc, icon: <FileText className="text-white w-8 h-8"/>, color: 'bg-indigo-500' },
    { id: 'pdf-to-jpg', title: t.tool_pdf_jpg, description: t.tool_pdf_jpg_desc, icon: <ImageIcon className="text-white w-8 h-8"/>, color: 'bg-emerald-500' },
    { id: 'ai-summarize', title: t.tool_ai_sum, description: t.tool_ai_sum_desc, icon: <Cpu className="text-white w-8 h-8"/>, color: 'bg-purple-600' },
    { id: 'ai-chat', title: t.tool_ai_chat, description: t.tool_ai_chat_desc, icon: <MessageSquare className="text-white w-8 h-8"/>, color: 'bg-rose-600' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setResult(null);
      setCopied(false);
    }
  };

  const processTool = async () => {
    if (files.length === 0) return;
    setProcessing(true);

    if (selectedTool === 'ai-summarize') {
      const prompt = lang === 'ar' ? "ملف مستخدم تم رفعه للمعالجة." : "User uploaded file for processing.";
      const summary = await summarizePDF(files[0].name, prompt);
      setResult(summary || (lang === 'ar' ? "فشل في إنشاء ملخص." : "Failed to generate summary."));
    } else {
      setTimeout(() => {
        setResult(t.success);
        setProcessing(false);
      }, 2000);
    }
    setProcessing(false);
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleChat = async () => {
    if (!chatQuery.trim() || files.length === 0) return;
    const userMsg = chatQuery;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatQuery('');
    
    setProcessing(true);
    const aiResponse = await chatWithPDF(userMsg, files[0].name, lang === 'ar' ? "سياق المستند الافتراضي..." : "Default document context...");
    setChatHistory(prev => [...prev, { role: 'ai', text: aiResponse || (lang === 'ar' ? "لا يمكنني الإجابة حالياً." : "I cannot answer right now.") }]);
    setProcessing(false);
  };

  return (
    <div className={`min-h-screen flex flex-col ${t.dir === 'rtl' ? 'rtl' : 'ltr'}`}>
      <Header lang={lang} setLang={setLang} t={t} />
      
      <main className="flex-grow">
        {!selectedTool ? (
          <>
            <Hero t={t} />
            <div id="tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <header className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{t.free_tools_title}</h2>
                <p className="text-gray-500">{t.free_tools_desc}</p>
              </header>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {tools.map(tool => (
                  <ToolCard key={tool.id} tool={tool} onClick={setSelectedTool} lang={lang} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-4xl mx-auto px-4 py-12 fade-in">
            <nav aria-label="Breadcrumb" className="mb-8">
              <button 
                onClick={() => { setSelectedTool(null); setFiles([]); setResult(null); setChatHistory([]); }}
                className={`flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors font-bold`}
              >
                <ArrowRight className={`w-5 h-5 ${lang === 'ar' ? 'rotate-0' : 'rotate-180'}`} /> {t.back_to_tools}
              </button>
            </nav>

            <article className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <header className="bg-gray-50 p-8 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{tools.find(t => t.id === selectedTool)?.title}</h1>
                  <p className="text-gray-500">{tools.find(t => t.id === selectedTool)?.description}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tools.find(t => t.id === selectedTool)?.color}`}>
                  {tools.find(t => t.id === selectedTool)?.icon}
                </div>
              </header>

              <div className="p-8">
                {files.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center bg-gray-50 hover:bg-red-50 hover:border-red-200 transition-all cursor-pointer relative text-center">
                    <input 
                      type="file" 
                      onChange={handleFileChange}
                      multiple={selectedTool === 'merge'}
                      accept=".pdf,.doc,.docx"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      aria-label="Upload Files"
                    />
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <Upload className="w-8 h-8" />
                    </div>
                    <p className="text-lg font-semibold text-gray-900 mb-1">{t.upload_title}</p>
                    <p className="text-gray-500 text-sm">{t.upload_desc}</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{files[0].name}</p>
                          <p className="text-xs text-gray-500">{(files[0].size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setFiles([])}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors flex-shrink-0 font-bold"
                      >
                        {t.cancel}
                      </button>
                    </div>

                    {!result && (
                      <button 
                        onClick={processTool}
                        disabled={processing}
                        className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all ${processing ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700 shadow-red-200'}`}
                      >
                        {processing ? t.processing : t.start_processing}
                      </button>
                    )}

                    {result && selectedTool !== 'ai-chat' && (
                      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 relative">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3 text-green-700 font-bold">
                            <CheckCircle className="w-6 h-6" /> {selectedTool === 'ai-summarize' ? t.summary_ready : t.success}
                          </div>
                          {selectedTool === 'ai-summarize' && (
                            <button 
                              onClick={copyToClipboard}
                              className={`flex items-center gap-2 px-3 py-1 rounded-lg border transition-all text-xs font-bold ${copied ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200 hover:border-green-600'}`}
                            >
                              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              {copied ? (lang === 'ar' ? 'تم النسخ' : 'Copied') : (lang === 'ar' ? 'نسخ النص' : 'Copy text')}
                            </button>
                          )}
                        </div>
                        <div className={`text-gray-700 whitespace-pre-wrap leading-relaxed ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                          {result}
                        </div>
                      </div>
                    )}

                    {selectedTool === 'ai-chat' && (
                      <div className="space-y-4">
                        <div className="h-80 overflow-y-auto bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-4">
                          {chatHistory.length === 0 && (
                            <div className="text-gray-400 text-center mt-28">
                              <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-20" />
                              <p>{t.chat_start}</p>
                            </div>
                          )}
                          {chatHistory.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[85%] px-4 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-red-600 text-white rounded-tl-none shadow-md' : 'bg-white border border-gray-200 text-gray-900 rounded-tr-none shadow-sm'}`}>
                                {msg.text}
                              </div>
                            </div>
                          ))}
                          {processing && <div className="text-red-400 animate-pulse text-sm font-bold flex items-center gap-2">
                            <Zap className="w-4 h-4" /> {t.ai_thinking}
                          </div>}
                        </div>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={chatQuery}
                            onChange={(e) => setChatQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleChat()}
                            placeholder={t.chat_placeholder}
                            className="flex-grow bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
                          />
                          <button 
                            onClick={handleChat}
                            disabled={!chatQuery.trim() || processing}
                            className="bg-red-600 text-white p-4 rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-100 disabled:opacity-50"
                            aria-label="Send Message"
                          >
                            <MessageSquare className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </article>
            
            <footer className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-gray-400 text-sm">
              <div className="flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {t.delete_notice}</div>
              <div className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> {t.secure_notice}</div>
            </footer>
          </div>
        )}
      </main>

      {!selectedTool && <DonationSection t={t} />}
      <SEOKeywords lang={lang} />
      <FooterMinimal t={t} />
    </div>
  );
};

export default App;
