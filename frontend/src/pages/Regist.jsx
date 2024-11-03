import {useContext, useState} from 'react'
import { ShopContext } from '../context/ShopContext'
import {Link} from 'react-router-dom'
import { register } from '../fetchAPI/fetchAccount';
import { toast } from 'react-toastify';


const Regist = () => {
  const {navigate} = useContext(ShopContext);

  //giá trị 
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [email, setEmail] = useState(''); 
  const [hovatendem, setHovatendem] = useState('');
  const [ten, setTen] = useState('');
  const [sdt, setSdt] = useState('');
  const [date, setDate] = useState('');

  const [isLoading, setIsLoading] = useState(false);
 
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (pass !== confirmPass) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    if(id.length === 0 || id.pass === 0 || id.confirmPass === 0 || id.email === 0 || id.hovatendem === 0 || id.ten === 0 
        ||  id.sdt === 0 ||id.date === 0 ) {
      toast.error("Dữ liệu còn trống!");
      return;
    }

    if(isLoading === true)  return;

    const value = {
      "username" : id,
      "password" : pass,
      "email" : email,
      "hovatendem" : hovatendem,
      "ten" : ten,
      "phone" : sdt,
      "DOB" : date
    }
    
    await register(value)
    .then(() => {
      toast.success('Đăng kí thành công!')
      setIsLoading(false);
      navigate('/login');
    })
    .catch((error) => {
      console.log("Lỗi đăng kí:", error)
      toast.error("Lỗi đăng kí");
      setIsLoading(false);
      throw error
    })
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
        <button type="submit" className='bg-black text-white font-light px-8 py-2 mt-4'>{isLoading ? '...Loading' : 'Đăng ký'}</button>
      </form>

    </div>
  )
}
 
export default Regist
