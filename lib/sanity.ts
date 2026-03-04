import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';

// ===== SANITY CLIENT =====
export const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
	apiVersion: '2026-02-01',
	useCdn: true, // `false` if you want real-time previews
});

// ===== IMAGE URL BUILDER =====
const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
	return builder.image(source);
}

// ===== HELPER: Get file URL from Sanity asset reference =====
export function getFileUrl(fileAsset: {
	asset?: { _ref?: string };
}): string | null {
	if (!fileAsset?.asset?._ref) return null;

	// Sanity file refs look like: file-<id>-<extension>
	// We need to convert to: https://cdn.sanity.io/files/<projectId>/<dataset>/<id>.<extension>
	const ref = fileAsset.asset._ref;
	const [, id, extension] = ref.split('-');
	const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
	const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

	return `https://cdn.sanity.io/files/${projectId}/${dataset}/${id}.${extension}`;
}

// ===================================================================
// GROQ QUERIES
// ===================================================================

// ===== DOWNLOADABLE DOCUMENTS =====
// Fetches the 3 documents (Application, Availability Form, Training Schedule)
export async function getDownloadableDocuments() {
	return client.fetch(
		`*[_type == "downloadableDocument" && isActive == true] | order(sortOrder asc) {
      _id,
      title,
      slug,
      description,
      file {
        asset-> {
          _id,
          url
        }
      },
      icon,
      sortOrder,
      lastUpdated
    }`,
	);
}

// ===== NEWSLETTER ISSUES =====
// All published issues for the archive page
export async function getNewsletterIssues() {
	return client.fetch(
		`*[_type == "newsletterIssue" && isPublished == true] | order(issueNumber desc) {
      _id,
      title,
      slug,
      issueNumber,
      publishDate,
      excerpt,
      category,
      readTimeMinutes,
      isSubscriberOnly,
      coverImage {
        asset-> { _id, url },
        alt
      }
    }`,
	);
}

// Single newsletter issue by slug
export async function getNewsletterIssueBySlug(slug: string) {
	return client.fetch(
		`*[_type == "newsletterIssue" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      issueNumber,
      publishDate,
      excerpt,
      body,
      category,
      readTimeMinutes,
      videoUrl,
      isSubscriberOnly,
      coverImage {
        asset-> { _id, url },
        alt
      }
    }`,
		{ slug },
	);
}

// ===== RESOURCES =====
// All published resources
export async function getResources() {
	return client.fetch(
		`*[_type == "resource" && isPublished == true] | order(sortOrder asc, publishDate desc) {
      _id,
      title,
      slug,
      description,
      category,
      resourceType,
      file {
        asset-> { _id, url }
      },
      videoUrl,
      externalUrl,
      isFeatured,
      publishDate,
      thumbnail {
        asset-> { _id, url },
        alt
      }
    }`,
	);
}

// ===== SITE SETTINGS =====
// Fetches the singleton site settings document
export async function getSiteSettings() {
	return client.fetch(
		`*[_type == "siteSettings"][0] {
      siteTitle,
      siteDescription,
      doctorName,
      doctorTitle,
      doctorHeadshot {
        asset-> { _id, url },
        alt
      },
      doctorBio,
      doctorQuote,
      heroHeadline,
      heroSubheadline,
      heroBadgeText,
      newsletterName,
      newsletterTagline,
      contactEmail,
      applicationEmail,
      stats,
      ogImage {
        asset-> { _id, url }
      }
    }`,
	);
}

// ===== TESTIMONIALS =====
// Fetches featured testimonials for the homepage
export async function getTestimonials() {
	return client.fetch(
		`*[_type == "testimonial" && isFeatured == true] | order(sortOrder asc) {
      _id,
      name,
      title,
      cohortYear,
      quote,
      institution,
      headshot {
        asset-> { _id, url },
        alt
      }
    }`,
	);
}
