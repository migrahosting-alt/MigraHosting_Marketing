import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import BlogList from './pages/blog/BlogList';
import BlogEditor from './pages/blog/BlogEditor';
import PagesList from './pages/pages/PagesList';
import PagesEditor from './pages/pages/PagesEditor';
import PricingList from './pages/pricing/PricingList';
import PricingEditor from './pages/pricing/PricingEditor';
import PromotionsList from './pages/promotions/PromotionsList';
import PromotionsEditor from './pages/promotions/PromotionsEditor';
import TestimonialsList from './pages/testimonials/TestimonialsList';
import FAQsList from './pages/faqs/FAQsList';
import MediaLibrary from './pages/media/MediaLibrary';
import Analytics from './pages/analytics/Analytics';
import Settings from './pages/settings/Settings';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        
        {/* Blog Routes */}
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/new" element={<BlogEditor />} />
        <Route path="/blog/edit/:id" element={<BlogEditor />} />
        
        {/* Pages Routes */}
        <Route path="/pages" element={<PagesList />} />
        <Route path="/pages/new" element={<PagesEditor />} />
        <Route path="/pages/edit/:id" element={<PagesEditor />} />
        
        {/* Pricing Routes */}
        <Route path="/pricing" element={<PricingList />} />
        <Route path="/pricing/new" element={<PricingEditor />} />
        <Route path="/pricing/edit/:id" element={<PricingEditor />} />
        
        {/* Promotions Routes */}
        <Route path="/promotions" element={<PromotionsList />} />
        <Route path="/promotions/new" element={<PromotionsEditor />} />
        <Route path="/promotions/edit/:id" element={<PromotionsEditor />} />
        
        {/* Testimonials */}
        <Route path="/testimonials" element={<TestimonialsList />} />
        
        {/* FAQs */}
        <Route path="/faqs" element={<FAQsList />} />
        
        {/* Media Library */}
        <Route path="/media" element={<MediaLibrary />} />
        
        {/* Analytics */}
        <Route path="/analytics" element={<Analytics />} />
        
        {/* Settings */}
        <Route path="/settings" element={<Settings />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
