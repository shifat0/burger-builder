import { Outlet, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Header from "./Header/Header";
import BurgerBuilder from "./BurgerBuilder/BurgerBuilder";
import Orders from "./Orders/Orders";
import Checkout from "./Orders/Checkout/Checkout";
import Auth from "./Auth/Auth";
import { connect } from "react-redux";
import { authCheck } from "../redux/authActions";

const mapStateToProps = (state) => {
  return { token: state.token };
};

const mapDispatchToProps = () => {
  return (dispatch) => {
    return {
      authCheck: () => dispatch(authCheck()),
    };
  };
};

const Main = ({ token, authCheck }) => {
  authCheck();
  const navigate = useNavigate();

  const getToken = localStorage.getItem("token");

  return (
    <div>
      <Header />
      <div className="container">
        <Routes>
          <Route element={getToken ? <Outlet /> : <Navigate to="/login" />}>
            <Route path="/" element={<BurgerBuilder />} />
            <Route path="/orders" element={<Orders />} />
            <Route
              path="/checkout"
              element={<Checkout navigate={navigate} />}
            />
          </Route>
          <Route path="/login" element={<Auth navigate={navigate} />} />
        </Routes>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
