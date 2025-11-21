import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Posts" },
    { id: "tutorials", name: "Tutorials" },
    { id: "news", name: "Product News" },
    { id: "guides", name: "Guides" },
    { id: "security", name: "Security" },
  ];

  const posts = [
    {
      id: 1,
      title: "How to Choose a Web Host: A Transparent Guide",
      excerpt: "Learn what really matters when choosing a web host. No sales pitch, just honest advice about uptime, support, and pricing.",
      category: "guides",
      date: "November 15, 2025",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
      author: "MigraHosting Team"
    },
    {
      id: 2,
      title: "Why We Don't Do Fake Promo Pricing",
      excerpt: "The truth about web hosting pricing tricks and why transparency matters more than fake discounts.",
      category: "news",
      date: "November 10, 2025",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
      author: "Bonex Petit-Frere"
    },
    {
      id: 3,
      title: "MigraGuard: Blocking 10M Spam Emails Daily",
      excerpt: "Behind the scenes of our security suite and how we protect your hosting and email infrastructure.",
      category: "security",
      date: "November 5, 2025",
      readTime: "10 min read",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800",
      author: "Security Team"
    },
    {
      id: 4,
      title: "Managed WordPress vs Shared Hosting: Which Do You Need?",
      excerpt: "A detailed comparison of our WordPress-optimized plans versus traditional shared hosting.",
      category: "guides",
      date: "November 1, 2025",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800",
      author: "MigraHosting Team"
    },
    {
      id: 5,
      title: "10 Tips for Faster WordPress Sites",
      excerpt: "Practical optimization tips to improve your WordPress site performance and page load times.",
      category: "tutorials",
      date: "October 28, 2025",
      readTime: "12 min read",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
      author: "Performance Team"
    },
    {
      id: 6,
      title: "Building an All-in-One Hosting Ecosystem",
      excerpt: "How we integrated hosting, email, storage, and control panel into a seamless experience.",
      category: "news",
      date: "October 25, 2025",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
      author: "Bonex Petit-Frere"
    }
  ];

  const filteredPosts = selectedCategory === "all" 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white">
      <Helmet>
        <title>Blog - Hosting Tips, Guides & Updates | MigraHosting</title>
        <meta name="description" content="Learn about web hosting, WordPress optimization, security, and get the latest updates from the MigraHosting team." />
      </Helmet>

      <section className="relative overflow-hidden px-4 py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6A5CFF]/10 via-[#8A4DFF]/10 to-[#FF6584]/10" />
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#8A4DFF]/30 bg-[#8A4DFF]/10 px-6 py-2 text-sm font-semibold text-[#8A4DFF] mb-6">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
            </svg>
            Latest Articles
          </div>
          
          <h1 className="text-5xl font-extrabold">MigraHosting Blog</h1>
          <p className="mt-4 text-xl text-white/70">Tips, guides, and updates from our team</p>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition ${
                  selectedCategory === cat.id
                    ? "bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] text-white"
                    : "border border-white/20 bg-white/5 text-white/80 hover:bg-white/10"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map(post => (
              <article
                key={post.id}
                className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden hover:border-[#8A4DFF]/50 transition"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover transition group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 rounded-lg bg-[#8A4DFF]/20 text-[#8A4DFF] text-xs font-semibold uppercase">
                      {post.category}
                    </span>
                    <span className="text-xs text-white/50">{post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-bold mb-2 group-hover:text-[#8A4DFF] transition">
                    {post.title}
                  </h2>
                  <p className="text-white/70 text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-white/50">
                    <span>{post.date}</span>
                    <span>By {post.author}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold">Subscribe to Our Newsletter</h2>
          <p className="mt-4 text-white/70">Get the latest hosting tips and updates delivered to your inbox</p>
          <form className="mt-8 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 h-14 px-6 rounded-xl border border-white/20 bg-white/5 backdrop-blur-xl text-white placeholder:text-white/50 focus:outline-none focus:border-[#8A4DFF] focus:ring-2 focus:ring-[#8A4DFF]/50 transition"
            />
            <button
              type="submit"
              className="h-14 px-8 rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] font-bold shadow-lg transition-all hover:scale-105"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-4 text-sm text-white/50">
            No spam, unsubscribe anytime
          </p>
        </div>
      </section>
    </div>
  );
}
