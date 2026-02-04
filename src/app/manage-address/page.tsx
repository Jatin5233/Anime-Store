'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAccessToken } from '@/lib/authClient';
import { MapPin, ArrowLeft, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Header } from '@/components/Home/Header';
import api from '@/lib/axios';

interface AddressForm {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

function ManageAddressContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addressId = searchParams.get('id');
  const isEdit = !!addressId;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState<AddressForm>({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false,
  });

  // Load address if editing
  useEffect(() => {
    if (isEdit) {
      const loadAddress = async () => {
        try {
          const token = getAccessToken();
          if (!token) {
            router.push('/login');
            return;
          }

          // Note: You'll need to create a GET endpoint for a specific address
          // For now, fetch all addresses and filter
          const res = await api.get('/user/addresses', {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.data.success) {
            const address = res.data.addresses.find(
              (addr: any) => addr._id === addressId
            );

            if (address) {
              setFormData({
                fullName: address.fullName,
                phone: address.phone,
                addressLine1: address.addressLine1,
                addressLine2: address.addressLine2 || '',
                city: address.city,
                state: address.state,
                postalCode: address.postalCode,
                country: address.country || 'India',
                isDefault: address.isDefault || false,
              });
            } else {
              setError('Address not found');
            }
          }
        } catch (err: any) {
          setError(err.response?.data?.message || 'Failed to load address');
        } finally {
          setLoading(false);
        }
      };

      loadAddress();
    }
  }, [addressId, isEdit, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.addressLine1 ||
      !formData.city ||
      !formData.state ||
      !formData.postalCode
    ) {
      setError('Please fill in all required fields');
      return;
    }

    setSaving(true);

    try {
      const token = getAccessToken();
      if (!token) {
        router.push('/login');
        return;
      }

      let res;
      if (isEdit) {
        // Update existing address
        res = await api.put(`/user/addresses/${addressId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Add new address
        res = await api.post('/user/addresses', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (res.data.success) {
        setSuccess(isEdit ? 'Address updated successfully!' : 'Address added successfully!');
        setTimeout(() => {
          router.push('/profile?tab=addresses');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
      <Header />

      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-b border-cyan-500/20 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-cyan-400" />
            </button>
            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-cyan-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              {isEdit ? 'Edit Address' : 'Add New Address'}
            </h1>
          </div>
          <p className="text-gray-400 ml-16">
            {isEdit
              ? 'Update your delivery address'
              : 'Add a new delivery address to your account'}
          </p>
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

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-cyan-500/20 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors"
                    placeholder="Enter phone number"
                    required
                  />
                </div>

                {/* Address Line 1 */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Address Line 1 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    className="w-full bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors"
                    placeholder="Street address"
                    required
                  />
                </div>

                {/* Address Line 2 */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Address Line 2 <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    className="w-full bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors"
                    placeholder="Apartment, suite, etc."
                  />
                </div>

                {/* City */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      City <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors"
                      placeholder="City"
                      required
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      State <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors"
                      placeholder="State"
                      required
                    />
                  </div>
                </div>

                {/* Postal Code */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Postal Code <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors"
                      placeholder="Postal code"
                      required
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-white font-semibold mb-2">Country</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
                    >
                      <option>India</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                {/* Default Address Checkbox */}
                <label className="flex items-center gap-3 p-4 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-800/30 transition-colors">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-300">Set as default address</span>
                </label>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : isEdit ? (
                    'Update Address'
                  ) : (
                    'Add Address'
                  )}
                </button>

                {/* Cancel Button */}
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full py-3 border border-gray-700 text-gray-300 rounded-lg font-semibold hover:bg-gray-800/50 transition-colors"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ManageAddressPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-cyan-400" /></div>}>
      <ManageAddressContent />
    </Suspense>
  );
}
