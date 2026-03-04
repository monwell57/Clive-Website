// Path: app/resources/page.tsx

'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
	Search,
	FileText,
	Video,
	ExternalLink,
	BookOpen,
	Download,
	Play,
	ArrowLeft,
	ChevronLeft,
	ChevronRight,
	Filter,
	X,
} from 'lucide-react';

// ===== PLACEHOLDER DATA (replaced by Sanity fetch later) =====
const placeholderResources = [
	{
		_id: '1',
		title: 'Cultural Assessment Framework',
		slug: { current: 'cultural-assessment-framework' },
		description:
			'15-minute walkthrough of the cultural assessment process used in forensic evaluations.',
		category: 'cultural-competence',
		resourceType: 'video' as const,
		videoUrl: 'https://youtube.com/example',
		publishDate: '2026-01-15',
		isFeatured: true,
	},
	{
		_id: '2',
		title: 'Clinical Documentation Checklist',
		slug: { current: 'clinical-documentation-checklist' },
		description:
			'Essential elements for progress notes, assessments, and treatment plans.',
		category: 'clinical-supervision',
		resourceType: 'pdf' as const,
		file: { asset: { url: '/placeholder.pdf' } },
		publishDate: '2026-01-10',
		isFeatured: true,
	},
	{
		_id: '3',
		title: 'Supervision: What to Expect',
		slug: { current: 'supervision-what-to-expect' },
		description:
			'How supervision works at SCTC — structure, expectations, and growth areas.',
		category: 'clinical-supervision',
		resourceType: 'article' as const,
		publishDate: '2026-02-01',
		isFeatured: false,
	},
	{
		_id: '4',
		title: 'APA Ethical Guidelines for Forensic Practice',
		slug: { current: 'apa-ethical-guidelines' },
		description:
			"Link to APA's official guidelines for forensic psychology practitioners.",
		category: 'forensic-evaluations',
		resourceType: 'link' as const,
		externalUrl: 'https://apa.org/example',
		publishDate: '2025-11-20',
		isFeatured: false,
	},
	{
		_id: '5',
		title: 'Writing Competency Evaluations',
		slug: { current: 'writing-competency-evaluations' },
		description:
			'Step-by-step guide to writing clear, defensible competency evaluation reports.',
		category: 'forensic-evaluations',
		resourceType: 'pdf' as const,
		file: { asset: { url: '/placeholder.pdf' } },
		publishDate: '2026-02-10',
		isFeatured: true,
	},
	{
		_id: '6',
		title: 'Building Rapport with Diverse Populations',
		slug: { current: 'building-rapport-diverse' },
		description:
			'Video lecture on evidence-based approaches to building therapeutic relationships across cultures.',
		category: 'cultural-competence',
		resourceType: 'video' as const,
		videoUrl: 'https://youtube.com/example2',
		publishDate: '2026-02-15',
		isFeatured: false,
	},
	{
		_id: '7',
		title: 'Internship Application Prep Guide',
		slug: { current: 'internship-application-prep' },
		description:
			'Everything you need to know about preparing a competitive internship application.',
		category: 'career-advice',
		resourceType: 'pdf' as const,
		file: { asset: { url: '/placeholder.pdf' } },
		publishDate: '2026-03-01',
		isFeatured: false,
	},
	{
		_id: '8',
		title: 'APPIC Match Statistics',
		slug: { current: 'appic-match-statistics' },
		description:
			'Latest APPIC match data and analysis — what the numbers mean for your application strategy.',
		category: 'career-advice',
		resourceType: 'link' as const,
		externalUrl: 'https://appic.org/example',
		publishDate: '2026-01-25',
		isFeatured: false,
	},
	{
		_id: '9',
		title: 'Progress Note Templates',
		slug: { current: 'progress-note-templates' },
		description:
			'Downloadable templates for clinical progress notes in various settings.',
		category: 'clinical-supervision',
		resourceType: 'pdf' as const,
		file: { asset: { url: '/placeholder.pdf' } },
		publishDate: '2026-02-20',
		isFeatured: false,
	},
	{
		_id: '10',
		title: 'Cultural Humility in Clinical Practice',
		slug: { current: 'cultural-humility' },
		description:
			'A foundational article on moving from cultural competence to cultural humility.',
		category: 'cultural-competence',
		resourceType: 'article' as const,
		publishDate: '2025-12-15',
		isFeatured: false,
	},
];

