import { useState } from "react";
import { Bell, X, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { resolveMock } from "@/lib/mockData";

export function NotificationBell() {
    const [open, setOpen] = useState(false);
    const notifications = (resolveMock("/api/notifications/absence") as any[]) || [];
    const unread = notifications.filter((n: any) => !n.isRead);

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-muted"
                onClick={() => setOpen(!open)}
                title="Absence Notifications"
            >
                <Bell className="w-5 h-5" />
                {unread.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                        {unread.length}
                    </span>
                )}
            </Button>

            {open && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpen(false)}
                    />
                    <div className="absolute bottom-12 left-0 w-80 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-border bg-red-50 dark:bg-red-900/20">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                                <h3 className="font-semibold text-sm text-foreground">Absence Alerts</h3>
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setOpen(false)}>
                                <X className="w-3 h-3" />
                            </Button>
                        </div>
                        <div className="max-h-72 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-4 text-center text-muted-foreground text-sm">No notifications</div>
                            ) : (
                                notifications.map((notif: any) => (
                                    <div
                                        key={notif.id}
                                        className={cn(
                                            "p-3 border-b border-border last:border-0 text-sm",
                                            !notif.isRead ? "bg-red-50/60 dark:bg-red-900/10" : ""
                                        )}
                                    >
                                        <div className="flex items-start gap-2">
                                            {!notif.isRead ? (
                                                <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                                            ) : (
                                                <CheckCircle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                                            )}
                                            <div>
                                                <p className="text-foreground leading-snug">{notif.message}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {new Date(notif.sentAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
