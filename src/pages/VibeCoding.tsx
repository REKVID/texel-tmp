import { useEffect, useMemo, useRef, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Loader2, Code2 } from "lucide-react";
import { getPyodide } from "@/lib/pyodide";
import { AIChat } from "@/components/AIChat";

type Lang = "html" | "python";

let monacoLoaderPromise: Promise<any> | null = null;

async function ensureMonaco() {
  if (monacoLoaderPromise) return monacoLoaderPromise;

  monacoLoaderPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      resolve(null);
      return;
    }

    if ((window as any).monaco) {
      resolve((window as any).monaco);
      return;
    }

    const loader = document.createElement("script");
    loader.src = "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs/loader.js";
    loader.async = true;
    loader.onload = () => {
      const w: any = window as any;
      if (!w.require) {
        reject(new Error("Monaco loader failed: require is not available"));
        return;
      }
      w.require.config({
        paths: {
          vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs",
        },
      });
      w.require(["vs/editor/editor.main"], () => {
        resolve(w.monaco);
      });
    };
    loader.onerror = () => reject(new Error("Failed to load Monaco editor"));
    document.head.appendChild(loader);
  });

  return monacoLoaderPromise;
}

interface VibeCodeEditorProps {
  language: Lang;
  value: string;
  onChange: (value: string) => void;
}

const VibeCodeEditor = ({ language, value, onChange }: VibeCodeEditorProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<any>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let disposed = false;

    (async () => {
      try {
        const monaco = await ensureMonaco();
        if (!monaco || disposed || !containerRef.current) return;

        editorRef.current = monaco.editor.create(containerRef.current, {
          value,
          language: language === "python" ? "python" : "html",
          theme: "vs-dark",
          automaticLayout: true,
          minimap: { enabled: false },
          fontSize: 13,
          scrollBeyondLastLine: false,
        });

        editorRef.current.onDidChangeModelContent(() => {
          const next = editorRef.current.getValue();
          onChange(next);
        });
      } catch {
        setFailed(true);
      }
    })();

    return () => {
      disposed = true;
      if (editorRef.current) {
        editorRef.current.dispose();
        editorRef.current = null;
      }
    };
  }, []);

  // Синхронизация языка и внешнего значения при смене языка/кода
  useEffect(() => {
    const monaco: any = (window as any).monaco;
    if (editorRef.current && monaco) {
      const model = editorRef.current.getModel();
      if (model) {
        const targetLang = language === "python" ? "python" : "html";
        monaco.editor.setModelLanguage(model, targetLang);
      }
      if (value !== editorRef.current.getValue()) {
        editorRef.current.setValue(value);
      }
    }
  }, [language, value]);

  if (failed) {
    // Fallback: обычный textarea
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-[420px] bg-transparent text-sm font-mono outline-none resize-none"
        spellCheck={false}
      />
    );
  }

  return <div ref={containerRef} className="w-full h-[420px]" />;
};

const DEFAULT_HTML = `<!-- HTML/JS/CSS sandbox. p5.js + three.js are preloaded -->
<div id="app"></div>
<script>
  // Example: p5.js
  function setup() {
    createCanvas(400, 300);
  }
  function draw() {
    background(10);
    fill(57, 192, 237);
    circle(mouseX, mouseY, 40);
  }
</script>
`;

const DEFAULT_PY = `import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 10, 200)
y = np.sin(x)

plt.plot(x, y)
plt.title("Hello from Pyodide + matplotlib")
plt.show()
print("done")
`;

