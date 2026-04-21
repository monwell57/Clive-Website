// Path: app/resources/page.tsx

import React from 'react';
import { getResources } from '@/lib/sanity';
import ResourcesClient, { type Resource } from './ResourcesClient';

// Revalidate the Sanity data at most once per minute so newly
// uploaded/edited resources show up quickly without rebuilding.
export const revalidate = 60;

export default async function ResourcesPage() {
	const resources = (await getResources()) as Resource[] | null;

	return <ResourcesClient resources={resources ?? []} />;
}
