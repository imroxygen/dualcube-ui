// import { useLocation } from "react-router-dom";

// import Support from "../Support/Support";

// import { useState, useEffect } from "react";
// import { SettingProvider, useSetting } from "../Context/SettingContext";
// import { getTemplateData} from "../Service/templateService";
// import AdminForm, { SettingsType } from "../AdminForm/AdminForm";
// import Tabs from "../Tabs/Tabs";
// import BannerSection from "../Banner/Banner";
// import { getAvialableSettings, getSettingById } from "../../util/settingUtil";

// interface SettingsProps{
//   folderPath:string,
// }

// const Settings: React.FC<SettingsProps> = () => {
//   // Get all settings
//   const [settingsArray, setSettingsArray] = useState<any>([]);

//   useEffect(() => {
//     const fetchSettingsData = async () => {
//         const templateData = await getTemplateData();
//         setSettingsArray(getAvialableSettings(templateData, []));
//     };

//     fetchSettingsData();
// }, []);
//   // Get current browser location
//   const location = new URLSearchParams(useLocation().hash);
//   const currentTab = location.get("subtab") || "";

//   // Update settings when the tab changes
//   const { setting, settingName, setSetting } = useSetting();

//   useEffect(() => {
//     if (settingName !== currentTab) {
//       setSetting(
//         currentTab,
//         (window as any).appLocalizer?.settings_databases_value[currentTab] || {}
//       );
//     }
//   }, [currentTab, settingName, setSetting]);

//   useEffect(() => {
//     (window as any).appLocalizer.settings_databases_value[settingName] = setting;
//   }, [setting]);

//   // Render the dynamic form
//   const getForm = (currentTab: string) => {
//     const { setting, settingName, setSetting } = useSetting();
//     const settingModal = getSettingById(settingsArray, currentTab);
    
//     if (settingName !== currentTab) {
//       setSetting(
//         currentTab,
//         (window as any).appLocalizer?.settings_databases_value[currentTab] || {}
//       );
//     }

//     useEffect(() => {
//       (window as any).appLocalizer.settings_databases_value[settingName] = setting;
//     }, [setting]);

//     // Render special components
//     if (currentTab === "faq") {
//       return <Support faqs={[]} plugin_name="MVX" subheading="" videoUrl="#"/>;
//     }

//     return (
//       <>
//         {settingName === currentTab ? (
//           <AdminForm settings={settingModal as SettingsType} proSetting={(window as any).appLocalizer.pro_settings_list} />
//         ) : (
//           <>Loading</>
//         )}
//       </>
//     );
//   };

//   return (
//     <SettingProvider>
//       <Tabs
//         tabData={settingsArray}
//         currentTab={currentTab}
//         getForm={getForm}
//         BannerSection={()=><BannerSection is_pro={false} />}
//         prepareUrl={(subTab) => `?page=plugin-elements#&tab=settings&subtab=${subTab}`}
//         brandImageUrl="#"
//         brandImageSmallUrl="#"
//         is_pro={false}
//       />
//     </SettingProvider>
//   );
// };

// export default Settings;