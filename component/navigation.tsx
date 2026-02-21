import { Menu, X, Mail, Bell, User, Search } from 'lucide-react';
// import { setUser } from '../redux/slice/counter/counterSlice';
import type { RootState } from '../redux/store'; // Adjust the path if your store file is elsewhere
import { useSelector } from 'react-redux';



// Top Navigation Component
type TopNavbarProps = {
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
};

const TopNavbar = ({ onMenuToggle, isSidebarOpen }: TopNavbarProps) => {
  
  const user = useSelector((state: RootState) => state.user);


  return (
    <nav className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 h-16">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg text-black hover:bg-gray-100 lg:hidden"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="text-xl font-bold text-gray-800">NathRacker</div>
        </div>

        {/* Center section - Search */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8 ">
          <div className="relative w-full text-black">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 " size={16} />
            <input
              type="text"
              placeholder="Under development"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 pl-2 border-l border-gray-200">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-700">{user.username}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default TopNavbar;