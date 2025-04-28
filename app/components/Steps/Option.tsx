import NavigationButtons from "../NavigationButtons";
import { Option } from "@prisma/client";

type OptionSelectorProps = {
  options: Option[];
  selectedOption: Option | null;
  onOptionSelect: (option: Option) => void;
  onCancel: () => void;
  onNext: () => void;
  nextLabel?: string;
};

const OptionSelector = ({
  options,
  selectedOption,
  onOptionSelect,
  onCancel,
  onNext,
  nextLabel = "Suivant"
}: OptionSelectorProps) => {
  // Group options by what they require
  const groupedOptions = {
    both: options.filter(opt => opt.requiresLocations && opt.requiresItems),
    locationsOnly: options.filter(opt => opt.requiresLocations && !opt.requiresItems),
    itemsOnly: options.filter(opt => !opt.requiresLocations && opt.requiresItems),
    neither: options.filter(opt => !opt.requiresLocations && !opt.requiresItems)
  };
  
  return (
    <div className="flex flex-col h-full">
      <h3 className="font-medium text-gray-700 mb-3">Choisissez votre type de question:</h3>
      
      {/* Scrollable container for options */}
      <div className="flex-1 overflow-y-auto max-h-[300px] pr-1 mb-4">
        <div className="space-y-4">
          {Object.entries(groupedOptions).map(([group, groupOptions]) => {
            if (groupOptions.length === 0) return null;
            
            // Create a translated group name for display
            const groupTitle = {
              both: "Questions sur des lieux et des items",
              locationsOnly: "Questions sur des lieux",
              itemsOnly: "Questions sur des items",
              neither: "Questions générales"
            }[group];
            
            return (
              <div key={group} className="space-y-2">
                <div className="text-sm font-medium text-indigo-600 sticky top-0 bg-white py-1 z-10">
                  {groupTitle}
                </div>
                {groupOptions.map(option => (
                  <div
                    key={option.id}
                    onClick={() => onOptionSelect(option)}
                    className={`p-3 rounded-lg cursor-pointer border transition-all ${
                      selectedOption?.id === option.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium">{option.name}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                    <div className="text-xs mt-1 text-gray-500">
                      {option.requiresLocations && option.requiresItems && "Nécessite des lieux et des items"}
                      {option.requiresLocations && !option.requiresItems && "Nécessite seulement des lieux"}
                      {!option.requiresLocations && option.requiresItems && "Nécessite seulement des items"}
                      {!option.requiresLocations && !option.requiresItems && "Aucune sélection supplémentaire nécessaire"}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Navigation buttons in a sticky position at the bottom */}
      <div className="sticky bottom-0 pt-2 bg-white border-t border-gray-100">
        <NavigationButtons
          onBack={onCancel}
          onNext={onNext}
          backLabel="Annuler"
          nextLabel={nextLabel}
          nextDisabled={!selectedOption}
        />
      </div>
    </div>
  );
};

export default OptionSelector;