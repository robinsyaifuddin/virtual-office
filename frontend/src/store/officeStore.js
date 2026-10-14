import { create } from 'zustand';
import { AGENTS } from '../data/agents';
import { ROOMS } from '../data/rooms';

export const useOfficeStore = create((set, get) => ({
  agents: AGENTS,
  rooms: ROOMS,
  selectedAgentId: null,
  selectedRoomId: null,
  labelsVisible: true,
  cameraTarget: [0, 0, 0],
  cameraZoom: 11,
  isDetailOpen: false,

  selectAgent: (agentId) => {
    if (!agentId) {
      set({ selectedAgentId: null, isDetailOpen: false });
      return;
    }
    const agent = get().agents.find((a) => a.id === agentId);
    if (agent) {
      set({
        selectedAgentId: agentId,
        selectedRoomId: agent.roomId,
        isDetailOpen: true,
        cameraTarget: [agent.position[0], 1, agent.position[2]]
      });
    }
  },

  selectRoom: (roomId) => {
    if (!roomId) {
      set({ selectedRoomId: null, cameraTarget: [0, 0, 0], cameraZoom: 11 });
      return;
    }
    const room = get().rooms.find((r) => r.id === roomId);
    if (room) {
      // Cari agent di room tersebut
      const agent = get().agents.find((a) => a.roomId === roomId);
      set({
        selectedRoomId: roomId,
        selectedAgentId: agent ? agent.id : null,
        isDetailOpen: !!agent,
        cameraTarget: [room.bounds.center[0], 0, room.bounds.center[2]]
      });
    }
  },

  toggleLabels: () => set((state) => ({ labelsVisible: !state.labelsVisible })),

  resetCamera: () => {
    set({
      selectedAgentId: null,
      selectedRoomId: null,
      isDetailOpen: false,
      cameraTarget: [0, 0, 0],
      cameraZoom: 11
    });
  },

  closeDetail: () => set({ isDetailOpen: false, selectedAgentId: null }),

  updateAgentStatus: (agentId, status) => {
    set((state) => ({
      agents: state.agents.map((a) => (a.id === agentId ? { ...a, status } : a))
    }));
  }
}));
