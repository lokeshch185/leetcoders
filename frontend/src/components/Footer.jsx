import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="w-full bg-gray-800 text-white py-8 lg:p-4 p-2">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between">
        <div className='mr-4'>
          <h4 className="text-lg font-semibold mb-4">About the Platform</h4>
          <p className="text-gray-400 pb-2">
            The platform is made for learning purposes. It utilises leetcode's graphql queries and publically available data to provide the features. It has no commercial benifits and does not encourage it's users to share any of their personal information.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Connect with Developer</h4>
          <div className="flex space-x-4">
            <a href="mailto:lokeshchaudhari14@gmail.com" target="_blank" rel="noopener noreferrer" aria-label="Email" className="text-gray-400 hover:text-blue-300">
              <FontAwesomeIcon icon={faGoogle} />
            </a>

            <a href="https://linkedin.com/in/lokeshch18" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-400 hover:text-blue-300">
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
            <a href="https://github.com/lokeshch185" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-gray-400 hover:text-blue-300">
              <FontAwesomeIcon icon={faGithub} />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-6 text-center text-gray-400 text-md">
        Made with <span className="text-red-500">♥</span> by{" "}
        <a
          href="https://www.lokcode.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-300 hover:underline"
        >
          Lokesh Chaudhari
        </a>
      </div>
    </footer>
  );
};

export default Footer;
