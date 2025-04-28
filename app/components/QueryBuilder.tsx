'use client';

import { useState, useEffect } from 'react';

import { Option, Location, Item } from '@prisma/client';

import OptionSelector from './Steps/Option';
import LocationSelector from './Steps/Location';
import ItemSelector from './Steps/Items';
import LoadingSpinner from './Loading';
import ErrorMessage from './Error';
import ProgressBar from './ProgressBar';
import QueryPreview from './Steps/QueryPreview';

interface QueryBuilderProps {
  onSendQuery: (query: string) => void;
  onCancel: () => void;
}


// Main Component
export default function QueryBuilder({ onSendQuery, onCancel }: QueryBuilderProps) {
  // API Data State
  const [options, setOptions] = useState<Option[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  
  // Filter Lists
  const [locationTypes, setLocationTypes] = useState<string[]>([]);
  const [itemCategories, setItemCategories] = useState<string[]>([]);
  
  // Selection State
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  
  // Filter State
  const [activeLocationType, setActiveLocationType] = useState<string>('');
  const [activeItemCategory, setActiveItemCategory] = useState<string>('');
  
  // UI State
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data Loading
  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Load all data in parallel for better performance
        const [optionsRes, locationsRes, itemsRes] = await Promise.all([
          fetch('/api/options'),
          fetch('/api/locations'),
          fetch('/api/items')
        ]);
        
        // Check for errors
        if (!optionsRes.ok) throw new Error('Erreur lors du chargement des options');
        if (!locationsRes.ok) throw new Error('Erreur lors du chargement des lieux');
        if (!itemsRes.ok) throw new Error('Erreur lors du chargement des items');
        
        // Parse responses
        const optionsData: Option[] = await optionsRes.json();
        const locationsData: Location[] = await locationsRes.json();
        const itemsData: Item[] = await itemsRes.json();
        
        // Extract unique types and categories
        const typesSet = new Set(locationsData.map(loc => loc.type));
        const categoriesSet = new Set(itemsData.map(item => item.category));
        
        // Update state
        setOptions(optionsData);
        setLocations(locationsData);
        setItems(itemsData);
        setLocationTypes(Array.from(typesSet));
        setItemCategories(Array.from(categoriesSet));
      } catch (err) {
        console.error('Erreur de chargement initial:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();

    // Point important rajout du clean up

    return () => {
      controller.abort();
    };
  }, []);

  // Helper Functions - Updated to use Option model properties directly
  const needsLocations = () => {
    return selectedOption?.requiresLocations ?? false;
  };

  const needsItems = () => {
    return selectedOption?.requiresItems ?? false;
  };

  const generateQuery = () => {
    if (!selectedOption) return '';
    
    let query = `${selectedOption.name}`;

    // Petit commentaire sur cette partie, il faut adapter avec les besoins du backends / besoin d'affichage frontend à définir dans les aspects tehcniques
    
    // Add selected locations if needed
    if (needsLocations() && selectedLocations.length > 0) {
      const locationText = selectedLocations.length === 1 ? 'à' : 'aux';
      query += ` ${locationText} ${selectedLocations.map(loc => loc.name).join(', ')}`;
    }
    
    // Add selected items if needed
    if (needsItems() && selectedItems.length > 0) {
      const itemText = selectedItems.length === 1 ? 'concernant le' : 'concernant les';
      query += ` ${itemText} ${selectedItems.map(item => item.name).join(', ')}`;
    }
    
    return query;
  };

  // Event Handlers
  const handleSubmit = () => {
    const query = generateQuery();
    if (query) {
      onSendQuery(query);
    }
  };

  const handleOptionSelect = (option: Option) => {
    setSelectedOption(option);
    
    // Reset selections when option changes
    setSelectedLocations([]);
    setSelectedItems([]);
    
    // Reset filters when option changes
    setActiveLocationType('');
    setActiveItemCategory('');
  };

  const handleLocationToggle = (location: Location) => {
    setSelectedLocations(prev => {
      if (prev.some(loc => loc.id === location.id)) {
        return prev.filter(loc => loc.id !== location.id);
      } else {
        return [...prev, location];
      }
    });
  };

  const handleItemToggle = (item: Item) => {
    setSelectedItems(prev => {
      if (prev.some(i => i.id === item.id)) {
        return prev.filter(i => i.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  // Navigation Functions - Updated to respect Option model properties
  const goToNextStep = () => {
    if (currentStep === 1) {
      if (needsLocations()) {
        setCurrentStep(2);
      } else if (needsItems()) {
        setCurrentStep(3);
      } else {
        setCurrentStep(4);
      }
    } else if (currentStep === 2) {
      if (needsItems()) {
        setCurrentStep(3);
      } else {
        setCurrentStep(4);
      }
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep === 4) {
      if (needsItems()) {
        setCurrentStep(3);
      } else if (needsLocations()) {
        setCurrentStep(2);
      } else {
        setCurrentStep(1);
      }
    } else if (currentStep === 3) {
      if (needsLocations()) {
        setCurrentStep(2);
      } else {
        setCurrentStep(1);
      }
    } else if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  // Determines the next button label based on next steps
  const getNextButtonLabel = (step: number): string => {
    if (step === 2) {
      return needsItems() ? "Suivant" : "Aperçu";
    } else if (step === 1) {
      if (!needsLocations() && !needsItems()) {
        return "Aperçu";
      } else if (!needsLocations() && needsItems()) {
        return "Choisir Items";
      } else {
        return "Choisir Lieux";
      }
    }
    return "Aperçu";
  };

  // Render
  if (isLoading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <ErrorMessage message={error} onClose={onCancel} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200 flex flex-col" style={{ height: '500px' }}>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-indigo-700">Assistant de requête</h2>
        <button 
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Fermer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="mb-3">
        <ProgressBar 
          currentStep={currentStep} 
          totalSteps={
            1 + 
            (needsLocations() ? 1 : 0) + 
            (needsItems() ? 1 : 0) + 
            1 // Preview is always a step
          } 
        />
      </div>
      
      {/* Flexible content area */}
      <div className="flex-1 overflow-hidden">
        {/* Step 1: Option Selection */}
        {currentStep === 1 && (
          <OptionSelector 
            options={options}
            selectedOption={selectedOption}
            onOptionSelect={handleOptionSelect}
            onCancel={onCancel}
            onNext={goToNextStep}
            nextLabel={getNextButtonLabel(1)}
          />
        )}
        
        {/* Step 2: Location Selection */}
        {currentStep === 2 && needsLocations() && (
          <LocationSelector 
            locations={locations}
            locationTypes={locationTypes}
            selectedLocations={selectedLocations}
            activeLocationType={activeLocationType}
            onLocationToggle={handleLocationToggle}
            onLocationTypeSelect={setActiveLocationType}
            onBack={goToPreviousStep}
            onNext={goToNextStep}
            nextLabel={getNextButtonLabel(2)}
          />
        )}
        
        {/* Step 3: Item Selection */}
        {currentStep === 3 && needsItems() && (
          <ItemSelector 
            items={items}
            itemCategories={itemCategories}
            selectedItems={selectedItems}
            activeItemCategory={activeItemCategory}
            onItemToggle={handleItemToggle}
            onItemCategorySelect={setActiveItemCategory}
            onBack={goToPreviousStep}
            onNext={goToNextStep}
          />
        )}
        
        {/* Step 4: Preview and Confirmation */}
        {currentStep === 4 && (
          <QueryPreview 
            query={generateQuery()}
            selectedOption={selectedOption}
            selectedLocations={selectedLocations}
            selectedItems={selectedItems}
            needsLocations={needsLocations()}
            needsItems={needsItems()}
            onBack={goToPreviousStep}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}