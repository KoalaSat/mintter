import {useAppContext} from '@mintter/app/app-context'
import {unpackHmIdWithAppRoute} from '@mintter/app/utils/navigation'
import {useNavigate} from '@mintter/app/utils/useNavigate'
import {useMemo} from 'react'

export function useOpenUrl() {
  const {externalOpen} = useAppContext()
  const spawn = useNavigate('spawn')
  const push = useNavigate('push')
  return useMemo(() => {
    return (url?: string, newWindow?: boolean) => {
      if (!url) return
      const dest = unpackHmIdWithAppRoute(url)
      if (dest?.navRoute) {
        if (newWindow) {
          spawn(dest?.navRoute)
        } else {
          push(dest?.navRoute)
        }
        return
      } else {
        externalOpen(url)
      }
    }
  }, [])
}
