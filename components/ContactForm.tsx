'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

interface Artist {
  id: string;
  name: string;
}

interface FormLabels {
  name: string;
  email: string;
  country: string;
  date: string;
  artist: string;
  message: string;
  submit: string;
}

interface Props {
  artists: Artist[];
  labels: FormLabels;
  successMessage: string;
  errorMessage: string;
  sendingText: string;
  selectArtistPlaceholder: string;
}

export default function ContactForm({
  artists,
  labels,
  successMessage,
  errorMessage,
  sendingText,
  selectArtistPlaceholder,
}: Props) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    eventDate: '',
    artist: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          country: '',
          eventDate: '',
          artist: '',
          message: '',
        });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 md:space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
        <div>
          <label htmlFor="name" className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
            {labels.name} *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
            {labels.email} *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
        <div>
          <label htmlFor="country" className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
            {labels.country} *
          </label>
          <input
            type="text"
            id="country"
            name="country"
            required
            value={formData.country}
            onChange={handleChange}
            className="w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="eventDate" className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
            {labels.date}
          </label>
          <input
            type="date"
            id="eventDate"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            className="w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="artist" className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
          {labels.artist}
        </label>
        <select
          id="artist"
          name="artist"
          value={formData.artist}
          onChange={handleChange}
          className="w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        >
          <option value="">{selectArtistPlaceholder}</option>
          {artists.map((artist) => (
            <option key={artist.id} value={artist.name}>
              {artist.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
          {labels.message} *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          value={formData.message}
          onChange={handleChange}
          className="w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none md:rows-6"
        />
      </div>

      {status === 'success' && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-3 py-2 md:px-4 md:py-3 rounded-lg text-sm">
          {successMessage}
        </div>
      )}

      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 md:px-4 md:py-3 rounded-lg text-sm">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full bg-black text-white px-4 py-2.5 md:px-6 md:py-4 rounded-lg font-semibold text-sm md:text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {status === 'sending' ? (
          sendingText
        ) : (
          <>
            <Send className="w-4 h-4 md:w-5 md:h-5" />
            {labels.submit}
          </>
        )}
      </button>
    </form>
  );
}
