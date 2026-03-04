// Path: sanity/schemaTypes/testimonial.ts

import { defineField, defineType } from 'sanity';

export default defineType({
	name: 'testimonial',
	title: 'Testimonials',
	type: 'document',
	fields: [
		defineField({
			name: 'name',
			title: 'Full Name',
			type: 'string',
			description: 'Student or alumni name',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'title',
			title: 'Current Title / Role',
			type: 'string',
			description:
				'e.g., "Licensed Clinical Psychologist" or "PhD Candidate, USC"',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'cohortYear',
			title: 'Cohort Year',
			type: 'string',
			description: 'e.g., "SCTC Cohort 2023" or "2021–2022 Intern"',
		}),
		defineField({
			name: 'quote',
			title: 'Testimonial Quote',
			type: 'text',
			rows: 5,
			description: 'Their testimonial in their own words',
			validation: (Rule) => Rule.required().max(500),
		}),
		defineField({
			name: 'headshot',
			title: 'Headshot Photo',
			type: 'image',
			options: { hotspot: true },
			fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
			description: 'Optional: Square photo, at least 200×200px',
		}),
		defineField({
			name: 'institution',
			title: 'Institution / Affiliation',
			type: 'string',
			description:
				'e.g., "UCLA", "LA County Dept. of Mental Health", "The Chicago School"',
		}),
		defineField({
			name: 'isFeatured',
			title: 'Featured on Homepage',
			type: 'boolean',
			description: 'Check to display this testimonial on the homepage',
			initialValue: true,
		}),
		defineField({
			name: 'sortOrder',
			title: 'Display Order',
			type: 'number',
			description: '1 = first, 2 = second, 3 = third',
			initialValue: 0,
			validation: (Rule) => Rule.integer().min(0),
		}),
	],
	orderings: [
		{
			title: 'Display Order',
			name: 'sortOrderAsc',
			by: [{ field: 'sortOrder', direction: 'asc' }],
		},
	],
	preview: {
		select: {
			title: 'name',
			subtitle: 'title',
			featured: 'isFeatured',
			media: 'headshot',
		},
		prepare({ title, subtitle, featured, media }) {
			return {
				title: `${featured ? '⭐ ' : ''}${title}`,
				subtitle: subtitle || 'No title',
				media,
			};
		},
	},
});
