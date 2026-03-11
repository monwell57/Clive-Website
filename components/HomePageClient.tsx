// Path: components/HomePageClient.tsx

'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
	Calendar,
	BookOpen,
	Users,
	Download,
	Mail,
	ChevronRight,
	FileText,
	Upload,
	CheckCircle,
	AlertCircle,
	X,
	Loader2,
	ClipboardList,
	Menu,
} from 'lucide-react';
import TestimonialsSection from '@/components/TestimonialsSection';

// ===== NAV LINKS (ordered to match page flow) =====
const navLinks = [
	{ label: 'Apply', href: '#apply' },
	{ label: 'About', href: '#about' },
	{ label: 'Testimonials', href: '#testimonials' },
	{ label: 'Newsletter', href: '#newsletter' },
	{ label: 'Resources', href: '#resources' },
	{ label: 'Contact', href: '#contact' },
];

// ===== MOBILE NAV COMPONENT =====
function MobileNav({ doctorName }: { doctorName: string }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<nav className="fixed top-0 w-full bg-warm-cream/90 backdrop-blur-md z-50 border-b border-warm-taupe/20 transition-all duration-300">
			<div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
				<div className="flex items-center space-x-3">
					<div>
						<h1 className="text-rich-black font-semibold text-lg leading-tight">
							{doctorName}
						</h1>
						<p className="text-warm-taupe text-xs">SCTC Training Director</p>
					</div>
				</div>

				{/* Desktop nav */}
				<div className="hidden md:flex items-center space-x-8">
					{navLinks.map((link) => (
						<a
							key={link.label}
							href={link.href}
							className="text-rich-black hover:text-golden-yellow transition-colors font-medium"
						>
							{link.label}
						</a>
					))}
				</div>

				{/* Mobile hamburger button */}
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-warm-taupe/10 transition-colors"
					aria-label="Toggle menu"
				>
					{isOpen ? (
						<X className="w-6 h-6 text-rich-black" />
					) : (
						<Menu className="w-6 h-6 text-rich-black" />
					)}
				</button>
			</div>

			{/* Mobile menu drawer */}
			{isOpen && (
				<div className="md:hidden bg-warm-cream border-t border-warm-taupe/15 shadow-lg animate-fade-in-up">
					<div className="px-6 py-4 space-y-1">
						{navLinks.map((link) => (
							<a
								key={link.label}
								href={link.href}
								onClick={() => setIsOpen(false)}
								className="block py-3 px-4 text-rich-black hover:text-golden-yellow hover:bg-golden-yellow/5 rounded-lg transition-all font-medium"
							>
								{link.label}
							</a>
						))}
					</div>
				</div>
			)}
		</nav>
	);
}

// ===== TYPES =====
interface SanitySlug {
	current: string;
}

interface SanityFileAsset {
	asset?: { _id?: string; url?: string };
}

interface SanityImage {
	asset?: { _id?: string; url?: string };
	alt?: string;
}

interface SiteSettings {
	siteTitle: string;
	siteDescription: string;
	doctorName: string;
	doctorTitle: string;
	doctorHeadshot: SanityImage | null;
	doctorBio: Array<{
		_type: string;
		_key: string;
		style?: string;
		children?: Array<{ text: string }>;
	}>;
	doctorQuote: string;
	heroHeadline: string;
	heroSubheadline: string;
	heroBadgeText: string;
	newsletterName: string;
	newsletterTagline: string;
	contactEmail: string;
	applicationEmail: string;
	stats: Array<{ _key: string; number: string; label: string }>;
}

interface DownloadableDocument {
	_id: string;
	title: string;
	slug: SanitySlug;
	description: string;
	file: SanityFileAsset | null;
	icon: string;
	sortOrder: number;
	lastUpdated: string;
}

interface Testimonial {
	_id: string;
	name: string;
	title: string;
	cohortYear?: string;
	institution?: string;
	quote: string;
	headshot?: SanityImage | null;
}

