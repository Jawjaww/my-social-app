export const handleError = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message; // Return the error message if it's an instance of Error
    }
    return "Une erreur inconnue s'est produite."; // Default error message
  };