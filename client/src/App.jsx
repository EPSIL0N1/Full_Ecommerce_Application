// Start from 1 : 18 : 40

import { Routes, Route } from "react-router-dom"
import AuthLayout from "./components/auth/layout"
import AuthLogin from "./pages/auth/login"
import AuthRegister from "./pages/auth/register"
import AdminDashboard from "./pages/admin-view/dashboard"
import AdminProducts from "./pages/admin-view/products"
import AdminOrders from "./pages/admin-view/orders"
import AdminFeatures from "./pages/admin-view/features"
import AdminLayout from "./components/admin-view/layout"
import ShoppingLayout from "./components/shopping-view/layout"
import NotFound from "./pages/not-found"
import ShoppingHome from "./pages/shopping-view/home"
import ShoppingListing from "./pages/shopping-view/listing"
import ShoppingCheckout from "./pages/shopping-view/checkout"
import ShoppingAccount from "./pages/shopping-view/account"
import CheckAuth from "./components/common/check-auth"
import UnauthPage from "./pages/unauth-page"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { checkAuth } from "./store/auth-slice"
import { Skeleton } from "@/components/ui/skeleton"

function App() {

  // const isAuthenticated = false;
  // const user = null;

  const {user, isAuthenticated, isLoading} = useSelector(state => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch])

  if (isLoading) return <Skeleton className="w-[600px] h-[600px] rounded-full" />

  return (
    
    <div className="flex flex-col overflow-hidden bg-white">

        <Routes>

          <Route path="/auth" element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout/>
            </CheckAuth>
          }>

              <Route path="login" element={<AuthLogin/>}/>
              <Route path="register" element={<AuthRegister/>}/>

          </Route>

          <Route path="/admin" element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout/>
            </CheckAuth>
          }>

              <Route path="dashboard" element={<AdminDashboard/>}/>
              <Route path="products" element={<AdminProducts/>}/>
              <Route path="orders" element={<AdminOrders/>}/>
              <Route path="features" element={<AdminFeatures/>}/>

          </Route>

          <Route path="/shop" element={

            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout/>
            </CheckAuth>

          }>

              <Route path="home" element={<ShoppingHome/>}/>
              <Route path="listing" element={<ShoppingListing/>}/>
              <Route path="checkout" element={<ShoppingCheckout/>}/>
              <Route path="account" element={<ShoppingAccount/>}/>

          </Route>

          <Route path="*" element={<NotFound/>}></Route>
          <Route path="/unauth-page" element={<UnauthPage/>}></Route>

        </Routes>

    </div>
    
  )
}

export default App