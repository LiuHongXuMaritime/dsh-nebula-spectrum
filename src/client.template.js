window.__ModuleLoader__.load({
  id: "@local/dsh-nebula-spectrum",
  factory: function (require) {
    "use strict";

    var module = { exports: {} };
    var exports = module.exports;
    var react = require("react");
    var h = react.createElement;

    var NS = "nebula-spectrum";
    var SKIN_CSS = __SKIN_CSS__;
    var STORAGE_KEY = "dsh.nebula-spectrum.v1";
    var EDITIONS = ["auto", "nebula", "onyx", "light"];
    var EDITION_ATTR = "data-nebula-edition";

    /* ---------- dictionaries ---------- */

    var en = {
      title: "Nebula Spectrum",
      hint: "An aurora canvas, a glass sidebar and a spectrum-rimmed composer.",
      nebula: "Deep ocean",
      onyx: "Onyx",
      light: "Light",
      auto: "Follow appearance",
      autoHint: "The dark appearance uses Deep ocean.",
    };

    var zh = {
      title: "星云光谱",
      hint: "极光画布、玻璃侧边栏与光谱描边的输入框。",
      nebula: "深海",
      onyx: "玄黑",
      light: "浅色",
      auto: "跟随外观",
      autoHint: "深色外观使用深海版本。",
    };

    /* ---------- the edition store ----------
       A preference this plugin owns. It never registers a DSH theme, because
       only the light / dark / system preferences persist through the host and
       only those three appear in the built-in appearance row. */

    var SWATCH = {
      nebula:
        "radial-gradient(circle at 22% 18%, #fb923c, transparent 55%)," +
        "radial-gradient(circle at 84% 10%, #ec4899, transparent 55%)," +
        "radial-gradient(circle at 76% 92%, #22d3ee, transparent 58%)," +
        "radial-gradient(circle at 16% 86%, #2dd4bf, transparent 55%),#0a171f",
      onyx:
        "radial-gradient(circle at 22% 18%, #c2711f, transparent 52%)," +
        "radial-gradient(circle at 84% 10%, #a8285c, transparent 52%)," +
        "radial-gradient(circle at 76% 92%, #128fa0, transparent 55%)," +
        "radial-gradient(circle at 16% 86%, #1d8f84, transparent 52%),#04070b",
      light:
        "linear-gradient(118deg, #ffd9b8, #ffc7de 40%, #cfe0ff 70%, #c6f2ea),#fcfbfd",
      auto: "linear-gradient(90deg, #0a171f 0 50%, #fcfbfd 50% 100%)",
    };

    function readEdition() {
      try {
        var raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return "auto";
        var parsed = JSON.parse(raw);
        var edition = parsed && parsed.edition;
        return EDITIONS.indexOf(edition) === -1 ? "auto" : edition;
      } catch (error) {
        return "auto";
      }
    }

    function writeEdition(edition) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ edition: edition }));
      } catch (error) {
        /* a private-mode window may refuse storage; in-memory choice still works */
      }
    }

    var store = {
      edition: readEdition(),
      scheme: "dark",
      listeners: new Set(),
    };

    function schemeOf(ctx) {
      try {
        var theme = ctx.theme.getTheme();
        var scheme = theme && theme.active && theme.active.colorScheme;
        return scheme === "light" ? "light" : "dark";
      } catch (error) {
        return "dark";
      }
    }

    function resolvedEdition() {
      if (store.edition !== "auto") return store.edition;
      return store.scheme === "light" ? "light" : "nebula";
    }

    function applyEdition() {
      var root = document.documentElement;
      var edition = resolvedEdition();
      if (root.getAttribute(EDITION_ATTR) !== edition) {
        root.setAttribute(EDITION_ATTR, edition);
      }
      nudgeCaption(edition);
    }

    /* The desktop preload paints the native caption buttons (minimise, maximise,
       close) with `--dsw-specific-sidebar-fill` and their glyphs with
       `--dsw-alias-label-primary`. It re-reads both whenever `document.body`'s
       `style` attribute mutates, so writing a private custom property there is
       what makes the OS-drawn band follow the skin instead of staying at the
       desktop fallback (#1b1b1c / #f9fafb). */
    function nudgeCaption(edition) {
      try {
        if (document.body) {
          document.body.style.setProperty("--dsh-nebula-caption", edition);
        }
      } catch (error) {
        /* the preload also watches <head>, so this is only the quick path */
      }
    }

    function notify() {
      store.listeners.forEach(function (listener) {
        try {
          listener();
        } catch (error) {
          console.error("[nebula-spectrum] a settings row failed to refresh.", error);
        }
      });
    }

    function chooseEdition(edition) {
      if (EDITIONS.indexOf(edition) === -1) return;
      store.edition = edition;
      writeEdition(edition);
      applyEdition();
      notify();
    }

    function useStore() {
      var state = react.useState(0);
      var bump = state[1];
      react.useEffect(function () {
        var listener = function () {
          bump(function (value) {
            return value + 1;
          });
        };
        store.listeners.add(listener);
        return function () {
          store.listeners.delete(listener);
        };
      }, []);
      return store;
    }

    /* ---------- the edition picker ---------- */

    var ROW_CSS =
      ".nbx-group{display:flex;flex-direction:column;gap:8px;padding:16px 0;border-bottom:.5px solid var(--dsw-alias-border-l2)}" +
      ".nbx-title{color:var(--dsw-alias-label-primary);font-size:14px;font-weight:400;line-height:22px}" +
      ".nbx-hint{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}" +
      ".nbx-row{display:flex;flex-wrap:wrap;align-items:stretch;gap:8px}" +
      ".nbx-cube{box-sizing:border-box;flex:1 1 132px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:14px 10px;border:.5px solid var(--dsw-alias-border-l4);border-radius:var(--dsw-radius-xl);background:0 0;color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:20px;cursor:pointer;transition:background-color .16s ease,border-color .16s ease}" +
      ".nbx-cube:hover{background:var(--dsw-alias-interactive-bg-hover)}" +
      ".nbx-cube[aria-pressed=true]{border-color:var(--dsw-alias-border-selected);background:var(--dsw-alias-bg-module-platform)}" +
      ".nbx-dot{width:34px;height:34px;border-radius:999px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.18),0 1px 2px rgba(0,0,0,.18)}";

    function EditionRow(props) {
      var t = props.t;
      var state = useStore();
      var edition = state.edition;

      return h(
        "div",
        { className: "nbx-group" },
        h("style", { key: "css", dangerouslySetInnerHTML: { __html: ROW_CSS } }),
        h("div", { className: "nbx-title", key: "title" }, t("title")),
        h(
          "div",
          { className: "nbx-row", key: "row" },
          EDITIONS.map(function (id) {
            var pressed = edition === id;
            return h(
              "button",
              {
                key: id,
                type: "button",
                className: "nbx-cube",
                "aria-pressed": pressed ? "true" : "false",
                title: id === "auto" ? t("autoHint") : t(id),
                onClick: function () {
                  chooseEdition(id);
                },
              },
              h("span", {
                key: "dot",
                className: "nbx-dot",
                style: { backgroundImage: SWATCH[id] },
              }),
              h("span", { key: "label" }, t(id))
            );
          })
        ),
        h("div", { className: "nbx-hint", key: "hint" }, t("hint"))
      );
    }

    /* ---------- the skin layer ---------- */

    /* The stylesheet is mounted straight into <head>, not through a slot: the
       desktop preload watches `document.head` for child mutations, and that is
       the event that makes it repaint the native caption buttons. */
    function mountSkin() {
      if (typeof document === "undefined") return function () {};

      var previous = document.querySelector('style[data-nebula-style="true"]');
      if (previous) return function () { previous.remove(); };

      var element = document.createElement("style");
      element.setAttribute("data-nebula-style", "true");
      element.textContent = SKIN_CSS;
      document.head.appendChild(element);

      return function () {
        if (element.parentNode) element.parentNode.removeChild(element);
      };
    }

    function SkinLayer() {
      return h("div", { "data-nebula-edge": "true" });
    }

    /* ---------- mount ---------- */

    function apply(ctx) {
      try {
        ctx.effect(function () {
          return ctx.locale.register(NS, { zh: zh, en: en });
        }, "nebula-spectrum: dictionaries");

        var t = ctx.locale.bind(NS);

        ctx.effect(function () {
          var disposeSkin = mountSkin();
          store.scheme = schemeOf(ctx);
          applyEdition();

          var dispose = null;
          try {
            dispose = ctx.on("theme/change", function () {
              store.scheme = schemeOf(ctx);
              applyEdition();
              notify();
            });
          } catch (error) {
            console.error("[nebula-spectrum] could not follow the appearance setting.", error);
          }

          return function () {
            if (typeof dispose === "function") dispose();
            if (typeof disposeSkin === "function") disposeSkin();
            document.documentElement.removeAttribute(EDITION_ATTR);
          };
        }, "nebula-spectrum: edition");

        ctx.slots.inject("shell.overlay", function () {
          return ctx.slots.register(
            {
              name: "shell.overlay",
              id: "nebula-spectrum.skin",
              order: -30,
              label: function () {
                return t("title");
              },
            },
            function () {
              return h(SkinLayer, null);
            }
          );
        });

        ctx.slots.inject("settings.general.item", function () {
          return ctx.slots.register(
            {
              name: "settings.general.item",
              id: "nebula-spectrum.edition",
              order: 10.5,
            },
            function () {
              return h(EditionRow, { t: t });
            }
          );
        });
      } catch (error) {
        console.error(
          "[nebula-spectrum] mounting failed; the rest of the UI is unaffected.",
          error
        );
      }
    }

    exports.name = "nebula-spectrum";
    exports.inject = ["slots", "locale", "theme"];
    exports.apply = apply;

    return module.exports;
  },
});
