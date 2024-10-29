import { configureStore } from '@reduxjs/toolkit'
import UserReducer from './src/reducers/UserReducer'
import CartReducer from './src/reducers/CartReducer'

export default configureStore({
  reducer: { user: UserReducer,cart:CartReducer }
})