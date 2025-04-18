import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";

//import Users from "./user/pages/Users";
//import Home from "./home/pages/Home";
//import Auth from "./user/pages/Auth";
//import UserProfile from "./membership/pages/UserProfile";
//import Training from "./training/pages/Training";
//import ValLeague from "./League/pages/ValLeague";
//import Tournaments from "./admin/pages/Tournaments";
//import Games from "./admin/pages/Games";
//import Membership from "./admin/pages/Membership";
//import AddUserByAdmin from "./admin/pages/AddUserByAdmin";

const Users = React.lazy(() => import("./user/pages/Users"));
const Home = React.lazy(() => import("./home/pages/Home"));
const Auth = React.lazy(() => import("./user/pages/Auth"));
const UserProfile = React.lazy(() => import("./membership/pages/UserProfile"));
const Training = React.lazy(() => import("./training/pages/Training"));
const ValLeague = React.lazy(() => import("./League/pages/ValLeague"));
const Tournaments = React.lazy(() => import("./admin/pages/Tournaments"));
const Games = React.lazy(() => import("./admin/pages/Games"));
const Membership = React.lazy(() => import("./admin/pages/Membership"));
const AddUserByAdmin = React.lazy(() => import("./admin/pages/AddUserByAdmin"));
const AddTrainingByAdmin = React.lazy(() =>
  import("./admin/pages/AddTrainingByAdmin")
);

const App = () => {
  const { token, login, logout, userId, isAdmin } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/players" exact>
          <Users />
        </Route>
        <Route path="/trainings" exact>
          <Training />
        </Route>
        <Route path="/league" exact>
          <ValLeague />
        </Route>
        <Route path="/profile/:userId" exact>
          <UserProfile />
        </Route>
        <Route path="/admin/players" exact>
          <AddUserByAdmin />
        </Route>
        <Route path="/admin/membership" exact>
          <Membership />
        </Route>
        <Route path="/admin/tournaments" exact>
          <Tournaments />
        </Route>
        <Route path="/admin/matches" exact>
          <Games />
        </Route>
        <Route path="/admin/statistics" exact>
          <Users />
        </Route>
        <Route path="/admin/trainings" exact>
          <AddTrainingByAdmin />
        </Route>
        <Route path="/admin/settings" exact>
          <Users />
        </Route>
        <Route path="/addUser" exact>
          <Home />
        </Route>

        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/players" exact>
          <Users />
        </Route>
        <Route path="/league" exact>
          <ValLeague />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isAdmin: isAdmin,
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner></LoadingSpinner>
              </div>
            }
          >
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
