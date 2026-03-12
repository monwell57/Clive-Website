import { defineField, defineType } from 'sanity';

export default defineType({
	name: 'siteSettings',
	title: 'Site Settings',
	type: 'document',
	// Singleton: only one instance of this document should exist
	fields: [
		defineField({
			name: 'siteTitle',
			title: 'Site Title',
			type: 'string',
			initialValue: 'South Central Training Consortium',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'siteDescription',
			title: 'Site Description (SEO)',
			type: 'text',
			rows: 3,
			description: 'Appears in search engine results and social media previews',
			initialValue:
				'Clinical psychology training rooted in South Central LA. Monthly insights on cultural competence, clinical supervision, and building a forensic psychology practice.',
		}),

		// ===== DR. KENNEDY'S PROFILE =====
		defineField({
			name: 'doctorName',
			title: "Doctor's Full Name",
			type: 'string',
			initialValue: 'Dr. Clive Kennedy',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'doctorTitle',
			title: 'Professional Title',
			type: 'string',
			description:
				'e.g., "Licensed Clinical Psychologist, Forensic Specialist"',
		}),
		defineField({
			name: 'doctorHeadshot',
			title: 'Headshot Photo',
			type: 'image',
			options: { hotspot: true },
			fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
			description: 'Professional headshot (at least 800×800px)',
		}),
		defineField({
			name: 'doctorHeroImage',
			title: 'Hero Card Image',
			type: 'image',
			options: { hotspot: true },
			fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
			description:
				'Photo for the hero card on the homepage (landscape/portrait works best)',
		}),
		defineField({
			name: 'doctorBio',
			title: 'Biography',
			type: 'array',
			of: [
				{
					type: 'block',
					styles: [
						{ title: 'Normal', value: 'normal' },
						{ title: 'H3', value: 'h3' },
						{ title: 'Quote', value: 'blockquote' },
					],
				},
			],
			description: 'Full bio for the About section',
		}),
		defineField({
			name: 'doctorQuote',
			title: 'Featured Quote',
			type: 'text',
			rows: 3,
			description:
				'The quote displayed in the About section (e.g., "When I was a grad student, nobody told me how to navigate...")',
		}),

		// ===== HERO SECTION =====
		defineField({
			name: 'heroHeadline',
			title: 'Hero Headline',
			type: 'string',
			initialValue:
				'Clinical Psychology Training: The Reality Behind the Reports',
		}),
		defineField({
			name: 'heroSubheadline',
			title: 'Hero Subheadline',
			type: 'text',
			rows: 2,
			initialValue:
				'Monthly insights on cultural competence, clinical supervision, and building a forensic psychology practice — from South Central LA.',
		}),
		defineField({
			name: 'heroBadgeText',
			title: 'Hero Badge Text',
			type: 'string',
			description:
				'The small badge above the headline (e.g., "Fall 2026 Applications Open September")',
			initialValue: 'Fall 2026 Applications Open September',
		}),

		// ===== NEWSLETTER SETTINGS =====
		defineField({
			name: 'newsletterName',
			title: 'Newsletter Name',
			type: 'string',
			initialValue: 'Field Notes',
		}),
		defineField({
			name: 'newsletterTagline',
			title: 'Newsletter Tagline',
			type: 'string',
			initialValue:
				'Monthly insights on cultural competence, clinical supervision, and building a psychology practice',
		}),

		// ===== CONTACT INFO =====
		defineField({
			name: 'contactEmail',
			title: 'Contact Email',
			type: 'string',
			description: 'Public-facing email address',
		}),
		defineField({
			name: 'applicationEmail',
			title: 'Application Recipient Email',
			type: 'string',
			description:
				'Email address that receives application submissions (can be different from public email)',
		}),

		// ===== STATS / TRUST SIGNALS =====
		defineField({
			name: 'stats',
			title: 'Trust Signal Stats',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						{
							name: 'number',
							title: 'Number',
							type: 'string',
							description: 'e.g., "200+", "24+"',
						},
						{
							name: 'label',
							title: 'Label',
							type: 'string',
							description: 'e.g., "Students Trained", "Years Experience"',
						},
					],
					preview: {
						select: { title: 'number', subtitle: 'label' },
					},
				},
			],
		}),

		// ===== SOCIAL / SEO =====
		defineField({
			name: 'ogImage',
			title: 'Social Share Image (OG Image)',
			type: 'image',
			description:
				'Image shown when the site is shared on social media (1200×630px recommended)',
		}),
	],
	preview: {
		prepare() {
			return {
				title: 'Site Settings',
				subtitle: 'Global site configuration',
			};
		},
	},
});
