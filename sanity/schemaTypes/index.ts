import { type SchemaTypeDefinition } from 'sanity';

import siteSettings from './siteSettings';
import subscriber from './subscriber';
import resource from './resource';
import downloadableDocument from './downloadableDocument';
import newsletterIssue from './newsletterIssue';
import testimonial from './testimonial';

export const schema: { types: SchemaTypeDefinition[] } = {
	types: [
		siteSettings,
		subscriber,
		resource,
		downloadableDocument,
		newsletterIssue,
		testimonial,
	],
};
