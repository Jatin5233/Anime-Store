'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // In a real application, you would send this to your backend
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });

      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border-b border-cyan-500/30 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Get In Touch</h1>
          <p className="text-gray-400 text-lg">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Email */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-cyan-500/20 p-6 hover:border-cyan-500/50 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Email</h3>
                  <a href="mailto:Info@Indi-street.com" className="text-cyan-400 hover:text-cyan-300 transition-colors break-all">
                    Info@Indi-street.com
                  </a>
                  <p className="text-gray-500 text-sm mt-2">We'll respond within 24 hours</p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-cyan-500/20 p-6 hover:border-cyan-500/50 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Phone</h3>
                  <a href="tel:+919355007774" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                    +91 9355007774
                  </a>
                  <p className="text-gray-500 text-sm mt-2">Available 9 AM - 6 PM IST</p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-cyan-500/20 p-6 hover:border-cyan-500/50 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Location</h3>
                  <p className="text-gray-400">
                    INDISTREET GLOBAL SERVICES PVT LTD<br />
                    India
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Quick Link */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-purple-600/10 rounded-xl border border-cyan-500/30 p-6">
              <h3 className="text-white font-bold mb-3">Have a quick question?</h3>
              <Link href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-semibold">
                Check our FAQ →
              </Link>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-cyan-500/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>

              {success && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-300 font-semibold">Message sent successfully!</p>
                    <p className="text-green-300/80 text-sm mt-1">Thank you for contacting us. We'll get back to you soon.</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-300">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-white font-semibold mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-white font-semibold mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-white font-semibold mb-2">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 9XXXXXXXXX"
                    className="w-full bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-white font-semibold mb-2">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    className="w-full bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-white font-semibold mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    rows={5}
                    className="w-full bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>

                <p className="text-gray-500 text-sm text-center">
                  * Required fields
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: 'What are your shipping times?',
                answer: 'We typically ship within 2-3 business days. Delivery time depends on your location and chosen shipping method.',
              },
              {
                question: 'Do you offer international shipping?',
                answer: 'Yes, we ship worldwide! International shipping rates and times vary based on destination.',
              },
              {
                question: 'What is your return policy?',
                answer: 'We offer 30-day returns on most items. Products must be unused and in original packaging.',
              },
              {
                question: 'How can I track my order?',
                answer: 'You can track your order anytime by visiting your account and viewing your order details.',
              },
              {
                question: 'Do you accept all payment methods?',
                answer: 'We accept credit/debit cards and UPI payments via Razorpay for secure transactions.',
              },
              {
                question: 'Is my information secure?',
                answer: 'Yes! We use industry-standard encryption to protect your personal and payment information.',
              },
            ].map((faq, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-lg border border-gray-700 p-6 hover:border-cyan-500/30 transition-colors">
                <h3 className="text-white font-bold mb-2">{faq.question}</h3>
                <p className="text-gray-400 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
