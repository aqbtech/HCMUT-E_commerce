import { Routes, Route } from 'react-router-dom'
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { useContext } from 'react';
import { ShopContext } from './context/ShopContext.jsx';
import ProtectedRoute from './components/ProtectedRoute .jsx';


import Home from './pages/Home'
import Search from './pages/SearchPage'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from "./pages/Product"
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Order from './pages/Orders'
import Navbar from '../src/components/global/Navbar'
import Footer from '../src/components/homePage/Footer'
import Test from './pages/Test';
import Regist from './pages/Regist';
import Admin from './pages/Admin'
import ShopView from './pages/ShopView';
import MyProfile from './pages/MyProfile';
import ResetPassword from './pages/ResetPassword';
import ShopManagement from "./pages/ShopManagement.jsx";
import Error_403 from "./components/Error403.jsx"
import NotFound from "../src/components/NotFound";
import ReviewPage from './pages/ReviewPage';
import RegistSeller from './pages/RegistSeller.jsx';
import FakeAPI from './pages/FakeAPI.jsx';
import Payment from './pages/Payment.jsx';



const App = () => {
  const { role, curState } = useContext(ShopContext); 
  const isAuthenticated = curState === 'Login';

  return (
    <div className='bg-[#FDF0E7] min-h-screen flex flex-col'>
      <div className='flex-grow flex flex-col px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <ToastContainer/>
        <Navbar/>
        <div className="flex-grow">
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path = '/search' element={<Search />}></Route>
            <Route path = '/about' element={<About />}></Route>
            <Route path='/contact' element={<Contact />}></Route>
            <Route path='/product/:productId' element={<Product />}></Route>
            <Route path='/RegistSeller' element={<RegistSeller/>}></Route>
            <Route path='/Error_403'  element={<Error_403/>}></Route>
            <Route path='/test' element={<Test />}></Route>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/regist' element={<Regist />}></Route>
            <Route path='/shopView/:shopId' element={<ShopView />}></Route>
            <Route path='/reset' element={<ResetPassword/>}></Route>

            <Route
              path='/cart'
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  allowedRoles={['BUYER']}
                  userRole={role}
                >
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path='/orders'
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  allowedRoles={['BUYER']}
                  userRole={role}
                >
                  <Order />
                </ProtectedRoute>
              }
            />
            <Route
              path='/myProfile'
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  allowedRoles={['BUYER']}
                  userRole={role}
                >
                  <MyProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path='/place-order'
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  allowedRoles={['BUYER']}
                  userRole={role}
                >
                  <PlaceOrder />
                </ProtectedRoute>
              }
            />
            <Route
              path='/review'
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  allowedRoles={['BUYER']}
                  userRole={role}
                >
                  <ReviewPage/>
                </ProtectedRoute>
              }
            />
            <Route
              path='/payment'
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  allowedRoles={['BUYER']}
                  userRole={role}
                >
                  <Payment/>
                </ProtectedRoute>
              }
            />
            
            <Route
              path='/admin'
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  allowedRoles={['ADMIN']}
                  userRole={role}
                >
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path='/FakeAPI'
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  allowedRoles={['ADMIN']}
                  userRole={role}
                >
                  <FakeAPI/>
                </ProtectedRoute>
              }
            />

            <Route
              path='/shop'
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  allowedRoles={['SELLER']}
                  userRole={role}
                >
                  <ShopManagement/>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer/>
      </div>
    </div>
  )
}

export default App
