import { useEffect, useState } from 'react'
import Content from '../components/homePage/Content'
import LatestProduct from '../components/homePage/LatestProduct'
import BestSeller from '../components/homePage/BestSeller'
import OurPolicy from '../components/homePage/OurPolicy'
import Category from '../components/homePage/Category'
import { getAllProducts } from '../fetchAPI/fetchProduct'
import { getCategories } from '../fetchAPI/fetchCategory'

const Home = () => {

  const [listProduct, setListProduct] = useState([]);
  const [listCategories, setListCategories] = useState([])



  
  useEffect(()=> {
    getAllProducts('?_page=1&_limit=10')
    .then((res) =>{
        setListProduct(res)
    });
  }, [] )


  useEffect(()=> {
    getCategories()
    .then((res) =>{
      setListCategories(res)
    });
  }, [] )


  return (
    <div>
      <Content/>
      <Category data = {listCategories}/>
      <LatestProduct data = {listProduct}/>
      <BestSeller data = {listProduct.slice(0,5)}/>
      <OurPolicy/>
    </div>
  ) 
} 

export default Home
