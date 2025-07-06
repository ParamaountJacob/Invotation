import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, CheckCircle, Calendar, DollarSign, Users, Star } from 'lucide-react';
import PositionIcon from '../components/shared/PositionIcon';

type CompletedProject = {
  id: number;
  title: string;
  description: string;
  image: string;
  originalGoal: number;
  finalBackers: number;
  amountRaised: number;
  retailPrice: number;
  category: 'tech' | 'home' | 'lifestyle';
  completedDate: string;
  kickstarterUrl: string;
  amazonUrl: string;
  websiteUrl: string;
  topBackers: Array<{
    position: number;
    coins: number;
    discount: number;
    username: string;
  }>;
  stats: {
    rating: number;
    reviews: number;
    unitsSold: number;
  };
};



const completedProjects: CompletedProject[] = [
  {
    id: 1001,
    title: 'SturdiGuns Pro Series',
    description: 'Premium handcrafted wooden toy weapons that became a bestseller. Made from UV-coated Baltic Birch with enhanced durability features.',
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
      { position: 1, coins: 45, discount: 40, username: 'ToyCrafter_Mike' },
      { position: 2, coins: 38, discount: 35, username: 'WoodworkingDad' },
      { position: 3, coins: 32, discount: 30, username: 'VintageCollector' }
    ],
    stats: {
      rating: 4.8,
      reviews: 1247,
      unitsSold: 15600
    }
  },
  {
    id: 1002,
    title: 'AquaFlow Shower System',
    description: 'Revolutionary dual-head shower system that transformed bathroom experiences worldwide. Now the #1 bestselling luxury shower upgrade.',
    image: 'https://cdn.shopify.com/s/files/1/0817/7595/2154/files/Shower_Jeane.webp?v=1732770175',
    originalGoal: 250,
    finalBackers: 4521,
    amountRaised: 156780,
    retailPrice: 349.99,
    category: 'home',
    completedDate: '2023-11-22',
    kickstarterUrl: 'https://www.kickstarter.com/projects/invotation/aquaflow-shower',
    amazonUrl: 'https://www.amazon.com/dp/B0D9ABC456',
    websiteUrl: 'https://aquaflowshower.com',
    topBackers: [
      { position: 1, coins: 67, discount: 40, username: 'BathroomGuru' },
      { position: 2, coins: 55, discount: 35, username: 'HomeRenovator' },
      { position: 3, coins: 48, discount: 30, username: 'LuxuryLiving' }
    ],
    stats: {
      rating: 4.9,
      reviews: 892,
      unitsSold: 8900
    }
  },
  {
    id: 1003,
    title: 'CoffeePro Station',
    description: 'The ultimate coffee brewing station that revolutionized home barista setups. Featured in Coffee Magazine as "Innovation of the Year".',
    image: 'https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg?auto=compress&cs=tinysrgb&w=800',
    originalGoal: 200,
    finalBackers: 3245,
    amountRaised: 127890,
    retailPrice: 199.99,
    category: 'home',
    completedDate: '2023-06-10',
    kickstarterUrl: 'https://www.kickstarter.com/projects/invotation/coffeepro-station',
    amazonUrl: 'https://www.amazon.com/dp/B0E1DEF789',
    websiteUrl: 'https://coffeeprostation.com',
    topBackers: [
      { position: 1, coins: 52, discount: 40, username: 'CoffeeConnoisseur' },
      { position: 2, coins: 44, discount: 35, username: 'MorningBrew' },
      { position: 3, coins: 39, discount: 30, username: 'EspressoExpert' }
    ],
    stats: {
      rating: 4.7,
      reviews: 2156,
      unitsSold: 12400
    }
  },
  {
    id: 1004,
    title: 'SmartDesk Elite',
    description: 'AI-powered standing desk that adapts to your work patterns. Now used by Fortune 500 companies and featured in productivity studies.',
    image: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=800',
    originalGoal: 400,
    finalBackers: 5678,
    amountRaised: 234560,
    retailPrice: 899.99,
    category: 'tech',
    completedDate: '2023-09-30',
    kickstarterUrl: 'https://www.kickstarter.com/projects/invotation/smartdesk-elite',
    amazonUrl: 'https://www.amazon.com/dp/B0F2GHI012',
    websiteUrl: 'https://smartdeskelite.com',
    topBackers: [
      { position: 1, coins: 89, discount: 40, username: 'TechInnovator' },
      { position: 2, coins: 76, discount: 35, username: 'ProductivityPro' },
      { position: 3, coins: 68, discount: 30, username: 'WorkspaceWiz' }
    ],
    stats: {
      rating: 4.6,
      reviews: 567,
      unitsSold: 4200
    }
  },
  {
    id: 1005,
    title: 'EcoBottle Pure',
    description: 'Self-cleaning water bottle with UV-C purification. Became the go-to choice for outdoor enthusiasts and health-conscious consumers.',
    image: 'https://images.pexels.com/photos/3735747/pexels-photo-3735747.jpeg?auto=compress&cs=tinysrgb&w=800',
    originalGoal: 300,
    finalBackers: 6234,
    amountRaised: 187020,
    retailPrice: 89.99,
    category: 'lifestyle',
    completedDate: '2023-07-18',
    kickstarterUrl: 'https://www.kickstarter.com/projects/invotation/ecobottle-pure',
    amazonUrl: 'https://www.amazon.com/dp/B0G3JKL345',
    websiteUrl: 'https://ecobottlepure.com',
    topBackers: [
      { position: 1, coins: 34, discount: 40, username: 'EcoWarrior' },
      { position: 2, coins: 29, discount: 35, username: 'HydrationHero' },
      { position: 3, coins: 25, discount: 30, username: 'OutdoorAdventurer' }
    ],
    stats: {
      rating: 4.8,
      reviews: 3421,
      unitsSold: 18700
    }
  },
  {
    id: 1006,
    title: 'ModularShelf System',
    description: 'Magnetic modular shelving that transforms any space. Featured in Architectural Digest and used in modern homes worldwide.',
    image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800',
    originalGoal: 150,
    finalBackers: 2890,
    amountRaised: 98760,
    retailPrice: 149.99,
    category: 'home',
    completedDate: '2023-05-25',
    kickstarterUrl: 'https://www.kickstarter.com/projects/invotation/modularshelf-system',
    amazonUrl: 'https://www.amazon.com/dp/B0H4MNO678',
    websiteUrl: 'https://modularshelf.com',
    topBackers: [
      { position: 1, coins: 28, discount: 40, username: 'InteriorDesigner' },
      { position: 2, coins: 24, discount: 35, username: 'MinimalistMom' },
      { position: 3, coins: 21, discount: 30, username: 'SpaceOptimizer' }
    ],
    stats: {
      rating: 4.5,
      reviews: 876,
      unitsSold: 7800
    }
  }
];

