import "./App.css";
import React, { useEffect, useState } from "react";

import WebFont from "webfontloader";

import { store } from "./store/store";
import { Provider } from "react-redux";
import AppRouter from "./AppRouter";

const App = () => {

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
   
  }, []);

  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
};

window.addEventListener("contextmenu", (e) => e?.preventDefault())

export default App;

//  <Router>
// <Layout>
// <Routes>
//   <Route path="/" element={<Home />} />
// </Routes>
// </Layout>
// </Router>
