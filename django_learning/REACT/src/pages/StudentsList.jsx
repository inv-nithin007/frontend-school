import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Box,
  TablePagination
} from "@mui/material";
import axios from "../utils/axios";

export default function StudentsList() {
  const [rows, setRows]       = useState([]);
  const [count, setCount]     = useState(0);
  const [page, setPage]       = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  const fetch = async (p = page, rpp = rowsPerPage) => {
    setLoading(true);
    try {
      const token   = localStorage.getItem("access");
      const res     = await axios.get("/api/students/", {
        headers: { Authorization: `Bearer ${token}` },
        params : { limit: rpp, offset: p * rpp }
      });
      const data    = res.data.results || res.data;
      setRows(data);
      setCount(res.data.count || data.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [page, rowsPerPage]);

  const handleChangePage      = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  if (loading) return (
    <Container sx={{ mt: 4, textAlign: "center" }}>
      <CircularProgress />
    </Container>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Students</Typography>
      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{`${s.first_name} ${s.last_name}`}</TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>{s.class_grade}</TableCell>
                  <TableCell>{s.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
}