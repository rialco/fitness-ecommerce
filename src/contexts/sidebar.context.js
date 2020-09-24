import React, { createContext, useContext, useState } from "react";
const SidebarContext = createContext();
const SidebarUpdateContext = createContext();

export function useSidebar() {
  return useContext(SidebarContext);
}

export function useSidebarUpdate() {
  return useContext(SidebarUpdateContext);
}

export function SidebarProvider({ children }) {
  const [open, setOpen] = useState(false);

  function openSidebar() {
    setOpen(true);
  }

  function closeSidebar() {
    setOpen(false);
  }

  return (
    <SidebarContext.Provider value={{ open }}>
      <SidebarUpdateContext.Provider value={{ openSidebar, closeSidebar }}>
        {children}
      </SidebarUpdateContext.Provider>
    </SidebarContext.Provider>
  );
}
