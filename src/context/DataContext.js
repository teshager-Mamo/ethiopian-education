// src/context/DataContext.js
import React, { createContext, useState } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [dataType, setDataType] = useState(null);

  return (
    <DataContext.Provider value={{ data, setData, dataType, setDataType }}>
      {children}
    </DataContext.Provider>
  );
};