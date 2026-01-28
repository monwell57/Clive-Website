import React from 'react';
import { Calendar, Clock, Tag, ArrowLeft, Share2, Bookmark } from 'lucide-react';

export default function NewsletterIssuePage() {
  return (
    <div className="min-h-screen bg-warmCream">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-warmCream/95 backdrop-blur-md z-50 border-b border-warmTaupe/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center space-x-2 text-richBlack hover:text-goldenYellow transition-colors group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Field Notes</span>
            </a>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-warmTaupe/10 rounded-lg transition-colors">
                <Share2 className="w-5 h-5 text-charcoalGray" />
              </button>
              <button className="p-2 hover:bg-warmTaupe/10 rounded-lg transition-colors">
                <Bookmark className="w-5 h-5 text-charcoalGray" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-6 bg-gradient-to-br from-charcoalGray to-richBlack">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center space-x-4 text-warmCream/80">
              <span className="text-sm font-medium">Field Notes</span>
              <span className="text-warmCream/40">•</span>
              <span className="text-sm">Issue 1</span>
              <span className="text-warmCream/40">•</span>
              <span className="text-sm">March 2026</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-warmCream leading-tight">
              Writing Your First Assessment Report
            </h1>

            <p className="text-xl text-warmCream/80 leading-relaxed">
              The structure, language, and thinking process that goes into clinical documentation that supervisors trust.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center space-x-2 text-warmCream/70">
                <Clock className="w-5 h-5 text-goldenYellow" />
                <span className="text-sm">7 min read</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Tag className="w-5 h-5 text-goldenYellow" />
                <div className="flex gap-2">
                  <span className="text-xs bg-goldenYellow/20 text-goldenYellow px-3 py-1 rounded-full">Clinical Skills</span>
                  <span className="text-xs bg-goldenYellow/20 text-goldenYellow px-3 py-1 rounded-full">Documentation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <article className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <div className="bg-goldenYellow/10 border-l-4 border-goldenYellow p-6 rounded-r-lg mb-12">
              <p className="text-charcoalGray leading-relaxed mb-0">
                <strong>Before we begin:</strong> This isn't a template you can copy-paste. Good clinical documentation comes from clear thinking about your client, the assessment process, and what your audience needs to know. This guide walks you through the thinking, not just the format.
              </p>
            </div>

            {/* Section 1 */}
            <div className="mb-12 animate-fade-in-up animation-delay-100">
              <h2 className="text-3xl font-bold text-richBlack mb-4">Understanding Your Audience</h2>
              <p className="text-charcoalGray leading-relaxed mb-4">
                Most students write assessment reports as if they're proving something to their professor. But your real audience is another clinician—someone who needs to make decisions about treatment, referrals, or continued care.
              </p>
              <p className="text-charcoalGray leading-relaxed mb-4">
                This changes everything about how you write. Instead of demonstrating that you know all the diagnostic criteria, you're answering specific questions: What's going on with this person? What do they need? What should the next clinician know?
              </p>
            </div>

            {/* Section 2 */}
            <div className="mb-12 animate-fade-in-up animation-delay-200">
              <h2 className="text-3xl font-bold text-richBlack mb-4">The Three-Part Structure</h2>
              
              <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                <h3 className="text-xl font-bold text-richBlack mb-3 flex items-center">
                  <span className="w-8 h-8 bg-goldenYellow text-richBlack rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                  What You Observed
                </h3>
                <p className="text-charcoalGray leading-relaxed pl-11">
                  Start with the objective data. What did you see, hear, and measure? This section establishes credibility—readers need to trust that you actually assessed this person thoroughly.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                <h3 className="text-xl font-bold text-richBlack mb-3 flex items-center">
                  <span className="w-8 h-8 bg-goldenYellow text-richBlack rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                  What It Means
                </h3>
                <p className="text-charcoalGray leading-relaxed pl-11">
                  This is your clinical formulation. Connect the observations to psychological concepts, explain patterns, and show your reasoning. This is where your training shows.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-richBlack mb-3 flex items-center">
                  <span className="w-8 h-8 bg-goldenYellow text-richBlack rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                  What To Do About It
                </h3>
                <p className="text-charcoalGray leading-relaxed pl-11">
                  Recommendations need to be specific and actionable. "Client would benefit from therapy" helps no one. "Client would benefit from CBT targeting anxiety-driven perfectionism, with focus on cognitive restructuring around achievement" gives the next clinician something to work with.
                </p>
              </div>
            </div>

            {/* Video Embed Section */}
            <div className="mb-12 animate-fade-in-up animation-delay-300">
              <h2 className="text-3xl font-bold text-richBlack mb-6">Watch: Walking Through a Sample Report</h2>
              <div className="bg-charcoalGray rounded-xl overflow-hidden shadow-2xl">
                <div className="aspect-video bg-warmCream/5 flex items-center justify-center relative group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-goldenYellow/10 to-transparent"></div>
                  <div className="relative z-10 text-center">
                    <div className="w-20 h-20 bg-goldenYellow rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                      <svg className="w-10 h-10 text-richBlack ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <p className="text-warmCream text-lg font-medium">15-Minute Report Walkthrough</p>
                    <p className="text-warmCream/60 text-sm mt-2">Available to subscribers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="mb-12 animate-fade-in-up animation-delay-400">
              <h2 className="text-3xl font-bold text-richBlack mb-4">Common Mistakes</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-warmTaupe pl-6">
                  <h4 className="font-bold text-richBlack mb-2">Overusing Jargon</h4>
                  <p className="text-charcoalGray leading-relaxed">
                    Technical terms are fine when they're precise. But writing "client exhibits prominent ruminative cognitive patterns" when you mean "client overthinks things" doesn't make you sound professional—it makes you sound like you're hiding behind language.
                  </p>
                </div>

                <div className="border-l-4 border-warmTaupe pl-6">
                  <h4 className="font-bold text-richBlack mb-2">Missing the Cultural Context</h4>
                  <p className="text-charcoalGray leading-relaxed">
                    Every assessment happens in a cultural context. If you're not addressing how identity, background, and systemic factors shape presentation and treatment needs, you're missing critical information.
                  </p>
                </div>

                <div className="border-l-4 border-warmTaupe pl-6">
                  <h4 className="font-bold text-richBlack mb-2">Vague Recommendations</h4>
                  <p className="text-charcoalGray leading-relaxed">
                    "Client would benefit from therapy" isn't a recommendation—it's a shrug. Be specific about modality, focus, and priorities. Give the next clinician something actionable.
                  </p>
                </div>
              </div>
            </div>

            {/* Conclusion */}
            <div className="bg-charcoalGray rounded-xl p-8 text-warmCream mb-12">
              <h3 className="text-2xl font-bold mb-4">The Bottom Line</h3>
              <p className="leading-relaxed mb-4">
                Good assessment reports require clear thinking before clear writing. If you're not sure what's going on with a client, no amount of professional language will hide it. Start with understanding, then document what you understand.
              </p>
              <p className="leading-relaxed opacity-80">
                Next month's Field Notes will cover cultural formulation in practice—how to actually integrate cultural considerations into your clinical thinking, not just check boxes on a form.
              </p>
            </div>

            {/* Download CTA */}
            <div className="bg-gradient-to-br from-goldenYellow/10 to-deepGold/10 rounded-xl p-8 border-2 border-goldenYellow/30 text-center">
              <h3 className="text-2xl font-bold text-richBlack mb-3">Want the Full Framework?</h3>
              <p className="text-charcoalGray mb-6">
                Download the Cultural Formulation Template for a structured approach to culturally responsive assessment.
              </p>
              <a 
                href="#" 
                className="inline-flex items-center space-x-2 bg-goldenYellow hover:bg-deepGold text-richBlack px-8 py-4 rounded-lg font-bold transition-all duration-300 transform hover:scale-105"
              >
                <span>Download Free Template</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </article>

      {/* Related Issues */}
      <section className="py-16 px-6 bg-warmCream border-t border-warmTaupe/20">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-richBlack mb-8">More from Field Notes</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                issue: 'Issue 2',
                title: 'Cultural Formulation in Practice',
                excerpt: 'Moving beyond theoretical frameworks to actual clinical application.',
                date: 'April 2026'
              },
              {
                issue: 'Issue 3',
                title: 'Understanding Training Site Culture',
                excerpt: 'Questions to ask during internship interviews that reveal site values.',
                date: 'May 2026'
              },
              {
                issue: 'Issue 4',
                title: 'What Supervisors Actually Look For',
                excerpt: 'How to demonstrate clinical judgment in applications and interviews.',
                date: 'June 2026'
              }
            ].map((issue, index) => (
              <a 
                key={index}
                href="#"
                className="block bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-2"
              >
                <div className="text-sm text-warmTaupe mb-3">{issue.issue} • {issue.date}</div>
                <h4 className="text-xl font-bold text-richBlack mb-3 group-hover:text-goldenYellow transition-colors">
                  {issue.title}
                </h4>
                <p className="text-charcoalGray text-sm leading-relaxed">
                  {issue.excerpt}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 px-6 bg-charcoalGray">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold text-warmCream mb-4">Never Miss an Issue</h3>
          <p className="text-warmCream/80 text-lg mb-8">
            Get Field Notes delivered monthly. Real insights from clinical practice.
          </p>
          <a 
            href="/#subscribe" 
            className="inline-flex items-center space-x-2 bg-goldenYellow hover:bg-deepGold text-richBlack px-8 py-4 rounded-lg font-bold transition-all duration-300 transform hover:scale-105"
          >
            <span>Subscribe to Field Notes</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-richBlack py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-warmCream/60 text-sm">
            © 2026 South Central Training Consortium. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}