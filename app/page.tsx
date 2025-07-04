import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-gray-900">BlogPatch</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="hidden md:inline text-sm text-gray-600">RESOURCES</span>
              <span className="hidden md:inline text-sm text-gray-600">PRODUCT</span>
              <span className="hidden md:inline text-sm text-gray-600">PRICING</span>
              <span className="hidden sm:inline text-sm text-gray-600">LOG IN</span>
              <Link 
                href="/login"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
              >
                START TRIAL
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        <main className="lg:grid lg:grid-cols-2 lg:gap-8">
          <div className="px-4 py-12 sm:px-6 lg:px-8 lg:py-24">
            <div className="max-w-xl mx-auto lg:mx-0">
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl xl:text-6xl">
                <span className="block">Manage your</span>
                <span className="block">newsletter content</span>
                <span className="block">like <span className="text-green-600">magic</span></span>
              </h1>
              <p className="mt-4 text-lg text-gray-600 leading-relaxed sm:text-xl lg:mt-6">
                BlogPatch is a powerful end-to-end platform to draft, plan, and schedule newsletter content.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-4 lg:mt-8">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
                >
                  START FREE TRIAL
                </Link>
                <button className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
                  BOOK A 15 MINUTE DEMO
                </button>
              </div>
            </div>
          </div>
          <div className="relative mt-12 lg:mt-0 lg:inset-y-0 lg:h-full">
            <div className="h-64 sm:h-80 lg:absolute lg:inset-0 lg:h-full w-full bg-gray-50">
              {/* Dashboard Preview */}
              <div className="h-full flex items-center justify-center p-4 sm:p-8">
                <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
                  {/* Dashboard Header */}
                  <div className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs sm:text-sm">B</span>
                        </div>
                        <span className="font-semibold text-gray-900 text-sm sm:text-base">BlogPatch</span>
                      </div>
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Dashboard Content */}
                  <div className="flex h-64 sm:h-80 lg:h-96">
                    {/* Sidebar */}
                    <div className="w-32 sm:w-48 lg:w-64 bg-gray-50 border-r border-gray-200 p-2 sm:p-4">
                      <div className="space-y-1 sm:space-y-2">
                        <div className="flex items-center space-x-2 p-1 sm:p-2 bg-white rounded-md shadow-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-xs sm:text-sm font-medium text-gray-900">Drafts</span>
                        </div>
                        <div className="flex items-center space-x-2 p-1 sm:p-2 text-gray-600">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <span className="text-xs sm:text-sm">Content Library</span>
                        </div>
                        <div className="flex items-center space-x-2 p-1 sm:p-2 text-gray-600">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <span className="text-xs sm:text-sm">AI Assistant</span>
                        </div>
                        <div className="flex items-center space-x-2 p-1 sm:p-2 text-gray-600">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <span className="text-xs sm:text-sm">Analytics</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Main Content */}
                    <div className="flex-1 p-2 sm:p-4">
                      <div className="space-y-2 sm:space-y-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-2 sm:p-4 shadow-sm">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <span className="text-blue-600 font-bold text-sm sm:text-base">📧</span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Weekly Newsletter</h3>
                              <p className="text-xs sm:text-sm text-gray-600">Draft • 3 articles saved</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-lg p-2 sm:p-4 shadow-sm">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <span className="text-green-600 font-bold text-sm sm:text-base">✅</span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Tech Roundup</h3>
                              <p className="text-xs sm:text-sm text-gray-600">Scheduled • Sending tomorrow</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-lg p-2 sm:p-4 shadow-sm">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                              <span className="text-purple-600 font-bold text-sm sm:text-base">🤖</span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">AI-Generated Summary</h3>
                              <p className="text-xs sm:text-sm text-gray-600">Ready for review</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything you need to create newsletters
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-600">
              Streamline your workflow with powerful tools designed for modern newsletter creators.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold text-xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Content Library</h3>
              <p className="text-gray-600">Save articles, videos, and documents. Organize your content for easy access when writing your newsletter.</p>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-green-600 font-bold text-xl">✍️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Editor</h3>
              <p className="text-gray-600">Write and edit with intelligent suggestions. Take notes and organize your thoughts seamlessly.</p>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-purple-600 font-bold text-xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Assistant</h3>
              <p className="text-gray-600">Get help writing and editing your newsletter with AI-powered suggestions and content generation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
