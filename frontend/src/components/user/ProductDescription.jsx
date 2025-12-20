import { useState } from "react";

const ProductDescription = ({ text, clampLines = 4 }) => {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;

  const lines = text.split("\n").map((l) => l.trim());

  const blocks = [];
  let lastWasBullet = false;

  lines.forEach((line) => {
    if (line === "•" || line === "-") {
      lastWasBullet = true;
      return;
    }

    if (/^\d+\.\s+/.test(line)) {
      blocks.push({
        type: "number",
        content: line.replace(/^\d+\.\s+/, ""),
      });
      lastWasBullet = false;
      return;
    }

    if (lastWasBullet || /^[-•*]\s+/.test(line)) {
      blocks.push({
        type: "bullet",
        content: line.replace(/^[-•*]\s*/, ""),
      });
      lastWasBullet = false;
      return;
    }

    if (!line) {
      lastWasBullet = false;
      return;
    }

    blocks.push({ type: "paragraph", content: line });
    lastWasBullet = false;
  });

  const paragraphs = blocks.filter((b) => b.type === "paragraph");
  const lists = blocks.filter((b) => b.type !== "paragraph");

  const format = (text) =>
    text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/^([^:]{3,40}:)/, "<strong>$1</strong>");

  return (
    <div className="mt-2 text-slate-600 leading-relaxed">
      {/* PARAGRAPHS */}
      <div className={expanded ? "" : "line-clamp-4"}>
        {paragraphs.map((b, i) => (
          <p
            key={i}
            className="mb-2 text-sm"
            dangerouslySetInnerHTML={{ __html: format(b.content) }}
          />
        ))}
      </div>

      {/* BULLETS / LISTS */}
      <div className="mt-2 space-y-1">
        {lists.map((b, i) => (
          <div key={i} className="flex gap-2 text-xs text-slate-500">
            <span>•</span>
            <span
              dangerouslySetInnerHTML={{
                __html: format(b.content),
              }}
            />
          </div>
        ))}
      </div>

      {/* READ MORE */}
      {paragraphs.length > clampLines && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-xs text-orange-600 font-medium hover:underline"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
};

export default ProductDescription;
