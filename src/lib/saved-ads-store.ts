"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "nemshi:saved-ads";

function loadInitial(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

let savedIds: string[] = loadInitial();
let listeners: Array<() => void> = [];

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot() {
  return savedIds;
}

const emptySnapshot: string[] = [];

function getServerSnapshot() {
  return emptySnapshot;
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));
  } catch {
    // ignore write failures (e.g. storage disabled)
  }
}

function toggleSavedGlobal(adId: string) {
  savedIds = savedIds.includes(adId)
    ? savedIds.filter((id) => id !== adId)
    : [...savedIds, adId];
  persist();
  emitChange();
}

export function useSavedAds() {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    savedIds: ids,
    isSaved: (adId: string) => ids.includes(adId),
    toggleSaved: toggleSavedGlobal,
  };
}
