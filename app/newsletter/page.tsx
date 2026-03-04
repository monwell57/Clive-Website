// Path: app/newsletter/page.tsx

'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
	Search,
	ArrowLeft,
	ChevronLeft,
	ChevronRight,
	Clock,
	Calendar,
	Lock,
	Mail,
	X,
	Filter,
} from 'lucide-react';

// ===== PLACEHOLDER DATA (replaced by Sanity fetch later) =====
const placeholderIssues = [
	{
		_id: '1',
		title: 'What Supervisors Actually Look For',
		slug: { current: 'what-supervisors-look-for' },
		issueNumber: 4,
		publishDate: '2026-06-01',
		excerpt:
			'Beyond the credentials — how to demonstrate clinical judgment in your application materials and supervision sessions.',
		category: 'career-advice',
		readTimeMinutes: 6,
		isSubscriberOnly: true,
	},
	{
		_id: '2',
		title: 'Understanding Training Site Culture',
		slug: { current: 'understanding-training-site-culture' },
		issueNumber: 3,
		publishDate: '2026-05-01',
		excerpt:
			'Questions to ask during internship interviews that reveal whether a site will truly support your development.',
		category: 'career-advice',
		readTimeMinutes: 5,
		isSubscriberOnly: true,
	},
	{
		_id: '3',
		title: 'Cultural Formulation in Practice',
		slug: { current: 'cultural-formulation-in-practice' },
		issueNumber: 2,
		publishDate: '2026-04-01',
		excerpt:
			'Moving beyond theoretical frameworks to actual clinical application — with case examples from forensic and community settings.',
		category: 'cultural-competence',
		readTimeMinutes: 8,
		isSubscriberOnly: true,
	},
	{
		_id: '4',
		title: 'Writing Your First Competency Report',
		slug: { current: 'writing-first-competency-report' },
		issueNumber: 1,
		publishDate: '2026-03-01',
		excerpt:
			'A step-by-step guide to writing clear, defensible competency evaluation reports — from assessment to final submission.',
		category: 'forensic-evaluations',
		readTimeMinutes: 10,
		isSubscriberOnly: false,
	},
	{
		_id: '5',
		title: 'Navigating Your First Year of Supervision',
		slug: { current: 'navigating-first-year-supervision' },
		issueNumber: 5,
		publishDate: '2026-07-01',
		excerpt:
			'What to expect, how to prepare, and how to get the most out of your supervision hours during internship.',
		category: 'clinical-supervision',
		readTimeMinutes: 7,
		isSubscriberOnly: true,
	},
	{
		_id: '6',
		title: 'The Ethics of Cultural Competence',
		slug: { current: 'ethics-cultural-competence' },
		issueNumber: 6,
		publishDate: '2026-08-01',
		excerpt:
			'When cultural sensitivity and clinical obligation seem to conflict — real scenarios and how to think through them.',
		category: 'cultural-competence',
		readTimeMinutes: 9,
		isSubscriberOnly: true,
	},
	{
		_id: '7',
		title: 'Building a Post-Doc Application Strategy',
		slug: { current: 'post-doc-application-strategy' },
		issueNumber: 7,
		publishDate: '2026-09-01',
		excerpt:
			"Post-doc applications are a different beast. Here's what hiring committees actually weigh when reviewing your materials.",
		category: 'career-advice',
		readTimeMinutes: 6,
		isSubscriberOnly: true,
	},
];

// ===== CONSTANTS =====
const ITEMS_PER_PAGE = 6;

const categories = [
	{ value: '', label: 'All Topics' },
	{ value: 'forensic-evaluations', label: 'Forensic Evaluations' },
	{ value: 'cultural-competence', label: 'Cultural Competence' },
	{ value: 'career-advice', label: 'Career Advice' },
	{ value: 'clinical-supervision', label: 'Clinical Supervision' },
	{ value: 'case-studies', label: 'Case Studies' },
	{ value: 'field-updates', label: 'Field Updates' },
];

// ===== TYPES =====
interface NewsletterIssue {
	_id: string;
	title: string;
	slug: { current: string };
	issueNumber: number;
	publishDate: string;
	excerpt: string;
	category: string;
	readTimeMinutes: number;
	isSubscriberOnly: boolean;
	coverImage?: {
		asset?: { url?: string };
		alt?: string;
	};
}

