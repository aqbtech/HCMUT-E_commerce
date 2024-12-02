import { createContext, useEffect, useState } from "react";
import { useNavigate, useLocation  } from "react-router-dom";
import Cookies from 'js-cookie'


export const ShopContext = createContext();

 
const ShopContextProvider = (props) => {
    const navigate = useNavigate(); 
    const location = useLocation(); 
    
    const [account, setAccount] = useState(Cookies.get('username') || null);
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false)
    const [curState, setCurState]  = useState('UnLogin')
    const [products, setProducts] = useState([]);
    const [systemError, setSystemError] = useState('');
    /*----------------------------Thông tin tài khoản------------------------------------*/
    useEffect(() => {
        const userId = Cookies.get('username') 
        if(userId) setCurState('Login');
        setAccount(userId);
    }, [Cookies.get('username')]);

    useEffect(() => {
        setSystemError(""); 
      }, [location.pathname]);


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
        products, setProducts,
        search, setSearch, showSearch, setShowSearch,
        navigate,
        curState, setCurState,
        account, setAccount,
        systemError, setSystemError,
        formatCurrency, totalAmount, totalQuantity
    }

    return (
        <ShopContext.Provider value = {value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;