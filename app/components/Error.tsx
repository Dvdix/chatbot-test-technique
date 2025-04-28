type ErrorMessageProps = {
    message: string;
    onClose: () => void;
  };
  
  const ErrorMessage = ({ message, onClose }: ErrorMessageProps) => (
    <div className="text-center text-red-500">
      <p>Erreur: {message}</p>
      <button 
        onClick={onClose}
        className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
      >
        Fermer
      </button>
    </div>
  );

  export default ErrorMessage