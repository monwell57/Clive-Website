import { defineField, defineType } from 'sanity';

export default defineType({
	name: 'resource',
	title: 'Training Resources',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Resource Title',
			type: 'string',
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
			name: 'description',
			title: 'Description',
			type: 'text',
			rows: 3,
			description: 'Brief description of this resource',
			validation: (Rule) => Rule.required(),
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
					{ title: 'Research & Readings', value: 'research-readings' },
				],
			},
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'resourceType',
			title: 'Resource Type',
			type: 'string',
			options: {
				list: [
					{ title: '📄 PDF / Document', value: 'pdf' },
					{ title: '🎥 Video', value: 'video' },
					{ title: '🔗 External Link', value: 'link' },
					{ title: '📖 Article', value: 'article' },
				],
			},
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'file',
			title: 'File (PDF)',
			type: 'file',
			description: 'Upload a PDF if this is a document resource',
			options: {
				accept: '.pdf',
			},
			hidden: ({ parent }) => parent?.resourceType !== 'pdf',
		}),
		defineField({
			name: 'videoUrl',
			title: 'Video URL',
			type: 'url',
			description: 'Mux or YouTube video URL',
			hidden: ({ parent }) => parent?.resourceType !== 'video',
		}),
		defineField({
			name: 'externalUrl',
			title: 'External URL',
			type: 'url',
			description: 'Link to external resource',
			hidden: ({ parent }) => parent?.resourceType !== 'link',
		}),
		defineField({
			name: 'articleBody',
			title: 'Article Content',
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
				},
				{
					type: 'image',
					options: { hotspot: true },
					fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
				},
			],
			hidden: ({ parent }) => parent?.resourceType !== 'article',
		}),
		defineField({
			name: 'thumbnail',
			title: 'Thumbnail Image',
			type: 'image',
			options: { hotspot: true },
			fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
		}),
		defineField({
			name: 'isFeatured',
			title: 'Featured',
			type: 'boolean',
			description: 'Show this resource prominently on the resources page',
			initialValue: false,
		}),
		defineField({
			name: 'isPublished',
			title: 'Published',
			type: 'boolean',
			initialValue: true,
		}),
		defineField({
			name: 'publishDate',
			title: 'Publish Date',
			type: 'date',
		}),
		defineField({
			name: 'sortOrder',
			title: 'Display Order',
			type: 'number',
			initialValue: 0,
		}),
	],
	orderings: [
		{
			title: 'Newest First',
			name: 'publishDateDesc',
			by: [{ field: 'publishDate', direction: 'desc' }],
		},
		{
			title: 'Display Order',
			name: 'sortOrderAsc',
			by: [{ field: 'sortOrder', direction: 'asc' }],
		},
	],
	preview: {
		select: {
			title: 'title',
			category: 'category',
			type: 'resourceType',
			published: 'isPublished',
			media: 'thumbnail',
		},
		prepare({ title, category, type, published, media }) {
			const typeEmoji = {
				pdf: '📄',
				video: '🎥',
				link: '🔗',
				article: '📖',
			};
			return {
				title: `${published ? '' : '🚫 '}${typeEmoji[type as keyof typeof typeEmoji] || ''} ${title}`,
				subtitle: category || 'Uncategorized',
				media,
			};
		},
	},
});
