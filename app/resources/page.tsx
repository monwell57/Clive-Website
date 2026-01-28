import React, { useState } from 'react';
import { BookOpen, Video, FileText, Download, ExternalLink, Search, Filter, Play } from 'lucide-react';

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Resources' },
    { id: 'clinical-skills', label: 'Clinical Skills' },
    { id: 'cultural-competence', label: 'Cultural Competence' },
    { id: 'documentation', label: 'Documentation' },
    { id: 'career', label: 'Career Development' }
  ];

  const resources = [
    {
      type: 'video',
      icon: Video,
      title: 'Cultural Assessment Framework',
      description: '15-minute walkthrough of the assessment process I use with every client. Covers the key questions, common pitfalls, and how to document cultural factors effectively.',
      category: 'cultural-competence',
      duration: '15 min',
      featured: true
    },
    {
      type: 'pdf',
      icon: FileText,
      title: 'Clinical Documentation Checklist',
      description: 'Essential elements for progress notes, treatment plans, and assessment reports. What to include, what to skip, and how to write efficiently.',
      category: 'documentation',
      pages: '8 pages',
      featured: true
    },
    {
      type: 'article',
      icon: BookOpen,
      title: 'Supervision: What to Expect',
      description: 'How supervision works at SCTC—structure, expectations, feedback process, and how we support your growth as a clinician.',
      category: 'clinical-skills',
      readTime: '6 min read',
      featured: false
    },
    {
      type: 'video',
      icon: Video,
      title: 'Writing Culturally Responsive Reports',
      description: 'How to integrate cultural formulation into your clinical documentation without it feeling like an add-on or checkbox exercise.',
      category: 'cultural-competence',
      duration: '22 min',
      featured: false
    },
    {
      type: 'pdf',
      icon: FileText,
      title: 'APPIC Application Timeline',
      description: 'Month-by-month guide to the internship application process. When to reach out to sites, what to prepare, and how to stay organized.',
      category: 'career',
      pages: '6 pages',
      featured: false
    },
    {
      type: 'article',
      icon: BookOpen,
      title: 'Common Assessment Mistakes',
      description: 'The errors I see most often in student reports and how to avoid them. From diagnostic reasoning to cultural blind spots.',
      category: 'clinical-skills',
      readTime: '8 min read',
      featured: false
    },
    {
      type: 'external',
      icon: ExternalLink,
      title: 'APA Multicultural Guidelines',
      description: 'Official guidelines for integrating cultural considerations into psychological practice. Essential reading for all trainees.',
      category: 'cultural-competence',
      link: 'https://www.apa.org/',
      featured: false
    },
    {
      type: 'pdf',
      icon: FileText,
      title: 'Interview Preparation Guide',
      description: 'What training sites are really asking when they interview you—and how to prepare answers that show clinical maturity.',
      category: 'career',
      pages: '10 pages',
      featured: false
    },
    {
      type: 'video',
      icon: Video,
      title: 'Clinical Formulation Workshop',
      description: 'How to think through a case from assessment data to treatment recommendations. Includes two worked examples.',
      category: 'clinical-skills',
      duration: '28 min',
      featured: false
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredResources = resources.filter(r => r.featured);

  return (
    <div className="min-h-screen bg-warmCream">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-warmCream/95 backdrop-blur-md z-50 border-b border-warmTaupe/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-goldenYellow rounded-lg flex items-center justify-center">
                <span className="text-richBlack font-bold">SC</span>
              </div>
              <span className="text-richBlack font-semibold">Training Resources</span>
            </a>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="/#field-notes" className="text-richBlack hover:text-goldenYellow transition-colors">Field Notes</a>
              <a href="/resources" className="text-goldenYellow font-medium">Resources</a>
              <a href="/#about" className="text-richBlack hover:text-goldenYellow transition-colors">About</a>
              <a href="/#contact" className="text-richBlack hover:text-goldenYellow transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-br from-charcoalGray to-richBlack">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl animate-fade-in-up">
            <h1 className="text-5xl lg:text-6xl font-bold text-warmCream mb-6 leading-tight">
              Training Resources
            </h1>
            <p className="text-xl text-warmCream/80 leading-relaxed">
              Curated tools, frameworks, and guides for developing clinical competence. Everything from assessment basics to cultural formulation to career navigation.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 px-6 bg-white border-b border-warmTaupe/20 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-warmTaupe" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-warmTaupe/30 rounded-lg focus:border-goldenYellow focus:outline-none focus:ring-2 focus:ring-goldenYellow/20 transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category.id
                      ? 'bg-goldenYellow text-richBlack'
                      : 'bg-warmCream text-charcoalGray hover:bg-warmTaupe/10'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-richBlack mb-8">Featured Resources</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {featuredResources.map((resource, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-3 bg-gradient-to-r from-goldenYellow to-deepGold"></div>
                
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-goldenYellow/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <resource.icon className="w-6 h-6 text-goldenYellow" />
                    </div>
                    <span className="text-xs bg-goldenYellow/20 text-deepGold px-3 py-1 rounded-full font-medium uppercase">
                      Featured
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-richBlack mb-3 group-hover:text-goldenYellow transition-colors">
                    {resource.title}
                  </h3>

                  <p className="text-charcoalGray leading-relaxed mb-6">
                    {resource.description}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-warmTaupe/10">
                    <span className="text-sm text-warmTaupe">
                      {resource.duration || resource.pages || resource.readTime}
                    </span>
                    
                    <button className="flex items-center space-x-2 bg-goldenYellow hover:bg-deepGold text-richBlack px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105">
                      {resource.type === 'video' ? (
                        <>
                          <Play className="w-4 h-4" />
                          <span>Watch</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* All Resources Grid */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-richBlack">All Resources</h2>
              <p className="text-warmTaupe">
                {filteredResources.length} {filteredResources.length === 1 ? 'resource' : 'resources'}
              </p>
            </div>

            {filteredResources.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-charcoalGray text-lg">No resources found. Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {filteredResources.map((resource, index) => (
                  <div 
                    key={index}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-1"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-goldenYellow/20 rounded-lg flex items-center justify-center">
                          <resource.icon className="w-5 h-5 text-goldenYellow" />
                        </div>
                        <span className="text-xs bg-warmCream text-warmTaupe px-3 py-1 rounded-full uppercase">
                          {resource.type}
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-richBlack mb-2 group-hover:text-goldenYellow transition-colors">
                        {resource.title}
                      </h4>

                      <p className="text-charcoalGray text-sm leading-relaxed mb-4 line-clamp-3">
                        {resource.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-warmTaupe/10">
                        <span className="text-xs text-warmTaupe">
                          {resource.duration || resource.pages || resource.readTime || 'External link'}
                        </span>
                        
                        <button className="text-goldenYellow hover:text-deepGold font-medium text-sm flex items-center space-x-1">
                          <span>Access</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="py-20 px-6 bg-charcoalGray">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-goldenYellow/20 text-goldenYellow px-4 py-2 rounded-full text-sm font-bold mb-6">
            NEW RESOURCES MONTHLY
          </div>
          <h3 className="text-4xl font-bold text-warmCream mb-4">Get Updates in Field Notes</h3>
          <p className="text-warmCream/80 text-lg mb-8">
            New resources, frameworks, and guides delivered monthly. Plus exclusive content for subscribers.
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