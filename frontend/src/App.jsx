import { Routes, Route } from 'react-router-dom'
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

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
//import ShopManage from './pages/ShopManage';
import ResetPassword from './pages/ResetPassword';
import NotFound from "../src/components/NotFound";


const App = () => {
  return (
    <div className='bg-[#FDF0E7]'>
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <ToastContainer/>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path = '/search' element={<Search />}></Route>
          <Route path = '/about' element={<About />}></Route>
          <Route path='/contact' element={<Contact />}></Route>
          <Route path='/product/:productId' element={<Product />}></Route>
          <Route path='/cart' element={<Cart />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/place-order' element={<PlaceOrder />}></Route>
          <Route path='/orders' element={<Order />}></Route>
          <Route path='/test' element={<Test />}></Route>
          <Route path='/admin' element={<Admin />}></Route>
          <Route path='/regist' element={<Regist />}></Route>
          <Route path='/shopView/:shopId' element={<ShopView />}></Route>
          <Route path='/myProfile' element={<MyProfile />}></Route>
          {/* <Route path='/shop' element={<ShopManage/>}></Route> */}
          <Route path='/reset' element={<ResetPassword/>}></Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer/>
      </div>
    </div>
  )
}

export default App
