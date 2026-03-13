// Path: components/NewsletterIssueClient.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
	Clock,
	Tag,
	ArrowLeft,
	Share2,
	Calendar,
	Lock,
	ChevronRight,
	Mail,
} from 'lucide-react';

// ===== TYPES =====
interface PortableTextBlock {
	_type: string;
	_key: string;
	style?: string;
	markDefs?: Array<{ _key: string; _type: string; href?: string }>;
	children?: Array<{
		_type: string;
		_key: string;
		text: string;
		marks?: string[];
	}>;
	// Image block fields
	asset?: { _id?: string; url?: string };
	alt?: string;
	caption?: string;
}

interface NewsletterIssue {
	_id: string;
	title: string;
	slug: { current: string };
	issueNumber: number;
	publishDate: string;
	excerpt: string;
	body: PortableTextBlock[];
	category: string;
	readTimeMinutes: number;
	videoUrl?: string;
	isPublished?: boolean;
	isSubscriberOnly: boolean;
	coverImage?: {
		asset?: { url?: string };
		alt?: string;
	};
}

interface RelatedIssue {
	_id: string;
	title: string;
	slug: { current: string };
	issueNumber: number;
	publishDate: string;
	excerpt: string;
	category: string;
	readTimeMinutes: number;
}

interface NewsletterIssueClientProps {
	issue: NewsletterIssue;
	relatedIssues: RelatedIssue[];
}

// ===== CATEGORY LABELS =====
const categoryLabels: Record<string, string> = {
	'forensic-evaluations': 'Forensic Evaluations',
	'cultural-competence': 'Cultural Competence',
	'career-advice': 'Career Advice',
	'clinical-supervision': 'Clinical Supervision',
	'case-studies': 'Case Studies',
	'field-updates': 'Field Updates',
};

// ===== PORTABLE TEXT RENDERER =====
function renderBody(blocks: PortableTextBlock[]) {
	if (!blocks || blocks.length === 0) return null;

	return blocks.map((block) => {
		// Handle image blocks
		if (block._type === 'image' && block.asset?.url) {
			return (
				<figure key={block._key} className="my-10">
					<div className="relative w-full aspect-video">
						<Image
							src={block.asset.url}
							alt={block.alt || ''}
							fill
							className="object-cover rounded-xl shadow-md"
						/>
					</div>
					{block.caption && (
						<figcaption className="text-center text-warm-taupe text-sm mt-3 italic">
							{block.caption}
						</figcaption>
					)}
				</figure>
			);
		}

		// Handle text blocks
		if (block._type !== 'block' || !block.children) return null;
		const text = block.children.map((c) => c.text).join('');
		if (!text.trim()) return null;

		// Render inline marks (bold, italic)
		const renderChildren = (children: PortableTextBlock['children']) => {
			if (!children) return null;
			return children.map((child) => {
				let content: React.ReactNode = child.text;
				if (child.marks?.includes('strong'))
					content = <strong key={child._key}>{content}</strong>;
				if (child.marks?.includes('em'))
					content = <em key={child._key}>{content}</em>;
				if (child.marks?.includes('underline'))
					content = <u key={child._key}>{content}</u>;
				return <React.Fragment key={child._key}>{content}</React.Fragment>;
			});
		};

		switch (block.style) {
			case 'h2':
				return (
					<h2
						key={block._key}
						className="text-3xl font-bold text-rich-black mt-12 mb-4"
					>
						{renderChildren(block.children)}
					</h2>
				);
			case 'h3':
				return (
					<h3
						key={block._key}
						className="text-2xl font-bold text-rich-black mt-8 mb-3"
					>
						{renderChildren(block.children)}
					</h3>
				);
			case 'blockquote':
				return (
					<blockquote
						key={block._key}
						className="border-l-4 border-golden-yellow pl-6 my-8 italic text-charcoal-gray/90 text-lg leading-relaxed"
					>
						{renderChildren(block.children)}
					</blockquote>
				);
			default:
				return (
					<p
						key={block._key}
						className="text-charcoal-gray leading-relaxed mb-5 text-[16.5px]"
					>
						{renderChildren(block.children)}
					</p>
				);
		}
	});
}

