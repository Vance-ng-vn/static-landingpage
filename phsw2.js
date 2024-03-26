(() => {
    "use strict";
    const t = function (t, e) {
        return (
            (e = e || {}),
            new Promise(function (o, n) {
                const i = e.retries || 0,
                    r = "function" == typeof e.delayFn ? e.delayFn : (t) => 1e3,
                    a = (c) => {
                        if (c > i) return void n(new Error(`Max attempts of ${i} exceed`));
                        const s = t + "&r=" + c;
                        console.debug(`Request ${s} (attempt = ${c})`);
                        const u = new Date();
                        return fetch(s, e)
                            .then((t) => (200 !== t.status ? Promise.reject(new Error(`Unexpected status code: ${t.status}`)) : t.json()))
                            .then((t) => {
                                console.debug(`Response JSON is ${JSON.stringify(t)}`), o(t);
                            })
                            .catch((t) => {
                                if (!(t instanceof TypeError)) return void n(t);
                                const e = new Date() - u;
                                return (
                                    console.error(`Attempt ${c} failed (took = ${e} ms)`, t),
                                    (o = () => a(c + 1)),
                                    (i = r(c + 1)),
                                    new Promise(function (t, e) {
                                        setTimeout(() => {
                                            t(o());
                                        }, i);
                                    })
                                );
                                var o, i;
                            });
                    };
                return a(0);
            })
        );
    };
    function e(t) {
        this.get = function (e, o) {
            return new Promise((n, i) => {
                try {
                    const r = t.transaction("RPStore", "readonly"),
                        a = r.objectStore("RPStore").get(e);
                    (a.onsuccess = function () {
                        a.result ? n(a.result.value) : void 0 === o ? i(new Error(`missing result for key ${e}`)) : n(o);
                    }),
                        (a.onerror = function () {
                            console.error(`readKeyRequest.onerror for key: ${e}`, a.error), i(a.error);
                        });
                } catch (t) {
                    console.warn(`failed to read key "${e}", use default value "${o}"`, t), n(o);
                }
            });
        };
    }
    async function o() {
        try {
            const o = await new Promise((t, o) => {
                const n = indexedDB.open("RPDB", 1);
                (n.onerror = function () {
                    o(n.error);
                }),
                    (n.onsuccess = function () {
                        t(new e(n.result));
                    });
            });
            try {
                const e = await (async function (t) {
                    const e = await t.get("pdp_id", "c14e7b1a-a2c6-4d56-94e0-bf381fd4e6f7"),
                        o = await t.get("uid", 135400),
                        n = await t.get("subacc", 8052001),
                        i = await t.get("subscribe_date", 1668692079),
                        r = await t.get("sub1", ""),
                        a = await t.get("sub2", ""),
                        c = await t.get("sub3", ""),
                        s = await t.get("sub4", ""),
                        u = await t.get("ban_adult", !1),
                        l = await t.get("vapid_key_id", 0);
                    return `https://show.revopush.com/api/v1/vapid/show/?id=${e}&uid=${o}&subacc=${n}&subdate=${i}&sub1=${r}&sub2=${a}&sub3=${c}&sub4=${s}&adult=${u ? "false" : "true"}&limit=1&vki=${l}&sw=1.4.3`;
                })(o);
                try {
                    return (function (t) {
                        let e = [],
                            o = [];
                        return (
                            t.forEach((t, n) => {
                                try {
                                    const i = self.registration.showNotification(t.title, {
                                        body: t.text || void 0,
                                        icon: t.icon || void 0,
                                        image: t.image || void 0,
                                        actions: t.actions || void 0,
                                        badge: t.badge || void 0,
                                        tag: "ph-i-" + n,
                                        renotify: !0,
                                        vibrate: [200, 100, 200, 100, 200, 100, 200],
                                        requireInteraction: !0,
                                        data: { link: t.link },
                                    });
                                    if (t.impr) {
                                        const e = fetch(t.impr, { method: "HEAD" }).catch((t) => {
                                            Sentry.captureException(t);
                                        });
                                        o.push(e);
                                    }
                                    i.catch((e) => {
                                        console.error("failed to show notification", e), Sentry.captureException(e, { extra: { i: n, item: t } });
                                    }),
                                        e.push(i);
                                } catch (e) {
                                    console.error("failed to build notification", e), Sentry.captureException(e, { extra: { i: n, item: t } });
                                }
                            }),
                            Promise.all([].concat(e, o))
                        );
                    })(await t(e, { retries: 4, delayFn: (t) => 1e3 * t }));
                } catch (t) {
                    console.error("failed to fetch api", t), Sentry.captureException(t);
                }
            } catch (t) {
                console.error("failed to build url", t), Sentry.captureException(t);
            }
        } catch (t) {
            console.error("failed to setup storage", t), Sentry.captureException(t);
        }
    }
    async function n() {
        try {
            await self.registration.update();
        } catch (t) {
            console.log("failed to update service worker", t);
        }
    }
    const i = Math.floor(Date.now() / 1e3);
    let r = "not-supported",
        a = "not-supported",
        c = "not-supported";
    if (navigator && navigator.connection) {
        const t = navigator.connection;
        (r = t.downlink >= 0 ? t.downlink : r), (a = t.type || t.effectiveType || a), (c = t.rtt || c);
    }
    try {
        self.importScripts("https://browser.sentry-cdn.com/7.19.0/bundle.es5.min.js"),
            Sentry.init({
                dsn: "https://5351bc6a8d4240aea17cd1f9998f3e70@errors.house/2",
                environment: "production",
                release: "1.4.3",
                sampleRate: 1,
                enabled: !0,
                autoSessionTracking: !1,
                initialScope: { installTime: i, extra: { downlink: r, effectiveType: a, rtt: c } },
                ignoreErrors: ["Max attempts of", "Failed to fetch"],
            });
    } catch (t) {
        console.error("failed to import Sentry script", t), (window.Sentry = { captureException() {}, captureMessage() {} });
    }
    console.debug(`install time is ${i}`),
        self.addEventListener("push", function (t) {
            t.waitUntil(Promise.all([o(), n()]));
        }),
        self.addEventListener("notificationclick", function (t) {
            try {
                t.preventDefault(), t.notification.close(), t.waitUntil(clients.openWindow(t.notification.data.link));
            } catch (e) {
                Sentry.captureException(e, { extra: { notification: t.notification } });
            }
        }),
        self.addEventListener("install", (t) => {
            self.skipWaiting();
        });
})();
