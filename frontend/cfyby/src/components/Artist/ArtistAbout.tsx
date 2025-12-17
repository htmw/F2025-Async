import { Box, Typography, Stack, Collapse, IconButton } from "@mui/material";
import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

type ArtistAboutProps = {
  artist?: {
    summary?: string;
    location?: string;
  };
};

export default function ArtistAbout({ artist }: ArtistAboutProps) {
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  const toggleSummary = () => {
    setIsSummaryExpanded((prev) => !prev);
  };

  const COLLAPSED_HEIGHT = 80;

  return (
    <Box
      sx={{
        backgroundColor: "rgba(255,255,255,0.03)",
        borderRadius: "12px",
        p: 2,
      }}
    >
      <Typography variant="h6" sx={{ color: "white", fontWeight: 600, mb: 2 }}>
        About
      </Typography>

      <Box sx={{ position: 'relative', mb: 3 }}>
        <Collapse
          in={isSummaryExpanded}
          collapsedSize={COLLAPSED_HEIGHT}
          timeout="auto"
        >
          <Typography
            sx={{
              color: "white",
              fontSize: "0.9rem",
              lineHeight: 1.4,
              pb: isSummaryExpanded ? 0 : '10px',
            }}
          >
            {artist?.summary || 'No summary available for this artist.'}
          </Typography>
        </Collapse>

        {!isSummaryExpanded && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '30px',
              pointerEvents: 'none',
              borderRadius: '0 0 12px 12px',
            }}
          />
        )}

        {artist?.summary && artist.summary.length > 100 && (
          <Stack
            direction="row"
            alignItems="center"
            onClick={toggleSummary}
            sx={{
              cursor: "pointer",
              mt: 1,
              color: "rgba(255,255,255,0.7)",
              "&:hover": { color: "white" },
            }}
          >
            <Typography
              sx={{
                fontSize: "0.8rem",
                fontWeight: 600,
                textTransform: "uppercase",
                ml: 0.5,
              }}
            >
              {isSummaryExpanded ? "Show Less" : "Read More"}
            </Typography>
            <IconButton size="small" sx={{ color: "inherit" }}>
              {isSummaryExpanded ? (
                <KeyboardArrowUpIcon fontSize="small" />
              ) : (
                <KeyboardArrowDownIcon fontSize="small" />
              )}
            </IconButton>
          </Stack>
        )}
      </Box>

      <Stack spacing={1.5}>
        <Box>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontWeight: 500,
            }}
          >
            Origin
          </Typography>
          <Typography
            sx={{
              color: "white",
              fontWeight: 600,
              fontSize: "0.95rem",
            }}
          >
            {`${artist?.location || 'Unknown'}`}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
