/**
 * Client-side resume text extraction.
 * PDF: parsed via pdfjs-dist (lazy dynamic import — no extra bundle weight until needed).
 * DOCX: not yet supported — throws a user-visible error code.
 */

// Vite resolves this static URL at build time and emits the worker as a hashed asset.
// Must be a module-level literal so Vite's static analyser can pick it up.
const PDF_WORKER_URL = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
);

/**
 * Extract plain text from a PDF File object.
 * @param {File} file
 * @returns {Promise<string>}
 */
async function parsePdf(file) {
  // Lazy-load pdfjs so it doesn't bloat the initial bundle.
  const pdfjsLib = await import("pdfjs-dist");

  // Point the worker at the locally-bundled asset — no CDN dependency.
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_URL.href;
  }

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  const pages = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    pages.push(pageText);
  }

  return pages.join("\n\n").replace(/\s{3,}/g, "  ").trim();
}

/**
 * Dispatch to the right parser based on file extension.
 * @param {File} file
 * @returns {Promise<string>}
 */
export async function parseResumeFile(file) {
  const ext = file.name.split(".").pop()?.toLowerCase();

  if (ext === "pdf") {
    return parsePdf(file);
  }

  if (ext === "docx" || ext === "doc") {
    // TODO: add mammoth.js for DOCX — not yet implemented.
    throw Object.assign(new Error("DOCX parsing not yet supported."), {
      code: "docx_not_supported",
    });
  }

  throw Object.assign(new Error(`Unsupported file type: .${ext}`), {
    code: "unsupported_type",
  });
}
