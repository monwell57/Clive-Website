// Path: app/resources/[slug]/page.tsx

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Calendar, BookOpen, Tag } from 'lucide-react';
import { getResourceBySlug } from '@/lib/sanity';

export const revalidate = 60;

interface PageProps {
	params: Promise<{ slug: string }>;
}

const categories: Record<string, string> = {
	'forensic-evaluations': 'Forensic Evaluations',
	'cultural-competence': 'Cultural Competence',
	'career-advice': 'Career Advice',
	'clinical-supervision': 'Clinical Supervision',
	'research-readings': 'Research & Readings',
};

// ===== TYPES =====
interface Span {
	_type: 'span';
	text: string;
	marks?: string[];
}

interface PortableBlock {
	_type: 'block';
	_key?: string;
	style?: string;
	children?: Span[];
	markDefs?: Array<{ _key: string; _type: string; href?: string }>;
}

interface PortableImage {
	_type: 'image';
	_key?: string;
	asset?: { _id?: string; url?: string };
	alt?: string;
}

type PortableBlockItem = PortableBlock | PortableImage;

interface ResourceDoc {
	_id: string;
	title: string;
	slug: { current: string };
	description?: string;
	category?: string;
	resourceType: 'pdf' | 'video' | 'link' | 'article';
	publishDate?: string;
	articleBody?: PortableBlockItem[];
	file?: { asset?: { _id?: string; url?: string } };
	videoUrl?: string;
	externalUrl?: string;
	thumbnail?: { asset?: { url?: string }; alt?: string };
}

// ===== SIMPLE PORTABLE TEXT RENDERER =====
function renderSpan(span: Span, i: number) {
	let node: React.ReactNode = span.text;
	const marks = span.marks || [];

	if (marks.includes('strong')) {
		node = <strong key={`s-${i}`}>{node}</strong>;
	}
	if (marks.includes('em')) {
		node = <em key={`e-${i}`}>{node}</em>;
	}
	if (marks.includes('code')) {
		node = (
			<code
				key={`c-${i}`}
				className="px-1.5 py-0.5 rounded bg-warm-cream text-rich-black text-[0.9em]"
			>
				{node}
			</code>
		);
	}

	return <React.Fragment key={i}>{node}</React.Fragment>;
}

function renderBody(blocks: PortableBlockItem[]) {
	return blocks.map((block, i) => {
		if (block._type === 'image') {
			const url = block.asset?.url;
			if (!url) return null;
			return (
				<figure key={block._key || i} className="my-8">
					<Image
						src={url}
						alt={block.alt || ''}
						width={1200}
						height={800}
						className="w-full h-auto rounded-xl"
					/>
					{block.alt && (
						<figcaption className="text-warm-taupe text-sm text-center mt-3 italic">
							{block.alt}
						</figcaption>
					)}
				</figure>
			);
		}

		if (block._type !== 'block' || !block.children) return null;

		const children = block.children.map((span, j) => renderSpan(span, j));
		const key = block._key || i;

		switch (block.style) {
			case 'h2':
				return (
					<h2
						key={key}
						className="text-2xl font-bold text-rich-black mt-10 mb-4"
					>
						{children}
					</h2>
				);
			case 'h3':
				return (
					<h3
						key={key}
						className="text-xl font-bold text-rich-black mt-8 mb-3"
					>
						{children}
					</h3>
				);
			case 'blockquote':
				return (
					<blockquote
						key={key}
						className="border-l-4 border-golden-yellow pl-6 my-6 italic text-charcoal-gray/90 text-lg"
					>
						{children}
					</blockquote>
				);
			default:
				return (
					<p
						key={key}
						className="text-charcoal-gray/90 leading-relaxed mb-4 text-[16.5px]"
					>
						{children}
					</p>
				);
		}
	});
}

// ===== COMPONENT =====
export default async function ResourceArticlePage({ params }: PageProps) {
	const { slug } = await params;
	const resource = (await getResourceBySlug(slug)) as ResourceDoc | null;

	if (!resource) {
		notFound();
	}

	// Only article-type resources have a readable detail page.
	// Other types (pdf/video/link) have their action buttons on the list page.
	if (resource.resourceType !== 'article') {
		notFound();
	}

	const categoryLabel = resource.category
		? categories[resource.category] || resource.category
		: '';
	const formattedDate = resource.publishDate
		? new Date(resource.publishDate).toLocaleDateString('en-US', {
				month: 'long',
				day: 'numeric',
				year: 'numeric',
			})
		: null;

	const articleBody = resource.articleBody ?? [];

	// Estimate read time from article body
	const wordCount = articleBody
		.flatMap((b) =>
			b._type === 'block' ? (b.children?.map((c) => c.text) ?? []) : [],
		)
		.join(' ')
		.split(/\s+/)
		.filter(Boolean).length;
	const readTime = Math.max(1, Math.ceil(wordCount / 200));

	return (
		<div className="min-h-screen bg-warm-cream">
			{/* Header */}
			<div className="bg-charcoal-gray pt-28 pb-16 px-6">
				<div className="max-w-3xl mx-auto">
					<Link
						href="/resources"
						className="inline-flex items-center gap-2 text-warm-cream/60 hover:text-golden-yellow transition-colors mb-8 text-sm"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to Resources
					</Link>

					{/* Category + type badge */}
					<div className="flex items-center gap-3 mb-6">
						<span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full text-purple-300 bg-purple-500/20">
							<BookOpen className="w-3 h-3" />
							Article
						</span>
						{categoryLabel && (
							<span className="inline-flex items-center gap-1.5 text-xs text-warm-cream/60">
								<Tag className="w-3 h-3" />
								{categoryLabel}
							</span>
						)}
					</div>

					<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-warm-cream mb-6 leading-tight">
						{resource.title}
					</h1>

					{resource.description && (
						<p className="text-warm-cream/80 text-lg mb-6">
							{resource.description}
						</p>
					)}

					{/* Meta */}
					<div className="flex items-center gap-6 text-warm-cream/60 text-sm">
						{formattedDate && (
							<span className="flex items-center gap-1.5">
								<Calendar className="w-4 h-4" />
								{formattedDate}
							</span>
						)}
						<span className="flex items-center gap-1.5">
							<Clock className="w-4 h-4" />
							{readTime} min read
						</span>
					</div>
				</div>
			</div>

			{/* Article Body */}
			<article className="max-w-3xl mx-auto px-6 py-12">
				<div className="bg-white rounded-2xl shadow-sm border border-warm-taupe/10 p-8 md:p-12">
					{articleBody.length > 0 ? (
						renderBody(articleBody)
					) : (
						<p className="text-warm-taupe italic">
							This article has no content yet.
						</p>
					)}
				</div>

				{/* Bottom navigation */}
				<div className="flex items-center justify-between mt-10 pt-8 border-t border-warm-taupe/15">
					<Link
						href="/resources"
						className="inline-flex items-center gap-2 text-warm-taupe hover:text-golden-yellow transition-colors font-medium"
					>
						<ArrowLeft className="w-4 h-4" />
						All Resources
					</Link>
					<Link
						href="/#apply"
						className="inline-flex items-center gap-2 bg-golden-yellow hover:bg-deep-gold text-rich-black px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 hover:shadow-lg"
					>
						Apply Now
					</Link>
				</div>
			</article>
		</div>
	);
}
