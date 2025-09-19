"use client";

function ControlHandleGroup({ prevV, pV, ctrlV, isMid, index, onStartDrag }) {
  return (
    <g key={`handles-${index}`}>
      {ctrlV && prevV && (
        <>
          <line x1={prevV.x} y1={prevV.y} x2={ctrlV.x} y2={ctrlV.y} stroke="#aaa" strokeDasharray="2,2" />
          <line x1={pV.x} y1={pV.y} x2={ctrlV.x} y2={ctrlV.y} stroke="#aaa" strokeDasharray="2,2" />
        </>
      )}
      <rect
        x={ctrlV.x - 6}
        y={ctrlV.y - 6}
        width={12}
        height={12}
        rx={2}
        fill={isMid ? "#ffc107" : "#0dcaf0"}
        stroke="#01214f"
        strokeWidth={1}
        data-handle
        style={{ cursor: "grab", pointerEvents: "auto" }}
        onMouseDown={(e) => onStartDrag(isMid ? 'mid' : 'control', index, e)}
      />
    </g>
  );
}

function AnchorPoint({ p, i, selected, scrollPos, setSelectedIndex, onStartDrag }) {
  const cx = p.x - scrollPos.x;
  const cy = p.y - scrollPos.y;
  return (
    <g key={`p-${i}`}>
      {selected && (
        <circle cx={cx} cy={cy} r={10} fill="none" stroke="#ff377a" strokeWidth={2} pointerEvents="none" />
      )}
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill={i === 0 ? "#23cf67" : "#557bf4"}
        stroke="#01214f"
        strokeWidth={1}
        data-handle
        style={{ cursor: "grab", pointerEvents: "auto" }}
        onMouseDown={(e) => onStartDrag('anchor', i, e)}
        onClick={(e) => { e.stopPropagation(); setSelectedIndex(i); }}
      />
    </g>
  );
}

export default function PathCanvas({
  points,
  selectedIndex,
  setSelectedIndex,
  scrollPos,
  svgPath,
  onStartDrag,
}) {
  return (
    <svg
      width="100vw"
      height="100vh"
      style={{ position: "absolute", top: 0, left: 0, zIndex: 10000, background: "transparent", pointerEvents: "none" }}
    >
      {svgPath && (
        <g transform={`translate(${-scrollPos.x}, ${-scrollPos.y})`}>
          <path d={svgPath} fill="none" stroke="#ff377a" strokeWidth={2} strokeDasharray="6,4" />
        </g>
      )}

      {points.map((p, i) => {
        if (i === 0) return null;
        const prev = points[i - 1];
        const hasCtrl = !!p.control;
        const mid = { x: (prev.x + p.x) / 2, y: (prev.y + p.y) / 2 };
        const ctrl = hasCtrl ? p.control : mid;
        const ctrlV = { x: (ctrl.x || 0) - scrollPos.x, y: (ctrl.y || 0) - scrollPos.y };
        const prevV = { x: prev.x - scrollPos.x, y: prev.y - scrollPos.y };
        const pV = { x: p.x - scrollPos.x, y: p.y - scrollPos.y };
        const isMid = !hasCtrl;
        return (
          <ControlHandleGroup
            key={`h-${i}`}
            prevV={hasCtrl ? prevV : null}
            pV={hasCtrl ? pV : null}
            ctrlV={ctrlV}
            isMid={isMid}
            index={i}
            onStartDrag={onStartDrag}
          />
        );
      })}

      {points.map((p, i) => (
        <AnchorPoint
          key={`a-${i}`}
          p={p}
          i={i}
          selected={selectedIndex === i}
          scrollPos={scrollPos}
          setSelectedIndex={setSelectedIndex}
          onStartDrag={onStartDrag}
        />
      ))}
    </svg>
  );
}
