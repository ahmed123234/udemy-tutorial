// state managment package 
import { create } from 'zustand'

interface ConfettiStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

// it can be use as a global controls for confetti
export const useConfettiStore = create<ConfettiStore>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false })
}));

