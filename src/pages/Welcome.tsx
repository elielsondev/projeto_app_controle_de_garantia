// import React from 'react';
import logo from '../assets/logo.png';
import { BlinkBlur } from 'react-loading-indicators';

// Componente de boas-vindas
function Welcome() {

  setTimeout(() => {
    window.location.href = '/login';
  }, 5000);

  return (
    <div className='flex flex-col items-center justify-center gap-8 min-h-screen bg-violet-700'>
      <img src={logo} alt="logo aponti" title='Logo Aponti' width={150} />
      <h1 className='be-vietnam-pro-black text-4xl text-white'>apontiNote</h1>
      <BlinkBlur color="#724ebf" size="small" text="Loading" textColor="#bfbfbf" />
    </div>
  )
}

export default Welcome;