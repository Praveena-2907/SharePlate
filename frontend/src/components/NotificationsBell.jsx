import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { listNotifications, markNotificationRead } from "../api/notifications";

export default function NotificationsBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  const fetchNotifications = () => {
    setLoading(true);
    listNotifications()
      .then(setNotifications)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    } catch {
      // ignore failures marking a single notification as read
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative text-gray-500 hover:text-ink transition-colors p-2"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-status-error text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-2xl shadow-soft-lg border border-gray-100 z-50">
          <div className="p-4 border-b border-gray-100 font-bold text-ink">Notifications</div>
          {loading && notifications.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">No notifications yet.</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleRead(n.id)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${!n.is_read ? "bg-primary/5" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-ink text-sm">{n.title}</p>
                    {!n.is_read && <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1"></span>}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleString()}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
