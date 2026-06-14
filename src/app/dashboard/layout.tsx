'use client';

import { useState } from 'react';
import ImageUploader from '@/components/dashboard/ImageUploader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showUploader, setShowUploader] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-primary-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-surface-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-card">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-800 font-display">
                  Ayna Clinic
                </h1>
                <p className="text-xs text-slate-500">Dashboard</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowUploader(!showUploader)}
                className={`
                  px-4 py-2 rounded-xl text-sm font-medium
                  transition-all duration-300 ease-out
                  ${showUploader
                    ? 'bg-primary-500 text-white shadow-card'
                    : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
                  }
                `}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {showUploader ? 'Hide Uploader' : 'Upload Image'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Uploader Panel */}
        {showUploader && (
          <div className="mb-8 animate-fade-up">
            <div className="bg-white rounded-3xl p-6 shadow-soft border border-surface-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-warm-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-800 font-display">
                    Blog Image Upload
                  </h2>
                  <p className="text-sm text-slate-500">
                    Upload images for your blog posts
                  </p>
                </div>
              </div>

              <ImageUploader
                onUploadComplete={(url) => setUploadedImageUrl(url)}
                currentImage={uploadedImageUrl}
                label="Featured Image"
              />

              {uploadedImageUrl && (
                <div className="mt-4 p-4 rounded-xl bg-primary-50 border border-primary-200">
                  <p className="text-sm text-primary-700">
                    <span className="font-medium">Image URL:</span>{' '}
                    <code className="text-primary-600">{uploadedImageUrl}</code>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Page Content */}
        <div className="animate-fade-up" style={{ animationDelay: '100ms' }}>
          {children}
        </div>
      </main>

      {/* Decorative Elements */}
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-primary-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/2 right-0 w-64 h-64 bg-gradient-to-bl from-warm-100/20 to-transparent rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
