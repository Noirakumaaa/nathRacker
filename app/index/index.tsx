const IndexPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-mono">
      {/* Header */}
      <header className="bg-white border-b-2 border-gray-900 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-900 border-2 border-gray-900"></div>
            <h1 className="text-2xl font-bold text-gray-900">ENCODING TRACKING SYSTEM</h1>
          </div>
          
          <div className="flex space-x-4">
            <button 
            onClick={() => window.location.href = '/login'}
            className="px-6 py-2 bg-white border-2 border-gray-900 text-gray-900 font-semibold hover:bg-gray-100 transition-colors">
              LOGIN
            </button>
            <button 
            onClick={() => window.location.href = '/register'}
            className="px-6 py-2 bg-gray-900 border-2 border-gray-900 text-white font-semibold hover:bg-gray-700 transition-colors">
              REGISTER
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="mb-6">
              <h2 className="text-5xl font-bold text-gray-900 mb-4">
                ENCODE.<br />
                SECURE.<br />
                TRACK.
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Advanced encoding tracking system with military-grade security. 
                Lightning-fast document processing, real-time monitoring, and 
                encrypted data management for critical operations.
              </p>
            </div>
            
            <div className="flex space-x-4 mb-8">
              <button className="px-8 py-3 bg-gray-900 border-2 border-gray-900 text-white font-semibold text-lg hover:bg-gray-700 transition-colors">
                START ENCODING
              </button>
              <button className="px-8 py-3 bg-white border-2 border-gray-900 text-gray-900 font-semibold text-lg hover:bg-gray-100 transition-colors">
                VIEW DEMO
              </button>
            </div>

            {/* Feature boxes */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border-2 border-gray-300 p-4">
                <div className="w-6 h-6 bg-gray-900 mb-2"></div>
                <h4 className="font-semibold text-gray-900">LIGHTNING FAST</h4>
                <p className="text-sm text-gray-600">Process 1000+ docs/sec</p>
              </div>
              <div className="border-2 border-gray-300 p-4">
                <div className="w-6 h-6 bg-gray-900 mb-2"></div>
                <h4 className="font-semibold text-gray-900">ULTRA SECURE</h4>
                <p className="text-sm text-gray-600">256-bit AES encryption</p>
              </div>
              <div className="border-2 border-gray-300 p-4">
                <div className="w-6 h-6 bg-gray-900 mb-2"></div>
                <h4 className="font-semibold text-gray-900">ZERO DOWNTIME</h4>
                <p className="text-sm text-gray-600">99.99% uptime guarantee</p>
              </div>
              <div className="border-2 border-gray-300 p-4">
                <div className="w-6 h-6 bg-gray-900 mb-2"></div>
                <h4 className="font-semibold text-gray-900">INSTANT SYNC</h4>
                <p className="text-sm text-gray-600">Real-time data updates</p>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 pt-6 border-t border-gray-300">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-900">SOC 2 CERTIFIED</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-900">GDPR COMPLIANT</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-900">ISO 27001</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Dashboard Preview */}
          <div className="bg-white border-2 border-gray-900 p-6 relative">
            {/* Security badge */}
            <div className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-bold px-3 py-1 transform rotate-12">
              SECURE
            </div>
            
            <div className="border-b-2 border-gray-300 pb-4 mb-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-semibold">SYSTEM ONLINE</span>
                </div>
                <div className="flex space-x-2">
                  <div className="w-4 h-4 bg-gray-900"></div>
                  <div className="w-4 h-4 bg-gray-300"></div>
                  <div className="w-4 h-4 bg-gray-300"></div>
                </div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="space-y-4">
              {/* Stats with encoding indicators */}
              <div className="grid grid-cols-3 gap-4">
                <div className="border border-gray-300 p-3 relative">
                  <div className="w-full h-3 bg-gray-300 mb-2"></div>
                  <div className="w-16 h-6 bg-gray-900 mb-1"></div>
                  <div className="text-xs text-green-600 font-semibold">↗ ENCODED</div>
                </div>
                <div className="border border-gray-300 p-3 relative">
                  <div className="w-full h-3 bg-gray-300 mb-2"></div>
                  <div className="w-16 h-6 bg-gray-900 mb-1"></div>
                  <div className="text-xs text-blue-600 font-semibold">⚡ PROCESSING</div>
                </div>
                <div className="border border-gray-300 p-3 relative">
                  <div className="w-full h-3 bg-gray-300 mb-2"></div>
                  <div className="w-16 h-6 bg-gray-900 mb-1"></div>
                  <div className="text-xs text-orange-600 font-semibold">🔒 SECURED</div>
                </div>
              </div>

              {/* Real-time activity feed */}
              <div className="border border-gray-300 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-20 h-3 bg-gray-300"></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-2 text-xs">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="w-20 h-2 bg-gray-300"></div>
                      <div className="w-16 h-2 bg-gray-200"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance metrics */}
              <div className="border border-gray-300 p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="w-20 h-3 bg-gray-300"></div>
                  <div className="text-xs font-semibold text-green-600">99.9% UPTIME</div>
                </div>
                <div className="h-32 border border-gray-200 relative">
                  <div className="absolute bottom-0 left-4 w-6 h-20 bg-green-500"></div>
                  <div className="absolute bottom-0 left-12 w-6 h-24 bg-green-500"></div>
                  <div className="absolute bottom-0 left-20 w-6 h-16 bg-green-500"></div>
                  <div className="absolute bottom-0 left-28 w-6 h-28 bg-green-500"></div>
                  <div className="absolute bottom-0 left-36 w-6 h-18 bg-green-500"></div>
                </div>
              </div>

              {/* Document status table */}
              <div className="border border-gray-300">
                <div className="grid grid-cols-4 gap-2 p-3 border-b border-gray-200 bg-gray-100">
                  <div className="w-full h-3 bg-gray-400"></div>
                  <div className="w-full h-3 bg-gray-400"></div>
                  <div className="w-full h-3 bg-gray-400"></div>
                  <div className="w-full h-3 bg-gray-400"></div>
                </div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="grid grid-cols-4 gap-2 p-3 border-b border-gray-200">
                    <div className="w-full h-3 bg-gray-300"></div>
                    <div className="w-full h-3 bg-gray-300"></div>
                    <div className={`w-full h-3 ${i === 1 ? 'bg-green-400' : i === 2 ? 'bg-blue-400' : 'bg-orange-400'}`}></div>
                    <div className="w-full h-3 bg-gray-300"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white border-t-2 border-gray-900 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">CORE CAPABILITIES</h3>
            <div className="w-20 h-1 bg-gray-900 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: 'ADVANCED ENCODING', 
                desc: 'Multi-layer encryption with custom algorithms for maximum data protection and integrity',
                badge: 'NEW'
              },
              { 
                title: 'REAL-TIME TRACKING', 
                desc: 'Monitor document lifecycle with instant notifications and automated status updates',
                badge: 'FAST'
              },
              { 
                title: 'SECURE STORAGE', 
                desc: 'Enterprise-grade database with redundant backups and disaster recovery protocols',
                badge: 'SECURE'
              }
            ].map((feature, index) => (
              <div key={index} className="border-2 border-gray-300 p-6 hover:border-gray-900 transition-colors relative">
                {feature.badge && (
                  <div className="absolute top-2 right-2 bg-gray-900 text-white text-xs font-bold px-2 py-1">
                    {feature.badge}
                  </div>
                )}
                <div className="w-12 h-12 bg-gray-900 mb-4 relative">
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white"></div>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                <div className="mt-4">
                  <button className="text-gray-900 font-semibold hover:underline">
                    EXPLORE →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-white"></div>
                <span className="font-bold">ENCODING SYSTEM</span>
              </div>
              <div className="space-y-2">
                <div className="w-32 h-3 bg-gray-700"></div>
                <div className="w-28 h-3 bg-gray-700"></div>
                <div className="w-36 h-3 bg-gray-700"></div>
              </div>
            </div>

            {['SOLUTIONS', 'SECURITY', 'SUPPORT'].map((section, index) => (
              <div key={index}>
                <h5 className="font-bold mb-4">{section}</h5>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-20 h-3 bg-gray-700"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <div className="w-48 h-3 bg-gray-700 mx-auto"></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default IndexPage;