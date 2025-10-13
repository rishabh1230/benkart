import React, { createContext, useContext, useEffect, useReducer } from 'react'
return action.payload || []
case 'ADD': {
    const item = action.payload
    const found = state.find(i => i.id === item.id)
    if (found) {
        return state.map(i => i.id === item.id ? { ...i, qty: i.qty + item.qty } : i)
    }
    return [...state, item]
}
case 'REMOVE':
return state.filter(i => i.id !== action.payload)
case 'UPDATE_QTY':
return state.map(i => i.id === action.payload.id ? { ...i, qty: action.payload.qty } : i)
case 'CLEAR':
return []
default:
return state
}
}

console.log('CartContext loaded')

export function CartProvider({ children }) {
    const [cart, dispatch] = useReducer(reducer, [])


    useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) dispatch({ type: 'INIT', payload: JSON.parse(raw) })
    }, [])


    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
    }, [cart])


    const addItem = (product, qty = 1) => {
        dispatch({ type: 'ADD', payload: { id: product.id, title: product.title, price: product.price, image: product.image, qty } })
    }


    const removeItem = (id) => dispatch({ type: 'REMOVE', payload: id })
    const updateQty = (id, qty) => dispatch({ type: 'UPDATE_QTY', payload: { id, qty } })
    const clear = () => dispatch({ type: 'CLEAR' })


    const total = cart.reduce((s, i) => s + i.price * i.qty, 0)
    const count = cart.reduce((s, i) => s + i.qty, 0)


    return (
        <CartContext.Provider value={{ cart, addItem, removeItem, updateQty, clear, total, count }}>
            {children}
        </CartContext.Provider>
    )
}


export function useCart() {
    return useContext(CartContext)
}