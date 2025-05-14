const LoadingBar = () => {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-blue-300 h-12 w-12"></div>
        <style>
          {`
            .loader {
              border-top-color: #f6ad55;
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  };
  
  export default LoadingBar;
  