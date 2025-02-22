import {queryKeys} from '@mintter/app/models/query-keys'
import {Device} from '@mintter/shared'
import {UseMutationOptions, useMutation, useQuery} from '@tanstack/react-query'
import {useAccount} from './accounts'
import {useConnectedPeers} from './networking'
import {useGRPCClient, useQueryInvalidator} from '../app-context'

export function useContactsList() {
  const grpcClient = useGRPCClient()
  const contacts = useQuery({
    queryKey: [queryKeys.GET_ALL_ACCOUNTS],
    queryFn: async () => {
      return await grpcClient.accounts.listAccounts({})
    },
    refetchInterval: 10000,
  })
  return contacts
}

export function useConnectionSummary() {
  const peerInfo = useConnectedPeers({
    refetchInterval: 10000,
  })
  const connectedPeers = peerInfo.data || []
  return {
    online: connectedPeers.length > 0,
    connectedCount: connectedPeers.length,
  }
}

export function useAccountWithDevices(accountId: string) {
  const account = useAccount(accountId)
  const peers = useConnectedPeers()
  return {
    ...account.data,
    profile: account.data?.profile,

    devices: Object.values(account?.data?.devices || {}).map(
      (device: Device) => {
        const deviceId = device.deviceId
        return {
          deviceId,
          isConnected: !!peers.data?.find((peer) => peer.id === deviceId),
        }
      },
    ),
  }
}

export function useConnectPeer(
  opts: UseMutationOptions<undefined, void, string | undefined>,
) {
  const grpcClient = useGRPCClient()
  const invalidate = useQueryInvalidator()
  return useMutation<undefined, void, string | undefined>({
    mutationFn: async (peer: string | undefined) => {
      if (!peer) return undefined
      const connectionRegexp = /connect-peer\/([\w\d]+)/
      const parsedConnectUrl = peer.match(connectionRegexp)
      let addrs = parsedConnectUrl ? [parsedConnectUrl[1]] : null
      if (!addrs && peer.match(/^(https:\/\/)/)) {
        // in this case, the "peer" input is not https://site/connect-peer/x url, but it is a web url. So lets try to connect to this site via its well known peer id.
        const peerUrl = new URL(peer)
        peerUrl.search = ''
        peerUrl.hash = ''
        peerUrl.pathname = '/.well-known/hypermedia-site'
        const peerWellKnown = peerUrl.toString()
        const wellKnownData = await fetch(peerWellKnown)
          .then((res) => res.json())
          .catch((err) => {
            console.error('Connect Error:', err)
            return null
          })
        if (wellKnownData?.peerInfo?.peerId) {
          const {peerId} = wellKnownData.peerInfo
          // addrs = [wellKnownData.peerInfo.peerId] // peer id is not sufficient most of the time
          addrs = wellKnownData.peerInfo.addrs.map(
            (addr) => `${addr}/p2p/${peerId}`,
          )
        } else {
          throw new Error('Failed to connet to web url: ' + peer)
        }
      }
      if (!addrs) {
        addrs = peer.trim().split(',')
      }
      console.log('addrs', addrs)
      if (!addrs) throw new Error('Invalid peer address(es) provided.')
      await grpcClient.networking.connect({addrs})
      return undefined
    },
    onSuccess: (data, ...rest) => {
      invalidate([queryKeys.GET_PEERS])
      opts?.onSuccess?.(data, ...rest)
    },
    ...opts,
  })
}
