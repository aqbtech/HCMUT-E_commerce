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
import SearchBar from '../src/components/global/SearchBar'
import Test from './pages/Test';
import Regist from './pages/Regist';
import Admin from './pages/Admin'
import Shop from './pages/Shop';
import MyProfile from './pages/MyProfile';


const App = () => {
  return (
    <div className='bg-[#FDF0E7]'>
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer/>
      <Navbar/>
      <SearchBar/>
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
        <Route path='/shop/:shopId' element={<Shop />}></Route>
        <Route path='/myProfile' element={<MyProfile />}></Route>
      </Routes>
      <Footer/>
    </div>
  </div>
    
  )
}

export default App
