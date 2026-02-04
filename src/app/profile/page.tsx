'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, LogOut, Trash2, Loader2, AlertCircle, CheckCircle, Eye, EyeOff, MapPin, Plus, Edit2 } from 'lucide-react';
import { getAccessToken, clearAuth } from '@/lib/authClient';
import api from '@/lib/axios';
import Link from 'next/link';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  addresses: any[];
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'delete' | 'addresses'>('profile');

  // Profile edit form
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Password change form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Delete account
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  // Manage addresses
  const [addresses, setAddresses] = useState<any[]>([]);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [deleteAddressLoading, setDeleteAddressLoading] = useState<string | null>(null);

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getAccessToken();
        if (!token) {
          router.push('/login');
          return;
        }

        const res = await api.get('/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setProfile(res.data.user);
          setEditName(res.data.user.name);
          setEditEmail(res.data.user.email);
          setAddresses(res.data.user.addresses || []);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load profile');
        if (err.response?.status === 401) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // Update profile
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setEditLoading(true);

    try {
      const token = getAccessToken();
      const res = await api.patch(
        '/user/profile',
        { name: editName, email: editEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setProfile(res.data.user);
        setSuccess('Profile updated successfully');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setEditLoading(false);
    }
  };

  // Change password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setPasswordLoading(true);

    try {
      const token = getAccessToken();
      const res = await api.post(
        '/user/profile/change-password',
        { currentPassword, newPassword, confirmPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setSuccess('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Delete account
  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (deleteConfirm !== profile?.email) {
      setError('Email confirmation does not match');
      return;
    }

    setDeleteLoading(true);

    try {
      const token = getAccessToken();
      const res = await api.delete('/user/profile', {
        data: { password: deletePassword },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        clearAuth();
        router.push('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete account');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Delete address
  const handleDeleteAddress = async (addressId: string) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    setDeleteAddressLoading(addressId);

    try {
      const token = getAccessToken();
      const res = await api.delete(`/user/addresses/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setAddresses(addresses.filter((addr) => addr._id !== addressId));
        setSuccess('Address deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete address');
    } finally {
      setDeleteAddressLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Unable to load profile</p>
          <Link href="/" className="text-cyan-400 hover:text-cyan-300">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border-b border-cyan-500/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-cyan-400" />
            </div>
            <h1 className="text-4xl font-bold text-white">My Profile</h1>
          </div>
          <p className="text-gray-400">Manage your account settings and preferences</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Alert Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-green-300">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Tabs Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-cyan-500/20 overflow-hidden">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full px-6 py-4 text-left border-b border-gray-700 transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-cyan-500/20 text-cyan-300 border-l-4 border-l-cyan-400'
                    : 'text-gray-400 hover:text-cyan-300 hover:bg-gray-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5" />
                  <span>Profile Info</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('password')}
                className={`w-full px-6 py-4 text-left border-b border-gray-700 transition-colors ${
                  activeTab === 'password'
                    ? 'bg-cyan-500/20 text-cyan-300 border-l-4 border-l-cyan-400'
                    : 'text-gray-400 hover:text-cyan-300 hover:bg-gray-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5" />
                  <span>Change Password</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full px-6 py-4 text-left border-b border-gray-700 transition-colors ${
                  activeTab === 'addresses'
                    ? 'bg-cyan-500/20 text-cyan-300 border-l-4 border-l-cyan-400'
                    : 'text-gray-400 hover:text-cyan-300 hover:bg-gray-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5" />
                  <span>Manage Addresses</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('delete')}
                className={`w-full px-6 py-4 text-left transition-colors ${
                  activeTab === 'delete'
                    ? 'bg-red-500/20 text-red-300 border-l-4 border-l-red-400'
                    : 'text-gray-400 hover:text-red-300 hover:bg-gray-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Trash2 className="w-5 h-5" />
                  <span>Delete Account</span>
                </div>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Profile Info Tab */}
            {activeTab === 'profile' && (
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-cyan-500/20 p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-white font-semibold mb-2">Full Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-white font-semibold mb-2">Email Address</label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  {/* Account Status */}
                  <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-400">
                        <span className="font-semibold">Email Verified:</span>{' '}
                        <span className={profile.isEmailVerified ? 'text-green-400' : 'text-yellow-400'}>
                          {profile.isEmailVerified ? '✓ Verified' : '⚠ Not Verified'}
                        </span>
                      </p>
                      <p className="text-gray-400">
                        <span className="font-semibold">Member Since:</span>{' '}
                        {new Date(profile.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Save Button */}
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {editLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-cyan-500/20 p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Change Password</h2>

                <form onSubmit={handleChangePassword} className="space-y-6">
                  {/* Current Password */}
                  <div>
                    <label className="block text-white font-semibold mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                        className="absolute right-3 top-3 text-gray-400 hover:text-cyan-400"
                      >
                        {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-white font-semibold mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                        className="absolute right-3 top-3 text-gray-400 hover:text-cyan-400"
                      >
                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-white font-semibold mb-2">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                        className="absolute right-3 top-3 text-gray-400 hover:text-cyan-400"
                      >
                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {passwordLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Change Password'
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Delete Account Tab */}
            {activeTab === 'delete' && (
              <div className="bg-gradient-to-br from-red-900/10 to-red-800/10 rounded-xl border border-red-500/30 p-8">
                <h2 className="text-2xl font-bold text-red-300 mb-4">Delete Account</h2>
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-300 text-sm">
                    ⚠️ Warning: This action cannot be undone. Your account and all associated data will be permanently deleted.
                  </p>
                </div>

                <form onSubmit={handleDeleteAccount} className="space-y-6">
                  {/* Email Confirmation */}
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Confirm by typing your email: <span className="text-red-400">{profile.email}</span>
                    </label>
                    <input
                      type="text"
                      value={deleteConfirm}
                      onChange={(e) => setDeleteConfirm(e.target.value)}
                      placeholder={profile.email}
                      className="w-full bg-gray-800/50 border border-red-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-red-400 focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-white font-semibold mb-2">Password Confirmation</label>
                    <div className="relative">
                      <input
                        type={showDeletePassword ? 'text' : 'password'}
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        className="w-full bg-gray-800/50 border border-red-500/30 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-500 focus:border-red-400 focus:outline-none transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowDeletePassword(!showDeletePassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-red-400"
                      >
                        {showDeletePassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    type="submit"
                    disabled={deleteLoading || deleteConfirm !== profile.email}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {deleteLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-5 h-5" />
                        Permanently Delete Account
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-cyan-500/20 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-cyan-400" />
                    Saved Addresses
                  </h2>
                  <Link href="/manage-address" className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-lg transition-colors">
                    <Plus className="w-5 h-5" />
                    Add Address
                  </Link>
                </div>

                {addresses.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No addresses saved yet</p>
                    <Link href="/manage-address" className="inline-block px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
                      Add First Address
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div key={address._id} className="p-4 border border-gray-700 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-white font-semibold">{address.fullName}</h3>
                            <p className="text-sm text-gray-400">{address.phone}</p>
                          </div>
                          {address.isDefault && (
                            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-semibold rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-400 mb-4">
                          <p>{address.addressLine1}</p>
                          {address.addressLine2 && <p>{address.addressLine2}</p>}
                          <p>{address.city}, {address.state} {address.postalCode}</p>
                          <p>{address.country}</p>
                        </div>

                        <div className="flex gap-2 items-center">
                          <Link
                            href={`/manage-address?id=${address._id}`}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteAddress(address._id)}
                            disabled={deleteAddressLoading === address._id}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deleteAddressLoading === address._id ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
