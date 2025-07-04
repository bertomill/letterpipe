'use client';

import { useState, useRef, useEffect } from 'react';


export default function NewsletterEditor() {
  const [generatedBlog, setGeneratedBlog] = useState('');
  const [outline, setOutline] = useState('');
  const [roughNotes, setRoughNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecordingOutline, setIsRecordingOutline] = useState(false);
  const [isRecordingNotes, setIsRecordingNotes] = useState(false);
  const [activeRecordingType, setActiveRecordingType] = useState<'outline' | 'notes' | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async (type: 'outline' | 'notes') => {
    try {
      if (type === 'outline') {
        setIsRecordingOutline(true);
      } else {
        setIsRecordingNotes(true);
      }
      setActiveRecordingType(type);

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      audioChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob, type);
        
        // Clean up stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start(1000); // Collect data every second
      
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecordingOutline(false);
      setIsRecordingNotes(false);
      setActiveRecordingType(null);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    setIsRecordingOutline(false);
    setIsRecordingNotes(false);
    setActiveRecordingType(null);
  };

  const transcribeAudio = async (audioBlob: Blob, type: 'outline' | 'notes') => {
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        const response = await fetch('/api/transcribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            audioData: base64Audio,
            type: type
          }),
        });

        if (response.ok) {
          const result = await response.json();
          const transcript = result.transcript;
          
          if (type === 'outline') {
            setOutline(prev => prev + (prev ? ' ' : '') + transcript);
          } else {
            setRoughNotes(prev => prev + (prev ? ' ' : '') + transcript);
          }
        } else {
          console.error('Transcription failed');
        }
      };
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Error transcribing audio:', error);
    }
  };

  const quickTemplates = [
    {
      name: "How-To Guide",
      outline: "Introduction\nStep 1: [First Step]\nStep 2: [Second Step]\nStep 3: [Third Step]\nTips & Best Practices\nConclusion"
    },
    {
      name: "Listicle",
      outline: "Introduction\n1. [First Point]\n2. [Second Point]\n3. [Third Point]\n4. [Fourth Point]\n5. [Fifth Point]\nConclusion"
    },
    {
      name: "Problem/Solution",
      outline: "Introduction - The Problem\nWhy This Problem Matters\nCurrent Solutions (and their limitations)\nOur Proposed Solution\nImplementation Steps\nResults & Benefits\nConclusion"
    },
    {
      name: "Personal Story",
      outline: "Hook - Opening Scene\nBackground Context\nThe Challenge/Conflict\nWhat I Learned\nHow It Changed Me\nLessons for Readers\nConclusion"
    }
  ];

  const handleQuickIdea = async () => {
    setLoading(true);
    try {
      const ideaPrompt = "Generate a creative and engaging blog post outline on a trending topic. Include a compelling title, 4-5 main sections, and make it actionable for readers. Pick from topics like productivity, technology, personal development, or current trends.";
      const aiResponse = await queryAI([], ideaPrompt);
      setOutline(aiResponse);
    } catch (error) {
      console.error('Error generating idea:', error);
    }
    setLoading(false);
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


  const handleGenerateBlog = async () => {
    if (!outline.trim() && !roughNotes.trim()) {
      return;
    }
    
    setLoading(true);
    try {
      const blogPrompt = `Please create a complete, well-structured blog post based on the following:

OUTLINE:
${outline || 'No outline provided'}

ROUGH NOTES & INFORMATION:
${roughNotes || 'No rough notes provided'}

Instructions:
- Create a compelling blog post with a clear title, introduction, main sections, and conclusion
- Use proper headings and structure
- Make it engaging and well-written
- Incorporate all the key information from the rough notes
- Follow the outline structure if provided
- Write in a professional but approachable tone

Please return only the blog content, formatted with markdown headings.`;

      const aiResponse = await queryAI([], blogPrompt);
      setGeneratedBlog(aiResponse);
    } catch (error) {
      console.error('Error generating blog:', error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-6">
          {/* Blog Outline Section */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-4 py-5">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Blog Outline
                    </label>
                    <p className="text-xs text-gray-500 mt-1">Structure your blog post with headings, key points, and flow</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => isRecordingOutline ? stopRecording() : startRecording('outline')}
                      className={`p-2 rounded-full transition-colors ${
                        isRecordingOutline 
                          ? 'bg-red-100 text-red-600 animate-pulse' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={isRecordingOutline ? 'Stop recording' : 'Start voice input'}
                    >
                      {isRecordingOutline ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <rect x="6" y="6" width="8" height="8" rx="1"/>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 3a3 3 0 00-3 3v4a3 3 0 006 0V6a3 3 0 00-3-3z"/>
                          <path d="M14 10.5a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5 2 2 0 11-4 0 .5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5 3 3 0 106 0z"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Quick Templates */}
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <button
                      onClick={handleQuickIdea}
                      disabled={loading}
                      className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors disabled:opacity-50"
                    >
                      ✨ AI Idea
                    </button>
                    {quickTemplates.map((template) => (
                      <button
                        key={template.name}
                        onClick={() => setOutline(template.outline)}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                      >
                        {template.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-2">
                  <textarea
                    rows={4}
                    value={outline}
                    onChange={(e) => setOutline(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Introduction, Main Point 1, Main Point 2, Conclusion... or click a template above"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Rough Notes/Information Section */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-4 py-5">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Rough Notes & Information
                    </label>
                    <p className="text-xs text-gray-500 mt-1">Dump all your links, ideas, quotes, data, and unstructured content here</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => isRecordingNotes ? stopRecording() : startRecording('notes')}
                      className={`p-2 rounded-full transition-colors ${
                        isRecordingNotes 
                          ? 'bg-red-100 text-red-600 animate-pulse' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={isRecordingNotes ? 'Stop recording' : 'Start voice input'}
                    >
                      {isRecordingNotes ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <rect x="6" y="6" width="8" height="8" rx="1"/>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 3a3 3 0 00-3 3v4a3 3 0 006 0V6a3 3 0 00-3-3z"/>
                          <path d="M14 10.5a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5 2 2 0 11-4 0 .5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5 3 3 0 106 0z"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <textarea
                    rows={8}
                    value={roughNotes}
                    onChange={(e) => setRoughNotes(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Paste URLs, quotes, bullet points, research notes, images, or any other information you want to include in your blog... or use voice input!"
                  />
                </div>
              </div>
              
              {/* Generate Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleGenerateBlog}
                  disabled={loading || (!outline.trim() && !roughNotes.trim())}
                  className="px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? '🤖 Generating Blog...' : '🚀 Generate Blog for Me'}
                </button>
              </div>
            </div>
          </div>

          {/* Generated Blog Editor */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-4 py-5">
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">
                  Generated Blog Post
                </label>
                <p className="text-xs text-gray-500 mt-1">AI-generated blog based on your outline and notes - edit as needed</p>
                <div className="mt-2">
                  <textarea
                    rows={20}
                    value={generatedBlog}
                    onChange={(e) => setGeneratedBlog(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your generated blog will appear here. You can edit it after generation..."
                  />
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
} 