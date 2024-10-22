import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { System, Component } from './types'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist/es/constants'

interface AppState {
  customer: string
  period: number
  currency: string
  systemType: string
  systemColors: string[]
  systems: System[]
  components: Component[]
  backend: string
  errors: string[]
}

// Define the initial state
const initialState: AppState = {
  customer: 'Glacier Sightseeing Tours',
  period: 25,
  currency: 'USD',
  systemType: 'Helicopter',
  systemColors: ['#EEE5A7', '#C5D3F9', '#F9C5D3', '#C5F9D3'],
  systems: [],
  components: [],
  backend: 'http://127.0.0.1:8000/upload/',
  errors: []
}

// Create a slice for app data
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    addSystem: (state, action: PayloadAction<{ system: System; components: Component[] }>) => {
      const existingSystem = state.systems.find((sys) => sys.product === action.payload.system.product)
      if (existingSystem) {
        state.errors.push(`${action.payload.system.product} already exists`)
        return
      }

      const colorIndex = state.systems.length % state.systemColors.length
      const color = state.systemColors[colorIndex]
      const cumulative = action.payload.system.annual * state.period + action.payload.system.acquisition

      const dataset = Array.from({ length: state.period }, (_, year) => {
        const yearIndex = year + 1
        const annualCost = action.payload.system.annual * yearIndex
        const cumulativeCost = action.payload.system.acquisition + annualCost
        return cumulativeCost
      })

      state.systems.push({ ...action.payload.system, color, cumulative, dataset })

      // add components
      action.payload.components.forEach((component) => {
        const cumulativeCost = component.annual * state.period + component.price * component.quantity
        component.cumulative = cumulativeCost
      })
      state.components.push(...action.payload.components)
    },

    removeSystem: (state, action: PayloadAction<{ systemId: string }>) => {
      // Remove the system with the given systemId
      state.systems = state.systems.filter((system) => system.product !== action.payload.systemId)

      // Remove components associated with the removed system
      state.components = state.components.filter((component) => component.system !== action.payload.systemId)
    },

    addComponents: (state, action: PayloadAction<{ components: Component[] }>) => {
      action.payload.components.forEach((component) => {
        const cumulativeCost = component.annual * state.period + component.price * component.quantity
        component.cumulative = cumulativeCost
      })
      state.components.push(...action.payload.components)
    },

    clearState: (state) => {
      // Reset the state to initial state
      Object.assign(state, initialState)
    }
  }
})

export const { addSystem, addComponents, removeSystem, clearState } = appSlice.actions

const persistConfig = {
  key: 'root',
  storage
}

const persistedReducer = persistReducer(persistConfig, appSlice.reducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
})

export const persistor = persistStore(store)

export const clearPersistedStore = () => {
  persistor.purge().then(() => {
    store.dispatch(clearState())
  })
}

export default store
