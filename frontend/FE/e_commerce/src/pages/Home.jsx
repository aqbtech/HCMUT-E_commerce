import React from 'react'
import Content from '../components/Content'
import LatestProduct from '../components/LatestProduct'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import Category from '../components/Category'

const Home = () => {
  return (
    <div>
      <Content/>
      <Category/>
      <LatestProduct/>
      <BestSeller/>
      <OurPolicy/>
    </div>
  )
} 

export default Home
