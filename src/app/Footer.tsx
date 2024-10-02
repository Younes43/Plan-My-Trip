const Footer = () => {
  return (
    <footer className="bg-sky-900 bg-opacity-5 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 text-center md:text-left mb-4 md:mb-0">
            <h2 className="text-lg font-bold">Plan My Trip</h2>
            <p className="mt-2 text-sky-200">Plan your perfect trip with AI assistance</p>
          </div>
          <div className="w-full md:w-1/3 text-center mb-4 md:mb-0">
            <h3 className="text-lg font-bold mb-2">Quick Links</h3>
            <ul className="flex justify-center space-x-4">
              <li><a href="/" className="hover:text-sky-200 transition-colors duration-300">Home</a></li>
              <li><a href="/about" className="hover:text-sky-200 transition-colors duration-300">About</a></li>
              <li><a href="/contact" className="hover:text-sky-200 transition-colors duration-300">Contact</a></li>
            </ul>
          </div>
          <div className="w-full md:w-1/3 text-center md:text-right">
            <h3 className="text-lg font-bold mb-2">Connect With Us</h3>
            <div className="flex justify-center md:justify-end space-x-4">
              <a href="#" className="hover:text-sky-200 transition-colors duration-300">Facebook</a>
              <a href="#" className="hover:text-sky-200 transition-colors duration-300">Twitter</a>
              <a href="#" className="hover:text-sky-200 transition-colors duration-300">Instagram</a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sky-200">
          <p>&copy; 2024 Plan My Trip. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;