// ===== COMPONENT =====
export default function NewsletterArchivePage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [showFilters, setShowFilters] = useState(false);

	// TODO: Replace with Sanity fetch — const issues = await getNewsletterIssues()
	const issues: NewsletterIssue[] = placeholderIssues;

	// Filter + search
	const filteredIssues = useMemo(() => {
		return issues
			.filter((issue) => {
				const matchesSearch =
					!searchQuery ||
					issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					issue.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
				const matchesCategory =
					!selectedCategory || issue.category === selectedCategory;
				return matchesSearch && matchesCategory;
			})
			.sort((a, b) => b.issueNumber - a.issueNumber);
	}, [issues, searchQuery, selectedCategory]);

	// Pagination
	const totalPages = Math.ceil(filteredIssues.length / ITEMS_PER_PAGE);
	const paginatedIssues = filteredIssues.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE,
	);

	const updateFilter = (
		setter: React.Dispatch<React.SetStateAction<string>>,
		value: string,
	) => {
		setter(value);
		setCurrentPage(1);
	};

	return (
		<div className="min-h-screen bg-warm-cream">
			{/* Header */}
			<div className="bg-charcoal-gray pt-28 pb-16 px-6">
				<div className="max-w-7xl mx-auto">
					<Link
						href="/"
						className="inline-flex items-center gap-2 text-warm-cream/60 hover:text-golden-yellow transition-colors mb-8 text-sm"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to Home
					</Link>
					<div className="flex items-start justify-between flex-wrap gap-6">
						<div>
							<h1 className="text-4xl md:text-5xl font-bold text-warm-cream mb-4">
								Newsletter
							</h1>
							<p className="text-warm-cream/80 text-lg max-w-2xl">
								Monthly insights on cultural competence, clinical supervision,
								and building a meaningful psychology practice.
							</p>
						</div>
						<Link
							href="/#newsletter-signup"
							className="inline-flex items-center gap-2 bg-golden-yellow hover:bg-deep-gold text-rich-black px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 hover:shadow-lg shrink-0"
						>
							<Mail className="w-5 h-5" />
							Subscribe
						</Link>
					</div>
				</div>
			</div>

			{/* Search + Filters */}
			<div className="sticky top-0 z-40 bg-warm-cream/95 backdrop-blur-md border-b border-warm-taupe/15 shadow-sm">
				<div className="max-w-7xl mx-auto px-6 py-4">
					<div className="flex flex-col md:flex-row gap-4">
						{/* Search */}
						<div className="relative flex-1">
							<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-taupe" />
							<input
								type="text"
								placeholder="Search issues..."
								value={searchQuery}
								onChange={(e) => updateFilter(setSearchQuery, e.target.value)}
								className="w-full pl-12 pr-4 py-3 bg-white border-2 border-warm-taupe/20 rounded-xl focus:border-golden-yellow focus:outline-none focus:ring-2 focus:ring-golden-yellow/20 transition-all text-rich-black placeholder:text-warm-taupe/60"
							/>
							{searchQuery && (
								<button
									onClick={() => updateFilter(setSearchQuery, '')}
									className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-taupe hover:text-rich-black transition-colors"
								>
									<X className="w-4 h-4" />
								</button>
							)}
						</div>

						{/* Filter toggle (mobile) */}
						<button
							onClick={() => setShowFilters(!showFilters)}
							className="md:hidden flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-warm-taupe/20 rounded-xl text-rich-black font-medium"
						>
							<Filter className="w-5 h-5" />
							Topics
							{selectedCategory && (
								<span className="ml-1 bg-golden-yellow text-rich-black text-xs font-bold px-2 py-0.5 rounded-full">
									1
								</span>
							)}
						</button>

						{/* Category dropdown */}
						<div className={`${showFilters ? 'block' : 'hidden md:block'}`}>
							<select
								value={selectedCategory}
								onChange={(e) =>
									updateFilter(setSelectedCategory, e.target.value)
								}
								className="w-full md:w-auto px-4 py-3 bg-white border-2 border-warm-taupe/20 rounded-xl focus:border-golden-yellow focus:outline-none text-rich-black text-sm min-w-[180px]"
							>
								{categories.map((c) => (
									<option key={c.value} value={c.value}>
										{c.label}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Result count */}
					<div className="flex items-center justify-between mt-3">
						<p className="text-warm-taupe text-sm">
							{filteredIssues.length} issue
							{filteredIssues.length !== 1 ? 's' : ''}
						</p>
						{selectedCategory && (
							<button
								onClick={() => {
									setSelectedCategory('');
									setCurrentPage(1);
								}}
								className="text-golden-yellow hover:text-deep-gold text-sm font-medium transition-colors"
							>
								Clear filter
							</button>
						)}
					</div>
				</div>
			</div>

			{/* Issues Grid */}
			<div className="max-w-7xl mx-auto px-6 py-12">
				{paginatedIssues.length > 0 ? (
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{paginatedIssues.map((issue) => {
							const categoryLabel =
								categories.find((c) => c.value === issue.category)?.label ||
								issue.category;
							const formattedDate = new Date(
								issue.publishDate,
							).toLocaleDateString('en-US', {
								month: 'long',
								year: 'numeric',
							});

							return (
								<Link
									key={issue._id}
									href={`/newsletter/${issue.slug.current}`}
									className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-warm-taupe/10 hover:border-golden-yellow/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col"
								>
									{/* Gold top bar */}
									<div className="h-1.5 bg-linear-to-r from-golden-yellow to-deep-gold" />

									<div className="p-7 flex flex-col flex-1">
										{/* Meta row */}
										<div className="flex items-center justify-between mb-4">
											<span className="text-xs font-bold text-golden-yellow uppercase tracking-wider">
												Issue #{issue.issueNumber}
											</span>
											<div className="flex items-center gap-1 text-warm-taupe text-xs">
												<Calendar className="w-3 h-3" />
												{formattedDate}
											</div>
										</div>

										{/* Title */}
										<h3 className="text-xl font-bold text-rich-black mb-3 group-hover:text-golden-yellow transition-colors leading-snug">
											{issue.title}
										</h3>

										{/* Excerpt */}
										<p className="text-charcoal-gray/80 text-sm leading-relaxed mb-6 flex-1">
											{issue.excerpt}
										</p>

										{/* Footer */}
										<div className="flex items-center justify-between pt-4 border-t border-warm-taupe/10">
											<div className="flex items-center gap-4">
												<span className="text-xs text-warm-taupe bg-warm-cream px-3 py-1 rounded-full">
													{categoryLabel}
												</span>
												<span className="flex items-center gap-1 text-xs text-warm-taupe">
													<Clock className="w-3 h-3" />
													{issue.readTimeMinutes} min
												</span>
											</div>
											{issue.isSubscriberOnly && (
												<span className="flex items-center gap-1 text-xs text-deep-gold font-medium">
													<Lock className="w-3 h-3" />
													Subscribers
												</span>
											)}
										</div>
									</div>
								</Link>
							);
						})}
					</div>
				) : (
					<div className="text-center py-20">
						<div className="w-16 h-16 bg-warm-taupe/10 rounded-full mx-auto mb-4 flex items-center justify-center">
							<Search className="w-8 h-8 text-warm-taupe/50" />
						</div>
						<h3 className="text-xl font-bold text-rich-black mb-2">
							No issues found
						</h3>
						<p className="text-warm-taupe mb-6">
							Try adjusting your search or topic filter.
						</p>
						<button
							onClick={() => {
								setSearchQuery('');
								setSelectedCategory('');
								setCurrentPage(1);
							}}
							className="text-golden-yellow hover:text-deep-gold font-medium transition-colors"
						>
							Clear all filters
						</button>
					</div>
				)}

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="flex items-center justify-center gap-2 mt-14">
						<button
							onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
							disabled={currentPage === 1}
							className="flex items-center justify-center w-10 h-10 rounded-xl border border-warm-taupe/20 bg-white hover:bg-golden-yellow hover:border-golden-yellow hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:border-warm-taupe/20 disabled:hover:text-rich-black"
						>
							<ChevronLeft className="w-5 h-5" />
						</button>

						{Array.from({ length: totalPages }).map((_, i) => (
							<button
								key={i}
								onClick={() => setCurrentPage(i + 1)}
								className={`flex items-center justify-center w-10 h-10 rounded-xl font-medium text-sm transition-all ${
									currentPage === i + 1
										? 'bg-golden-yellow text-rich-black shadow-sm'
										: 'border border-warm-taupe/20 bg-white text-charcoal-gray hover:border-golden-yellow/50'
								}`}
							>
								{i + 1}
							</button>
						))}

						<button
							onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
							disabled={currentPage === totalPages}
							className="flex items-center justify-center w-10 h-10 rounded-xl border border-warm-taupe/20 bg-white hover:bg-golden-yellow hover:border-golden-yellow hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:border-warm-taupe/20 disabled:hover:text-rich-black"
						>
							<ChevronRight className="w-5 h-5" />
						</button>
					</div>
				)}

				{/* Newsletter CTA at bottom */}
				<div className="mt-16 bg-charcoal-gray rounded-2xl p-10 text-center">
					<h3 className="text-2xl font-bold text-warm-cream mb-3">
						Don&apos;t miss the next issue
					</h3>
					<p className="text-warm-cream/70 mb-6 max-w-lg mx-auto">
						Join 200+ students receiving monthly insights on clinical training,
						cultural competence, and career development.
					</p>
					<Link
						href="/#newsletter-signup"
						className="inline-flex items-center gap-2 bg-golden-yellow hover:bg-deep-gold text-rich-black px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 hover:shadow-lg"
					>
						<Mail className="w-5 h-5" />
						Subscribe to Newsletter
					</Link>
				</div>
			</div>
		</div>
	);
}
