import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Shield, CheckCircle, XCircle, Calendar } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back, {user.username}!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <User className="h-8 w-8 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{user.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600 capitalize">
                  {user.role} Role
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {user.emailVerified ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm text-gray-600">
                  Email {user.emailVerified ? 'Verified' : 'Not Verified'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {user.mfaEnabled ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-orange-500" />
                )}
                <span className="text-sm text-gray-600">
                  MFA {user.mfaEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>

          {/* Security Status */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-8 w-8 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Security</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Password Strength</span>
                <span className="text-sm font-medium text-green-600">Strong</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Two-Factor Auth</span>
                <span className={`text-sm font-medium ${
                  user.mfaEnabled ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {user.mfaEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Account Status</span>
                <span className="text-sm font-medium text-green-600">Active</span>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Calendar className="h-8 w-8 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Account Info</h2>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Member Since</span>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Last Updated</span>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(user.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Account Type</span>
                <p className="text-sm font-medium text-gray-900 capitalize">
                  {user.role}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <h3 className="font-medium text-gray-900">Update Profile</h3>
              <p className="text-sm text-gray-600">Change your username or email</p>
            </button>
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <h3 className="font-medium text-gray-900">Security Settings</h3>
              <p className="text-sm text-gray-600">Manage MFA and passwords</p>
            </button>
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <h3 className="font-medium text-gray-900">Privacy Settings</h3>
              <p className="text-sm text-gray-600">Control your data and privacy</p>
            </button>
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <h3 className="font-medium text-gray-900">Account Activity</h3>
              <p className="text-sm text-gray-600">View your recent activity</p>
            </button>
          </div>
        </div>

        {/* Admin Section */}
        {user.role === 'admin' && (
          <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Admin Panel</h2>
            <p className="text-gray-600 mb-4">
              You have administrator privileges. Access advanced features and user management.
            </p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
              Go to Admin Panel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
