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
    var EDITIONS = __EDITIONS_JSON__;
    var STORAGE_KEY = "dsh.nebula-spectrum.v1";
    var EDITION_ATTR = "data-nebula-edition";
    var SCHEME_ATTR = "data-nebula-scheme";

    var BY_ID = {};
    for (var i = 0; i < EDITIONS.length; i += 1) BY_ID[EDITIONS[i].id] = EDITIONS[i];

    var AUTO = "auto";
    var DEFAULT_DARK = "nebula";
    var DEFAULT_LIGHT = "nebula-light";

    /* ---------- dictionaries ---------- */

    var en = {
      title: "Nebula Spectrum",
      hint: "An aurora canvas, a glass sidebar and a spectrum-rimmed composer. Each edition keeps its own palette at the window edges.",
      auto: "Follow appearance",
      autoHint: "Pick an edition from the host's light or dark appearance.",
      darkGroup: "Dark editions",
      lightGroup: "Light editions",
    };

    var zh = {
      title: "星云光谱",
      hint: "极光画布、玻璃侧边栏与光谱描边的输入框。每套版本都保留自己的配色与窗口边缘的光谱。",
      auto: "跟随外观",
      autoHint: "跟随宿主界面的浅色 / 深色外观自动选择版本。",
      darkGroup: "深色版本",
      lightGroup: "浅色版本",
    };

    for (var e = 0; e < EDITIONS.length; e += 1) {
      en[EDITIONS[e].id] = EDITIONS[e].en;
      zh[EDITIONS[e].id] = EDITIONS[e].zh;
    }

    /* ---------- the edition store ----------
       A preference this plugin owns. It never registers a DSH theme, because
       only the light / dark / system preferences persist through the host and
       only those three appear in the built-in appearance row. */

    /* Editions that older releases named differently, so a stored choice keeps
       working across the upgrade (0.1.x had `light` and a now-retired `onyx`). */
    var MIGRATION = { light: "nebula-light", onyx: "nebula" };

    var AUTO_SWATCH = "linear-gradient(90deg, #0a171f 0 50%, #fcfbfd 50% 100%)";

    function readEdition() {
      try {
        var raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return AUTO;
        var parsed = JSON.parse(raw);
        var edition = parsed && parsed.edition;
        if (MIGRATION[edition]) return MIGRATION[edition];
        return BY_ID[edition] ? edition : AUTO;
      } catch (error) {
        return AUTO;
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
      if (store.edition !== AUTO && BY_ID[store.edition]) return store.edition;
      return store.scheme === "light" ? DEFAULT_LIGHT : DEFAULT_DARK;
    }

    function applyEdition() {
      var root = document.documentElement;
      var edition = resolvedEdition();
      var meta = BY_ID[edition] || BY_ID[DEFAULT_DARK];
      if (root.getAttribute(EDITION_ATTR) !== edition) {
        root.setAttribute(EDITION_ATTR, edition);
      }
      /* `color-scheme` is keyed off this attribute in the scaffolding, so that
         a dark edition forces dark native controls even when the host's own
         appearance is light (and the other way round). */
      if (root.getAttribute(SCHEME_ATTR) !== meta.base) {
        root.setAttribute(SCHEME_ATTR, meta.base);
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
      if (edition !== AUTO && !BY_ID[edition]) return;
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

    function editionsOfGroup(group) {
      return EDITIONS.filter(function (edition) {
        return edition.group === group;
      });
    }

    /* ---------- the edition picker ---------- */

    var ROW_CSS =
      ".nbx-group{display:flex;flex-direction:column;gap:8px;padding:16px 0;border-bottom:.5px solid var(--dsw-alias-border-l2)}" +
      ".nbx-title{color:var(--dsw-alias-label-primary);font-size:14px;font-weight:400;line-height:22px}" +
      ".nbx-hint{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}" +
      ".nbx-sub{color:var(--dsw-alias-label-caption);font-size:12px;line-height:18px;margin-top:2px}" +
      ".nbx-row{display:flex;flex-wrap:wrap;align-items:stretch;gap:8px}" +
      ".nbx-cube{box-sizing:border-box;flex:1 1 116px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:12px 8px;border:.5px solid var(--dsw-alias-border-l4);border-radius:var(--dsw-radius-xl);background:0 0;color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:20px;cursor:pointer;transition:background-color .16s ease,border-color .16s ease}" +
      ".nbx-cube:hover{background:var(--dsw-alias-interactive-bg-hover)}" +
      ".nbx-cube[aria-pressed=true]{border-color:var(--dsw-alias-border-selected);background:var(--dsw-alias-bg-module-platform)}" +
      ".nbx-cube--auto{flex:1 1 100%}" +
      ".nbx-dot{width:34px;height:34px;border-radius:999px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.18),0 1px 2px rgba(0,0,0,.18)}";

    function cube(t, edition, pressed) {
      var id = edition ? edition.id : AUTO;
      var swatch = edition ? edition.swatch : AUTO_SWATCH;
      var label = edition ? editionLabel(t, edition) : t("auto");
      return h(
        "button",
        {
          key: id,
          type: "button",
          className: "nbx-cube" + (edition ? "" : " nbx-cube--auto"),
          "aria-pressed": pressed ? "true" : "false",
          title: edition ? t(id) : t("autoHint"),
          onClick: function () {
            chooseEdition(id);
          },
        },
        h("span", {
          key: "dot",
          className: "nbx-dot",
          style: { backgroundImage: swatch },
        }),
        h("span", { key: "label" }, label)
      );
    }

    /* The PI plugin labels the editions `光谱·青蓝` in Chinese and `Indigo` in
       English; the active locale decides which of the two is shown. */
    function editionLabel(t, edition) {
      var label = t(edition.id);
      return label && label !== edition.id ? label : edition.en;
    }

    function EditionRow(props) {
      var t = props.t;
      var state = useStore();
      var edition = state.edition;
      var dark = editionsOfGroup("dark");
      var light = editionsOfGroup("light");

      var children = [
        h("style", { key: "css", dangerouslySetInnerHTML: { __html: ROW_CSS } }),
        h("div", { className: "nbx-title", key: "title" }, t("title")),
        h("div", { className: "nbx-row", key: "auto" }, cube(t, null, edition === AUTO)),
      ];

      if (dark.length) {
        children.push(h("div", { className: "nbx-sub", key: "dark-sub" }, t("darkGroup")));
        children.push(
          h(
            "div",
            { className: "nbx-row", key: "dark" },
            dark.map(function (entry) {
              return cube(t, entry, edition === entry.id);
            })
          )
        );
      }

      if (light.length) {
        children.push(h("div", { className: "nbx-sub", key: "light-sub" }, t("lightGroup")));
        children.push(
          h(
            "div",
            { className: "nbx-row", key: "light" },
            light.map(function (entry) {
              return cube(t, entry, edition === entry.id);
            })
          )
        );
      }

      children.push(h("div", { className: "nbx-hint", key: "hint" }, t("hint")));

      return h("div", { className: "nbx-group" }, children);
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
            document.documentElement.removeAttribute(SCHEME_ATTR);
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
