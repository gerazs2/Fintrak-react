import { Paper, Skeleton, Typography } from "@mui/material";
import { formatCurrency } from "../../utils/format";

type SummaryCardProps = {
  title: string;
  value: number | undefined;
  color: "success.main" | "error.main" | "text.primary";
  loading?: boolean;
};

function SummaryCard({ title, value, color, loading = false }: SummaryCardProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5 }}>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      {loading || value === undefined ? (
        <Skeleton width="60%" height={40} />
      ) : (
        <Typography variant="h5" sx={{ fontWeight: 600, color, mt: 0.5 }}>
          {formatCurrency(value)}
        </Typography>
      )}
    </Paper>
  );
}

export default SummaryCard;