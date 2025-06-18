import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Plus, Trash2, Save, X, HelpCircle } from 'lucide-react';

interface FAQ {
  id?: string;
  campaign_id: number;
  question: string;
  answer: string;
}

interface FAQManagerProps {
  campaignId: number;
}

const FAQManager: React.FC<FAQManagerProps> = ({ campaignId }) => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newFaq, setNewFaq] = useState<FAQ>({
    campaign_id: campaignId,
    question: '',
    answer: ''
  });
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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
    } catch (err: any) {
      console.error('Error fetching FAQs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setNewFaq({
      campaign_id: campaignId,
      question: '',
      answer: ''
    });
  };

  const handleCancelAdd = () => {
    setIsAddingNew(false);
    setNewFaq({
      campaign_id: campaignId,
      question: '',
      answer: ''
    });
  };

  const handleSaveNew = async () => {
    try {
      if (!newFaq.question.trim() || !newFaq.answer.trim()) {
        setError('Question and answer are required');
        return;
      }

      setError(null);
      const { data, error } = await supabase
        .from('campaign_faqs')
        .insert([newFaq])
        .select();

      if (error) throw error;
      
      setFaqs([...faqs, data[0]]);
      setIsAddingNew(false);
      setNewFaq({
        campaign_id: campaignId,
        question: '',
        answer: ''
      });
      setSuccess('FAQ added successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error adding FAQ:', err);
      setError(err.message);
    }
  };

  const handleEdit = (faq: FAQ) => {
    setEditingId(faq.id || null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleUpdateFaq = async (faq: FAQ) => {
    try {
      if (!faq.question.trim() || !faq.answer.trim()) {
        setError('Question and answer are required');
        return;
      }

      setError(null);
      const { error } = await supabase
        .from('campaign_faqs')
        .update({
          question: faq.question,
          answer: faq.answer
        })
        .eq('id', faq.id);

      if (error) throw error;
      
      setFaqs(faqs.map(f => f.id === faq.id ? faq : f));
      setEditingId(null);
      setSuccess('FAQ updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error updating FAQ:', err);
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    
    try {
      setError(null);
      const { error } = await supabase
        .from('campaign_faqs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setFaqs(faqs.filter(faq => faq.id !== id));
      setSuccess('FAQ deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error deleting FAQ:', err);
      setError(err.message);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: 'question' | 'answer', faqId?: string) => {
    if (faqId) {
      // Editing existing FAQ
      setFaqs(faqs.map(faq => 
        faq.id === faqId ? { ...faq, [field]: e.target.value } : faq
      ));
    } else {
      // Adding new FAQ
      setNewFaq({ ...newFaq, [field]: e.target.value });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-gray-500">Loading FAQs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">Frequently Asked Questions</h3>
        <button
          onClick={handleAddNew}
          className="bg-primary text-white px-3 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add FAQ</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {success}
        </div>
      )}

      {/* Add New FAQ Form */}
      {isAddingNew && (
        <div className="border border-primary/20 rounded-lg p-4 bg-primary/5">
          <h4 className="font-bold text-gray-900 mb-3">Add New FAQ</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question
              </label>
              <input
                type="text"
                value={newFaq.question}
                onChange={(e) => handleInputChange(e, 'question')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter question"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Answer
              </label>
              <textarea
                value={newFaq.answer}
                onChange={(e) => handleInputChange(e, 'answer')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter answer"
                rows={4}
              ></textarea>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancelAdd}
                className="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNew}
                className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center space-x-1"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Existing FAQs */}
      {faqs.length === 0 && !isAddingNew ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No FAQs added yet</p>
          <p className="text-sm text-gray-400 mt-1">Click "Add FAQ" to create your first FAQ</p>
        </div>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div 
              key={faq.id} 
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              {editingId === faq.id ? (
                <div className="p-4 bg-blue-50">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Question
                      </label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => handleInputChange(e, 'question', faq.id)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Answer
                      </label>
                      <textarea
                        value={faq.answer}
                        onChange={(e) => handleInputChange(e, 'answer', faq.id)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        rows={4}
                      ></textarea>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdateFaq(faq)}
                        className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center space-x-1"
                      >
                        <Save className="w-4 h-4" />
                        <span>Update</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="p-4 bg-gray-50 flex justify-between items-center">
                    <h4 className="font-medium text-gray-900">{faq.question}</h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(faq)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(faq.id!)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FAQManager;