const CompletedProjects = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [filteredProjects, setFilteredProjects] = useState(completedProjects);

  useEffect(() => {
    if (selectedFilter === 'all') {
      setFilteredProjects(completedProjects);
    } else {
      setFilteredProjects(completedProjects.filter(project => project.category === selectedFilter));
    }
  }, [selectedFilter]);

  const handleProjectClick = (project: CompletedProject) => {
    navigate(`/completed-project/${project.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container-custom py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6 text-gray-900">Completed Projects</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            These innovative products successfully completed their crowdfunding campaigns and are now available for purchase.
            See how our community's support turned great ideas into market successes.
          </p>
        </div>

        {/* Success Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 max-w-5xl mx-auto">
          <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {completedProjects.length}
            </div>
            <div className="text-sm text-gray-600">Successful Projects</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {completedProjects.reduce((sum, p) => sum + p.finalBackers, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Backers</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-green-600 mb-2">
              ${completedProjects.reduce((sum, p) => sum + p.amountRaised, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Funds Raised</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {completedProjects.reduce((sum, p) => sum + p.stats.unitsSold, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Units Sold</div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {['all', 'tech', 'home', 'lifestyle'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${selectedFilter === filter
                  ? 'bg-green-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-200'
                }`}
            >
              {filter === 'all' ? 'All Projects' : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="campaign-card bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 cursor-pointer group nav-transition"
              onClick={() => handleProjectClick(project)}
            >
              <div className="relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                <div className="absolute top-4 right-4">
                  <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-white/90 text-gray-800 backdrop-blur-sm">
                    {project.category}
                  </span>
                </div>
                <div className="absolute top-4 left-4">
                  <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>COMPLETED</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-green-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                {/* Success Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {((project.finalBackers / project.originalGoal) * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-600">Funded</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      ${project.retailPrice}
                    </div>
                    <div className="text-xs text-gray-600">Retail Price</div>
                  </div>
                </div>

                {/* Top Backers */}
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center">
                    <Trophy className="w-4 h-4 mr-1 text-yellow-500" />
                    Top Supporters
                  </h4>
                  <div className="space-y-2">
                    {project.topBackers.map((backer) => (
                      <div key={backer.position} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <PositionIcon position={backer.position} size="sm" />
                          <span className="font-medium">#{backer.position} {backer.username}</span>
                        </div>
                        <span className="text-green-600 font-bold">{backer.discount}% off</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rating and Reviews */}
                <div className="flex items-center justify-between mb-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-bold">{project.stats.rating}</span>
                    <span className="text-gray-500">({project.stats.reviews} reviews)</span>
                  </div>
                  <span className="text-gray-600">{project.stats.unitsSold.toLocaleString()} sold</span>
                </div>

                {/* Purchase Links */}
                <div className="space-y-2">
                  <a
                    href={project.amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg font-bold hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Buy on Amazon</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={project.kickstarterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-1"
                    >
                      <span>Kickstarter</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={project.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="bg-gray-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors flex items-center justify-center space-x-1"
                    >
                      <span>Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 border border-green-200">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-green-900">Your Idea Could Be Next!</h2>
            <p className="text-green-800 text-lg mb-8 max-w-2xl mx-auto">
              These successful projects all started as simple ideas submitted by people like you.
              Join our community of innovators and turn your vision into reality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/submit')}
                className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg"
              >
                Submit Your Idea
              </button>
              <button
                onClick={() => navigate('/live-campaigns')}
                className="bg-white text-green-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transition-colors border-2 border-green-600"
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

export default CompletedProjects;