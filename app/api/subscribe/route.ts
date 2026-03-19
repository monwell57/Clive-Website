// Path: app/api/subscribe/route.ts

import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { Resend } from 'resend';

// ===== SANITY CLIENT (write access) =====
const sanityClient = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
	apiVersion: '2026-02-01',
	token: process.env.SANITY_WRITE_TOKEN!,
	useCdn: false,
});

// ===== RESEND CLIENT =====
const resend = new Resend(process.env.RESEND_API_KEY!);

// ===== JOURNEY STAGE LABELS =====
const journeyLabels: Record<string, string> = {
	exploring: 'Exploring clinical psychology',
	applying: 'Preparing for internship applications',
	postdoc: 'Seeking post-doc/supervision hours',
	licensed: 'Licensed professional seeking consultation',
};

export async function POST(request: Request) {
	try {
		const { email, journey } = await request.json();

		if (!email || !journey) {
			return NextResponse.json(
				{ error: 'Email and journey are required' },
				{ status: 400 },
			);
		}

		// ── 1. Check if subscriber already exists in Sanity ──
		const existing = await sanityClient.fetch(
			`*[_type == "subscriber" && email == $email][0]{ _id }`,
			{ email },
		);

		if (existing) {
			return NextResponse.json({
				message: 'Already subscribed!',
			});
		}

		// ── 2. Create subscriber record in Sanity ──
		await sanityClient.create({
			_type: 'subscriber',
			email,
			journeyStage: journey,
			subscribedAt: new Date().toISOString(),
			source: 'website',
		});

		// ── 3. Send welcome email via Resend ──
		try {
			await resend.emails.send({
				from:
					process.env.RESEND_FROM_EMAIL ||
					'SCTC Newsletter <onboarding@resend.dev>',
				to: email,
				subject: 'Welcome to the SCTC Newsletter!',
				html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="border-bottom: 3px solid #e6b84d; padding-bottom: 20px; margin-bottom: 30px;">
              <h1 style="color: #2d2d2d; font-size: 28px; margin: 0;">
                Welcome to the Newsletter
              </h1>
              <p style="color: #8b7355; font-size: 14px; margin-top: 8px;">
                South Central Training Consortium
              </p>
            </div>
            
            <p style="color: #3d3d3d; font-size: 16px; line-height: 1.7;">
              Thank you for subscribing! You've joined a growing community of 
              psychology professionals and students committed to culturally 
              competent clinical practice.
            </p>
            
            <p style="color: #3d3d3d; font-size: 16px; line-height: 1.7;">
              Based on your journey stage — <strong>${journeyLabels[journey] || journey}</strong> — 
              we'll make sure the content we share is relevant to where you are 
              in your career.
            </p>
            
            <p style="color: #3d3d3d; font-size: 16px; line-height: 1.7;">
              Here's what to expect:
            </p>
            
            <ul style="color: #3d3d3d; font-size: 16px; line-height: 2;">
              <li>Monthly insights on clinical training and cultural competence</li>
              <li>Practical advice from Dr. Clive D. Kennedy</li>
              <li>Updates on internship application cycles</li>
            </ul>
            
            <div style="background: #f5f0e8; border-radius: 12px; padding: 24px; margin: 30px 0;">
              <p style="color: #2d2d2d; font-size: 16px; margin: 0; font-style: italic;">
                "When I was a grad student, nobody told me how to navigate the 
                real challenges of clinical practice. This is what I wish I'd had."
              </p>
              <p style="color: #8b7355; font-size: 14px; margin-top: 12px;">
                — Dr. Clive D. Kennedy
              </p>
            </div>
            
            <p style="color: #3d3d3d; font-size: 16px; line-height: 1.7;">
              In the meantime, feel free to explore our 
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://clivedkennedyphd.com'}/resources" 
                 style="color: #e6b84d; text-decoration: underline;">
                training resources
              </a>.
            </p>
            
            <p style="color: #8b7355; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e6e0d4;">
              South Central Training Consortium<br>
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://clivedkennedyphd.com'}" 
                 style="color: #e6b84d;">
                clivedkennedyphd.com
              </a>
            </p>
          </div>
        `,
			});
		} catch (emailError) {
			// Log but don't fail — subscriber was already saved to Sanity
			console.error('Welcome email failed:', emailError);
		}

		return NextResponse.json({
			message: 'Successfully subscribed!',
		});
	} catch (error) {
		console.error('Subscribe error:', error);
		return NextResponse.json(
			{ error: 'Failed to subscribe. Please try again.' },
			{ status: 500 },
		);
	}
}
