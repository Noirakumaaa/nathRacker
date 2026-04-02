import { Shield, ArrowLeft, Home, Mail } from 'lucide-react';

const UnauthorizedPage = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    // Replace with your actual home route
    window.location.href = '/dashboard';
  };

  const handleContactSupport = () => {
    // Replace with your actual support contact method
    window.location.href = 'mailto:support@yourcompany.com';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Main Card */}
        <div className="bg-(--color-surface) rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-red-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Access Denied</h1>
          
          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            You are not authorized to access this page. Please contact your administrator 
            if you believe this is an error.
          </p>

          {/* Error Code */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-500">Error Code</p>
            <p className="text-lg font-mono text-gray-900">401 - Unauthorized</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGoBack}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
            
            <button
              onClick={handleGoHome}
              className="w-full flex items-center justify-center px-4 py-3 bg-(--color-surface) text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </button>
            
            <button
              onClick={handleContactSupport}
              className="w-full flex items-center justify-center px-4 py-3 bg-(--color-surface) text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help? Check your permissions or contact your system administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;