interface CampaignFiltersProps {
  filterCategory: string;
  setFilterCategory: (category: string) => void;
}

const CampaignFilters = ({ filterCategory, setFilterCategory }: CampaignFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <select
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
      >
        <option value="all">All Categories</option>
        <option value="tech">Tech</option>
        <option value="home">Home</option>
        <option value="lifestyle">Lifestyle</option>
      </select>
    </div>
  );
};

export default CampaignFilters;