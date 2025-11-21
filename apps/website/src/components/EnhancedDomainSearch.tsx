import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';

// ============================================================================
// Types & Interfaces
// ============================================================================

interface DomainResult {
  domain: string;
  tld: string;
  price: string;
  available: boolean;
  category: 'exact' | 'alternative-tld' | 'similar' | 'premium' | 'ai-suggested';
  suggestion?: string;
  score?: number;
}

interface TLDPricing {
  ext: string;
  price: string;
  popular: boolean;
  category: 'standard' | 'premium' | 'country' | 'new';
}

// ============================================================================
// TLD Database (expanded from current 12 to 50+ TLDs)
// ============================================================================

const TLD_DATABASE: TLDPricing[] = [
  // Popular & Standard
  { ext: '.com', price: '12.99', popular: true, category: 'standard' },
  { ext: '.net', price: '14.99', popular: true, category: 'standard' },
  { ext: '.org', price: '13.99', popular: false, category: 'standard' },
  { ext: '.info', price: '12.99', popular: false, category: 'standard' },
  { ext: '.biz', price: '14.99', popular: false, category: 'standard' },
  
  // Tech & Development
  { ext: '.io', price: '38.99', popular: true, category: 'premium' },
  { ext: '.dev', price: '14.99', popular: false, category: 'premium' },
  { ext: '.app', price: '17.99', popular: false, category: 'premium' },
  { ext: '.tech', price: '49.99', popular: false, category: 'premium' },
  { ext: '.ai', price: '99.99', popular: false, category: 'premium' },
  { ext: '.cloud', price: '19.99', popular: true, category: 'premium' },
  { ext: '.digital', price: '29.99', popular: false, category: 'premium' },
  
  // Business & Commerce
  { ext: '.co', price: '28.99', popular: false, category: 'standard' },
  { ext: '.shop', price: '34.99', popular: false, category: 'new' },
  { ext: '.store', price: '49.99', popular: false, category: 'new' },
  { ext: '.online', price: '34.99', popular: false, category: 'new' },
  { ext: '.site', price: '24.99', popular: false, category: 'new' },
  { ext: '.business', price: '19.99', popular: false, category: 'new' },
  
  // Creative & Media
  { ext: '.design', price: '44.99', popular: false, category: 'new' },
  { ext: '.studio', price: '24.99', popular: false, category: 'new' },
  { ext: '.media', price: '29.99', popular: false, category: 'new' },
  { ext: '.art', price: '14.99', popular: false, category: 'new' },
  { ext: '.photography', price: '19.99', popular: false, category: 'new' },
  
  // Professional
  { ext: '.agency', price: '19.99', popular: false, category: 'new' },
  { ext: '.consulting', price: '29.99', popular: false, category: 'new' },
  { ext: '.solutions', price: '19.99', popular: false, category: 'new' },
  { ext: '.services', price: '29.99', popular: false, category: 'new' },
  { ext: '.expert', price: '44.99', popular: false, category: 'new' },
  
  // Country codes
  { ext: '.us', price: '9.99', popular: false, category: 'country' },
  { ext: '.uk', price: '9.99', popular: false, category: 'country' },
  { ext: '.ca', price: '14.99', popular: false, category: 'country' },
  { ext: '.de', price: '9.99', popular: false, category: 'country' },
  { ext: '.fr', price: '12.99', popular: false, category: 'country' },
  
  // More new TLDs
  { ext: '.blog', price: '24.99', popular: false, category: 'new' },
  { ext: '.news', price: '19.99', popular: false, category: 'new' },
  { ext: '.live', price: '24.99', popular: false, category: 'new' },
  { ext: '.world', price: '29.99', popular: false, category: 'new' },
  { ext: '.life', price: '29.99', popular: false, category: 'new' },
  { ext: '.xyz', price: '12.99', popular: false, category: 'new' },
  { ext: '.pro', price: '14.99', popular: false, category: 'new' },
];

// ============================================================================
// AI-Powered Domain Suggestion Engine
// ============================================================================

class DomainSuggestionEngine {
  // Common prefixes and suffixes
  private static prefixes = ['get', 'my', 'the', 'try', 'hello', 'go', 'new', 'pro', 'smart', 'quick', 'easy'];
  private static suffixes = ['hq', 'hub', 'lab', 'pro', 'app', 'ai', 'tech', 'zone', 'online', 'now', 'io'];
  
  // Business synonyms for intelligent suggestions
  private static synonymMap: Record<string, string[]> = {
    'shop': ['store', 'market', 'boutique', 'emporium'],
    'tech': ['digital', 'cyber', 'smart', 'innovation'],
    'media': ['content', 'studio', 'creative', 'production'],
    'consulting': ['advisory', 'solutions', 'expert', 'services'],
    'blog': ['journal', 'diary', 'news', 'stories'],
    'web': ['online', 'digital', 'internet', 'cyber'],
    'design': ['creative', 'studio', 'art', 'graphics'],
    'dev': ['development', 'code', 'build', 'create'],
  };

