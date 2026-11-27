import { Link } from "react-router-dom";

function Navbar(){

    const token =
    localStorage.getItem("token");
    return(

        <nav>
            <Link to="/">
        Home
      </Link>

      {token ? (
        <>
        <Link to="/">Home</Link>

            <Link to="/dashboard">
                Dashboard
            </Link>

            {" | "}

            <Link to="/inventory">
                Inventory
            </Link>

            {" | "}

            <button
            onClick={() => {

              localStorage.removeItem(
                "token"
              );

              window.location.reload();
            }}
          >
            Logout
          </button>
        </>
        ) : (
   <>
   <Link to="/login">
            Login
          </Link>

          <Link to="/signup">
            Signup
          </Link>

          <Link to="/otp-login">
            OTP Login
          </Link>
           
            <Link to="/orders">
                Orders
            </Link>
        </>

)}
        </nav>
    );
}

export default Navbar;