// ===== CONSTANTS =====
const ITEMS_PER_PAGE = 9;

const categories = [
	{ value: '', label: 'All Categories' },
	{ value: 'forensic-evaluations', label: 'Forensic Evaluations' },
	{ value: 'cultural-competence', label: 'Cultural Competence' },
	{ value: 'career-advice', label: 'Career Advice' },
	{ value: 'clinical-supervision', label: 'Clinical Supervision' },
	{ value: 'research-readings', label: 'Research & Readings' },
];

const resourceTypes = [
	{ value: '', label: 'All Types' },
	{ value: 'pdf', label: 'PDF / Document', icon: FileText },
	{ value: 'video', label: 'Video', icon: Video },
	{ value: 'link', label: 'External Link', icon: ExternalLink },
	{ value: 'article', label: 'Article', icon: BookOpen },
];

const typeConfig = {
	pdf: {
		icon: FileText,
		label: 'PDF',
		actionLabel: 'Download',
		actionIcon: Download,
		color: 'text-red-600 bg-red-50',
	},
	video: {
		icon: Video,
		label: 'Video',
		actionLabel: 'Watch',
		actionIcon: Play,
		color: 'text-blue-600 bg-blue-50',
	},
	link: {
		icon: ExternalLink,
		label: 'Link',
		actionLabel: 'Visit',
		actionIcon: ExternalLink,
		color: 'text-green-600 bg-green-50',
	},
	article: {
		icon: BookOpen,
		label: 'Article',
		actionLabel: 'Read',
		actionIcon: BookOpen,
		color: 'text-purple-600 bg-purple-50',
	},
};

// ===== TYPES =====
interface Resource {
	_id: string;
	title: string;
	slug: { current: string };
	description: string;
	category: string;
	resourceType: 'pdf' | 'video' | 'link' | 'article';
	file?: { asset?: { url?: string } };
	videoUrl?: string;
	externalUrl?: string;
	publishDate?: string;
	isFeatured?: boolean;
}

function getResourceUrl(resource: Resource): string | null {
	switch (resource.resourceType) {
		case 'pdf':
			return resource.file?.asset?.url || null;
		case 'video':
			return resource.videoUrl || null;
		case 'link':
			return resource.externalUrl || null;
		case 'article':
			return `/resources/${resource.slug.current}`;
		default:
			return null;
	}
}

