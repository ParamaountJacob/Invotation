import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, Target, Camera, FileText, DollarSign, Shield, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const SubmissionTips = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'tips' | 'example'>('tips');

    return (
        <>
            <SEOHead
                title="Submission Tips - How to Submit Your Idea | Invotation"
                description="Learn how to submit your product idea effectively. Get tips on describing your concept, market research, visual content, and what happens after submission."
                keywords="submission tips, product idea, invention submission, how to submit idea, product development"
            />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-16">
                <div className="container-custom">
                    <div className="max-w-5xl mx-auto">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <button
                                onClick={() => navigate(-1)}
                                className="inline-flex items-center text-gray-600 hover:text-primary transition-colors mb-6"
                            >
                                <ArrowLeft size={20} className="mr-2" />
                                Back
                            </button>

                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Lightbulb className="w-10 h-10 text-primary" />
                            </div>
                            <h1 className="text-4xl font-bold mb-4 text-gray-900">Submission Tips</h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Learn how to submit your product idea effectively and maximize your chances of success with Invotation.
                            </p>
                        </div>

                        {/* Main Content Card */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            {/* Tabs */}
                            <div className="border-b border-gray-200 bg-gray-50">
                                <div className="flex">
                                    <button
                                        onClick={() => setActiveTab('tips')}
                                        className={`flex-1 py-4 px-6 font-medium transition-colors ${activeTab === 'tips'
                                                ? 'text-primary border-b-2 border-primary bg-white'
                                                : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        Helpful Tips
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('example')}
                                        className={`flex-1 py-4 px-6 font-medium transition-colors ${activeTab === 'example'
                                                ? 'text-primary border-b-2 border-primary bg-white'
                                                : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        Example Submission
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8">
                                {activeTab === 'tips' && (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            {/* Describing Your Idea */}
                                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                                <div className="flex items-center space-x-4 mb-4">
                                                    <Lightbulb className="w-6 h-6 text-primary" />
                                                    <h3 className="text-xl font-bold">Describing Your Idea</h3>
                                                </div>
                                                <ul className="space-y-3 text-gray-700">
                                                    <li className="flex items-start">
                                                        <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                                                        <p>Be clear and concise in your description. Focus on the problem your idea solves and how it solves it.</p>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                                                        <p>Highlight what makes your idea unique. What sets it apart from existing solutions?</p>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                                                        <p>Include potential use cases and target users to help us understand the market potential.</p>
                                                    </li>
                                                </ul>
                                            </div>

                                            {/* Market Research */}
                                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                                <div className="flex items-center space-x-4 mb-4">
                                                    <Target className="w-6 h-6 text-primary" />
                                                    <h3 className="text-xl font-bold">Market Research</h3>
                                                </div>
                                                <ul className="space-y-3 text-gray-700">
                                                    <li className="flex items-start">
                                                        <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                                                        <p>Research similar products and explain how yours is different or better.</p>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                                                        <p>Identify your target market and potential market size.</p>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                                                        <p>Consider price points of similar products when suggesting retail pricing.</p>
                                                    </li>
                                                </ul>
                                            </div>

                                            {/* Visual Content */}
                                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                                <div className="flex items-center space-x-4 mb-4">
                                                    <Camera className="w-6 h-6 text-primary" />
                                                    <h3 className="text-xl font-bold">Visual Content</h3>
                                                </div>
                                                <ul className="space-y-3 text-gray-700">
                                                    <li className="flex items-start">
                                                        <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                                                        <p>Include sketches, diagrams, or mockups to help visualize your idea.</p>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                                                        <p>If you have a prototype, share photos or videos from multiple angles.</p>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                                                        <p>3D models (if available) can greatly help us understand your concept.</p>
                                                    </li>
                                                </ul>
                                            </div>

                                            {/* Cost Considerations */}
                                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                                <div className="flex items-center space-x-4 mb-4">
                                                    <DollarSign className="w-6 h-6 text-primary" />
                                                    <h3 className="text-xl font-bold">Cost Considerations</h3>
                                                </div>
                                                <ul className="space-y-3 text-gray-700">
                                                    <li className="flex items-start">
                                                        <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                                                        <p>Research potential manufacturing costs if possible.</p>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                                                        <p>Consider shipping and packaging requirements.</p>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                                                        <p>Suggest a retail price point that allows for profitable production.</p>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        {/* What Happens After You Submit */}
                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
                                            <h3 className="text-2xl font-bold mb-6 flex items-center text-gray-900">
                                                <Shield className="w-6 h-6 text-primary mr-3" />
                                                What Happens After You Submit
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                                    <div className="flex items-center mb-3">
                                                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-3">1</div>
                                                        <h4 className="font-bold text-gray-800">Review</h4>
                                                    </div>
                                                    <p className="text-gray-600 text-sm">We'll evaluate your submission for market potential, feasibility, and uniqueness.</p>
                                                </div>

                                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                                    <div className="flex items-center mb-3">
                                                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-3">2</div>
                                                        <h4 className="font-bold text-gray-800">Feedback</h4>
                                                    </div>
                                                    <p className="text-gray-600 text-sm">You'll receive feedback on your idea, typically within 2-3 business days.</p>
                                                </div>

                                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                                    <div className="flex items-center mb-3">
                                                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-3">3</div>
                                                        <h4 className="font-bold text-gray-800">Development</h4>
                                                    </div>
                                                    <p className="text-gray-600 text-sm">If selected, we'll develop your idea at no cost to you, creating professional designs and prototypes.</p>
                                                </div>

                                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                                    <div className="flex items-center mb-3">
                                                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-3">4</div>
                                                        <h4 className="font-bold text-gray-800">Community</h4>
                                                    </div>
                                                    <p className="text-gray-600 text-sm">Your idea goes live for community voting, where users support it with coins.</p>
                                                </div>

                                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                                    <div className="flex items-center mb-3">
                                                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-3">5</div>
                                                        <h4 className="font-bold text-gray-800">Launch</h4>
                                                    </div>
                                                    <p className="text-gray-600 text-sm">When successful, your idea launches on Kickstarter and you earn ongoing profits from every sale.</p>
                                                </div>

                                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                                    <div className="flex items-center mb-3">
                                                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold mr-3">💰</div>
                                                        <h4 className="font-bold text-gray-800">Profit</h4>
                                                    </div>
                                                    <p className="text-gray-600 text-sm">Earn 10-20% ongoing profits from every unit sold, with no upfront investment required.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'example' && (
                                    <div className="space-y-8">
                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
                                            <div className="text-center mb-8">
                                                <h3 className="text-3xl font-bold text-gray-900 mb-4">Example Submission</h3>
                                                <p className="text-gray-600 text-lg">This is how simple your submission can be</p>
                                            </div>

                                            <div className="bg-white rounded-xl p-8 shadow-lg">
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                    {/* Basic Information */}
                                                    <div className="space-y-6">
                                                        <div>
                                                            <div className="flex items-center mb-3">
                                                                <span className="text-2xl mr-3">💡</span>
                                                                <h4 className="font-bold text-gray-900 text-lg">Idea Name</h4>
                                                            </div>
                                                            <p className="text-gray-700 bg-gray-50 rounded-lg p-4 font-medium">"SmartMug Pro"</p>
                                                        </div>

                                                        <div>
                                                            <div className="flex items-center mb-3">
                                                                <span className="text-2xl mr-3">🎯</span>
                                                                <h4 className="font-bold text-gray-900 text-lg">Quick Pitch</h4>
                                                            </div>
                                                            <p className="text-gray-700 bg-gray-50 rounded-lg p-4">"Coffee mug that connects to your phone and keeps coffee at perfect temperature"</p>
                                                        </div>

                                                        <div>
                                                            <div className="flex items-center mb-3">
                                                                <span className="text-2xl mr-3">📋</span>
                                                                <h4 className="font-bold text-gray-900 text-lg">Stage</h4>
                                                            </div>
                                                            <p className="text-gray-700 bg-gray-50 rounded-lg p-4">"Just thought of it!"</p>
                                                        </div>
                                                    </div>

                                                    {/* Details and Pricing */}
                                                    <div className="space-y-6">
                                                        <div>
                                                            <div className="flex items-center mb-3">
                                                                <span className="text-2xl mr-3">📝</span>
                                                                <h4 className="font-bold text-gray-900 text-lg">Description</h4>
                                                            </div>
                                                            <p className="text-gray-700 bg-gray-50 rounded-lg p-4 text-sm">"I'm tired of my coffee getting cold. What if there was a mug that could keep it warm and let me control the temperature from my phone?"</p>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <div className="flex items-center mb-2">
                                                                    <span className="text-xl mr-2">💰</span>
                                                                    <h4 className="font-bold text-gray-900">Price</h4>
                                                                </div>
                                                                <p className="text-gray-700 bg-gray-50 rounded-lg p-3 text-center font-medium">$89</p>
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center mb-2">
                                                                    <span className="text-xl mr-2">💵</span>
                                                                    <h4 className="font-bold text-gray-900">Budget</h4>
                                                                </div>
                                                                <p className="text-gray-700 bg-gray-50 rounded-lg p-3 text-center font-medium">$15K</p>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <div className="flex items-center mb-3">
                                                                <span className="text-2xl mr-3">✏️</span>
                                                                <h4 className="font-bold text-gray-900 text-lg">Hand-drawn Sketch</h4>
                                                            </div>
                                                            <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-200 text-center">
                                                                <img
                                                                    src="https://res.cloudinary.com/digjsdron/image/upload/v1749752320/ChatGPT_Image_Jun_12_2025_01_16_04_PM_fdoc6c.png"
                                                                    alt="Example hand-drawn sketch"
                                                                    className="w-32 h-24 mx-auto rounded-md object-cover"
                                                                    loading="lazy"
                                                                />
                                                                <p className="text-xs text-gray-500 mt-2">Example sketch</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Potential Result */}
                                                <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                                                    <div className="flex items-center justify-center mb-4">
                                                        <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                                                        <h4 className="text-2xl font-bold text-green-900">Potential Result</h4>
                                                    </div>
                                                    <p className="text-green-800 text-center text-lg">
                                                        From a simple submission like this, you could earn <span className="font-bold">$8 per unit sold</span>.
                                                        That could be <span className="font-bold">$40,000 or more</span> in ongoing profits!
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-8 border-t border-gray-200 bg-gray-50">
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <p className="text-gray-600 text-center sm:text-left">
                                        Don't worry about perfection - we're here to help develop your idea!
                                    </p>
                                    <button
                                        onClick={() => navigate('/submit')}
                                        className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors flex items-center"
                                    >
                                        Submit Your Idea
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SubmissionTips;
