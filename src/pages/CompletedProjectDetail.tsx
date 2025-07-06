import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, CheckCircle, Calendar, DollarSign, Users, Star, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import PositionIcon from '../components/shared/PositionIcon';

// This would normally come from the same data source as CompletedProjects
const completedProjects = [
  {
    id: 1001,
    title: 'SturdiGuns Pro Series',
    description: 'Premium handcrafted wooden toy weapons that became a bestseller. Made from UV-coated Baltic Birch with enhanced durability features that exceeded all safety standards.',
    fullDescription: 'The SturdiGuns Pro Series revolutionized the toy weapon industry by combining traditional craftsmanship with modern safety standards. Each piece is hand-crafted from premium Baltic Birch and finished with UV-resistant coating that ensures years of play. The project exceeded its funding goal by 949% and has since become a staple in toy stores worldwide.',
    image: 'https://cdn.shopify.com/s/files/1/0817/7595/2154/files/StrudiGuns.webp?v=1746401609',
    originalGoal: 300,
    finalBackers: 2847,
    amountRaised: 89420,
    retailPrice: 29.99,
    category: 'lifestyle',
    completedDate: '2023-08-15',
    kickstarterUrl: 'https://www.kickstarter.com/projects/invotation/sturdiguns-pro',
    amazonUrl: 'https://www.amazon.com/dp/B0C8XYZ123',
    websiteUrl: 'https://sturdiguns.com',
    topBackers: [
      { position: 1, coins: 45, discount: 40, username: 'ToyCrafter_Mike', actualDiscount: '$12.00' },
      { position: 2, coins: 38, discount: 35, username: 'WoodworkingDad', actualDiscount: '$10.50' },
      { position: 3, coins: 32, discount: 30, username: 'VintageCollector', actualDiscount: '$9.00' },
      { position: 4, coins: 28, discount: 27, username: 'PlaytimePro', actualDiscount: '$8.10' },
      { position: 5, coins: 24, discount: 25, username: 'CraftEnthusiast', actualDiscount: '$7.50' },
      { position: 6, coins: 20, discount: 23, username: 'ToyCollector99', actualDiscount: '$6.90' },
      { position: 7, coins: 18, discount: 22, username: 'WoodworkingWiz', actualDiscount: '$6.60' },
      { position: 8, coins: 15, discount: 21, username: 'CreativeParent', actualDiscount: '$6.30' },
      { position: 9, coins: 12, discount: 20, username: 'SafetyFirst', actualDiscount: '$6.00' }
    ],
    stats: {
      rating: 4.8,
      reviews: 1247,
      unitsSold: 15600
    },
    timeline: [
      { date: '2023-03-01', event: 'Campaign Launch', description: 'SturdiGuns Pro launched on Kickstarter' },
      { date: '2023-03-15', event: 'Goal Reached', description: 'Reached initial funding goal of $7,500' },
      { date: '2023-04-01', event: 'Stretch Goals', description: 'Unlocked premium packaging and additional designs' },
      { date: '2023-04-30', event: 'Campaign End', description: 'Final funding: $89,420 from 2,847 backers' },
      { date: '2023-08-15', event: 'Product Launch', description: 'First units shipped to backers and retail launch' }
    ]
  },
  {
    id: 1002,
    title: 'EcoFlow Portable Water Filter',
    description: 'Revolutionary portable water filtration system that removes 99.9% of contaminants. Perfect for hiking, camping, and emergency preparedness with ultra-lightweight design.',
    fullDescription: 'The EcoFlow Portable Water Filter represents a breakthrough in personal water purification technology. Using advanced multi-stage filtration including activated carbon and ceramic elements, it provides clean, safe drinking water from virtually any freshwater source. The campaign exceeded expectations by 1,200% and the product has since become essential gear for outdoor enthusiasts worldwide.',
    image: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=800',
    originalGoal: 500,
    finalBackers: 4521,
    amountRaised: 156780,
    retailPrice: 89.99,
    category: 'outdoor',
    completedDate: '2023-11-20',
    kickstarterUrl: 'https://www.kickstarter.com/projects/ecoflow/portable-filter',
    amazonUrl: 'https://www.amazon.com/dp/B0D9ABC456',
    websiteUrl: 'https://ecoflowfilter.com',
    topBackers: [
      { position: 1, coins: 52, discount: 45, username: 'OutdoorExplorer', actualDiscount: '$40.50' },
      { position: 2, coins: 48, discount: 42, username: 'HikingPro2023', actualDiscount: '$37.80' },
      { position: 3, coins: 44, discount: 38, username: 'SurvivalGuru', actualDiscount: '$34.20' },
      { position: 4, coins: 40, discount: 35, username: 'CampingFamily', actualDiscount: '$31.50' },
      { position: 5, coins: 36, discount: 32, username: 'WaterSafety', actualDiscount: '$28.80' },
      { position: 6, coins: 32, discount: 30, username: 'AdventureSeeker', actualDiscount: '$27.00' },
      { position: 7, coins: 28, discount: 28, username: 'BackpackerLife', actualDiscount: '$25.20' },
      { position: 8, coins: 24, discount: 26, username: 'EcoWarrior', actualDiscount: '$23.40' },
      { position: 9, coins: 20, discount: 25, username: 'PreparedNess', actualDiscount: '$22.50' }
    ],
    stats: {
      rating: 4.9,
      reviews: 2156,
      unitsSold: 28400
    },
    timeline: [
      { date: '2023-06-01', event: 'Campaign Launch', description: 'EcoFlow Filter launched on Kickstarter' },
      { date: '2023-06-10', event: 'Goal Reached', description: 'Reached initial funding goal of $25,000' },
      { date: '2023-07-01', event: 'Stretch Goals', description: 'Unlocked premium carrying case and replacement filters' },
      { date: '2023-07-31', event: 'Campaign End', description: 'Final funding: $156,780 from 4,521 backers' },
      { date: '2023-11-20', event: 'Product Launch', description: 'First units shipped and retail partnerships established' }
    ]
  },
  {
    id: 1003,
    title: 'SmartDesk Pro Standing Desk',
    description: 'Intelligent height-adjustable standing desk with built-in wellness tracking, wireless charging, and premium bamboo surface. Designed for the modern remote worker.',
    fullDescription: 'The SmartDesk Pro revolutionized the home office experience by combining ergonomic design with smart technology. Featuring automatic height adjustment based on user preferences, integrated wellness reminders, and sustainable bamboo construction, it became the gold standard for remote work furniture. The campaign achieved 800% funding and established new benchmarks in the furniture crowdfunding space.',
    image: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=800',
    originalGoal: 750,
    finalBackers: 3892,
    amountRaised: 234560,
    retailPrice: 599.99,
    category: 'tech',
    completedDate: '2024-02-14',
    kickstarterUrl: 'https://www.kickstarter.com/projects/smartdesk/pro-standing',
    amazonUrl: 'https://www.amazon.com/dp/B0E1DEF789',
    websiteUrl: 'https://smartdeskpro.com',
    topBackers: [
      { position: 1, coins: 65, discount: 50, username: 'RemoteWorkPro', actualDiscount: '$300.00' },
      { position: 2, coins: 58, discount: 47, username: 'ErgonomicExpert', actualDiscount: '$282.00' },
      { position: 3, coins: 52, discount: 44, username: 'TechEnthusiast', actualDiscount: '$264.00' },
      { position: 4, coins: 48, discount: 41, username: 'HomeOfficePro', actualDiscount: '$246.00' },
      { position: 5, coins: 44, discount: 38, username: 'ProductivityGuru', actualDiscount: '$228.00' },
      { position: 6, coins: 40, discount: 36, username: 'WellnessFirst', actualDiscount: '$216.00' },
      { position: 7, coins: 36, discount: 34, username: 'SustainableLiving', actualDiscount: '$204.00' },
      { position: 8, coins: 32, discount: 32, username: 'DigitalNomad', actualDiscount: '$192.00' },
      { position: 9, coins: 28, discount: 30, username: 'HealthyWorker', actualDiscount: '$180.00' }
    ],
    stats: {
      rating: 4.7,
      reviews: 1834,
      unitsSold: 12300
    },
    timeline: [
      { date: '2023-09-15', event: 'Campaign Launch', description: 'SmartDesk Pro launched with early bird pricing' },
      { date: '2023-09-25', event: 'Goal Reached', description: 'Reached initial funding goal of $45,000' },
      { date: '2023-10-15', event: 'Stretch Goals', description: 'Unlocked wireless charging pad and premium accessories' },
      { date: '2023-11-15', event: 'Campaign End', description: 'Final funding: $234,560 from 3,892 backers' },
      { date: '2024-02-14', event: 'Product Launch', description: 'First shipments delivered and retail partnerships launched' }
    ]
  }
];



const CompletedProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'supporters' | 'timeline'>('overview');

  const project = completedProjects.find(p => p.id === Number(id));

  if (!project) {
    return (
      <div className="pt-24">
        <div className="container-custom py-12">
          <div className="text-center text-red-600">
            <p>Project not found</p>
            <button
              onClick={() => navigate('/completed-projects')}
              className="mt-4 btn-primary"
            >
              Back to Completed Projects
            </button>
          </div>
        </div>
      </div>
    );
  }

  const fundingPercentage = Math.round((project.finalBackers / project.originalGoal) * 100);

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Header */}
      <div className="bg-white shadow-sm border-b -mt-24 pt-24">
        <div className="container-custom py-6">
          <button
            onClick={() => navigate('/completed-projects')}
            className="inline-flex items-center text-gray-600 hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Completed Projects
          </button>

          <div className="inline-block bg-green-600 text-white text-sm font-bold uppercase px-3 py-1 rounded-full">
            ✓ SUCCESSFULLY COMPLETED
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Image */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-white/90 text-gray-800 backdrop-blur-sm">
                    {project.category}
                  </span>
                </div>
                <div className="absolute top-4 left-4">
                  <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>COMPLETED</span>
                  </div>
                </div>
              </div>

              {/* Purchase Links */}
              <div className="mt-6 space-y-3">
                <a
                  href={project.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-orange-500 text-white py-3 px-4 rounded-xl font-bold hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2 shadow-lg"
                >
                  <span>Buy on Amazon - ${project.retailPrice}</span>
                  <ExternalLink className="w-5 h-5" />
                </a>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={project.kickstarterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white py-3 px-3 rounded-xl text-sm font-bold hover:bg-green-700 transition-colors flex items-center justify-center space-x-1"
                  >
                    <span>Kickstarter</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <a
                    href={project.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-600 text-white py-3 px-3 rounded-xl text-sm font-bold hover:bg-gray-700 transition-colors flex items-center justify-center space-x-1"
                  >
                    <span>Website</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title and Description */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {project.title}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                {project.description}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {project.fullDescription}
              </p>
            </div>

            {/* Success Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-200">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-green-600 mb-1">{fundingPercentage}%</div>
                <div className="text-sm text-gray-600">Funded</div>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-200">
                <Users className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-green-600 mb-1">{project.finalBackers.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Backers</div>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-200">
                <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-green-600 mb-1">${project.amountRaised.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Raised</div>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-200">
                <Star className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-green-600 mb-1">{project.stats.rating}</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
            </div>

            {/* Market Performance */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Market Performance</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {project.stats.unitsSold.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Units Sold</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {project.stats.reviews.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Customer Reviews</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    ${project.retailPrice}
                  </div>
                  <div className="text-sm text-gray-600">Current Price</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8">
          <div className="flex border-b border-gray-200">
            {[
              { key: 'overview', label: 'Project Overview' },
              { key: 'supporters', label: 'Top Supporters' },
              { key: 'timeline', label: 'Project Timeline' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${activeTab === tab.key
                    ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-4">Campaign Success Story</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    This project exemplifies the power of community-driven innovation. Starting with a simple idea
                    and a modest funding goal, it captured the imagination of thousands of backers who believed in
                    the vision.
                  </p>
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <h4 className="font-bold text-green-900 mb-2">Key Success Factors:</h4>
                    <ul className="space-y-2 text-green-800">
                      <li>• Strong community engagement and feedback integration</li>
                      <li>• Transparent communication throughout development</li>
                      <li>• Quality materials and craftsmanship</li>
                      <li>• Competitive pricing with excellent value proposition</li>
                      <li>• Effective marketing and social media presence</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'supporters' && (
              <div>
                <h3 className="text-xl font-bold mb-6">Campaign Supporters Hall of Fame</h3>
                <p className="text-gray-600 mb-6">
                  These early supporters helped make this project a reality. Their coin investments secured
                  exclusive discounts and helped fund the development.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.topBackers.map((backer) => (<div
                    key={backer.position}
                    className={`rounded-xl p-4 border-2 ${backer.position <= 3
                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200'
                        : 'bg-gray-50 border-gray-200'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <PositionIcon position={backer.position} size="md" />
                        <span className="font-bold">#{backer.position}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-green-600">{backer.discount}% OFF</div>
                        <div className="text-xs text-gray-500">Saved {backer.actualDiscount}</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-gray-900">{backer.username}</div>
                      <div className="text-sm text-gray-600">{backer.coins} coins invested</div>
                    </div>
                  </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div>
                <h3 className="text-xl font-bold mb-6">Project Development Timeline</h3>
                <div className="space-y-6">
                  {project.timeline.map((event, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <h4 className="font-bold text-gray-900">{event.event}</h4>
                          <span className="text-sm text-gray-500">
                            {new Date(event.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <p className="text-gray-600">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border border-green-200">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-green-900">Inspired by This Success?</h2>
            <p className="text-green-800 mb-6 max-w-2xl mx-auto">
              Every successful project starts with a simple idea. Join our community of innovators
              and turn your vision into the next success story.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/submit')}
                className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors"
              >
                Submit Your Idea
              </button>
              <button
                onClick={() => navigate('/live-campaigns')}
                className="bg-white text-green-600 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors border-2 border-green-600"
              >
                Support Current Projects
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletedProjectDetail;