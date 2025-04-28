// Helper Components
type LoadingSpinnerProps = {
    text?: string;
  };
  
const LoadingSpinner = ({ text = 'Chargement...' }: LoadingSpinnerProps) => (
    <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-gray-600">{text}</span>
    </div>
);

export default LoadingSpinner