import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Helmet } from 'react-helmet-async';

const CMS_API_URL = import.meta.env.VITE_CMS_API_URL || 'http://localhost:4243/api/cms';

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

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ShareIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
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
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
}

const fetchBlogPost = async (slug: string): Promise<{ data: BlogPost }> => {
  const response = await fetch(`${CMS_API_URL}/public/blog/${slug}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Post not found');
    }
    throw new Error('Failed to fetch blog post');
  }
  return response.json();
};

const fetchRelatedPosts = async (category: string, currentSlug: string): Promise<{ data: BlogPost[] }> => {
  const response = await fetch(`${CMS_API_URL}/public/blog?category=${category}&limit=3&status=published`);
  if (!response.ok) return { data: [] };
  const result = await response.json();
  // Filter out current post
  return { data: result.data.filter((post: BlogPost) => post.slug !== currentSlug) };
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: postData, isLoading, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => fetchBlogPost(slug!),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const post = postData?.data;

  const { data: relatedData } = useQuery({
    queryKey: ['related-posts', post?.category, slug],
    queryFn: () => fetchRelatedPosts(post!.category, slug!),
    enabled: !!post?.category && !!slug,
    staleTime: 1000 * 60 * 5,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const shareOnTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(post?.title || '');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white">
          <div className="mx-auto max-w-4xl px-4 py-20">
            <div className="flex items-center justify-center py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-[#8A4DFF]" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white">
          <div className="mx-auto max-w-4xl px-4 py-20">
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-12 text-center">
              <h1 className="mb-4 text-3xl font-bold">Post Not Found</h1>
              <p className="mb-6 text-lg text-white/70">The blog post you're looking for doesn't exist.</p>
              <button
                onClick={() => navigate('/blog')}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6A5CFF] to-[#8A4DFF] px-6 py-3 font-semibold text-white transition hover:brightness-110"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                Back to Blog
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.meta_title || post.title} - MigraHosting Blog</title>
        <meta name="description" content={post.meta_description || post.excerpt} />
        {post.canonical_url && <link rel="canonical" href={post.canonical_url} />}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        {post.featured_image_url && <meta property="og:image" content={post.featured_image_url} />}
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        {post.featured_image_url && <meta name="twitter:image" content={post.featured_image_url} />}
      </Helmet>

      <Header />

      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white">
        {/* Back Button */}
        <div className="mx-auto max-w-4xl px-4 pt-8">
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center gap-2 text-white/70 transition hover:text-white"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Blog
          </button>
        </div>

        {/* Article Header */}
        <article className="mx-auto max-w-4xl px-4 py-8">
          {/* Category Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#8A4DFF]/20 px-4 py-2 text-sm font-semibold text-[#8A4DFF]">
            <TagIcon className="h-4 w-4" />
            {post.category}
          </div>

          {/* Title */}
          <h1 className="mb-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="mb-8 flex flex-wrap items-center gap-6 text-white/70">
            <div className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              <span>{post.author_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              <span>{formatDate(post.published_at || post.created_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5" />
              <span>{post.read_time_minutes} min read</span>
            </div>
          </div>

          {/* Featured Image */}
          {post.featured_image_url && (
            <div className="mb-8 overflow-hidden rounded-2xl">
              <img
                src={post.featured_image_url}
                alt={post.title}
                className="h-auto w-full object-cover"
              />
            </div>
          )}

          {/* Social Sharing */}
          <div className="mb-8 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-white/70">
              <ShareIcon className="h-5 w-5" />
              <span className="font-semibold">Share:</span>
            </div>
            <button
              onClick={shareOnTwitter}
              className="rounded-lg bg-[#1DA1F2]/20 px-4 py-2 text-sm font-semibold text-[#1DA1F2] transition hover:bg-[#1DA1F2]/30"
            >
              Twitter
            </button>
            <button
              onClick={shareOnFacebook}
              className="rounded-lg bg-[#4267B2]/20 px-4 py-2 text-sm font-semibold text-[#4267B2] transition hover:bg-[#4267B2]/30"
            >
              Facebook
            </button>
            <button
              onClick={shareOnLinkedIn}
              className="rounded-lg bg-[#0077B5]/20 px-4 py-2 text-sm font-semibold text-[#0077B5] transition hover:bg-[#0077B5]/30"
            >
              LinkedIn
            </button>
            <button
              onClick={copyLink}
              className="rounded-lg bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/10"
            >
              Copy Link
            </button>
          </div>

          {/* Post Content */}
          <div
            className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:text-white prose-h2:mb-4 prose-h2:mt-8 prose-h2:text-3xl prose-h3:mb-3 prose-h3:mt-6 prose-h3:text-2xl prose-p:mb-4 prose-p:leading-relaxed prose-p:text-white/80 prose-a:text-[#8A4DFF] prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-code:rounded prose-code:bg-white/10 prose-code:px-1 prose-code:py-0.5 prose-code:text-[#8A4DFF] prose-pre:rounded-xl prose-pre:border prose-pre:border-white/10 prose-pre:bg-white/5 prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6 prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-li:mb-2 prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 border-t border-white/10 pt-8">
              <h3 className="mb-4 text-lg font-semibold text-white/70">Tags</h3>
              <div className="flex flex-wrap gap-3">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Related Posts */}
        {relatedData?.data && relatedData.data.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 py-12">
            <h2 className="mb-8 text-3xl font-bold">Related Articles</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {relatedData.data.map((relatedPost) => (
                <article
                  key={relatedPost.id}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-[#8A4DFF]/50 hover:bg-white/10"
                >
                  {relatedPost.featured_image_url ? (
                    <div className="aspect-video overflow-hidden bg-slate-800">
                      <img
                        src={relatedPost.featured_image_url}
                        alt={relatedPost.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-[#6A5CFF]/20 to-[#8A4DFF]/20">
                      <TagIcon className="h-16 w-16 text-white/30" />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#8A4DFF]/20 px-3 py-1 text-xs font-semibold text-[#8A4DFF]">
                      <TagIcon className="h-3 w-3" />
                      {relatedPost.category}
                    </div>

                    <h3 className="mb-3 text-xl font-bold transition group-hover:text-[#8A4DFF]">
                      <a href={`/blog/${relatedPost.slug}`}>{relatedPost.title}</a>
                    </h3>

                    <p className="mb-4 line-clamp-2 text-white/70">{relatedPost.excerpt}</p>

                    <div className="flex items-center gap-4 text-sm text-white/50">
                      <div className="flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" />
                        <span>{relatedPost.read_time_minutes} min</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
