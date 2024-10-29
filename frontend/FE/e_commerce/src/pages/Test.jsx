import axios from 'axios'
import React, { useContext, useState, useEffect} from 'react'
import ProductTestItem from '../components/ProductTestItem'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'

 

const Test = () => {

    const [page, setPage] = useState(1);
    const [products, setProducts] = useState([]);
    const api = 'http://localhost:3000/products'

    const getProduct = async (pageNumber) => {
        try {
            const response = await axios.get(api + `?_page=${pageNumber}&_limit=10`);
            setProducts(response.data);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    }


    useEffect(() =>{
        getProduct(page);
    }, [page]);


    const createProduct = async () => {
        try {
            const response = await axios.post(api, {
                "_id": "baaaa",
                "name": "dumama",
                "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
                "price": 100,
                "image": [
                    "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lwxoz5gn0bmjbd.webp", 
                    "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lwxoz5gn5xwb6f.webp",
                    "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lvmt7gpmhfkh91.webp"
                ],
                "category": "Women",
                "subCategory": "Topwear",
                "sizes": ["S", "M", "L"],
                "date": 1716634345448,
                "bestseller": true
            });
    
            console.log('Product created:', response.data);
            setProducts([...products, response.data]); 
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };
    

    const updateProduct = async (id, val) => {
        try {
            const response = await axios.patch(`${api}/${id}`, { name: val });
            setProducts(products.map(item => item.id === id ? { ...item, name: val } : item)); // Cập nhật products ngay lập tức
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };
    

    const deleteProduct = async (id) => {
        try {
            await axios.delete(`${api}/${id}`);
            setProducts(products.filter(item => item.id !== id)); // Cập nhật products ngay lập tức
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };
    
    const PrevNavi = () => {
        if (page > 1) {
            setPage(prev => prev - 1); 
        }
    };

    const NextNavi = () => {
        if (page < 7) {
            setPage(prev => prev + 1); // Tăng số trang lên 1
        }
    };




    return (
        <div>
           <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
                {/* Left */}
                <div onClick={()=>createProduct()}  className='cursor-pointer border border-gray-300 pl-5 py-3 mt-6 w-48 h-auto self-start'> {/* Thêm self-start */}
                    <div className='flex flex-col gap-2 text-sm font-light text-gray-700 p-3'>
                    <p className='flex gap-2'>
                        Thêm sản phẩm 
                        <img src={assets.plus} className=" w-5" alt="" />
                    </p>
                    </div>
                </div>

                {/* Right */}
                <div className='w-[70%]'>
                        <Title text1={"List"} text2={"Product"}/>
                        {
                            products.map((item, index) => (
                                <div key={index} className='flex gap-2'>
                                    <ProductTestItem name={item.name} price={item.price} image={item.image} />
                                    <div className='flex gap-2'>
                                        <button onClick={() => deleteProduct(item.id)} className='p-5 m-3 border-2 border-gray-300 hover:border-gray-700'>xóa</button>
                                        <button onClick={() => updateProduct(item.id, "chinhtran")} className='p-5 m-3 border-2 border-gray-300 hover:border-gray-700'>sửa</button>
                                    </div>
                                </div>
                                
                            ))
                        }
                </div>
            </div>    
            <li className='flex justify-center items-center gap-4 my-4'>
                <ul onClick={()=>PrevNavi()} className='cursor-pointer border border-gray-300 p-2 rounded hover:bg-gray-200 transition duration-300'>
                    Prev
                </ul>
                <ul className='cursor-pointer border border-gray-300 p-2 rounded hover:bg-gray-200 transition duration-300'>
                    {page}
                </ul>
                <ul onClick={()=>NextNavi()} className='cursor-pointer border border-gray-300 p-2 rounded hover:bg-gray-200 transition duration-300'>
                    Next
                </ul>
            </li>
        </div>
    
  )
}

export default Test
