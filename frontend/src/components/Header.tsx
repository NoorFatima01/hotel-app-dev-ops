import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import SignOutButton from "./SignOutButton";

const Header = () => {
  const { isLogged } = useAppContext();

  return (
    <div className="bg-[#3b1eaf] py-6">
      <div className="container mx-auto flex justify-between">
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link to="/">MernHolidays.com</Link>
        </span>
        <span className="flex space-x-2">
          {isLogged ? (
            <>
              {/* <Link
                to="/my-bookings"
                className="flex items-center text-white px-3 font-bold hover:bg-[#2c1eaf]"
              >
                My Bookings
              </Link> */}

              <Link
                to="/my-hotels"
                className="flex items-center text-white px-3 font-bold hover:bg-[#2c1eaf]"
              >
                My Hotels
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              to="/sign-in"
              className="flex bg-white items-center text-blue-600 px-3 font-bold hover:bg-gray-300"
            >
              Sign In
            </Link>
          )}
        </span>
      </div>
    </div>
  );
};

export default Header;
