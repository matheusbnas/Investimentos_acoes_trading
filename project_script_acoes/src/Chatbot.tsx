// Chatbot.tsx
import { useState, useRef, useEffect } from 'react';
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const Chatbot = ({ indicators, darkMode }) => {
  const [messages, setMessages] = useState<Array<{ type: string; content: string }>>([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const llm = new ChatOpenAI({
    openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
    temperature: 0.7,
    modelName: "gpt-3.5-turbo"
  });

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getTechnicalAnalysis = async (userInput: string) => {
    const analysisPrompt = `
      Você é um especialista em análise técnica de ações. Use estes indicadores:
      RSI: ${indicators?.rsi?.toFixed(2) || 'N/A'}
      MA20: ${indicators?.ma20?.toFixed(2) || 'N/A'}
      MA50: ${indicators?.ma50?.toFixed(2) || 'N/A'}
      MA100: ${indicators?.ma100?.toFixed(2) || 'N/A'}

      Responda em português brasileiro de forma clara e técnica. Seja conciso e inclua:
      1. Análise dos indicadores atuais
      2. Recomendações de operação
      3. Alertas de risco

      Pergunta do usuário: ${userInput}
    `;

    try {
      const response = await llm.invoke([
        new SystemMessage(analysisPrompt),
        new HumanMessage(userInput)
      ]);
      
      return response.content.toString();
    } catch (error) {
      console.error("Erro na análise:", error);
      return "Desculpe, ocorreu um erro na análise. Tente novamente mais tarde.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const aiResponse = await getTechnicalAnalysis(input);
      const botMessage = { type: 'bot', content: aiResponse };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`mt-8 p-6 rounded-lg shadow transition-colors duration-300 ${
      darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'
    }`}>
      <h2 className="text-xl font-semibold mb-4">Assistente de Trading AI</h2>
      
      <div className={`h-64 overflow-y-auto mb-4 p-3 rounded-lg ${
        darkMode ? 'bg-gray-700' : 'bg-gray-50'
      }`}>
        {messages.map((msg, index) => (
          <div key={index} className={`mb-3 p-3 rounded-lg ${msg.type === 'user' ? 
            (darkMode ? 'bg-gray-600' : 'bg-indigo-100') : 
            (darkMode ? 'bg-gray-900' : 'bg-white border')}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {msg.type === 'user' ? 'Você:' : 'Assistente:'}
            </p>
            <p className="text-sm">{msg.content}</p>
          </div>
        ))}
        {loading && <p className="text-sm text-gray-500">Analisando...</p>}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Faça uma pergunta sobre análise técnica..."
          className={`flex-1 p-2 rounded-md text-sm ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'border-gray-300 bg-white'
          }`}
        />
        <button
          type="submit"
          className={`px-4 py-2 rounded-md text-sm ${
            darkMode 
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default Chatbot;