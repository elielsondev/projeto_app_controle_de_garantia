import React from 'react';
import '../style/Welcome.css';
import logo from '../assets/logo.png';
import { BlinkBlur } from 'react-loading-indicators';

// Componente de boas-vindas
function Welcome() {

  setTimeout(() => {
    window.location.href = '/login';
  }, 5000);

  return (
    <div className='welcome-container'>
      <img src={logo} alt="logo aponti" title='Logo Aponti' width={150} />
      <h1 className='be-vietnam-pro-black text-4xl'>apontiNote</h1>
      <BlinkBlur color="#724ebf" size="small" text="Loading" textColor="#bfbfbf" />
    </div>
  )
}

export default Welcome;