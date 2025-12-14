import {
  Box,
  Typography,
  Stack,
  Avatar,
  Divider,
  CircularProgress,
  IconButton,
  Collapse,
  Button,
} from "@mui/material";
import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const ALBUMS_PER_PAGE = 5;

type Track = {
  title: string;
  duration: string;
};

type AlbumWithTracks = {
  title: string;
  image: string;
  tracks: Track[];
};

type PopularTracksProps = {
  albums: AlbumWithTracks[];
  loading: boolean;
};

export default function PopularTracks({ albums, loading }: PopularTracksProps) {
  const [expandedAlbumTitle, setExpandedAlbumTitle] = useState<string | null>(
    null
  );

  const [currentPage, setCurrentPage] = useState(1);

  const toggleTrackList = (title: string) => {
    setExpandedAlbumTitle(title === expandedAlbumTitle ? null : title);
  };

  const totalAlbums = albums.length;
  const totalPages = Math.ceil(totalAlbums / ALBUMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ALBUMS_PER_PAGE;
  const endIndex = startIndex + ALBUMS_PER_PAGE;

  const albumsToDisplay = albums.slice(startIndex, endIndex);

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
    setExpandedAlbumTitle(null);
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
    setExpandedAlbumTitle(null);
  };

  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages || totalPages === 0;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h6"
        sx={{ color: "white", fontWeight: 600, mb: 2 }}
      >
        Albums
      </Typography>

      {loading ? (
        <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
          <CircularProgress size={28} color="inherit" />
        </Stack>
      ) : albums.length === 0 ? (
        <Box sx={{ px: 3, py: 3 }}>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "0.9rem",
            }}
          >
            No albums available.
          </Typography>
        </Box>
      ) : (
        <>
          {albumsToDisplay.map((album) => {
            const isExpanded = album.title === expandedAlbumTitle;

            return (
              <Box
                key={album.title}
                sx={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  borderRadius: "12px",
                  overflow: "hidden",
                  mb: 3,
                }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{
                    px: 3,
                    py: 2,
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.06)",
                    },
                  }}
                  onClick={() => toggleTrackList(album.title)}
                >
                  <Avatar
                    variant="rounded"
                    src={album.image}
                    sx={{ width: 64, height: 64 }}
                  />

                  <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ color: "white", fontWeight: 600 }}>
                      {album.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: "rgba(255,255,255,0.5)",
                        fontSize: "0.85rem",
                      }}
                    >
                      {album.tracks.length} tracks
                    </Typography>
                  </Box>
                  {/* Collapse/Expand Icon */}
                  <IconButton
                    size="small"
                    sx={{ color: "white" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTrackList(album.title);
                    }}
                  >
                    {isExpanded ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )}
                  </IconButton>
                </Stack>

                {/* Collapsible Tracks */}
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
                  <Box>
                    {album.tracks.map((track, index) => (
                      <Box key={track.title}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={2}
                          sx={{
                            px: 3,
                            py: 1.3,
                            "&:hover": {
                              backgroundColor: "rgba(255,255,255,0.06)",
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              width: "24px",
                              color: "rgba(255,255,255,0.6)",
                              fontSize: "0.9rem",
                              textAlign: "center",
                            }}
                          >
                            {index + 1}
                          </Typography>

                          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography
                              sx={{
                                color: "white",
                                fontWeight: 500,
                                fontSize: "0.95rem",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {track.title}
                            </Typography>
                          </Box>

                          <Typography
                            sx={{
                              color: "rgba(255,255,255,0.6)",
                              fontSize: "0.8rem",
                            }}
                          >
                            {track.duration}
                          </Typography>
                        </Stack>

                        {index !== album.tracks.length - 1 && (
                          <Divider
                            sx={{ borderColor: "rgba(255,255,255,0.05)" }}
                          />
                        )}
                      </Box>
                    ))}
                  </Box>
                </Collapse>
              </Box>
            );
          })}

          {/* --- Pagination Controls --- */}
          {totalPages > 1 && (
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mt: 3, px: 2 }}
            >
              <Button
                variant="text"
                startIcon={<ArrowBackIosNewIcon sx={{ fontSize: '0.8rem' }} />}
                onClick={goToPreviousPage}
                disabled={isPrevDisabled}
                sx={{ color: isPrevDisabled ? 'rgba(255,255,255,0.3)' : 'white' }}
              >
                Previous
              </Button>

              <Typography
                sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem" }}
              >
                Page {currentPage} of {totalPages}
              </Typography>

              <Button
                variant="text"
                endIcon={<ArrowForwardIosIcon sx={{ fontSize: '0.8rem' }} />}
                onClick={goToNextPage}
                disabled={isNextDisabled}
                sx={{ color: isNextDisabled ? 'rgba(255,255,255,0.3)' : 'white' }}
              >
                Next
              </Button>
            </Stack>
          )}
        </>
      )}
    </Box>
  );
}
