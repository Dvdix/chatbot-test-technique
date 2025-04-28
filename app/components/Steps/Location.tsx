import NavigationButtons from "../NavigationButtons";
import { Location } from "@prisma/client";
import FilterButtons from "../FilterButtons";

type LocationSelectorProps = {
  locations: Location[];
  locationTypes: string[];
  selectedLocations: Location[];
  activeLocationType: string;
  onLocationToggle: (location: Location) => void;
  onLocationTypeSelect: (type: string) => void;
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
};

const LocationSelector = ({
  locations,
  locationTypes,
  selectedLocations,
  activeLocationType,
  onLocationToggle,
  onLocationTypeSelect,
  onBack,
  onNext,
  nextLabel
}: LocationSelectorProps) => {
  const filteredLocations = activeLocationType
    ? locations.filter(loc => loc.type === activeLocationType)
    : locations;

  return (
    <div className="flex flex-col h-full">
      <h3 className="font-medium text-gray-700 mb-3">
        Sélectionnez un ou plusieurs lieux:
      </h3>

      {/* Filter Buttons - Fixed at top */}
      <div className="mb-3">
        <FilterButtons
          items={locationTypes}
          activeItem={activeLocationType}
          onSelect={onLocationTypeSelect}
          allLabel="Tous"
        />
      </div>

      {/* Scrollable location grid */}
      <div className="flex-1 overflow-y-auto mb-4 pr-1">
        <div className="grid grid-cols-2 gap-2 min-h-[50px] max-h-[200px]">
          {filteredLocations.map(location => (
            <div
              key={location.id}
              onClick={() => onLocationToggle(location)}
              className={`p-2 rounded border cursor-pointer transition-colors ${
                selectedLocations.some(loc => loc.id === location.id)
                  ? 'bg-indigo-100 border-indigo-400'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium truncate">{location.name}</div>
              <div className="text-xs text-gray-500">{location.type}</div>
            </div>
          ))}

          {filteredLocations.length === 0 && (
            <div className="text-center text-gray-500 py-3 col-span-2">
              Aucun lieu ne correspond au filtre actuel.
            </div>
          )}
        </div>
      </div>

      {/* Selected Locations Summary */}
      {selectedLocations.length > 0 && (
        <div className="mb-4 p-2 bg-indigo-50 rounded-md border border-indigo-100">
          <div className="text-sm font-medium text-indigo-700 mb-1">Lieux sélectionnés:</div>
          <div className="flex flex-wrap gap-1">
            {selectedLocations.map(loc => (
              <span 
                key={loc.id} 
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                {loc.name}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onLocationToggle(loc);
                  }}
                  className="ml-1 text-indigo-500 hover:text-indigo-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Navigation buttons sticky at bottom */}
      <div className="sticky bottom-0 pt-2 bg-white border-t border-gray-100">
        <NavigationButtons 
          onBack={onBack} 
          onNext={onNext} 
          nextLabel={nextLabel} 
        />
      </div>
    </div>
  );
};

export default LocationSelector;