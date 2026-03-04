// Path: components/TestimonialsSection.tsx

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Quote, GraduationCap, ChevronLeft, ChevronRight } from 'lucide-react';

// ===== PLACEHOLDER DATA (replaced by Sanity data when available) =====
const placeholderTestimonials = [
	{
		_id: '1',
		name: 'Jasmine Rivera',
		title: 'Licensed Clinical Psychologist',
		cohortYear: 'SCTC Cohort 2022',
		institution: 'LA County Dept. of Mental Health',
		quote:
			"Dr. Kennedy's training gave me something no textbook ever could — a real understanding of how culture shapes every clinical interaction. I walked into my first forensic evaluation feeling prepared, not just academically, but as a person who could truly connect with my clients.",
		headshot: null,
	},
	{
		_id: '2',
		name: 'Marcus Thompson',
		title: 'PhD Candidate, Clinical Psychology',
		cohortYear: 'SCTC Cohort 2023',
		institution: 'University of Southern California',
		quote:
			'Before SCTC, I thought forensic psych was all courtroom drama. Dr. Kennedy showed me the human side — the families, the communities, the cultural nuances that shape every case. That perspective completely changed how I approach my research and clinical work.',
		headshot: null,
	},
	{
		_id: '3',
		name: 'Aisha Patel',
		title: 'Post-Doctoral Fellow',
		cohortYear: 'SCTC Cohort 2021',
		institution: 'The Chicago School of Professional Psychology',
		quote:
			"The supervision I received at SCTC was unlike anything else in my training. Dr. Kennedy doesn't just teach you to write competency reports — he teaches you to see the whole person behind the referral question. That's rare, and it made all the difference in my career.",
		headshot: null,
	},
];

// ===== TYPES =====
interface Testimonial {
	_id: string;
	name: string;
	title: string;
	cohortYear?: string;
	institution?: string;
	quote: string;
	headshot?: {
		asset?: { url?: string };
		alt?: string;
	} | null;
}

interface TestimonialsSectionProps {
	testimonials?: Testimonial[];
}

// ===== SINGLE CARD =====
function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
	const hasImage = testimonial.headshot?.asset?.url;

	return (
		<div className="group relative flex flex-col rounded-2xl border border-warm-taupe/15 bg-white/80 backdrop-blur-sm p-8 shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-golden-yellow/10 hover:-translate-y-2 hover:border-golden-yellow/30 h-full">
			{/* Decorative quote mark */}
			<div className="absolute -top-4 right-8 flex h-8 w-8 items-center justify-center rounded-full bg-golden-yellow shadow-md transition-transform duration-500 group-hover:scale-110">
				<Quote className="h-4 w-4 text-white" strokeWidth={3} />
			</div>

			{/* Header: Avatar + Name + Info */}
			<div className="mb-6 flex items-start gap-4">
				{/* Avatar */}
				<div className="relative shrink-0">
					<div className="h-16 w-16 overflow-hidden rounded-full border-2 border-golden-yellow/30 bg-linear-to-br from-charcoal-gray to-warm-taupe shadow-inner">
						{hasImage ? (
							<Image
								src={testimonial.headshot!.asset!.url!}
								alt={testimonial.headshot?.alt || testimonial.name}
								width={64}
								height={64}
								className="h-full w-full object-cover"
							/>
						) : (
							<div className="flex h-full w-full items-center justify-center">
								<span className="text-xl font-bold text-golden-yellow/80">
									{testimonial.name
										.split(' ')
										.map((n) => n[0])
										.join('')}
								</span>
							</div>
						)}
					</div>
					{/* Institution badge */}
					{testimonial.institution && (
						<div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-charcoal-gray shadow-sm">
							<GraduationCap className="h-3 w-3 text-golden-yellow" />
						</div>
					)}
				</div>

				{/* Name + credentials */}
				<div className="min-w-0 flex-1">
					<h4 className="text-base font-bold text-rich-black leading-tight">
						{testimonial.name}
					</h4>
					<p className="mt-0.5 text-sm font-medium text-warm-taupe">
						{testimonial.title}
					</p>
					{testimonial.institution && (
						<p className="mt-0.5 text-xs text-warm-taupe/70">
							{testimonial.institution}
						</p>
					)}
				</div>
			</div>

			{/* Quote */}
			<blockquote className="flex-1">
				<p className="text-[15px] leading-relaxed text-charcoal-gray/90 italic">
					&ldquo;{testimonial.quote}&rdquo;
				</p>
			</blockquote>

			{/* Footer: Cohort badge */}
			{testimonial.cohortYear && (
				<div className="mt-6 pt-4 border-t border-warm-taupe/10">
					<span className="inline-flex items-center gap-1.5 rounded-full bg-golden-yellow/10 px-3 py-1 text-xs font-semibold text-deep-gold tracking-wide">
						<GraduationCap className="h-3 w-3" />
						{testimonial.cohortYear}
					</span>
				</div>
			)}
		</div>
	);
}

