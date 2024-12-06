import {useContext, useEffect, useState} from "react";
import axios from "axios";
import { ShopContext } from "../../context/ShopContext";
import Title from "../Title";

const ProductManagement = () => {
  const [page, setPage] = useState(0);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchAllProduct = async () => {

    }
    fetchAllProduct();
  }, []);

  return (<div>123</div>);
};

export default ProductManagement;
