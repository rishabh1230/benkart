import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ProductPage from './pages/ProductPage'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Header from './components/Header'


export default function App() {
return (
<div className="min-h-screen flex flex-col">
<Header />
<main className="flex-1 container py-8">
<Routes>
<Route path="/" element={<Home />} />
<Route path="/product/:id" element={<ProductPage />} />
<Route path="/cart" element={<Cart />} />
<Route path="/checkout" element={<Checkout />} />
<Route path="*" element={<div>Page not found</div>} />
</Routes>
</main>
<footer className="bg-white dark:bg-gray-800 border-t py-6">
<div className="container text-center text-sm text-gray-600 dark:text-gray-400">© {new Date().getFullYear()} My E-commerce</div>
</footer>
</div>
)
}
