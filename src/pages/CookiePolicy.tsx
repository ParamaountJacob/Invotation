import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CookiePolicy = () => {
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
          <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-gray-600 mb-8">
              Last updated: March 15, 2024
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">1. What Are Cookies</h2>
              <p className="mb-4">
                Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Remembering your preferences</li>
                <li>Keeping you signed in</li>
                <li>Understanding how you use our site</li>
                <li>Improving our services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">2. Types of Cookies We Use</h2>
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">Essential Cookies</h3>
                <p className="mb-4">Required for the website to function properly, including:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Authentication</li>
                  <li>Security features</li>
                  <li>Basic functionality</li>
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">Analytical Cookies</h3>
                <p className="mb-4">Help us understand how visitors use our site:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Page views and navigation</li>
                  <li>Time spent on site</li>
                  <li>Error encounters</li>
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">Preference Cookies</h3>
                <p className="mb-4">Remember your choices and settings:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Language preferences</li>
                  <li>Region settings</li>
                  <li>Customized views</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">3. Managing Cookies</h2>
              <p className="mb-4">You can control cookies through your browser settings:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Block all cookies</li>
                <li>Delete existing cookies</li>
                <li>Allow only certain types of cookies</li>
                <li>Set preferences for specific websites</li>
              </ul>
              <p className="mb-4">
                Note: Blocking essential cookies may affect website functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">4. Third-Party Cookies</h2>
              <p className="mb-4">
                Some features use third-party cookies:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Analytics services</li>
                <li>Social media integration</li>
                <li>Payment processing</li>
                <li>External content embedding</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Contact Us</h2>
              <p className="mb-4">
                For questions about our cookie policy, please contact us at:
              </p>
              <p className="mb-2">Email: privacy@invotation.com</p>
              <p>Phone: (346) 266-1456</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;