import React from 'react'

import ReactDOM from 'react-dom'
import App from './App'
import CartContextProvider from './contexts/cart.context'
import CategoryContextProvider from './contexts/category.context'
import UserContextProvider from './contexts/user.context'
import './index.css'
import reportWebVitals from './reportWebVitals'

ReactDOM.render(
  <React.StrictMode>
    <UserContextProvider>
      <CategoryContextProvider>
        <CartContextProvider>
           <App />
      </CartContextProvider>
      </CategoryContextProvider>
    </UserContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
