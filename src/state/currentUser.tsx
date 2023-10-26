// import { useEffect } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type CurrentUser = {
  name: string;
  id: string;
};

type useCurrentUserState = {
  currentUser: CurrentUser;
  changeUser: (name: string, id: string) => void;
  clearUser: () => void;
};

export const useCurrentUser = create<useCurrentUserState>()(
  persist(
    (set /* , get */) => ({
      currentUser: { name: "", id: "" },
      changeUser: (name: string, id: string) => set((state) => ({ ...state, currentUser: { name, id } })),
      clearUser: () => set((state) => ({ ...state, currentUser: { name: "", id: "" } })),
      //   bears: 0,
      //   addABear: () => set({ bears: get().bears + 1 }),
    }),
    {
      name: "YOUTUBE_CURRENTUSER", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

// function useCurrentUsera() {
  

//   useEffect(() => {
//     if (!!user) {
//       changeUser(user.username ?? user.firstName ?? user.fullName ?? "", user.id)
//     }
//   }, [user])

//   // return useCurrentUser
// }

