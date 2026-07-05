import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const TOOLTIP_STYLE = {
  background: "#fff",
  border: "1px solid #F3F4F6",
  borderRadius: "12px",
  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
  fontSize: "13px",
};

function CustomLabel({ cx, cy, total }) {
  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
      <tspan x={cx} dy="-6" fontSize="22" fontWeight="700" fill="#1F2937">
        {total.toLocaleString()}
      </tspan>
      <tspan x={cx} dy="20" fontSize="11" fill="#9CA3AF">
        Total
      </tspan>
    </text>
  );
}

export function DonutChart({ data, height = 240 }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const filtered = data.filter((d) => d.value > 0);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p className="text-sm text-gray-400">No data yet</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={filtered}
          cx="50%"
          cy="45%"
          innerRadius="55%"
          outerRadius="75%"
          paddingAngle={2}
          dataKey="value"
          label={false}
          labelLine={false}
        >
          {filtered.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
          <CustomLabel total={total} />
        </Pie>
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          formatter={(value, name) => [
            `${value.toLocaleString()} (${total ? Math.round((value / total) * 100) : 0}%)`,
            name,
          ]}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
