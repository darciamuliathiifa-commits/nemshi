"use client";

import { useSyncExternalStore } from "react";
import { mockUser } from "@/lib/mock-user";

const STORAGE_KEY = "nemshi:profile";

export interface EditableProfile {
  name: string;
  location: string;
}

const defaultProfile: EditableProfile = {
  name: mockUser.name,
  location: mockUser.location,
};

function loadInitial(): EditableProfile {
  if (typeof window === "undefined") return defaultProfile;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? { ...defaultProfile, ...JSON.parse(stored) } : defaultProfile;
  } catch {
    return defaultProfile;
  }
}

let profile: EditableProfile = loadInitial();
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
  return profile;
}

function getServerSnapshot() {
  return defaultProfile;
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // ignore write failures (e.g. storage disabled)
  }
}

function updateProfile(next: EditableProfile) {
  profile = next;
  persist();
  emitChange();
}

export function useProfile() {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { profile: current, updateProfile };
}
