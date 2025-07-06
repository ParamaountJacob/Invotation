import { useState } from 'react';
import { User, Calendar, DollarSign } from 'lucide-react';
import { Submission, Profile } from '../../types';
import StatusBadge from '../../components/shared/StatusBadge';

interface SubmissionReviewProps {
  submissions: (Submission & { profile: Profile })[];
  onSubmissionClick: (submission: Submission & { profile: Profile }) => void;
  onStatusUpdate: (submissionId: string, status: string) => void;
}

const SubmissionReview = ({ submissions, onSubmissionClick, onStatusUpdate }: SubmissionReviewProps) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.idea_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.short_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.profile.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || submission.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Submission Review</h2>

        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search submissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="review">In Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="development">In Development</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredSubmissions.map((submission) => (
          <div key={submission.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{submission.idea_name}</h3>
                    <p className="text-gray-600 mb-3">{submission.short_description}</p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {submission.profile.full_name || 'Anonymous'} ({submission.profile.email})
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(submission.created_at).toLocaleDateString()}
                      </div>
                      {submission.retail_price && (
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          ${submission.retail_price.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>

                  <StatusBadge status={submission.status} />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => onStatusUpdate(submission.id, 'approved')}
                className="px-4 py-2 text-green-600 hover:bg-green-50 rounded-md border border-green-200 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle size={16} />
                  <span>Approve</span>
                </div>
              </button>
              <button
                onClick={() => onStatusUpdate(submission.id, 'review')}
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md border border-blue-200 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <AlertCircle size={16} />
                  <span>Review</span>
                </div>
              </button>
              <button
                onClick={() => onStatusUpdate(submission.id, 'rejected')}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md border border-red-200 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <XCircle size={16} />
                  <span>Reject</span>
                </div>
              </button>
              <button
                onClick={() => onSubmissionClick(submission)}
                className="px-4 py-2 text-primary hover:bg-primary/5 rounded-md border border-primary transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        ))}

        {filteredSubmissions.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No submissions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionReview;