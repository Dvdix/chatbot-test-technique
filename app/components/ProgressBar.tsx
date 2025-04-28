type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
};

const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  const progress = (currentStep / totalSteps) * 100;
  
  // Generate stepped progress elements
  const steps = [];
  for (let i = 1; i <= totalSteps; i++) {
    steps.push(
      <div 
        key={i}
        className={`h-1.5 flex-1 rounded-full ${
          i <= currentStep 
            ? 'bg-indigo-600' 
            : 'bg-gray-200'
        }`}
      />
    );
  }
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-1 mb-1">
        {steps}
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>Étape {currentStep} sur {totalSteps}</span>
        <span>{Math.round(progress)}%</span>
      </div>
    </div>
  );
};

export default ProgressBar;