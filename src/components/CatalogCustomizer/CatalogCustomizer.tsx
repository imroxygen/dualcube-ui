import React, { useState, useEffect } from 'react';
import ReactDragListView from "react-drag-listview";
import './CatalogCustomizer.scss';
import SubTabSection from '../SubTabSection/SubTabSection';

export interface CatalogCustomizerProps {
  onChange: (key: string, value: any) => void;
  proSetting?: boolean;
  setting: Record<string, any>;
}

interface MenuItem {
  name: string;
  id: string;
  icon: string;
  link?:string;
}

interface DragableItem {
  id: string;
  content?: any;
  defaultPosition: number;
  dragable: boolean;
}

const CatalogCustomizer: React.FC<CatalogCustomizerProps> = ({ onChange, proSetting, setting }) => {
  const [buttonSetting, setButtonSetting] = useState<Record<string, any>>({});
  const [localSetting, setLocalSetting] = useState(setting);
  const [menu, setMenu] = useState<MenuItem[]>([
    { name: "Enquiry", id: 'enquiry', icon: 'adminLib-inquiry' },
    { name: "Quote", id: 'quote', icon: 'adminLib-price-quote-icon' },
    { name: "Catalog", id: 'catalog', icon: 'adminLib-catalog' },
  ]);
  const [currentTab, setCurrentTab] = useState<MenuItem>(menu[0]);
  const [dragableItems, setDragableItems] = useState<DragableItem[]>([
    {
      id: 'price_section',
      content: () => {
        const [hideProductPrice, setHideProductPrice] = useState(localSetting['hide_product_price']);
        return (
          <div className='price-section toggle-visibility'>
            <div
              onClick={() => {
                setHideProductPrice(!hideProductPrice);
                setSetting('hide_product_price', !hideProductPrice);
              }}
              className='button-visibility'
            >
              <i className='admin-font adminLib-support'></i>
            </div>
            <p className='product-price' style={{ opacity: hideProductPrice ? "0.3" : "1" }}><span className='strikethrough'>$20.00</span> $18.00</p>
          </div>
        );
      },
      defaultPosition: 0,
      dragable: false,
    },
    {
      id: 'product_description',
      content: () => {
        const [hideProductDesc, setHideProductDesc] = useState(localSetting['hide_product_desc']);
        return (
          <div className='description-section toggle-visibility'>
            <div
              onClick={() => {
                setHideProductDesc(!hideProductDesc);
                setSetting('hide_product_desc', !hideProductDesc);
              }}
              className='button-visibility'
            >
              <i className='admin-font adminLib-support'></i>
            </div>
            <p className='product-description' style={{ opacity: hideProductDesc ? "0.3" : "1" }}>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>
          </div>
        );
      },
      defaultPosition: 1,
      dragable: false,
    },
  ]);

  const setSetting = (key: string, value: any) => {
    setLocalSetting({ ...localSetting, [key]: value });
    onChange(key, value);
  };

  const handleSubMenuChange = (newTab: MenuItem) => {
    if (currentTab.id === newTab.id) return;
    setCurrentTab({ ...newTab });
    let mainWrapper = document.getElementById('catelog-customizer-main-wrapper');
    window.scrollTo(0, 0);
    if (mainWrapper) {
      mainWrapper.classList.add(newTab.id, 'change-tab');
      setTimeout(() => {
        mainWrapper.classList.remove('change-tab');
        setTimeout(() => {
          mainWrapper.classList.remove(newTab.id);
        }, 300);
      }, 500);
    }
  };

  const Sample_Product:string = "#";

  return (
    <>
      <SubTabSection
        menuitem={menu}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        setting={localSetting}
        // onChange={onChange}
      />
      <main className='catelog-customizer-main-wrapper' id='catelog-customizer-main-wrapper'>
        <section className='catelog-customizer'>
          <div className='product-img'>
            <img src={Sample_Product} alt="Sample Product" />
          </div>
          <div className='product-data'>
            <h1 className='product-name'>Sample Product</h1>
            <div className='drag-drop-component'>
              <ReactDragListView
                nodeSelector=".shop-page-draggable"
                handleSelector=".should-move"
                lineClassName="dragLine"
                onDragEnd={(fromIndex, toIndex) => {}}
              >
                {dragableItems.map((item) => (
                  <div key={item.id} className='shop-page-draggable'>
                    {item.content && <item.content />}
                  </div>
                ))}
              </ReactDragListView>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default CatalogCustomizer;
