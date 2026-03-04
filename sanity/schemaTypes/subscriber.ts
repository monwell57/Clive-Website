import { defineField, defineType } from 'sanity';

export default defineType({
	name: 'subscriber',
	title: 'Newsletter Subscribers',
	type: 'document',
	fields: [
		defineField({
			name: 'email',
			title: 'Email Address',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'journeyStage',
			title: 'Journey Stage',
			type: 'string',
			options: {
				list: [
					{ title: 'Exploring clinical psychology', value: 'exploring' },
					{ title: 'Preparing for internship', value: 'preparing' },
					{ title: 'Seeking post-doc/supervision', value: 'postdoc' },
					{ title: 'Licensed professional', value: 'licensed' },
				],
			},
		}),
		defineField({
			name: 'subscribedAt',
			title: 'Subscribed At',
			type: 'datetime',
		}),
		defineField({
			name: 'source',
			title: 'Source',
			type: 'string',
			description: 'Where this subscriber signed up from',
			initialValue: 'website',
		}),
	],
	orderings: [
		{
			title: 'Newest First',
			name: 'subscribedAtDesc',
			by: [{ field: 'subscribedAt', direction: 'desc' }],
		},
	],
	preview: {
		select: {
			title: 'email',
			subtitle: 'journeyStage',
			date: 'subscribedAt',
		},
		prepare({ title, subtitle, date }) {
			const stageLabels: Record<string, string> = {
				exploring: '🔍 Exploring',
				preparing: '📚 Preparing for internship',
				postdoc: '🎓 Seeking post-doc',
				licensed: '✅ Licensed professional',
			};
			return {
				title: title || 'No email',
				subtitle: `${stageLabels[subtitle] || subtitle || 'Unknown stage'} — ${date ? new Date(date).toLocaleDateString() : 'Unknown date'}`,
			};
		},
	},
});
