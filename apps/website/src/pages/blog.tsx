import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet-async';

const CMS_API_URL = import.meta.env.VITE_CMS_API_URL || 'https://migrapanel.com/api/cms';

// Icon Components
function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function TagIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function ChevronLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string | null;
  category: string;
  tags: string[];
  author_name: string;
  read_time_minutes: number;
  status: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

interface BlogListResponse {
  data: BlogPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const fetchBlogPosts = async (page: number, search: string, category: string): Promise<BlogListResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: '9',
    status: 'published',
  });
  
  if (search) params.append('search', search);
  if (category && category !== 'all') params.append('category', category);
  
  const response = await fetch(`${CMS_API_URL}/public/blog?${params}`);
  if (!response.ok) throw new Error('Failed to fetch blog posts');
  return response.json();
};

const fetchCategories = async (): Promise<{ data: string[] }> => {
  const response = await fetch(`${CMS_API_URL}/public/blog/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
};

export default function BlogPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('all');

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['blog-posts', page, search, category],
    queryFn: () => fetchBlogPosts(page, search, category),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setPage(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <>
      <Helmet>
        <title>Blog - MigraHosting | Hosting Tips, Tutorials & News</title>
        <meta name="description" content="Read the latest web hosting tutorials, tips, and industry news from MigraHosting experts." />
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-[#6A5CFF]/10 via-[#8A4DFF]/10 to-[#FF6584]/10" />
          <div className="relative mx-auto max-w-7xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6A5CFF]/20 to-[#8A4DFF]/20 px-6 py-2 text-sm font-semibold">
              <TagIcon className="h-5 w-5 text-[#8A4DFF]" />
              <span>Blog & Resources</span>
            </div>
            <h1 className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-5xl font-extrabold text-transparent sm:text-6xl lg:text-7xl">
              Hosting Insights & Tips
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl text-white/70">
              Expert tutorials, industry news, and best practices for web hosting success.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-12">
          {/* Search and Filter Bar */}
          <div className="mb-12 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
            <form onSubmit={handleSearch} className="flex flex-1 gap-2">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white placeholder-white/50 outline-none focus:border-[#8A4DFF] focus:ring-2 focus:ring-[#8A4DFF]/20"
                />
              </div>
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-[#6A5CFF] to-[#8A4DFF] px-6 py-3 font-semibold text-white transition hover:brightness-110"
              >
                Search
              </button>
            </form>

            <div className="flex items-center gap-2">
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#8A4DFF] focus:ring-2 focus:ring-[#8A4DFF]/20"
              >
                <option value="all">All Categories</option>
                {categoriesData?.data.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-[#8A4DFF]" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center">
              <p className="text-lg text-red-400">Failed to load blog posts. Please try again later.</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && posts?.data.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
              <TagIcon className="mx-auto mb-4 h-16 w-16 text-white/30" />
              <h3 className="mb-2 text-2xl font-bold">No posts found</h3>
              <p className="text-white/70">Try adjusting your search or filter criteria.</p>
            </div>
          )}

          {/* Blog Posts Grid */}
          {!isLoading && !error && posts && posts.data.length > 0 && (
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.data.map((post) => (
                  <article
                    key={post.id}
                    className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-[#8A4DFF]/50 hover:bg-white/10"
                  >
                    {/* Featured Image */}
                    {post.featured_image_url ? (
                      <div className="aspect-video overflow-hidden bg-slate-800">
                        <img
                          src={post.featured_image_url}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-[#6A5CFF]/20 to-[#8A4DFF]/20">
                        <TagIcon className="h-16 w-16 text-white/30" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                      {/* Category Badge */}
                      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#8A4DFF]/20 px-3 py-1 text-xs font-semibold text-[#8A4DFF]">
                        <TagIcon className="h-3 w-3" />
                        {post.category}
                      </div>

                      {/* Title */}
                      <h2 className="mb-3 text-xl font-bold transition group-hover:text-[#8A4DFF]">
                        <a href={`/blog/${post.slug}`}>{post.title}</a>
                      </h2>

                      {/* Excerpt */}
                      <p className="mb-4 line-clamp-3 text-white/70">{post.excerpt}</p>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-white/50">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{formatDate(post.published_at || post.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4" />
                          <span>{post.read_time_minutes} min read</span>
                        </div>
                      </div>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/60"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Read More Link */}
                      <a
                        href={`/blog/${post.slug}`}
                        className="mt-4 inline-flex items-center gap-2 font-semibold text-[#8A4DFF] transition hover:gap-3"
                      >
                        Read More
                        <ChevronRightIcon className="h-4 w-4" />
                      </a>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {posts.pagination.totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-4">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                    Previous
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-white/70">
                      Page {posts.pagination.page} of {posts.pagination.totalPages}
                    </span>
                  </div>

                  <button
                    onClick={() => setPage((p) => Math.min(posts.pagination.totalPages, p + 1))}
                    disabled={page === posts.pagination.totalPages}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
}
