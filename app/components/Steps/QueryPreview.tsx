import NavigationButtons from "../NavigationButtons";
import { Option, Location, Item } from "@prisma/client";

type QueryPreviewProps = {
  query: string;
  selectedOption: Option | null;
  selectedLocations: Location[];
  selectedItems: Item[];
  needsLocations: boolean;
  needsItems: boolean;
  onBack: () => void;
  onSubmit: () => void;
};

const QueryPreview = ({
  query,
  selectedOption,
  selectedLocations,
  selectedItems,
  needsLocations,
  needsItems,
  onBack,
  onSubmit
}: QueryPreviewProps) => {
  // Check if the query is valid to enable submit button
  const isQueryValid = () => {
    if (!selectedOption) return false;
    
    const hasRequiredLocations = !needsLocations || selectedLocations.length > 0;
    const hasRequiredItems = !needsItems || selectedItems.length > 0;
    
    return hasRequiredLocations && hasRequiredItems;
  };
  
  // Check if there are any missing required selections
  const hasWarnings = () => {
    if (!selectedOption) return false;
    
    return (needsLocations && selectedLocations.length === 0) || 
           (needsItems && selectedItems.length === 0);
  };
  
  // Get the list of missing selections for warning message
  const getMissingSelections = () => {
    const missing = [];
    
    if (needsLocations && selectedLocations.length === 0) {
      missing.push("lieux");
    }
    
    if (needsItems && selectedItems.length === 0) {
      missing.push("items");
    }
    
    return missing;
  };
  
  return (
    <div className="flex flex-col h-full">
      <h3 className="font-medium text-gray-700 mb-3">Aperçu de votre requête:</h3>
      
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pr-1 mb-4">
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="mb-2 font-semibold text-indigo-700">Requête finale:</div>
            <div className="p-3 bg-white rounded border border-gray-300 font-medium">
              {query || "(La requête n'est pas encore complète)"}
            </div>
          </div>
          
          {/* Récapitulatif des sélections */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="mb-2 font-semibold text-indigo-700">Récapitulatif:</div>
            
            <div className="space-y-2">
              {/* Option */}
              <div className="flex flex-wrap">
                <div className="w-1/3 text-gray-600">Type de question:</div>
                <div className="w-2/3 font-medium">
                  {selectedOption ? selectedOption.name : "Aucune option sélectionnée"}
                </div>
              </div>
              
              {/* Locations */}
              {needsLocations && (
                <div className="flex flex-wrap">
                  <div className="w-1/3 text-gray-600">Lieux:</div>
                  <div className="w-2/3">
                    {selectedLocations.length > 0 ? (
                      <ul className="list-disc pl-4">
                        {selectedLocations.map(loc => (
                          <li key={loc.id} className="text-sm">
                            <span className="font-medium">{loc.name}</span> 
                            <span className="text-gray-500 text-xs ml-1">({loc.type})</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-amber-600">Aucun lieu sélectionné</span>
                    )}
                  </div>
                </div>
              )}
              
              {/* Items */}
              {needsItems && (
                <div className="flex flex-wrap">
                  <div className="w-1/3 text-gray-600">Items:</div>
                  <div className="w-2/3">
                    {selectedItems.length > 0 ? (
                      <ul className="list-disc pl-4">
                        {selectedItems.map(item => (
                          <li key={item.id} className="text-sm">
                            <span className="font-medium">{item.name}</span>
                            <span className="text-gray-500 text-xs ml-1">({item.category})</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-amber-600">Aucun item sélectionné</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Warning message */}
          {hasWarnings() && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
              <div className="font-semibold flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Attention
              </div>
              <p>
                Votre requête est incomplète. Il manque les éléments suivants: {getMissingSelections().join(" et ")}.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Navigation buttons sticky at the bottom */}
      <div className="sticky bottom-0 pt-2 bg-white border-t border-gray-100">
        <NavigationButtons
          onBack={onBack}
          onNext={onSubmit}
          nextLabel="Envoyer"
          nextDisabled={!isQueryValid()}
        />
      </div>
    </div>
  );
};

export default QueryPreview;