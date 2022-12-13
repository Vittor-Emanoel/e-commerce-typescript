import { onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { FunctionComponent, useContext } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { auth, db } from './config/firebase.config'

// Pages
import HomePage from './pages/home/home.page'
import LoginPage from './pages/login/login.page'
import SignUpPage from './pages/sign-up/sign-up.page'

// Ultilities
import { UserContext } from './contexts/user.context'

const App: FunctionComponent = () => {
  const { isAuthentication, loginUser, logoutUser } = useContext(UserContext)

  console.log({ isAuthentication })
  // monitora se o usuario está logado ou não
  onAuthStateChanged(auth, async (user) => {
    // se o usuario estiver logado no contexto, e o usuario no firebase(sign out)
    // devemos limpar o context (sign out)

    const isSignIngOut = isAuthentication && !user
    if (isSignIngOut) {
      return logoutUser
    }

    // o usuario for nulo no contexto, e não for nulo no firebase
    // devemos fazeer o login

    const isSignIngIn = !isAuthentication && user
    if (isSignIngIn) {
      const querySnapshot = await getDocs(
        query(collection(db, 'users'), where('id', '==', user.uid))
      )
      const userFromFirestore = querySnapshot.docs[0]?.data()

      return loginUser(userFromFirestore as any)
    }
  })
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />}/>
        <Route path='/login' element={<LoginPage />}/>
        <Route path='/sign-up' element={<SignUpPage />}/>
      </Routes>
    </BrowserRouter>
  )
}
export default App
