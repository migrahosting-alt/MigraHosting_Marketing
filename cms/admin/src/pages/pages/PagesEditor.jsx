import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Eye, X, Send } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function PagesEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    template: 'default',
    status: 'draft',
    meta_title: '',
    meta_description: '',
    canonical_url: '',
  });

  // Fetch page data if editing
  const { data: pageData, isLoading } = useQuery({
    queryKey: ['page', id],
    queryFn: async () => {
      const res = await axios.get(`/api/cms/admin/pages/${id}`);
      return res.data.data;
    },
    enabled: isEdit,
  });

  // Load page data into form
  useEffect(() => {
    if (pageData) {
      setFormData({
        title: pageData.title || '',
        slug: pageData.slug || '',
        content: pageData.content || '',
        template: pageData.template || 'default',
        status: pageData.status || 'draft',
        meta_title: pageData.meta_title || '',
        meta_description: pageData.meta_description || '',
        canonical_url: pageData.canonical_url || '',
      });
    }
  }, [pageData]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEdit && formData.title && !formData.slug) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, isEdit]);

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (isEdit) {
        const res = await axios.put(`/api/cms/admin/pages/${id}`, data);
        return res.data;
      } else {
        const res = await axios.post('/api/cms/admin/pages', data);
        return res.data;
      }
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Page saved successfully!');
      queryClient.invalidateQueries(['pages']);
      if (!isEdit && data.data?.id) {
        navigate(`/pages/edit/${data.data.id}`);
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to save page');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handlePublish = () => {
    saveMutation.mutate({ ...formData, status: 'published' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? 'Edit Page' : 'New Page'}
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/pages')}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:border-gray-400"
          >
            <X className="w-5 h-5" />
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saveMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saveMutation.isPending ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={handlePublish}
            disabled={saveMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-purple to-brand-pink text-white rounded-xl hover:brightness-110 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
            {saveMutation.isPending ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                  placeholder="e.g., About Us, Contact, Privacy Policy"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent font-mono text-sm"
                  placeholder="about-us"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  URL: http://localhost:5173/{formData.slug}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows="20"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent font-mono text-sm"
                  placeholder="Page content (HTML supported)..."
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  {formData.content.split(/\s+/).filter(Boolean).length} words
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Settings */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template
                </label>
                <select
                  value={formData.template}
                  onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                >
                  <option value="default">Default</option>
                  <option value="full-width">Full Width</option>
                  <option value="no-sidebar">No Sidebar</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">SEO</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={formData.meta_title}
                  onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                  placeholder="Page title for search engines"
                  maxLength={60}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.meta_title.length}/60 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                  placeholder="Brief description for search results"
                  maxLength={160}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.meta_description.length}/160 characters
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