// ===== COMPONENT =====
export default function ResourcesPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');
	const [selectedType, setSelectedType] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [showFilters, setShowFilters] = useState(false);

	// TODO: Replace with Sanity fetch — const resources = await getResources()
	const resources: Resource[] = placeholderResources;

	// Filter + search
	const filteredResources = useMemo(() => {
		return resources.filter((r) => {
			const matchesSearch =
				!searchQuery ||
				r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				r.description.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesCategory =
				!selectedCategory || r.category === selectedCategory;
			const matchesType = !selectedType || r.resourceType === selectedType;
			return matchesSearch && matchesCategory && matchesType;
		});
	}, [resources, searchQuery, selectedCategory, selectedType]);

	// Pagination
	const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE);
	const paginatedResources = filteredResources.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE,
	);

	// Reset page when filters change
	const updateFilter = (
		setter: React.Dispatch<React.SetStateAction<string>>,
		value: string,
	) => {
		setter(value);
		setCurrentPage(1);
	};

	const activeFilterCount = [selectedCategory, selectedType].filter(
		Boolean,
	).length;

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
					<h1 className="text-4xl md:text-5xl font-bold text-warm-cream mb-4">
						Training Resources
					</h1>
					<p className="text-warm-cream/80 text-lg max-w-2xl">
						Curated tools, guides, and materials for developing clinical
						competence. Download documents, watch videos, and explore external
						resources.
					</p>
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
								placeholder="Search resources..."
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
							Filters
							{activeFilterCount > 0 && (
								<span className="ml-1 bg-golden-yellow text-rich-black text-xs font-bold px-2 py-0.5 rounded-full">
									{activeFilterCount}
								</span>
							)}
						</button>

						{/* Dropdowns (always visible on desktop, toggleable on mobile) */}
						<div
							className={`flex gap-3 ${showFilters ? 'flex' : 'hidden md:flex'}`}
						>
							<select
								value={selectedCategory}
								onChange={(e) =>
									updateFilter(setSelectedCategory, e.target.value)
								}
								className="px-4 py-3 bg-white border-2 border-warm-taupe/20 rounded-xl focus:border-golden-yellow focus:outline-none text-rich-black text-sm min-w-[180px]"
							>
								{categories.map((c) => (
									<option key={c.value} value={c.value}>
										{c.label}
									</option>
								))}
							</select>

							<select
								value={selectedType}
								onChange={(e) => updateFilter(setSelectedType, e.target.value)}
								className="px-4 py-3 bg-white border-2 border-warm-taupe/20 rounded-xl focus:border-golden-yellow focus:outline-none text-rich-black text-sm min-w-[160px]"
							>
								{resourceTypes.map((t) => (
									<option key={t.value} value={t.value}>
										{t.label}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Active filters + result count */}
					<div className="flex items-center justify-between mt-3">
						<p className="text-warm-taupe text-sm">
							{filteredResources.length} resource
							{filteredResources.length !== 1 ? 's' : ''} found
						</p>
						{activeFilterCount > 0 && (
							<button
								onClick={() => {
									setSelectedCategory('');
									setSelectedType('');
									setCurrentPage(1);
								}}
								className="text-golden-yellow hover:text-deep-gold text-sm font-medium transition-colors"
							>
								Clear filters
							</button>
						)}
					</div>
				</div>
			</div>

			{/* Resources Grid */}
			<div className="max-w-7xl mx-auto px-6 py-12">
				{paginatedResources.length > 0 ? (
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{paginatedResources.map((resource) => {
							const config = typeConfig[resource.resourceType];
							const ActionIcon = config.actionIcon;
							const url = getResourceUrl(resource);
							const categoryLabel =
								categories.find((c) => c.value === resource.category)?.label ||
								resource.category;

							return (
								<div
									key={resource._id}
									className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-warm-taupe/10 hover:border-golden-yellow/30 transition-all duration-300 group hover:-translate-y-1 flex flex-col"
								>
									<div className="p-7 flex flex-col flex-1">
										{/* Type + Category badges */}
										<div className="flex items-center gap-2 mb-4">
											<span
												className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${config.color}`}
											>
												<config.icon className="w-3 h-3" />
												{config.label}
											</span>
											<span className="text-xs text-warm-taupe bg-warm-cream px-3 py-1 rounded-full">
												{categoryLabel}
											</span>
										</div>

										{/* Title */}
										<h3 className="text-lg font-bold text-rich-black mb-2 group-hover:text-golden-yellow transition-colors leading-snug">
											{resource.title}
										</h3>

										{/* Description */}
										<p className="text-charcoal-gray/80 text-sm leading-relaxed mb-6 flex-1">
											{resource.description}
										</p>

										{/* Date */}
										{resource.publishDate && (
											<p className="text-warm-taupe text-xs mb-4">
												{new Date(resource.publishDate).toLocaleDateString(
													'en-US',
													{
														month: 'long',
														day: 'numeric',
														year: 'numeric',
													},
												)}
											</p>
										)}

										{/* Action button */}
										{url && (
											<a
												href={url}
												target={
													resource.resourceType === 'link'
														? '_blank'
														: undefined
												}
												rel={
													resource.resourceType === 'link'
														? 'noopener noreferrer'
														: undefined
												}
												download={
													resource.resourceType === 'pdf' ? true : undefined
												}
												className="flex items-center justify-center gap-2 w-full bg-golden-yellow hover:bg-deep-gold text-rich-black font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
											>
												<ActionIcon className="w-4 h-4" />
												{config.actionLabel}
											</a>
										)}
									</div>
								</div>
							);
						})}
					</div>
				) : (
					<div className="text-center py-20">
						<div className="w-16 h-16 bg-warm-taupe/10 rounded-full mx-auto mb-4 flex items-center justify-center">
							<Search className="w-8 h-8 text-warm-taupe/50" />
						</div>
						<h3 className="text-xl font-bold text-rich-black mb-2">
							No resources found
						</h3>
						<p className="text-warm-taupe mb-6">
							Try adjusting your search or filters.
						</p>
						<button
							onClick={() => {
								setSearchQuery('');
								setSelectedCategory('');
								setSelectedType('');
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
			</div>
		</div>
	);
}
