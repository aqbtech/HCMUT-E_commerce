import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'
import { fetchCategory } from '../../fetchAPI/fetchCategory'

const Collection = () => {
  const {products, search, showSearch, isProductsLoaded, categories } = useContext(ShopContext)
  const [showFilter, setShowFilter] = useState(false)
  const [filterProducts, setFilterProducts] = useState([])
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState([]);

   
   

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setCategory(prev => [...prev, e.target.value])
    }
  };

  // const toggleCategory = (e) => {
  //   if(category.includes(e.target.value)) {
  //     setCategory(prev => prev.filter(item => item !== e.target.value))
  //   }
  //   else {
  //     setCategory(prev => [...prev, e.target.value])
  //   }
  // }
   
  const toggleSubCategory  = (e) => {
    if(subCategory.includes(e.target.value)) {
      setSubCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setSubCategory(prev => [...prev, e.target.value])
    }
  }

  useEffect(() => {
    console.log("Products updated:", products);
}, [products]);

  const applyFilter = () => {
    let productsCopy = products.slice();

    if(showSearch && search){
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }

    if(category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category))
    }

    if(subCategory.length > 0) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory))
    }

    setFilterProducts(productsCopy);
  }

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case 'low-high' :
        setFilterProducts(fpCopy.sort((a,b) => (a.price-b.price)));
        break;
      
      case 'high-low' :
        setFilterProducts(fpCopy.sort((a,b) => (b.price-a.price)));
        break;

      default: 
        applyFilter();
        break;
    }
  };

  useEffect(() =>{
    sortProduct();
  }, [sortType]) 


  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch])

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      {/*filter options */}
      <div className='min-w-60'>
        <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTER
            <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.arrow} alt="" />
        </p>
        
        {/* Category Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700 '>
            {categories.map((cat) => (
              <p key={cat.id} className='flex gap-2'>
                <input className='w-3' type="checkbox" value={cat.name} onChange={toggleCategory} />{cat.name}
              </p>
            ))}
          </div>
        </div>
        {/* SubCategpry filter */}
        <div className={`border border-gray-300 pl-5 py-3 my-6 ${showFilter ? '' : 'hidden'} sm:block`}>
            <p className='mb-3 text-sm font-medium'>TYPE</p>
            <div className='flex flex-col gap-2 text-sm font-light text-gray-700 '>
              <p className='flex gap-2'>
                <input className='w-3' type="checkbox" value={'Topwear'} onChange={toggleSubCategory}/>Topwear
              </p>
              <p className='flex gap-2'>
                <input className='w-3' type="checkbox" value={'Bottomwear'} onChange={toggleSubCategory}/>BottomWear
              </p>
              <p className='flex gap-2'>
                <input className='w-3' type="checkbox" value={'Winterwear'} onChange={toggleSubCategory}/>WinterWear
              </p>
            </div>
          </div>
      </div> 
      {/* Right side */}
      <div className='flex-1'>

        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={'ALL'} text2={"COLLECTIONS"}/>
          {/* Product Pord */}
          <select onChange={(e)=>setSortType(e.target.value) } className='border-2 border-gray-300 text-sm px-2'>
            <option value="relavent">Sort by: Bán Chạy</option>
            <option value="low-high">Sort by: Thấp - Cao</option>
            <option value="high-low">Sort by: Cao - Thấp</option>
          </select>
        </div>
        {/* Map Products */}
        <div className='grid gird-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {
            filterProducts.map((item, index) => (
              <ProductItem key={index} id={item.id} name={item.name} price={item.price} image={item.image}/>
            ))
          }
        </div>

      </div>
    </div>
  )
}

export default Collection
