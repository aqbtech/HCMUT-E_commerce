import Title from '../Title';

const CartTotal = ({delivery_fee}) => {

  return (
    <div className='w-full'>
        <div className='text-2xl'>
            <Title text1={'CART'} text2={'TOTAL'}/>
        </div>
      
        <div className='flex flex-col gap-2 mt-2 text-sm'>
            <div className='flex justify-between'>
                <p>Tổng hàng</p>
                <p>{delivery_fee + '.000'} VNĐ</p>
            </div>
        </div>
        <hr />
        <div className='flex justify-between'>
            <p>Phí ship</p>
            <p>10.000 VNĐ</p>
        </div>
        <hr />
        <div className='flex justify-between'>
            <b>Tổng cộng</b>
            {/* <b>{currency} {getCartAmount() === 0 ? 0 : String(getCartAmount() + delivery_fee) + '.00'}</b> */}
            <b>{delivery_fee + 10 + '.000'} VNĐ  </b>
        </div>
    </div>
  )
}

export default CartTotal
