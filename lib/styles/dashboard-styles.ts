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
  input: {
    backgroundColor: '#2a2a2a',
    border: '1px solid #444',
    borderRadius: '4px',
    padding: '12px 16px',
    color: '#fff',
    fontSize: '14px',
    width: '100%'
  },
  button: {
    backgroundColor: '#00ffff',
    color: '#000',
    border: 'none',
    borderRadius: '4px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    color: '#00ffff',
    border: '1px solid #00ffff',
    borderRadius: '4px',
    padding: '8px 16px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  modal: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
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
  }
}