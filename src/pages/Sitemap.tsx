const Sitemap = () => {
  const routes = [
    {
      name: 'Home',
      path: '/',
      description: 'Welcome to Invotation - Turn your ideas into reality'
    },
    {
      name: 'Live Campaigns',
      path: '/live-campaigns',
      description: 'Explore our current crowdfunding projects'
    },
    {
      name: 'How It Works',
      path: '/how-it-works',
      description: 'Learn about our product development process'
    },
    {
      name: 'Why Invotation',
      path: '/why-invotation',
      description: 'Discover what makes Invotation unique'
    },
    {
      name: 'Submit Your Idea',
      path: '/submit',
      description: 'Share your product idea with us'
    }
  ];

  return (
    <div className="pt-24">
      <div className="container-custom py-12">
        <h1 className="text-4xl font-bold mb-8">Sitemap</h1>
        <div className="space-y-8">
          {routes.map((route) => (
            <div key={route.path} className="border-b border-gray-200 pb-6">
              <a 
                href={route.path}
                className="text-xl font-semibold text-primary hover:text-primary-dark transition-colors"
              >
                {route.name}
              </a>
              <p className="mt-2 text-gray-600">{route.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sitemap;