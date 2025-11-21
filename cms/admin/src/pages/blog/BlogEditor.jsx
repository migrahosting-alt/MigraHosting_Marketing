import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Eye, X, Send } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
// import RichTextEditor from '../../components/RichTextEditor';

export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category_id: '',
    status: 'draft',
    meta_title: '',
    meta_description: '',
    is_featured: false,
  });

  // Fetch post data if editing
  const { data: postData, isLoading: loadingPost } = useQuery({
    queryKey: ['blog-post', id],
    queryFn: async () => {
      const res = await axios.get(`/api/cms/admin/blog/${id}`);
      return res.data.data;
    },
    enabled: isEdit,
  });

  // Fetch categories
  const { data: categoriesData, isLoading: loadingCategories } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: async () => {
      const res = await axios.get(`/api/cms/admin/blog/meta/categories`);
      return res.data.data;
    },
  });

  // Load post data into form
  useEffect(() => {
    if (postData) {
      setFormData({
        title: postData.title || '',
        slug: postData.slug || '',
        excerpt: postData.excerpt || '',
        content: postData.content || '',
        category_id: postData.category_id || '',
        status: postData.status || 'draft',
        meta_title: postData.meta_title || '',
        meta_description: postData.meta_description || '',
        is_featured: postData.is_featured || false,
      });
    }
  }, [postData]);

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

  // Auto-generate meta_title from title
  useEffect(() => {
    if (formData.title && !formData.meta_title) {
      setFormData(prev => ({ ...prev, meta_title: formData.title.substring(0, 60) }));
    }
  }, [formData.title]);

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (isEdit) {
        const res = await axios.put(`/api/cms/admin/blog/${id}`, data);
        return res.data;
      } else {
        const res = await axios.post('/api/cms/admin/blog', data);
        return res.data;
      }
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Blog post saved successfully!');
      queryClient.invalidateQueries(['blog-posts']);
      queryClient.invalidateQueries(['blog-post', id]);
      if (!isEdit && data.data?.id) {
        navigate(`/blog/edit/${data.data.id}`);
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to save blog post');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handlePublish = () => {
    saveMutation.mutate({ ...formData, status: 'published' });
  };

  if (loadingPost || loadingCategories) {
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
          {isEdit ? 'Edit Post' : 'New Blog Post'}
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:border-gray-400"
          >
            <X className="w-5 h-5" />
            Cancel
          </button>
          <button 
            onClick={() => window.open(`http://localhost:5173/blog/${formData.slug}`, '_blank')}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:border-gray-400"
            disabled={!formData.slug}
          >
            <Eye className="w-5 h-5" />
            Preview
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
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                  placeholder="Enter post title..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                  placeholder="post-slug"
                />
                <p className="text-sm text-gray-500 mt-1">
                  URL: /blog/{formData.slug || 'post-slug'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                  placeholder="Brief description..."
                />
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
                  placeholder="Write your content (HTML supported)..."
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  HTML editor • {formData.content.split(/\s+/).filter(Boolean).length} words
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Publish</h3>
            <div className="space-y-4">
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
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="rounded border-gray-300 text-brand-purple focus:ring-brand-purple"
                />
                <label htmlFor="featured" className="text-sm text-gray-700">
                  Mark as featured
                </label>
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Category</h3>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent"
            >
              <option value="">Select category...</option>
              {categoriesData?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
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
                  maxLength="60"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent"
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
                  maxLength="160"
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent"
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
