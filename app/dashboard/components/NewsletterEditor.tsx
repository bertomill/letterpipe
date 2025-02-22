'use client';

import { useState } from 'react';
import { db } from '../../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

export default function NewsletterEditor() {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState('');
  const [aiMessage, setAiMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');

  const handleAiSubmit = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      const results = await searchContent(prompt);
      const aiResponse = await queryAI(results, prompt);
      setAiMessage(aiResponse);
    } catch (error) {
      console.error('Error:', error);
      setAiMessage('Sorry, there was an error processing your request.');
    }
    setLoading(false);
    setPrompt('');
  };

  const searchContent = async (searchTerm: string) => {
    if (!user) return [];
    
    try {
      const contentRef = collection(db, 'content');
      const q = query(
        contentRef,
        where('userId', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs
        .map(doc => doc.data())
        .filter(content => 
          content.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          content.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          content.notes?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    } catch (error) {
      console.error('Error searching content:', error);
      return [];
    }
  };

  interface ContentResult {
    title?: string;
    content?: string;
    notes?: string;
    url?: string;
    articleDate?: string;
  }

  const queryAI = async (results: ContentResult[], prompt: string) => {
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          results,
          prompt,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error querying AI:', error);
      return 'Error querying AI.';
    }
  };

  const handleGuideMe = async () => {
    setLoading(true);
    try {
      const aiResponse = await queryAI([], "Let's write a newsletter together. What topic would you like to write about? I'll help guide you through the process step by step.");
      setAiMessage(aiResponse);
    } catch (error) {
      console.error('Error:', error);
      setAiMessage('Sorry, there was an error starting the guide.');
    }
    setLoading(false);
  };

  const handleContentSummary = async () => {
    setLoading(true);
    try {
      // Query content from the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const contentRef = collection(db, 'content');
      const q = query(
        contentRef,
        where('userId', '==', user?.uid),
        where('createdAt', '>=', sevenDaysAgo)
      );
      
      const querySnapshot = await getDocs(q);
      const recentContent = querySnapshot.docs.map(doc => doc.data());

      const aiResponse = await queryAI(recentContent, 
        "Please analyze this content I've collected in the last week. Provide a summary of the main themes and suggest potential newsletter topics based on this content."
      );
      
      setAiMessage(aiResponse);
    } catch (error) {
      console.error('Error:', error);
      setAiMessage('Sorry, there was an error summarizing your content.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Editor */}
        <div className="flex-1 space-y-6">
          {/* Rough Notes Section */}
          <div className="bg-white rounded-lg">
            <div className="px-4 py-5">
              <div className="mb-4">
                <label className="text-sm text-gray-600">
                  Newsletter Outline
                </label>
                <div className="mt-1">
                  <textarea
                    rows={6}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-1 block w-full border rounded-md px-3 py-2 text-sm text-gray-900"
                    placeholder="Write your outline, key points, and rough notes here..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Newsletter Editor */}
          <div className="bg-white rounded-lg">
            <div className="px-4 py-5">
              <div className="mb-4">
                <label className="text-sm text-gray-600">
                  Write your newsletter
                </label>
                <div className="mt-1">
                  <textarea
                    rows={20}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="mt-1 block w-full border rounded-md px-3 py-2 text-sm text-gray-900"
                    placeholder="Start writing your newsletter..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Assistant Sidebar */}
        <div className="w-full lg:w-96">
          <div className="bg-white rounded-lg">
            <div className="px-4 py-5">
              <h3 className="text-lg font-medium text-gray-900">AI Assistant</h3>
              
              {/* Quick Actions */}
              <div className="mt-4 space-y-2">
                <button
                  onClick={handleGuideMe}
                  disabled={loading}
                  className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-sm transition-colors"
                >
                  🚀 Walk me through writing this newsletter
                </button>
                <button
                  onClick={handleContentSummary}
                  disabled={loading}
                  className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-sm transition-colors"
                >
                  📚 Summarize my recent content
                </button>
              </div>

              {/* Existing AI chat interface */}
              <div className="mt-4 space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    {aiMessage || "Hi! I'm your AI assistant. I can help you write your newsletter by referencing your saved content. Choose a quick action above or ask me anything below."}
                  </p>
                </div>
                <div className="mt-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAiSubmit()}
                      className="block w-full border rounded-md px-3 py-2 text-sm text-gray-900"
                      placeholder="Ask me anything..."
                    />
                    <button
                      onClick={handleAiSubmit}
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm disabled:bg-blue-300"
                    >
                      {loading ? '...' : 'Send'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 