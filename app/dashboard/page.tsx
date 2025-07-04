'use client';

import { useState } from 'react';
import ContentUpload from './components/ContentUpload';
import NewsletterEditor from './components/NewsletterEditor';

type ActiveViewType = 'home' | 'content' | 'write';

export default function Dashboard() {
  const [activeView, setActiveView] = useState<ActiveViewType>('home');

  const WelcomeScreen = () => (
    <div className="max-w-4xl mx-auto">
      {/* Welcome Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to BlogPatch! 👋
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your AI-powered blog creation assistant. Collect content, organize your ideas, and let AI help you write amazing blogs.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Content Library Card */}
        <div 
          onClick={() => setActiveView('content')}
          className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 ml-4">Content Library</h3>
          </div>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Save and organize all your content in one place. Add URLs, articles, videos, images, and notes. 
            Your content library is the foundation for creating great blogs.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              Save articles and URLs
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              Upload images and documents
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              Add personal notes and ideas
            </div>
          </div>
          <button className="mt-6 text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
            Start organizing content →
          </button>
        </div>

        {/* Write Blog Card */}
        <div 
          onClick={() => setActiveView('write')}
          className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <span className="text-2xl">✍️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 ml-4">Write Blog</h3>
          </div>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Create your blog with AI assistance. Drop in URLs, images, and unstructured content, 
            then let our AI create a first draft that you can edit and perfect.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
              AI-powered first drafts
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
              Easy editing and refinement
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
              Professional formatting
            </div>
          </div>
          <button className="mt-6 text-green-600 font-medium group-hover:text-green-700 transition-colors">
            Start writing →
          </button>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How BlogPatch Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">1️⃣</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Collect Content</h3>
            <p className="text-gray-600 text-sm">
              Gather URLs, articles, images, and notes in your content library
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">2️⃣</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">AI Processing</h3>
            <p className="text-gray-600 text-sm">
              Our AI analyzes your content and creates a structured first draft
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">3️⃣</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Edit & Publish</h3>
            <p className="text-gray-600 text-sm">
              Review, edit, and perfect your blog before publishing
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (activeView === 'home') {
    return <WelcomeScreen />;
  }

  return (
    <div>
      <div className="border-b">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveView('home')}
            className={`${
              activeView === 'home'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500'
            } py-4 px-1 border-b-2`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveView('content')}
            className={`${
              activeView === 'content'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500'
            } py-4 px-1 border-b-2`}
          >
            Content Library
          </button>
          <button
            onClick={() => setActiveView('write')}
            className={`${
              activeView === 'write'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500'
            } py-4 px-1 border-b-2`}
          >
            Write Blog
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {activeView === 'content' ? <ContentUpload /> : <NewsletterEditor />}
      </div>
    </div>
  );
} 