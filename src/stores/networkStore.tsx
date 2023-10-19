import {create} from 'zustand'

export enum networkStatus {
  online,
  offline,
}

type networkStore = {
  status: networkStatus
  setStatus: (status: networkStatus) => void
}

export const useNetworkStore = create<networkStore>((set) => ({
  status: networkStatus.online,
  setStatus: (status) => set({ status }),
}))