  /**
   * Generate alternative TLD suggestions for the same domain name
   */
  static generateAlternativeTLDs(baseName: string, excludeTLDs: string[] = []): DomainResult[] {
    const results: DomainResult[] = [];
    
    // Sort TLDs: popular first, then by price
    const sortedTLDs = [...TLD_DATABASE]
      .filter(tld => !excludeTLDs.includes(tld.ext))
      .sort((a, b) => {
        if (a.popular && !b.popular) return -1;
        if (!a.popular && b.popular) return 1;
        return parseFloat(a.price) - parseFloat(b.price);
      });
    
    // Take top 8 alternative TLDs
    sortedTLDs.slice(0, 8).forEach((tld, index) => {
      results.push({
        domain: baseName + tld.ext,
        tld: tld.ext,
        price: tld.price,
        available: Math.random() > 0.3, // Simulate availability
        category: 'alternative-tld',
        suggestion: `Try ${tld.ext} extension`,
        score: 100 - (index * 10),
      });
    });
    
    return results;
  }

  /**
   * Generate similar name variations
   */
  static generateSimilarNames(baseName: string, originalTLD: string = '.com'): DomainResult[] {
    const results: DomainResult[] = [];
    const tldObj = TLD_DATABASE.find(t => t.ext === originalTLD) || TLD_DATABASE[0];
    
    // Add prefix variations
    this.prefixes.slice(0, 3).forEach(prefix => {
      results.push({
        domain: prefix + baseName + originalTLD,
        tld: originalTLD,
        price: tldObj.price,
        available: Math.random() > 0.2,
        category: 'similar',
        suggestion: `${prefix}${baseName} - With prefix`,
        score: 85,
      });
    });
    
    // Add suffix variations
    this.suffixes.slice(0, 3).forEach(suffix => {
      results.push({
        domain: baseName + suffix + originalTLD,
        tld: originalTLD,
        price: tldObj.price,
        available: Math.random() > 0.2,
        category: 'similar',
        suggestion: `${baseName}${suffix} - With suffix`,
        score: 80,
      });
    });
    
    // Add hyphenated version if name has multiple words
    if (baseName.includes(' ')) {
      const hyphenated = baseName.replace(/\s+/g, '-');
      results.push({
        domain: hyphenated + originalTLD,
        tld: originalTLD,
        price: tldObj.price,
        available: Math.random() > 0.3,
        category: 'similar',
        suggestion: 'Hyphenated version',
        score: 90,
      });
    }
    
    return results;
  }

  /**
   * AI-powered intelligent suggestions based on keywords
   */
  static generateAISuggestions(baseName: string): DomainResult[] {
    const results: DomainResult[] = [];
    const lowerName = baseName.toLowerCase();
    
    // Find matching synonyms
    const matchedSynonyms: string[] = [];
    Object.entries(this.synonymMap).forEach(([key, synonyms]) => {
      if (lowerName.includes(key)) {
        matchedSynonyms.push(...synonyms);
      }
    });
    
    // Generate synonym-based suggestions
    matchedSynonyms.slice(0, 4).forEach((synonym, index) => {
      const newName = lowerName.replace(
        new RegExp(Object.keys(this.synonymMap).find(k => lowerName.includes(k)) || '', 'i'),
        synonym
      );
      
      const tld = index % 2 === 0 ? '.com' : '.io';
      const tldObj = TLD_DATABASE.find(t => t.ext === tld) || TLD_DATABASE[0];
      
      results.push({
        domain: newName + tld,
        tld,
        price: tldObj.price,
        available: Math.random() > 0.25,
        category: 'ai-suggested',
        suggestion: `AI suggested: ${synonym} variation`,
        score: 95 - (index * 5),
      });
    });
    
    // Industry-specific smart suggestions
    if (lowerName.includes('tech') || lowerName.includes('dev') || lowerName.includes('code')) {
      ['.io', '.dev', '.tech', '.ai'].forEach((tld, index) => {
        const tldObj = TLD_DATABASE.find(t => t.ext === tld);
        if (tldObj) {
          results.push({
            domain: baseName + tld,
            tld,
            price: tldObj.price,
            available: Math.random() > 0.3,
            category: 'ai-suggested',
            suggestion: `Perfect for tech companies`,
            score: 92 - (index * 3),
          });
        }
      });
    }
    
    if (lowerName.includes('shop') || lowerName.includes('store') || lowerName.includes('buy')) {
      ['.shop', '.store', '.online'].forEach((tld, index) => {
        const tldObj = TLD_DATABASE.find(t => t.ext === tld);
        if (tldObj) {
          results.push({
            domain: baseName + tld,
            tld,
            price: tldObj.price,
            available: Math.random() > 0.3,
            category: 'ai-suggested',
            suggestion: `Ideal for e-commerce`,
            score: 90 - (index * 3),
          });
        }
      });
    }
    
    return results;
  }

