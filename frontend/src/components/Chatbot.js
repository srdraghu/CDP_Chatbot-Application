import React, { useState } from "react";
import axios from "axios";
import { Send, MessageCircle } from "lucide-react";

const Chatbot = () => {
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const handleAsk = async () => {
        if (!question.trim()) return;
        const userMessage = { sender: "user", text: question };
        setMessages([...messages, userMessage]);

        try {
            const res = await axios.post("http://127.0.0.1:5000/ask", { question });
            const botMessage = { sender: "bot", text: res.data.answers[0]?.text || "Sorry, I don't have an answer." };
            setMessages([...messages, userMessage, botMessage]);
        } catch (error) {
            setMessages([...messages, userMessage, { sender: "bot", text: "Error retrieving answer." }]);
        }

        setQuestion("");
    };

    return (
        <div className="fixed bottom-5 right-5">
            {!isOpen ? (
                <button onClick={() => setIsOpen(true)} className="bg-blue-600 text-white p-3 rounded-full shadow-lg">
                    <MessageCircle size={24} />
                </button>
            ) : (
                <div className="bg-white shadow-lg rounded-xl w-80 p-4 border border-gray-300">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">CDP Chatbot</h2>
                        <button onClick={() => setIsOpen(false)} className="text-gray-500">✖</button>
                    </div>

                    <div className="h-60 overflow-y-auto my-3 p-2 border rounded bg-gray-100">
                        {messages.map((msg, index) => (
                            <div key={index} className={`my-1 p-2 rounded ${msg.sender === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-300 text-black self-start"}`}>
                                {msg.text}
                            </div>
                        ))}
                    </div>

                    <div className="flex">
                        <input 
                            className="w-full border p-2 rounded-l focus:outline-none"
                            value={question} 
                            onChange={(e) => setQuestion(e.target.value)} 
                            placeholder="Ask something..."
                        />
                        <button onClick={handleAsk} className="bg-blue-500 text-white p-2 rounded-r">
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
