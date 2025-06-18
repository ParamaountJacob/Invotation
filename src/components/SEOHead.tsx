import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  noIndex?: boolean;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "Invotation - Turn Your Ideas Into Reality | Innovation Platform",
  description = "Join Invotation's innovation platform where great ideas become reality. Vote on emerging products, support inventors, and get exclusive early access to groundbreaking innovations.",
  keywords = "innovation platform, product development, crowdfunding, invention, startup ideas, vote on products, early access, product voting, inventor platform",
  image = "https://cdn.shopify.com/s/files/1/0749/7403/6183/files/Invotation_Logo_Design_copy.webp?v=1746324151",
  url = "https://invotation.com",
  type = "website",
  noIndex = false
}) => {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEOHead;