'use client';

import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import { Button } from '../../../components/ui/button';

// Mock data
const MOCK_CERTIFICATES = [
 { id: 1, course_title: 'Advanced React Patterns', issued_at: '2023-11-15T10:00:00Z', verification_code: 'CERT-A1B2-C3D4-E5F6' },
 { id: 2, course_title: 'Node.js Microservices', issued_at: '2024-02-20T14:30:00Z', verification_code: 'CERT-X9Y8-Z7W6-V5U4' },
];

export default function CertificatesPage() {
 const { user } = useAppSelector((state) => state.auth);

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

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
 {MOCK_CERTIFICATES.map((cert) => (
 <div key={cert.id} className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-slate-200 flex flex-col items-center text-center">
 <div className="h-20 w-20 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-amber-500/30">
 <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
 </svg>
 </div>
 
 <h3 className="text-lg font-bold text-slate-900 line-clamp-2 min-h-[3.5rem]">
 {cert.course_title}
 </h3>
 
 <p className="text-sm text-slate-500 mt-2">
 Issued: {new Date(cert.issued_at).toLocaleDateString()}
 </p>
 <p className="text-xs text-slate-400 mt-1 font-mono">
 ID: {cert.verification_code}
 </p>
 
 <div className="mt-6 flex w-full gap-3">
 <Button variant="primary" className="flex-1">
 Download PDF
 </Button>
 </div>
 </div>
 ))}
 </div>
 </div>
 );
}
