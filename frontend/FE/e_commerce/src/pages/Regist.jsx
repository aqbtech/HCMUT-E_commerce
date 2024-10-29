import {useContext, useState} from 'react'
import { ShopContext } from '../context/ShopContext'
import {Link} from 'react-router-dom'
import axios from 'axios';
import { createAccount } from '../../fetchAPI/fetchAccount';


const Regist = () => {
  const {navigate, setCurState} = useContext(ShopContext);

  //giá trị 
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [email, setEmail] = useState(''); 
  const [hovatendem, setHovatendem] = useState('');
  const [ten, setTen] = useState('');
  const [sdt, setSdt] = useState('');
  const [date, setDate] = useState('');


  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (pass !== confirmPass) {
      alert("Mật khẩu xác nhận không khớp");
      return;
    }

    const newUser = await createAccount(id, pass, email, hovatendem, ten, sdt, date);

    if (newUser) {
      navigate('/login');
    }
  }  

  return (
    <div>
      <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800' action="">
        <div className='inline-flex items-center gap-2 mb-2 mt-10'>
          <p className='prata-regular text-3xl'>Đăng ký</p>
          <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
        </div>
        <input type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Tài khoản' value={id} onChange={(e) => setId(e.target.value)}/>
        <input type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Mật khẩu' value={pass} onChange={(e) => setPass(e.target.value)}/>
        <input type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Nhập lại mật khẩu' value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)}/>
        <input type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='E-mail' value={email} onChange={(e) => setEmail(e.target.value)}/>
        <div className='flex gap-3'>
            <input className='border border-gray-300  rounded py-1.5 px-3.5 w-full' type="text" placeholder='Họ và tên đệm' value={hovatendem} onChange={(e) => setHovatendem(e.target.value)}/>
            <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Tên'value={ten} onChange={(e) => setTen(e.target.value)}/>
        </div>
        <input type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Số điện thoại' value={sdt} onChange={(e) => setSdt(e.target.value)}/>
        <input type="date" className='w-full px-3 py-2 border border-gray-800' placeholder='Ngày-tháng-năm sinh' value={date} onChange={(e) => setDate(e.target.value)}/>

        <div className='w-full flex justify-between text-sm mt-[-8px]'>
          {
            <Link to='/Login'><p className='cursor-pointer hover:text-black hover:underline'>Bạn đã có tài khoản?</p></Link>
          }
        </div>
        <button type="submit" className='bg-black text-white font-light px-8 py-2 mt-4'>Đăng ký</button>
      </form>

    </div>
  )
}
 
export default Regist
