const dataStorage = await window.DataStorage.loadDataStorage("table");
const CURRENT_TABLE_ID_KEY = 'current_table_id';

const generateNewId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

const createNewTable = async (rows = 3, cols = 3) => {
    const newTable = {
        id: generateNewId(),
        headers: Array.from({ length: cols }, (_, i) => ({ name: `Column ${i + 1}` })),
        rows: Array.from({ length: rows }, () => {
            const newRow = {};
            for (let i = 0; i < cols; i++) {
                newRow[`col_${i}`] = '';
            }
            return newRow;
        })
    };
    await dataStorage.save(`table_data_${newTable.id}`, newTable);
    await dataStorage.save(CURRENT_TABLE_ID_KEY, newTable.id);
    return newTable;
};

// 获取当前表格数据
const getTable = async () => {
    let tableId = await dataStorage.load(CURRENT_TABLE_ID_KEY);
    if (!tableId) {
        return await createNewTable();
    }
    const table = await dataStorage.load(`table_data_${tableId}`);
    return table || await createNewTable(); // 如果ID存在但数据丢失，则创建新的
};

// 获取行数
const getRowCount = async () => {
    const table = await getTable();
    return table.rows.length;
};

// 获取列数
const getColumnCount = async () => {
    const table = await getTable();
    return table.headers.length;
};

// 设置单元格内容
const setCellContent = async (rowIndex, colIndex, content) => {
    const table = await getTable();
    if (table.rows[rowIndex]) {
        table.rows[rowIndex][`col_${colIndex}`] = content;
        await dataStorage.save(`table_data_${table.id}`, table);
    }
    return table;
};

// 设置行数
const setRowCount = async (count) => {
    const table = await getTable();
    const currentColCount = table.headers.length;
    const currentRowCount = table.rows.length;

    if (count > currentRowCount) {
        for (let i = 0; i < count - currentRowCount; i++) {
            const newRow = {};
            for (let j = 0; j < currentColCount; j++) {
                newRow[`col_${j}`] = '';
            }
            table.rows.push(newRow);
        }
    } else if (count < currentRowCount) {
        table.rows.splice(count);
    }
    await dataStorage.save(`table_data_${table.id}`, table);
    return table;
};

// 设置列数
const setColumnCount = async (count) => {
    const table = await getTable();
    const currentColCount = table.headers.length;

    if (count > currentColCount) {
        for (let i = currentColCount; i < count; i++) {
            table.headers.push({ name: `Column ${i + 1}` });
            table.rows.forEach(row => {
                row[`col_${i}`] = '';
            });
        }
    } else if (count < currentColCount) {
        const deletedHeaders = table.headers.splice(count);
        const deletedColIndices = deletedHeaders.map(h => table.headers.indexOf(h));
        table.rows.forEach(row => {
            for (let i = count; i < currentColCount; i++) {
                delete row[`col_${i}`];
            }
        });
    }
    await dataStorage.save(`table_data_${table.id}`, table);
    return table;
};

// 删除指定行
const deleteRow = async (rowIndex) => {
    const table = await getTable();
    if (rowIndex >= 0 && rowIndex < table.rows.length) {
        table.rows.splice(rowIndex, 1);
        await dataStorage.save(`table_data_${table.id}`, table);
    }
    return table;
};

// 删除指定列
const deleteColumn = async (colIndex) => {
    const table = await getTable();
    if (colIndex >= 0 && colIndex < table.headers.length) {
        table.headers.splice(colIndex, 1);
        table.rows.forEach(row => {
            delete row[`col_${colIndex}`];
            // 为了保持列索引的连续性，需要重命名后续的列
            for (let i = colIndex; i < table.headers.length; i++) {
                if (row[`col_${i + 1}`] !== undefined) {
                    row[`col_${i}`] = row[`col_${i + 1}`];
                    delete row[`col_${i + 1}`];
                }
            }
        });
        await dataStorage.save(`table_data_${table.id}`, table);
    }
    return table;
};

// 重置表格，实际上是创建一个新表格
const resetTable = async (rows = 3, cols = 3) => {
    return await createNewTable(rows, cols);
};


export const getInteractor = () => {
    return {
        getTable,
        getRowCount,
        getColumnCount,
        setCellContent,
        setRowCount,
        setColumnCount,
        resetTable,
        deleteRow,
        deleteColumn,
    };
};

export const getInteractorDescription = () => {
    return `
    --- 表格组件函数 ---
    getTable: (功能：获取当前活动表格的所有数据) 参数列表：无 返回值描述：一个包含 'id', 'headers' 和 'rows' 的表格对象。
    getRowCount: (功能：获取表格的行数) 参数列表：无 返回值描述：一个数字，代表当前行数。
    getColumnCount: (功能：获取表格的列数) 参数列表：无 返回值描述：一个数字，代表当前列数。
    setCellContent: (功能：设置指定单元格的内容) 参数列表：rowIndex(行索引), colIndex(列索引), content(新内容) 返回值描述：更新后的表格对象。
    setRowCount: (功能：设置表格的行数) 参数列表：count(新的行数) 返回值描述：更新后的表格对象。
    setColumnCount: (功能：设置表格的列数) 参数列表：count(新的列数) 返回值描述：更新后的表格对象。
    resetTable: (功能：创建一个新的空表格并设为当前活动表格) 参数列表：rows(可选，行数), cols(可选，列数) 返回值描述：新的表格对象。
    deleteRow: (功能：删除指定行) 参数列表：rowIndex(行索引) 返回值描述：更新后的表格对象。
    deleteColumn: (功能：删除指定列) 参数列表：colIndex(列索引) 返回值描述：更新后的表格对象。
  `;
};
