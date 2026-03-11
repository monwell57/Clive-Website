// Path: app/resources/[slug]/page.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, BookOpen, Tag } from 'lucide-react';

// ===== PLACEHOLDER DATA (replaced by Sanity fetch later) =====
// TODO: Replace with — const resource = await getResourceBySlug(params.slug)
const placeholderArticle = {
	_id: '3',
	title: 'Supervision: What to Expect',
	slug: { current: 'supervision-what-to-expect' },
	description:
		'How supervision works at SCTC — structure, expectations, and growth areas.',
	category: 'clinical-supervision',
	resourceType: 'article' as const,
	publishDate: '2026-02-01',
	articleBody: [
		{
			_type: 'block',
			style: 'h2',
			children: [{ text: 'What Clinical Supervision Looks Like at SCTC' }],
		},
		{
			_type: 'block',
			style: 'normal',
			children: [
				{
					text: "Supervision is the backbone of your training experience. At SCTC, we take a developmental approach — meeting you where you are and building from there. Whether you're in your first practicum or preparing for licensure, supervision is tailored to your growth edge.",
				},
			],
		},
		{
			_type: 'block',
			style: 'h2',
			children: [{ text: 'Structure & Frequency' }],
		},
		{
			_type: 'block',
			style: 'normal',
			children: [
				{
					text: "You'll receive a minimum of two hours of individual supervision per week, plus one hour of group supervision. Individual sessions focus on your active cases, while group sessions cover broader clinical and ethical topics. This exceeds APPIC minimum requirements and ensures you're never navigating complex cases alone.",
				},
			],
		},
		{
			_type: 'block',
			style: 'h2',
			children: [{ text: 'What to Bring to Supervision' }],
		},
		{
			_type: 'block',
			style: 'normal',
			children: [
				{
					text: "Come prepared with specific questions, case material, and — most importantly — your honest reactions to the work. Supervision isn't about performing competence; it's about developing it. The best supervisory relationships are built on vulnerability and curiosity, not perfection.",
				},
			],
		},
		{
			_type: 'block',
			style: 'h2',
			children: [{ text: 'Cultural Competence in Supervision' }],
		},
		{
			_type: 'block',
			style: 'normal',
			children: [
				{
					text: "Every supervision session at SCTC incorporates cultural formulation. We don't treat culture as an add-on — it's woven into how we conceptualize cases, build treatment plans, and evaluate progress. You'll learn to ask the questions that most training sites overlook.",
				},
			],
		},
		{
			_type: 'block',
			style: 'h2',
			children: [{ text: 'Growth Expectations' }],
		},
		{
			_type: 'block',
			style: 'normal',
			children: [
				{
					text: "By the end of your training year, you should feel confident in case conceptualization, report writing, and independent clinical decision-making. More importantly, you'll have developed your own clinical voice — informed by evidence, shaped by cultural awareness, and grounded in the realities of the communities you serve.",
				},
			],
		},
	],
};

const categories: Record<string, string> = {
	'forensic-evaluations': 'Forensic Evaluations',
	'cultural-competence': 'Cultural Competence',
	'career-advice': 'Career Advice',
	'clinical-supervision': 'Clinical Supervision',
	'research-readings': 'Research & Readings',
};

// ===== SIMPLE PORTABLE TEXT RENDERER =====
// TODO: Replace with @portabletext/react when wired to Sanity
function renderBody(
	blocks: Array<{
		_type: string;
		style?: string;
		children?: Array<{ text: string }>;
	}>,
) {
	return blocks.map((block, i) => {
		if (block._type !== 'block' || !block.children) return null;
		const text = block.children.map((c) => c.text).join('');

		switch (block.style) {
			case 'h2':
				return (
					<h2 key={i} className="text-2xl font-bold text-rich-black mt-10 mb-4">
						{text}
					</h2>
				);
			case 'h3':
				return (
					<h3 key={i} className="text-xl font-bold text-rich-black mt-8 mb-3">
						{text}
					</h3>
				);
			case 'blockquote':
				return (
					<blockquote
						key={i}
						className="border-l-4 border-golden-yellow pl-6 my-6 italic text-charcoal-gray/90 text-lg"
					>
						{text}
					</blockquote>
				);
			default:
				return (
					<p
						key={i}
						className="text-charcoal-gray/90 leading-relaxed mb-4 text-[16.5px]"
					>
						{text}
					</p>
				);
		}
	});
}

// ===== COMPONENT =====
export default function ResourceArticlePage() {
	// TODO: Use params.slug to fetch from Sanity
	// const { slug } = useParams()
	// const resource = await getResourceBySlug(slug)
	const resource = placeholderArticle;

	const categoryLabel = categories[resource.category] || resource.category;
	const formattedDate = new Date(resource.publishDate).toLocaleDateString(
		'en-US',
		{ month: 'long', day: 'numeric', year: 'numeric' },
	);

	// Estimate read time from article body
	const wordCount = resource.articleBody
		.flatMap((b) => b.children?.map((c) => c.text) || [])
		.join(' ')
		.split(/\s+/).length;
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
						<span className="inline-flex items-center gap-1.5 text-xs text-warm-cream/60">
							<Tag className="w-3 h-3" />
							{categoryLabel}
						</span>
					</div>

					<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-warm-cream mb-6 leading-tight">
						{resource.title}
					</h1>

					<p className="text-warm-cream/80 text-lg mb-6">
						{resource.description}
					</p>

					{/* Meta */}
					<div className="flex items-center gap-6 text-warm-cream/60 text-sm">
						<span className="flex items-center gap-1.5">
							<Calendar className="w-4 h-4" />
							{formattedDate}
						</span>
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
					{renderBody(resource.articleBody)}
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
