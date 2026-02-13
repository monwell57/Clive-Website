'use client';

import React, { useState, useRef } from 'react';
import {
  Calendar, BookOpen, Users, Download, Mail,
  ChevronRight, FileText, Upload, CheckCircle,
  AlertCircle, X, Loader2
} from 'lucide-react';

interface UploadedFile {
  file: File;
  name: string;
  size: string;
}

interface UploadState {
  coverLetter: UploadedFile | null;
  resume: UploadedFile | null;
  application: UploadedFile | null;
  availabilityForm: UploadedFile | null;
}

type UploadField = keyof UploadState;

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function HomePage() {
  // Newsletter state
  const [email, setEmail] = useState('');
  const [journey, setJourney] = useState('');
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);
  const [isNewsletterSuccess, setIsNewsletterSuccess] = useState(false);

  // Application upload state
  const [uploads, setUploads] = useState<UploadState>({
    coverLetter: null,
    resume: null,
    application: null,
    availabilityForm: null,
  });
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fileErrors, setFileErrors] = useState<Partial<Record<UploadField, string>>>({});

  const fileRefs = {
    coverLetter: useRef<HTMLInputElement>(null),
    resume: useRef<HTMLInputElement>(null),
    application: useRef<HTMLInputElement>(null),
    availabilityForm: useRef<HTMLInputElement>(null),
  };

  const handleFileChange = (field: UploadField) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setFileErrors(prev => ({ ...prev, [field]: 'File exceeds 10MB limit' }));
      return;
    }

    if (file.type !== 'application/pdf') {
      setFileErrors(prev => ({ ...prev, [field]: 'Please upload a PDF file' }));
      return;
    }

    setFileErrors(prev => ({ ...prev, [field]: undefined }));
    setUploads(prev => ({
      ...prev,
      [field]: {
        file,
        name: file.name,
        size: formatFileSize(file.size),
      }
    }));
  };

  const removeFile = (field: UploadField) => {
    setUploads(prev => ({ ...prev, [field]: null }));
    if (fileRefs[field].current) fileRefs[field].current!.value = '';
  };

  const allFilesUploaded = Object.values(uploads).every(Boolean);

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allFilesUploaded) return;

    setSubmitStatus('submitting');
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('applicantName', applicantName);
      formData.append('applicantEmail', applicantEmail);
      formData.append('coverLetter', uploads.coverLetter!.file);
      formData.append('resume', uploads.resume!.file);
      formData.append('application', uploads.application!.file);
      formData.append('availabilityForm', uploads.availabilityForm!.file);

      const response = await fetch('/api/apply', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSubmitStatus('success');
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
        setSubmitStatus('error');
      }
    } catch {
      setErrorMessage('Failed to submit. Please check your connection and try again.');
      setSubmitStatus('error');
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsNewsletterSubmitting(true);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, journey }),
      });

      if (response.ok) {
        setIsNewsletterSuccess(true);
      }
    } catch {
      console.error('Newsletter signup failed');
    } finally {
      setIsNewsletterSubmitting(false);
    }
  };

  const uploadFields: { field: UploadField; label: string; description: string }[] = [
    { field: 'coverLetter', label: 'Cover Letter', description: 'PDF, max 10MB' },
    { field: 'resume', label: 'Resume / CV', description: 'PDF, max 10MB' },
    { field: 'application', label: 'Completed Application', description: 'PDF, max 10MB' },
    { field: 'availabilityForm', label: 'Completed Availability Form', description: 'PDF, max 10MB' },
  ];

  const downloadDocs = [
    {
      title: 'Application Form',
      description: '4-page internship application. Complete and upload with your submission.',
      icon: FileText,
      filename: 'application-form.pdf',
      pages: '4 pages',
      accent: '#e6b84d',
    },
    {
      title: 'Availability Form',
      description: 'Indicate your weekly schedule and available hours for the training year.',
      icon: Calendar,
      filename: 'availability-form.pdf',
      pages: '1 page',
      accent: '#e6b84d',
    },
    {
      title: 'Training Schedule',
      description: 'Review the full 2026-2027 training schedule before applying.',
      icon: BookOpen,
      filename: 'training-schedule.pdf',
      pages: '1 page',
      accent: '#e6b84d',
    },
  ];

  const newsletterIssues = [
    {
      issue: 'Issue 4', date: 'June 2026',
      title: 'What Supervisors Actually Look For',
      excerpt: 'Beyond the credentials—how to demonstrate clinical judgment in your application materials.',
      readTime: '6 min read', topics: ['Career Advice', 'Applications']
    },
    {
      issue: 'Issue 3', date: 'May 2026',
      title: 'Understanding Training Site Culture',
      excerpt: 'Questions to ask during internship interviews that reveal whether a site will truly support your development.',
      readTime: '5 min read', topics: ['Internship', 'Career Advice']
    },
    {
      issue: 'Issue 2', date: 'April 2026',
      title: 'Cultural Formulation in Practice',
      excerpt: 'Moving beyond theoretical frameworks to actual clinical application—with case examples.',
      readTime: '8 min read', topics: ['Cultural Competence', 'Clinical Skills']
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f0e8]">

      {/* ── NAVIGATION ── */}
      <nav className="fixed top-0 w-full bg-[#f5f0e8]/90 backdrop-blur-md z-50 border-b border-[#8b7355]/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-[#e6b84d] rounded-lg flex items-center justify-center">
              <span className="text-[#2d2d2d] font-bold text-xl">SC</span>
            </div>
            <div>
              <h1 className="text-[#2d2d2d] font-semibold text-lg leading-tight">South Central Training Consortium</h1>
              <p className="text-[#8b7355] text-xs">Clinical Psychology Training</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#apply" className="text-[#2d2d2d] hover:text-[#e6b84d] transition-colors font-medium">Apply</a>
            <a href="#field-notes" className="text-[#2d2d2d] hover:text-[#e6b84d] transition-colors">Field Notes</a>
            <a href="#resources" className="text-[#2d2d2d] hover:text-[#e6b84d] transition-colors">Resources</a>
            <a href="#about" className="text-[#2d2d2d] hover:text-[#e6b84d] transition-colors">About</a>
            <a href="#contact" className="text-[#2d2d2d] hover:text-[#e6b84d] transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <span className="inline-block bg-[#e6b84d]/20 text-[#c99a3d] px-4 py-2 rounded-full text-sm font-medium border border-[#e6b84d]/30">
              Fall 2026 Applications Open September
            </span>

            <h2 className="text-5xl lg:text-6xl font-bold text-[#2d2d2d] leading-tight">
              Clinical Psychology Training:
              <span className="block text-[#e6b84d] mt-2">The Reality Behind the Practice</span>
            </h2>

            <p className="text-xl text-[#3d3d3d] leading-relaxed">
              Monthly field notes on cultural competence, clinical supervision, and building a psychology practice from the ground up—straight from South Central LA.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="#apply"
                className="group bg-[#e6b84d] hover:bg-[#c99a3d] text-[#2d2d2d] px-8 py-4 rounded-lg font-bold transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 hover:shadow-xl"
              >
                <FileText className="w-5 h-5" />
                <span>Apply Now</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#field-notes"
                className="group border-2 border-[#3d3d3d] hover:border-[#e6b84d] text-[#2d2d2d] px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Mail className="w-5 h-5" />
                <span>Get Field Notes</span>
              </a>
            </div>

            <p className="text-sm text-[#8b7355]">
              Application season moves fast. Get 8 months of field notes before the next cycle.
            </p>
          </div>

          {/* Hero Card */}
          <div className="relative animate-fade-in-up animation-delay-200">
            <div className="bg-[#3d3d3d] rounded-2xl p-8 shadow-2xl">
              <div className="aspect-[4/3] bg-white/5 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#e6b84d]/10 to-transparent" />
                <div className="relative z-10 text-center p-8">
                  <div className="w-32 h-32 bg-[#e6b84d]/20 rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-[#e6b84d]/30">
                    <BookOpen className="w-16 h-16 text-[#e6b84d]" />
                  </div>
                  <p className="text-[#f5f0e8]/90 text-lg font-medium">Dr. Clive D. Kennedy</p>
                  <p className="text-[#f5f0e8]/60 text-sm mt-2">Training Director</p>
                  <p className="text-[#f5f0e8]/60 text-xs mt-1">The Chicago School of Professional Psychology</p>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between text-[#f5f0e8]/80 text-sm">
                <span className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-[#e6b84d]" />
                  <span>200+ Students</span>
                </span>
                <span className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-[#e6b84d]" />
                  <span>24+ Years Experience</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DOWNLOADS ── */}
      <section id="apply" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block bg-[#e6b84d]/20 text-[#c99a3d] px-4 py-2 rounded-full text-sm font-bold mb-4">
              STEP 1 OF 2
            </span>
            <h3 className="text-4xl font-bold text-[#2d2d2d] mb-4">Download Your Documents</h3>
            <p className="text-[#3d3d3d] text-lg max-w-2xl mx-auto">
              Download, complete, and sign all required forms before submitting your application.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {downloadDocs.map((doc, index) => {
              const IconComponent = doc.icon;
              return (
                <div
                  key={index}
                  className="bg-[#f5f0e8] rounded-xl p-8 border-2 border-[#8b7355]/10 hover:border-[#e6b84d]/50 transition-all duration-300 group transform hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="w-14 h-14 bg-[#e6b84d]/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#e6b84d]/30 transition-colors">
                    <IconComponent className="w-7 h-7 text-[#e6b84d]" />
                  </div>

                  <h4 className="text-xl font-bold text-[#2d2d2d] mb-2">{doc.title}</h4>
                  <p className="text-[#3d3d3d] text-sm leading-relaxed mb-2">{doc.description}</p>
                  <p className="text-[#8b7355] text-xs mb-6">{doc.pages} • PDF</p>

                  <a
                    href={`/${doc.filename}`}
                    download={doc.filename}
                    className="w-full bg-[#e6b84d] hover:bg-[#c99a3d] text-[#2d2d2d] py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download</span>
                  </a>
                </div>
              );
            })}
          </div>

          <div className="mt-12 bg-[#e6b84d]/10 border border-[#e6b84d]/30 rounded-xl p-6 text-center">
            <p className="text-[#2d2d2d] font-medium">
              📋 Complete the <strong>Application Form</strong> and <strong>Availability Form</strong> before uploading below.
              Review the <strong>Training Schedule</strong> to confirm you can meet all requirements.
            </p>
          </div>
        </div>
      </section>

      {/* ── UPLOAD / SUBMIT ── */}
      <section className="py-20 px-6 bg-[#3d3d3d]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-[#e6b84d]/20 text-[#e6b84d] px-4 py-2 rounded-full text-sm font-bold mb-4">
              STEP 2 OF 2
            </span>
            <h3 className="text-4xl font-bold text-[#f5f0e8] mb-4">Submit Your Application</h3>
            <p className="text-[#f5f0e8]/80 text-lg max-w-2xl mx-auto">
              Upload all four required documents to complete your application. PDF format only, 10MB max per file.
            </p>
          </div>

          {submitStatus === 'success' ? (
            <div className="bg-[#f5f0e8] rounded-2xl p-12 text-center animate-scale-in">
              <div className="w-20 h-20 bg-[#e6b84d]/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-[#e6b84d]" />
              </div>
              <h4 className="text-2xl font-bold text-[#2d2d2d] mb-3">Application Submitted!</h4>
              <p className="text-[#3d3d3d] mb-3">
                Thank you, <strong>{applicantName}</strong>. Your application has been received.
              </p>
              <p className="text-[#3d3d3d] mb-6">
                A confirmation has been sent to <strong>{applicantEmail}</strong>. Dr. Kennedy's team will be in touch within 5-7 business days.
              </p>
              <p className="text-[#8b7355] text-sm">
                While you wait, explore our Field Notes newsletter below for insights on clinical training.
              </p>
            </div>
          ) : (
            <form onSubmit={handleApplicationSubmit} className="bg-[#f5f0e8] rounded-2xl p-8 shadow-2xl">
              {/* Applicant Info */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-[#2d2d2d] font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={applicantName}
                    onChange={e => setApplicantName(e.target.value)}
                    placeholder="Your full name"
                    required
                    className="w-full px-4 py-3 border-2 border-[#8b7355]/30 rounded-lg focus:border-[#e6b84d] focus:outline-none focus:ring-2 focus:ring-[#e6b84d]/20 transition-all bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[#2d2d2d] font-medium mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={applicantEmail}
                    onChange={e => setApplicantEmail(e.target.value)}
                    placeholder="your.email@university.edu"
                    required
                    className="w-full px-4 py-3 border-2 border-[#8b7355]/30 rounded-lg focus:border-[#e6b84d] focus:outline-none focus:ring-2 focus:ring-[#e6b84d]/20 transition-all bg-white"
                  />
                </div>
              </div>

              {/* File Upload Fields */}
              <div className="space-y-4 mb-8">
                <h4 className="text-[#2d2d2d] font-bold text-lg">Required Documents</h4>
                {uploadFields.map(({ field, label, description }) => (
                  <div key={field}>
                    <div
                      className={`border-2 border-dashed rounded-xl p-5 transition-all duration-300 ${
                        uploads[field]
                          ? 'border-[#e6b84d] bg-[#e6b84d]/5'
                          : fileErrors[field]
                          ? 'border-red-400 bg-red-50'
                          : 'border-[#8b7355]/30 bg-white hover:border-[#e6b84d]/50 hover:bg-[#e6b84d]/5'
                      }`}
                    >
                      {uploads[field] ? (
                        // File uploaded state
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="w-6 h-6 text-[#e6b84d] flex-shrink-0" />
                            <div>
                              <p className="text-[#2d2d2d] font-medium text-sm">{uploads[field]!.name}</p>
                              <p className="text-[#8b7355] text-xs">{uploads[field]!.size}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(field)}
                            className="p-1 hover:bg-[#8b7355]/10 rounded-lg transition-colors"
                          >
                            <X className="w-5 h-5 text-[#8b7355]" />
                          </button>
                        </div>
                      ) : (
                        // Empty state
                        <div
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => fileRefs[field].current?.click()}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-[#8b7355]/10 rounded-lg flex items-center justify-center">
                              <Upload className="w-5 h-5 text-[#8b7355]" />
                            </div>
                            <div>
                              <p className="text-[#2d2d2d] font-medium">{label}</p>
                              <p className="text-[#8b7355] text-sm">{description}</p>
                            </div>
                          </div>
                          <span className="text-[#e6b84d] font-medium text-sm hover:text-[#c99a3d] transition-colors">
                            Browse
                          </span>
                        </div>
                      )}
                    </div>
                    {fileErrors[field] && (
                      <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{fileErrors[field]}</span>
                      </p>
                    )}
                    <input
                      ref={fileRefs[field]}
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange(field)}
                      className="hidden"
                    />
                  </div>
                ))}
              </div>

              {/* Progress indicator */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#2d2d2d] text-sm font-medium">
                    {Object.values(uploads).filter(Boolean).length} of 4 documents uploaded
                  </span>
                  <span className="text-[#8b7355] text-sm">
                    {allFilesUploaded ? '✅ Ready to submit' : 'Upload all 4 to continue'}
                  </span>
                </div>
                <div className="w-full bg-[#8b7355]/20 rounded-full h-2">
                  <div
                    className="bg-[#e6b84d] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(Object.values(uploads).filter(Boolean).length / 4) * 100}%` }}
                  />
                </div>
              </div>

              {/* Error message */}
              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{errorMessage}</p>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={!allFilesUploaded || !applicantName || !applicantEmail || submitStatus === 'submitting'}
                className="w-full bg-[#e6b84d] hover:bg-[#c99a3d] text-[#2d2d2d] font-bold py-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
              >
                {submitStatus === 'submitting' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span>Submit Application</span>
                  </>
                )}
              </button>

              <p className="text-center text-[#8b7355] text-sm mt-4">
                You'll receive a confirmation email once submitted. Dr. Kennedy's team will follow up within 5-7 business days.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── FIELD NOTES ── */}
      <section id="field-notes" className="py-20 px-6 bg-[#f5f0e8]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-[#2d2d2d] mb-4">Field Notes</h3>
            <p className="text-[#3d3d3d] text-lg max-w-2xl mx-auto">
              Monthly insights on cultural competence, clinical supervision, and building a psychology practice.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {newsletterIssues.map((note, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-2"
              >
                <div className="h-2 bg-gradient-to-r from-[#e6b84d] to-[#c99a3d]" />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[#8b7355] text-sm font-medium">{note.issue}</span>
                    <span className="text-[#8b7355] text-sm">{note.date}</span>
                  </div>
                  <h4 className="text-xl font-bold text-[#2d2d2d] mb-3 group-hover:text-[#e6b84d] transition-colors">
                    {note.title}
                  </h4>
                  <p className="text-[#3d3d3d] text-sm leading-relaxed mb-4">{note.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {note.topics.map((topic, i) => (
                      <span key={i} className="text-xs bg-[#f5f0e8] text-[#8b7355] px-3 py-1 rounded-full">
                        {topic}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-[#8b7355]/10">
                    <span className="text-xs text-[#8b7355]">{note.readTime}</span>
                    <a href="#newsletter-signup" className="text-sm text-[#e6b84d] hover:text-[#c99a3d] font-medium flex items-center space-x-1">
                      <span>Subscribe to read</span>
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Newsletter Signup */}
          <div id="newsletter-signup" className="bg-[#3d3d3d] rounded-2xl p-10 max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h4 className="text-3xl font-bold text-[#f5f0e8] mb-3">Join Field Notes</h4>
              <p className="text-[#f5f0e8]/80">Monthly insights for the next generation of clinical psychologists.</p>
            </div>

            {!isNewsletterSuccess ? (
              <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your.email@university.edu"
                  required
                  className="w-full px-4 py-3 border-2 border-[#8b7355]/30 rounded-lg focus:border-[#e6b84d] focus:outline-none bg-[#f5f0e8] transition-all"
                />
                <select
                  value={journey}
                  onChange={e => setJourney(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-[#8b7355]/30 rounded-lg focus:border-[#e6b84d] focus:outline-none bg-[#f5f0e8] transition-all"
                >
                  <option value="">Where are you in your journey?</option>
                  <option value="exploring">Exploring clinical psychology (undergrad/early grad)</option>
                  <option value="applying">Preparing for internship applications (3rd-4th year)</option>
                  <option value="postdoc">Seeking post-doc/supervision hours</option>
                  <option value="licensed">Licensed professional seeking consultation</option>
                </select>
                <button
                  type="submit"
                  disabled={isNewsletterSubmitting}
                  className="w-full bg-[#e6b84d] hover:bg-[#c99a3d] text-[#2d2d2d] font-bold py-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isNewsletterSubmitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /><span>Subscribing...</span></>
                  ) : (
                    <><Mail className="w-5 h-5" /><span>Subscribe to Field Notes</span></>
                  )}
                </button>
                <p className="text-center text-[#f5f0e8]/60 text-sm">Join 200+ students. Unsubscribe anytime.</p>
              </form>
            ) : (
              <div className="text-center py-8 animate-scale-in">
                <div className="w-16 h-16 bg-[#e6b84d]/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-[#e6b84d]" />
                </div>
                <h5 className="text-xl font-bold text-[#f5f0e8] mb-2">You're in!</h5>
                <p className="text-[#f5f0e8]/80">Check your email for your first Field Notes issue.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-20 px-6 bg-[#3d3d3d]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-2">
            <div className="aspect-square bg-white/5 rounded-2xl flex items-center justify-center border-2 border-[#e6b84d]/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#e6b84d]/10 to-transparent" />
              <div className="relative z-10 text-center p-8">
                <div className="w-48 h-48 bg-[#e6b84d]/20 rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-[#e6b84d]/30">
                  <Users className="w-24 h-24 text-[#e6b84d]" />
                </div>
                <p className="text-[#f5f0e8] text-sm opacity-60">Dr. Kennedy — Placeholder Image</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <blockquote className="text-2xl text-[#f5f0e8] italic border-l-4 border-[#e6b84d] pl-6">
              "When I was a grad student, nobody told me how to navigate the real challenges of clinical practice. This is what I wish I'd had."
            </blockquote>
            <div className="space-y-4 text-[#f5f0e8]/90 leading-relaxed">
              <p>I'm a product of South Central Los Angeles, shaped by community resilience and the complexities of serving diverse populations. For over two decades, I've worked at the intersection of clinical psychology, cultural competence, and practical training.</p>
              <p>Field Notes is my way of sharing what I've learned—not the sanitized textbook version, but the reality of building a meaningful clinical practice.</p>
            </div>
            <div className="flex flex-wrap gap-4 pt-6">
              {['The Chicago School of Professional Psychology', '24+ Years Clinical Experience', 'Cultural Competence Specialist'].map((item, i) => (
                <div key={i} className="flex items-center space-x-2 text-[#f5f0e8]/80">
                  <div className="w-2 h-2 bg-[#e6b84d] rounded-full" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── RESOURCES ── */}
      <section id="resources" className="py-20 px-6 bg-[#f5f0e8]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-[#2d2d2d] mb-4">Training Resources</h3>
            <p className="text-[#3d3d3d] text-lg max-w-2xl mx-auto">Curated tools and guides for developing clinical competence.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { type: 'Video', title: 'Cultural Assessment Framework', desc: '15-minute walkthrough of the assessment process.', meta: '15 min' },
              { type: 'PDF', title: 'Clinical Documentation Checklist', desc: 'Essential elements for progress notes and assessments.', meta: '8 pages' },
              { type: 'Article', title: 'Supervision: What to Expect', desc: 'How supervision works—structure, expectations, growth.', meta: '6 min read' },
            ].map((r, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-2 p-6">
                <span className="text-xs bg-[#e6b84d]/20 text-[#c99a3d] px-3 py-1 rounded-full font-medium">{r.type}</span>
                <h4 className="text-lg font-bold text-[#2d2d2d] mt-4 mb-2 group-hover:text-[#e6b84d] transition-colors">{r.title}</h4>
                <p className="text-[#3d3d3d] text-sm leading-relaxed mb-4">{r.desc}</p>
                <p className="text-xs text-[#8b7355]">{r.meta}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer id="contact" className="bg-[#2d2d2d] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-[#e6b84d] rounded-lg flex items-center justify-center">
                  <span className="text-[#2d2d2d] font-bold">SC</span>
                </div>
                <div>
                  <h4 className="text-[#f5f0e8] font-semibold">South Central Training Consortium</h4>
                  <p className="text-[#f5f0e8]/60 text-xs">Clinical Psychology Training</p>
                </div>
              </div>
              <p className="text-[#f5f0e8]/70 text-sm leading-relaxed">
                Training the next generation of culturally competent clinical psychologists.
              </p>
            </div>
            <div>
              <h5 className="text-[#f5f0e8] font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2">
                {['Apply', 'Field Notes', 'Resources', 'About'].map(link => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase().replace(' ', '-')}`} className="text-[#f5f0e8]/70 hover:text-[#e6b84d] text-sm transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-[#f5f0e8]/10 pt-8 text-center">
            <p className="text-[#f5f0e8]/60 text-sm">© 2026 South Central Training Consortium. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}