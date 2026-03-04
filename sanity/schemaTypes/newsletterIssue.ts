import { defineField, defineType } from 'sanity';

export default defineType({
	name: 'newsletterIssue',
	title: 'Newsletter Issues (Field Notes)',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Issue Title',
			type: 'string',
			description: 'e.g., "Writing Your First Competency Report"',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			options: {
				source: 'title',
				maxLength: 96,
			},
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'issueNumber',
			title: 'Issue Number',
			type: 'number',
			description: 'e.g., 1, 2, 3...',
			validation: (Rule) => Rule.required().integer().positive(),
		}),
		defineField({
			name: 'publishDate',
			title: 'Publish Date',
			type: 'date',
			description: 'When this issue was published (or will be published)',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'excerpt',
			title: 'Excerpt / Preview',
			type: 'text',
			rows: 3,
			description: 'Short preview shown on the newsletter archive page',
			validation: (Rule) => Rule.required().max(300),
		}),
		defineField({
			name: 'body',
			title: 'Full Content',
			type: 'array',
			of: [
				{
					type: 'block',
					styles: [
						{ title: 'Normal', value: 'normal' },
						{ title: 'H2', value: 'h2' },
						{ title: 'H3', value: 'h3' },
						{ title: 'Quote', value: 'blockquote' },
					],
					marks: {
						decorators: [
							{ title: 'Bold', value: 'strong' },
							{ title: 'Italic', value: 'em' },
							{ title: 'Underline', value: 'underline' },
						],
						annotations: [
							{
								title: 'URL',
								name: 'link',
								type: 'object',
								fields: [
									{
										title: 'URL',
										name: 'href',
										type: 'url',
									},
								],
							},
						],
					},
				},
				{
					type: 'image',
					options: { hotspot: true },
					fields: [
						{
							name: 'alt',
							type: 'string',
							title: 'Alt Text',
							description: 'Describe the image for accessibility',
						},
						{
							name: 'caption',
							type: 'string',
							title: 'Caption',
						},
					],
				},
			],
			description: 'The full newsletter content. Available to subscribers.',
		}),
		defineField({
			name: 'coverImage',
			title: 'Cover Image',
			type: 'image',
			options: { hotspot: true },
			fields: [
				{
					name: 'alt',
					type: 'string',
					title: 'Alt Text',
				},
			],
			description: 'Featured image for this issue (shown on archive cards)',
		}),
		defineField({
			name: 'category',
			title: 'Category',
			type: 'string',
			options: {
				list: [
					{ title: 'Forensic Evaluations', value: 'forensic-evaluations' },
					{ title: 'Cultural Competence', value: 'cultural-competence' },
					{ title: 'Career Advice', value: 'career-advice' },
					{ title: 'Clinical Supervision', value: 'clinical-supervision' },
					{ title: 'Case Studies', value: 'case-studies' },
					{ title: 'Field Updates', value: 'field-updates' },
				],
			},
		}),
		defineField({
			name: 'readTimeMinutes',
			title: 'Read Time (minutes)',
			type: 'number',
			description: 'Estimated reading time',
			initialValue: 5,
			validation: (Rule) => Rule.integer().positive(),
		}),
		defineField({
			name: 'videoUrl',
			title: 'Video URL (Mux or YouTube)',
			type: 'url',
			description: 'Optional: Embedded video for this issue',
		}),
		defineField({
			name: 'isPublished',
			title: 'Published',
			type: 'boolean',
			description: "Uncheck to save as draft (won't show on the website)",
			initialValue: false,
		}),
		defineField({
			name: 'isSubscriberOnly',
			title: 'Subscriber Only',
			type: 'boolean',
			description: 'If checked, only the excerpt is shown to non-subscribers',
			initialValue: true,
		}),
	],
	orderings: [
		{
			title: 'Issue Number (Newest)',
			name: 'issueNumberDesc',
			by: [{ field: 'issueNumber', direction: 'desc' }],
		},
		{
			title: 'Publish Date (Newest)',
			name: 'publishDateDesc',
			by: [{ field: 'publishDate', direction: 'desc' }],
		},
	],
	preview: {
		select: {
			title: 'title',
			issueNumber: 'issueNumber',
			date: 'publishDate',
			published: 'isPublished',
			media: 'coverImage',
		},
		prepare({ title, issueNumber, date, published, media }) {
			return {
				title: `${published ? '' : '📝 DRAFT: '}Issue #${issueNumber || '?'} — ${title}`,
				subtitle: date || 'No publish date set',
				media,
			};
		},
	},
});
