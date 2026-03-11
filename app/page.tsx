// Path: app/page.tsx

import {
	getSiteSettings,
	getDownloadableDocuments,
	getTestimonials,
	getNewsletterIssues,
} from '@/lib/sanity';
import HomePageClient from '@/components/HomePageClient';

export default async function Page() {
	// Fetch all data from Sanity in parallel
	const [settings, documents, testimonials, newsletterIssues] =
		await Promise.all([
			getSiteSettings(),
			getDownloadableDocuments(),
			getTestimonials(),
			getNewsletterIssues(),
		]);

	return (
		<HomePageClient
			settings={settings}
			documents={documents}
			testimonials={testimonials}
			newsletterIssues={newsletterIssues}
		/>
	);
}
