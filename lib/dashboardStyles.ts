export const dashboardStyles = {
  metricsCard: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '24px'
  },
  metricsTable: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginTop: '16px'
  },
  tableHeader: {
    backgroundColor: '#2a2a2a',
    color: '#00ffff',
    padding: '12px 16px',
    textAlign: 'left' as const,
    fontSize: '14px',
    fontWeight: '600',
    borderBottom: '1px solid #444'
  },
  tableCell: {
    padding: '12px 16px',
    borderBottom: '1px solid #333',
    color: '#fff',
    fontSize: '14px'
  },
  metricValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#00ffff',
    marginBottom: '8px'
  },
  metricLabel: {
    fontSize: '14px',
    color: '#999',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  },
  chartContainer: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '24px'
  },
  buttonPrimary: {
    backgroundColor: '#00ffff',
    color: '#000',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    color: '#00ffff',
    border: '1px solid #00ffff',
    padding: '8px 16px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  input: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    color: '#fff',
    padding: '12px 16px',
    borderRadius: '4px',
    fontSize: '14px',
    width: '100%'
  },
  select: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    color: '#fff',
    padding: '12px 16px',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer'
  },
  modal: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '32px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto'
  },
  mainContent: {
    padding: '32px',
    maxWidth: 'none',
    margin: '0'
  }
} 