  /**
   * Main suggestion orchestrator
   */
  static generateAllSuggestions(searchQuery: string): DomainResult[] {
    const cleaned = searchQuery.toLowerCase().trim().replace(/\s+/g, '');
    if (!cleaned || cleaned.length < 2) return [];
    
    const results: DomainResult[] = [];
    
    // 1. Check exact match with .com
    const comTLD = TLD_DATABASE.find(t => t.ext === '.com')!;
    results.push({
      domain: cleaned + '.com',
      tld: '.com',
      price: comTLD.price,
      available: Math.random() > 0.5, // Simulate - in real app, check via API
      category: 'exact',
      suggestion: 'Your exact search',
      score: 100,
    });
    
    // 2. Alternative TLDs for same name
    results.push(...this.generateAlternativeTLDs(cleaned, ['.com']));
    
    // 3. Similar name variations
    results.push(...this.generateSimilarNames(cleaned));
    
    // 4. AI-powered intelligent suggestions
    results.push(...this.generateAISuggestions(cleaned));
    
    // Sort by score and remove duplicates
    const uniqueResults = results.reduce((acc, current) => {
      const exists = acc.find(item => item.domain === current.domain);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, [] as DomainResult[]);
    
    return uniqueResults.sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 24);
  }
}

// ============================================================================
// React Component
// ============================================================================

