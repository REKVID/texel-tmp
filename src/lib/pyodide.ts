let pyodideReadyPromise: Promise<any> | null = null;

type PyodideGlobal = {
  loadPyodide: (opts: { indexURL: string }) => Promise<any>;
};

function getPyodideGlobal(): PyodideGlobal | null {
  return (window as any).loadPyodide ? (window as any as PyodideGlobal) : null;
}

async function ensurePyodideScript(pyodideVersion = "0.26.4"): Promise<void> {
  if (getPyodideGlobal()) return;

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://cdn.jsdelivr.net/pyodide/v${pyodideVersion}/full/pyodide.js`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load pyodide.js"));
    document.head.appendChild(script);
  });
}

export async function getPyodide(): Promise<any> {
  if (!pyodideReadyPromise) {
    pyodideReadyPromise = (async () => {
      await ensurePyodideScript();

      const global = getPyodideGlobal();
      if (!global) throw new Error("Pyodide global is not available after script load");

      const pyodide = await global.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
      });

      // Load common scientific stack once. If a package is already present, Pyodide skips.
      await pyodide.loadPackage(["micropip", "numpy", "pandas", "matplotlib"]);

      return pyodide;
    })();
  }

  return pyodideReadyPromise;
}

