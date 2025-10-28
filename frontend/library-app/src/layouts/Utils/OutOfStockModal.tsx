import React from 'react';

interface OutOfStockModalProps {
    show: boolean;
    onClose: () => void;
    bookTitle?: string;
}

export const OutOfStockModal: React.FC<OutOfStockModalProps> = ({ show, onClose, bookTitle }) => {
    if (!show) return null;

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title text-danger">
                            <i className="fas fa-exclamation-triangle me-2"></i>
                            Sách đã hết
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div className="text-center">
                            <i className="fas fa-book fa-3x text-muted mb-3"></i>
                            <h6 className="mb-3">
                                Sorry ! Book <strong>"{bookTitle}"</strong> is out of stock now !!!
                            </h6>
                            <p className="text-muted">
                                Choose another book !
                            </p>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Close
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                                onClose();
                                window.location.href = '/search';
                            }}
                        >
                            Find another book
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};