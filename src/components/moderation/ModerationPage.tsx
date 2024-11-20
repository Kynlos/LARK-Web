import React from 'react';
import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Check as ApproveIcon,
  Close as RejectIcon
} from '@mui/icons-material';

interface Report {
  id: string;
  reportedBy: string;
  reportedUser: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: Date;
  details: string;
}

const mockReports: Report[] = [
  {
    id: '1',
    reportedBy: 'user1',
    reportedUser: 'user2',
    reason: 'Inappropriate content',
    status: 'pending',
    timestamp: new Date(),
    details: 'User posted inappropriate content in the comments'
  },
  {
    id: '2',
    reportedBy: 'user3',
    reportedUser: 'user4',
    reason: 'Spam',
    status: 'approved',
    timestamp: new Date(),
    details: 'Multiple spam messages in different threads'
  }
];

export const ModerationPage = () => {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [moderationNote, setModerationNote] = useState('');

  const handleAction = (reportId: string, action: 'approve' | 'reject') => {
    setReports(prev =>
      prev.map(report =>
        report.id === reportId
          ? { ...report, status: action === 'approve' ? 'approved' : 'rejected' }
          : report
      )
    );
  };

  const handleDelete = (reportId: string) => {
    setReports(prev => prev.filter(report => report.id !== reportId));
  };

  const handleViewDetails = (report: Report) => {
    setSelectedReport(report);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedReport(null);
    setIsDialogOpen(false);
    setModerationNote('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Moderation Dashboard
      </Typography>

      <Paper sx={{ mt: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Reported By</TableCell>
                <TableCell>Reported User</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.reportedBy}</TableCell>
                  <TableCell>{report.reportedUser}</TableCell>
                  <TableCell>{report.reason}</TableCell>
                  <TableCell>
                    <Chip
                      label={report.status}
                      color={getStatusColor(report.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {report.timestamp.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span>
                      <IconButton
                        size="small"
                        onClick={() => handleAction(report.id, 'approve')}
                        disabled={report.status !== 'pending'}
                      >
                        <ApproveIcon />
                      </IconButton>
                    </span>
                    <span>
                      <IconButton
                        size="small"
                        onClick={() => handleAction(report.id, 'reject')}
                        disabled={report.status !== 'pending'}
                      >
                        <RejectIcon />
                      </IconButton>
                    </span>
                    <IconButton
                      size="small"
                      onClick={() => handleViewDetails(report)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(report.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedReport && (
          <>
            <DialogTitle>Report Details</DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Reported By</Typography>
                <Typography>{selectedReport.reportedBy}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Reported User</Typography>
                <Typography>{selectedReport.reportedUser}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Reason</Typography>
                <Typography>{selectedReport.reason}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Details</Typography>
                <Typography>{selectedReport.details}</Typography>
              </Box>
              <TextField
                fullWidth
                label="Moderation Note"
                multiline
                rows={4}
                value={moderationNote}
                onChange={(e) => setModerationNote(e.target.value)}
                sx={{ mt: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button
                onClick={() => handleAction(selectedReport.id, 'approve')}
                color="success"
                disabled={selectedReport.status !== 'pending'}
              >
                Approve
              </Button>
              <Button
                onClick={() => handleAction(selectedReport.id, 'reject')}
                color="error"
                disabled={selectedReport.status !== 'pending'}
              >
                Reject
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};
