import React from "react";
import moment from "moment";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import { BottomNavigation } from "../components/BottomNavigation";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar } from "src/components/AppBar";
import { Meals } from "./Meals";
import { FoodLibrary } from "./FoodLibrary";
import { Recipes } from "./Recipes";
import { Authorization } from "./Authorization";
import { PrivacyPolicy } from "./PrivacyPolicy";
import { useUser } from "./context/userContext";
import { Profile } from "./Profile";
import { Pantry } from "./Pantry";
import { StoreProvider } from "../store";

const useStyles = makeStyles(() => ({
  childrenContainer: {
    minHeight: "85.5vh",
    overflow: "auto",
    backgroundColor: "#f5f5f5", // TODO: add to palette
  },
  childrenPadding: {
    display: "flex",
    flexDirection: "column",
  },
}));

export const Router = () => {
  const classes = useStyles();
  const { user } = useUser();

  // TODO: fix redirects to privacyPolicy
  return (
    <BrowserRouter>
      {/* Public routes*/}
      <Route path={"/auth"} component={Authorization} exact />
      <Route path={"/privacyPolicy"} component={PrivacyPolicy} exact />
      {!user ? (
        <Redirect to={"/auth"} />
      ) : (
        <Redirect to={`/ration/${moment().week()}`} />
      )}
      {/* Private routes*/}
      {user && (
        <StoreProvider>
          <AppBar />
          <main className={classes.childrenContainer}>
            <div className={classes.childrenPadding}>
              {/*<Route path={"/"} component={Summary} exact />*/}
              <Route path={"/ration/:weekNumber"} component={Meals} exact />
              <Route path={"/foodLibrary"} component={FoodLibrary} exact />
              <Route path={"/recipes"} component={Recipes} exact />
              <Route path={"/profile"} component={Profile} exact />
              <Route path={"/pantry"} component={Pantry} exact />
            </div>
          </main>
          <BottomNavigation />
        </StoreProvider>
      )}
    </BrowserRouter>
  );
};
