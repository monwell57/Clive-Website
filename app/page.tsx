'use client';

import React, { useState } from 'react';
import { Calendar, BookOpen, Users, Download, Mail, ChevronRight, Play, ExternalLink } from 'lucide-react';

export default function HomePage() {
  const [email, setEmail] = useState<string>('');
  const [journey, setJourney] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const newsletterIssues = [
    {
      issue: 'Issue 4',
      date: 'June 2026',
      title: 'What Supervisors Actually Look For',
      excerpt: 'Beyond the credentials—how to demonstrate clinical judgment in your application materials and interviews.',
      readTime: '6 min read',
      status: 'subscribers' as const,
      topics: ['Career Advice', 'Applications']
    },
    {
      issue: 'Issue 3',
      date: 'May 2026',
      title: 'Understanding Training Site Culture',
      excerpt: 'Questions to ask during internship interviews that reveal whether a site will actually support your development.',
      readTime: '5 min read',
      status: 'subscribers' as const,
      topics: ['Internship', 'Career Advice']
    },
    {
      issue: 'Issue 2',
      date: 'April 2026',
      title: 'Cultural Formulation in Practice',
      excerpt: 'Moving beyond theoretical frameworks to actual clinical application—with case examples and common pitfalls.',
      readTime: '8 min read',
      status: 'subscribers' as const,
      topics: ['Cultural Competence', 'Clinical Skills']
    },
    {
      issue: 'Issue 1',
      date: 'March 2026',
      title: 'Writing Your First Assessment Report',
      excerpt: 'The structure, language, and thinking process that goes into clinical documentation that supervisors trust.',
      readTime: '7 min read',
      status: 'preview' as const,
      topics: ['Clinical Skills', 'Documentation']
    }
  ];

  const resources = [
    {
      type: 'Video',
      icon: Play,
      title: 'Cultural Assessment Framework',
      description: '15-minute walkthrough of the assessment process I use with every client.',
      duration: '15 min',
      category: 'Cultural Competence'
    },
    {
      type: 'PDF',
      icon: Download,
      title: 'Clinical Documentation Checklist',
      description: 'Essential elements for progress notes, assessments, and treatment plans.',
      pages: '8 pages',
      category: 'Clinical Skills'
    },
    {
      type: 'Article',
      icon: BookOpen,
      title: 'Supervision: What to Expect',
      description: 'How supervision works here—structure, expectations, and growth opportunities.',
      readTime: '6 min read',
      category: 'Training'
    }
  ];

  const leadMagnetFeatures = [
    'Step-by-step assessment structure',
    'Cultural identity considerations',
    'Contextual factors framework',
    'Report writing examples'
  ];

  return (
    <div className="min-h-screen bg-[--color-warm-cream]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[--color-warm-cream]/80 backdrop-blur-md z-50 border-b border-[--color-warm-taupe]/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-[--color-golden-yellow] rounded-lg flex items-center justify-center">
                <span className="text-[--color-rich-black] font-bold text-xl">SC</span>
              </div>
              <div>
                <h1 className="text-[--color-rich-black] font-semibold text-lg leading-tight">South Central Training Consortium</h1>
                <p className="text-[--color-warm-taupe] text-xs">Clinical Psychology Training</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#field-notes" className="text-[--color-rich-black] hover:text-[--color-golden-yellow] transition-colors">Field Notes</a>
              <a href="#resources" className="text-[--color-rich-black] hover:text-[--color-golden-yellow] transition-colors">Resources</a>
              <a href="#about" className="text-[--color-rich-black] hover:text-[--color-golden-yellow] transition-colors">About</a>
              <a href="#contact" className="text-[--color-rich-black] hover:text-[--color-golden-yellow] transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <div className="inline-block">
                <span className="bg-[--color-golden-yellow]/20 text-[--color-deep-gold] px-4 py-2 rounded-full text-sm font-medium border border-[--color-golden-yellow]/30">
                  Fall 2026 Applications Open September
                </span>
              </div>
              
              <h2 className="text-5xl lg:text-6xl font-bold text-[--color-rich-black] leading-tight">
                Clinical Psychology Training:
                <span className="block text-[--color-golden-yellow] mt-2">The Reality Behind the Practice</span>
              </h2>
              
              <p className="text-xl text-[--color-charcoal-gray] leading-relaxed">
                Monthly field notes on cultural competence, clinical supervision, and building a psychology practice from the ground up—straight from South Central LA.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a 
                  href="#subscribe" 
                  className="group bg-[--color-golden-yellow] hover:bg-[--color-deep-gold] text-[--color-rich-black] px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 hover:shadow-xl"
                >
                  <Mail className="w-5 h-5" />
                  <span>Get Field Notes</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                
                <a 
                  href="#lead-magnet" 
                  className="group border-2 border-[--color-charcoal-gray] hover:border-[--color-golden-yellow] text-[--color-rich-black] px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Free Template</span>
                </a>
              </div>

              <p className="text-sm text-[--color-warm-taupe]">
                Application season moves fast. Get 8 months of field notes before the next cycle.
              </p>
            </div>

            {/* Hero Visual */}
            <div className="relative animate-fade-in-up animation-delay-200">
              <div className="bg-[--color-charcoal-gray] rounded-2xl p-8 shadow-2xl border border-[--color-warm-taupe]/10">
                <div className="aspect-[4/3] bg-[--color-warm-cream]/5 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[--color-golden-yellow]/10 to-transparent"></div>
                  <div className="relative z-10 text-center p-8">
                    <div className="w-32 h-32 bg-[--color-golden-yellow]/20 rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-[--color-golden-yellow]/30">
                      <BookOpen className="w-16 h-16 text-[--color-golden-yellow]" />
                    </div>
                    <p className="text-[--color-warm-cream]/90 text-lg font-medium">Dr. Clive D. Kennedy</p>
                    <p className="text-[--color-warm-cream]/60 text-sm mt-2">Training Director</p>
                    <p className="text-[--color-warm-cream]/60 text-xs mt-1">The Chicago School of Professional Psychology</p>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between text-[--color-warm-cream]/80 text-sm">
                    <span className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-[--color-golden-yellow]" />
                      <span>200+ Students</span>
                    </span>
                    <span className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-[--color-golden-yellow]" />
                      <span>24+ Years Experience</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section id="subscribe" className="py-20 px-6 bg-[--color-charcoal-gray]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <h3 className="text-4xl font-bold text-[--color-warm-cream] mb-4">Join Field Notes</h3>
            <p className="text-[--color-warm-cream]/80 text-lg max-w-2xl mx-auto">
              Monthly insights for the next generation of clinical psychologists. No fluff, no spam—just what you need to know.
            </p>
          </div>

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="bg-[--color-warm-cream] rounded-2xl p-8 shadow-2xl animate-fade-in-up animation-delay-200">
              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-[--color-rich-black] font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@university.edu"
                    required
                    className="w-full px-4 py-3 border-2 border-[--color-warm-taupe]/30 rounded-lg focus:border-[--color-golden-yellow] focus:outline-none focus:ring-2 focus:ring-[--color-golden-yellow]/20 transition-all duration-300"
                  />
                </div>

                <div>
                  <label htmlFor="journey" className="block text-[--color-rich-black] font-medium mb-2">
                    Where are you in your journey?
                  </label>
                  <select
                    id="journey"
                    value={journey}
                    onChange={(e) => setJourney(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-[--color-warm-taupe]/30 rounded-lg focus:border-[--color-golden-yellow] focus:outline-none focus:ring-2 focus:ring-[--color-golden-yellow]/20 transition-all duration-300 bg-white"
                  >
                    <option value="">Select your stage...</option>
                    <option value="exploring">Exploring clinical psychology (undergrad/early grad)</option>
                    <option value="applying">Preparing for internship applications (3rd-4th year)</option>
                    <option value="postdoc">Seeking post-doc/supervision hours</option>
                    <option value="licensed">Licensed professional seeking consultation</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[--color-golden-yellow] hover:bg-[--color-deep-gold] text-[--color-rich-black] font-bold py-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[--color-rich-black]/30 border-t-[--color-rich-black] rounded-full animate-spin"></div>
                      <span>Subscribing...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      <span>Subscribe to Field Notes</span>
                    </>
                  )}
                </button>

                <p className="text-center text-[--color-warm-taupe] text-sm">
                  Join 200+ students and professionals. Unsubscribe anytime.
                </p>
              </div>
            </form>
          ) : (
            <div className="bg-[--color-warm-cream] rounded-2xl p-12 shadow-2xl text-center animate-scale-in">
              <div className="w-16 h-16 bg-[--color-golden-yellow]/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-[--color-golden-yellow]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-[--color-rich-black] mb-3">Check Your Email!</h4>
              <p className="text-[--color-charcoal-gray] mb-6">
                We've sent you a confirmation link. Click it to get your Cultural Formulation Template and first Field Notes issue.
              </p>
              <p className="text-[--color-warm-taupe] text-sm">
                Can't find it? Check your spam folder or contact us.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lead Magnet Section */}
      <section id="lead-magnet" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-[--color-golden-yellow]/10 to-[--color-deep-gold]/10 rounded-2xl p-12 border-2 border-[--color-golden-yellow]/30">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in-up">
                <div className="inline-block bg-[--color-golden-yellow] text-[--color-rich-black] px-4 py-2 rounded-full text-sm font-bold mb-6">
                  FREE RESOURCE
                </div>
                <h3 className="text-4xl font-bold text-[--color-rich-black] mb-6">
                  Cultural Formulation Template
                </h3>
                <p className="text-[--color-charcoal-gray] text-lg mb-6 leading-relaxed">
                  The exact framework I use for writing culturally responsive clinical reports. Not generic theory—practical application refined over 24 years of practice.
                </p>
                
                <ul className="space-y-3 mb-8">
                  {leadMagnetFeatures.map((item, index) => (
                    <li key={index} className="flex items-center space-x-3 text-[--color-charcoal-gray]">
                      <div className="w-6 h-6 bg-[--color-golden-yellow] rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-[--color-rich-black]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <a 
                  href="#subscribe" 
                  className="inline-flex items-center space-x-2 bg-[--color-golden-yellow] hover:bg-[--color-deep-gold] text-[--color-rich-black] px-8 py-4 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-xl group"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Free Template</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              <div className="animate-fade-in-up animation-delay-200">
                <div className="bg-white rounded-xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                  <div className="aspect-[8.5/11] bg-[--color-warm-cream] border-2 border-[--color-warm-taupe]/20 rounded-lg p-6">
                    <div className="space-y-4">
                      <div className="h-4 bg-[--color-golden-yellow]/30 rounded w-3/4"></div>
                      <div className="h-4 bg-[--color-warm-taupe]/20 rounded w-full"></div>
                      <div className="h-4 bg-[--color-warm-taupe]/20 rounded w-5/6"></div>
                      <div className="h-8 bg-[--color-golden-yellow]/20 rounded w-full mt-6"></div>
                      <div className="space-y-2 mt-4">
                        <div className="h-3 bg-[--color-warm-taupe]/20 rounded w-full"></div>
                        <div className="h-3 bg-[--color-warm-taupe]/20 rounded w-full"></div>
                        <div className="h-3 bg-[--color-warm-taupe]/20 rounded w-4/5"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-[--color-warm-taupe] text-sm mt-4">12-page downloadable PDF</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Archive Preview */}
      <section id="field-notes" className="py-20 px-6 bg-[--color-warm-cream]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h3 className="text-4xl font-bold text-[--color-rich-black] mb-4">Recent Field Notes</h3>
            <p className="text-[--color-charcoal-gray] text-lg max-w-2xl mx-auto">
              Real insights from clinical practice. Subscribe to get each issue delivered monthly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsletterIssues.map((note, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-2 bg-gradient-to-r from-[--color-golden-yellow] to-[--color-deep-gold]"></div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[--color-warm-taupe] text-sm font-medium">{note.issue}</span>
                    <span className="text-[--color-warm-taupe] text-sm">{note.date}</span>
                  </div>

                  <h4 className="text-xl font-bold text-[--color-rich-black] mb-3 group-hover:text-[--color-golden-yellow] transition-colors">
                    {note.title}
                  </h4>

                  <p className="text-[--color-charcoal-gray] text-sm leading-relaxed mb-4">
                    {note.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {note.topics.map((topic, i) => (
                      <span key={i} className="text-xs bg-[--color-warm-cream] text-[--color-warm-taupe] px-3 py-1 rounded-full">
                        {topic}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[--color-warm-taupe]/10">
                    <span className="text-xs text-[--color-warm-taupe]">{note.readTime}</span>
                    {note.status === 'subscribers' ? (
                      <a 
                        href="#subscribe" 
                        className="text-sm text-[--color-golden-yellow] hover:text-[--color-deep-gold] font-medium flex items-center space-x-1 group-hover:translate-x-1 transition-transform"
                      >
                        <span>Subscribe to read</span>
                        <ChevronRight className="w-4 h-4" />
                      </a>
                    ) : (
                      <a 
                        href="#" 
                        className="text-sm text-[--color-golden-yellow] hover:text-[--color-deep-gold] font-medium flex items-center space-x-1 group-hover:translate-x-1 transition-transform"
                      >
                        <span>Read preview</span>
                        <ChevronRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a 
              href="#subscribe" 
              className="inline-flex items-center space-x-2 text-[--color-golden-yellow] hover:text-[--color-deep-gold] font-semibold transition-colors group"
            >
              <span>View all Field Notes</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-[--color-charcoal-gray]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-2 animate-fade-in-up">
              <div className="aspect-square bg-[--color-warm-cream]/5 rounded-2xl flex items-center justify-center border-2 border-[--color-golden-yellow]/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[--color-golden-yellow]/10 to-transparent"></div>
                <div className="relative z-10 text-center p-8">
                  <div className="w-48 h-48 bg-[--color-golden-yellow]/20 rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-[--color-golden-yellow]/30">
                    <Users className="w-24 h-24 text-[--color-golden-yellow]" />
                  </div>
                  <p className="text-[--color-warm-cream] text-sm opacity-60">Dr. Kennedy - Placeholder Image</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6 animate-fade-in-up animation-delay-200">
              <blockquote className="text-2xl text-[--color-warm-cream] italic border-l-4 border-[--color-golden-yellow] pl-6 mb-8">
                "When I was a grad student, nobody told me how to navigate the real challenges of clinical practice. This is what I wish I'd had."
              </blockquote>

              <div className="space-y-4 text-[--color-warm-cream]/90 leading-relaxed">
                <p>
                  I'm a product of South Central Los Angeles, shaped by community resilience and the complexities of serving diverse populations. For over two decades, I've worked at the intersection of clinical psychology, cultural competence, and practical training.
                </p>

                <p>
                  My practice isn't about theory for theory's sake—it's about preparing the next generation of psychologists to serve real communities with real cultural awareness. From assessment to supervision, every aspect of training here reflects what actually works in the field.
                </p>

                <p>
                  Field Notes is my way of sharing what I've learned—not the sanitized textbook version, but the reality of building a meaningful clinical practice.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-6">
                <div className="flex items-center space-x-2 text-[--color-warm-cream]/80">
                  <div className="w-2 h-2 bg-[--color-golden-yellow] rounded-full"></div>
                  <span className="text-sm">The Chicago School of Professional Psychology</span>
                </div>
                <div className="flex items-center space-x-2 text-[--color-warm-cream]/80">
                  <div className="w-2 h-2 bg-[--color-golden-yellow] rounded-full"></div>
                  <span className="text-sm">24+ Years Clinical Experience</span>
                </div>
                <div className="flex items-center space-x-2 text-[--color-warm-cream]/80">
                  <div className="w-2 h-2 bg-[--color-golden-yellow] rounded-full"></div>
                  <span className="text-sm">Cultural Competence Specialist</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Preview */}
      <section id="resources" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h3 className="text-4xl font-bold text-[--color-rich-black] mb-4">Training Resources</h3>
            <p className="text-[--color-charcoal-gray] text-lg max-w-2xl mx-auto">
              Curated tools, frameworks, and guides for developing clinical competence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((resource, index) => {
              const IconComponent = resource.icon;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-2 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs bg-[--color-golden-yellow]/20 text-[--color-deep-gold] px-3 py-1 rounded-full font-medium">
                        {resource.type}
                      </span>
                      <IconComponent className="w-6 h-6 text-[--color-golden-yellow]" />
                    </div>

                    <h4 className="text-lg font-bold text-[--color-rich-black] mb-3 group-hover:text-[--color-golden-yellow] transition-colors">
                      {resource.title}
                    </h4>

                    <p className="text-[--color-charcoal-gray] text-sm leading-relaxed mb-4">
                      {resource.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-[--color-warm-taupe]/10">
                      <span className="text-xs text-[--color-warm-taupe]">{resource.duration || resource.pages || resource.readTime}</span>
                      <span className="text-xs text-[--color-warm-taupe]">{resource.category}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <a 
              href="#subscribe" 
              className="inline-flex items-center space-x-2 bg-[--color-golden-yellow] hover:bg-[--color-deep-gold] text-[--color-rich-black] px-8 py-4 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <span>Access Full Resource Library</span>
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[--color-rich-black] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-[--color-golden-yellow] rounded-lg flex items-center justify-center">
                  <span className="text-[--color-rich-black] font-bold">SC</span>
                </div>
                <div>
                  <h4 className="text-[--color-warm-cream] font-semibold">South Central Training Consortium</h4>
                  <p className="text-[--color-warm-cream]/60 text-xs">Clinical Psychology Training</p>
                </div>
              </div>
              <p className="text-[--color-warm-cream]/70 text-sm leading-relaxed">
                Training the next generation of culturally competent clinical psychologists through practical supervision and real-world application.
              </p>
            </div>

            <div>
              <h5 className="text-[--color-warm-cream] font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2">
                <li><a href="#field-notes" className="text-[--color-warm-cream]/70 hover:text-[--color-golden-yellow] text-sm transition-colors">Field Notes</a></li>
                <li><a href="#resources" className="text-[--color-warm-cream]/70 hover:text-[--color-golden-yellow] text-sm transition-colors">Resources</a></li>
                <li><a href="#about" className="text-[--color-warm-cream]/70 hover:text-[--color-golden-yellow] text-sm transition-colors">About</a></li>
                <li><a href="#contact" className="text-[--color-warm-cream]/70 hover:text-[--color-golden-yellow] text-sm transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-[--color-warm-cream] font-semibold mb-4">Connect</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-[--color-warm-cream]/70 hover:text-[--color-golden-yellow] text-sm transition-colors flex items-center space-x-2">
                  <ExternalLink className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a></li>
                <li><a href="#" className="text-[--color-warm-cream]/70 hover:text-[--color-golden-yellow] text-sm transition-colors flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[--color-warm-cream]/10 pt-8 text-center">
            <p className="text-[--color-warm-cream]/60 text-sm">
              © 2026 South Central Training Consortium. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}