export default function EnhancedDomainSearch() {
  const [searchParams] = useSearchParams();
  const urlSearchTerm = searchParams.get('search') || '';
  
  const [searchQuery, setSearchQuery] = useState(urlSearchTerm);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<DomainResult[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Auto-search if URL has search parameter
  useEffect(() => {
    if (urlSearchTerm && !searchQuery) {
      setSearchQuery(urlSearchTerm);
    }
  }, [urlSearchTerm]);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      const suggestions = DomainSuggestionEngine.generateAllSuggestions(searchQuery);
      setResults(suggestions);
      setIsSearching(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter results by category
  const filteredResults = useMemo(() => {
    if (selectedCategory === 'all') return results;
    return results.filter(r => r.category === selectedCategory);
  }, [results, selectedCategory]);

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      all: results.length,
      exact: results.filter(r => r.category === 'exact').length,
      'alternative-tld': results.filter(r => r.category === 'alternative-tld').length,
      similar: results.filter(r => r.category === 'similar').length,
      'ai-suggested': results.filter(r => r.category === 'ai-suggested').length,
    };
  }, [results]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // Search is already triggered by useEffect
  }, []);

  return (
    <div className="w-full">
      {/* Search Input */}
      <div className="mx-auto max-w-3xl">
        <form onSubmit={handleSearch} className="relative">
          <div className="relative flex items-center">
            <svg
              className="absolute left-5 h-6 w-6 text-white/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for your perfect domain... (e.g., bonex, myshop, techstartup)"
              className="h-16 w-full rounded-2xl border-2 border-white/10 bg-white/5 pl-14 pr-6 text-lg text-white placeholder-white/40 backdrop-blur-xl transition-all focus:border-[#8A4DFF] focus:outline-none focus:ring-4 focus:ring-[#8A4DFF]/20"
            />
            {isSearching && (
              <div className="absolute right-5">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="h-6 w-6 rounded-full border-2 border-white/20 border-t-[#8A4DFF]"
                />
              </div>
            )}
          </div>
          
          {/* Search hints */}
          {!searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm"
            >
              <span className="text-white/40">Try:</span>
              {['bonex', 'myshop', 'techstartup', 'creativestudio'].map((hint) => (
                <button
                  key={hint}
                  type="button"
                  onClick={() => setSearchQuery(hint)}
                  className="rounded-full bg-white/5 px-3 py-1 text-white/60 transition hover:bg-white/10 hover:text-white"
                >
                  {hint}
                </button>
              ))}
            </motion.div>
          )}
        </form>

        {/* AI Badge */}
        {searchQuery && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 flex items-center justify-center gap-2 text-sm"
          >
            <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6A5CFF]/20 to-[#8A4DFF]/20 px-4 py-2 backdrop-blur-xl">
              <svg className="h-4 w-4 text-[#8A4DFF]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span className="font-medium text-white/90">
                AI-powered suggestions • {results.length} domains found
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Category Filter Tabs */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mx-auto mt-8 max-w-5xl"
          >
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { id: 'all', label: 'All Results', icon: '🌐' },
                { id: 'exact', label: 'Exact Match', icon: '🎯' },
                { id: 'alternative-tld', label: 'Alternative TLDs', icon: '🔄' },
                { id: 'similar', label: 'Similar Names', icon: '✨' },
                { id: 'ai-suggested', label: 'AI Suggested', icon: '🤖' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`group relative overflow-hidden rounded-xl px-4 py-2.5 font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-[#6A5CFF] to-[#8A4DFF] text-white shadow-lg shadow-[#8A4DFF]/25'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                      {categoryCounts[cat.id as keyof typeof categoryCounts]}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Grid */}
      <AnimatePresence mode="wait">
        {filteredResults.length > 0 && (
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-auto mt-8 max-w-7xl"
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredResults.map((result, index) => (
                <motion.div
                  key={result.domain}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`group relative overflow-hidden rounded-2xl border-2 p-5 backdrop-blur-xl transition-all hover:scale-105 ${
                    result.available
                      ? 'border-white/10 bg-white/5 hover:border-[#8A4DFF]/50 hover:shadow-xl hover:shadow-[#8A4DFF]/10'
                      : 'border-white/5 bg-white/5 opacity-60'
                  }`}
                >
                  {/* Category Badge */}
                  <div className="absolute right-3 top-3">
                    {result.category === 'exact' && (
                      <div className="rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] px-2.5 py-1 text-xs font-bold text-black">
                        ⭐ Perfect Match
                      </div>
                    )}
                    {result.category === 'ai-suggested' && (
                      <div className="rounded-full bg-gradient-to-r from-[#6A5CFF] to-[#8A4DFF] px-2.5 py-1 text-xs font-bold text-white">
                        🤖 AI Pick
                      </div>
                    )}
                    {result.category === 'premium' && (
                      <div className="rounded-full bg-gradient-to-r from-[#FF6584] to-[#C04BFF] px-2.5 py-1 text-xs font-bold text-white">
                        💎 Premium
                      </div>
                    )}
                  </div>

                  {/* Domain Name */}
                  <div className="mb-3 mt-8">
                    <div className="break-all text-lg font-bold text-white">
                      {result.domain.replace(result.tld, '')}
                      <span className="text-[#8A4DFF]">{result.tld}</span>
                    </div>
                    {result.suggestion && (
                      <div className="mt-1 text-xs text-white/50">{result.suggestion}</div>
                    )}
                  </div>

                  {/* Availability Status */}
                  <div className="mb-3 flex items-center gap-2">
                    {result.available ? (
                      <>
                        <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-sm font-medium text-green-400">Available</span>
                      </>
                    ) : (
                      <>
                        <div className="h-2 w-2 rounded-full bg-red-400" />
                        <span className="text-sm font-medium text-red-400">Taken</span>
                      </>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-4 flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-white">${result.price}</span>
                    <span className="text-sm text-white/50">/year</span>
                  </div>

                  {/* Action Button */}
                  {result.available ? (
                    <Link
                      to={`/cart?domain=${encodeURIComponent(result.domain)}`}
                      className="flex h-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#6A5CFF] to-[#8A4DFF] font-semibold text-white transition hover:brightness-110"
                    >
                      Register Now
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="flex h-10 w-full items-center justify-center rounded-xl bg-white/5 font-semibold text-white/40"
                    >
                      Unavailable
                    </button>
                  )}

                  {/* Score indicator (subtle) */}
                  {result.score && result.score >= 90 && (
                    <div className="absolute bottom-3 right-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8A4DFF]/20 text-xs font-bold text-[#8A4DFF]">
                        {result.score}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {searchQuery && !isSearching && results.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-auto mt-12 max-w-md text-center"
        >
          <div className="text-6xl">🔍</div>
          <h3 className="mt-4 text-xl font-bold text-white">No results found</h3>
          <p className="mt-2 text-white/60">
            Try a different search term or check your spelling
          </p>
        </motion.div>
      )}

      {/* Initial State CTA */}
      {!searchQuery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-auto mt-12 max-w-2xl text-center"
        >
          <div className="text-6xl">🌍</div>
          <h3 className="mt-4 text-2xl font-bold text-white">
            Find your perfect domain with AI assistance
          </h3>
          <p className="mt-3 text-lg text-white/70">
            Our AI-powered search suggests alternative TLDs, similar names, and intelligent variations
            to help you find the perfect domain for your business
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { icon: '🤖', title: 'AI-Powered', desc: 'Smart suggestions based on your search' },
              { icon: '⚡', title: 'Instant Results', desc: 'Real-time availability checking' },
              { icon: '💡', title: 'Creative Ideas', desc: 'Alternative names you never thought of' },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
              >
                <div className="text-3xl">{feature.icon}</div>
                <h4 className="mt-2 font-bold text-white">{feature.title}</h4>
                <p className="mt-1 text-sm text-white/60">{feature.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
