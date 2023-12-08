import { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

export const useFilterContext = () => useContext(FilterContext);

export const FilterProvider = ({ children }) => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedPlantTypes, setSelectedPlantTypes] = useState([]);
    const [dateFilter, setDateFilter] = useState('all');

    return (
        <FilterContext.Provider value={{ selectedCategories, setSelectedCategories, selectedPlantTypes, setSelectedPlantTypes, dateFilter, setDateFilter }}>
            {children}
        </FilterContext.Provider>
    );
};