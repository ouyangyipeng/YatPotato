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
    };

    const handleDeleteRow = async (rowIndex) => {
        const updatedTable = await interactor.deleteRow(rowIndex);
        setTableData(updatedTable);
    };

    const handleDeleteColumn = async (colIndex) => {
        const updatedTable = await interactor.deleteColumn(colIndex);
        setTableData(updatedTable);
    };

    // No need for filtering, as the interactor now handles data directly
    const { headers = [], rows = [] } = tableData || {};

    return (
        <div className="table-page-container">
            <div className="table-controls">
                <label>
                    Rows:
                    <input type="number" value={rows.length} onChange={handleRowCountChange} min="0" />
                </label>
                <label>
                    Columns:
                    <input type="number" value={headers.length} onChange={handleColCountChange} min="0" />
                </label>
                <button onClick={handleResetTable}>Reset Table</button>
            </div>
            <div className="table-wrapper">
                <table className="beautiful-table">
                    <thead>
                        <tr>
                            {headers.map((header, colIndex) => (
                                <th key={colIndex}>
                                    {header.name}
                                    <button className="delete-btn" onClick={() => handleDeleteColumn(colIndex)}>×</button>
                                </th>
                            ))}
                            {/* Optional: Add a header for the delete row button column if needed */}
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {headers.map((_, colIndex) => (
                                    <td key={colIndex} onClick={() => setEditingCell({ rowIndex, colIndex })}>
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
                                                autoFocus
                                            />
                                        ) : (
                                            row[`col_${colIndex}`] || '\u00A0'
                                        )}
                                    </td>
                                ))}
                                <td className="delete-row-cell">
                                    <button className="delete-btn" onClick={() => handleDeleteRow(rowIndex)}>×</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TablePage;
