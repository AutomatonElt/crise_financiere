#!/usr/bin/env python3
"""
Exécute un script JavaScript directement dans Cavalry 2D via le pont Stallion HTTP (port 8080).

Usage :
    python scripts/cavalry/run_cavalry_script.py chemin/vers/mon_script.js
    python scripts/cavalry/run_cavalry_script.py --code "api.play();"
"""

import sys
import argparse
import requests
import json

import os
import time
from pathlib import Path

STALLION_URL = "http://127.0.0.1:8080/post"
OUT_FILE_WINE = "C:/cavalry_out.json"
OUT_FILE_LINUX = Path.home() / ".cavalry" / "drive_c" / "cavalry_out.json"

def wrap_code(code: str) -> str:
    escaped_code = json.dumps(code)
    escaped_out = json.dumps(OUT_FILE_WINE)
    return f"""
    (function () {{
      var __env = {{ ok: true, noResult: false, result: null, logs: [], error: null }};
      var __orig = {{}};
      ["log", "warn", "error", "info"].forEach(function (k) {{
        if (typeof console !== "undefined" && typeof console[k] === "function") {{
          __orig[k] = console[k];
          console[k] = function () {{
            var parts = [];
            for (var i = 0; i < arguments.length; i++) {{
              var a = arguments[i];
              if (typeof a === "string") {{ parts.push(a); }}
              else {{ try {{ parts.push(JSON.stringify(a)); }} catch (e) {{ parts.push(String(a)); }} }}
            }}
            __env.logs.push((k === "log" ? "" : k + ": ") + parts.join(" "));
          }};
        }}
      }});
      try {{
        var __r = eval({escaped_code});
        if (__r === undefined) {{ __env.noResult = true; }}
        else {{
          try {{ JSON.stringify(__r); __env.result = __r; }}
          catch (e) {{ __env.result = String(__r); }}
        }}
      }} catch (e) {{
        __env.ok = false;
        __env.error = (e && e.message) ? String(e.message) : String(e);
        if (e && e.stack) {{ __env.error += "\\n" + String(e.stack); }}
      }}
      Object.keys(__orig).forEach(function (k) {{ console[k] = __orig[k]; }});
      var __text;
      try {{ __text = JSON.stringify(__env); }}
      catch (e) {{ __text = JSON.stringify({{ ok: false, noResult: true, result: null, logs: [], error: "Could not serialize: " + String(e) }}); }}
      
      try {{
        if (typeof api.writeToFile === 'function') {{
          api.writeToFile({escaped_out}, __text);
        }}
      }} catch(e) {{}}
    }})();
    """

def execute_in_cavalry(code: str, wait_result: bool = True, timeout: float = 6.0) -> bool:
    try:
        if OUT_FILE_LINUX.exists():
            OUT_FILE_LINUX.unlink()
        
        wrapped = wrap_code(code)
        payload = {"type": "script", "code": wrapped}
        response = requests.post(STALLION_URL, json=payload, timeout=8)
        if response.status_code != 200 or "Success" not in response.text:
            print(f"⚠️ Réponse inattendue de Stallion ({response.status_code}): {response.text}")
            return False

        if not wait_result:
            return True

        deadline = time.time() + timeout
        while time.time() < deadline:
            if OUT_FILE_LINUX.exists():
                try:
                    data = json.loads(OUT_FILE_LINUX.read_text(encoding="utf-8"))
                    OUT_FILE_LINUX.unlink()
                    if data.get("logs"):
                        print("[console]\n" + "\n".join(data["logs"]))
                    if not data.get("ok"):
                        print(f"❌ Erreur Cavalry: {data.get('error')}")
                        return False
                    if not data.get("noResult"):
                        res = data.get("result")
                        if isinstance(res, (dict, list)):
                            print(json.dumps(res, indent=2))
                        else:
                            print(res)
                    return True
                except Exception:
                    pass
            time.sleep(0.05)
        
        print(f"⏱️ Timeout dépassé ({timeout}s) en attendant la réponse de Cavalry.")
        return False
    except requests.exceptions.ConnectionError:
        print("❌ Erreur de connexion : Impossible de joindre Stallion sur 127.0.0.1:8080.")
        return False
    except Exception as e:
        print(f"❌ Erreur : {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description="Envoyer du code JavaScript à Cavalry 2D via Stallion")
    parser.add_argument("file", nargs="?", help="Fichier .js à exécuter")
    parser.add_argument("--code", "-c", help="Code JavaScript inline à exécuter")

    args = parser.parse_args()

    if args.code:
        execute_in_cavalry(args.code)
    elif args.file:
        try:
            with open(args.file, "r", encoding="utf-8") as f:
                code = f.read()
            execute_in_cavalry(code)
        except Exception as e:
            print(f"❌ Impossible de lire le fichier '{args.file}': {e}")
            sys.exit(1)
    else:
        parser.print_help()
        sys.exit(1)

if __name__ == "__main__":
    main()
