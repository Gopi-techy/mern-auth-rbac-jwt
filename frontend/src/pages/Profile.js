import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { User, Shield } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, enableMFA, verifyMFA } = useAuth();
  const [loading, setLoading] = useState(false);
  const [mfaStep, setMfaStep] = useState(null); // null, 'setup', 'verify'
  const [mfaData, setMfaData] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  // Set default values when user data is available
  React.useEffect(() => {
    if (user) {
      setValue('username', user.username || '');
      setValue('email', user.email || '');
    }
  }, [user, setValue]);

  const {
    register: registerMFA,
    handleSubmit: handleSubmitMFA,
    formState: { errors: mfaErrors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    await updateProfile(data);
    setLoading(false);
  };

  const handleEnableMFA = async () => {
    setLoading(true);
    const result = await enableMFA();
    setLoading(false);
    
    if (result.success) {
      setMfaData(result.data);
      setMfaStep('setup');
    }
  };

  const handleVerifyMFA = async (data) => {
    setLoading(true);
    const result = await verifyMFA(data.token);
    setLoading(false);
    
    if (result.success) {
      setMfaStep(null);
      setMfaData(null);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-2 text-gray-600">Manage your account information and security settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-6">
                <User className="h-6 w-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    {...register('username', { required: 'Username is required' })}
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    type="email"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="h-6 w-6 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
              </div>

              <div className="space-y-6">
                {/* MFA Section */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-600">
                      {user.mfaEnabled
                        ? 'MFA is enabled on your account'
                        : 'Add an extra layer of security to your account'}
                    </p>
                  </div>
                  <div>
                    {user.mfaEnabled ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Enabled
                      </span>
                    ) : (
                      <button
                        onClick={handleEnableMFA}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        Enable MFA
                      </button>
                    )}
                  </div>
                </div>

                {/* Password Change */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Password</h3>
                    <p className="text-sm text-gray-600">
                      Last changed: Unknown
                    </p>
                  </div>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center">
                <div className="mx-auto h-24 w-24 bg-gray-300 rounded-full flex items-center justify-center mb-4">
                  <User className="h-12 w-12 text-gray-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">{user.username}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500 mt-2 capitalize">{user.role} Account</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Email Verified</span>
                  <span className={`text-sm font-medium ${
                    user.emailVerified ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {user.emailVerified ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">MFA Enabled</span>
                  <span className={`text-sm font-medium ${
                    user.mfaEnabled ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {user.mfaEnabled ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MFA Setup Modal */}
        {mfaStep === 'setup' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Enable Two-Factor Authentication</h3>
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600 mb-4">
                  Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                </p>
                <div className="mx-auto mb-4">
                  <img src={mfaData.qr} alt="QR Code" className="mx-auto" />
                </div>
                <p className="text-xs text-gray-500">
                  Can't scan? Enter this code manually: <br />
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">{mfaData.secret}</code>
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setMfaStep(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setMfaStep('verify')}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MFA Verification Modal */}
        {mfaStep === 'verify' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Verify Two-Factor Authentication</h3>
              <form onSubmit={handleSubmitMFA(handleVerifyMFA)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Enter the 6-digit code from your authenticator app
                  </label>
                  <input
                    {...registerMFA('token', { required: 'MFA code is required' })}
                    type="text"
                    placeholder="123456"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                  {mfaErrors.token && (
                    <p className="mt-1 text-sm text-red-600">{mfaErrors.token.message}</p>
                  )}
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setMfaStep('setup')}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                  >
                    {loading ? 'Verifying...' : 'Verify & Enable'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
