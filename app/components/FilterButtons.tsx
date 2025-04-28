type FilterButtonsProps = {
  items: string[];
  activeItem: string;
  onSelect: (item: string) => void;
  allLabel?: string;
};

const FilterButtons = ({
  items,
  activeItem,
  onSelect,
  allLabel = "Tous"
}: FilterButtonsProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-3">
      <button
        key="all"
        onClick={() => onSelect('')}
        className={`px-3 py-1 text-sm rounded-full transition-colors ${
          activeItem === ''
            ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
            : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
        }`}
      >
        {allLabel}
      </button>
      
      {items.map(item => (
        <button
          key={item}
          onClick={() => onSelect(item)}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            activeItem === item
              ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
              : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;