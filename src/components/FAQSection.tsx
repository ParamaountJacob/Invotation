import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface FAQSectionProps {
  campaignId: number;
}

const FAQSection: React.FC<FAQSectionProps> = ({ campaignId }) => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  useEffect(() => {
    fetchFaqs();
  }, [campaignId]);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('campaign_faqs')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setFaqs(data || []);
      
      // Open the first FAQ by default if there are any
      if (data && data.length > 0) {
        setOpenFaqId(data[0].id);
      }
    } catch (err: any) {
      console.error('Error fetching FAQs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-gray-500">Loading FAQs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>Error loading FAQs: {error}</p>
      </div>
    );
  }

  if (faqs.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">No FAQs available for this campaign</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
      
      {faqs.map((faq) => (
        <div 
          key={faq.id} 
          className="border border-gray-200 rounded-lg overflow-hidden"
        >
          <button
            onClick={() => toggleFaq(faq.id)}
            className="w-full flex justify-between items-center p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <span className="font-medium text-gray-900">{faq.question}</span>
            {openFaqId === faq.id ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          
          {openFaqId === faq.id && (
            <div className="p-4 bg-white">
              <p className="text-gray-700">{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQSection;