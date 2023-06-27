import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="layout-footer">
            <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Logo" height="20" className="mr-2" />
            Tugas Besar Pemrograman Berbasis Objek ini dibuat oleh
            <span className="font-medium ml-2">Anjani - Bella</span>
        </div>
    );
};

export default AppFooter;