interface NewsletterIssue {
	_id: string;
	title: string;
	slug: SanitySlug;
	issueNumber: number;
	publishDate: string;
	excerpt: string;
	category: string;
	readTimeMinutes: number;
	isSubscriberOnly: boolean;
}

interface HomePageClientProps {
	settings: SiteSettings;
	documents: DownloadableDocument[];
	testimonials: Testimonial[];
	newsletterIssues: NewsletterIssue[];
}

// ===== UPLOAD TYPES =====
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

const MAX_FILE_SIZE = 10 * 1024 * 1024;

// ===== ICON MAP =====
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
	fileText: FileText,
	calendar: Calendar,
	clipboardList: ClipboardList,
};

// ===== CATEGORY LABELS =====
const categoryLabels: Record<string, string> = {
	'forensic-evaluations': 'Forensic Evaluations',
	'cultural-competence': 'Cultural Competence',
	'career-advice': 'Career Advice',
	'clinical-supervision': 'Clinical Supervision',
	'case-studies': 'Case Studies',
	'field-updates': 'Field Updates',
};

// ===== COMPONENT =====
export default function HomePageClient({
	settings,
	documents,
	testimonials,
	newsletterIssues,
}: HomePageClientProps) {
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
	const [fileErrors, setFileErrors] = useState<
		Partial<Record<UploadField, string>>
	>({});

	const fileRefs = {
		coverLetter: useRef<HTMLInputElement>(null),
		resume: useRef<HTMLInputElement>(null),
		application: useRef<HTMLInputElement>(null),
		availabilityForm: useRef<HTMLInputElement>(null),
	};

	const handleFileChange =
		(field: UploadField) => (e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) return;
			if (file.size > MAX_FILE_SIZE) {
				setFileErrors((prev) => ({
					...prev,
					[field]: 'File exceeds 10MB limit',
				}));
				return;
			}
			if (file.type !== 'application/pdf') {
				setFileErrors((prev) => ({
					...prev,
					[field]: 'Please upload a PDF file',
				}));
				return;
			}
			setFileErrors((prev) => ({ ...prev, [field]: undefined }));
			setUploads((prev) => ({
				...prev,
				[field]: { file, name: file.name, size: formatFileSize(file.size) },
			}));
		};

	const removeFile = (field: UploadField) => {
		setUploads((prev) => ({ ...prev, [field]: null }));
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
				setErrorMessage(
					data.error || 'Something went wrong. Please try again.',
				);
				setSubmitStatus('error');
			}
		} catch {
			setErrorMessage(
				'Failed to submit. Please check your connection and try again.',
			);
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
			if (response.ok) setIsNewsletterSuccess(true);
		} catch {
			console.error('Newsletter signup failed');
		} finally {
			setIsNewsletterSubmitting(false);
		}
	};

	const uploadFields: {
		field: UploadField;
		label: string;
		description: string;
	}[] = [
		{
			field: 'coverLetter',
			label: 'Cover Letter',
			description: 'PDF, max 10MB',
		},
		{ field: 'resume', label: 'Resume / CV', description: 'PDF, max 10MB' },
		{
			field: 'application',
			label: 'Completed Application',
			description: 'PDF, max 10MB',
		},
		{
			field: 'availabilityForm',
			label: 'Completed Availability Form',
			description: 'PDF, max 10MB',
		},
	];

	// Limit newsletter preview to 3 most recent
	const previewIssues = newsletterIssues.slice(0, 3);

	return (
		<div className="min-h-screen bg-warm-cream">
			{/* ── NAVIGATION ── */}
			<MobileNav doctorName={settings.doctorName} />

			{/* ── HERO ── */}
			<section className="pt-32 pb-20 px-6">
				<div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
					<div className="space-y-8 animate-fade-in-up">
						<span className="inline-block bg-golden-yellow/20 text-deep-gold px-4 py-2 rounded-full text-sm font-medium border border-golden-yellow/30">
							{settings.heroBadgeText}
						</span>

						<h2 className="text-5xl lg:text-6xl font-bold text-rich-black leading-tight">
							{settings.heroHeadline.includes(':') ? (
								<>
									{settings.heroHeadline.split(':')[0]}:
									<span className="block text-golden-yellow mt-2">
										{settings.heroHeadline.split(':').slice(1).join(':')}
									</span>
								</>
							) : (
								settings.heroHeadline
							)}
						</h2>

						<p className="text-xl text-charcoal-gray leading-relaxed">
							{settings.heroSubheadline}
						</p>

						<div className="flex flex-col sm:flex-row gap-4 pt-4">
							<a
								href="#apply"
								className="group bg-golden-yellow hover:bg-deep-gold text-rich-black px-8 py-4 rounded-lg font-bold transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 hover:shadow-xl"
							>
								<FileText className="w-5 h-5" />
								<span>Apply Now</span>
								<ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
							</a>
							<a
								href="#newsletter"
								className="group border-2 border-charcoal-gray hover:border-golden-yellow text-rich-black px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
							>
								<Mail className="w-5 h-5" />
								<span>Get {settings.newsletterName}</span>
							</a>
						</div>

						<p className="text-sm text-warm-taupe">
							Application season moves fast. Get 8 months of insights before the
							next cycle.
						</p>
					</div>

					{/* Hero Card — Full-bleed photo */}
					<div className="relative animate-fade-in-up animation-delay-200">
						<div className="bg-charcoal-gray rounded-2xl shadow-2xl overflow-hidden">
							<div className="aspect-4/3 relative">
								{settings.doctorHeadshot?.asset?.url ? (
									<>
										<Image
											src={settings.doctorHeadshot.asset.url}
											alt={settings.doctorHeadshot.alt || settings.doctorName}
											fill
											className="object-cover object-[center_20%]"
											priority
										/>
										{/* Gradient overlay for text readability */}
										<div className="absolute inset-0 bg-linear-to-t from-charcoal-gray via-charcoal-gray/40 to-transparent" />
										{/* Name/title overlay at bottom */}
										<div className="absolute bottom-0 left-0 right-0 p-8">
											<p className="text-warm-cream text-xl font-bold">
												{settings.doctorName}
											</p>
											<p className="text-warm-cream/70 text-sm mt-1">
												{settings.doctorTitle || 'Training Director'}
											</p>
										</div>
									</>
								) : (
									<div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-golden-yellow/10 to-transparent">
										<div className="text-center p-8">
											<div className="w-32 h-32 bg-golden-yellow/20 rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-golden-yellow/30">
												<BookOpen className="w-16 h-16 text-golden-yellow" />
											</div>
											<p className="text-warm-cream/90 text-lg font-medium">
												{settings.doctorName}
											</p>
											<p className="text-warm-cream/60 text-sm mt-2">
												{settings.doctorTitle || 'Training Director'}
											</p>
										</div>
									</div>
								)}
							</div>
							<div className="px-8 py-5 flex items-center justify-between text-warm-cream/80 text-sm">
								{settings.stats?.slice(0, 2).map((stat) => (
									<span key={stat._key} className="flex items-center space-x-2">
										<Users className="w-4 h-4 text-golden-yellow" />
										<span>
											{stat.number} {stat.label}
										</span>
									</span>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ── DOWNLOADS (from Sanity) ── */}
			<section id="apply" className="py-20 px-6 bg-white">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<span className="inline-block bg-golden-yellow/20 text-deep-gold px-4 py-2 rounded-full text-sm font-bold mb-4">
							STEP 1 OF 2
						</span>
						<h3 className="text-4xl font-bold text-rich-black mb-4">
							Download Your Documents
						</h3>
						<p className="text-charcoal-gray text-lg max-w-2xl mx-auto">
							Download, complete, and sign all required forms before submitting
							your application.
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						{documents.map((doc) => {
							const IconComponent = iconMap[doc.icon] || FileText;
							const downloadUrl = doc.file?.asset?.url || null;

							return (
								<div
									key={doc._id}
									className="bg-warm-cream rounded-xl p-8 border-2 border-warm-taupe/10 hover:border-golden-yellow/50 transition-all duration-300 group transform hover:-translate-y-2 hover:shadow-xl"
								>
									<div className="w-14 h-14 bg-golden-yellow/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-golden-yellow/30 transition-colors">
										<IconComponent className="w-7 h-7 text-golden-yellow" />
									</div>
									<h4 className="text-xl font-bold text-rich-black mb-2">
										{doc.title}
									</h4>
									<p className="text-charcoal-gray text-sm leading-relaxed mb-2">
										{doc.description}
									</p>
									{doc.lastUpdated && (
										<p className="text-warm-taupe text-xs mb-6">
											Updated{' '}
											{new Date(doc.lastUpdated).toLocaleDateString('en-US', {
												month: 'long',
												year: 'numeric',
											})}{' '}
											• PDF
										</p>
									)}
									{downloadUrl ? (
										<a
											href={downloadUrl}
											download
											className="w-full bg-golden-yellow hover:bg-deep-gold text-rich-black py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105"
										>
											<Download className="w-5 h-5" />
											<span>Download</span>
										</a>
									) : (
										<span className="w-full bg-warm-taupe/20 text-warm-taupe py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 cursor-not-allowed">
											<Download className="w-5 h-5" />
											<span>Coming Soon</span>
										</span>
									)}
								</div>
							);
						})}
					</div>

					<div className="mt-12 bg-golden-yellow/10 border border-golden-yellow/30 rounded-xl p-6 text-center">
						<p className="text-rich-black font-medium">
							📋 Complete the <strong>Application</strong> and{' '}
							<strong>Availability Form</strong> before uploading below. Review
							the <strong>Training Schedule</strong> to confirm you can meet all
							requirements.
						</p>
					</div>
				</div>
			</section>

			{/* ── UPLOAD / SUBMIT ── */}
			<section className="py-20 px-6 bg-charcoal-gray">
				<div className="max-w-4xl mx-auto">
					<div className="text-center mb-12">
						<span className="inline-block bg-golden-yellow/20 text-golden-yellow px-4 py-2 rounded-full text-sm font-bold mb-4">
							STEP 2 OF 2
						</span>
						<h3 className="text-4xl font-bold text-warm-cream mb-4">
							Submit Your Application
						</h3>
						<p className="text-warm-cream/80 text-lg max-w-2xl mx-auto">
							Upload all four required documents to complete your application.
							PDF format only, 10MB max per file.
						</p>
					</div>

					{submitStatus === 'success' ? (
						<div className="bg-warm-cream rounded-2xl p-12 text-center animate-scale-in">
							<div className="w-20 h-20 bg-golden-yellow/20 rounded-full mx-auto mb-6 flex items-center justify-center">
								<CheckCircle className="w-10 h-10 text-golden-yellow" />
							</div>
							<h4 className="text-2xl font-bold text-rich-black mb-3">
								Application Submitted!
							</h4>
							<p className="text-charcoal-gray mb-3">
								Thank you, <strong>{applicantName}</strong>. Your application
								has been received.
							</p>
							<p className="text-charcoal-gray mb-6">
								A confirmation has been sent to{' '}
								<strong>{applicantEmail}</strong>. {settings.doctorName}&apos;s
								team will be in touch within 5-7 business days.
							</p>
							<p className="text-warm-taupe text-sm">
								While you wait, explore our {settings.newsletterName} below for
								insights on clinical training.
							</p>
						</div>
					) : (
						<form
							onSubmit={handleApplicationSubmit}
							className="bg-warm-cream rounded-2xl p-8 shadow-2xl"
						>
							<div className="grid md:grid-cols-2 gap-6 mb-8">
								<div>
									<label className="block text-rich-black font-medium mb-2">
										Full Name *
									</label>
									<input
										type="text"
										value={applicantName}
										onChange={(e) => setApplicantName(e.target.value)}
										placeholder="Your full name"
										required
										className="w-full px-4 py-3 border-2 border-warm-taupe/30 rounded-lg focus:border-golden-yellow focus:outline-none focus:ring-2 focus:ring-golden-yellow/20 transition-all bg-white"
									/>
								</div>
								<div>
									<label className="block text-rich-black font-medium mb-2">
										Email Address *
									</label>
									<input
										type="email"
										value={applicantEmail}
										onChange={(e) => setApplicantEmail(e.target.value)}
										placeholder="your.email@university.edu"
										required
										className="w-full px-4 py-3 border-2 border-warm-taupe/30 rounded-lg focus:border-golden-yellow focus:outline-none focus:ring-2 focus:ring-golden-yellow/20 transition-all bg-white"
									/>
								</div>
							</div>

							<div className="space-y-4 mb-8">
								<h4 className="text-rich-black font-bold text-lg">
									Required Documents
								</h4>
								{uploadFields.map(({ field, label, description }) => (
									<div key={field}>
										<div
											className={`border-2 border-dashed rounded-xl p-5 transition-all duration-300 ${uploads[field] ? 'border-golden-yellow bg-golden-yellow/5' : fileErrors[field] ? 'border-red-400 bg-red-50' : 'border-warm-taupe/30 bg-white hover:border-golden-yellow/50 hover:bg-golden-yellow/5'}`}
										>
											{uploads[field] ? (
												<div className="flex items-center justify-between">
													<div className="flex items-center space-x-3">
														<CheckCircle className="w-6 h-6 text-golden-yellow shrink-0" />
														<div>
															<p className="text-rich-black font-medium text-sm">
																{uploads[field]!.name}
															</p>
															<p className="text-warm-taupe text-xs">
																{uploads[field]!.size}
															</p>
														</div>
													</div>
													<button
														type="button"
														onClick={() => removeFile(field)}
														className="p-1 hover:bg-warm-taupe/10 rounded-lg transition-colors"
													>
														<X className="w-5 h-5 text-warm-taupe" />
													</button>
												</div>
											) : (
												<div
													className="flex items-center justify-between cursor-pointer"
													onClick={() => fileRefs[field].current?.click()}
												>
													<div className="flex items-center space-x-3">
														<div className="w-10 h-10 bg-warm-taupe/10 rounded-lg flex items-center justify-center">
															<Upload className="w-5 h-5 text-warm-taupe" />
														</div>
														<div>
															<p className="text-rich-black font-medium">
																{label}
															</p>
															<p className="text-warm-taupe text-sm">
																{description}
															</p>
														</div>
													</div>
													<span className="text-golden-yellow font-medium text-sm hover:text-deep-gold transition-colors">
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

							<div className="mb-6">
								<div className="flex items-center justify-between mb-2">
									<span className="text-rich-black text-sm font-medium">
										{Object.values(uploads).filter(Boolean).length} of 4
										documents uploaded
									</span>
									<span className="text-warm-taupe text-sm">
										{allFilesUploaded
											? '✅ Ready to submit'
											: 'Upload all 4 to continue'}
									</span>
								</div>
								<div className="w-full bg-warm-taupe/20 rounded-full h-2">
									<div
										className="bg-golden-yellow h-2 rounded-full transition-all duration-500"
										style={{
											width: `${(Object.values(uploads).filter(Boolean).length / 4) * 100}%`,
										}}
									/>
								</div>
							</div>

							{submitStatus === 'error' && (
								<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
									<AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
									<p className="text-red-700 text-sm">{errorMessage}</p>
								</div>
							)}

							<button
								type="submit"
								disabled={
									!allFilesUploaded ||
									!applicantName ||
									!applicantEmail ||
									submitStatus === 'submitting'
								}
								className="w-full bg-golden-yellow hover:bg-deep-gold text-rich-black font-bold py-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
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

							<p className="text-center text-warm-taupe text-sm mt-4">
								You&apos;ll receive a confirmation email once submitted.{' '}
								{settings.doctorName}&apos;s team will follow up within 5-7
								business days.
							</p>
						</form>
					)}
				</div>
			</section>

			{/* ── ABOUT (from Sanity) ── */}
			<section id="about" className="py-20 px-6 bg-charcoal-gray">
				<div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-12 items-center">
					<div className="lg:col-span-2">
						<div className="aspect-square rounded-2xl border-2 border-golden-yellow/20 relative overflow-hidden">
							{settings.doctorHeadshot?.asset?.url ? (
								<>
									<Image
										src={settings.doctorHeadshot.asset.url}
										alt={settings.doctorHeadshot.alt || settings.doctorName}
										fill
										className="object-cover"
									/>
									<div className="absolute inset-0 bg-linear-to-t from-charcoal-gray/60 to-transparent" />
								</>
							) : (
								<div className="absolute inset-0 flex items-center justify-center bg-white/5">
									<div className="absolute inset-0 bg-linear-to-br from-golden-yellow/10 to-transparent" />
									<div className="relative z-10 text-center p-8">
										<div className="w-48 h-48 bg-golden-yellow/20 rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-golden-yellow/30">
											<Users className="w-24 h-24 text-golden-yellow" />
										</div>
										<p className="text-warm-cream text-sm opacity-60">
											{settings.doctorName} — Placeholder Image
										</p>
									</div>
								</div>
							)}
						</div>
					</div>

					<div className="lg:col-span-3 space-y-6">
						<blockquote className="text-2xl text-warm-cream italic border-l-4 border-golden-yellow pl-6">
							&ldquo;{settings.doctorQuote}&rdquo;
						</blockquote>
						<div className="space-y-4 text-warm-cream/90 leading-relaxed">
							{settings.doctorBio?.map((block) => (
								<p key={block._key}>
									{block.children?.map((child) => child.text).join('')}
								</p>
							))}
						</div>
						<div className="flex flex-wrap gap-4 pt-6">
							{settings.stats?.map((stat) => (
								<div
									key={stat._key}
									className="flex items-center space-x-2 text-warm-cream/80"
								>
									<div className="w-2 h-2 bg-golden-yellow rounded-full" />
									<span className="text-sm">
										{stat.number} {stat.label}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* ── TESTIMONIALS (from Sanity) ── */}
			<TestimonialsSection testimonials={testimonials} />

			{/* ── NEWSLETTER PREVIEW (from Sanity) ── */}
			<section id="newsletter" className="py-20 px-6 bg-warm-cream">
				<div className="max-w-7xl mx-auto">
					<div className="flex items-end justify-between mb-12 flex-wrap gap-4">
						<div>
							<span className="inline-block mb-3 text-xs font-bold uppercase tracking-[0.2em] text-golden-yellow">
								{settings.newsletterName}
							</span>
							<h3 className="text-4xl font-bold text-rich-black mb-3">
								{settings.newsletterName}
							</h3>
							<p className="text-charcoal-gray text-lg max-w-xl">
								{settings.newsletterTagline}
							</p>
						</div>
						<Link
							href="/newsletter"
							className="inline-flex items-center gap-2 text-golden-yellow hover:text-deep-gold font-semibold transition-colors group"
						>
							View all issues
							<ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
						</Link>
					</div>

					<div className="grid md:grid-cols-3 gap-8 mb-12">
						{previewIssues.map((issue) => (
							<div
								key={issue._id}
								className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-2"
							>
								<div className="h-2 bg-linear-to-r from-golden-yellow to-deep-gold" />
								<div className="p-6">
									<div className="flex items-center justify-between mb-4">
										<span className="text-warm-taupe text-sm font-medium">
											Issue #{issue.issueNumber}
										</span>
										<span className="text-warm-taupe text-sm">
											{new Date(issue.publishDate).toLocaleDateString('en-US', {
												month: 'long',
												year: 'numeric',
											})}
										</span>
									</div>
									<h4 className="text-xl font-bold text-rich-black mb-3 group-hover:text-golden-yellow transition-colors">
										{issue.title}
									</h4>
									<p className="text-charcoal-gray text-sm leading-relaxed mb-4">
										{issue.excerpt}
									</p>
									<div className="flex flex-wrap gap-2 mb-4">
										<span className="text-xs bg-warm-cream text-warm-taupe px-3 py-1 rounded-full">
											{categoryLabels[issue.category] || issue.category}
										</span>
									</div>
									<div className="flex items-center justify-between pt-4 border-t border-warm-taupe/10">
										<span className="text-xs text-warm-taupe">
											{issue.readTimeMinutes} min read
										</span>
										<a
											href="#newsletter-signup"
											className="text-sm text-golden-yellow hover:text-deep-gold font-medium flex items-center space-x-1"
										>
											<span>Subscribe to read</span>
											<ChevronRight className="w-4 h-4" />
										</a>
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Newsletter Signup */}
					<div
						id="newsletter-signup"
						className="bg-charcoal-gray rounded-2xl p-10 max-w-3xl mx-auto"
					>
						<div className="text-center mb-8">
							<h4 className="text-3xl font-bold text-warm-cream mb-3">
								Join Our {settings.newsletterName}
							</h4>
							<p className="text-warm-cream/80">
								Monthly insights for the next generation of clinical
								psychologists.
							</p>
						</div>

						{!isNewsletterSuccess ? (
							<form onSubmit={handleNewsletterSubmit} className="space-y-4">
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="your.email@university.edu"
									required
									className="w-full px-4 py-3 border-2 border-warm-taupe/30 rounded-lg focus:border-golden-yellow focus:outline-none bg-warm-cream transition-all"
								/>
								<select
									value={journey}
									onChange={(e) => setJourney(e.target.value)}
									required
									className="w-full px-4 py-3 border-2 border-warm-taupe/30 rounded-lg focus:border-golden-yellow focus:outline-none bg-warm-cream transition-all"
								>
									<option value="">Where are you in your journey?</option>
									<option value="exploring">
										Exploring clinical psychology (undergrad/early grad)
									</option>
									<option value="applying">
										Preparing for internship applications (3rd-4th year)
									</option>
									<option value="postdoc">
										Seeking post-doc/supervision hours
									</option>
									<option value="licensed">
										Licensed professional seeking consultation
									</option>
								</select>
								<button
									type="submit"
									disabled={isNewsletterSubmitting}
									className="w-full bg-golden-yellow hover:bg-deep-gold text-rich-black font-bold py-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50"
								>
									{isNewsletterSubmitting ? (
										<>
											<Loader2 className="w-5 h-5 animate-spin" />
											<span>Subscribing...</span>
										</>
									) : (
										<>
											<Mail className="w-5 h-5" />
											<span>Subscribe to {settings.newsletterName}</span>
										</>
									)}
								</button>
								<p className="text-center text-warm-cream/60 text-sm">
									Join 200+ students. Unsubscribe anytime.
								</p>
							</form>
						) : (
							<div className="text-center py-8 animate-scale-in">
								<div className="w-16 h-16 bg-golden-yellow/20 rounded-full mx-auto mb-4 flex items-center justify-center">
									<CheckCircle className="w-8 h-8 text-golden-yellow" />
								</div>
								<h5 className="text-xl font-bold text-warm-cream mb-2">
									You&apos;re in!
								</h5>
								<p className="text-warm-cream/80">
									Check your email for your first newsletter issue.
								</p>
							</div>
						)}
					</div>
				</div>
			</section>

			{/* ── RESOURCES PREVIEW ── */}
			<section id="resources" className="py-20 px-6 bg-warm-cream">
				<div className="max-w-7xl mx-auto">
					<div className="flex items-end justify-between mb-12 flex-wrap gap-4">
						<div>
							<span className="inline-block mb-3 text-xs font-bold uppercase tracking-[0.2em] text-golden-yellow">
								Library
							</span>
							<h3 className="text-4xl font-bold text-rich-black mb-3">
								Training Resources
							</h3>
							<p className="text-charcoal-gray text-lg max-w-xl">
								Curated tools and guides for developing clinical competence.
							</p>
						</div>
						<Link
							href="/resources"
							className="inline-flex items-center gap-2 text-golden-yellow hover:text-deep-gold font-semibold transition-colors group"
						>
							Browse all resources
							<ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
						</Link>
					</div>
					<div className="grid md:grid-cols-3 gap-8">
						{[
							{
								type: 'Video',
								title: 'Cultural Assessment Framework',
								desc: '15-minute walkthrough of the assessment process.',
								meta: '15 min',
							},
							{
								type: 'PDF',
								title: 'Clinical Documentation Checklist',
								desc: 'Essential elements for progress notes and assessments.',
								meta: '8 pages',
							},
							{
								type: 'Article',
								title: 'Supervision: What to Expect',
								desc: 'How supervision works—structure, expectations, growth.',
								meta: '6 min read',
							},
						].map((r, i) => (
							<div
								key={i}
								className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-2 p-6"
							>
								<span className="text-xs bg-golden-yellow/20 text-deep-gold px-3 py-1 rounded-full font-medium">
									{r.type}
								</span>
								<h4 className="text-lg font-bold text-rich-black mt-4 mb-2 group-hover:text-golden-yellow transition-colors">
									{r.title}
								</h4>
								<p className="text-charcoal-gray text-sm leading-relaxed mb-4">
									{r.desc}
								</p>
								<p className="text-xs text-warm-taupe">{r.meta}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ── FOOTER ── */}
			<footer id="contact" className="bg-rich-black py-12 px-6">
				<div className="max-w-7xl mx-auto">
					<div className="grid md:grid-cols-3 gap-8 mb-8">
						<div className="md:col-span-2">
							<div className="flex items-center space-x-3 mb-4">
								<div className="w-10 h-10 bg-golden-yellow rounded-lg flex items-center justify-center">
									<span className="text-rich-black font-bold">SC</span>
								</div>
								<div>
									<h4 className="text-warm-cream font-semibold">
										{settings.siteTitle}
									</h4>
									<p className="text-warm-cream/60 text-xs">
										Clinical Psychology Training
									</p>
								</div>
							</div>
							<p className="text-warm-cream/70 text-sm leading-relaxed">
								Training the next generation of culturally competent clinical
								psychologists.
							</p>
							<a
								href="https://www.linkedin.com/in/clivekennedy/"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 text-warm-cream/60 hover:text-golden-yellow transition-colors text-sm mt-4"
							>
								<svg
									className="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
								</svg>
								LinkedIn
							</a>
						</div>
						<div>
							<h5 className="text-warm-cream font-semibold mb-4">
								Quick Links
							</h5>
							<ul className="space-y-2">
								{navLinks.map((link) => (
									<li key={link.label}>
										<a
											href={link.href}
											className="text-warm-cream/70 hover:text-golden-yellow text-sm transition-colors"
										>
											{link.label}
										</a>
									</li>
								))}
							</ul>
						</div>
					</div>
					<div className="border-t border-warm-cream/10 pt-8 text-center">
						<p className="text-warm-cream/60 text-sm">
							© 2026 {settings.siteTitle}. All rights reserved.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