// ===== MAIN SECTION WITH CAROUSEL =====
export default function TestimonialsSection({
	testimonials,
}: TestimonialsSectionProps) {
	const data = testimonials?.length ? testimonials : placeholderTestimonials;

	// Cards visible per "page" — 3 on desktop, 1 on mobile
	const [cardsPerPage, setCardsPerPage] = useState(3);
	const totalPages = Math.ceil(data.length / cardsPerPage);
	const [currentPage, setCurrentPage] = useState(0);
	const [isPaused, setIsPaused] = useState(false);

	const prevCardsPerPage = useRef(cardsPerPage);

	// Responsive: detect screen size
	useEffect(() => {
		function handleResize() {
			const next = window.innerWidth < 768 ? 1 : 3;
			if (next !== prevCardsPerPage.current) {
				prevCardsPerPage.current = next;
				setCardsPerPage(next);
				setCurrentPage(0);
			}
		}
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	// Auto-advance every 7 seconds (pauses on hover)
	useEffect(() => {
		if (isPaused || totalPages <= 1) return;
		const timer = setInterval(() => {
			setCurrentPage((prev) => (prev + 1) % totalPages);
		}, 7000);
		return () => clearInterval(timer);
	}, [isPaused, totalPages]);

	const goToPage = useCallback(
		(page: number) => {
			setCurrentPage(((page % totalPages) + totalPages) % totalPages);
		},
		[totalPages],
	);

	const showNavigation = totalPages > 1;

	// Get visible cards for current page
	const startIndex = currentPage * cardsPerPage;
	const visibleCards = data.slice(startIndex, startIndex + cardsPerPage);

	return (
		<section id="testimonials" className="py-20 px-4 bg-warm-cream">
			<div className="max-w-6xl mx-auto">
				{/* Section header */}
				<div className="text-center mb-14">
					<span className="inline-block mb-3 text-xs font-bold uppercase tracking-[0.2em] text-golden-yellow">
						From Our Community
					</span>
					<h2 className="text-3xl md:text-4xl font-bold text-rich-black mb-4">
						What Our Trainees Say
					</h2>
					<p className="max-w-2xl mx-auto text-warm-taupe text-lg">
						Hear from students and alumni who&apos;ve experienced SCTC&apos;s
						approach to clinical training firsthand.
					</p>
				</div>

				{/* Carousel container — pt-6 gives room for the quote badge that overflows the card top */}
				<div
					className="relative pt-6"
					onMouseEnter={() => setIsPaused(true)}
					onMouseLeave={() => setIsPaused(false)}
				>
					{/* Left arrow */}
					{showNavigation && (
						<button
							onClick={() => goToPage(currentPage - 1)}
							className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white border border-warm-taupe/20 shadow-md transition-all duration-300 hover:bg-golden-yellow hover:border-golden-yellow hover:text-white hover:shadow-lg hover:scale-110"
							aria-label="Previous testimonials"
						>
							<ChevronLeft className="h-5 w-5 text-charcoal-gray" />
						</button>
					)}

					{/* Cards */}
					<div className="overflow-hidden pt-5">
						<div
							className="grid gap-8 transition-opacity duration-500"
							style={{
								gridTemplateColumns: `repeat(${cardsPerPage}, minmax(0, 1fr))`,
							}}
						>
							{visibleCards.map((testimonial, index) => (
								<div
									key={`${currentPage}-${testimonial._id}`}
									className="animate-fade-in-up opacity-0"
									style={{
										animationDelay: `${index * 150}ms`,
										animationFillMode: 'forwards',
									}}
								>
									<TestimonialCard testimonial={testimonial} />
								</div>
							))}
						</div>
					</div>

					{/* Right arrow */}
					{showNavigation && (
						<button
							onClick={() => goToPage(currentPage + 1)}
							className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white border border-warm-taupe/20 shadow-md transition-all duration-300 hover:bg-golden-yellow hover:border-golden-yellow hover:text-white hover:shadow-lg hover:scale-110"
							aria-label="Next testimonials"
						>
							<ChevronRight className="h-5 w-5 text-charcoal-gray" />
						</button>
					)}
				</div>

				{/* Dot indicators */}
				{showNavigation && (
					<div className="flex items-center justify-center gap-2.5 mt-10">
						{Array.from({ length: totalPages }).map((_, index) => (
							<button
								key={index}
								onClick={() => goToPage(index)}
								className={`rounded-full transition-all duration-300 ${
									index === currentPage
										? 'h-3 w-8 bg-golden-yellow shadow-sm'
										: 'h-3 w-3 bg-warm-taupe/25 hover:bg-warm-taupe/50'
								}`}
								aria-label={`Go to testimonials page ${index + 1}`}
							/>
						))}
					</div>
				)}
			</div>
		</section>
	);
}
