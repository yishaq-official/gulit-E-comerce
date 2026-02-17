const SubHeader = () => {
  const categories = ["Electronics", "Clothes", "Home Utility", "Fashion", "Agriculture", "Handicrafts"];

  return (
    <div className="bg-white border-b border-gray-100 hidden sm:block">
      <div className="container mx-auto px-6 py-2 flex items-center gap-8">
        {/* Dropdown for All Categories */}
        <button className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-sm">
           All Categories <FaChevronDown size={10} />
        </button>

        {/* Horizontal Scroll Categories */}
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <Link key={cat} to={`/category/${cat.toLowerCase()}`} className="text-sm font-medium text-gray-600 hover:text-green-500 whitespace-nowrap">
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubHeader;