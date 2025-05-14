export default (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-gray-100 p-5 rounded-lg shadow-lg w-full max-w-lg">
            <button
              onClick={toggleModal}
              className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
            <SignIn />
          </div>
        </div>)