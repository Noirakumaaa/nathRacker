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
    <div className="min-h-screen bg-(--color-bg) flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Main Card */}
        <div className="bg-(--color-surface) rounded-xl shadow-sm border border-(--color-border) p-8 text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-red-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-(--color-ink) mb-3">Access Denied</h1>

          {/* Description */}
          <p className="text-(--color-muted) mb-6 leading-relaxed">
            You are not authorized to access this page. Please contact your administrator
            if you believe this is an error.
          </p>

          {/* Error Code */}
          <div className="bg-(--color-subtle) rounded-lg p-4 mb-8">
            <p className="text-sm text-(--color-muted)">Error Code</p>
            <p className="text-lg font-mono text-(--color-ink)">401 - Unauthorized</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGoBack}
              className="w-full flex items-center justify-center px-4 py-3 bg-(--color-ink) text-(--color-bg) rounded-lg font-medium hover:opacity-80 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>

            <button
              onClick={handleGoHome}
              className="w-full flex items-center justify-center px-4 py-3 bg-(--color-surface) text-(--color-ink) border border-(--color-border) rounded-lg font-medium hover:bg-(--color-subtle) transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </button>

            <button
              onClick={handleContactSupport}
              className="w-full flex items-center justify-center px-4 py-3 bg-(--color-surface) text-(--color-ink) border border-(--color-border) rounded-lg font-medium hover:bg-(--color-subtle) transition-colors"
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-(--color-muted)">
            Need help? Check your permissions or contact your system administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
