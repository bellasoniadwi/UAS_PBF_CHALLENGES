import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'Data Master',
            items: [
                { label: 'Employee', icon: 'pi pi-fw pi-id-card', to: '/uikit/employee' },
                { label: 'Member', icon: 'pi pi-fw pi-user', to: '/uikit/member' },
                { label: 'Product', icon: 'pi pi-fw pi-list', to: '/uikit/product' },
                { label: 'Transaction', icon: 'pi pi-fw pi-bookmark', to: '/uikit/transaction' },
            ]
        },
        
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
