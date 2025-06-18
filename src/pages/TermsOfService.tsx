import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container-custom py-12">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-gray-600 hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-gray-600 mb-8">
              Last updated: March 15, 2024
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing or using Invotation's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">2. Intellectual Property Rights</h2>
              <p className="mb-4">By submitting an idea or invention:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>You retain ownership of your intellectual property</li>
                <li>You grant us a license to evaluate and develop your submission</li>
                <li>You agree to enter into a separate development agreement if selected</li>
                <li>You warrant that your submission is original and does not infringe on others' rights</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">3. Submission Guidelines</h2>
              <p className="mb-4">All submissions must:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Be original and not infringe on existing patents or rights</li>
                <li>Include accurate and complete information</li>
                <li>Not contain confidential information of third parties</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">4. Selection Process</h2>
              <p className="mb-4">
                We reserve the right to:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Select or reject any submission at our discretion</li>
                <li>Modify the selection criteria</li>
                <li>Discontinue the program at any time</li>
                <li>Request additional information or clarification</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">5. Profit Sharing</h2>
              <p className="mb-4">
                If your submission is selected:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Profit sharing terms will be detailed in a separate agreement</li>
                <li>Payments are subject to successful product launch and sales</li>
                <li>Terms may vary based on market conditions and development costs</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
              <p className="mb-4">
                Invotation is not liable for:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Market success of developed products</li>
                <li>Third-party infringement claims</li>
                <li>Lost profits or consequential damages</li>
                <li>Delays in development or launch</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Contact Information</h2>
              <p className="mb-4">
                For questions about these terms, please contact us at:
              </p>
              <p className="mb-2">Email: legal@invotation.com</p>
              <p>Phone: (346) 266-1456</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;