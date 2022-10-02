import "./App.css";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
//In react-router-dom v6 Switch is replaced by Routes
//In react-router-dom v6 Redirect is replaced by Navigate
import AuthPage from "./Pages/Auth";
import EventPage from "./Pages/Event";
import BookingPage from "./Pages/Booking";
import MainNavigation from "./components/Navigation/MainNavigation";
import React from "react";
import AuthContext from "./context/auth-context";

class App extends React.Component {
  state = {
    token: null,
    userId: null,
  };
  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId });
  };
  logout = () => {
    this.setState({ token: null, userId: null });
  };
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              userId: this.state.userId,
              login: this.login,
              logout: this.logout,
            }}
          >
            <MainNavigation />
            <main className="main-content">
              <Switch>
                {/* {!this.state.token && (
                  <Redirect from="/" to="/auth" exact></Redirect>
                )}
                {this.state.token && (
                  <Redirect from="/" to="/events" exact></Redirect>
                )}
                {this.state.token && (
                  <Redirect from="/auth" to="/events" exact></Redirect>
                )}
                {!this.state.token && (
                  <Route path="/auth" component={AuthPage}></Route>
                )}
                <Route path="/events" component={EventPage}></Route>
                {this.state.token && (
                  <Route path="/bookings" component={BookingPage}></Route>
                )}
                 */}

                {this.state.token && <Redirect from="/" to="/events" exact />}
                {this.state.token && (
                  <Redirect from="/auth" to="/events" exact />
                )}
                {!this.state.token && (
                  <Route path="/auth" component={AuthPage} />
                )}
                <Route path="/events" component={EventPage} />
                {this.state.token && (
                  <Route path="/bookings" component={BookingPage} />
                )}
                {!this.state.token && <Redirect to="/auth" exact />}
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
