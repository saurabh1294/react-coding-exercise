/* eslint-env jest */
import React from 'react'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import configureStore from 'redux-mock-store'
import App from './App'

jest.mock('./Events', () => function Events () {
  return 'Events'
})

const mockStore = configureStore()

describe('App component', () => {
  it('renders Events child', () => {
    const store = mockStore({})
    const wrapper = mount(
      <Provider store={store}>
        <App />
      </Provider>
    )
    expect(wrapper.text()).toBe('Events')
    wrapper.unmount()
  })
})