// ===== COMPONENT =====
export default function NewsletterIssueClient({
	issue,
	relatedIssues,
}: NewsletterIssueClientProps) {
	const categoryLabel = categoryLabels[issue.category] || issue.category;
	const formattedDate = new Date(issue.publishDate).toLocaleDateString(
		'en-US',
		{
			month: 'long',
			year: 'numeric',
		},
	);

	return (
		<div className="min-h-screen bg-warm-cream">
			{/* Navigation */}
			<nav className="fixed top-0 w-full bg-warm-cream/95 backdrop-blur-md z-50 border-b border-warm-taupe/20">
				<div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
					<Link
						href="/newsletter"
						className="flex items-center space-x-2 text-rich-black hover:text-golden-yellow transition-colors group"
					>
						<ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
						<span className="font-medium">Back to Newsletter</span>
					</Link>
					<div className="flex items-center space-x-4">
						<button className="p-2 hover:bg-warm-taupe/10 rounded-lg transition-colors">
							<Share2 className="w-5 h-5 text-charcoal-gray" />
						</button>
					</div>
				</div>
			</nav>

			{/* Hero */}
			<section className="pt-32 pb-12 px-6 bg-charcoal-gray">
				<div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
					<div className="flex items-center space-x-4 text-warm-cream/80 text-sm">
						<span className="font-medium">Newsletter</span>
						<span className="text-warm-cream/40">•</span>
						<span>Issue #{issue.issueNumber}</span>
						<span className="text-warm-cream/40">•</span>
						<span>{formattedDate}</span>
					</div>

					<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-warm-cream leading-tight">
						{issue.title}
					</h1>

					<p className="text-xl text-warm-cream/80 leading-relaxed">
						{issue.excerpt}
					</p>

					<div className="flex flex-wrap items-center gap-6 pt-4">
						<div className="flex items-center space-x-2 text-warm-cream/70">
							<Clock className="w-5 h-5 text-golden-yellow" />
							<span className="text-sm">{issue.readTimeMinutes} min read</span>
						</div>
						<div className="flex items-center space-x-2 text-warm-cream/70">
							<Calendar className="w-5 h-5 text-golden-yellow" />
							<span className="text-sm">{formattedDate}</span>
						</div>
						<div className="flex items-center space-x-2">
							<Tag className="w-5 h-5 text-golden-yellow" />
							<span className="text-xs bg-golden-yellow/20 text-golden-yellow px-3 py-1 rounded-full">
								{categoryLabel}
							</span>
						</div>
						{issue.isSubscriberOnly && (
							<div className="flex items-center space-x-2 text-deep-gold">
								<Lock className="w-4 h-4" />
								<span className="text-xs font-medium">Subscribers Only</span>
							</div>
						)}
					</div>
				</div>
			</section>

			{/* Cover Image */}
			{issue.coverImage?.asset?.url && (
				<div className="max-w-4xl mx-auto px-6 -mt-8">
					<div className="rounded-2xl overflow-hidden shadow-xl relative w-full max-h-[480px] aspect-video">
						<Image
							src={issue.coverImage.asset.url}
							alt={issue.coverImage.alt || issue.title}
							fill
							className="object-cover object-top"
						/>
					</div>
				</div>
			)}

			{/* Article Content */}
			<article className="py-16 px-6">
				<div className="max-w-3xl mx-auto">
					{issue.body && issue.body.length > 0 ? (
						<div className="bg-white rounded-2xl shadow-sm border border-warm-taupe/10 p-8 md:p-12">
							{renderBody(issue.body)}
						</div>
					) : (
						<div className="bg-white rounded-2xl shadow-sm border border-warm-taupe/10 p-12 text-center">
							<div className="w-16 h-16 bg-golden-yellow/10 rounded-full mx-auto mb-4 flex items-center justify-center">
								<Lock className="w-8 h-8 text-golden-yellow" />
							</div>
							<h3 className="text-xl font-bold text-rich-black mb-3">
								Full content coming soon
							</h3>
							<p className="text-warm-taupe mb-6">
								Subscribe to the newsletter to get notified when this issue is
								published.
							</p>
							<Link
								href="/#newsletter-signup"
								className="inline-flex items-center gap-2 bg-golden-yellow hover:bg-deep-gold text-rich-black px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
							>
								<Mail className="w-5 h-5" />
								Subscribe
							</Link>
						</div>
					)}

					{/* Video embed */}
					{issue.videoUrl && (
						<div className="mt-12">
							<h3 className="text-2xl font-bold text-rich-black mb-6">Watch</h3>
							<div className="bg-charcoal-gray rounded-xl overflow-hidden shadow-2xl">
								<div className="aspect-video flex items-center justify-center relative group cursor-pointer">
									<div className="absolute inset-0 bg-linear-to-br from-golden-yellow/10 to-transparent" />
									<div className="relative z-10 text-center">
										<div className="w-20 h-20 bg-golden-yellow rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
											<svg
												className="w-10 h-10 text-rich-black ml-1"
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<path d="M8 5v14l11-7z" />
											</svg>
										</div>
										<p className="text-warm-cream text-lg font-medium">
											Watch Video
										</p>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</article>

			{/* Related Issues */}
			{relatedIssues.length > 0 && (
				<section className="py-16 px-6 bg-warm-cream border-t border-warm-taupe/20">
					<div className="max-w-7xl mx-auto">
						<h3 className="text-3xl font-bold text-rich-black mb-8">
							More from Newsletter
						</h3>
						<div className="grid md:grid-cols-3 gap-8">
							{relatedIssues.map((related) => {
								const relatedDate = new Date(
									related.publishDate,
								).toLocaleDateString('en-US', {
									month: 'long',
									year: 'numeric',
								});
								return (
									<Link
										key={related._id}
										href={`/newsletter/${related.slug.current}`}
										className="block bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-2"
									>
										<div className="text-sm text-warm-taupe mb-3">
											Issue #{related.issueNumber} • {relatedDate}
										</div>
										<h4 className="text-xl font-bold text-rich-black mb-3 group-hover:text-golden-yellow transition-colors">
											{related.title}
										</h4>
										<p className="text-charcoal-gray text-sm leading-relaxed">
											{related.excerpt}
										</p>
									</Link>
								);
							})}
						</div>
					</div>
				</section>
			)}

			{/* Newsletter CTA */}
			<section className="py-20 px-6 bg-charcoal-gray">
				<div className="max-w-4xl mx-auto text-center">
					<h3 className="text-4xl font-bold text-warm-cream mb-4">
						Never Miss an Issue
					</h3>
					<p className="text-warm-cream/80 text-lg mb-8">
						Get our newsletter delivered monthly. Real insights from clinical
						practice.
					</p>
					<Link
						href="/#newsletter-signup"
						className="inline-flex items-center space-x-2 bg-golden-yellow hover:bg-deep-gold text-rich-black px-8 py-4 rounded-lg font-bold transition-all duration-300 transform hover:scale-105"
					>
						<Mail className="w-5 h-5" />
						<span>Subscribe to Newsletter</span>
						<ChevronRight className="w-5 h-5" />
					</Link>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-rich-black py-12 px-6">
				<div className="max-w-7xl mx-auto text-center">
					<p className="text-warm-cream/60 text-sm">
						© 2026 South Central Training Consortium. All rights reserved.
					</p>
				</div>
			</footer>
		</div>
	);
}
