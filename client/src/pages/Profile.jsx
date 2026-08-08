import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Lock, Trash2, AlertCircle, Loader2, Save, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const Profile = () => {
  const { user, setUser, logout } = useContext(AuthContext);

  // Profile Edit State
  const [name, setName] = useState(user?.name || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameLoading, setNameLoading] = useState(false);
  const [nameError, setNameError] = useState(null);
  const [nameSuccess, setNameSuccess] = useState(false);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Delete Account State
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!user || name.trim() === user.name) {
      setIsEditingName(false);
      return;
    }
    
    setNameLoading(true);
    setNameError(null);
    setNameSuccess(false);
    
    try {
      const res = await api.put('/auth/profile', { name });
      setUser(res.data.user);
      setNameSuccess(true);
      toast.success('Name updated successfully!');
      setIsEditingName(false);
      setTimeout(() => setNameSuccess(false), 3000);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update name');
      setNameError(err.response?.data?.error || 'Failed to update name');
    } finally {
      setNameLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(false);

    try {
      await api.put('/auth/password', { currentPassword, newPassword });
      setPasswordSuccess(true);
      toast.success('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update password');
      setPasswordError(err.response?.data?.error || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteLoading(true);
    setDeleteError(null);

    try {
      await api.delete('/auth/profile', { data: { password: deletePassword } });
      toast.success('Account deleted successfully.');
      // Clear token and logout
      logout();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete account');
      setDeleteError(err.response?.data?.error || 'Failed to delete account');
      setDeleteLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 text-primary-600 animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <User className="h-8 w-8 text-primary-600" />
          Profile Settings
        </h1>
        <p className="text-slate-600 mt-2">Manage your account information and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column (Info & Actions) */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Profile Information */}
          <section className="card">
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">Personal Information</h2>
            
            {nameError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">{nameError}</div>
            )}
            {nameSuccess && (
              <div className="bg-green-50 text-green-600 p-3 rounded-md mb-4 text-sm">Name updated successfully!</div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                {isEditingName ? (
                  <form onSubmit={handleUpdateName} className="flex items-center gap-3">
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      className="input-field flex-1"
                      required
                      autoFocus
                    />
                    <button 
                      type="submit" 
                      disabled={nameLoading}
                      className="btn-primary py-2 px-4 flex items-center gap-2"
                    >
                      {nameLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsEditingName(false);
                        setName(user?.name);
                      }}
                      className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-md border border-slate-100">
                    <span className="text-lg font-medium text-slate-900">{user?.name}</span>
                    <button 
                      onClick={() => setIsEditingName(true)}
                      className="text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                <div className="bg-slate-50 p-3 rounded-md border border-slate-100 text-slate-700 cursor-not-allowed">
                  {user?.email}
                </div>
                <p className="text-xs text-slate-400 mt-1">Email address cannot be changed.</p>
              </div>
            </div>
          </section>

          {/* Change Password */}
          <section className="card">
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2 flex items-center gap-2">
              <Lock className="h-5 w-5 text-slate-500" /> Change Password
            </h2>
            
            {passwordError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">{passwordError}</div>
            )}
            {passwordSuccess && (
              <div className="bg-green-50 text-green-600 p-3 rounded-md mb-4 text-sm">Password updated successfully!</div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                <input 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field"
                  required
                  minLength={6}
                />
              </div>
              <button 
                type="submit" 
                disabled={passwordLoading}
                className="btn-primary mt-2 flex items-center gap-2"
              >
                {passwordLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Update Password
              </button>
            </form>
          </section>

        </div>

        {/* Right Column (Meta & Danger Zone) */}
        <div className="md:col-span-1 space-y-6">
          
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 text-slate-600 mb-2">
              <Calendar className="h-5 w-5" />
              <h3 className="font-semibold text-slate-800">Account Created</h3>
            </div>
            <p className="text-slate-600 pl-8">{formatDate(user?.createdAt)}</p>
          </div>

          {/* Danger Zone */}
          <div className="border border-red-200 bg-red-50 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-red-100 p-4 border-b border-red-200">
              <h3 className="font-bold text-red-800 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" /> Danger Zone
              </h3>
            </div>
            <div className="p-4">
              <p className="text-sm text-red-700 mb-4">
                Permanently delete your account and all of your generated medical reports. This action cannot be undone.
              </p>
              
              {!showDeleteConfirm ? (
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full py-2 bg-white border border-red-300 text-red-700 hover:bg-red-50 font-medium rounded-lg transition-colors"
                >
                  Delete Account
                </button>
              ) : (
                <form onSubmit={handleDeleteAccount} className="space-y-3 mt-4 animate-in fade-in slide-in-from-top-2">
                  {deleteError && (
                    <div className="text-xs text-red-600 font-medium bg-red-100 p-2 rounded">{deleteError}</div>
                  )}
                  <div>
                    <label className="block text-xs font-medium text-red-800 mb-1">Confirm with Password</label>
                    <input 
                      type="password" 
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 text-sm"
                      placeholder="Enter password to confirm"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      type="button" 
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeletePassword('');
                        setDeleteError(null);
                      }}
                      className="flex-1 py-2 bg-white text-slate-600 border border-slate-300 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={deleteLoading}
                      className="flex-1 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors flex justify-center items-center gap-1 disabled:opacity-70"
                    >
                      {deleteLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />} Confirm
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;