function buildHtmlSrcDoc(userHtml: string) {
  const p5 = "https://cdn.jsdelivr.net/npm/p5@1.9.4/lib/p5.min.js";
  const three = "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js";

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html, body { margin: 0; padding: 0; background: #05070a; color: #e6f1ff; font-family: ui-sans-serif, system-ui; }
      #app { padding: 16px; }
      canvas { display: block; }
    </style>
    <script src="${p5}"></script>
    <script src="${three}"></script>
  </head>
  <body>
    ${userHtml}
  </body>
</html>`;
}

export default function VibeCoding() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [lang, setLang] = useState<Lang>("html");
  const [code, setCode] = useState<string>(DEFAULT_HTML);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<string>("Готово");

  const editor = useMemo(() => {
    // Monaco is optional at runtime (deps might not be installed yet).
    // If it's not available, we fall back to a textarea to keep the page usable.
    return null as any;
  }, []);

  const runHtml = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    iframe.srcdoc = buildHtmlSrcDoc(code);
  };

  const runPython = async () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const pyodide = await getPyodide();

    // Capture stdout
    pyodide.setStdout({
      batched: (s: string) => {
        // no-op; we include stdout via JS below
        void s;
      },
    });

    // Ensure matplotlib uses non-interactive backend.
    const boot = `
import sys, io, base64
import matplotlib
matplotlib.use("agg")
import matplotlib.pyplot as plt
`;
    await pyodide.runPythonAsync(boot);

    // Execute user code
    let stdout = "";
    pyodide.setStdout({
      batched: (s: string) => {
        stdout += s;
      },
    });
    pyodide.setStderr({
      batched: (s: string) => {
        stdout += s;
      },
    });

    await pyodide.runPythonAsync(code);

    // If figures exist, render the latest one to PNG and embed.
    const figPngBase64 = pyodide.runPython(`
import base64, io
import matplotlib.pyplot as plt
buf = io.BytesIO()
img_b64 = ""
nums = plt.get_fignums()
if nums:
    fig = plt.figure(nums[-1])
    fig.savefig(buf, format="png", bbox_inches="tight")
    buf.seek(0)
    img_b64 = base64.b64encode(buf.read()).decode("ascii")
    plt.close(fig)
img_b64
`);

    const safeText = (stdout || "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    const imgHtml = figPngBase64 ? `<img src="data:image/png;base64,${figPngBase64}" style="max-width:100%;height:auto;border-radius:12px;border:1px solid rgba(57,192,237,.2)" />` : "";

    iframe.srcdoc = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html, body { margin: 0; padding: 0; background: #05070a; color: #e6f1ff; font-family: ui-sans-serif, system-ui; }
      .wrap { padding: 16px; display: grid; gap: 12px; }
      pre { white-space: pre-wrap; word-break: break-word; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08); padding: 12px; border-radius: 12px; }
    </style>
  </head>
  <body>
    <div class="wrap">
      ${imgHtml}
      <pre>${safeText || "No output"}</pre>
    </div>
  </body>
</html>`;
  };

  const onRun = async () => {
    setIsRunning(true);
    setStatus("Запуск...");
    try {
      if (lang === "html") {
        runHtml();
      } else {
        await runPython();
      }
      setStatus("Готово");
    } catch (e: any) {
      const message = e?.message ? String(e.message) : String(e);
      setStatus(`Ошибка: ${message}`);
      const iframe = iframeRef.current;
      if (iframe) {
        iframe.srcdoc = `<pre style="white-space:pre-wrap;padding:16px">${message}</pre>`;
      }
    } finally {
      setIsRunning(false);
    }
  };

  const onLangChange = (v: string) => {
    const next = (v === "python" ? "python" : "html") as Lang;
    setLang(next);
    setCode(next === "python" ? DEFAULT_PY : DEFAULT_HTML);
    setStatus("Готово");
    // Clear preview
    if (iframeRef.current) iframeRef.current.srcdoc = "";
  };

  return (
    <div className="main-container min-h-screen">
      <ParticlesBackground />
      <div className="content-layer">
        <Navigation />

        <section className="pt-20 pb-8 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full">
                  <Code2 className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Vibe Coding</span>
                </div>
                <h1 className="text-gradient">Пиши код и смотри результат</h1>
                <p className="text-muted-foreground max-w-2xl">
                  HTML/JS запускаются в песочнице iframe, Python — через Pyodide (WASM) с поддержкой numpy/pandas/matplotlib.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Select value={lang} onValueChange={onLangChange}>
                  <SelectTrigger className="glass border-primary/20 w-[200px]">
                    <SelectValue placeholder="Язык" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="html">HTML / JS / CSS</SelectItem>
                    <SelectItem value="python">Python (Pyodide)</SelectItem>
                  </SelectContent>
                </Select>

                <Button onClick={onRun} disabled={isRunning} className="gradient-primary glow-primary">
                  {isRunning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                  Run
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-16">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col gap-4 md:flex-row">
              {/* Left: Editor */}
              <div className="glass border border-primary/20 rounded-2xl overflow-hidden md:w-1/2">
                <div className="px-4 py-3 border-b border-primary/20 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Editor • <span className="text-foreground/90">{lang === "html" ? "HTML/JS/CSS" : "Python"}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{status}</div>
                </div>

                <ScrollArea className="h-[460px]">
                  <div className="p-4">
                    <VibeCodeEditor language={lang} value={code} onChange={setCode} />
                  </div>
                </ScrollArea>
              </div>

              {/* Right: Preview + Chat hint */}
              <div className="glass border border-primary/20 rounded-2xl overflow-hidden md:w-1/2 flex flex-col">
                <div className="px-4 py-3 border-b border-primary/20 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Preview (iframe sandbox)</div>
                  <span className="text-xs text-muted-foreground">
                    Чат ИИ — кнопка внизу справа
                  </span>
                </div>
                <div className="bg-background flex-1">
                  <iframe
                    ref={iframeRef}
                    title="Vibe Coding Preview"
                    className="w-full h-[460px] bg-background"
                    sandbox="allow-scripts"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
        {/* Floating AI chat (та же модель, что и на других страницах) */}
        <AIChat />
      </div>
    </div>
  );
}

