import { createContext, useEffect, useState } from "react";
import { useNavigate, useLocation  } from "react-router-dom";
import { getMininalProfile } from "../fetchAPI/fetchAccount";
import { useCookies } from 'react-cookie';

export const ShopContext = createContext();

 
const ShopContextProvider = (props) => {
    const navigate = useNavigate(); 
    const location = useLocation(); 
    
    const [cookies, setCookie, removeCookie] = useCookies(['username']);
    const [account, setAccount] = useState(cookies.username || null);
    const [curState, setCurState] = useState(cookies.username ? 'Login' : 'UnLogin');
    const [role, setRole] = useState(cookies.role);

    const [totalQuantityInCart, setTotalQuantityInCart] = useState(0);
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false)
    const [systemError, setSystemError] = useState('');
    
    /*----------------------------Thông tin tài khoản------------------------------------*/
    useEffect(() => {
        setAccount(cookies.username || null);
        setCurState(cookies.username ? 'Login' : 'UnLogin');
        setRole(cookies.role);
    }, [cookies.username, cookies.role]);

    useEffect(() => {
        setSystemError(""); 
      }, [location.pathname]);

          // Fetch cart data khi đăng nhập
    useEffect(() => {
        if (curState === 'Login') {
            const fetchCart = async () => {
                try {
                    const response = await getMininalProfile();
                    setTotalQuantityInCart(response.totalQuantityInCart || 0); // Cập nhật số lượng giỏ hàng từ API
                } catch (error) {
                    console.error("Lỗi tải giỏ hàng:", error);
                }
            };
            fetchCart();
        }
    }, [curState]); // Fetch khi trạng thái đăng nhập thay đổi

    const formatCurrency = (amount) => {
        return amount.toLocaleString('vi-VN', {
          style: 'currency',
          currency: 'VND',
        });
      };
      
    const totalAmount = (order) => {
        let sum = 0;
        order.listProduct.map((product) => {
            sum += (product.price * product.quantity);
        })
        return sum
    }

    const totalQuantity = (order) => {
        let total = 0;
        order.listProduct.map((product) => {
            total += product.quantity;
        })
        return total;
    }





    const value = {
        search, setSearch, showSearch, setShowSearch,
        navigate, location,
        curState, setCurState,
        account, setAccount,
        systemError, setSystemError,
        setTotalQuantityInCart, totalQuantityInCart,
        role, setRole,
        formatCurrency, totalAmount, totalQuantity
    }

    return (
        <ShopContext.Provider value = {value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;