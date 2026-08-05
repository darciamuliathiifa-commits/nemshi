"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BellIcon } from "@/components/icons";
import { formatRelativeTime } from "@/lib/format-relative-time";

interface NotificationItem {
  id: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  createdAt: string;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const hasFetchedList = useRef(false);

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { notifications: NotificationItem[]; unreadCount: number } | null) => {
        if (!data) return;
        setUnreadCount(data.unreadCount);
        if (hasFetchedList.current) setNotifications(data.notifications);
      })
      .catch(() => {});
  }, []);

  function toggleOpen() {
    const next = !open;
    setOpen(next);

    if (next) {
      hasFetchedList.current = true;
      fetch("/api/notifications")
        .then((res) => (res.ok ? res.json() : null))
        .then((data: { notifications: NotificationItem[] } | null) => {
          if (data) setNotifications(data.notifications);
        })
        .catch(() => {});

      fetch("/api/notifications", { method: "POST" }).catch(() => {});
      setUnreadCount(0);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleOpen}
        aria-label="Notifikasi"
        aria-expanded={open}
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-surface"
      >
        <BellIcon width={18} height={18} />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold leading-none text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Tutup notifikasi"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div className="absolute right-0 z-50 mt-2 max-h-[70vh] w-80 max-w-[85vw] overflow-y-auto rounded-card border-2 border-ink bg-white shadow-[3px_3px_0_0_#006451]">
            <div className="border-b border-border-subtle px-4 py-3">
              <p className="text-[14px] font-bold text-charcoal">Notifikasi</p>
            </div>

            {notifications.length > 0 ? (
              notifications.map((item) => {
                const content = (
                  <div className="flex flex-col gap-0.5 border-b border-border-subtle px-4 py-3 last:border-b-0">
                    <p className="text-[13px] font-bold text-charcoal">{item.title}</p>
                    {item.body && (
                      <p className="text-[12px] font-normal text-muted-foreground">
                        {item.body}
                      </p>
                    )}
                    <p className="mt-0.5 text-[11px] font-normal text-muted-foreground">
                      {formatRelativeTime(item.createdAt)}
                    </p>
                  </div>
                );

                return item.link ? (
                  <Link
                    key={item.id}
                    href={item.link}
                    onClick={() => setOpen(false)}
                    className="block transition-colors hover:bg-surface"
                  >
                    {content}
                  </Link>
                ) : (
                  <div key={item.id}>{content}</div>
                );
              })
            ) : (
              <p className="px-4 py-6 text-center text-[13px] font-normal text-muted-foreground">
                Belum ada notifikasi.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
