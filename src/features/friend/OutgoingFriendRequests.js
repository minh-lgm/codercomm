import React, { useEffect, useState } from "react";
import {
  Stack,
  Typography,
  Card,
  Box,
  Pagination,
  Grid,
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getOutgoingFriendRequests, cancelRequest } from "./friendSlice";
import UserCard from "./UserCard";
import SearchInput from "../../components/SearchInput";

function OutgoingFriendRequests() {
  const [filterName, setFilterName] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);

  const { currentPageUsers, usersById, totalUsers, totalPages } = useSelector(
    (state) => state.friend
  );
  const users = currentPageUsers.map((userId) => usersById[userId]);
  const dispatch = useDispatch();

  const handleSubmit = (searchQuery) => {
    setFilterName(searchQuery);
  };

  const handleOpenCancelDialog = (user) => {
    setSelectedUser(user);
    setOpenCancelDialog(true);
  };

  const handleCloseCancelDialog = () => {
    setOpenCancelDialog(false);
    setSelectedUser(null);
  };

  const handleCancelRequest = () => {
    if (selectedUser?._id) {
      dispatch(cancelRequest(selectedUser._id));
    }
    handleCloseCancelDialog();
  };

  useEffect(() => {
    dispatch(getOutgoingFriendRequests({ filterName, page }));
  }, [filterName, page, dispatch]);

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Outgoing Friend Requests
      </Typography>
      <Card sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Stack direction={{ xs: "column", md: "row" }} alignItems="center">
            <SearchInput handleSubmit={handleSubmit} />
            <Box sx={{ flexGrow: 1 }} />
            <Typography
              variant="subtitle"
              sx={{ color: "text.secondary", ml: 1 }}
            >
              {totalUsers > 1
                ? `${totalUsers} requests sent`
                : totalUsers === 1
                ? `${totalUsers} request sent`
                : "No request sent"}
            </Typography>
          </Stack>

          <Grid container spacing={3} my={1}>
            {users.map((user) => (
              <Grid key={user._id} item xs={12} md={4}>
                <UserCard
                  profile={user}
                  actionButton={
                    <Button
                      onClick={() => handleOpenCancelDialog(user)}
                      variant="contained"
                      color="error"
                      sx={{ width: "100%" }}
                    >
                      Cancel Request
                    </Button>
                  }
                />
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            {totalUsers ? (
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, page) => setPage(page)}
              />
            ) : null}
          </Box>
        </Stack>
      </Card>

      <Dialog open={openCancelDialog} onClose={handleCloseCancelDialog}>
        <DialogTitle>Cancel Friend Request</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel your friend request to{" "}
            {selectedUser?.name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog}>No</Button>
          <Button onClick={handleCancelRequest} variant="contained" color="error">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default OutgoingFriendRequests;
