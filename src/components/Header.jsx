import React from 'react'
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";

const Header = () => {
  return (
    <div className="bg-[url('/public/bgblue.jpg')] text-white w-[100%] h-13 bg-cover bg-no-repeat" >
      <div className='flex items-center h-full'>
        <div className='flex items-center h-full'>
          <img src='/public/logo.png' className='h-[50px] pl-6' />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className=' h-[10px] text-xl font-bold uppercase pl-3 flex items-center'
          >
            Thép Xanh Nam Định
          </motion.p>
        </div>
        <div className='flex text-lg items-center pl-15 space-x-3'>
          <div className='hover:scale-105 transition-transform duration-400 cursor-pointer'>Trang chủ</div>
          <div>|</div>
          <div className='hover:scale-105 transition-transform duration-400 cursor-pointer'>Thông tin</div>
          <div>|</div>
          <div className='hover:scale-105 transition-transform duration-400 cursor-pointer'>Trận đấu</div>
          <div>|</div>
          <div className='hover:scale-105 transition-transform duration-400 cursor-pointer'>Kết quả</div>
          <div>|</div>
          <div className='hover:scale-105 transition-transform duration-400 cursor-pointer'>Mua vé</div>
          <div>|</div>
          <div className='hover:scale-105 transition-transform duration-400 cursor-pointer'>Hội CĐV</div>

        </div>
        <div className='flex items-center ml-auto gap-4 p-5'>
          <div className='text-lg'>
            Xin chào Vũ Tuấn Anh
          </div>
          <LogOut size={25}/>
        </div>
      </div>
    </div>
  )
}

export default Header
