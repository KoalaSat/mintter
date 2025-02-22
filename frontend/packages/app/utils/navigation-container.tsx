import {ReactNode, useEffect, useMemo, useReducer} from 'react'
import {useIPC} from '../app-context'
import {
  HomeRoute,
  NavContextProvider,
  NavState,
  navStateReducer,
  setAppNavDispatch,
} from './navigation'
import {useConfirmConnection} from '../components/contacts-prompt'
import {AppWindowEvent} from './window-events'

const homeRoute: HomeRoute = {key: 'home'}

export function NavigationContainer({
  children,
  initialNav = {
    sidebarLocked: false,
    routes: [homeRoute],
    routeIndex: 0,
    lastAction: 'replace',
  },
}: {
  children: ReactNode
  initialNav?: NavState
}) {
  const [navState, dispatch] = useReducer(navStateReducer, initialNav)
  const {send} = useIPC()

  // const confirmConnection = useConfirmConnection()
  useEffect(() => {
    send('windowNavState', navState)
  }, [navState, send])

  useEffect(() => {
    // @ts-expect-error
    return window.appWindowEvents?.subscribe((event: AppWindowEvent) => {
      if (event === 'back') {
        dispatch({type: 'pop'})
      }
      if (event === 'forward') {
        dispatch({type: 'forward'})
      }
    })
  }, [])

  useEffect(() => {
    setAppNavDispatch(dispatch)
    return () => {
      setAppNavDispatch(null)
    }
  }, [])

  let value = useMemo(
    () => ({
      state: navState,
      dispatch,
    }),
    [navState],
  )

  return (
    <NavContextProvider value={value}>
      {children}
      <ConnectionConfirmer />
    </NavContextProvider>
  )
}

function ConnectionConfirmer() {
  const confirmConnection = useConfirmConnection()
  useEffect(() => {
    return window.appWindowEvents?.subscribe((event: AppWindowEvent) => {
      if (typeof event === 'object' && event.key === 'connectPeer') {
        confirmConnection.open(event.peer)
      }
    })
  }, [])
  return confirmConnection.content
}
