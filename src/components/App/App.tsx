import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import LoginForm from '@/components/LoginForm';

import style from './App.scss';

export const App = (): JSX.Element => (
  <div className={style.componentWrapper}>
    <h2>サンプルテスト</h2>
    <BrowserRouter>
      <nav className={style.routingWrapper}>
        <Link to="/">Home</Link>
        <Link to="/login">Login form</Link>
      </nav>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/mypage" element={<h1>Mypage</h1>} />
      </Routes>
    </BrowserRouter>
  </div>
);
