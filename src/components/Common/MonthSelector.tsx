import { Button, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { formatMonth, getCurrentMonth } from "../../utils/format";

type MonthSelectorProps = {
  value: Date;
  onChange: (date: Date) => void;
};

function MonthSelector({ value, onChange }: MonthSelectorProps) {
  const currentMonth = getCurrentMonth();
  const isCurrentMonth =
    value.getFullYear() === currentMonth.getFullYear() && value.getMonth() === currentMonth.getMonth();

  const changeMonth = (offset: number) =>
    onChange(new Date(value.getFullYear(), value.getMonth() + offset, 1));

  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
      <Tooltip title="Mes anterior">
        <IconButton onClick={() => changeMonth(-1)}>
          <ChevronLeftIcon />
        </IconButton>
      </Tooltip>

      <Typography variant="subtitle1" sx={{ minWidth: 160, textAlign: "center", fontWeight: 500 }}>
        {formatMonth(value)}
      </Typography>

      <Tooltip title="Mes siguiente">
        <IconButton onClick={() => changeMonth(1)}>
          <ChevronRightIcon />
        </IconButton>
      </Tooltip>

      {!isCurrentMonth && (
        <Button size="small" onClick={() => onChange(getCurrentMonth())}>
          Mes actual
        </Button>
      )}
    </Stack>
  );
}

export default MonthSelector;