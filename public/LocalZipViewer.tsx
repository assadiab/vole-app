import React, { useState } from "react";

import { ImageViewerApp } from "../src";

/**
 * Minimal page that loads a local OME-Zarr packaged as a `.zip` directly into
 * the Vol-E viewer — no HTTP server, no URL, no full extraction. The selected
 * `File` (a `Blob`) is handed to `ImageViewerApp` via the `zipData` prop; the
 * loader reads chunks lazily out of the zip on demand.
 *
 * Reachable at `/local` once registered as a route (see public/index.tsx).
 */
export default function LocalZipViewer(): React.ReactElement {
  const [zipFile, setZipFile] = useState<File | undefined>(undefined);
  const [rootPath, setRootPath] = useState<string>("");

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: 8, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <label>
          Open local OME-Zarr (.zip):{" "}
          <input
            type="file"
            accept=".zip,application/zip"
            onChange={(e) => setZipFile(e.target.files?.[0] ?? undefined)}
          />
        </label>
        <input
          type="text"
          placeholder="zarr root inside zip (optional — auto-detected)"
          value={rootPath}
          onChange={(e) => setRootPath(e.target.value)}
          style={{ width: 320 }}
        />
        {zipFile && (
          <span>
            Loaded: {zipFile.name} ({(zipFile.size / 1e6).toFixed(1)} MB)
          </span>
        )}
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        {zipFile && (
          <ImageViewerApp
            // Remount cleanly whenever the source changes.
            key={zipFile.name + ":" + rootPath}
            imageUrl=""
            zipData={zipFile}
            zipRootPath={rootPath || undefined}
            cellId=""
            imageDownloadHref=""
            parentImageDownloadHref=""
            appHeight="100%"
            canvasMargin="0 0 0 0"
          />
        )}
      </div>
    </div>
  );
}
