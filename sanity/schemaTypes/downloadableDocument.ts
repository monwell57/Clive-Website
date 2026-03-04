import { defineField, defineType } from 'sanity';

export default defineType({
	name: 'downloadableDocument',
	title: 'Downloadable Documents',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Document Title',
			type: 'string',
			description:
				'e.g., "Internship Application", "Availability Form", "Training Schedule"',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			description: 'URL-friendly identifier (auto-generated from title)',
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
			description: 'Brief description shown to students before they download',
		}),
		defineField({
			name: 'file',
			title: 'Document File (PDF)',
			type: 'file',
			description:
				'Upload the current version of this document. Students will download this file.',
			options: {
				accept: '.pdf',
			},
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'icon',
			title: 'Icon Type',
			type: 'string',
			description: 'Which icon to display next to this document on the website',
			options: {
				list: [
					{ title: '📄 Document (Application)', value: 'fileText' },
					{ title: '📅 Calendar (Availability)', value: 'calendar' },
					{ title: '🗓️ Schedule (Training)', value: 'clipboardList' },
				],
			},
			initialValue: 'fileText',
		}),
		defineField({
			name: 'sortOrder',
			title: 'Display Order',
			type: 'number',
			description:
				'Controls the order documents appear on the page (1 = first)',
			initialValue: 0,
			validation: (Rule) => Rule.integer().min(0),
		}),
		defineField({
			name: 'lastUpdated',
			title: 'Last Updated',
			type: 'datetime',
			description:
				'When this document was last revised. Shown to students so they know they have the latest version.',
		}),
		defineField({
			name: 'isActive',
			title: 'Active',
			type: 'boolean',
			description: 'Uncheck to temporarily hide this document from the website',
			initialValue: true,
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
			title: 'title',
			subtitle: 'description',
			active: 'isActive',
		},
		prepare({ title, subtitle, active }) {
			return {
				title: `${active === false ? '🚫 ' : ''}${title}`,
				subtitle: subtitle || 'No description',
			};
		},
	},
});
