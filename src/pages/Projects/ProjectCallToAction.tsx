import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import SubmissionTipsModal from '../../components/SubmissionTipsModal';

const ProjectCallToAction = () => {
  const navigate = useNavigate();
  const [showTipsModal, setShowTipsModal] = useState(false);

  return (
    <>
      <div className="mt-20 bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-8 border border-primary/20">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Ready to Vote or Submit?</h2>
          <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
            Buy coins to vote on ideas and secure exclusive discounts, or submit your own idea and potentially earn thousands.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/buy-coins')}
              className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-dark transition-colors shadow-lg flex items-center justify-center"
            >
              Buy Coins & Vote
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/submit')}
              className="bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors border-2 border-primary"
            >
              Submit Your Idea
            </button>
          </div>
        </div>
      </div>
      
      {/* Submission Tips Modal */}
      <SubmissionTipsModal 
        isOpen={showTipsModal}
        onClose={() => setShowTipsModal(false)}
      />
    </>
  );
};

export default ProjectCallToAction;