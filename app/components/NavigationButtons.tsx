type NavigationButtonsProps = {
  onBack: () => void;
  onNext: () => void;
  backLabel?: string;
  nextLabel?: string;
  backDisabled?: boolean;
  nextDisabled?: boolean;
};

const NavigationButtons = ({
  onBack,
  onNext,
  backLabel = "Retour",
  nextLabel = "Suivant",
  backDisabled = false,
  nextDisabled = false
}: NavigationButtonsProps) => {
  return (
    <div className="flex justify-between pt-4">
      <button
        onClick={onBack}
        disabled={backDisabled}
        className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {backLabel}
      </button>
      
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className="px-4 py-2 text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {nextLabel}
      </button>
    </div>
  );
};

export default NavigationButtons;