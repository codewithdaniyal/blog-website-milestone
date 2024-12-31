import Link from "next/link";

const Header = () => {
  return (
    <header className="w-full h-16 shadow-md sticky top-0 bg-white z-50 px-6">
      <div className="max-w-6xl h-full mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-extrabold text-gray-800 hover:text-primaryColor transition-colors duration-300">
          CryptoBlog
        </Link>

        {/* Navigation */}
        <nav>
          <ul className="flex gap-6 text-sm font-medium text-gray-600">
            <li>
              <Link href="/" className="hover:text-primaryColor transition-colors duration-300">
                Home
              </Link>
            </li>
          </ul>
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {/* Profile */}
          <div className="flex items-center gap-2">
            <img
              className="w-8 h-8 rounded-full border border-gray-300"
              src="/images/1712191779774.jpeg"
              alt="User Avatar"
            />
            <span className="text-sm font-medium text-gray-700">Welcome Back!</span>
          </div>

          {/* Sign-In Button */}
          <button className="text-sm font-semibold border border-gray-300 hover:border-primaryColor px-4 py-1 rounded-md transition-all duration-300 hover:text-white hover:bg-primaryColor">
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
