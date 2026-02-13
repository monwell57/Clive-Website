import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per file

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const applicantName = formData.get('applicantName') as string;
    const applicantEmail = formData.get('applicantEmail') as string;
    const coverLetter = formData.get('coverLetter') as File;
    const resume = formData.get('resume') as File;
    const application = formData.get('application') as File;
    const availabilityForm = formData.get('availabilityForm') as File;

    // ── Validation ──────────────────────────────────────────
    if (!applicantName || !applicantEmail) {
      return NextResponse.json(
        { error: 'Name and email are required.' },
        { status: 400 }
      );
    }

    if (!coverLetter || !resume || !application || !availabilityForm) {
      return NextResponse.json(
        { error: 'All four documents are required.' },
        { status: 400 }
      );
    }

    const files = [coverLetter, resume, application, availabilityForm];
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File "${file.name}" exceeds the 10MB limit.` },
          { status: 400 }
        );
      }
      if (file.type !== 'application/pdf') {
        return NextResponse.json(
          { error: `File "${file.name}" must be a PDF.` },
          { status: 400 }
        );
      }
    }

    // ── Convert files to base64 for email attachments ────────
    const toBase64 = async (file: File): Promise<string> => {
      const buffer = await file.arrayBuffer();
      return Buffer.from(buffer).toString('base64');
    };

    const [
      coverLetterB64,
      resumeB64,
      applicationB64,
      availabilityFormB64,
    ] = await Promise.all([
      toBase64(coverLetter),
      toBase64(resume),
      toBase64(application),
      toBase64(availabilityForm),
    ]);

    // ── Email to Clive (with attachments) ────────────────────
    await resend.emails.send({
      from: 'SCTC Applications <applications@yourdomain.com>',
      to: process.env.CLIVE_EMAIL!,
      subject: `New Internship Application — ${applicantName}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #3d3d3d; padding: 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #e6b84d; margin: 0; font-size: 24px;">New Internship Application</h1>
            <p style="color: #f5f0e8; margin: 8px 0 0 0; opacity: 0.8;">South Central Training Consortium</p>
          </div>
          
          <div style="background: #f5f0e8; padding: 24px; border-radius: 0 0 12px 12px;">
            <h2 style="color: #2d2d2d; margin-top: 0;">Applicant Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #8b7355; font-size: 14px; width: 140px;">Name</td>
                <td style="padding: 8px 0; color: #2d2d2d; font-weight: bold;">${applicantName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #8b7355; font-size: 14px;">Email</td>
                <td style="padding: 8px 0; color: #2d2d2d;">
                  <a href="mailto:${applicantEmail}" style="color: #c99a3d;">${applicantEmail}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #8b7355; font-size: 14px;">Submitted</td>
                <td style="padding: 8px 0; color: #2d2d2d;">${new Date().toLocaleDateString('en-US', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })}</td>
              </tr>
            </table>
            
            <h2 style="color: #2d2d2d; margin-top: 24px;">Documents Attached</h2>
            <ul style="color: #3d3d3d; padding-left: 20px;">
              <li style="padding: 4px 0;">✅ Cover Letter — ${coverLetter.name}</li>
              <li style="padding: 4px 0;">✅ Resume / CV — ${resume.name}</li>
              <li style="padding: 4px 0;">✅ Completed Application — ${application.name}</li>
              <li style="padding: 4px 0;">✅ Completed Availability Form — ${availabilityForm.name}</li>
            </ul>

            <div style="margin-top: 24px; padding: 16px; background: #e6b84d/10; border-left: 4px solid #e6b84d; border-radius: 4px;">
              <p style="margin: 0; color: #2d2d2d; font-size: 14px;">
                Reply directly to this email to contact the applicant at 
                <a href="mailto:${applicantEmail}" style="color: #c99a3d;">${applicantEmail}</a>
              </p>
            </div>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `cover-letter-${applicantName.replace(/\s+/g, '-').toLowerCase()}.pdf`,
          content: coverLetterB64,
          contentType: 'application/pdf',
        },
        {
          filename: `resume-${applicantName.replace(/\s+/g, '-').toLowerCase()}.pdf`,
          content: resumeB64,
          contentType: 'application/pdf',
        },
        {
          filename: `application-${applicantName.replace(/\s+/g, '-').toLowerCase()}.pdf`,
          content: applicationB64,
          contentType: 'application/pdf',
        },
        {
          filename: `availability-form-${applicantName.replace(/\s+/g, '-').toLowerCase()}.pdf`,
          content: availabilityFormB64,
          contentType: 'application/pdf',
        },
      ],
      replyTo: applicantEmail,
    });

    // ── Confirmation email to applicant ──────────────────────
    await resend.emails.send({
      from: 'SCTC <no-reply@yourdomain.com>',
      to: applicantEmail,
      subject: 'Application Received — South Central Training Consortium',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #3d3d3d; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
            <div style="background: #e6b84d; width: 48px; height: 48px; border-radius: 8px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
              <span style="font-weight: bold; color: #2d2d2d; font-size: 18px;">SC</span>
            </div>
            <h1 style="color: #e6b84d; margin: 0; font-size: 24px;">Application Received!</h1>
            <p style="color: #f5f0e8; margin: 8px 0 0 0; opacity: 0.8;">South Central Training Consortium</p>
          </div>
          
          <div style="background: #f5f0e8; padding: 32px; border-radius: 0 0 12px 12px;">
            <p style="color: #2d2d2d; font-size: 16px;">Dear ${applicantName},</p>
            
            <p style="color: #3d3d3d; line-height: 1.7;">
              Thank you for applying to the South Central Training Consortium Pre-Doctoral Internship Program. 
              We have received your application and all supporting documents.
            </p>

            <div style="background: white; border-radius: 8px; padding: 20px; margin: 24px 0; border: 1px solid #8b7355/20;">
              <h3 style="color: #2d2d2d; margin-top: 0; font-size: 16px;">Documents Received</h3>
              <ul style="color: #3d3d3d; padding-left: 20px; margin: 0;">
                <li style="padding: 4px 0;">Cover Letter</li>
                <li style="padding: 4px 0;">Resume / CV</li>
                <li style="padding: 4px 0;">Completed Application</li>
                <li style="padding: 4px 0;">Completed Availability Form</li>
              </ul>
            </div>
            
            <h3 style="color: #2d2d2d;">What Happens Next</h3>
            <ol style="color: #3d3d3d; line-height: 1.9; padding-left: 20px;">
              <li>Our team will review your application within <strong>5-7 business days</strong></li>
              <li>If selected for an interview, you'll receive an email at this address</li>
              <li>Interviews are conducted via video call with Dr. Kennedy</li>
              <li>Final decisions are communicated by the end of the application cycle</li>
            </ol>

            <p style="color: #3d3d3d; line-height: 1.7; margin-top: 24px;">
              In the meantime, we invite you to subscribe to our <strong>Field Notes</strong> newsletter 
              for monthly insights on clinical psychology training and cultural competence.
            </p>

            <div style="text-align: center; margin-top: 32px;">
              <a 
                href="${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/#field-notes"
                style="background: #e6b84d; color: #2d2d2d; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;"
              >
                Read Field Notes
              </a>
            </div>

            <p style="color: #8b7355; font-size: 13px; margin-top: 32px; padding-top: 16px; border-top: 1px solid #8b7355/20;">
              Questions? Reply to this email or contact us at 
              <a href="mailto:${process.env.CLIVE_EMAIL}" style="color: #c99a3d;">${process.env.CLIVE_EMAIL}</a>
            </p>
          </div>
        </div>
      `,
    });

    // ── Optional: Zapier webhook for Google Drive ────────────
    if (process.env.ZAPIER_WEBHOOK_URL) {
      await fetch(process.env.ZAPIER_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantName,
          applicantEmail,
          submittedAt: new Date().toISOString(),
          documents: ['Cover Letter', 'Resume/CV', 'Application', 'Availability Form'],
        }),
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Application submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process application. Please try again.' },
      { status: 500 }
    );
  }
}