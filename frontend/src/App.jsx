// frontend/src/App.jsx

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navigation from "./components/Navigation/Navigation";
import * as sessionActions from "./store/session";
import { ModalProvider, Modal } from "./context/Modal";

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded ? <Outlet /> : <h1>Loading...</h1>}
      <Modal /> { }
    </>
  );
}


const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [{ index: true, element: <h1>Welcome!</h1> }],
  },
]);

function App() {
  return (
    <ModalProvider>
      <RouterProvider router={router} />
      <Modal /> { }
    </ModalProvider>
  );
}

export default App;
