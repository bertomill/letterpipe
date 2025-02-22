'use client';

import { useState } from 'react';
import ContentUpload from './components/ContentUpload';
import NewsletterEditor from './components/NewsletterEditor';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'content' | 'write'>('content');

  return (
    <div>
      <div className="border-b">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('content')}
            className={`${
              activeTab === 'content'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500'
            } py-4 px-1 border-b-2`}
          >
            Content Library
          </button>
          <button
            onClick={() => setActiveTab('write')}
            className={`${
              activeTab === 'write'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500'
            } py-4 px-1 border-b-2`}
          >
            Write Newsletter
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'content' ? <ContentUpload /> : <NewsletterEditor />}
      </div>
    </div>
  );
} 