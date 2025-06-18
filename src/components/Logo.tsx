const Logo = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <a
        href="/submit"
        className="group"
        title="Submit Your Idea"
      >
        <img 
          src="https://cdn.shopify.com/s/files/1/0749/7403/6183/files/Short_Logo_FAV.webp?v=1746324234"
          alt="Create New Project"
          className="w-8 h-8 group-hover:scale-110 transition-transform"
          loading="lazy"
        />
      </a>
      <div className="h-6 w-px bg-gray-200 mx-1"></div>
      <a
        href="/"
        className="text-xl font-semibold text-gray-900 hover:text-primary transition-colors"
      >
        Invotation
      </a>
    </div>
  );
};

export default Logo;