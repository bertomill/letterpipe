'use client';

import { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  getDocs,
  Timestamp 
} from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

interface ContentItem {
  id: string;
  url: string;
  title: string;
  content: string;
  notes: string;
  articleDate: string;
  createdAt: Timestamp;
}

interface FirestoreData {
  id: string;
  url: string;
  title: string;
  content: string;
  notes: string;
  articleDate: string;
  createdAt: Timestamp;
  userId: string;
}

export default function ContentUpload() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    content: '',
    notes: '',
    articleDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);

  const fetchContent = async () => {
    if (!user) return;
    
    try {
      const contentRef = collection(db, 'content');
      const q = query(
        contentRef,
        where('userId', '==', user.uid)
      );
      
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<FirestoreData, 'id'>)
      })) as ContentItem[];
      
      // Sort on the client side for now
      items.sort((a, b) => 
        (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
      );
      
      setContentItems(items);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  // Fetch content on component mount and after new content is added
  useEffect(() => {
    fetchContent();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setSuccess(false);
    try {
      await addDoc(collection(db, 'content'), {
        ...formData,
        createdAt: serverTimestamp(),
        userId: user.uid,
      });
      setFormData({
        url: '',
        title: '',
        content: '',
        notes: '',
        articleDate: '',
      });
      setSuccess(true);
      fetchContent(); // Refresh the content list
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error adding content:', error);
    }
    setLoading(false);
  };

  const inputClasses = "mt-1 block w-full border rounded-md px-3 py-2 text-sm text-gray-900";

  // Format date for display
  const formatDate = (date: string | Timestamp) => {
    if (date instanceof Timestamp) {
      return new Date(date.seconds * 1000).toLocaleDateString();
    }
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="max-w-3xl">
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-600 rounded-md">
          Content saved successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-sm text-gray-600">
            Website URL
          </label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            className={inputClasses}
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={inputClasses}
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">
            Content
          </label>
          <textarea
            rows={4}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className={inputClasses}
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">
            Your Notes
          </label>
          <textarea
            rows={4}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className={inputClasses}
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">
            Article Date
          </label>
          <input
            type="date"
            value={formData.articleDate}
            onChange={(e) => setFormData({ ...formData, articleDate: e.target.value })}
            className={inputClasses}
            required
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-md py-2 text-sm"
          >
            {loading ? 'Saving...' : 'Save Content'}
          </button>
        </div>
      </form>

      {/* Content Feed */}
      <div className="mt-12">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Your Content Library</h2>
        <div className="space-y-6">
          {contentItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-white border rounded-lg p-6 hover:border-blue-300 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {item.title}
                  </h3>
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {item.url}
                  </a>
                </div>
                <div className="text-sm text-gray-500">
                  {formatDate(item.articleDate)}
                </div>
              </div>
              
              {item.content && (
                <div className="mt-4">
                  <div className="text-sm text-gray-600 line-clamp-3">
                    {item.content}
                  </div>
                </div>
              )}
              
              {item.notes && (
                <div className="mt-4 bg-gray-50 p-4 rounded-md">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Your Notes:</span> {item.notes}
                  </div>
                </div>
              )}
            </div>
          ))}

          {contentItems.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              No content saved yet. Start by adding some content above!
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 