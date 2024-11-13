import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'


export const ShopContext = createContext();

 
const ShopContextProvider = (props) => {
    
    const currency = '$'
    const delivery_fee = 10;

    const [account, setAccount] = useState(null);

    const [search, setSearch] = useState('');

    const [showSearch, setShowSearch] = useState(false)

    const navigate = useNavigate(); 

    const [curState, setCurState]  = useState('UnLogin')

    const [products, setProducts] = useState([]);

    const [listProductToPlace, setListProductToPlace] = useState([])

    const [systemError, setSystemError] = useState('');
    /*----------------------------Thông tin tài khoản------------------------------------*/
    useEffect(() => {
        const userId = Cookies.get('username') 
        if(userId) setCurState('Login');
        setAccount(userId);
    }, [Cookies.get('username')]);

    

    /*----------------------------Cart ------------------------------------*/
    // useEffect(() => {
    //     const getCart = async () => {
    //         if(curState === "UnLogin") return;
    //         try {
    //             const response = await fetchCart(account.id);
    //             setCartItems(response);
    //             setIsCartLoaded(true);
    //             console.log("Lấy thành công giỏ hàng: ", cartItems.Items); 
    //         } catch (error) {
    //             console.error('Lỗi khi cập nhật giỏ hàng:', error);
    //             throw error;
    //         }
    //     }
    //     getCart();
    // }, [account, curState, isCartLoaded])
    


    // const addToCart = async (itemId, size, price) => {
    //     if(curState === "UnLogin") {
    //         navigate("/login");
    //         return;
    //     } 

    //     // Sao chép giỏ hàng hiện tại
    //     let cartData = structuredClone(cartItems);

    //     if (!size) {
    //         toast.error('Select size please!');
    //         return;
    //     }

    //     // Cập nhật số lượng sản phẩm theo kích thước
    //     if (cartData) {
    //         const itemIndex = cartData.Items.findIndex(item => item.id === itemId);

    //         if (itemIndex !== -1) {
    //             // Nếu sản phẩm đã tồn tại trong giỏ hàng
    //             const sizeIndex = cartData.Items[itemIndex].sizes.findIndex(s => s.size === size);

    //             if (sizeIndex !== -1) {
    //                 // Nếu kích thước đã tồn tại, cập nhật số lượng
    //                 cartData.Items[itemIndex].sizes[sizeIndex].quantity += 1;
    //             } else {
    //                 // Nếu kích thước chưa tồn tại, thêm kích thước mới
    //                 cartData.Items[itemIndex].sizes.push({ size, quantity: 1, price });
    //             }
    //         } else {
    //             // Nếu sản phẩm chưa tồn tại trong giỏ hàng, thêm sản phẩm mới
    //             cartData.Items.push({
    //                 id: itemId,
    //                 sizes: [{ size, quantity: 1, price }]
    //             });
    //         }
    //     } else {
    //         // Nếu chưa có giỏ hàng cho người dùng, khởi tạo giỏ hàng mới
    //         cartData = {
    //             id: account.id,
    //             Items: [{
    //                 id: itemId,
    //                 sizes: [{ size, quantity: 1, price }]
    //             }]
    //         };
    //     }

    //     setCartItems(cartData);

    //     try {
    //         await updateCart(cartData, account.id); // Gửi dữ liệu đã định dạng lên server
    //     } catch (error) {
    //         console.error("Error updating cart:", error);
    //         toast.error('Cập nhật giỏ hàng thất bại.');
    //     }

    // };


    // // Tính số lượng đang có giỏ hàng hiện tại
    // const getCartCount = () => {
    //     if(curState === "UnLogin") return 0;
    //     let totalCount = 0;
    //     // Kiểm tra nếu cartItems có dữ liệu
    //     if (cartItems && cartItems.Items) {
    //         console.log("Lấy để tính số lượng",cartItems.Items);
    //         const items = cartItems.Items; // Lấy danh sách Items
    //         for (const item of items) { // Duyệt qua Items
    //             for (const size of item.sizes) { // Duyệt qua sizes của mỗi item
    //                 totalCount += size.quantity; // Cộng tổng số lượng
    //             }
    //         }
    //     }
    //     return totalCount;
    // }


    // useEffect(() => {
    //     const count = getCartCount();
    //     console.log("Số lượng trong giỏ hàng:", count);
    // }, [cartItems, curState, cartItems]);



    // // Cập nhật số lượng trong giỏ hàng và đồng bộ với server
    // const updateQuantity = async (itemId, size, quantity) => {
    //     // Tạo một bản sao của cartItems để tránh thay đổi trực tiếp
    //     let cartData = structuredClone(cartItems);
    
    //     // Kiểm tra xem giỏ hàng có đồ không
    //     if (cartData) {
    //         // Cập nhật số lượng cho sản phẩm tương ứng
    //         const itemIndex = cartData.Items.findIndex(item => item.id === itemId);
    
    //         if (itemIndex !== -1) {
    //             const sizeIndex = cartData.Items[itemIndex].sizes.findIndex(s => s.size === size);
    
    //             if (sizeIndex !== -1) {
    //                 if (quantity > 0) {
    //                     // Nếu số lượng lớn hơn 0, cập nhật giá trị mới
    //                     cartData.Items[itemIndex].sizes[sizeIndex].quantity = quantity;
    //                 } else {
    //                     // Nếu số lượng bằng 0, xóa kích thước đó khỏi sản phẩm
    //                     cartData.Items[itemIndex].sizes.splice(sizeIndex, 1);
    //                     // Nếu không còn kích thước nào, xóa sản phẩm đó khỏi giỏ hàng
    //                     if (cartData.Items[itemIndex].sizes.length === 0) {
    //                         cartData.Items.splice(itemIndex, 1);
    //                     }
    //                 }
    //             }
    //         } else {
    //             console.warn("Sản phẩm không tồn tại trong giỏ hàng");
    //         }
    //     }
    
    //     // Cập nhật giỏ hàng cục bộ
    //     setCartItems(cartData);
    
    //     // Đồng bộ giỏ hàng lên server
    //     const formattedCartData = {
    //         id: account.id, // ID của người dùng
    //         Items: cartData.Items.map(item => ({
    //             id: item.id,
    //             sizes: item.sizes.map(s => ({
    //                 size: s.size,
    //                 quantity: s.quantity,
    //                 price: s.price
    //             }))
    //         }))
    //     };
    //     try {
    //         await updateCart(formattedCartData, account.id); // Hàm gọi API để cập nhật giỏ hàng trên server
    //     } catch (error) {
    //         console.error("Lỗi khi cập nhật giỏ hàng:", error);
    //         toast.error("Cập nhật giỏ hàng thất bại.");
    //     }
    // };


    // //Tính tổng tiền giỏ hàng
    // const getCartAmount = () => {
    //     let totalAmount = 0;
    
    //     // Kiểm tra nếu cartItems có dữ liệu
    //     if (cartItems.Items) {
    //         const items = cartItems.Items; // Lấy danh sách Items
    //         for (const item of items) { // Duyệt qua Items
    //             const itemInfo = products.find((product) => product.id === item.id); // Tìm thông tin sản phẩm
    
    //             if (itemInfo) { // Nếu sản phẩm tồn tại
    //                 for (const size of item.sizes) {
    //                     totalAmount += itemInfo.price * size.quantity; 
    //                 }
    //             }
    //         }
    //     }
    
    //     return totalAmount;
    // }



    //------------------------------------------Đặt hàng----------------------------






    const value = {
        products, currency, delivery_fee, setProducts,
        search, setSearch, showSearch, setShowSearch,
        // cartItems, addToCart, 
        // getCartCount, updateQuantity, getCartAmount, 
        navigate,
        curState, setCurState,
        account, setAccount,
        listProductToPlace, setListProductToPlace,
        systemError, setSystemError 
    }

    return (
        <ShopContext.Provider value = {value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;