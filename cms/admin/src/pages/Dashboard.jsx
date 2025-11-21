import { useQuery } from '@tanstack/react-query';
import { FileText, DollarSign, Star, Image, TrendingUp } from 'lucide-react';
import axios from 'axios';

export default function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await axios.get('/api/cms/admin/analytics/dashboard');
      return res.data.data;
    },
  });

  const cards = [
    {
      title: 'Blog Posts',
      value: stats?.blog?.published_count || 0,
      subtitle: `${stats?.blog?.draft_count || 0} drafts`,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Pages',
      value: stats?.pages?.published_count || 0,
      subtitle: `${stats?.pages?.draft_count || 0} drafts`,
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Media Files',
      value: stats?.media?.total_files || 0,
      subtitle: `${((stats?.media?.total_size || 0) / 1024 / 1024).toFixed(1)} MB`,
      icon: Image,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Testimonials',
      value: stats?.testimonials?.approved_count || 0,
      subtitle: `${stats?.testimonials?.pending_count || 0} pending`,
      icon: Star,
      color: 'from-yellow-500 to-yellow-600',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}
              >
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {card.value}
            </h3>
            <p className="text-sm text-gray-600">{card.title}</p>
            <p className="text-xs text-gray-400 mt-1">{card.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/blog/new"
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-brand-purple hover:shadow-md transition-all"
          >
            <FileText className="w-8 h-8 text-brand-purple" />
            <div>
              <h3 className="font-semibold text-gray-900">New Blog Post</h3>
              <p className="text-sm text-gray-600">Write a new article</p>
            </div>
          </a>

          <a
            href="/pages/new"
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-brand-purple hover:shadow-md transition-all"
          >
            <FileText className="w-8 h-8 text-brand-purple" />
            <div>
              <h3 className="font-semibold text-gray-900">New Page</h3>
              <p className="text-sm text-gray-600">Create a landing page</p>
            </div>
          </a>

          <a
            href="/media"
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-brand-purple hover:shadow-md transition-all"
          >
            <Image className="w-8 h-8 text-brand-purple" />
            <div>
              <h3 className="font-semibold text-gray-900">Upload Media</h3>
              <p className="text-sm text-gray-600">Add images/files</p>
            </div>
          </a>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <p className="text-gray-600">Activity feed coming soon...</p>
      </div>
    </div>
  );
}
