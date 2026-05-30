'use client';

import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../../store/hooks';
import { Button } from '../../../components/ui/button';
import apiClient from '../../../lib/api/client';

export default function CertificatesPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const { data } = await apiClient.get('/me/certificates');
        setCertificates(data);
      } catch (err) {
        console.error('Failed to load certificates', err);
      } finally {
        setIsLoading(false);
      }
    };
    if (user?.role !== 'teacher') {
      fetchCertificates();
    }
  }, [user]);

  if (user?.role === 'teacher') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-900 ">Certificates Module</h2>
        <p className="mt-2 text-slate-600 ">
          Teachers do not earn certificates. You can view student certificates from individual student profiles.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 ">
          My Certificates
        </h1>
        <p className="mt-2 text-sm text-slate-600 ">
          View and download your earned certificates for completed courses.
        </p>
      </header>

      {isLoading ? (
        <div className="py-12 flex justify-center">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-slate-200 h-10 w-10"></div>
            <div className="flex-1 space-y-6 py-1 w-48">
              <div className="h-2 bg-slate-200 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                  <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      ) : certificates.length === 0 ? (
        <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
          You haven't earned any certificates yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {certificates.map((cert) => (
            <div key={cert.id} className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-slate-200 flex flex-col items-center text-center">
              <div className="h-20 w-20 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-amber-500/30">
                <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>

              <h3 className="text-lg font-bold text-slate-900 line-clamp-2 min-h-[3.5rem]">
                {cert.course_title || `Course ID: ${cert.course_id}`}
              </h3>

              <p className="text-sm text-slate-500 mt-2">
                Issued: {new Date(cert.issued_at).toLocaleDateString()}
              </p>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                ID: {cert.verification_code}
              </p>

              <div className="mt-6 flex w-full gap-3">
                <a 
                  href={`http://localhost:3001${cert.pdf_url}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex-1"
                >
                  <Button variant="primary" className="w-full">
                    Download PDF
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
