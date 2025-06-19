import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getInteractor } from './TableInteractor';
import './Table.css';

const TablePage = () => {
    const [tableData, setTableData] = useState({ headers: [], rows: [] });
    const [editingCell, setEditingCell] = useState(null);
    const interactor = useMemo(() => getInteractor(), []);

    const loadTable = useCallback(async () => {
        const data = await interactor.getTable();
        setTableData(data);
    }, [interactor]);

    useEffect(() => {
        loadTable();
        // The key for data storage events might need to be dynamic if you want to listen to specific table IDs
        const dataStorage = window.DataStorage.loadDataStorage("table");
        const key = 'current_table_id'; // Listen for changes to the current table ID
        dataStorage.registerUpdateEventWithKey(key, loadTable);

        return () => {
            // Cleanup logic here if necessary
        };
    }, [loadTable]);

    const handleCellChange = async (rowIndex, colIndex, value) => {
        const updatedTable = await interactor.setCellContent(rowIndex, colIndex, value);
        setTableData(updatedTable);
    };

    const handleRowCountChange = async (e) => {
        const count = parseInt(e.target.value, 10);
        if (!isNaN(count) && count >= 0) {
            const updatedTable = await interactor.setRowCount(count);
            setTableData(updatedTable);
        }
    };

    const handleColCountChange = async (e) => {
        const count = parseInt(e.target.value, 10);
        if (!isNaN(count) && count >= 0) {
            const updatedTable = await interactor.setColumnCount(count);
            setTableData(updatedTable);
        }
    };

    const handleResetTable = async () => {
        const updatedTable = await interactor.resetTable();
        setTableData(updatedTable);
    };    // No need for filtering, as the interactor now handles data directly
    const { headers = [], rows = [] } = tableData || {};

    return (
        <div className="table-page-container">
            <div className="table-header">
                <h2 className="table-title">📊 Data Table</h2>
                <div className="table-controls">
                    <div className="control-group">
                        <label className="control-label">
                            <span className="control-icon">📏</span>
                            Rows
                        </label>
                        <input 
                            type="number" 
                            value={rows.length} 
                            onChange={handleRowCountChange} 
                            min="1" 
                            className="control-input"
                        />
                    </div>
                    <div className="control-group">
                        <label className="control-label">
                            <span className="control-icon">📐</span>
                            Columns
                        </label>
                        <input 
                            type="number" 
                            value={headers.length} 
                            onChange={handleColCountChange} 
                            min="1" 
                            className="control-input"
                        />
                    </div>
                    <button onClick={handleResetTable} className="reset-btn">
                        <span className="btn-icon">🔄</span>
                        New Table
                    </button>
                </div>
            </div>            <div className="table-wrapper">
                <table className="beautiful-table">
                    <thead>
                        <tr>
                            {headers.map((header, colIndex) => (
                                <th key={colIndex} className="table-header-cell">
                                    <div className="header-content">
                                        <span className="column-icon">📋</span>
                                        <span className="header-text">{header.name}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, rowIndex) => (
                            <tr key={rowIndex} className="table-row">
                                {headers.map((_, colIndex) => (
                                    <td 
                                        key={colIndex} 
                                        className="table-cell"
                                        onClick={() => setEditingCell({ rowIndex, colIndex })}
                                    >
                                        {editingCell && editingCell.rowIndex === rowIndex && editingCell.colIndex === colIndex ? (
                                            <input
                                                type="text"
                                                value={row[`col_${colIndex}`] || ''}
                                                onChange={(e) => {
                                                    const updatedRows = [...rows];
                                                    updatedRows[rowIndex][`col_${colIndex}`] = e.target.value;
                                                    setTableData({ ...tableData, rows: updatedRows });
                                                }}
                                                onBlur={() => {
                                                    handleCellChange(rowIndex, colIndex, row[`col_${colIndex}`]);
                                                    setEditingCell(null);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleCellChange(rowIndex, colIndex, row[`col_${colIndex}`]);
                                                        setEditingCell(null);
                                                    }
                                                    if (e.key === 'Escape') {
                                                        setEditingCell(null);
                                                    }
                                                }}
                                                className="cell-input"
                                                autoFocus
                                            />
                                        ) : (
                                            <div className="cell-content">
                                                {row[`col_${colIndex}`] || <span className="empty-cell">Click to edit</span>}
                                            </div>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TablePage;
