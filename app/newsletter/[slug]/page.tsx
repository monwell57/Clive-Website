// Path: app/newsletter/[slug]/page.tsx

import { getNewsletterIssueBySlug, getNewsletterIssues } from '@/lib/sanity';
import { notFound } from 'next/navigation';
import NewsletterIssueClient from '@/components/NewsletterIssueClient';

interface PageProps {
	params: Promise<{ slug: string }>;
}

export default async function NewsletterIssuePage({ params }: PageProps) {
	const { slug } = await params;
	const issue = await getNewsletterIssueBySlug(slug);

	if (!issue) {
		notFound();
	}

	// Fetch other issues for the "More from Newsletter" section
	const allIssues = await getNewsletterIssues();
	const relatedIssues = allIssues
		.filter((i: { _id: string }) => i._id !== issue._id)
		.slice(0, 3);

	return <NewsletterIssueClient issue={issue} relatedIssues={relatedIssues} />;
}
